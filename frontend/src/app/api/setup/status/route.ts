import { NextResponse } from "next/server";
import { prisma } from "~/lib/prisma";

export async function GET() {
  const initialized = (await prisma.user.count()) > 0;

  return NextResponse.json({
    initialized,
  });
}