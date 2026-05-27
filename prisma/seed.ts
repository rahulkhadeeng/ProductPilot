import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Productivity",
  "Finance",
  "Development",
  "AI",
  "Analytics",
  "Collaboration",
];

const sampleOwner = {
  email: "launchteam@productpilot.dev",
  name: "Product Pilot Launch Team",
  image: "https://avatars.githubusercontent.com/u/1?v=4",
};

const communityUsers = [
  {
    email: "maya.builder@example.com",
    name: "Maya Builder",
    image: "https://avatars.githubusercontent.com/u/2?v=4",
  },
  {
    email: "ravi.growth@example.com",
    name: "Ravi Growth",
    image: "https://avatars.githubusercontent.com/u/3?v=4",
  },
  {
    email: "nora.design@example.com",
    name: "Nora Design",
    image: "https://avatars.githubusercontent.com/u/4?v=4",
  },
  {
    email: "eli.ops@example.com",
    name: "Eli Ops",
    image: "https://avatars.githubusercontent.com/u/5?v=4",
  },
];

const products = [
  {
    name: "Aurora Launch",
    slug: "aurora-launch",
    headline: "Plan clean product launches without spreadsheet chaos",
    description:
      "Aurora Launch turns positioning, launch tasks, review gates, and channel calendars into one calm workspace for small teams preparing a release.",
    logo: "/sample-products/aurora-logo.svg",
    images: ["/sample-products/aurora-shot.svg"],
    releaseDate: "2026-05-21",
    website: "https://example.com/aurora-launch",
    twitter: "https://twitter.com/auroralaunch",
    instagram: "https://instagram.com/auroralaunch",
    rank: 96,
    categoryNames: ["Productivity", "Marketing", "Collaboration"],
    comments: [
      "The positioning checklist is exactly what early launch teams usually forget.",
      "Love that approvals and launch assets live in the same place.",
    ],
    upvoteEmails: [
      "maya.builder@example.com",
      "ravi.growth@example.com",
      "nora.design@example.com",
      "eli.ops@example.com",
    ],
  },
  {
    name: "Beacon CRM",
    slug: "beacon-crm",
    headline: "A lightweight customer workspace for indie SaaS founders",
    description:
      "Beacon CRM helps founders track trials, onboarding signals, renewal risk, and high-intent conversations without adopting an enterprise sales stack.",
    logo: "/sample-products/beacon-logo.svg",
    images: ["/sample-products/beacon-shot.svg"],
    releaseDate: "2026-05-22",
    website: "https://example.com/beacon-crm",
    twitter: "https://twitter.com/beaconcrm",
    instagram: "https://instagram.com/beaconcrm",
    rank: 88,
    categoryNames: ["Marketing", "Analytics", "Productivity"],
    comments: [
      "The founder-friendly CRM angle feels refreshing.",
      "Trial health cards would be useful for my tiny support team.",
    ],
    upvoteEmails: [
      "maya.builder@example.com",
      "ravi.growth@example.com",
      "eli.ops@example.com",
    ],
  },
  {
    name: "CanvasKit",
    slug: "canvaskit",
    headline: "Brand-ready social visuals generated from reusable blocks",
    description:
      "CanvasKit lets teams assemble launch banners, changelog cards, and carousel posts from reusable brand blocks that stay consistent across every channel.",
    logo: "/sample-products/canvas-logo.svg",
    images: ["/sample-products/canvas-shot.svg"],
    releaseDate: "2026-05-23",
    website: "https://example.com/canvaskit",
    twitter: "https://twitter.com/canvaskitapp",
    instagram: "https://instagram.com/canvaskitapp",
    rank: 82,
    categoryNames: ["Design", "Marketing", "AI"],
    comments: [
      "This would save so much time on release-week creative work.",
      "Reusable visual blocks are a great fit for teams without a designer on call.",
    ],
    upvoteEmails: [
      "ravi.growth@example.com",
      "nora.design@example.com",
      "eli.ops@example.com",
    ],
  },
  {
    name: "Ledgerly",
    slug: "ledgerly",
    headline: "Simple revenue, expense, and runway tracking for makers",
    description:
      "Ledgerly connects product income, contractor costs, subscriptions, and runway forecasts into a focused dashboard for bootstrapped software teams.",
    logo: "/sample-products/ledger-logo.svg",
    images: ["/sample-products/ledger-shot.svg"],
    releaseDate: "2026-05-24",
    website: "https://example.com/ledgerly",
    twitter: "https://twitter.com/ledgerlyhq",
    instagram: "https://instagram.com/ledgerlyhq",
    rank: 76,
    categoryNames: ["Finance", "Analytics", "Productivity"],
    comments: [
      "Runway tracking beside product revenue is a smart pairing.",
      "The dashboard looks focused enough for non-finance founders.",
    ],
    upvoteEmails: ["maya.builder@example.com", "nora.design@example.com"],
  },
  {
    name: "PulseDesk",
    slug: "pulsedesk",
    headline: "Convert customer feedback into prioritized product bets",
    description:
      "PulseDesk groups feedback from support, sales, and community notes, then highlights the product bets with the strongest demand signals.",
    logo: "/sample-products/pulse-logo.svg",
    images: ["/sample-products/pulse-shot.svg"],
    releaseDate: "2026-05-25",
    website: "https://example.com/pulsedesk",
    twitter: "https://twitter.com/pulsedesk",
    instagram: "https://instagram.com/pulsedesk",
    rank: 70,
    categoryNames: ["AI", "Analytics", "Development"],
    comments: [
      "Demand signal grouping is the missing layer in most feedback boards.",
      "This could make roadmap debates much more grounded.",
    ],
    upvoteEmails: ["ravi.growth@example.com", "eli.ops@example.com"],
  },
];

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: sampleOwner.email },
    update: sampleOwner,
    create: sampleOwner,
  });

  const reviewers = await Promise.all(
    communityUsers.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      })
    )
  );

  const reviewerByEmail = new Map(reviewers.map((user) => [user.email, user]));

  await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  for (const product of products) {
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        headline: product.headline,
        description: product.description,
        logo: product.logo,
        releaseDate: product.releaseDate,
        website: product.website,
        twitter: product.twitter,
        instagram: product.instagram,
        status: Status.ACTIVE,
        rank: product.rank,
        userId: owner.id,
        categories: {
          set: [],
          connectOrCreate: product.categoryNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        images: {
          deleteMany: {},
          create: product.images.map((url) => ({ url })),
        },
      },
      create: {
        name: product.name,
        slug: product.slug,
        headline: product.headline,
        description: product.description,
        logo: product.logo,
        releaseDate: product.releaseDate,
        website: product.website,
        twitter: product.twitter,
        instagram: product.instagram,
        status: Status.ACTIVE,
        rank: product.rank,
        userId: owner.id,
        categories: {
          connectOrCreate: product.categoryNames.map((name) => ({
            where: { name },
            create: { name },
          })),
        },
        images: {
          create: product.images.map((url) => ({ url })),
        },
      },
    });

    await prisma.comment.deleteMany({
      where: { productId: savedProduct.id },
    });

    await prisma.upvote.deleteMany({
      where: { productId: savedProduct.id },
    });

    await prisma.comment.createMany({
      data: product.comments.map((body, index) => {
        const user = reviewers[index % reviewers.length];

        return {
          productId: savedProduct.id,
          userId: user.id,
          body,
          profilePicture: user.image ?? "",
        };
      }),
    });

    await prisma.upvote.createMany({
      data: product.upvoteEmails
        .map((email) => reviewerByEmail.get(email))
        .filter((user): user is NonNullable<typeof user> => Boolean(user))
        .map((user) => ({
          productId: savedProduct.id,
          userId: user.id,
        })),
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${products.length} active sample products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
