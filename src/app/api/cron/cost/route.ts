import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";

export async function GET() {
  try {
    const headersList = headers();
    const token = headersList.get("Authorization")?.split(" ")[1];

    if (process.env.CRON_SECRET !== token) {
      return ResErr({ msg: "cron validate error" });
    }

    const costs = await prisma.cost.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    // if costs exist means already run today
    if (costs.length) return ResErr({ msg: "already run today" });

    const users = await prisma.user.findMany({
      where: {
        costTokens: {
          gt: 0,
        },
      },
    });

    if (!users.length) return ResErr({ msg: "no users need to cost" });

    for (const user of users) {
      const { id, costTokens, costUSD } = user;

      await prisma.cost.create({
        data: {
          costTokens,
          costUSD,
          userId: id,
        },
      });

      await prisma.user.update({
        data: {
          costTokens: 0,
          costUSD: 0,
        },
        where: { id: user.id },
      });
    }

    return ResSuccess();
  } catch (error) {
    console.log("cost error");
    return ResErr({ msg: "error" });
  }
}
