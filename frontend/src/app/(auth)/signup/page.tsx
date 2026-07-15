"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Registration is currently disabled.
          </p>
        </div>

        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Administrator accounts are created by the system administrator.
            Please contact your school administrator if you require access to
            the School ERP.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Back to Login
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}