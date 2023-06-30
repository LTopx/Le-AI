"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import type { ChatItem } from "@/hooks/useChannel";
import { useChannel, useLLM, useScrollToBottom, BASE_PROMPT } from "@/hooks";
import { useChatGPT } from "@/hooks/useChatGPT";
import Icon from "@/components/icon";
import { Button, Confirm } from "@/components/ui";
import { isMobile, cn } from "@/lib";
import type { IShare } from "@/app/api/share/route";
import Action from "@/components/share/action";
import Inputarea from "./inputArea";

const ChatFooter: React.FC = () => {
  // data
  const { send: sendChatGPT, abort } = useChatGPT();
  const [channel, setChannel] = useChannel();
  const { openai, azure } = useLLM();
  const [inputValue, setInputValue] = React.useState<string>("");
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
  const [loadingShare, setLoadingShare] = React.useState(false);

  // ref
  const inputRef = React.useRef<any>(null);
  const actionRef = React.useRef<any>(null);

  const t = useTranslations("chat");
  const tShare = useTranslations("share");
  const tMenu = useTranslations("menu");
  const tCommon = useTranslations("common");
  const tRes = useTranslations("responseErr");
  const { scrollToBottom } = useScrollToBottom();

  const { run: sendMessage } = useDebounceFn(() => send(), { wait: 200 });
  const { run: cancel } = useDebounceFn(() => onCancel(), { wait: 200 });

  const findChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );
  const loadingChannel = !!findChannel?.channel_loading;

  const onCancel = () => {
    if (!loadingChannel) return;
    toast.error(t("canceled"));
    abort(findChannel.channel_id);
  };

  const send = async () => {
    if (loadingChannel) return;
    if (!inputValue?.trim()) {
      return toast.error(t("enter-message"), {
        id: "empty-message",
        duration: 2000,
      });
    }
    // check model params
    const modelName = findChannel?.channel_model.name;
    const findModel = LLMOptions.find((item) => {
      return item.models.find((val) => val.value === modelName);
    });
    if (!findModel) {
      return toast.error(tRes("10003"), { id: "empty-model", duration: 4000 });
    }

    setInputValue("");
    inputRef.current?.reset();
    let chat_list: ChatItem[] = [];
    setChannel((channel) => {
      const { list, activeId } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.chat_list.push({
        id: uuidv4(),
        role: "user",
        time: String(+new Date()),
        content: inputValue,
      });
      chat_list = findCh.chat_list;
      return channel;
    });
    if (!chat_list.length) return;

    sendChatGPT(chat_list, findChannel?.channel_id as string);

    scrollToBottom();
  };

  const clearNowConversation = () => {
    setChannel((channel) => {
      const { activeId, list } = channel;
      const findCh = list.find((item) => item.channel_id === activeId);
      if (!findCh) return channel;
      findCh.channel_icon = "RiChatSmile2Line";
      findCh.chat_list = [];
      findCh.channel_name = "";
      findCh.channel_prompt = BASE_PROMPT;
      findCh.channel_cost = {
        tokens: 0,
        usd: 0,
        function_tokens: 0,
        function_usd: 0,
        total_tokens: 0,
        total_usd: 0,
      };
      findCh.channel_loading_connect = false;
      findCh.channel_loading = false;
      return channel;
    });
  };

  // share functions
  const handleShare = () => {
    if (!findChannel) return;

    const findModels =
      LLMOptions.find((e) => e.value === findChannel.channel_model.type)
        ?.models || [];

    const findType = findModels.find(
      (e) => e.value === findChannel.channel_model.name
    )?.label;

    if (!findType) {
      return toast.error(tShare("model-error"), { id: "model-error" });
    }

    const params: IShare = {
      channel_model: {
        supplier: findChannel.channel_model.type,
        type: findType,
      },
      channel_name: findChannel.channel_name,
      channel_prompt: findChannel.channel_prompt,
      chat_content: findChannel.chat_list,
    };

    setLoadingShare(true);
    fetch("/api/share", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error || !res.data?.id) {
          return toast.error(res.msg || tCommon("service-error"), {
            id: "share-error",
          });
        }
        toast.success(tShare("share-success"), { id: "share-success" });
        actionRef.current?.init(res.data.id);
      })
      .finally(() => {
        setLoadingShare(false);
      });
  };

  React.useEffect(() => {
    setInputValue("");
    inputRef.current?.reset();
    if (!isMobile()) inputRef.current?.focus();
  }, [channel.activeId]);

  return (
    <>
      <div
        className={cn(
          "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute",
          "via-gray-100 to-gray-100",
          "dark:via-neutral-900 dark:to-neutral-900"
        )}
      >
        <div className="flex py-2 gap-2 justify-center items-center">
          {!!findChannel?.chat_list?.length && (
            <>
              {loadingChannel && (
                <Button
                  className="rounded-full"
                  type="danger"
                  onClick={cancel}
                  leftIcon={<Icon icon="stop_fill" size={18} />}
                >
                  {t("stop-generate")}
                </Button>
              )}

              <Button
                className="rounded-full"
                type="outline"
                leftIcon={<Icon icon="share_2_line" size={18} />}
                loading={loadingShare}
                onClick={handleShare}
              >
                {tShare("share")}
              </Button>
            </>
          )}

          <Button
            className="rounded-full"
            type="success"
            onClick={() => window.open("https://docs.ltopx.com", "_blank")}
            leftIcon={<Icon icon="document_line" size={18} />}
          >
            {tCommon("docs")}
          </Button>
        </div>

        <div className="flex">
          <div className="flex items-end">
            <Confirm
              disabled={loadingChannel}
              title={tMenu("clear-all-conversation")}
              content={t("clear-current-conversation")}
              trigger={
                <div
                  className={cn(
                    "w-8 h-[2.75rem] flex items-center cursor-pointer transition-colors",
                    "text-black/90 hover:text-sky-400",
                    "dark:text-white/90 dark:hover:text-sky-400/90"
                  )}
                >
                  {loadingChannel ? (
                    <Icon
                      className="animate-spin"
                      icon="loading_line"
                      size={24}
                    />
                  ) : (
                    <Icon icon="broom_line" size={24} />
                  )}
                </div>
              }
              onOk={clearNowConversation}
            />
          </div>
          <Inputarea
            ref={inputRef}
            value={inputValue}
            loading={loadingChannel}
            onChange={setInputValue}
            onSubmit={sendMessage}
          />
        </div>
      </div>
      <Action ref={actionRef} />
    </>
  );
};

export default ChatFooter;
