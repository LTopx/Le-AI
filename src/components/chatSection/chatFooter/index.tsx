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
import Handler from "./handler";
import Inputarea from "./inputArea";

export default function ChatFooter() {
  const session = useSession();

  const tChat = useTranslations("chat");
  const tRes = useTranslations("responseErr");
  const tAuth = useTranslations("auth");
  const tRecharge = useTranslations("recharge");
  const tPremium = useTranslations("premium");
  const tErrorCode = useTranslations("errorCode");
  const tCommon = useTranslations("common");
  const tPrompt = useTranslations("prompt");

  const router = useRouter();

  // data
  const [inputValue, setInputValue] = React.useState<string>("");
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const [openai, azure] = useLLMStore((state) => [state.openai, state.azure]);
  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);
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

  const onExceeded = () => {
    window.open("https://docs.ltopx.com/conversation-limits");
  };

  const send = async () => {
    if (loadingChannel) return;
    if (!inputValue?.trim()) {
      return toast.error(tChat("enter-message"), {
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

    const chat_list = addChatItem(inputValue);
    if (!chat_list.length) return;

    scrollToBottom();

    try {
      const res: any = await sendGPT(chat_list, activeId);

      if (res) {
        const cloneRes = JSON.parse(JSON.stringify(res));
        const newParams = cloneRes.newParams;
        newParams.chat_list.push({
          role: "system",
          content: tPrompt("get-title"),
        });
        delete newParams.prompt;
        await getChannelName({ ...cloneRes });
      }

      if (session.data) updateUserInfo(2000);
    } catch (errRes: any) {
      let errorMessage = "error";
      if (errRes.error === 10001) {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tRes("10001")}
              {checkAuth() && (
                <Button type="primary" onClick={onLogin}>
                  {tAuth("log-in")}
                </Button>
              )}
            </div>
          ),
          { duration: 5000 }
        );
      } else if (errRes.error === 10002) {
        errorMessage = tRes("10002");
      } else if (errRes.error === 10004) {
        errorMessage = tRes("10004");
      } else if (errRes.error === 10005) {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tRes("10005")}
              <Button type="primary" onClick={onRecharge}>
                {license_type ? tRecharge("recharge") : tPremium("free-trial")}
              </Button>
            </div>
          ),
          { duration: 5000 }
        );
      } else if (errRes.error === 20002) {
        errorMessage = tErrorCode("20002");
      } else if (errRes.error === 20009) {
        errorMessage = tErrorCode("20009");
      } else if (errRes.error === 20010) {
        errorMessage = tErrorCode("20010");
      } else if (errRes.error.code === "context_length_exceeded") {
        return toast(
          () => (
            <div className="flex gap-4 items-center">
              {tRes("context_length_exceeded")}
              <Button type="primary" onClick={onExceeded}>
                {tRes("learn-more")}
              </Button>
            </div>
          ),
          { duration: 5000 }
        );
      } else {
        errorMessage =
          errRes.msg || errRes.error?.message || tCommon("service-error");
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
    <>
      <div
        className={cn(
          "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute",
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
    </>
  );
}
