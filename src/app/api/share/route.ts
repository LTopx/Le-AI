import { getServerSession } from "next-auth/next";
import { ResErr, ResSuccess, isUndefined } from "@/lib";
import { authOptions } from "@/utils/plugin/auth";
import type { ChatItem } from "@/hooks/useChannel/types";
import { prisma } from "@/lib/prisma";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  if (!id) return ResErr({ msg: "id cannot be empty" });

  try {
    const shareRes: any = await prisma.share.findUnique({
      where: { id },
    });

    return ResSuccess({ data: shareRes });
  } catch (error) {
    return ResErr({ msg: "error" });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  const { channel_model, channel_name, channel_prompt, chat_content }: IShare =
    await request.json();

  if (!channel_model) return ResErr({ msg: "channel_model cannot be empty" });
  if (!chat_content?.length) {
    return ResErr({ msg: "chat_content cannot be empty" });
  }

  // create share
  let params: IShare = {
    channel_model,
    channel_name,
    channel_prompt,
    chat_content,
  };

  // Login users can add their user information, but they have the option to share anonymously.
  if (session) {
    params = {
      ...params,
      userId: session?.user.id,
      userName: session?.user.name as string,
    };
  }

  try {
    const createShareRes = await prisma.share.create({
      data: params as any,
      select: { id: true },
    });
    return ResSuccess({ data: createShareRes });
  } catch (error) {
    console.log(error, "create share error");
    return ResErr({ msg: "create share error" });
  }
}

export async function PUT(request: Request) {
  const { id, anonymous } = await request.json();

  if (!id) return ResErr({ msg: "id cannot be empty" });

  try {
    await prisma.share.update({
      data: { anonymous: Number(!!anonymous) },
      where: { id },
    });

    return ResSuccess();
  } catch (error) {
    console.log("update share error", error);
    return ResErr({ msg: "error" });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) return ResErr({ msg: "id cannot be empty" });

  try {
    await prisma.share.delete({ where: { id } });

    return ResSuccess();
  } catch (error) {
    console.log("delete share error", error);
    return ResErr({ msg: "error" });
  }
}
