import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";
import { FREE_SYNC_SIZE, PRO_SYNC_SIZE } from "@/utils/constant";

// restore
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return ResErr({ error: 20002 });

    const find = await prisma.backup.findFirst({
      where: { userId: session.user.id },
    });

    if (!find) return ResErr({ error: 20012 });

    return ResSuccess({ data: find.content });
  } catch (error) {
    console.log(error, "restore error");
    return ResErr({ msg: "restore error" });
  }
}

// backup
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) return ResErr({ error: 20002 });

    const maxSize =
      user.license_type === "premium" || user.license_type === "team"
        ? PRO_SYNC_SIZE
        : FREE_SYNC_SIZE;

    const { content } = await request.json();

    const contentStringSize: any = await prisma.$queryRaw`
      SELECT pg_column_size(${content}) AS string_size;
    `;

    const contentSize = contentStringSize[0].string_size;

    if (contentSize / 1024 > maxSize) {
      if (user.license_type !== "premium" && user.license_type !== "team") {
        return ResErr({ error: 20013 });
      }
      return ResErr({ error: 20011 });
    }

    const find = await prisma.backup.findFirst({
      where: { userId: session?.user.id },
    });

    if (!find) {
      await prisma.backup.create({
        data: {
          userId: session.user.id,
          content: content,
        },
      });
    } else {
      await prisma.backup.update({
        where: { id: find.id },
        data: { content: content },
      });
    }

    return ResSuccess({ data: { size: contentSize } });
  } catch (error) {
    console.log(error, "backup error");
    return ResErr({ msg: "backup error" });
  }
}
