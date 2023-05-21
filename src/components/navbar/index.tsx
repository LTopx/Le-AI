import * as React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { AiOutlineMenuUnfold, AiOutlineEdit } from "react-icons/ai";
import { useChannel, useOpenAI, useMobileMenu } from "@/hooks";
import Avatar from "@/components/auth/avatar";
import ChangeTitle from "./changeTitle";
import { LLM } from "@/utils/constant";

const Navbar: React.FC = () => {
  const changeTitleRef = React.useRef<any>(null);
  const tMenu = useTranslations("menu");
  const tSetting = useTranslations("setting");
  const [channel] = useChannel();
  const [openai] = useOpenAI();

  const [, setMobileMenuVisible] = useMobileMenu();

  const apiKey =
    openai.openai.apiKey ||
    openai.azure.apiKey ||
    openai.env.OPENAI_API_KEY ||
    openai.env.AZURE_API_KEY;

  const onOpenMenu = () => setMobileMenuVisible(true);

  const onChangeTitle = () => {
    if (
      !openai.openai.apiKey &&
      !openai.azure.apiKey &&
      !openai.env.OPENAI_API_KEY &&
      !openai.env.AZURE_API_KEY
    )
      return;
    changeTitleRef.current?.init();
  };

  const activeChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const renderIcon = () => {
    if (!activeChannel?.chat_list?.length) return null;

    const icon = LLM.find(
      (item) => item.value === activeChannel?.channel_model.type
    )?.ico;

    return (
      (
        <div className="absolute left-0 top-[50%] translate-y-[-50%]">
          {icon}
        </div>
      ) || null
    );
  };

  return (
    <>
      <div
        className={clsx(
          "flex h-14 w-full top-0 left-0 z-50 absolute justify-center items-center backdrop-blur-sm transition-colors",
          "bg-white/90 dark:bg-gray-900/50"
        )}
      >
        <div
          onClick={onOpenMenu}
          className={clsx(
            "flex h-14 left-0 w-14 justify-center items-center absolute cursor-pointer transition-colors md:hidden",
            "text-black/90 hover:text-sky-400",
            "dark:text-white/90 dark:hover:text-sky-400/90"
          )}
        >
          <AiOutlineMenuUnfold size={22} />
        </div>
        <div
          onClick={onChangeTitle}
          className={clsx(
            "text-ellipsis group max-w-[60%] cursor-pointer whitespace-nowrap overflow-hidden relative transition-colors",
            { "pr-6": !!apiKey, "pl-6": !!renderIcon() },
            "text-slate-700 hover:text-slate-900",
            "dark:text-slate-400 dark:hover:text-slate-300"
          )}
        >
          {renderIcon()}

          {apiKey ? (
            <span className="group-hover:underline">
              {activeChannel?.channel_name || tMenu("new-conversation")}
            </span>
          ) : (
            tSetting("set-api-key")
          )}

          {!!apiKey && (
            <AiOutlineEdit
              size={18}
              className={clsx(
                "absolute right-0 top-[50%] translate-y-[-50%] transition-colors",
                "group-hover:text-sky-400",
                "dark:hover:text-sky-400/90"
              )}
            />
          )}
        </div>
        <Avatar />
      </div>
      <ChangeTitle ref={changeTitleRef} />
    </>
  );
};

export default Navbar;
