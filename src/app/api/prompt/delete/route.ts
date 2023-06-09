import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// only can delete prompt that created by himself
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: -1, msg: "Please log in first" },
      { status: 500 }
    );
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: -1, msg: "id cannot be empty" },
      { status: 500 }
    );
  }

  try {
    const find = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!find) {
      return NextResponse.json(
        { error: -1, msg: "prompt does not exist" },
        { status: 500 }
      );
    }

    // Cannot delete prompts that have already been approved.
    if (find.status === 1) {
      return NextResponse.json(
        {
          error: -1,
          msg: "Cannot delete prompts that have already been approved.",
        },
        { status: 500 }
      );
    }

    if (find.creatorEmail !== session.user.email) {
      return NextResponse.json(
        { error: -1, msg: "no permission to operate this prompt." },
        { status: 500 }
      );
    }

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("delete share error", error);
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
