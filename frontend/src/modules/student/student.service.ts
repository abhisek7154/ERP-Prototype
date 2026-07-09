import { prisma } from "~/lib/prisma";

interface GetStudentsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function getStudents({
  page = 1,
  pageSize = 20,
  search = "",
}: GetStudentsOptions) {
  const where = search
    ? {
        OR: [
          {
            registrationNumber: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            course: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const total = await prisma.student.count({
    where,
  });

  const students = await prisma.student.findMany({
    where,

    orderBy: {
      createdAt: "desc",
    },

    skip: (page - 1) * pageSize,

    take: pageSize,

    select: {
      id: true,
      registrationNumber: true,
      name: true,
      fatherName: true,
      course: true,
      status: true,
    },
  });

  return {
    students,
    total,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}