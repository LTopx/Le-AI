import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";
import { BASE_PROMPT } from "@/utils/constant";
import { isUndefined, countMessages, type Messages } from "@/lib";
import { calcTokens } from "@/lib/calcTokens";
import { useLLMStore } from "../useLLM";
import { useOpenAIStore } from "../useOpenAI";
import { useUserInfoStore } from "../useUserInfo";
import { useTTSStore } from "../useTTS";
import { useScrollToBottomStore } from "../useScrollToBottom";
import type { ChannelListItem, ChatItem, ChannelIcon } from "./types";
import { streamDecoder } from "@/lib/streamDecoder";
import { type Character } from "@/lib/character";
import { summarize } from "./tools";

type ChannelStore = {
  activeId: string;
  list: ChannelListItem[];
  abort: any;

  updateActiveId: (activeId: string) => void;
  updateContent: (id: string, content: string) => void;
  updateList: (list: ChannelListItem[]) => void;
  addList: (item: ChannelListItem) => void;
  clearList: () => void;
  deleteList: (id: string) => void;
  clearItem: () => void;
  addChatItem: (content: string) => ChatItem[];
  updateCharacter: (item: Character) => void;
  sendGPT: (
    chat_list: ChatItem[],
    channel_id: string,
    summarize_previous: string,
    summarize: string
  ) => Promise<void>;
  getChannelName: (params: any) => Promise<void>;
  cancelGPT: (channel_id: string) => void;
  updatePlugin: (channel_id: string, plugins: string[]) => void;
  resetPlugin: (name: string) => void;
  clearSummarize: (channel_id: string) => void;
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
    channel_plugins: [],
    channel_summarize: "",
    channel_summarize_threshold: 1000,
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

          item.channel_plugins = item.channel_plugins || [];

          if (isUndefined(item.channel_summarize_threshold)) {
            item.channel_summarize_threshold = 1000;
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
    updateContent: (id, content) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};
        const findChat = findCh.chat_list.find((item) => item.id === id);
        if (!findChat) return {};
        findChat.content = content;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
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
    clearList: () => {
      set(() => {
        const activeId = initChannelList[0].channel_id;
        localStorage.setItem("channelList", JSON.stringify(initChannelList));
        localStorage.setItem("activeId", activeId);
        return { activeId, list: initChannelList };
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
        if (item.welcome && !findCh.chat_list.length) {
          findCh.chat_list.push({
            id: uuidv4(),
            role: "assistant",
            time: String(+new Date()),
            content: item.welcome,
          });
        }

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },
    sendGPT: (chat_list, channel_id, summarize_previous, summarize_content) => {
      return new Promise(async (resolve, reject) => {
        let modelType: any;
        let modelConfig: any;
        let modelThreshold: number = 1000;
        let prompt: any;
        let findCh: ChannelListItem | undefined;
        let summarizeContent: string | undefined;

        const LLMStore = useLLMStore.getState();
        const OpenAIStore = useOpenAIStore.getState();
        const leAIKey = OpenAIStore.leAIKey;

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
          summarizeContent = findCh.channel_summarize;
          modelThreshold = findCh.channel_summarize_threshold || 1000;

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

        const params: any = {
          model: findCh.channel_model.name,
          modelLabel: findModelLabel.label,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.max_tokens,
          plugins: findCh.channel_plugins,
        };

        if (modelType === "openai") {
          params.proxy = modelConfig.proxy;
        } else if (modelType === "azure") {
          params.resourceName = modelConfig.resourceName;
        }

        const sliceStart =
          chat_list.length - (1 + findCh.channel_context_length);

        let arr: any[] = chat_list
          .map((item) => ({
            role: item.role,
            content: item.content,
            is_summarized: item.is_summarized,
          }))
          .slice(sliceStart <= 0 ? 0 : sliceStart, chat_list.length);

        if (summarizeContent) arr = arr.filter((item) => !item.is_summarized);

        const countArr = arr.slice(0, arr.length - 1);

        const counts = countMessages(countArr as Messages[]);

        // 如果消息长度大于阈值，则需要进行总结
        // If the length of the message is greater than the threshold, a summary is needed.
        if (counts > modelThreshold) {
          const key = leAIKey || OpenAIStore.openai.apiKey;
          const content = await summarize(
            summarizeContent
              ? [{ role: "system", content: summarizeContent }, ...countArr]
              : countArr,
            OpenAIStore.openai.proxy,
            key,
            summarize_content
          );
          if (!content) return;

          // 将当前会话列表的消息都标记为已总结，然后再把总结后的内容存储到列表配置中
          // Mark all messages in the current session list as summarized,
          // and then store the summarized content in the list configuration.
          set((state) => {
            const newList: ChannelListItem[] = JSON.parse(
              JSON.stringify(state.list)
            );
            findCh = newList.find((item) => item.channel_id === channel_id);
            if (!findCh) return {};

            const list_length = findCh.chat_list.length;

            findCh.chat_list.forEach((item, index) => {
              item.is_summarized = index < list_length - 1;
            });
            arr = findCh.chat_list.filter((item) => !item.is_summarized);
            findCh.channel_summarize = content;

            localStorage.setItem("channelList", JSON.stringify(newList));

            return { list: newList };
          });

          summarizeContent = content;
        }

        let messages = [{ role: "system", content: prompt }];
        if (summarizeContent) {
          messages.push({
            role: "system",
            content: summarize_previous + summarizeContent,
          });
        }

        params.messages = [...messages, ...arr].map((item) => ({
          role: item.role,
          content: item.content,
        }));

        fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: leAIKey || modelConfig.apiKey,
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
        const OpenAIStore = useOpenAIStore.getState();
        const leAIKey = OpenAIStore.leAIKey;

        const newParams = params.newParams;
        newParams.model = "gpt-3.5-turbo";
        newParams.modelLabel = "gpt-3.5-turbo";
        newParams.messages = newParams.chat_list.map((item: any) => ({
          role: item.role,
          content: item.content,
        }));

        fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: leAIKey || OpenAIStore.openai.apiKey,
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
    updatePlugin: (channel_id, plugins) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find((item) => item.channel_id === channel_id);
        if (!findCh) return {};
        findCh.channel_plugins = plugins;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },
    resetPlugin: (plugin_name) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );

        newList.forEach((item) => {
          item.channel_plugins = item.channel_plugins.filter(
            (item) => item !== plugin_name
          );
        });

        return { list: newList };
      });
    },
    clearSummarize: (channel_id) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find((item) => item.channel_id === channel_id);
        if (!findCh) return {};

        findCh.channel_summarize = "";
        findCh.chat_list.forEach((item) => {
          if (item.is_summarized) item.is_summarized = false;
        });

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
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
