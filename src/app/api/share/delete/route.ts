import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: -1, msg: "id cannot be empty" },
      { status: 500 }
    );
  }

  try {
    await prisma.share.delete({
      where: { id },
    });

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("delete share error", error);
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
