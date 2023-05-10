import * as React from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { AiOutlineMenuUnfold, AiOutlineEdit } from "react-icons/ai";
import { useChannel, useOpenAI, useMobileMenu } from "@/hooks";
import ChangeTitle from "./changeTitle";

const Navbar: React.FC = () => {
  const changeTitleRef = React.useRef<any>(null);
  const tMenu = useTranslations("menu");
  const tSetting = useTranslations("setting");
  const [channel] = useChannel();
  const [openai] = useOpenAI();

  const [, setMobileMenuVisible] = useMobileMenu();

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
            "text-ellipsis group max-w-[50%] cursor-pointer whitespace-nowrap overflow-hidden relative",
            {
              "pr-6": !!(
                openai.openai.apiKey ||
                openai.azure.apiKey ||
                openai.env.OPENAI_API_KEY ||
                openai.env.AZURE_API_KEY
              ),
            },
            "text-black/90",
            "dark:text-white/90"
          )}
        >
          {openai.openai.apiKey ||
          openai.azure.apiKey ||
          openai.env.OPENAI_API_KEY ||
          openai.env.AZURE_API_KEY
            ? activeChannel?.channel_name || tMenu("new-conversation")
            : tSetting("set-api-key")}

          {!!(
            openai.openai.apiKey ||
            openai.azure.apiKey ||
            openai.env.OPENAI_API_KEY ||
            openai.env.AZURE_API_KEY
          ) && (
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
      </div>
      <ChangeTitle ref={changeTitleRef} />
    </>
  );
};

export default Navbar;
