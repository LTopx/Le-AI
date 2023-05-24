import * as React from "react";
import { cn } from "@/lib";
import { useTranslations } from "next-intl";
import { AiOutlineMenuUnfold, AiOutlineEdit } from "react-icons/ai";
import { useChannel, useOpenAI, useMobileMenu } from "@/hooks";
import Avatar from "@/components/auth/avatar";
import ChangeTitle from "./changeTitle";
import Token from "./token";
import { LLM } from "@/utils/constant";

const Navbar: React.FC = () => {
  const changeTitleRef = React.useRef<any>(null);
  const tokenRef = React.useRef<any>(null);
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

  const onCheckToken = () => tokenRef.current?.init();

  const activeChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  const renderIcon = () => {
    const icon = LLM.find(
      (item) => item.value === activeChannel?.channel_model.type
    )?.ico;

    if (!icon) return null;

    return (
      <div className="absolute left-0 top-[50%] translate-y-[-50%]">{icon}</div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "flex h-14 w-full top-0 left-0 z-50 absolute justify-center items-center backdrop-blur-sm transition-colors",
          "bg-white/90 dark:bg-gray-900/50"
        )}
      >
        <div
          onClick={onOpenMenu}
          className={cn(
            "flex h-14 left-0 w-14 justify-center items-center absolute cursor-pointer transition-colors md:hidden",
            "text-black/90 hover:text-sky-400",
            "dark:text-white/90 dark:hover:text-sky-400/90"
          )}
        >
          <AiOutlineMenuUnfold size={22} />
        </div>
        <div className="max-w-[60%] relative h-full">
          <div
            onClick={onChangeTitle}
            className={cn(
              "group font-semibold cursor-pointer relative transition-colors text-ellipsis whitespace-nowrap overflow-hidden",
              { "pr-6": !!apiKey, "pl-6": !!renderIcon() },
              "text-slate-700 hover:text-slate-900",
              "dark:text-slate-400 dark:hover:text-slate-300",
              {
                "top-2": !!activeChannel?.channel_usd,
                "top-[50%] translate-y-[-50%]": !activeChannel?.channel_usd,
              }
            )}
          >
            {renderIcon()}

            {apiKey ? (
              <span className="transition-colors group-hover:text-sky-400 dark:group-hover:text-sky-400/90">
                {activeChannel?.channel_name || tMenu("new-conversation")}
              </span>
            ) : (
              tSetting("set-api-key")
            )}

            {!!apiKey && (
              <AiOutlineEdit
                size={18}
                className={cn(
                  "absolute right-0 top-[50%] translate-y-[-50%] transition-colors",
                  "group-hover:text-sky-400",
                  "dark:hover:text-sky-400/90"
                )}
              />
            )}
          </div>
          {!!activeChannel?.channel_usd && (
            <div
              onClick={onCheckToken}
              className={cn(
                "text-xs absolute text-neutral-400 transition-colors left-[50%] translate-x-[-50%] bottom-1 px-2.5 py-0.5 rounded-full",
                "hover:bg-neutral-200 hover:text-neutral-900",
                "dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
              )}
            >
              <div className="cursor-pointer select-none whitespace-nowrap">
                <span>${activeChannel.channel_usd}</span>
                <span> / </span>
                <span>{`${activeChannel.channel_tokens} Tokens`}</span>
              </div>
            </div>
          )}
        </div>

        <Avatar />
      </div>
      <ChangeTitle ref={changeTitleRef} />
      <Token ref={tokenRef} />
    </>
  );
};

export default Navbar;
