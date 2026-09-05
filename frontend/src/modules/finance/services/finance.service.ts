import {
  buildFeeLedger,
  getMissingFeeLedgerEntries,
} from "@/modules/admission/admission.service";

import * as financeRepository from "./repository/finance.repository";

import type {
  CreateFeePaymentInput,
  UpdateFeePaymentInput,
  FinanceQuery,
} from "./finance.schema";

export const INCOMPLETE_FINANCIAL_STATE_MESSAGE =
  "Admission financial state is incomplete. Please repair the fee ledger before collecting payment.";

export const INVALID_PAYMENT_ITEMS_MESSAGE =
  "Selected fee items are invalid for this admission.";

/* -------------------------------------------------------------------------- */
/*                              Get Payments                                  */
/* -------------------------------------------------------------------------- */

export async function getFeePayments(
  schoolId: string,
  query: FinanceQuery,
) {
  return financeRepository.getFeePayments(schoolId, query);
}

/* -------------------------------------------------------------------------- */
/*                              Create Payment                                */
/* -------------------------------------------------------------------------- */

export async function createPayment(
  schoolId: string,
  data: CreateFeePaymentInput,
) {
  const admission =
    await financeRepository.getAdmissionPaymentContext(
      schoolId,
      data.admissionId,
    );

  if (!admission) {
    throw new Error("Admission not found.");
  }

  const expectedLedger = buildFeeLedger(
    admission.id,
    admission.course,
    admission.admissionDate,
  );

  if (
    getMissingFeeLedgerEntries(
      admission.feeLedger,
      expectedLedger.map((entry) => ({
        feeScheduleId:
          entry.feeScheduleId,
        title: entry.title,
        installmentNumber:
          entry.installmentNumber,
      })),
    ).length > 0
  ) {
    throw new Error(
      INCOMPLETE_FINANCIAL_STATE_MESSAGE,
    );
  }

  const selectedLedgerEntries =
    data.paymentItems.map((item) =>
      admission.feeLedger.find(
        (ledger) =>
          ledger.feeScheduleId ===
            item.feeScheduleId &&
          ledger.title === item.title,
      ),
    );

  if (
    selectedLedgerEntries.some(
      (ledger) => !ledger,
    )
  ) {
    throw new Error(
      INVALID_PAYMENT_ITEMS_MESSAGE,
    );
  }

  const calculatedTotal =
    data.paymentItems.reduce(
      (sum, item) =>
        sum + item.amount,
      0,
    );

  if (
    calculatedTotal !==
    data.amountPaid
  ) {
    throw new Error(
      "Amount paid does not match selected fee items.",
    );
  }

  const receiptNumber =
    data.receiptNumber ??
    `RCPT-${new Date().getFullYear()}-${Date.now()}`;

  return financeRepository.createFeePayment({
    ...data,
    receiptNumber,
  });
}

/* -------------------------------------------------------------------------- */
/*                              Update Payment                                */
/* -------------------------------------------------------------------------- */

export async function updateFeePayment(
  id: string,
  schoolId: string,
  data: UpdateFeePaymentInput,
) {
  return financeRepository.updateFeePayment(
    id,
    schoolId,
    data,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Delete Payment                                */
/* -------------------------------------------------------------------------- */

export async function deleteFeePayment(
  id: string,
  schoolId: string,
) {
  return financeRepository.deleteFeePayment(
    id,
    schoolId,
  );
}

/* -------------------------------------------------------------------------- */
/*                              Get Payment                                   */
/* -------------------------------------------------------------------------- */

export async function getPaymentById(
  schoolId: string,
  id: string,
) {
  return financeRepository.getPaymentById(
    schoolId,
    id,
  );
}
/* -------------------------------------------------------------------------- */
/*                         Payment History                                    */
/* -------------------------------------------------------------------------- */

export async function getPaymentHistory(
  schoolId: string,
  admissionId: string,
) {
  return financeRepository.getPaymentHistory(
    schoolId,
    admissionId,
  );
}
/* -------------------------------------------------------------------------- */
/*                             Payment Receipt                                */
/* -------------------------------------------------------------------------- */

export async function getPaymentReceipt(
  schoolId: string,
  paymentId: string,
) {
  return financeRepository.getPaymentReceipt(
    schoolId,
    paymentId,
  );
}
