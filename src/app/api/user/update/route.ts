import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // check session
  const userId = session?.user.id;
  if (!userId) {
    return NextResponse.json(
      { error: -1, msg: "user id is empty" },
      { status: 500 }
    );
  }

  // find user
  const findUser = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });
  if (!findUser) {
    return NextResponse.json(
      { error: -1, msg: "user not found" },
      { status: 500 }
    );
  }

  // update user info
  const { name, image } = await request.json();
  await prisma.user.update({
    data: { name, image },
    where: { id: userId },
  });

  return NextResponse.json({ error: 0 }, { status: 200 });
}
