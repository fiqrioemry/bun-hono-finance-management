import { hashPassword } from "@/utils/generate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hashPassword("123456");

  const user1 = await prisma.user.create({
    data: {
      email: "users1@example.com",
      name: "User 1",
      hashedPassword,
      image: "https://placehold.co/100x100",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "users2@example.com",
      name: "User 2",
      hashedPassword,
      image: "https://placehold.co/100x100",
    },
  });

  const expenseCategories: string[] = [
    "Shopping",
    "Entertainment",
    "Health",
    "Food",
    "Billing",
    "Transportation",
  ];

  expenseCategories.forEach(async (category) => {
    await prisma.category.create({
      data: {
        name: category,
        type: "EXPENSE",
      },
    });
  });

  const incomeCategories: string[] = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
  ];

  incomeCategories.forEach(async (category) => {
    await prisma.category.create({
      data: {
        name: category,
        type: "INCOME",
      },
    });
  });
}

main()
  .then(async () => {
    console.log(" Seeding completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(" Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
