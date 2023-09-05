import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) return ResErr({ error: 20002 });

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
      password: user.password,
    };

    return ResSuccess({ data: response });
  } catch (error) {
    console.log(error, "get user error");
    return ResErr({ msg: "get user error" });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) return ResErr({ error: 20001 });

    const userId = session.user.id;

    // find user
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) return ResErr({ error: 20002 });

    // update user info
    const { name, image, password, newPassword } = await request.json();

    if (name) {
      await prisma.user.update({
        data: { name, image },
        where: { id: userId },
      });
    }

    if (newPassword) {
      // 没有旧密码，代表是第一次设置密码
      // No old password, indicating it is the first time setting a password
      if (!password) {
        if (findUser.password) return ResErr({ error: 20020 });
      } else {
        // 有旧密码，代表是修改密码
        // There is an old password, indicating that the password is modified
        if (!findUser.password) return ResErr({ error: 20021 });
        if (findUser.password !== password) return ResErr({ error: 20022 });
      }

      await prisma.user.update({
        data: { password: newPassword },
        where: { id: userId },
      });
    }

    // update recently use
    await prisma.user.update({
      data: { recentlyUse: new Date() },
      where: { id: userId },
    });

    return ResSuccess();
  } catch (error) {
    console.log(error, "update user error");
    return ResErr({ msg: "update user error" });
  }
}
