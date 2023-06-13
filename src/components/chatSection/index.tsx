"use client";

import * as React from "react";
import { useOpenAI } from "@/hooks";
import ScrollToBottoms from "@/components/scrollToBottoms";
import ChatList from "./chatList";
import ChatFooter from "./chatFooter";

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
    <ScrollToBottoms
      className="h-full overflow-x-hidden relative"
      scrollViewClassName="pl-5 pr-20"
      mode="bottom"
      nonce=""
    >
      <ChatList />
      <ChatFooter />
    </ScrollToBottoms>
  );
};

export default ChatSection;
