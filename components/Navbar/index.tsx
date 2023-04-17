import * as React from "react";
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
  const [openAIKey] = useOpenAIKey();
  const setMobileMenuOpen = useMobileMenuOpen((state) => state.update);

  const onOpenMenu = () => setMobileMenuOpen(true);

  const onOpenSetting = () => settingRef.current?.init();

  const onChangeTitle = () => changeTitleRef.current?.init();

  const activeChannel = channel.list.find(
    (item) => item.channel_id === channel.activeId
  );

  return (
    <>
      <div className="flex bg-[hsla(0,0%,100%,.8)] h-14 w-full top-0 left-0 z-50 backdrop-saturate-[1.8] backdrop-blur-[5px] absolute justify-center items-center">
        <div
          onClick={onOpenMenu}
          className="flex h-14 left-0 w-14 justify-center items-center absolute md:hidden"
        >
          <AiOutlineMenuUnfold size={24} />
        </div>
        <div
          onClick={onChangeTitle}
          className="text-ellipsis max-w-[50%] cursor-pointer whitespace-nowrap overflow-hidden relative pr-6"
        >
          {openAIKey
            ? activeChannel?.channel_name || tMenu("new-conversation")
            : tNav("set-openai-key")}
          <AiOutlineEdit
            size={20}
            className="absolute right-0 top-[50%] translate-y-[-50%]"
          />
        </div>
        <div
          onClick={onOpenSetting}
          className="cursor-pointer flex h-14 transition-colors right-0 w-14 justify-center items-center absolute hover:text-[#678fff]"
        >
          <AiOutlineSetting size={24} />
        </div>
      </div>
      <Setting ref={settingRef} />
      <ChangeTitle ref={changeTitleRef} />
    </>
  );
};

export default Navbar;
