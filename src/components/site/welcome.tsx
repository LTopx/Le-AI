import React from "react";
import { useTranslations } from "next-intl";
import { useOpenAIStore } from "@/hooks/useOpenAI";

export default function Welcome() {
  const tWelcome = useTranslations("welcome");

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
    [openAIKey, azureKey, openRouterKey, leAIKey, env]
  );

  if (apiKey) return null;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col w-80 md:w-auto">
        <div className="font-bold text-4xl">{tWelcome("welcome")}</div>
        <div className="font-black my-3 text-transparent text-4xl">
          <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            Le - AI
          </span>
        </div>
        <div className="text-lg mb-3">{tWelcome("desc")}</div>
      </div>
    </div>
  );
}
