import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

import { prisma } from "~/lib/prisma";

import type { SetupInput } from "./setup.validation";

export async function isSetupComplete() {
  const userCount = await prisma.user.count();

  return userCount > 0;
}

export async function canRunSetup() {
  return !(await isSetupComplete());
}

export async function initializeSystem(data: SetupInput) {
  return await prisma.$transaction(async (tx) => {
    // Check if a school already exists
    let school = await tx.school.findFirst();

    // Create school only if none exists
    if (!school) {
      school = await tx.school.create({
        data: {
          name: data.schoolName,
          code: data.schoolCode,
        },
      });
    }

    // Prevent duplicate admin email
    const existingUser = await tx.user.findUnique({
      where: {
        email: data.adminEmail,
      },
    });

    if (existingUser) {
      throw new Error("Administrator email already exists.");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create first administrator
    const admin = await tx.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        schoolId: school.id,
        isActive: true,
      },
    });

    return {
      school,
      admin,
    };
  });
}