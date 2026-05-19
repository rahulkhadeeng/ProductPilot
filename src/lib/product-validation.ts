import { z } from "zod";

export const PRODUCT_LIMITS = {
  nameMax: 30,
  headlineMax: 70,
  descriptionMax: 300,
  categoryMax: 3,
  imageMax: 5,
} as const;

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => value || "")
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid http or https URL." }
  );

export const productSubmissionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(4, "Please enter at least 4 characters for the product name.")
      .max(PRODUCT_LIMITS.nameMax, "Product name is too long."),
    slug: z
      .string()
      .trim()
      .min(3, "Please enter a valid product slug.")
      .max(60, "Product slug is too long.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens."
      ),
    headline: z
      .string()
      .trim()
      .min(10, "Please enter at least 10 characters for the headline.")
      .max(PRODUCT_LIMITS.headlineMax, "Headline is too long."),
    description: z
      .string()
      .trim()
      .min(20, "Please enter at least 20 characters for the description.")
      .max(PRODUCT_LIMITS.descriptionMax, "Description is too long."),
    logo: z.string().trim().url("Please upload a valid product logo."),
    releaseDate: z.string().trim().min(1, "Please select a release date."),
    website: optionalUrl,
    twitter: optionalUrl,
    instagram: optionalUrl,
    images: z
      .array(z.string().url("Uploaded product images must be valid URLs."))
      .min(1, "Please upload at least 1 product image.")
      .max(PRODUCT_LIMITS.imageMax, "You can upload up to 5 product images."),
    category: z
      .array(z.string().trim().min(1))
      .min(1, "Please select at least 1 category for the product.")
      .max(PRODUCT_LIMITS.categoryMax, "You can select up to 3 categories."),
  })
  .refine(
    ({ website, twitter, instagram }) => Boolean(website || twitter || instagram),
    {
      message: "Please enter at least one link for the product.",
      path: ["website"],
    }
  );

export type ProductSubmissionInput = z.input<typeof productSubmissionSchema>;
export type ProductSubmission = z.output<typeof productSubmissionSchema>;

export function makeProductSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function firstProductValidationError(
  input: ProductSubmissionInput
): string | null {
  const result = productSubmissionSchema.safeParse(input);

  if (result.success) {
    return null;
  }

  return result.error.issues[0]?.message ?? "Please check the product details.";
}
