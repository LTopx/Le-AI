import React from "react";
import { notFound } from "next/navigation";
import Logo from "@/components/site/logo";
import { cn } from "@/lib";
import CreateChat from "@/components/share/createChat";
import { prisma } from "@/lib/prisma";
import type { Share } from "@prisma/client";

type Props = {
  params: { id: string };
};

async function getShareData(id: Share["id"]) {
  const shareRes = await prisma.share.findUnique({
    where: { id },
  });

  if (!shareRes) return null;

  return shareRes;
}

export default async function Create({ params }: Props) {
  const id = params.id;
  if (!id) return notFound();

  const content = await getShareData(id);

  if (!content) return notFound();

  return (
    <div className="flex flex-col h-full bg-gray-100/60 w-full top-0 left-0 fixed dark:bg-neutral-900">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "bg-white/90 dark:bg-gray-900/50",
          "dark:border-neutral-600"
        )}
      >
        <Logo disabled />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="m-auto max-w-[75rem] py-6 px-6">
          <CreateChat content={content} />
        </div>
      </div>
    </div>
  );
}
