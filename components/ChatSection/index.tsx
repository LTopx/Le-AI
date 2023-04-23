import * as React from "react";
import { useOpenAIKey } from "@/hooks";
import { ScrollToBottom } from "@/components";
import ChatList from "./ChatList";
import ChatFooter from "./ChatFooter";

const ChatSection: React.FC = () => {
  const [openAIKey, , envOpenAIKey] = useOpenAIKey();

  // only the OpenAI Key or env OpenAI Key Configuration is not empty, show the chat section
  if (!openAIKey && !envOpenAIKey) return null;

  return (
    <ScrollToBottom
      className="h-full overflow-x-hidden"
      scrollViewClassName="pl-5 pr-20"
      mode="bottom"
      nonce=""
    >
      <ChatList />
      <ChatFooter />
    </ScrollToBottom>
  );
};

export default ChatSection;
