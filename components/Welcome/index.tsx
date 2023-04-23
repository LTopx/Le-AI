import * as React from "react";
import { useTranslation } from "next-i18next";
import { useOpenAIKey } from "@/hooks";

/**
 * when the OpenAI Key and env OpenAI Key Configuration are empty, show the welcome page
 */
const Welcome: React.FC = () => {
  const { t } = useTranslation("welcome");
  const [openAIKey, , envOpenAIKey] = useOpenAIKey();

  if (openAIKey || envOpenAIKey) return null;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col w-80 md:w-auto">
        <div className="font-bold text-4xl">{t("welcome")}</div>
        <div className="mt-5 text-lg mb-3">{t("desc")}</div>
        <div className="mb-3 text-gray-500">{t("set-openai-key")}</div>
        <div className="text-gray-500 flex gap-2">
          {t("apply-openai-key")}
          <a
            className="text-blue-500 hover:underline"
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
          >
            openai.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
