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
        <div className="font-black text-4xl my-3 text-transparent">
          <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            L - GPT
          </span>
        </div>
        <div className="text-lg mb-3">{t("desc")}</div>
        <div className="mb-3 text-gray-500">{t("set-openai-key")}</div>
        <div className="text-gray-500 mb-3">
          {t("apply-openai-key")}
          <a
            className="text-blue-500 hover:underline ml-2"
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
          >
            openai.com
          </a>
        </div>
        <div className="text-gray-500">
          {t("apply-azure-key")}
          <a
            className="text-blue-500 hover:underline ml-2"
            href="https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUOFA5Qk1UWDRBMjg0WFhPMkIzTzhKQ1dWNyQlQCN0PWcu&culture=en-us&country=us"
            target="_blank"
          >
            customervoice.microsoft.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
