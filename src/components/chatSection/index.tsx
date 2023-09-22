import React from "react";
import { useScrollToBottomStore } from "@/hooks/useScrollToBottom";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import ChatList from "./chatList";
import ChatFooter from "./chatFooter";

export default function ChatSection() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [openAIKey, azureKey, openRouterKey, leAIKey, env] = useOpenAIStore(
    (state) => [
      state.openai.apiKey,
      state.azure.apiKey,
      state.openRouter.apiKey,
      state.leAIKey,
      state.env,
    ]
  );

  const apiKey = React.useMemo(
    () =>
      openAIKey ||
      azureKey ||
      openRouterKey ||
      leAIKey ||
      env.OPENAI_API_KEY ||
      env.AZURE_API_KEY,
    [openAIKey, azureKey, openRouterKey, env]
  );

  const updateScrollEle = useScrollToBottomStore(
    (state) => state.updateScrollEle
  );

  React.useEffect(() => {
    const dom = scrollRef.current;
    if (dom) {
      updateScrollEle(dom);
      requestAnimationFrame(() => dom.scrollTo(0, dom.scrollHeight));
    }
  }, [scrollRef.current]);

  if (!apiKey) return null;

  return (
    <div className="h-full overflow-x-hidden relative">
      <div className="h-[100%] pr-10 pl-5 overflow-y-auto" ref={scrollRef}>
        <ChatList />
        <ChatFooter />
      </div>
    </div>
  );
}
