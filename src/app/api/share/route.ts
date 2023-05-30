import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: -1, msg: "id cannot be empty" },
      { status: 500 }
    );
  }

  try {
    const shareRes: any = await prisma.share.findUnique({
      where: { id },
    });

    return NextResponse.json({ error: 0, data: shareRes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
