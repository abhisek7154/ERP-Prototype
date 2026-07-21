"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod";

import {
  createFeePaymentSchema,
  type CreateFeePaymentInput,
} from "@/modules/finance";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface PaymentFormProps {
  defaultValues?: Partial<CreateFeePaymentInput>;
  loading?: boolean;
  onSubmit: (
    values: CreateFeePaymentInput
  ) => Promise<void> | void;
}

export default function PaymentForm({
  defaultValues,
  loading = false,
  onSubmit,
}: PaymentFormProps) {
  const form = useForm<
  z.input<typeof createFeePaymentSchema>,
  unknown,
  z.output<typeof createFeePaymentSchema>
>({
  resolver: zodResolver(createFeePaymentSchema),
  defaultValues: {
    studentId: "",
    receiptNumber: "",
    mrNumber: "",
    receiptDate: new Date(),
    amountPaid: 0,
    status: "PAID",
    paymentMethod: "CASH",
    transactionId: "",
    remarks: "",
    collectedBy: "",
  },
});

  useEffect(() => {
    form.reset({
      studentId: "",
      receiptNumber: "",
      mrNumber: "",
      receiptDate: new Date(),
      amountPaid: 0,
      status: "PAID",
      paymentMethod: "CASH",
      transactionId: "",
      remarks: "",
      collectedBy: "",
      ...defaultValues,
    });
  }, [defaultValues, form]);

  return (
    <Form {...form}>
    <form
     onSubmit={form.handleSubmit(onSubmit)}
     className="space-y-5"
    >
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Student UUID"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="receiptNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receipt Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mrNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MR Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                  value={Number(field.value ?? 0)}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiptDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receipt Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value
                        ? new Date(field.value as Date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        new Date(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="CASH">
                      Cash
                    </SelectItem>
                    <SelectItem value="UPI">
                      UPI
                    </SelectItem>
                    <SelectItem value="CARD">
                      Card
                    </SelectItem>
                    <SelectItem value="BANK_TRANSFER">
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value="CHEQUE">
                      Cheque
                    </SelectItem>
                    <SelectItem value="ONLINE">
                      Online
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="PAID">
                      Paid
                    </SelectItem>
                    <SelectItem value="PENDING">
                      Pending
                    </SelectItem>
                    <SelectItem value="FAILED">
                      Failed
                    </SelectItem>
                    <SelectItem value="CANCELLED">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collectedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collected By</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Payment"}
        </Button>
      </form>
    </Form>
  );
}