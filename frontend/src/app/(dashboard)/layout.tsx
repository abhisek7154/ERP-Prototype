import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyJWT } from "~/modules/auth/jwt";

import { AppSidebar } from "~/app/(dashboard)/_components/app-sidebar";
import { DashboardHeader } from "~/app/(dashboard)/_components/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar";

import React from "react";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const cookieStore = await cookies();


  const token =
    cookieStore.get("admin-token")?.value;


  if (!token) {

    redirect("/login");

  }


  try {

    await verifyJWT(token);

  } catch {

    redirect("/login");

  }


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >

      <AppSidebar variant="inset" />

      <SidebarInset>

        <DashboardHeader />

        <div className="flex flex-1 flex-col px-6 py-4">

          {children}

        </div>

      </SidebarInset>

    </SidebarProvider>
  );
}