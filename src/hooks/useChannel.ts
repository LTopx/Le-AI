import * as React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { LLM } from "@/utils/constant";

interface ChannelModel {
  type: string;
  name: string;
}

export type ChannelIcon =
  | "RiChatSmile2Line"
  | "HiOutlineTranslate"
  | "FaBook"
  | "MdMovieEdit";

export interface ChatItem {
  id: string;
  /** gpt role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
}

export interface ChannelListItem {
  channel_id: string;
  channel_icon: ChannelIcon;
  channel_name: string;
  channel_model: ChannelModel;
  channel_prompt: string;
  channel_tokens: number;
  channel_usd: number;
  chat_list: ChatItem[];
}

type State = {
  /** active channel id */
  activeId: string;

  /** channel list */
  list: ChannelListItem[];
};

type SaveChannel = State | ((prev: State) => State);

type Action = {
  update: (args: SaveChannel) => void;
};

type UseChannelReturn = [State, Action["update"]];

const useStore = create<State & Action>((set) => ({
  activeId: "",
  list: [],
  update: async (args: SaveChannel) => {
    if (typeof args === "function") {
      set((state) => {
        const newState = JSON.parse(
          JSON.stringify({
            activeId: state.activeId,
            list: state.list,
          })
        );
        const { activeId, list } = args(newState);
        localStorage.setItem("activeId", activeId);
        localStorage.setItem("channelList", JSON.stringify(list));
        return { activeId, list };
      });
    } else {
      const { activeId, list } = args;
      localStorage.setItem("activeId", activeId);
      localStorage.setItem("channelList", JSON.stringify(list));
      set(() => ({ activeId, list }));
    }
  },
}));

export const initChannelList: ChannelListItem[] = [
  {
    channel_id: uuidv4(),
    channel_icon: "RiChatSmile2Line",
    channel_name: "",
    channel_model: {
      type: LLM[0].value,
      name: LLM[0].models[0].value,
    },
    channel_prompt: "",
    channel_tokens: 0,
    channel_usd: 0,
    chat_list: [],
  },
];

const getInitChannelList = () => {
  let channelList: ChannelListItem[] = initChannelList;

  try {
    const localChannelList = localStorage.getItem("channelList");
    if (localChannelList && JSON.parse(localChannelList).length) {
      // Compatibility with old data
      channelList = JSON.parse(localChannelList).map(
        (item: ChannelListItem) => {
          if (!item.channel_model) {
            item.channel_icon = "RiChatSmile2Line";
            item.channel_model = {
              type: LLM[0].value,
              name: LLM[0].models[0].value,
            };
            item.channel_prompt = "";
          }
          if (!item.channel_tokens) item.channel_tokens = 0;
          if (!item.channel_usd) item.channel_usd = 0;
          return item;
        }
      );
    }
  } catch {}

  return channelList as ChannelListItem[];
};

const getInitActiveId = (channelList: ChannelListItem[]) => {
  const localActiveId = localStorage.getItem("activeId");
  if (localActiveId) {
    const find = channelList.find((item) => item.channel_id === localActiveId);
    if (find) return localActiveId;
  }

  if (channelList.length) return channelList[0].channel_id;

  return "";
};

const useChannel = (): UseChannelReturn => {
  const activeId = useStore((state) => state.activeId);
  const list = useStore((state) => state.list);
  const update = useStore((state) => state.update);

  React.useEffect(() => {
    if (useStore.getState().activeId) return;

    const initChannelList = getInitChannelList();
    const initActiveId = getInitActiveId(initChannelList);

    update({ activeId: initActiveId, list: initChannelList });
  }, []);

  return [{ activeId, list }, update];
};

export { useChannel };
