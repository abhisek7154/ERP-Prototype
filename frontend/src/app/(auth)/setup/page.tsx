import { redirect } from "next/navigation";

import { prisma } from "~/lib/prisma";

import SetupForm from "./setup-form";

export default async function SetupPage() {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
    },
  });

  if (user) {
    redirect("/login");
  }

  return <SetupForm />;
}