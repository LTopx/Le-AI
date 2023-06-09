import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// get prompt data
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(request.url);

  const type = searchParams.get("type") as string;

  if (!type) {
    return NextResponse.json(
      { error: -1, msg: "type is required" },
      { status: 500 }
    );
  }

  if (!["market", "awesome-chatgpt-prompts", "review"].includes(type)) {
    return NextResponse.json(
      { error: -1, msg: "type is error" },
      { status: 500 }
    );
  }

  // If type is review, need login first
  if (type === "review" && !session) {
    return NextResponse.json(
      { error: -1, msg: "Please log in first" },
      { status: 500 }
    );
  }

  try {
    let list: any[] = [];
    if (type === "market" || type === "awesome-chatgpt-prompts") {
      list = await prisma.prompt.findMany({
        where: { type, status: 1 },
      });
    } else if (type === "review") {
      list = await prisma.prompt.findMany({
        where: { type: "market", creatorEmail: session?.user.email, status: 0 },
      });
    }

    list.map((item) => {
      item.creatorName = item.creatorName || item.creatorEmail.split("@")[0];
      delete item.creatorEmail;
      delete item.creator;
    });

    return NextResponse.json({ error: 0, data: { list } }, { status: 200 });
  } catch (error) {
    console.log(error, "get prompt errot");
    return NextResponse.json({ error: -1 }, { status: 500 });
  }
}

// release(or called create) prompt
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  /**
   * If not logged in, only the locally configured API Key can be used.
   */
  if (!session) {
    return NextResponse.json(
      { error: -1, msg: "Please log in first" },
      { status: 500 }
    );
  }

  // Each user can only submit a maximum of 5 pending prompts.
  const count = await prisma.prompt.count({
    where: { type: "market", creatorEmail: session?.user.email, status: 0 },
  });

  if (count >= 5) {
    return NextResponse.json(
      {
        error: -1,
        msg: "Each user can only submit a maximum of 5 pending prompts.",
      },
      { status: 500 }
    );
  }

  const { title, icon, desc, content } = await request.json();

  if (!title?.trim()) {
    return NextResponse.json(
      { error: -1, msg: "title cannot be empty" },
      { status: 500 }
    );
  }
  if (!icon?.trim()) {
    return NextResponse.json(
      { error: -1, msg: "icon cannot be empty" },
      { status: 500 }
    );
  }
  if (!desc?.trim()) {
    return NextResponse.json(
      { error: -1, msg: "desc cannot be empty" },
      { status: 500 }
    );
  }
  if (!content.cn?.trim() && !content.en?.trim()) {
    return NextResponse.json(
      { error: -1, msg: "content cannot be empty" },
      { status: 500 }
    );
  }

  try {
    const params = {
      title,
      icon,
      desc,
      content,
      creator: session.user.id,
      creatorName: session.user.name || "",
      creatorEmail: session.user.email || "",
      status: 0,
      like: 0,
      usageCount: 0,
      type: "market",
    };

    await prisma.prompt.create({
      data: params,
    });

    return NextResponse.json({ error: 0 }, { status: 200 });
  } catch (error) {
    console.log(error, "add prompt error");
    return NextResponse.json({ error: -1, msg: "error" }, { status: 500 });
  }
}
