"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { v4 as uuidv4 } from "uuid";
import { useLLM } from "@/hooks";

interface IProps {
  content: any;
}

const CreateChat: React.FC<IProps> = ({ content }) => {
  const t = useTranslations("share");
  const router = useRouter();
  const { openai, azure } = useLLM();

  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const init = (content: any) => {
    const localChannelList = localStorage.getItem("channelList");

    const channel_model_type = content.channel_model?.supplier || "openai";
    const findModels =
      LLMOptions.find((item) => item.value === channel_model_type)?.models ||
      [];
    const channel_model_name =
      findModels.find((item) => item.label === content.channel_model?.type)
        ?.value || "gpt-3.5-turbo";

    const chat_item = {
      channel_id: uuidv4(),
      channel_icon: "RiChatSmile2Line",
      channel_name: content.channel_name || "",
      channel_model: {
        type: channel_model_type,
        name: channel_model_name,
      },
      channel_prompt: content.channel_prompt || "",
      channel_cost: {
        tokens: 0,
        usd: 0,
        function_tokens: 0,
        function_usd: 0,
        total_tokens: 0,
        total_usd: 0,
      },
      chat_list: content.chat_content ?? [],
    };

    if (!localChannelList) {
      const arr = [chat_item];
      localStorage.setItem("channelList", JSON.stringify(arr));
      localStorage.setItem("activeId", chat_item.channel_id);
    } else {
      try {
        const parseArr = JSON.parse(localChannelList);
        parseArr.push(chat_item);
        localStorage.setItem("channelList", JSON.stringify(parseArr));
        localStorage.setItem("activeId", chat_item.channel_id);
      } catch (error) {}
    }

    router.push("/");
  };

  React.useEffect(() => {
    init(content);
  }, []);

  return <div>{t("create-conversation")}</div>;
};

export default CreateChat;
