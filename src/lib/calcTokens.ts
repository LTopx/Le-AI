import { GPTTokens } from "./gpt-tokens";
import type { supportModelType } from "./gpt-tokens";

export const calcTokens = (messages: any[], model: supportModelType) => {
  const tokenInfo = new GPTTokens({ model, messages });

  const { usedTokens, usedUSD } = tokenInfo;

  return { usedTokens, usedUSD };
};
