import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const info = await prisma.backup.findFirst({
      where: { userId: session?.user.id },
    });

    if (!info?.content) return ResSuccess({ data: { size: 0 } });

    const contentSize: any = await prisma.$queryRaw`
      SELECT pg_column_size(${info.content}) AS string_size;
    `;

    return ResSuccess({ data: { size: contentSize[0].string_size } });
  } catch (error) {
    console.log(error, "get sync size error");
    return ResErr({ msg: "get sync size error" });
  }
}
