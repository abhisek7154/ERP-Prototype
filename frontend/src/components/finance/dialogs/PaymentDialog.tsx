"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AdmissionCombobox } from "@/components/admission/admission-combobox";

import StudentPaymentCard, {
  StudentPaymentAdmission,
} from "../payment/StudentPaymentCard";

import FeeSchedule, {
  FeeItem,
} from "../payment/FeeSchedule";

import PaymentSummary from "../payment/PaymentSummary";

import PaymentDetails, {
  PaymentDetailsForm,
} from "../payment/PaymentDetails";

import ReceiptActions from "../payment/ReceiptActions";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admission?: StudentPaymentAdmission | null;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function PaymentDialog({
  open,
  onOpenChange,
  admission: initialAdmission = null,
}: PaymentDialogProps) {
  /* ---------------------------------------------------------------------- */
  /* Admission                                                               */
  /* ---------------------------------------------------------------------- */

  const [admission, setAdmission] =
    useState<StudentPaymentAdmission | null>(initialAdmission);

  /* ---------------------------------------------------------------------- */
  /* Selected Fee Items                                                      */
  /* ---------------------------------------------------------------------- */

  const [selectedItems, setSelectedItems] =
    useState<FeeItem[]>([]);

  /* ---------------------------------------------------------------------- */
  /* Payment State                                                            */
  /* ---------------------------------------------------------------------- */

  const [loading, setLoading] = useState(false);

  const [paymentId, setPaymentId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Form                                                                    */
  /* ---------------------------------------------------------------------- */

  const form = useForm<PaymentDetailsForm>({
    defaultValues: {
      paymentMethod: "CASH",
      collectedBy: "",
      transactionId: "",
      remarks: "",
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Course Fee Values                                                       */
  /* ---------------------------------------------------------------------- */

  const admissionFee = Number(
    admission?.course?.admissionFee ?? 0,
  );

  const monthlyFee = Number(
    admission?.course?.monthlyFee ?? 0,
  );

  const installmentCount = Number(
    admission?.course?.installmentCount ??
      admission?.course?.durationMonths ??
      0,
  );

  const certificateFee = Number(
    admission?.course?.certificateFee ?? 0,
  );

  const courseFee =
    monthlyFee * installmentCount +
    certificateFee;

  /* ---------------------------------------------------------------------- */
  /* Selected Amount                                                         */
  /* ---------------------------------------------------------------------- */

  const selectedToday = selectedItems.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  /* ---------------------------------------------------------------------- */
  /* Already Paid                                                            */
  /* ---------------------------------------------------------------------- */

  function buildLedgerItemId(item: {
    id?: string | null;
    feeScheduleId?: string | null;
    title?: string | null;
    installmentNumber?: number | null;
  }) {
    if (item.feeScheduleId) {
      return `${item.feeScheduleId}|${
        item.title ?? "fee"
      }|${
        item.installmentNumber ?? "single"
      }`;
    }

    return item.id ?? item.title ?? "unknown";
  }

  const alreadyPaid = (
    admission?.feeLedger ?? []
  ).reduce((sum, item) => {
    const isPaid =
      item.status === "PAID" ||
      Number(item.dueAmount) <= 0;

    return isPaid
      ? sum + Number(item.paidAmount ?? 0)
      : sum;
  }, 0);

  const paidItems = (
    admission?.feeLedger ?? []
  )
    .filter(
      (item) =>
        item.status === "PAID" ||
        Number(item.dueAmount) <= 0,
    )
    .map(buildLedgerItemId);

  /* ---------------------------------------------------------------------- */
  /* Find Fee Schedule                                                       */
  /* ---------------------------------------------------------------------- */

  function findFeeScheduleId(
    item: FeeItem,
  ): string | null {
    const schedules =
      admission?.course?.feeSchedules ?? [];

    if (item.id === "admission") {
      return (
        schedules.find((schedule) =>
          schedule.title
            .toLowerCase()
            .includes("admission"),
        )?.id ?? null
      );
    }

    if (item.id.startsWith("month-")) {
      return (
        schedules.find((schedule) =>
          schedule.title
            .toLowerCase()
            .includes("monthly"),
        )?.id ?? null
      );
    }

    if (item.id === "certificate") {
      return (
        schedules.find((schedule) =>
          schedule.title
            .toLowerCase()
            .includes("certificate"),
        )?.id ?? null
      );
    }

    return null;
  }

  /* ---------------------------------------------------------------------- */
  /* Save Payment                                                            */
  /* ---------------------------------------------------------------------- */

  async function handleSave() {
    if (!admission) {
      setError("Please select a student.");
      return;
    }

    if (selectedItems.length === 0) {
      setError(
        "Please select at least one fee item.",
      );
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const details = form.getValues();

      /* ------------------------------------------------------------------ */
      /* Convert UI fee items to database payment items                     */
      /* ------------------------------------------------------------------ */

      const paymentItems = selectedItems
        .filter(
          (item) => Number(item.amount) > 0,
        )
        .map((item) => {
          const feeScheduleId =
            item.feeScheduleId ??
            findFeeScheduleId(item);

          if (!feeScheduleId) {
            throw new Error(
              `Fee schedule not found for ${item.title}.`,
            );
          }

          return {
            feeScheduleId,
            title: item.title,
            amount: Number(item.amount),
          };
        });

      if (paymentItems.length === 0) {
        throw new Error(
          "No payable fee items selected.",
        );
      }

      /* ------------------------------------------------------------------ */
      /* Calculate amount paid                                               */
      /* ------------------------------------------------------------------ */

      const amountPaid = paymentItems.reduce(
        (sum, item) => sum + item.amount,
        0,
      );

      /* ------------------------------------------------------------------ */
      /* Create payment                                                       */
      /* ------------------------------------------------------------------ */

      const response = await fetch(
        "/api/finance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admissionId: admission.id,

            receiptDate:
              new Date().toISOString(),

            amountPaid,

            status: "PAID",

            paymentMethod:
              details.paymentMethod,

            transactionId:
              details.transactionId ||
              undefined,

            remarks:
              details.remarks ||
              undefined,

            collectedBy:
              details.collectedBy ||
              undefined,

            paymentItems,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            result.error ??
            "Failed to save payment.",
        );
      }

      /* ------------------------------------------------------------------ */
      /* Payment created successfully                                        */
      /* ------------------------------------------------------------------ */

      const createdPayment =
        result.data ?? result;

      setPaymentId(createdPayment.id);

      setSuccess(
        `Payment of ₹${amountPaid.toFixed(
          2,
        )} saved successfully.`,
      );

      setSelectedItems([]);
    } catch (err: unknown) {
      console.error(
        "Payment save error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Print Receipt                                                           */
  /* ---------------------------------------------------------------------- */

  function printReceipt(
    receiptFormat:
      | "a4"
      | "thermal58"
      | "thermal80",
  ) {
    if (!paymentId) {
      setError(
        "Save the payment before printing the receipt.",
      );

      return;
    }

    const url =
      `/api/finance/${paymentId}/receipt` +
      `?format=${receiptFormat}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Dialog State                                                            */
  /* ---------------------------------------------------------------------- */

  function resetDialogState() {
    setAdmission(initialAdmission ?? null);

    setSelectedItems([]);
    setPaymentId(null);
    setError(null);
    setSuccess(null);

    form.reset({
      paymentMethod: "CASH",
      collectedBy: "",
      transactionId: "",
      remarks: "",
    });
  }

  function handleDialogOpenChange(
    nextOpen: boolean,
  ) {
    if (nextOpen) {
      resetDialogState();
    }

    onOpenChange(nextOpen);
  }

  /* ---------------------------------------------------------------------- */
  /* Change Student                                                          */
  /* ---------------------------------------------------------------------- */

  function handleStudentChange(
    selectedAdmission: StudentPaymentAdmission,
  ) {
    setAdmission(selectedAdmission);

    setSelectedItems([]);
    setPaymentId(null);
    setError(null);
    setSuccess(null);

    form.reset({
      paymentMethod: "CASH",
      collectedBy: "",
      transactionId: "",
      remarks: "",
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogContent
        className="
          flex
          h-[min(90vh,860px)]
          max-h-[90vh]

          w-[calc(100vw-1rem)]
          !max-w-none

          sm:w-[calc(100vw-2rem)]
          md:w-[calc(100vw-3rem)]
          lg:w-[calc(100vw-4rem)]

          xl:w-[min(1280px,calc(100vw-4rem))]

          flex-col
          gap-0
          overflow-hidden

          rounded-[24px]
          border
          bg-background
          p-0

          shadow-2xl
        "
      >
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <DialogHeader
          className="
            shrink-0
            border-b
            bg-background
            px-5
            py-4

            sm:px-7
            sm:py-5

            lg:px-8
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              justify-between
              gap-4
              pr-8
            "
          >
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    bg-muted/60
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-muted-foreground
                  "
                >
                  Finance
                </span>

                {admission && (
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-emerald-500/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      text-emerald-700
                      dark:text-emerald-400
                    "
                  >
                    Ready to collect
                  </span>
                )}
              </div>

              <DialogTitle
                className="
                  truncate
                  text-xl
                  font-bold
                  tracking-tight

                  sm:text-2xl
                "
              >
                Collect Fee Payment
              </DialogTitle>

              <p
                className="
                  mt-1
                  text-sm
                  leading-5
                  text-muted-foreground
                "
              >
                Review outstanding fees and
                record the student&apos;s payment.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ================================================================== */}
        {/* SCROLLABLE WORKSPACE                                               */}
        {/* ================================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden

            bg-muted/[0.18]
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1240px]
              px-4
              py-5

              sm:px-6
              sm:py-6

              lg:px-8
              lg:py-7
            "
          >
            {!admission && (
              <section
                className="
                  rounded-2xl
                  border
                  bg-background
                  p-5
                  shadow-sm

                  sm:p-7
                "
              >
                <div className="mb-5">
                  <div
                    className="
                      mb-2
                      inline-flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    ₹
                  </div>

                  <h3 className="text-lg font-semibold">
                    Select a Student
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Search for a student admission
                    before collecting a payment.
                  </p>
                </div>

                <AdmissionCombobox
                  value=""
                  onChange={handleStudentChange}
                />
              </section>
            )}

            {admission && (
              <div className="space-y-5 lg:space-y-6">
                {/* ========================================================== */}
                {/* STUDENT                                                       */}
                {/* ========================================================== */}

                <section
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-background
                    shadow-sm
                  "
                >
                  <div
                    className="
                      border-b
                      bg-gradient-to-r
                      from-primary/[0.06]
                      via-background
                      to-background
                      px-5
                      py-4

                      sm:px-6
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-3

                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >
                      <div>
                        <p
                          className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-primary
                          "
                        >
                          Student
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Selected admission for this
                          transaction
                        </p>
                      </div>

                      <div
                        className="
                          w-full

                          md:w-[300px]
                        "
                      >
                        <AdmissionCombobox
                          value={admission.id}
                          onChange={
                            handleStudentChange
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <StudentPaymentCard
                      admission={admission}
                    />
                  </div>
                </section>

                {/* ========================================================== */}
                {/* STATUS                                                       */}
                {/* ========================================================== */}

                {error && (
                  <div
                    role="alert"
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-destructive/20
                      bg-destructive/5
                      px-4
                      py-3.5
                      text-sm
                      font-medium
                      text-destructive
                      shadow-sm
                    "
                  >
                    <span
                      className="
                        mt-0.5
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-destructive/10
                        text-xs
                        font-bold
                      "
                    >
                      !
                    </span>

                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-emerald-500/20
                      bg-emerald-500/5
                      px-4
                      py-3.5
                      text-sm
                      font-medium
                      text-emerald-700
                      shadow-sm

                      dark:text-emerald-400
                    "
                  >
                    <span
                      className="
                        mt-0.5
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-emerald-500/10
                        text-xs
                        font-bold
                      "
                    >
                      ✓
                    </span>

                    <span>{success}</span>
                  </div>
                )}

                {/* ========================================================== */}
                {/* PAYMENT WORKSPACE                                             */}
                {/* ========================================================== */}

                <div
                  className="
                    grid
                    min-w-0
                    items-start
                    gap-5

                    lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.75fr)]
                    lg:gap-6
                  "
                >
                  {/* ======================================================== */}
                  {/* LEFT: FEE SCHEDULE                                         */}
                  {/* ======================================================== */}

                  <section
                    className="
                      min-w-0
                      overflow-hidden
                      rounded-2xl
                      border
                      bg-background
                      shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        px-5
                        py-5

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-6
                      "
                    >
                      <div>
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <h3
                            className="
                              text-base
                              font-bold
                              tracking-tight
                            "
                          >
                            Fee Items
                          </h3>

                          <span
                            className="
                              rounded-full
                              bg-muted
                              px-2
                              py-0.5
                              text-[10px]
                              font-semibold
                              text-muted-foreground
                            "
                          >
                            Select to collect
                          </span>
                        </div>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Choose the outstanding fee
                          items included in this payment.
                        </p>
                      </div>

                      <div
                        className="
                          inline-flex
                          w-fit
                          items-baseline
                          gap-2
                          rounded-xl
                          border
                          bg-primary/[0.06]
                          px-3.5
                          py-2.5
                        "
                      >
                        <span
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.1em]
                            text-muted-foreground
                          "
                        >
                          Selected
                        </span>

                        <span
                          className="
                            text-base
                            font-bold
                            tracking-tight
                            text-primary
                          "
                        >
                          ₹{selectedToday.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div
                      className="
                        min-w-0
                        p-4

                        sm:p-5
                      "
                    >
                      <FeeSchedule
                        ledgerItems={
                          admission.feeLedger ?? []
                        }
                        admissionFee={admissionFee}
                        monthlyFee={monthlyFee}
                        durationMonths={installmentCount}
                        certificateFee={
                          certificateFee
                        }
                        selectedItems={selectedItems}
                        paidItems={paidItems}
                        onSelectionChange={
                          setSelectedItems
                        }
                      />
                    </div>
                  </section>

                  {/* ======================================================== */}
                  {/* RIGHT: PAYMENT SIDEBAR                                     */}
                  {/* ======================================================== */}

                  <aside
                    className="
                      min-w-0
                      space-y-5

                      lg:sticky
                      lg:top-0
                    "
                  >
                    {/* ====================================================== */}
                    {/* PAYMENT SUMMARY                                          */}
                    {/* ====================================================== */}

                    <section
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-background
                        shadow-sm
                      "
                    >
                      <div
                        className="
                          border-b
                          px-5
                          py-4
                        "
                      >
                        <h3
                          className="
                            text-base
                            font-bold
                            tracking-tight
                          "
                        >
                          Payment Summary
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Current financial overview
                        </p>
                      </div>

                      <div className="p-5">
                        <PaymentSummary
                          admissionFee={
                            admissionFee
                          }
                          courseFee={courseFee}
                          alreadyPaid={alreadyPaid}
                          selectedToday={
                            selectedToday
                          }
                        />
                      </div>
                    </section>

                    {/* -------------------------------------------------------- */}
                    {/* Previously Paid Fees                                     */}
                    {/* -------------------------------------------------------- */}

                    <section
                      className="
                        rounded-2xl
                        border
                        bg-card
                        p-4
                        shadow-sm
                        sm:p-5
                      "
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold">
                            Previously Paid Fees
                          </h3>

                          <p className="mt-1 text-sm text-muted-foreground">
                            Fees already collected for this admission.
                          </p>
                        </div>

                        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          ₹{alreadyPaid.toFixed(2)}
                        </div>
                      </div>

                      {(
                        admission?.feeLedger ?? []
                      ).filter(
                        (item) =>
                          item.status === "PAID" ||
                          Number(item.dueAmount ?? 0) <= 0,
                      ).length === 0 ? (
                        <div
                          className="
                            rounded-xl
                            border
                            border-dashed
                            bg-muted/20
                            px-4
                            py-6
                            text-center
                          "
                        >
                          <p className="text-sm font-medium">
                            No payments recorded yet
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Previously paid fees will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(
                            admission?.feeLedger ?? []
                          )
                            .filter(
                              (item) =>
                                item.status === "PAID" ||
                                Number(item.dueAmount ?? 0) <= 0,
                            )
                            .map((item) => (
                              <div
                                key={buildLedgerItemId(item)}
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                  rounded-xl
                                  border
                                  bg-muted/10
                                  px-4
                                  py-3
                                "
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {item.title}
                                  </p>

                                  {item.installmentNumber ? (
                                    <p className="text-xs text-muted-foreground">
                                      Installment {item.installmentNumber}
                                    </p>
                                  ) : null}
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                  <span className="text-sm font-semibold">
                                    ₹
                                    {Number(
                                      item.paidAmount ?? item.amount ?? 0,
                                    ).toFixed(2)}
                                  </span>

                                  <span
                                    className="
                                      rounded-full
                                      bg-emerald-100
                                      px-2.5
                                      py-1
                                      text-[11px]
                                      font-semibold
                                      text-emerald-700
                                    "
                                  >
                                    PAID
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </section>

                    {/* ====================================================== */}
                    {/* PAYMENT DETAILS                                          */}
                    {/* ====================================================== */}

                    <section
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        bg-background
                        shadow-sm
                      "
                    >
                      <div
                        className="
                          border-b
                          px-5
                          py-4
                        "
                      >
                        <h3
                          className="
                            text-base
                            font-bold
                            tracking-tight
                          "
                        >
                          Payment Details
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Enter collection information
                        </p>
                      </div>

                      <div className="p-5">
                        <PaymentDetails
                          form={form}
                        />
                      </div>
                    </section>
                  </aside>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================== */}
        {/* FOOTER                                                             */}
        {/* ================================================================== */}

        {admission && (
          <div
            className="
              shrink-0
              border-t
              bg-background

              px-4
              py-3

              sm:px-6
              sm:py-4

              lg:px-8
            "
          >
            <div
              className="
                min-w-0
                overflow-x-auto
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-center
                  justify-end

                  [&>div]:min-w-0
                "
              >
                <ReceiptActions
                  loading={loading}
                  onCancel={() =>
                    onOpenChange(false)
                  }
                  onSave={handleSave}
                  onPrintA4={() =>
                    printReceipt("a4")
                  }
                  onPrintThermal58={() =>
                    printReceipt("thermal58")
                  }
                  onPrintThermal80={() =>
                    printReceipt("thermal80")
                  }
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}