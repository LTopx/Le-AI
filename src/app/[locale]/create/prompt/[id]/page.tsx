import React from "react";
import { notFound } from "next/navigation";
import { characters, type Character, type Characters } from "@/lib/character";
import OuterCreate from "@/components/character/outerCreate";

type Props = {
  params: { id: string };
};

export default function CreatePrompt({ params }: Props) {
  const id = params.id;
  if (!id) return notFound();

  let characterLists: Character[] = [];

  Object.keys(characters).forEach((key) => {
    characterLists = [
      ...characterLists,
      ...characters[key as keyof Characters],
    ];
  });

  const findCharacter = characterLists.find((item) => item.id === id);

  if (!findCharacter) return notFound();

  return <OuterCreate charactor={findCharacter} />;
}
