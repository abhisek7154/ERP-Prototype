"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

import {
  FinanceCards,
  FinancePagination,
  FinanceTable,
  FinanceToolbar,
  PaymentDialog,
  PaymentDetailsDialog,
  DeletePaymentDialog,
} from "@/components/ui/finance";

import { useFinance } from "@/hooks/useFinance";

import type {
  CreateFeePaymentInput,
  UpdateFeePaymentInput,
} from "@/modules/finance";

type Payment = Awaited<
  ReturnType<typeof useFinance>
>["payments"][number];

export default function FinancePage() {
  const finance = useFinance();

  const {
    payments,
    pagination,
    loading,
    error,
    query,
    setQuery,
    refresh,
    createPayment,
    updatePayment,
    deletePayment,
  } = finance;

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const summary = useMemo(() => {
    const totalCollection = payments.reduce(
      (sum, payment) => sum + Number(payment.amountPaid),
      0
    );

    const today = new Date().toDateString();

    const todayCollection = payments
      .filter(
        (payment) =>
          new Date(
            payment.receiptDate ?? payment.createdAt
          ).toDateString() === today
      )
      .reduce(
        (sum, payment) => sum + Number(payment.amountPaid),
        0
      );

    const now = new Date();

    const monthlyCollection = payments
      .filter((payment) => {
        const date = new Date(
          payment.receiptDate ?? payment.createdAt
        );

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce(
        (sum, payment) => sum + Number(payment.amountPaid),
        0
      );

    const pendingAmount = payments
      .filter((payment) => payment.status === "PENDING")
      .reduce(
        (sum, payment) => sum + Number(payment.amountPaid),
        0
      );

    return {
      totalCollection,
      todayCollection,
      monthlyCollection,
      pendingAmount,
    };
  }, [payments]);

 const handleCreate = async (
  values: CreateFeePaymentInput
) => {
  await createPayment(values);
  setCreateOpen(false);
};

const handleEdit = async (
  values: UpdateFeePaymentInput
) => {
  if (!selectedPayment) return;

  await updatePayment(selectedPayment.id, values);

  setEditOpen(false);
  setSelectedPayment(null);
};

const handleDelete = async () => {
  if (!selectedPayment) return;

  await deletePayment(selectedPayment.id);

  setDeleteOpen(false);
  setSelectedPayment(null);
};

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Finance Management
          </h1>

          <p className="text-muted-foreground">
            Manage student fee payments and receipts.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          New Payment
        </Button>
      </div>

      <Separator />

      <FinanceCards
        totalCollection={summary.totalCollection}
        todayCollection={summary.todayCollection}
        monthlyCollection={summary.monthlyCollection}
        pendingAmount={summary.pendingAmount}
      />

      <FinanceToolbar
  search={query.search ?? ""}
  status={query.status ?? "ALL"}
  paymentMethod={query.paymentMethod ?? "ALL"}
  from={query.from ?? ""}
  to={query.to ?? ""}
  onSearchChange={(value) =>
    setQuery({
      ...query,
      search: value,
      page: 1,
    })
  }
  onStatusChange={(value) =>
    setQuery({
      ...query,
      status: value === "ALL" ? undefined : value,
      page: 1,
    })
  }
  onPaymentMethodChange={(value) =>
    setQuery({
      ...query,
      paymentMethod:
        value === "ALL" ? undefined : value,
      page: 1,
    })
  }
  onFromChange={(value) =>
    setQuery({
      ...query,
      from: value || undefined,
      page: 1,
    })
  }
  onToChange={(value) =>
    setQuery({
      ...query,
      to: value || undefined,
      page: 1,
    })
  }
  onRefresh={refresh}
  onAdd={() => setCreateOpen(true)}
/>

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-4 text-destructive">
            {error}
          </CardContent>
        </Card>
      )}
            <FinanceTable
        payments={payments}
        loading={loading}
        onView={(payment) => {
          setSelectedPayment(payment);
          setViewOpen(true);
        }}
        onEdit={(payment) => {
          setSelectedPayment(payment);
          setEditOpen(true);
        }}
        onDelete={(payment) => {
          setSelectedPayment(payment);
          setDeleteOpen(true);
        }}
      />

      {!loading && payments.length === 0 && (
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                No Payments Found
              </h3>

              <p className="text-muted-foreground">
                Create your first fee payment to get started.
              </p>

              <Button
                onClick={() => setCreateOpen(true)}
                className="mt-4"
              >
                Add Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {pagination && (
        <FinancePagination
          pagination={pagination}
          onPageChange={(page) =>
            setQuery({
              ...query,
              page,
            })
          }
        />
      )}
          <PaymentDialog
  open={createOpen}
  onOpenChange={setCreateOpen}
  mode="create"
  onSubmit={handleCreate}
/>

      {selectedPayment && (
  <PaymentDialog
    open={editOpen}
    onOpenChange={(open) => {
      setEditOpen(open);

      if (!open) {
        setSelectedPayment(null);
      }
    }}
    mode="edit"
    defaultValues={{
      studentId: selectedPayment.studentId,
      receiptNumber: selectedPayment.receiptNumber ?? "",
      mrNumber: selectedPayment.mrNumber ?? "",
      receiptDate: new Date(
        selectedPayment.receiptDate ?? selectedPayment.createdAt
      ),
      amountPaid: Number(selectedPayment.amountPaid),
      status: selectedPayment.status,
      paymentMethod: selectedPayment.paymentMethod,
      transactionId: selectedPayment.transactionId ?? "",
      remarks: selectedPayment.remarks ?? "",
      collectedBy: selectedPayment.collectedBy ?? "",
    }}
    onSubmit={(values) =>
      handleEdit(values as UpdateFeePaymentInput)
    }
  />
)}

      {selectedPayment && (
        <PaymentDetailsDialog
          open={viewOpen}
          onOpenChange={(open) => {
            setViewOpen(open);

            if (!open) {
              setSelectedPayment(null);
            }
          }}
          payment={selectedPayment}
        />
      )}

      {selectedPayment && (
  <DeletePaymentDialog
  open={deleteOpen}
  onOpenChange={(open) => {
    setDeleteOpen(open);

    if (!open) {
      setSelectedPayment(null);
    }
  }}
  paymentId={selectedPayment.id}
  receiptNumber={selectedPayment.receiptNumber}
  onDelete={async (id) => {
    await deletePayment(id);
    setDeleteOpen(false);
    setSelectedPayment(null);
  }}
/>
)}
            {loading && (
        <div className="flex items-center justify-center py-6">
          <p className="text-sm text-muted-foreground">
            Loading finance records...
          </p>
        </div>
      )}

      {!loading && payments.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          Showing{" "}
          <span className="font-medium">
            {payments.length}
          </span>{" "}
          payment{payments.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
