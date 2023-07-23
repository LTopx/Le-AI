import { useChannelStore } from "@/hooks/useChannel";
import type { ChannelListItem, ChatItem } from "@/hooks/useChannel/types";

export const useChatGPT = () => {
  const updateList = useChannelStore((state) => state.updateList);

  const sendGPT = (chat_list: ChatItem[], channel_id: string) => {
    let modelType: any;
    let modelConfig: any;
    let prompt: any;
    let findCh: ChannelListItem | undefined;
  };

  return { sendGPT };
};
