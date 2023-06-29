import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { cn } from "@/lib";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import type { Share } from "@prisma/client";
import CopyIcon from "@/components/site/copyIcon";
import ChatContent from "@/components/chatContent";
import BasicInfo from "@/components/share/basicInfo";
import NotFound from "@/components/share/notFound";
import Continue from "@/components/share/continue";
import Title from "@/components/share/title";
import Button from "@/components/ui/Button";

type Props = {
  params: { id: string };
};

const UserFill = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <g fill="none">
      <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <path
        fill="currentColor"
        d="M12 13c2.396 0 4.575.694 6.178 1.671c.8.49 1.484 1.065 1.978 1.69c.486.616.844 1.352.844 2.139c0 .845-.411 1.511-1.003 1.986c-.56.45-1.299.748-2.084.956c-1.578.417-3.684.558-5.913.558s-4.335-.14-5.913-.558c-.785-.208-1.524-.506-2.084-.956C3.41 20.01 3 19.345 3 18.5c0-.787.358-1.523.844-2.139c.494-.625 1.177-1.2 1.978-1.69C7.425 13.694 9.605 13 12 13Zm0-11a5 5 0 1 1 0 10a5 5 0 0 1 0-10Z"
      />
    </g>
  </svg>
);

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
            <Title name={content.channel_name} />
          </div>
          <div className="text-sm">
            <BasicInfo
              count={viewsCount}
              time={content.createdAt}
              from={shareFrom}
            />
          </div>
          <div>
            <Button
              type="outline"
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#71a697"
                    d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91a6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9a6.046 6.046 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206a5.99 5.99 0 0 0 3.997-2.9a6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355l-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085l-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z"
                  />
                </svg>
              }
            >
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
                    <UserFill
                      size={18}
                      className="text-white dark:text-neutral-600"
                    />
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
