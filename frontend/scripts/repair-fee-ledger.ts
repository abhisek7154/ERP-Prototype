import { prisma } from "../src/lib/prisma";
import { ensureFeeLedger } from "../src/modules/admission/admission.service";

async function repairAdmissionFeeLedger(
  admissionId: string,
) {
  return prisma.$transaction(async (tx) => {
    const admission =
      await tx.admission.findUnique({
        where: {
          id: admissionId,
        },

        include: {
          course: {
            include: {
              feeSchedules: {
                where: {
                  isActive: true,
                },

                orderBy: {
                  dueOrder: "asc",
                },
              },
            },
          },

          feeLedger: {
            select: {
              id: true,
            },
          },

          feePayments: {
            select: {
              id: true,
            },
          },
        },
      });

    if (!admission) {
      throw new Error(
        `Admission not found: ${admissionId}`,
      );
    }

    const beforeCount =
      admission.feeLedger.length;

    await ensureFeeLedger(
      tx,
      admission.id,
      admission.course,
      admission.admissionDate,
    );

    const afterCount =
      await tx.feeLedger.count({
        where: {
          admissionId,
        },
      });

    return {
      admissionId,
      beforeCount,
      afterCount,
      paymentCount:
        admission.feePayments.length,
    };
  });
}

async function main() {
  const admissionIds =
    process.argv
      .slice(2)
      .map((value) => value.trim())
      .filter(Boolean);

  if (admissionIds.length === 0) {
    throw new Error(
      "Provide at least one admission ID.",
    );
  }

  for (const admissionId of admissionIds) {
    const result =
      await repairAdmissionFeeLedger(
        admissionId,
      );

    console.log(
      JSON.stringify(result),
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
