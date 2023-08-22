import { getServerSession } from "next-auth/next";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess, isUndefined } from "@/lib";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const res = await prisma.apiTokens.findMany({
      where: { userId: session?.user.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ResSuccess({ data: res });
  } catch (error) {
    console.log(error, "get token error");
    return ResErr({ msg: "get token error" });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const count = await prisma.apiTokens.count({
      where: { userId: session?.user.id },
    });

    if (count >= 3) return ResErr({ error: 20014 });

    const { name, expire, total_quota } = await request.json();

    await prisma.apiTokens.create({
      data: {
        key: "leai-" + uuidv4(),
        name,
        total_quota,
        expire,
        userId: session.user.id,
      },
    });

    return ResSuccess();
  } catch (error) {
    console.log(error, "create token error");
    return ResErr({ msg: "create token error" });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const { id, name, expire, total_quota, status } = await request.json();

    if (!isUndefined(status)) {
      await prisma.apiTokens.update({
        where: { id },
        data: { status },
      });
      return ResSuccess();
    }

    await prisma.apiTokens.update({
      where: { id },
      data: {
        name,
        total_quota,
        expire,
      },
    });

    return ResSuccess();
  } catch (error) {
    console.log(error, "update token error");
    return ResErr({ msg: "update token error" });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const { id } = await request.json();

    await prisma.apiTokens.delete({
      where: { id },
    });

    return ResSuccess();
  } catch (error) {
    console.log(error, "delete token error");
    return ResErr({ msg: "delete token error" });
  }
}
