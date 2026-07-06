import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SchoolERP - Login",
  description: "Login to your SchoolERP account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
