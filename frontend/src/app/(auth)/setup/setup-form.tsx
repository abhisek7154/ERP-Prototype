"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    schoolName: "",
    schoolCode: "",
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (typeof data.error === "string") {
          setError(data.error);
        } else {
          setError("Setup failed.");
        }
        return;
      }

      router.push("/login");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">
            🏫
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Initial Setup
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Configure your school and create the first administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* School Information */}
          <section>
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
              School Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  School Name
                </label>

                <input
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="DM Public School"
                  value={form.schoolName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schoolName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  School Code
                </label>

                <input
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="DMP001"
                  value={form.schoolCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      schoolCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          {/* Administrator */}
          <section>
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold">
              Administrator Account
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Administrator Name
                </label>

                <input
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Abhisek Sahoo"
                  value={form.adminName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      adminName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Administrator Email
                </label>

                <input
                  type="email"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="admin@school.com"
                  value={form.adminEmail}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      adminEmail: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>

                <input
                  type="password"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating School..." : "Create School"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            SchoolERP will create your first administrator account and initialize
            the system.
          </p>
        </form>
      </div>
    </main>
  );
}