import { prisma } from "~/lib/prisma";
import type { CreateStudentInput } from "./student.schema";

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

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      registrationNumber: true,
      name: true,
      fatherName: true,
      status: true,
      course: true,
      dateOfBirth: true,
      dateOfAdmission: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createStudent(
  schoolId: string,
  data: CreateStudentInput
) {
  const existingStudent = await prisma.student.findFirst({
    where: {
      schoolId,
      registrationNumber: data.registrationNumber,
    },
  });

  if (existingStudent) {
    throw new Error("Registration number already exists.");
  }

  return prisma.student.create({
    data: {
      schoolId,
      registrationNumber: data.registrationNumber,
      name: data.name,
      fatherName: data.fatherName || null,
      course: data.course,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      dateOfAdmission: data.dateOfAdmission
        ? new Date(data.dateOfAdmission)
        : null,
      status: data.status,
    },
  });
}