import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LResponseError } from "@/lib";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return LResponseError("please log in first");

  const { searchParams } = new URL(request.url);

  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return LResponseError("year or month cannot be empty");
  }

  try {
    const data = await prisma.cost.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(`${year}-${Number(month) + 1}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-31`),
        },
      },
    });

    return NextResponse.json({ error: 0, data }, { status: 200 });
  } catch {
    return LResponseError("get cost error");
  }
}
