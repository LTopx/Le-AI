import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { prisma } from "@/lib/prisma";
import { ResErr, ResSuccess } from "@/lib";

// restore
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return ResErr({ error: 20001 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });

    if (!user) return ResErr({ error: 20002 });

    // audit user license
    if (user.license_type !== "premium" && user.license_type !== "team") {
      return ResErr({ error: 20009 });
    }

    const find = await prisma.backup.findFirst({
      where: { userId: session?.user.id },
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

    // audit user license
    if (user.license_type !== "premium" && user.license_type !== "team") {
      return ResErr({ error: 20009 });
    }

    const { content } = await request.json();

    const contentSize: any = await prisma.$queryRaw`
    SELECT pg_column_size(${content}) AS string_size;
  `;

    // The maximum cannot exceed 1MB.
    if (contentSize[0].string_size / 1024 / 1024 > 1) {
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

    return ResSuccess();
  } catch (error) {
    console.log(error, "backup error");
    return ResErr({ msg: "backup error" });
  }
}
