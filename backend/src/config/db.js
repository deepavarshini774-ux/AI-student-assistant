import { PrismaClient } from "@prisma/client";

// Single shared Prisma client instance for the whole app.
const prisma = new PrismaClient();

export default prisma;
