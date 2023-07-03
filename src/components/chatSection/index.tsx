import React from "react";
import { useOpenAI, useScrollToBottom } from "@/hooks";
import ChatList from "./chatList";
import ChatFooter from "./chatFooter";
import ConversationSetting from "../conversationSetting";

const ChatSection: React.FC = () => {
  const [openai] = useOpenAI();
  const { updateScrollEle } = useScrollToBottom();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dom = scrollRef.current;
    if (dom) {
      updateScrollEle(dom);
      requestAnimationFrame(() => dom.scrollTo(0, dom.scrollHeight));
    }
  }, [scrollRef.current]);

  if (
    !openai.openai.apiKey &&
    !openai.azure.apiKey &&
    !openai.env.OPENAI_API_KEY &&
    !openai.env.AZURE_API_KEY
  )
    return null;

  return (
    <>
      <div className="h-[100%] overflow-x-hidden relative">
        <div className="h-[100%] pr-10 pl-5 overflow-y-auto" ref={scrollRef}>
          <ChatList />
          <ChatFooter />
        </div>
      </div>
      <ConversationSetting />
    </>
  );
};

export default ChatSection;
