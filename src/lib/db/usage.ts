import { Prisma } from "@/generated/prisma/client";
import "server-only"
import { prisma } from "./prisma";

export async function saveUsage(data: Prisma.UsageCreateInput) {
    return prisma.usage.create({
        data: data,
        select: {
            id: true
        }
    })
}