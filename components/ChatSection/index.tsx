import * as React from "react";
import { useOpenAI } from "@/hooks";
import { ScrollToBottom } from "@/components";
import ChatList from "./ChatList";
import ChatFooter from "./ChatFooter";

const ChatSection: React.FC = () => {
  const [openai] = useOpenAI();

  if (
    !openai.openai.apiKey &&
    !openai.azure.apiKey &&
    !openai.env.OPENAI_API_KEY &&
    !openai.env.AZURE_API_KEY
  )
    return null;

  return (
    <ScrollToBottom
      className="h-full overflow-x-hidden relative"
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
