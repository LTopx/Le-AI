import React from "react";
import { useDebounceFn } from "ahooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@ltopx/lx-ui";
import { isMobile, cn } from "@/lib";
import { useChannelStore } from "@/hooks/useChannel";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useOpenStore } from "@/hooks/useOpen";
import { useScrollToBottomStore } from "@/hooks/useScrollToBottom";
import { useLLMStore } from "@/hooks/useLLM";
import { checkAuth } from "@/lib/checkEnv";
import { useFetchError } from "@/hooks/useFetchError";
import Handler from "./handler";
import Inputarea from "./inputArea";

export default function ChatFooter() {
  const session = useSession();

  const tGlobal = useTranslations("global");
  const tPrompt = useTranslations("prompt");
  const tCode = useTranslations("code");
  const tPoints = useTranslations("points");
  const tPremium = useTranslations("premium");

  const router = useRouter();
  const { catchError } = useFetchError();

  // data
  const [inputValue, setInputValue] = React.useState<string>("");
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const [openai, azure, openRouter] = useLLMStore((state) => [
    state.openai,
    state.azure,
    state.openRouter,
  ]);
  const LLMOptions = React.useMemo(
    () => [openai, azure, openRouter],
    [openai, azure, openRouter]
  );
  const license_type = useUserInfoStore((state) => state.license_type);

  // ref
  const inputRef = React.useRef<any>(null);

  const findChannel = list.find((item) => item.channel_id === activeId);
  const loadingChannel = !!findChannel?.channel_loading;

  const { run: sendMessage } = useDebounceFn(() => send(), { wait: 200 });

  const addChatItem = useChannelStore((state) => state.addChatItem);
  const getChannelName = useChannelStore((state) => state.getChannelName);
  const sendGPT = useChannelStore((state) => state.sendGPT);
  const scrollToBottom = useScrollToBottomStore(
    (state) => state.scrollToBottom
  );
  const updateChargeTokenOpen = useOpenStore(
    (state) => state.updateChargeTokenOpen
  );
  const updatePremiumOpen = useOpenStore((state) => state.updatePremiumOpen);
  const updateUserInfo = useUserInfoStore((state) => state.update);

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

  const onExceeded = () => window.open("https://docs.le-ai.app/faq");

  const send = async () => {
    if (loadingChannel) return;
    if (!inputValue?.trim()) {
      return toast.error(tGlobal("please-enter"), {
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
      return toast.error(tCode("10003"), { id: "empty-model", duration: 4000 });
    }

    setInputValue("");
    inputRef.current?.reset();

    const chat_list = addChatItem(inputValue);
    if (!chat_list.length) return;

    scrollToBottom();

    try {
      const res: any = await sendGPT(
        chat_list,
        activeId,
        tPrompt("summarize-previous"),
        tPrompt("summarize")
      );

      if (res) {
        const cloneRes = JSON.parse(JSON.stringify(res));
        const newParams = cloneRes.newParams;
        newParams.chat_list.push({
          role: "system",
          content: tPrompt("get-title"),
        });
        delete newParams.prompt;
        // No need to call the plugin function when retrieving the channel name.
        delete newParams.plugins;
        await getChannelName({ ...cloneRes });
      }

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

  React.useEffect(() => {
    inputRef.current?.reset();
    if (!isMobile()) inputRef.current?.focus();
  }, [activeId]);

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute z-50",
        "via-gray-100 to-gray-100",
        "dark:via-neutral-900 dark:to-neutral-900"
      )}
    >
      <Handler />
      <div className="flex">
        <Inputarea
          ref={inputRef}
          value={inputValue}
          loading={loadingChannel}
          onChange={setInputValue}
          onSubmit={sendMessage}
        />
      </div>
    </div>
  );
}
