import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id, anonymous } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: -1, msg: "id cannot be empty" },
      { status: 500 }
    );
  }

  try {
    await prisma.share.update({
      data: { anonymous: Number(!!anonymous) },
      where: { id },
    });

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("update share error", error);
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
