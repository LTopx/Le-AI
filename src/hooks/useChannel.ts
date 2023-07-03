import React from "react";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { isUndefined } from "@/lib";
import { BASE_PROMPT } from "./usePrompt";

interface ChannelModel {
  type: string;
  name: string;
}

export type ChannelIcon =
  | "RiChatSmile2Line"
  | "HiOutlineTranslate"
  | "FaBook"
  | "MdMovieEdit"
  | "AiFillAlert"
  | "BsVectorPen"
  | "TbSailboat"
  | "BsCodeSlash";

export interface ChannelCost {
  // Single session cost for storing current content
  tokens: number;
  usd: number;

  // Functional Consumption. Including get title.
  function_tokens: number;
  function_usd: number;

  // Overall consumption of storage for the current session content
  total_tokens: number;
  total_usd: number;
}

export interface ChatItem {
  id: string;
  /** gpt Role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
  tts_loading?: boolean;
}

export interface ChannelListItem {
  channel_id: string;
  channel_icon: ChannelIcon;
  channel_name: string;
  channel_model: ChannelModel;
  channel_prompt: string;
  channel_cost: ChannelCost;
  channel_loading_connect: boolean;
  channel_loading: boolean;
  channel_context_length: number;
  chat_list: ChatItem[];
}

type UseChannelState = {
  /** active channel id */
  activeId: string;

  /** channel list */
  list: ChannelListItem[];
};

type SaveChannel =
  | UseChannelState
  | ((prev: UseChannelState) => UseChannelState);

type UseChannelAction = {
  update: (args: SaveChannel) => void;
};

type UseChannelReturn = [UseChannelState, UseChannelAction["update"]];

const useStore = create<UseChannelState & UseChannelAction>((set) => ({
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
      type: "openai",
      name: "gpt-3.5-turbo",
    },
    channel_prompt: BASE_PROMPT,
    channel_cost: {
      tokens: 0,
      usd: 0,
      function_tokens: 0,
      function_usd: 0,
      total_tokens: 0,
      total_usd: 0,
    },
    channel_loading_connect: false,
    channel_loading: false,
    channel_context_length: 8,
    chat_list: [],
  },
];

const getInitChannelList = () => {
  let channelList: ChannelListItem[] = initChannelList;

  try {
    const localChannelList = localStorage.getItem("channelList");
    if (localChannelList && JSON.parse(localChannelList).length) {
      channelList = JSON.parse(localChannelList).map(
        (item: ChannelListItem) => {
          if (!item.channel_model) {
            item.channel_icon = "RiChatSmile2Line";
            item.channel_model = {
              type: "openai",
              name: "gpt-3.5-turbo",
            };
            item.channel_prompt = "";
          }
          if (!item.channel_cost) {
            item.channel_cost = {
              tokens: 0,
              usd: 0,
              function_tokens: 0,
              function_usd: 0,
              total_tokens: 0,
              total_usd: 0,
            };
          }
          if (!item.channel_prompt) item.channel_prompt = BASE_PROMPT;

          item.channel_loading_connect = false;
          item.channel_loading = false;

          item.chat_list.forEach((item) => {
            item.tts_loading = false;
          });

          if (isUndefined(item.channel_context_length)) {
            item.channel_context_length = 8;
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
