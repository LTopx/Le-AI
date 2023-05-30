import * as React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Share } from "@prisma/client";
import CreateChat from "@/components/share/createChat";

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

  return <CreateChat content={content} />;
}
