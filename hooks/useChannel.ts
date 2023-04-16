import * as React from "react";
import { create } from "zustand";

export interface ChatItem {
  id: string;
  /** gpt role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
}

export interface ChannelListItem {
  channel_id: string;
  channel_name: string;
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
        const newState = structuredClone({
          activeId: state.activeId,
          list: state.list,
        });
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
    channel_id: "init_channel_id",
    channel_name: "",
    chat_list: [],
  },
];

const getInitChannelList = () => {
  let channelList: ChannelListItem[] = initChannelList;

  try {
    const localChannelList = localStorage.getItem("channelList");
    if (localChannelList && JSON.parse(localChannelList).length) {
      channelList = JSON.parse(localChannelList);
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

const useChannel = (): UseNewChannelReturn => {
  const activeId = useStore((state) => state.activeId);
  const list = useStore((state) => state.list);
  const update = useStore((state) => state.update);

  React.useEffect(() => {
    const initChannelList = getInitChannelList();
    const initActiveId = getInitActiveId(initChannelList);

    update({ activeId: initActiveId, list: initChannelList });
  }, []);

  return [{ activeId, list }, update];
};

export { useChannel };
