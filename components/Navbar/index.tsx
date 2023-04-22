import * as React from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useMobileMenuOpen } from "@/state";
import {
  AiOutlineMenuUnfold,
  AiOutlineSetting,
  AiOutlineEdit,
} from "react-icons/ai";
import { useChannel, useOpenAIKey } from "@/hooks";
import Setting from "./setting";
import ChangeTitle from "./changeTitle";

const Navbar: React.FC = () => {
  const settingRef = React.useRef<any>(null);
  const changeTitleRef = React.useRef<any>(null);
  const { t: tMenu } = useTranslation("menu");
  const { t: tNav } = useTranslation("nav");
  const [channel] = useChannel();
  const [openAIKey, , envOpenAIKey] = useOpenAIKey();
  const setMobileMenuOpen = useMobileMenuOpen((state) => state.update);

  const onOpenMenu = () => setMobileMenuOpen(true);

  const onOpenSetting = () => settingRef.current?.init();

  const onChangeTitle = () => {
    if (!openAIKey && !envOpenAIKey) return;
    changeTitleRef.current?.init();
  };

  const activeChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  return (
    <>
      <div
        className={classNames(
          "flex h-14 w-full top-0 left-0 z-50 absolute justify-center items-center backdrop-blur-sm transition-colors",
          "bg-white/90 dark:bg-gray-900/50"
        )}
      >
        <div
          onClick={onOpenMenu}
          className={classNames(
            "flex h-14 left-0 w-14 justify-center items-center absolute cursor-pointer transition-colors md:hidden",
            "text-black/90 hover:text-sky-400",
            "dark:text-white/90 dark:hover:text-sky-400/90"
          )}
        >
          <AiOutlineMenuUnfold size={22} />
        </div>
        <div
          onClick={onChangeTitle}
          className={classNames(
            "text-ellipsis group max-w-[50%] cursor-pointer whitespace-nowrap overflow-hidden relative pr-6",
            "text-black/90",
            "dark:text-white/90"
          )}
        >
          {openAIKey || envOpenAIKey
            ? activeChannel?.channel_name || tMenu("new-conversation")
            : tNav("set-openai-key")}
          {!!(openAIKey || envOpenAIKey) && (
            <AiOutlineEdit
              size={18}
              className={classNames(
                "absolute right-0 top-[50%] translate-y-[-50%] transition-colors",
                "group-hover:text-sky-400",
                "dark:hover:text-sky-400/90"
              )}
            />
          )}
        </div>
        <div
          onClick={onOpenSetting}
          className={classNames(
            "cursor-pointer flex h-14 transition-colors right-0 w-14 justify-center items-center absolute",
            "text-black/90 hover:text-sky-400",
            "dark:text-white/90 dark:hover:text-sky-400/90"
          )}
        >
          <AiOutlineSetting size={22} />
        </div>
      </div>
      <Setting ref={settingRef} />
      <ChangeTitle ref={changeTitleRef} />
    </>
  );
};

export default Navbar;
