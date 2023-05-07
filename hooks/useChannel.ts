import * as React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { AI_MODELS } from "@/utils/models";

export interface ChatModel {
  type: string;
  name: string;
}

export interface ChatItem {
  id: string;
  /** gpt role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
}

export interface ChannelListItem {
  channel_id: string;
  channel_icon: string;
  channel_name: string;
  channel_model: ChatModel;
  channel_prompt: string;
  chat_list: ChatItem[];
}

type State = {
  /** active channel id */
  activeId: string;

  /** channel list data */
  list: ChannelListItem[];
};

type SaveChannel = State | ((prev: State) => State);

type Action = {
  update: (args: SaveChannel) => void;
};

export type UseNewChannelReturn = [State, Action["update"]];

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
      type: AI_MODELS[0].value,
      name: AI_MODELS[0].models[0].value,
    },
    channel_prompt: "",
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
              type: AI_MODELS[0].value,
              name: AI_MODELS[0].models[0].value,
            };
            item.channel_prompt = "";
          }
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

let isInit = false;

const useChannel = (): UseNewChannelReturn => {
  const activeId = useStore((state) => state.activeId);
  const list = useStore((state) => state.list);
  const update = useStore((state) => state.update);

  React.useEffect(() => {
    if (isInit) return;
    isInit = true;
    const initChannelList = getInitChannelList();
    const initActiveId = getInitActiveId(initChannelList);

    update({ activeId: initActiveId, list: initChannelList });
  }, []);

  return [{ activeId, list }, update];
};

export { useChannel };
