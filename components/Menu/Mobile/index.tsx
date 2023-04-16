import * as React from "react";
import classNames from "classnames";
import { useDateFormat } from "l-hooks";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChatSquareText } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import { Drawer } from "@/components";
import { useChannel, initChannelList } from "@/hooks";
import { useMobileMenuOpen } from "@/state";

const MobileMenu: React.FC = () => {
  const [channel, setChannel] = useChannel();
  const open = useMobileMenuOpen((state) => state.open);
  const setOpen = useMobileMenuOpen((state) => state.update);

  const { format } = useDateFormat();

  const onClose = () => setOpen(false);

  const onAddChannel = () => {
    const channel_id = uuidv4();
    setChannel((channel) => {
      channel.list.push({
        channel_id,
        channel_name: "",
        chat_list: [],
      });
      channel.activeId = channel_id;
      return channel;
    });
  };

  const onChangeChannel = (id: string) => {
    if (id === channel.activeId) return;
    setChannel((channel) => {
      channel.activeId = id;
      return channel;
    });
    onClose();
  };

  const onDeleteChannel = (e: any, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure delete this conversation?")) return;

    if (channel.list.length <= 1) {
      setChannel((channel) => {
        channel.list = initChannelList;
        channel.activeId = initChannelList[0].channel_id;
        return channel;
      });
    } else {
      setChannel((channel) => {
        channel.list = channel.list.filter((item) => item.channel_id !== id);
        if (id === channel.activeId) {
          channel.activeId = channel.list[0].channel_id;
        }
        return channel;
      });
    }
  };

  return (
    <Drawer className="md:hidden" width="85%" open={open} onClose={onClose}>
      <div className="p-2">
        <div
          onClick={onAddChannel}
          className="rounded-lg cursor-pointer flex bg-[#678fff] h-12 text-white mb-2 transition-colors justify-center items-center hover:bg-[#678fff]/80"
        >
          New Chat
        </div>
        <div className="h-mobileMenu pr-2 overflow-y-auto">
          {channel.list.map((item) => (
            <div
              key={item.channel_id}
              onClick={() => onChangeChannel(item.channel_id)}
              className={classNames(
                "rounded-lg mt-1 cursor-pointer overflow-hidden relative flex flex-col h-16 text-xs text-base-color px-[0.5rem] transition-colors gap-1 group justify-center hover:bg-menu-hover",
                { "!bg-menu-active": item.channel_id === channel.activeId }
              )}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm text-ellipsis max-w-[22ch] pl-5 overflow-hidden whitespace-nowrap relative">
                  <BsChatSquareText className="top-[50%] left-0 translate-y-[-50%] absolute" />
                  {item.channel_name || "New Conversation"}
                </div>
                <div className="transition-opacity text-[#858b96] group-hover:opacity-0">
                  {item.chat_list.length
                    ? item.chat_list.at(-1)?.time
                      ? format(
                          Number(item.chat_list.at(-1)?.time),
                          "MM-DD HH:mm:ss"
                        )
                      : ""
                    : ""}
                </div>
              </div>
              <div className="text-[#858b96] group-hover:text-[#6e737b]">
                {item.chat_list.length} messages
              </div>
              <AiOutlineDelete
                size={20}
                onClick={(e: any) => onDeleteChannel(e, item.channel_id)}
                className="right-2 bottom-1 absolute"
              />
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default MobileMenu;
