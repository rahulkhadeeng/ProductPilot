import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth/auth";
import { getOpenAIClient } from "@/lib/ai/openai";
import { PRODUCT_LIMITS } from "@/lib/product-validation";

const PRODUCT_ASSISTANT_MODEL = "gpt-5-mini";

const availableCategories = [
  "Media",
  "Blockchain",
  "Cloud",
  "Commerce",
  "Cybersecurity",
  "Data",
  "Design",
  "Photography",
  "Ecommerce",
  "Education",
  "Entertainment",
  "Video",
  "Finance",
  "Social",
  "Health",
  "Fitness",
  "Marketing",
  "Music",
  "Productivity",
  "Engineering",
  "Sales",
  "Sports",
  "Travel",
  "Bootstrapped",
  "Art",
  "Analytics",
  "SaaS",
  "Artificial Intelligence",
] as const;

const productAssistantRequestSchema = z.object({
  mode: z.enum(["headline", "description", "categories", "full"]),
  name: z
    .string()
    .trim()
    .min(4, "Please enter at least 4 characters for the product name.")
    .max(PRODUCT_LIMITS.nameMax, "Product name is too long."),
  headline: z
    .string()
    .trim()
    .max(PRODUCT_LIMITS.headlineMax, "Headline is too long.")
    .optional()
    .default(""),
  description: z
    .string()
    .trim()
    .max(PRODUCT_LIMITS.descriptionMax, "Description is too long.")
    .optional()
    .default(""),
  website: z.string().trim().max(200, "Website URL is too long.").optional(),
  categories: z
    .array(z.enum(availableCategories))
    .max(PRODUCT_LIMITS.categoryMax, "You can select up to 3 categories.")
    .optional()
    .default([]),
});

const productAssistantResponseSchema = z.object({
  headline: z.string(),
  description: z.string(),
  categories: z.array(z.enum(availableCategories)),
  tips: z.array(z.string()),
});

function clip(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const parsed = productAssistantRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Please check the product assistant input.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { mode, name, headline, description, website, categories } =
      parsed.data;

    const response = await getOpenAIClient().responses.parse({
      model: PRODUCT_ASSISTANT_MODEL,
      input: [
        {
          role: "system",
          content: [
            "You are Product Pilot's launch copy assistant.",
            "Write clear, specific, professional product launch copy.",
            "Avoid hype, emojis, markdown, quotes, and unverifiable claims.",
            `Headline must be ${PRODUCT_LIMITS.headlineMax} characters or fewer.`,
            `Description must be ${PRODUCT_LIMITS.descriptionMax} characters or fewer.`,
            "Suggest only categories from the allowed category list.",
            "Return useful values for every response field even when the requested mode focuses on one field.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            requestedMode: mode,
            product: {
              name,
              headline,
              description,
              website: website ?? "",
              selectedCategories: categories,
            },
            allowedCategories: availableCategories,
          }),
        },
      ],
      text: {
        format: zodTextFormat(
          productAssistantResponseSchema,
          "product_launch_assistant"
        ),
      },
    });

    if (!response.output_parsed) {
      return NextResponse.json(
        { error: "The AI assistant could not generate a valid response." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      headline: clip(response.output_parsed.headline, PRODUCT_LIMITS.headlineMax),
      description: clip(
        response.output_parsed.description,
        PRODUCT_LIMITS.descriptionMax
      ),
      categories: response.output_parsed.categories.slice(
        0,
        PRODUCT_LIMITS.categoryMax
      ),
      tips: response.output_parsed.tips.map((tip) => clip(tip, 140)).slice(0, 4),
    });
  } catch (error) {
    console.error("Error generating product assistant response:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate product assistant response.",
      },
      { status: 500 }
    );
  }
}
