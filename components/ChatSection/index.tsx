import React from "react";
import { useOpenAIKey } from "@/hooks";
import { ScrollToBottom } from "@/components";
import ChatList from "./ChatList";
import ChatFooter from "./ChatFooter";

const ChatSection: React.FC = () => {
  const [openAIKey] = useOpenAIKey();

  // only the openAI key is not empty, show the chat section
  if (!openAIKey) return null;

  return (
    <ScrollToBottom
      className="h-full overflow-x-hidden"
      scrollViewClassName="px-5"
      mode="bottom"
      nonce=""
    >
      <ChatList />
      <ChatFooter />
    </ScrollToBottom>
  );
};

export default ChatSection;
