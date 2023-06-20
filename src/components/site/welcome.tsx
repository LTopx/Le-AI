import * as React from "react";
import { useTranslations } from "next-intl";
import { useOpenAI } from "@/hooks";

/**
 * when the OpenAI Key and env OpenAI Key Configuration are empty, show the welcome page
 */
const Welcome: React.FC = () => {
  const t = useTranslations("welcome");
  const [openai] = useOpenAI();

  if (
    openai.openai.apiKey ||
    openai.azure.apiKey ||
    openai.env.OPENAI_API_KEY ||
    openai.env.AZURE_API_KEY
  )
    return null;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col w-80 md:w-auto">
        <div className="font-bold text-4xl">{t("welcome")}</div>
        <div className="font-black my-3 text-transparent text-4xl">
          <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            L - GPT
          </span>
        </div>
        <div className="text-lg mb-3">{t("desc")}</div>
      </div>
    </div>
  );
};

export default Welcome;
