import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { ResErr, ResSuccess } from "@/lib";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  const { searchParams } = new URL(request.url);

  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) return ResErr({ msg: "year or month cannot be empty" });

  try {
    const data = await prisma.cost.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(`${year}-${Number(month) + 1}-01`),
          lt: new Date(`${year}-${Number(month) + 1}-31`),
        },
      },
    });

    return ResSuccess({ data });
  } catch {
    return ResErr({ msg: "get cost error" });
  }
}
