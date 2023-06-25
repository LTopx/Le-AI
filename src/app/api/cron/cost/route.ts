import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LResponseError } from "@/lib";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    if (process.env.CRON_SECRET !== searchParams.get("secret")) {
      return LResponseError("cron cost error");
    }

    // const costs = await prisma.cost.findMany({
    //   where: {
    //     createdAt: {
    //       gte: new Date(new Date().setHours(0, 0, 0, 0)),
    //     },
    //   },
    // });

    // // if costs exist means already run today
    // if (costs.length) return LResponseError("already run today");

    // const users = await prisma.user.findMany({
    //   where: {
    //     costTokens: {
    //       gt: 0,
    //     },
    //   },
    // });

    // if (!users.length) return LResponseError("no users need to cost");

    // for (const user of users) {
    //   const { id, availableTokens, costTokens, costUSD } = user;

    //   await prisma.cost.create({
    //     data: {
    //       costTokens,
    //       costUSD,
    //       userId: id,
    //     },
    //   });

    //   await prisma.user.update({
    //     data: {
    //       costTokens: 0,
    //       costUSD: 0,
    //       availableTokens: availableTokens - costTokens,
    //     },
    //     where: { id: user.id },
    //   });
    // }

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log("cost error");
    return LResponseError("error");
  }
}
