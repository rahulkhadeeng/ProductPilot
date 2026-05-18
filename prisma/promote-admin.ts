import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    throw new Error("Usage: npm run promote-admin -- user@example.com");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
    },
  });

  if (!user) {
    throw new Error(
      `No user found for ${email}. Sign in with this email first, then rerun the command.`
    );
  }

  if (user.isAdmin) {
    console.log(`${user.email} is already an admin.`);
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { isAdmin: true },
    select: {
      email: true,
      name: true,
      isAdmin: true,
    },
  });

  console.log(
    `Promoted ${updatedUser.email} (${updatedUser.name ?? "Unnamed user"}) to admin.`
  );
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
