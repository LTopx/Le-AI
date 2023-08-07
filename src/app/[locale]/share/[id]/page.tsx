import React from "react";
import Image from "next/image";
import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import BackHome from "@/components/share/backHome";
import Title from "@/components/share/title";
import BasicInfo from "@/components/share/basicInfo";
import NotFound from "@/components/share/notFound";
import Continue from "@/components/share/continue";
import Model from "@/components/share/model";
import CopyIcon from "@/components/site/copyIcon";
import ChatContent from "@/components/chatSection/chatContent";
import type { Share } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { checkRedis } from "@/lib/checkEnv";

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

async function getShareData(id: Share["id"]) {
  const shareRes = await prisma.share.findUnique({
    where: { id },
  });

  if (!shareRes) return { content: null, viewsCount: 0 };

  let viewsCount: number | null = null;

  if (checkRedis()) {
    viewsCount = await redis.get(id);
    await redis.set(id, viewsCount ? Number(viewsCount) + 1 : 1);
  }

  return { content: shareRes, viewsCount: viewsCount ? viewsCount : 1 };
}

export default async function Share({ params }: any) {
  const { content, viewsCount } = await getShareData(params.id);

  if (!content) return <NotFound />;

  const { userName, anonymous } = content;

  const shareFrom = userName && !anonymous ? userName : "";

  return (
    <div className="flex flex-col h-full bg-gray-100/60 w-full top-0 left-0 fixed dark:bg-neutral-900">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "bg-white/90 dark:bg-gray-900/50",
          "dark:border-neutral-600"
        )}
      >
        <Logo disabled share version={false} />
        <BackHome />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="m-auto max-w-[75rem] py-6 px-6">
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
              <Model content={content} />
            </div>

            <div className="flex flex-col gap-5">
              {content.chat_content.map((item: any) => (
                <div key={item.id} className="flex gap-3 group">
                  <div>
                    {item.role === "assistant" && (
                      <div className="rounded-full flex bg-[#20a37f] h-8 w-8 justify-center items-center">
                        <Image
                          src="/gpt.svg"
                          alt="gpt"
                          width={20}
                          height={20}
                        />
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
                        {
                          "bg-blue-200/70 dark:bg-blue-900":
                            item.role === "user",
                        },
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
        </div>
      </div>
    </div>
  );
}
