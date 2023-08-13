import { GPTTokens } from "./gpt-tokens";
import type { supportModelType } from "./gpt-tokens";

const supportModels: supportModelType[] = [
  "gpt-3.5-turbo-0301",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k",
  "gpt-3.5-turbo-16k-0613",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-0613",
  "gpt-4-32k",
  "gpt-4-32k-0314",
  "gpt-4-32k-0613",
];

const transformModel = (model: string) => {
  if (supportModels.includes(model as supportModelType)) {
    return {
      model,
      promptTokenRatio: 1,
      completionTokenRatio: 1,
    };
  }

  if (model === "Claude Instant v1") {
    return {
      model: "gpt-3.5-turbo",
      promptTokenRatio: 1.087,
      completionTokenRatio: 2.755,
    };
  }
  if (model === "Claude v2") {
    return {
      model: "gpt-3.5-turbo",
      promptTokenRatio: 7.347,
      completionTokenRatio: 16.34,
    };
  }
  if (model === "PaLM 2 Bison") {
    return {
      model: "gpt-3.5-turbo",
      promptTokenRatio: 1.333,
      completionTokenRatio: 1,
    };
  }
  if (model === "Llama v2 13B") {
    return {
      model: "gpt-3.5-turbo",
      promptTokenRatio: 2.667,
      completionTokenRatio: 2,
    };
  }
  if (model === "Llama v2 70B") {
    return {
      model: "gpt-3.5-turbo",
      promptTokenRatio: 10.667,
      completionTokenRatio: 8,
    };
  }

  return {
    model: "gpt-3.5-turbo",
    promptTokenRatio: 1,
    completionTokenRatio: 1,
  };
};

export const calcTokens = (messages: any[], modelLabel: supportModelType) => {
  const { model, promptTokenRatio, completionTokenRatio } =
    transformModel(modelLabel);

  const tokenInfo = new GPTTokens({
    model: model as supportModelType,
    messages,
    promptTokenRatio,
    completionTokenRatio,
  });

  const { usedTokens, usedUSD } = tokenInfo;

  return { usedTokens, usedUSD };
};
