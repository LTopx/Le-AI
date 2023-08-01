import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";
import { BASE_PROMPT } from "@/utils/constant";
import { isUndefined } from "@/lib";
import { calcTokens } from "@/lib/calcTokens";
import { useLLMStore } from "../useLLM";
import { useOpenAIStore } from "../useOpenAI";
import { useUserInfoStore } from "../useUserInfo";
import { useTTSStore } from "../useTTS";
import { useScrollToBottomStore } from "../useScrollToBottom";
import type { ChannelListItem, ChatItem, ChannelIcon } from "./types";
import { streamDecoder } from "@/lib/streamDecoder";
import { type Character } from "@/lib/character";

type ChannelStore = {
  activeId: string;
  list: ChannelListItem[];
  abort: any;

  updateActiveId: (activeId: string) => void;
  updateList: (list: ChannelListItem[]) => void;
  addList: (item: ChannelListItem) => void;
  deleteList: (id: string) => void;
  clearItem: () => void;
  addChatItem: (content: string) => ChatItem[];
  updateCharacter: (item: Character) => void;
  sendGPT: (chat_list: ChatItem[], channel_id: string) => Promise<void>;
  getChannelName: (params: any) => Promise<void>;
  cancelGPT: (channel_id: string) => void;
};

export const initChannelList: ChannelListItem[] = [
  {
    channel_id: uuidv4(),
    channel_icon: "RiChatSmile2Line",
    channel_name: "",
    channel_model: {
      type: "openai",
      name: "gpt-3.5-turbo",
    },
    channel_prompt: BASE_PROMPT,
    channel_prompt_name: "system",
    channel_cost: {
      tokens: 0,
      usd: 0,
      function_tokens: 0,
      function_usd: 0,
      total_tokens: 0,
      total_usd: 0,
    },
    channel_loading_connect: false,
    channel_loading: false,
    channel_context_length: 8,
    chat_list: [],
  },
];

const getInitChannelList = () => {
  let channelList: ChannelListItem[] = initChannelList;

  try {
    const localChannelList = localStorage.getItem("channelList");
    if (localChannelList && JSON.parse(localChannelList).length) {
      channelList = JSON.parse(localChannelList).map(
        (item: ChannelListItem) => {
          if (!item.channel_model) {
            item.channel_icon = "RiChatSmile2Line";
            item.channel_model = {
              type: "openai",
              name: "gpt-3.5-turbo",
            };
            item.channel_prompt = "";
            item.channel_prompt_name = "";
          }
          if (!item.channel_cost) {
            item.channel_cost = {
              tokens: 0,
              usd: 0,
              function_tokens: 0,
              function_usd: 0,
              total_tokens: 0,
              total_usd: 0,
            };
          }
          if (!item.channel_prompt) item.channel_prompt = BASE_PROMPT;
          if (!item.channel_prompt_name) item.channel_prompt_name = "system";

          item.channel_loading_connect = false;
          item.channel_loading = false;

          item.chat_list.forEach((item) => {
            item.tts_loading = false;
          });

          if (isUndefined(item.channel_context_length)) {
            item.channel_context_length = 8;
          }

          return item;
        }
      );
    }
  } catch {}

  return channelList as ChannelListItem[];
};

const getInitActiveId = (channelList: ChannelListItem[]) => {
  const localActiveId = localStorage.getItem("activeId");
  if (localActiveId) {
    const find = channelList.find((item) => item.channel_id === localActiveId);
    if (find) return localActiveId;
  }

  if (channelList.length) return channelList[0].channel_id;

  return "";
};

