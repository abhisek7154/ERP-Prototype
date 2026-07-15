import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

import { prisma } from "~/lib/prisma";

import type { SetupInput } from "./setup.validation";

async function getDatabaseState() {
  const schoolCount = await prisma.school.count();
  const userCount = await prisma.user.count();

  return {
    schoolCount,
    userCount,
  };
}

export async function canRunSetup() {
  const { schoolCount, userCount } = await getDatabaseState();

  // Fresh installation
  if (schoolCount === 0 && userCount === 0) {
    return true;
  }

  // Recovery (school exists but admin deleted)
  if (schoolCount === 1 && userCount === 0) {
    return true;
  }

  // Already initialized
  if (schoolCount === 1 && userCount > 0) {
    return false;
  }

  throw new Error(
    `Invalid database state (schools=${schoolCount}, users=${userCount}).`
  );
}

export async function initializeSystem(data: SetupInput) {
  return await prisma.$transaction(async (tx) => {
    const userCount = await tx.user.count();

    if (userCount > 0) {
      throw new Error("System has already been initialized.");
    }
        // Reuse existing school if it exists
        let school = await tx.school.findFirst();

        // Fresh installation
        if (!school) {
        school = await tx.school.create({
            data: {
            name: data.schoolName,
            code: data.schoolCode,
            },
        });
        }
        // Recovery mode
        else {
        if (
            school.code !== data.schoolCode ||
            school.name.trim().toLowerCase() !==
            data.schoolName.trim().toLowerCase()
        ) {
            throw new Error(
            `A school already exists (${school.name} - ${school.code}). Please use the existing school information.`
            );
        }
        }

    const existingUser = await tx.user.findUnique({
      where: {
        email: data.adminEmail,
      },
    });

    if (existingUser) {
      throw new Error("Administrator email already exists.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

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