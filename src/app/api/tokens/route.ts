import { NextResponse } from "next/server";
import type { ChatItem } from "@/hooks/useChannel";
import { GPTTokens } from "gpt-tokens";
import type { supportModelType } from "gpt-tokens";

/**
 * gpt-tokens Support Models
 * gpt-3.5-turbo
 * gpt-4
 * gpt-4-32k
 */

interface TokensRequest {
  message_list: ChatItem[];
  model: string;
}

const calcModel = (model: string) => {
  if (model === "lgpt-35-turbo") return "gpt-3.5-turbo";
  return model as supportModelType;
};

export async function POST(request: Request) {
  const { message_list, model }: TokensRequest = await request.json();

  if (!message_list?.length) {
    return NextResponse.json(
      { error: -1, msg: "message_list required" },
      { status: 500 }
    );
  }

  if (!model) {
    return NextResponse.json(
      { error: -1, msg: "model required" },
      { status: 500 }
    );
  }

  const tokenInfo = new GPTTokens({
    model: calcModel(model),
    messages: message_list.map((item) => ({
      role: item.role,
      content: item.content,
    })),
  });

  console.log("\n");
  console.log(tokenInfo.usedTokens, "usedTokens");
  console.log(tokenInfo.usedUSD, "usedUSD");
  console.log("\n");
  return NextResponse.json(
    {
      error: 0,
      data: {
        usedTokens: tokenInfo.usedTokens,
        usedUSD: tokenInfo.usedUSD,
      },
    },
    { status: 200 }
  );
}
