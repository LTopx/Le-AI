export interface ChannelModel {
  type: string;
  name: string;
}

export type ChannelIcon =
  | "RiChatSmile2Line"
  | "HiOutlineTranslate"
  | "FaBook"
  | "MdMovieEdit"
  | "AiFillAlert"
  | "BsVectorPen"
  | "TbSailboat"
  | "BsCodeSlash"
  | "AngelFill"
  | "UnlockLine"
  | "DocumentLine"
  | "GameLine";

export interface ChannelCost {
  // Single session cost for storing current content
  tokens: number;
  usd: number;

  // Functional Consumption. Including get title.
  function_tokens: number;
  function_usd: number;

  // Overall consumption of storage for the current session content
  total_tokens: number;
  total_usd: number;
}

export interface ChatItem {
  id: string;
  /** gpt Role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
  tts_loading?: boolean;
  is_summarized?: boolean;
}

export interface ChannelListItem {
  channel_id: string;
  channel_icon: ChannelIcon;
  channel_name: string;
  channel_model: ChannelModel;
  channel_prompt: string;
  channel_prompt_name: string;
  channel_cost: ChannelCost;
  channel_loading_connect: boolean;
  channel_loading: boolean;
  channel_context_length: number;
  channel_plugins: string[];
  channel_summarize: string;
  channel_summarize_threshold: number;
  chat_list: ChatItem[];
}
