import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LResponseError } from "@/lib";

// only can delete prompt that created by himself
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return LResponseError("Please log in first");

  const { id } = await request.json();

  if (!id) return LResponseError("id cannot be empty");

  try {
    const find = await prisma.prompt.findUnique({
      where: { id },
    });

    if (!find) return LResponseError("prompt does not exist");

    // Cannot delete prompts that have already been approved.
    if (find.status === 1) {
      return LResponseError(
        "Cannot delete prompts that have already been approved."
      );
    }

    if (find.creatorEmail !== session.user.email) {
      return LResponseError("no permission to operate this prompt.");
    }

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("delete share error", error);
    return LResponseError();
  }
}
