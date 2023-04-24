import * as React from "react";
import { useOpenAI } from "@/hooks";
import { ScrollToBottom } from "@/components";
import ChatList from "./ChatList";
import ChatFooter from "./ChatFooter";

const ChatSection: React.FC = () => {
  const [openai] = useOpenAI();

  // only the OpenAI Key or env OpenAI Key Configuration is not empty, show the chat section
  if (!openai.openAIKey && !openai.envOpenAIKey) return null;

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
