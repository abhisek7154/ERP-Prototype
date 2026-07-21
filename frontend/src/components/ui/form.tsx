"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props} />
  );
}

export function FormLabel(
  props: React.ComponentProps<typeof Label>
) {
  return <Label {...props} />;
}

export function FormControl({
  children,
}: {
  children: React.ReactElement;
}) {
  return children;
}

export function FormMessage() {
  const {
    formState: { errors },
  } = useFormContext();

  const firstError = Object.values(errors)[0];

  if (!firstError?.message) return null;

  return (
    <p className="text-sm text-destructive">
      {String(firstError.message)}
    </p>
  );
}