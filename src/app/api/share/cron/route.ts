import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const date = new Date(Number(new Date()) - 1000 * 60 * 60 * 24 * 7);

  try {
    await prisma.share.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });
    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("share clear error");
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
