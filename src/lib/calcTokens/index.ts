import { GPTTokens } from "./old_gpt-tokens";
import type { supportModelType } from "./old_gpt-tokens";

export const calcTokens = (
  messages: any[],
  model: supportModelType,
  plus?: boolean
) => {
  // plus only for openai gpt-3.5-turbo
  // not for azure gpt-3.5-turbo
  // 《25% cost reduction on input tokens for gpt-3.5-turbo》

  const tokenInfo = new GPTTokens({ model, messages, plus: !!plus });

  const { usedTokens, usedUSD } = tokenInfo;

  return { usedTokens, usedUSD };
};
