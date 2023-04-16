import * as React from "react";
import { useTranslation } from "next-i18next";
import { useMobileMenuOpen } from "@/state";
import { Modal } from "@/components";
import { AiOutlineMenuUnfold, AiOutlineSetting } from "react-icons/ai";
import { useOpenAIKey, useChannel } from "@/hooks";

const Navbar: React.FC = () => {
  const { t: tMenu } = useTranslation("menu");
  const { t: tNav } = useTranslation("nav");
  const [openAIKey, setOpenAIKey] = useOpenAIKey();
  const [channel] = useChannel();
  const [open, setOpen] = React.useState(false);
  const setMobileMenuOpen = useMobileMenuOpen((state) => state.update);

  const settingText = tNav("setting");

  const onOpenMenu = () => setMobileMenuOpen(true);

  const onOpenSetting = () => setOpen(true);

  const onClose = () => setOpen(false);

  const onChange = (e: any) => setOpenAIKey(e.target.value);

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
        <div className="text-ellipsis max-w-[50%] whitespace-nowrap overflow-hidden">
          {openAIKey
            ? activeChannel?.channel_name || tMenu("new-conversation")
            : tNav("set-openai-key")}
        </div>
        <div
          onClick={onOpenSetting}
          className="cursor-pointer flex h-14 transition-colors right-0 w-14 justify-center items-center absolute hover:text-[#678fff]"
        >
          <AiOutlineSetting size={24} />
        </div>
      </div>
      <Modal title={settingText} width={600} open={open} onClose={onClose}>
        <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
          <div className="font-semibold text-sm">API key</div>
          <div className="text-xs">
            <input
              className="border rounded-md p-2"
              type="password"
              placeholder="Set Your OpenAI Key"
              value={openAIKey}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
          <div className="font-semibold text-sm">{tNav("model")}</div>
          <div className="text-xs">
            <select className="border rounded-md p-2">
              <option value="gpt-3.5">gpt-3.5</option>
            </select>
          </div>
        </div>
        <div className="border-b flex border-slate-100 py-2 px-6 items-center justify-between">
          <div className="font-semibold text-sm">{tNav("theme")}</div>
          <div className="text-xs">
            <select className="border rounded-md p-2">
              <option value="auto">auto</option>
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
