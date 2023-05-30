import * as React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { cn } from "@/lib";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { Share } from "@prisma/client";
import { AiOutlineUser } from "react-icons/ai";
import { SiMicrosoftazure } from "react-icons/si";
import Button from "@/components/ui/Button";
import CopyIcon from "@/components/copyIcon";
import ChatContent from "@/components/chatContent";
import BasicInfo from "@/components/share/basicInfo";
import NotFound from "@/components/share/notFound";
import Continue from "@/components/share/continue";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shareRes: any = await prisma.share.findUnique({
    where: { id: params.id },
  });

  if (!shareRes) return {};

  return {
    title: "L-GPT Share",
    description:
      "L-GPT是一款开源项目，通过提供不同的AI模型来帮助你提高学习、工作、生活的效率。",
    keywords:
      "gpt,gpt-3.5-turbo,gpt-4,azure openai,claude,chat,聊天,LGPT,L-GPT",
    openGraph: {
      title: shareRes.channel_name,
      description: "L-GPT Share Chat",
      siteName: "L-GPT",
      url: "https://gpt.ltopx.com",
    },
    twitter: {
      title: shareRes.channel_name,
      description: "L-GPT Share Chat",
      card: "summary_large_image",
      site: "@peekbomb",
      creator: "@peekbomb",
    },
  };
}

async function getShareData(id: Share["id"]) {
  const shareRes = await prisma.share.findUnique({
    where: { id },
  });

  if (!shareRes) return { content: null, viewsCount: 0 };

  const viewsCount: number | null = await redis.get(id);
  await redis.set(id, viewsCount ? Number(viewsCount) + 1 : 1);

  return { content: shareRes, viewsCount: viewsCount ? viewsCount : 1 };
}

function getTime(timestamp: string) {
  const date = new Date(Number(timestamp));
  let month: any = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day: any = date.getDate();
  day = day < 10 ? "0" + day : day;
  let hour: any = date.getHours();
  hour = hour < 10 ? "0" + hour : hour;
  let minute: any = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  let seconds: any = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `${month}-${day} ${hour}:${minute}:${seconds}`;
}

export default async function Share({ params }: any) {
  const { content, viewsCount } = await getShareData(params.id);
  if (!content) return <NotFound />;

  const { userName, anonymous } = content;

  const shareFrom = userName && !anonymous ? userName : "";

  return (
    <>
      <div className="pb-16">
        <div className="flex flex-col mb-8 gap-2">
          <div className="flex font-semibold text-2xl items-center">
            {content.channel_name}
          </div>
          <div className="text-sm">
            <BasicInfo
              count={viewsCount}
              time={content.createdAt}
              from={shareFrom}
            />
          </div>
          <div>
            <Button type="outline" leftIcon={<SiMicrosoftazure size={14} />}>
              {(content.channel_model as any)?.type}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {content.chat_content.map((item: any) => (
            <div key={item.id} className="flex gap-3 group">
              <div>
                {item.role === "assistant" && (
                  <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
                    <Image src="/gpt.svg" alt="gpt" width={20} height={20} />
                  </div>
                )}
                {item.role === "user" && (
                  <div
                    className={cn(
                      "rounded-full flex h-8 w-8 justify-center items-center",
                      "bg-black/25 dark:bg-slate-50"
                    )}
                  >
                    <AiOutlineUser className="text-white dark:text-neutral-600" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex text-sm text-neutral-500 gap-4 items-center dark:text-neutral-300/90">
                  {getTime(item.time)}
                  <CopyIcon
                    className="transition-colors hover:text-black/90 dark:hover:text-sky-400/90"
                    content={item.content}
                  />
                </div>
                <div
                  className={cn(
                    "self-start py-2.5 px-3 rounded-md relative border border-transparent",
                    { "bg-blue-200/70 dark:bg-blue-900": item.role === "user" },
                    {
                      "bg-neutral-200/60 dark:bg-neutral-800/90 dark:border-neutral-600/60":
                        item.role === "assistant",
                    }
                  )}
                >
                  <ChatContent data={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "fixed left-0 bottom-0 w-full flex justify-center items-center h-24",
          "bg-gradient-to-b from-transparent",
          "via-gray-100 to-gray-100",
          "dark:via-neutral-900 dark:to-neutral-900"
        )}
      >
        <Continue id={params.id} />
      </div>
    </>
  );
}
