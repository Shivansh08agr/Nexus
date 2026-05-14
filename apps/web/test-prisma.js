const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log('Prisma works in Next.js! Users:', users.length);
}

main().catch(console.error);
