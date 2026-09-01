"use client";

import type { FeeLedgerItem } from "@/modules/finance/services/types";

import FeeItemCard, {
  FeeItemStatus,
} from "./FeeItemCard";

export interface FeeItem {
  id: string;
  feeScheduleId?: string | null;
  title: string;
  amount: number;
  status: FeeItemStatus;
}

interface FeeScheduleProps {
  ledgerItems?: FeeLedgerItem[];
  admissionFee: number;
  monthlyFee: number;
  durationMonths: number;
  certificateFee: number;
  selectedItems?: FeeItem[];

  /**
   * IDs already paid.
   *
   * Example:
   * ["admission", "month-1", "month-2"]
   */
  paidItems?: string[];

  onSelectionChange?: (
    items: FeeItem[],
  ) => void;
}

export default function FeeSchedule({
  ledgerItems,
  admissionFee,
  monthlyFee,
  durationMonths,
  certificateFee,
  selectedItems = [],
  paidItems = [],
  onSelectionChange,
}: FeeScheduleProps) {
  const selectedIds = new Set(
    selectedItems.map((item) => item.id),
  );

  const feeItems: FeeItem[] =
    ledgerItems && ledgerItems.length > 0
      ? ledgerItems.map((item) => {
          const itemId =
            item.feeScheduleId
              ? `${item.feeScheduleId}|${item.title}|${item.installmentNumber ?? "single"}`
              : item.id;

          return {
            id: itemId,
            feeScheduleId:
              item.feeScheduleId,
            title: item.title,
            amount: Number(item.dueAmount),
            status:
              item.status === "PAID" ||
              Number(item.dueAmount) <= 0
                ? "PAID"
                : selectedIds.has(itemId)
                  ? "SELECTED"
                  : "PENDING",
          };
        })
      : [
          {
            id: "admission",
            title: "Admission Fee",
            amount: admissionFee,
            status: paidItems.includes(
              "admission",
            )
              ? "PAID"
              : selectedIds.has(
                    "admission",
                  )
                ? "SELECTED"
                : "PENDING",
          },

          ...Array.from(
            { length: durationMonths },
            (_, i) => {
              const id = `month-${i + 1}`;

              return {
                id,
                title: `Month ${i + 1}`,
                amount: monthlyFee,
                status: paidItems.includes(id)
                  ? "PAID"
                  : selectedIds.has(id)
                    ? "SELECTED"
                    : "PENDING",
              } satisfies FeeItem;
            },
          ),

          {
            id: "certificate",
            title: "Certificate Fee",
            amount: certificateFee,
            status: paidItems.includes(
              "certificate",
            )
              ? "PAID"
              : selectedIds.has(
                    "certificate",
                  )
                ? "SELECTED"
                : "PENDING",
          },
        ];

  function toggle(id: string) {
    const currentItem =
      feeItems.find(
        (item) => item.id === id,
      );

    if (
      paidItems.includes(id) ||
      !currentItem ||
      Number(currentItem.amount) <= 0
    ) {
      return;
    }

    const nextSelected = selectedIds.has(id)
      ? selectedItems.filter(
          (item) => item.id !== id,
        )
      : [...selectedItems, currentItem];

    onSelectionChange?.(nextSelected);
  }

  return (
    <div className="space-y-3">
      {feeItems.map((item) => (
        <FeeItemCard
          key={item.id}
          title={item.title}
          amount={item.amount}
          checked={selectedIds.has(
            item.id,
          )}
          disabled={
            paidItems.includes(item.id) ||
            Number(item.amount) <= 0
          }
          status={item.status}
          onCheckedChange={() =>
            toggle(item.id)
          }
        />
      ))}
    </div>
  );
}
