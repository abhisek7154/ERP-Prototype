import { prisma } from "~/lib/prisma";

export async function getStudents(search?: string) {
  return prisma.student.findMany({
    where: search
      ? {
          OR: [
            {
              registrationNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              course: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      registrationNumber: true,
      name: true,
      fatherName: true,
      course: true,
      status: true,
    },
  });
}