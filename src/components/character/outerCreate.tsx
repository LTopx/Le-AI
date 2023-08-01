"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next-intl/client";
import { type Character } from "@/lib/character";
import { initChannelList } from "@/hooks/useChannel";

interface IProps {
  charactor: Character;
}

export default function OuterCreate({ charactor }: IProps) {
  const router = useRouter();

  const init = (charactor: Character) => {
    const localChannelList = localStorage.getItem("channelList");

    const addItem = {
      ...initChannelList[0],
      channel_id: uuidv4(),
      channel_icon: charactor.icon,
      channel_name: charactor.name || "",
      channel_model: {
        type: charactor.model_config.model_type,
        name: charactor.model_config.model_name,
      },
      channel_prompt: charactor.content,
      channel_prompt_name: charactor.name,
      channel_context_length: charactor.model_config.context_length,
    };

    if (!localChannelList) {
      const arr = [addItem];
      localStorage.setItem("channelList", JSON.stringify(arr));
      localStorage.setItem("activeId", addItem.channel_id);
    } else {
      try {
        const parseArr = JSON.parse(localChannelList);
        parseArr.unshift(addItem);
        localStorage.setItem("channelList", JSON.stringify(parseArr));
        localStorage.setItem("activeId", addItem.channel_id);
      } catch (error) {}
    }

    router.replace("/");
  };

  React.useEffect(() => {
    init(charactor);
  }, []);

  return <div>Loading...</div>;
}
