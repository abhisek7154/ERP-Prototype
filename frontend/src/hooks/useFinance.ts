"use client";

import { useCallback, useEffect, useState } from "react";

import type {
  CreateFeePaymentInput,
  UpdateFeePaymentInput,
} from "@/modules/finance";

export interface FinanceQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentMethod?: string;
  from?: string;
  to?: string;
}

export function useFinance(initialQuery: FinanceQuery = {}) {
  const [payments, setPayments] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] =
    useState<FinanceQuery>(initialQuery);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }, [query]);

  // Fetch Payments
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/finance?${buildQueryString()}`,
        {
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message);
      }

      setPayments(json.data);
      setPagination(json.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // Get Single Payment
  const getPayment = async (id: string) => {
    const res = await fetch(`/api/finance/${id}`, {
      credentials: "include",
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    return json.data;
  };

  // Create Payment
  const createPayment = async (
    data: CreateFeePaymentInput
  ) => {
    const res = await fetch("/api/finance", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    await fetchPayments();

    return json.data;
  };

  // Update Payment
  const updatePayment = async (
    id: string,
    data: UpdateFeePaymentInput
  ) => {
    const res = await fetch(`/api/finance/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    await fetchPayments();

    return json.data;
  };

  // Delete Payment
  const deletePayment = async (id: string) => {
    const res = await fetch(`/api/finance/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message);
    }

    await fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    pagination,
    loading,
    error,
    query,
    setQuery,
    refresh: fetchPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
  };
}