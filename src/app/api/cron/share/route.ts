import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";

export async function GET() {
  const headersList = headers();
  const token = headersList.get("Authorization")?.split(" ")[1];

  const date = new Date(Number(new Date()) - 1000 * 60 * 60 * 24 * 7);

  if (process.env.CRON_SECRET !== token) {
    return ResErr({ msg: "cron validate error" });
  }

  try {
    await prisma.share.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });
    return ResSuccess();
  } catch (error) {
    console.log("share clear error");
    return ResErr({ msg: "error" });
  }
}
