import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { LResponseError } from "@/lib";

export async function PUT(request: Request) {
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

  // update recently use
  await prisma.user.update({
    data: { recentlyUse: new Date() },
    where: { id: userId },
  });

  return NextResponse.json({ error: 0 }, { status: 200 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return LResponseError("Please log in first");

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) return LResponseError("User does not exist");

    await prisma.user.update({
      data: { recentlyUse: new Date() },
      where: { id: session?.user.id },
    });

    const response = {
      costTokens: user.costTokens,
      costUSD: user.costUSD,
      license_type: user.license_type,
      freeTrialed: user.freeTrialed,
      availableTokens: user.availableTokens,
    };

    return NextResponse.json({ error: 0, data: response }, { status: 200 });
  } catch (error) {
    console.log(error, "get user error");
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
