import React from "react";
import { useSession } from "next-auth/react";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@ltopx/lx-ui";
import { useChannelStore } from "@/hooks/useChannel";
import { useLLMStore } from "@/hooks/useLLM";
import { useScrollToBottomStore } from "@/hooks/useScrollToBottom";
import type { ChatItem, ChannelListItem } from "@/hooks/useChannel/types";
import { useTTSStore } from "@/hooks/useTTS";
import { useOpenStore } from "@/hooks/useOpen";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { cn, calcTokens } from "@/lib";
import type { supportModelType } from "@/lib/calcTokens/gpt-tokens";
import { checkAuth, checkTTS } from "@/lib/checkEnv";
import { useFetchError } from "@/hooks/useFetchError";
import Avatar from "./avatar";
import Handler from "./handler";
import ChatConfigure from "../chatConfigure";
import ChatContent from "../chatContent";
import ChatTTS from "../chatTTS";

export default function ChatList() {
  const format = useFormatter();
  const session = useSession();
  const router = useRouter();

  const tGlobal = useTranslations("global");
  const tPrompt = useTranslations("prompt");
  const tCode = useTranslations("code");
  const tPoints = useTranslations("points");
  const tPremium = useTranslations("premium");

  const { catchError } = useFetchError();

  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const azure = useLLMStore((state) => state.azure);
  const license_type = useUserInfoStore((state) => state.license_type);

  const findChannel = list.find((item) => item.channel_id === activeId);
  const chatList = findChannel?.chat_list || [];

  const updateList = useChannelStore((state) => state.updateList);
  const sendGPT = useChannelStore((state) => state.sendGPT);
  const clearSummarize = useChannelStore((state) => state.clearSummarize);
  const speak = useTTSStore((state) => state.speak);
  const pause = useTTSStore((state) => state.pause);
  const updateTTSOpen = useOpenStore((state) => state.updateTtsSettingOpen);
  const updateUserInfo = useUserInfoStore((state) => state.update);
  const updateChargeTokenOpen = useOpenStore(
    (state) => state.updateChargeTokenOpen
  );
  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);

  const { run } = useDebounceFn((item) => onDelete(item), {
    wait: 100,
  });

  const scrollToBottom = useScrollToBottomStore(
    (state) => state.scrollToBottom
  );

  const onDelete = (item: ChatItem) => {
    const { id, is_summarized } = item;
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;
    findCh.chat_list = findCh.chat_list.filter((item) => item.id !== id);

    if (is_summarized) {
      findCh.channel_summarize = "";
      findCh.chat_list.forEach((item) => {
        if (item.is_summarized) item.is_summarized = false;
      });
    }

    const channel_model = findCh.channel_model;

    let calcModel = channel_model.name;
    const findAzureModel = azure.models.find(
      (item) => item.value === calcModel
    );
    if (findAzureModel) calcModel = findAzureModel.label;
    const messages = findCh.chat_list.map((item) => ({
      role: item.role,
      content: item.content,
    }));

    if (messages.length) {
      const { usedTokens, usedUSD } = calcTokens(
        messages,
        calcModel as supportModelType
      );

      findCh.channel_cost.tokens = usedTokens;
      findCh.channel_cost.usd = Number(usedUSD.toFixed(5));
    } else {
      findCh.channel_cost.tokens = 0;
      findCh.channel_cost.usd = 0;
    }

    updateList(newList);
  };

  const onLogin = () => {
    toast.dismiss();
    router.push("/login");
  };

  const onRecharge = () => {
    toast.dismiss();
    if (!license_type) {
      // start free trial
      updatePremiumOpen(true);
    } else {
      updateChargeTokenOpen(true);
    }
  };

  const onExceeded = () => {
    window.open("https://docs.le-ai.app/faq");
  };

  const onRegenerate = async (item: ChatItem) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;

    const { channel_loading, channel_loading_connect, chat_list } = findCh;
    if (channel_loading || channel_loading_connect) return;

    const findIndex = chat_list.findIndex((val) => val.id === item.id);

    let arr: ChatItem[] = [];
    if (item.role === "assistant") {
      arr = chat_list.slice(0, findIndex);
    } else if (item.role === "user") {
      arr = chat_list.slice(0, findIndex + 1);
    }
    if (!arr.length) return;

    findCh.chat_list = arr;
    updateList(newList);

    try {
      await sendGPT(
        arr,
        activeId,
        tPrompt("summarize-previous"),
        tPrompt("summarize")
      );

      if (session.data) updateUserInfo(2000);
    } catch (errRes: any) {
      let errorMessage = "error";
      if (errRes.error === 10001) {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tCode("10001")}
              {checkAuth() && (
                <Button type="primary" onClick={onLogin}>
                  {tGlobal("sign-in")}
                </Button>
              )}
            </div>
          ),
          { duration: 5000 }
        );
      } else if (errRes.error === 10002) {
        errorMessage = tCode("10002");
      } else if (errRes.error === 10004) {
        errorMessage = tCode("10004");
      } else if (errRes.error === 10005) {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tCode("10005")}
              <Button type="primary" onClick={onRecharge}>
                {license_type ? tPoints("recharge") : tPremium("free-trial")}
              </Button>
            </div>
          ),
          { duration: 5000 }
        );
      } else if (errRes.error.code === "context_length_exceeded") {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tGlobal("context-length-exceeded")}
              <Button type="primary" onClick={onExceeded}>
                {tGlobal("learn-more")}
              </Button>
            </div>
          ),
          { duration: 5000 }
        );
      } else {
        errorMessage =
          errRes.msg || errRes.error?.message || catchError(errRes);
      }
      toast.error(errorMessage, { duration: 4000 });
      return;
    }
  };

  const onRead = (item: ChatItem, channel_id: string) => {
    if (license_type !== "premium" && license_type !== "team") {
      return toast.error(tGlobal("license-check-error"), {
        id: "license_type_error",
      });
    }

    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === channel_id);
    if (!findCh) return;

    findCh.chat_list.forEach((val) => {
      val.tts_loading = val.id === item.id;
    });
    updateList(newList);

    speak(item.content, () => {
      const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
      const findCh = newList.find((item) => item.channel_id === channel_id);
      if (!findCh) return;
      const findChat = findCh.chat_list.find((val) => val.id === item.id);
      if (!findChat) return;
      findChat.tts_loading = false;
      updateList(newList);
    });
  };

  const onPause = (item: ChatItem, channel_id: string) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === channel_id);
    if (!findCh) return;
    const findChat = findCh.chat_list.find((val) => val.id === item.id);
    if (!findChat) return;
    findChat.tts_loading = false;
    updateList(newList);
    pause();
  };

  const onReSummarize = () => clearSummarize(activeId);

  React.useEffect(() => {
    pause();

    if (findChannel) {
      // 切换频道时看当前列表是否有 ttsLoading
      const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
      const findCh = newList.find((item) => item.channel_id === activeId);
      if (findCh?.chat_list?.length) {
        const findTTSLoading = findCh.chat_list.find(
          (item) => item.tts_loading
        );
        if (findTTSLoading) {
          findCh.chat_list.forEach((val) => {
            val.tts_loading = false;
          });
          updateList(newList);
        }
      }
    }

    scrollToBottom();
  }, [activeId]);

  return (
    <>
      {!chatList.length && findChannel && (
        <ChatConfigure list={list} channel={findChannel} />
      )}
      <div className="flex flex-col mt-5 gap-5">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={cn("flex gap-3 group", { "mt-12": index === 0 })}
          >
            <Avatar role={item.role} model={findChannel?.channel_model} />
            <div className="flex flex-col gap-1">
              <div className="flex text-sm text-neutral-500 gap-4 items-center dark:text-neutral-300/90">
                {format.dateTime(new Date(Number(item.time)), {
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
                <Handler
                  item={item}
                  content={item.content}
                  onDelete={() => run(item)}
                  onRegenerate={() => onRegenerate(item)}
                  onReSummarize={onReSummarize}
                />
              </div>
              <div
                className={cn(
                  "self-start py-2.5 px-3 rounded-lg relative border border-transparent group/item",
                  {
                    "bg-blue-200/70 dark:bg-blue-700/70": item.role === "user",
                  },
                  {
                    "bg-neutral-200/60 dark:bg-zinc-900/50 dark:border-neutral-600/60":
                      item.role === "assistant",
                  }
                )}
              >
                <ChatContent data={item} />
                {item.role === "assistant" && checkTTS() && (
                  <ChatTTS
                    data={item}
                    disabled={
                      !!(
                        findChannel?.channel_loading ||
                        findChannel?.channel_loading_connect
                      )
                    }
                    onRead={() =>
                      onRead(item, findChannel?.channel_id as string)
                    }
                    onPause={() =>
                      onPause(item, findChannel?.channel_id as string)
                    }
                    onTTSSetting={() => updateTTSOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {!!findChannel?.channel_loading_connect && (
          <Loader2 className="ml-11 h-6 w-6 animate-spin text-sky-400 dark:text-sky-400/90" />
        )}
      </div>
      <div className="h-32 overflow-hidden" />
    </>
  );
}
