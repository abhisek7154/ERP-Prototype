"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import PaymentForm from "./PaymentForm";

import type { CreateFeePaymentInput } from "@/modules/finance";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  defaultValues?: Partial<CreateFeePaymentInput>;
  onSubmit: (
    values: CreateFeePaymentInput
  ) => Promise<void>;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  mode = "create",
  defaultValues,
  onSubmit,
}: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: CreateFeePaymentInput
  ) => {
    try {
      setLoading(true);

      await onSubmit(values);

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Add Fee Payment"
              : "Edit Fee Payment"}
          </DialogTitle>

          <DialogDescription>
            {mode === "create"
              ? "Fill in the payment details below."
              : "Update the payment details."}
          </DialogDescription>
        </DialogHeader>

        <PaymentForm
          defaultValues={defaultValues}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}