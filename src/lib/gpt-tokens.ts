import Decimal from "decimal.js";
import { Tiktoken, getEncoding, encodingForModel } from "js-tiktoken";

/**
 * This is a port of the Python code from
 *
 * https://notebooks.githubusercontent.com/view/ipynb?browser=edge&bypass_fastly=true&color_mode=dark&commit=d67c4181abe9dfd871d382930bb778b7014edc66&device=unknown_device&docs_host=https%3A%2F%2Fdocs.github.com&enc_url=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f6f70656e61692f6f70656e61692d636f6f6b626f6f6b2f643637633431383161626539646664383731643338323933306262373738623730313465646336362f6578616d706c65732f486f775f746f5f636f756e745f746f6b656e735f776974685f74696b746f6b656e2e6970796e62&logged_in=true&nwo=openai%2Fopenai-cookbook&path=examples%2FHow_to_count_tokens_with_tiktoken.ipynb&platform=mac&repository_id=468576060&repository_type=Repository&version=114#6d8d98eb-e018-4e1f-8c9e-19b152a97aaf
 */

// The models supported
export type supportModelType =
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0301"
  | "gpt-4"
  | "gpt-4-0314"
  | "gpt-4-32k"
  | "gpt-4-32k-0314";

// The role types supported
type roleType = "system" | "user" | "assistant";

interface MessageItem {
  name?: string;
  role: roleType;
  content: string;
}

interface Options {
  model: supportModelType;
  messages: MessageItem[];
  debug?: boolean;
}

export class GPTTokens {
  public readonly model!: supportModelType;
  public readonly messages!: MessageItem[];
  private readonly debug!: boolean;

  // https://openai.com/pricing/
  // gpt-3.5-turbo
  // $0.002 / 1K tokens
  public readonly gpt3_5_turboTokenUnit = new Decimal(0.002)
    .div(1000)
    .toNumber();

  // https://openai.com/pricing/
  // gpt-4-8k
  // Prompt: $0.03 / 1K tokens
  //
  public readonly gpt4_8kPromptTokenUnit = new Decimal(0.03)
    .div(1000)
    .toNumber();

  // https://openai.com/pricing/
  // gpt-4-8k
  // Completion: $0.06 / 1K tokens
  // public readonly gpt4_8kCompletionTokenUnit = new Decimal(0.06).div(1000).toNumber()

  // https://openai.com/pricing/
  // gpt-4-32k
  // Prompt: $0.06 / 1K tokens
  public readonly gpt4_32kPromptTokenUnit = new Decimal(0.06)
    .div(1000)
    .toNumber();

  // https://openai.com/pricing/
  // gpt-4-32k
  // Completion: $0.12 / 1K tokens
  // public readonly gpt4_32kCompletionTokenUnit = new Decimal(0.12).div(1000).toNumber()

