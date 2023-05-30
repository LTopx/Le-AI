import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { ChatItem } from "@/hooks";

interface ChannelModel {
  supplier: string;
  type: string;
}

export interface IShare {
  channel_model: ChannelModel;
  channel_name?: string;
  channel_prompt?: string;
  chat_content: ChatItem[];
  userId?: string;
  userName?: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { channel_model, channel_name, channel_prompt, chat_content }: IShare =
    await request.json();

  if (!channel_model) {
    return NextResponse.json(
      { error: -1, msg: "channel_model cannot be empty" },
      { status: 500 }
    );
  }

  if (!chat_content?.length) {
    return NextResponse.json(
      { error: -1, msg: "chat_content cannot be empty" },
      { status: 500 }
    );
  }

  // create share
  let params: IShare = {
    channel_model,
    channel_name,
    channel_prompt,
    chat_content,
  };

  // 登录用户加上用户信息，但是可以选择匿名分享
  if (session)
    params = {
      ...params,
      userId: session?.user.id,
      userName: session?.user.name as string,
    };

  try {
    const createShareRes = await prisma.share.create({
      data: params as any,
      select: { id: true },
    });
    return NextResponse.json(
      { error: 0, data: createShareRes },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "create share error");
    return NextResponse.json(
      { error: -1, msg: "create share error" },
      { status: 500 }
    );
  }
}
