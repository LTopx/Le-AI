import React from "react";
import { useOpenAIKey } from "@/hooks";

/**
 * when the OpenAI Key in empty, show the welcome page
 */
const Welcome: React.FC = () => {
  const [openAIKey] = useOpenAIKey();

  if (openAIKey) return null;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col w-80 md:w-auto">
        <div className="font-bold text-4xl">Welcome to L-GPT</div>
        <div className="mt-5 text-lg mb-3">
          L-GPT is an open-source project that imitates the OpenAI ChatGPT. The
          theme adopts the style of Feishu.
        </div>
        <div className="mb-3 text-gray-500">
          Please set your OpenAI API Key in the top right of the navbar.
        </div>
        <div className="text-gray-500">
          If you don't have an OpenAI API Key, you can get one here:{" "}
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