  // The models supported
  public readonly supportModels: supportModelType[] = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-32k",
    "gpt-4-32k-0314",
  ];

  constructor(options: Options) {
    const { debug = false, model, messages } = options;

    if (!this.supportModels.includes(model))
      throw new Error("Model not supported.");

    this.debug = debug;
    this.model = model;
    this.messages = messages;
  }

  // Used Tokens
  public get usedTokens(): number {
    return this.num_tokens_from_messages(this.messages, this.model);
  }

  // Used USD
  public get usedUSD(): number {
    if (["gpt-3.5-turbo", "gpt-3.5-turbo-0301"].includes(this.model))
      return new Decimal(this.usedTokens)
        .mul(this.gpt3_5_turboTokenUnit)
        .toNumber();

    if (["gpt-4", "gpt-4-0314"].includes(this.model)) {
      // Does not distinguish between Prompt and Completion for the time being
      //
      // const promptUSD = new Decimal(this.promptUsedTokens)
      //     .mul(this.gpt4_8kPromptTokenUnit)
      // const completionUSD = new Decimal(this.completionUsedTokens)
      //     .mul(this.gpt4_8kCompletionTokenUnit)
      //
      // return promptUSD.add(completionUSD).toNumber()

      return new Decimal(this.usedTokens)
        .mul(new Decimal(this.gpt4_8kPromptTokenUnit))
        .toNumber();
    }

    if (["gpt-4-32k", "gpt-4-32k-0314"].includes(this.model)) {
      // Does not distinguish between Prompt and Completion for the time being
      //
      // const promptUSD     = new Decimal(this.promptUsedTokens)
      //     .mul(this.gpt4_32kPromptTokenUnit)
      // const completionUSD = new Decimal(this.completionUsedTokens)
      //     .mul(this.gpt4_32kCompletionTokenUnit)
      //
      // return promptUSD.add(completionUSD).toNumber()

      return new Decimal(this.usedTokens)
        .mul(new Decimal(this.gpt4_32kPromptTokenUnit))
        .toNumber();
    }

    throw new Error("Model not supported.");
  }

  // private get promptUsedTokens (): number {
  //     const messages = this.messages.filter(item => item.role !== 'assistant')
  //
  //     return this.num_tokens_from_messages(messages, this.model)
  // }
  //
  // private get completionUsedTokens (): number {
  //     const messages = this.messages.filter(item => item.role === 'assistant')
  //
  //     return this.num_tokens_from_messages(messages, this.model) - 3
  // }

  /**
   * Print a warning message.
   * @param message The message to print. Will be prefixed with "Warning: ".
   * @returns void
   */
  private warning(message: string): void {
    if (!this.debug) return;

    console.warn("Warning:", message);
  }

  /**
   * Return the number of tokens in a list of messages.
   * @param messages A list of messages.
   * @param model The model to use for encoding.
   * @returns The number of tokens in the messages.
   * @throws If the model is not supported.
   */
  private num_tokens_from_messages(
    messages: MessageItem[],
    model: supportModelType
  ): number {
    if (model === "gpt-3.5-turbo") {
      this.warning(
        "gpt-3.5-turbo may change over time. Returning num tokens assuming gpt-3.5-turbo-0301."
      );

      return this.num_tokens_from_messages(messages, "gpt-3.5-turbo-0301");
    }

    if (model === "gpt-4") {
      /**
       * https://help.openai.com/en/articles/7127966-what-is-the-difference-between-the-gpt-4-models
       *
       * Secondly, gpt-4 will refer to our most up-to-date model (and gpt-4-32k for the latest 32k-context model).
       * If you're interested in using a previous snapshot of the model, you can refer to the specific date in the model name, such as gpt-4-0314 or gpt-4-32k-0314.
       * The March 14th snapshot will be available until June 14th.
       */
      this.warning(
        "gpt-4 may change over time. Returning num tokens assuming gpt-4-0314."
      );

      return this.num_tokens_from_messages(messages, "gpt-4-0314");
    }

    if (model === "gpt-4-32k") {
      /**
       * https://help.openai.com/en/articles/7127966-what-is-the-difference-between-the-gpt-4-models
       *
       * Secondly, gpt-4 will refer to our most up-to-date model (and gpt-4-32k for the latest 32k-context model).
       * If you're interested in using a previous snapshot of the model, you can refer to the specific date in the model name, such as gpt-4-0314 or gpt-4-32k-0314.
       * The March 14th snapshot will be available until June 14th.
       */
      this.warning(
        "gpt-4-32k may change over time. Returning num tokens assuming gpt-4-32k-0314."
      );

      return this.num_tokens_from_messages(messages, "gpt-4-32k-0314");
    }

    let encoding!: Tiktoken;
    let tokens_per_message!: number;
    let tokens_per_name!: number;
    let num_tokens = 0;

    try {
      encoding = encodingForModel(model);
    } catch (e) {
      this.warning("model not found. Using cl100k_base encoding.");

      encoding = getEncoding("cl100k_base");
    }

    if (model === "gpt-3.5-turbo-0301") {
      tokens_per_message = 4;
      tokens_per_name = -1;
    }

    if (["gpt-4-0314", "gpt-4-32k-0314"].includes(model)) {
      tokens_per_message = 3;
      tokens_per_name = 1;
    }

    // Python 2 Typescript by gpt-4
    for (const message of messages) {
      num_tokens += tokens_per_message;

      for (const [key, value] of Object.entries(message)) {
        num_tokens += encoding.encode(value as string).length;
        if (key === "name") {
          num_tokens += tokens_per_name;
        }
      }
    }

    return num_tokens + 3;
  }
}
