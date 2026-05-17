import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  });

  const categories = [
    "Technology",
    "Design",
    "Marketing",
    "Productivity",
    "Finance",
    "Development",
    "AI",
  ];

  const categoryRecords = [];
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryRecords.push(cat);
  }

  const dummyProducts = [
    {
      name: "SuperApp",
      slug: "superapp",
      headline: "The best app ever",
      description: "SuperApp is a revolutionary tool that helps you do everything faster.",
      logo: "https://github.com/shadcn.png",
      releaseDate: "2026-05-17",
      website: "https://superapp.com",
      twitter: "https://twitter.com/superapp",
      instagram: "https://instagram.com/superapp",
      status: "ACTIVE" as any,
      rank: 10,
    },
    {
      name: "DesignPro",
      slug: "designpro",
      headline: "Design like a pro",
      description: "A tool that brings pro design features to the browser.",
      logo: "https://github.com/shadcn.png",
      releaseDate: "2026-05-18",
      website: "https://designpro.com",
      twitter: "https://twitter.com/designpro",
      instagram: "https://instagram.com/designpro",
      status: "ACTIVE" as any,
      rank: 25,
    },
  ];

  for (const p of dummyProducts) {
    const catIds =
      p.name === "SuperApp"
        ? [categoryRecords[0].id, categoryRecords[6].id]
        : [categoryRecords[1].id];

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        userId: user.id,
        categories: {
          connect: catIds.map((id) => ({ id })),
        },
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
