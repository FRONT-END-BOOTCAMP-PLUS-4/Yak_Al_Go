import { PrismaClient } from '@prisma/generated';
import { withAccelerate } from '@prisma/extension-accelerate';

function createPrismaClient() {
  return new PrismaClient().$extends(withAccelerate());
}

type Prisma = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: Prisma;
};

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;