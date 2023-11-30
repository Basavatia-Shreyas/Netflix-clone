import { PrismaClient } from "@prisma/client";

// This creates a global file so that we don't make a bunch of copies of the pisma client due to hot reloading
const client = global.prismadb || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prismadb = client;

export default client;