export const useChannelStore = createWithEqualityFn<ChannelStore>(
  (set) => ({
    activeId: "",
    list: [],
    abort: {},

    updateActiveId: (activeId) => {
      localStorage.setItem("activeId", activeId);
      set({ activeId });
    },
    updateList: (list) => {
      localStorage.setItem("channelList", JSON.stringify(list));
      set({ list });
    },
    addList: (item) => {
      set((state) => {
        try {
          const list = [item, ...state.list];
          const activeId = item.channel_id;
          localStorage.setItem("channelList", JSON.stringify(list));
          localStorage.setItem("activeId", activeId);
          return { list, activeId };
        } catch (error) {
          localStorage.setItem("channelList", JSON.stringify(state.list));
          return { list: state.list };
        }
      });
    },
    deleteList: (id) => {
      set((state) => {
        if (state.list.length <= 1) {
          const activeId = initChannelList[0].channel_id;
          localStorage.setItem("channelList", JSON.stringify(initChannelList));
          localStorage.setItem("activeId", activeId);
          return { activeId, list: initChannelList };
        } else {
          const list = state.list.filter((item) => item.channel_id !== id);
          localStorage.setItem("channelList", JSON.stringify(list));
          if (id === state.activeId) {
            const activeId = list[0].channel_id;
            localStorage.setItem("activeId", activeId);
            return { list, activeId };
          }
          return { list };
        }
      });
    },
    clearItem: () => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        // If the user selects a certain role, the character-related content
        // will not be cleared when clearing the conversation.
        if (findCh.channel_prompt_name === "system") {
          findCh.channel_name = "";
          findCh.channel_icon = "RiChatSmile2Line";
          findCh.channel_prompt = BASE_PROMPT;
          findCh.channel_prompt_name = "system";
        }

        findCh.chat_list = [];
        findCh.channel_cost = {
          tokens: 0,
          usd: 0,
          function_tokens: 0,
          function_usd: 0,
          total_tokens: 0,
          total_usd: 0,
        };
        findCh.channel_loading_connect = false;
        findCh.channel_loading = false;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },
    addChatItem: (content) => {
      let chat_list: ChatItem[] = [];

      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};
        findCh.chat_list.push({
          id: uuidv4(),
          role: "user",
          time: String(+new Date()),
          content,
        });

        chat_list = findCh.chat_list;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });

      return chat_list;
    },
    updateCharacter: (item) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};
        findCh.channel_icon = item.icon as ChannelIcon;
        findCh.channel_name = item.name;
        findCh.channel_prompt_name = item.name;
        findCh.channel_prompt = item.content;
        findCh.channel_model = {
          type: item.model_config.model_type,
          name: item.model_config.model_name,
        };
        findCh.channel_context_length = item.model_config.context_length;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },
    sendGPT: (chat_list, channel_id) => {
      return new Promise((resolve, reject) => {
        let modelType: any;
        let modelConfig: any;
        let prompt: any;
        let findCh: ChannelListItem | undefined;

        const LLMStore = useLLMStore.getState();
        const OpenAIStore = useOpenAIStore.getState();

        const { decoder } = streamDecoder();

        set((state) => {
          const newList: ChannelListItem[] = JSON.parse(
            JSON.stringify(state.list)
          );
          findCh = newList.find((item) => item.channel_id === channel_id);
          if (!findCh) return {};
          modelType = findCh.channel_model.type;
          modelConfig = (OpenAIStore as any)[modelType];
          prompt = findCh.channel_prompt || BASE_PROMPT;
          if (!findCh.channel_prompt) findCh.channel_prompt = BASE_PROMPT;
          findCh.channel_loading_connect = true;
          findCh.channel_loading = true;

          localStorage.setItem("channelList", JSON.stringify(newList));

          return { list: newList };
        });

        if (!findCh) return;

        const controller = new AbortController();
        set((state) => {
          return { abort: { ...state.abort, [channel_id]: controller } };
        });

        const fetchUrl = `/api/${modelType}`;

        const findModelLabel = (LLMStore as any)[modelType].models.find(
          (item: any) => item.value === findCh?.channel_model.name
        );

        let params: any = {
          model: findCh.channel_model.name,
          modelLabel: findModelLabel.label,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.max_tokens,
          prompt,
        };
        if (modelType === "openai") {
          params.proxy = modelConfig.proxy;
        } else if (modelType === "azure") {
          params.resourceName = modelConfig.resourceName;
        }

        const sliceStart =
          chat_list.length - (1 + findCh.channel_context_length);

        const arr = chat_list
          .map((item) => ({
            role: item.role,
            content: item.content,
          }))
          .slice(sliceStart <= 0 ? 0 : sliceStart, chat_list.length);

        params.chat_list = arr;

        fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: modelConfig.apiKey,
          },
          signal: controller.signal,
          body: JSON.stringify(params),
        }).then(async (response) => {
          // loading connect end
          set((state) => {
            const newList: ChannelListItem[] = JSON.parse(
              JSON.stringify(state.list)
            );
            findCh = newList.find((item) => item.channel_id === channel_id);
            if (!findCh) return {};
            findCh.channel_loading_connect = false;

            localStorage.setItem("channelList", JSON.stringify(newList));

            return { list: newList };
          });

          if (!response.ok || !response.body) {
            const errRes = await response.json();

            set((state) => {
              const newList: ChannelListItem[] = JSON.parse(
                JSON.stringify(state.list)
              );
              findCh = newList.find((item) => item.channel_id === channel_id);
              if (!findCh) return {};
              findCh.channel_loading = false;

              localStorage.setItem("channelList", JSON.stringify(newList));

              return { list: newList };
            });

            return reject(errRes);
          }

          await decoder(
            response.body.getReader(),
            (content: string) => {
              set((state) => {
                const newList: ChannelListItem[] = JSON.parse(
                  JSON.stringify(state.list)
                );
                const findCh = newList.find(
                  (item) => item.channel_id === channel_id
                );
                if (!findCh) return {};
                const lastItem = findCh.chat_list.at(-1);
                if (!lastItem) return {};
                if (lastItem.role === "user") {
                  findCh.chat_list.push({
                    id: uuidv4(),
                    role: "assistant",
                    time: String(+new Date()),
                    content,
                  });
                } else {
                  lastItem.content += content;
                }

                useScrollToBottomStore.getState().scrollToBottom();

                localStorage.setItem("channelList", JSON.stringify(newList));

                return { list: newList };
              });
            },
            (error: any) => {
              reject(error);
            }
          );

          set((state) => {
            const newList: ChannelListItem[] = JSON.parse(
              JSON.stringify(state.list)
            );
            findCh = newList.find((item) => item.channel_id === channel_id);
            if (!findCh) return {};

            const findLast = findCh.chat_list.at(-1);

            if (
              (useUserInfoStore.getState().license_type === "premium" ||
                useUserInfoStore.getState().license_type === "team") &&
              useTTSStore.getState().autoPlay !== "0" &&
              findLast?.role === "assistant"
            ) {
              findLast.tts_loading = true;
              useTTSStore.getState().speak(findLast.content, () => {
                set((state) => {
                  const newList: ChannelListItem[] = JSON.parse(
                    JSON.stringify(state.list)
                  );
                  const findCh = newList.find(
                    (item) => item.channel_id === channel_id
                  );
                  if (!findCh) return {};
                  const findChat = findCh.chat_list.find(
                    (val) => val.id === findLast.id
                  );
                  if (!findChat) return {};
                  findChat.tts_loading = false;

                  localStorage.setItem("channelList", JSON.stringify(newList));

                  return { list: newList };
                });
              });
            }

            // end channel loading
            findCh.channel_loading = false;

            if (!findCh.channel_cost) {
              findCh.channel_cost = {
                tokens: 0,
                usd: 0,
                function_tokens: 0,
                function_usd: 0,
                total_tokens: 0,
                total_usd: 0,
              };
            }

            const { usedTokens, usedUSD } = calcTokens(
              [
                { role: "system", content: findCh.channel_prompt },
                ...findCh.chat_list.map((item) => ({
                  role: item.role,
                  content: item.content,
                })),
              ],
              findModelLabel.label
            );

            findCh.channel_cost.tokens = usedTokens;
            findCh.channel_cost.usd = Number(usedUSD.toFixed(5));

            const total_tokens: any =
              findCh.channel_cost.total_tokens + usedTokens;
            const total_usd = findCh.channel_cost.total_usd + usedUSD;
            findCh.channel_cost.total_tokens = parseInt(total_tokens);
            findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

            // get conversation title
            if (!findCh.channel_name) {
              const newParams = { ...params, chat_list: findCh.chat_list };
              resolve({
                channel_id,
                newParams,
                fetchUrl,
                apiKey: modelConfig.apiKey,
                findModelLabel,
              } as any);
            } else {
              resolve();
            }

            localStorage.setItem("channelList", JSON.stringify(newList));

            return { list: newList };
          });
        });
      });
    },
    getChannelName: (params) => {
      return new Promise((resolve, reject) => {
        const { decoder } = streamDecoder();

        const newParams = params.newParams;
        newParams.chat_list = newParams.chat_list.map((item: any) => ({
          role: item.role,
          content: item.content,
        }));

        fetch(params.fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: params.apiKey,
          },
          body: JSON.stringify(newParams),
        }).then(async (response) => {
          if (!response.ok || !response.body) return reject("error");
          await decoder(
            response.body.getReader(),
            (content: string) => {
              set((state) => {
                const newList: ChannelListItem[] = JSON.parse(
                  JSON.stringify(state.list)
                );
                const findCh = newList.find(
                  (item) => item.channel_id === params.channel_id
                );
                if (!findCh) return {};
                findCh.channel_name += content;
                localStorage.setItem("channelList", JSON.stringify(newList));
                return { list: newList };
              });
            },
            (error) => reject(error)
          );

          set((state) => {
            const newList: ChannelListItem[] = JSON.parse(
              JSON.stringify(state.list)
            );
            const findCh = newList.find(
              (item) => item.channel_id === params.channel_id
            );
            if (!findCh) return {};

            const { usedTokens, usedUSD } = calcTokens(
              [
                ...newParams.chat_list,
                { role: "assistant", content: findCh.channel_name },
              ],
              params.findModelLabel.label
            );

            findCh.channel_cost.function_tokens += usedTokens;
            const function_usd = findCh.channel_cost.function_usd + usedUSD;
            findCh.channel_cost.function_usd = Number(function_usd.toFixed(5));

            const total_tokens: any =
              findCh.channel_cost.total_tokens + usedTokens;
            const total_usd = findCh.channel_cost.total_usd + usedUSD;
            findCh.channel_cost.total_tokens = parseInt(total_tokens);
            findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

            resolve();

            localStorage.setItem("channelList", JSON.stringify(newList));

            return { list: newList };
          });
        });
      });
    },
    cancelGPT: (channel_id) => {
      set((state) => {
        if (!state.abort[channel_id]) return {};
        state.abort[channel_id].abort();
        delete state.abort[channel_id];

        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find((item) => item.channel_id === channel_id);
        if (findCh) {
          if (!findCh.channel_cost) {
            findCh.channel_cost = {
              tokens: 0,
              usd: 0,
              function_tokens: 0,
              function_usd: 0,
              total_tokens: 0,
              total_usd: 0,
            };
          }

          const LLMStore = useLLMStore.getState();

          const findModelLabel = (LLMStore as any)[
            findCh.channel_model.type
          ].models.find(
            (item: any) => item.value === findCh?.channel_model.name
          );

          const { usedTokens, usedUSD } = calcTokens(
            [
              { role: "system", content: findCh.channel_prompt },
              ...findCh.chat_list.map((item) => ({
                role: item.role,
                content: item.content,
              })),
            ],
            findModelLabel.label
          );

          findCh.channel_cost.tokens = usedTokens;
          findCh.channel_cost.usd = Number(usedUSD.toFixed(5));

          const total_tokens: any =
            findCh.channel_cost.total_tokens + usedTokens;
          const total_usd = findCh.channel_cost.total_usd + usedUSD;
          findCh.channel_cost.total_tokens = parseInt(total_tokens);
          findCh.channel_cost.total_usd = Number(total_usd.toFixed(5));

          findCh.channel_loading_connect = false;
          findCh.channel_loading = false;
        }

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { abort: state.abort, list: newList };
      });
    },
  }),
  shallow
);

export const useChannelInit = () => {
  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);

  const init = () => {
    const initChannelList = getInitChannelList();
    const initActiveId = getInitActiveId(initChannelList);

    updateList(initChannelList);
    updateActiveId(initActiveId);
  };

  return init;
};
