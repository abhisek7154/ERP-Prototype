"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ReceiptPreviewProps {
  payment: {
    receiptNumber?: string | null;
    mrNumber?: string | null;

    receiptDate?: string | Date | null;

    amountPaid: number;

    paymentMethod: string;

    status: string;

    transactionId?: string | null;

    remarks?: string | null;

    collectedBy?: string | null;

    student: {
      name: string;
      registrationNumber: string;
      course?: string | null;
    };
  };
}

export default function ReceiptPreview({
  payment,
}: ReceiptPreviewProps) {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-3xl font-bold">
          D.M. PUBLIC SCHOOL
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Puri, Odisha
        </p>

        <p className="text-xs text-muted-foreground">
          Fee Payment Receipt
        </p>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 py-6">
        {/* Receipt Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Info
            label="Receipt No."
            value={payment.receiptNumber ?? "-"}
          />

          <Info
            label="MR Number"
            value={payment.mrNumber ?? "-"}
          />

          <Info
            label="Receipt Date"
            value={
              payment.receiptDate
                ? new Date(
                    payment.receiptDate
                  ).toLocaleDateString("en-IN")
                : "-"
            }
          />

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <Badge>{payment.status}</Badge>
          </div>
        </div>

        <Separator />

        {/* Student */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Student Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Info
              label="Student Name"
              value={payment.student.name}
            />

            <Info
              label="Registration No."
              value={
                payment.student.registrationNumber
              }
            />

            <Info
              label="Course"
              value={payment.student.course ?? "-"}
            />
          </div>
        </div>

        <Separator />

        {/* Payment */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Payment Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Info
              label="Amount Paid"
              value={`₹${Number(
                payment.amountPaid
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}`}
            />

            <Info
              label="Payment Method"
              value={payment.paymentMethod}
            />

            <Info
              label="Transaction ID"
              value={
                payment.transactionId ?? "-"
              }
            />

            <Info
              label="Collected By"
              value={payment.collectedBy ?? "-"}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">
            Remarks
          </h3>

          <div className="border rounded-md p-3 min-h-20">
            {payment.remarks || "No remarks."}
          </div>
        </div>

        <Separator />

        <div className="flex justify-between pt-10">
          <div className="text-center">
            <div className="border-t w-40 mb-2" />
            <p className="text-sm">
              Authorized Signature
            </p>
          </div>

          <div className="text-center">
            <div className="border-t w-40 mb-2" />
            <p className="text-sm">
              Receiver Signature
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-6">
          This is a computer-generated receipt and
          does not require a physical signature.
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: React.ReactNode;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>
    </div>
  );
}