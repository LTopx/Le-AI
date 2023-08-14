import { create } from "zustand";
import type { Character } from "@/lib/character";

export type CharacterStore = {
  list: Character[];

  updateList: (list: Character[]) => void;
  addList: (item: Character) => void;
  deleteItem: (id: string) => void;
  importList: (list: Character[]) => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  list: [],

  updateList: (list) => {
    localStorage.setItem("characterList", JSON.stringify(list));
    set({ list });
  },
  addList: (item) => {
    set((state) => {
      const list = [
        ...state.list,
        {
          id: item.id,
          icon: item.icon,
          type: item.type,
          handle_type: item.handle_type,
          name: item.name,
          desc: item.desc,
          content: item.content,
          welcome: item.welcome || "",
          model_config: item.model_config,
        },
      ];
      localStorage.setItem("characterList", JSON.stringify(list));
      return { list };
    });
  },
  deleteItem: (id) => {
    set((state) => {
      const list = state.list.filter((item) => item.id !== id);
      localStorage.setItem("characterList", JSON.stringify(list));
      return { list };
    });
  },
  importList: (list) => {
    set((state) => {
      const newList = state.list.filter((item) => {
        const find = list.find((i) => i.id === item.id);
        return !find;
      });

      const calcList = [...newList, ...list].map((item) => ({
        id: item.id,
        icon: item.icon,
        type: item.type,
        handle_type: item.handle_type,
        name: item.name,
        desc: item.desc,
        content: item.content,
        welcome: item.welcome || "",
        model_config: item.model_config,
      }));

      localStorage.setItem("characterList", JSON.stringify(calcList));

      return { list: calcList };
    });
  },
}));

export const useCharacterInit = () => {
  const updateList = useCharacterStore((state) => state.updateList);

  const init = () => {
    const localCharacterList = localStorage.getItem("characterList");
    try {
      updateList(localCharacterList ? JSON.parse(localCharacterList) : []);
    } catch (error) {
      updateList([]);
    }
  };

  return init;
};
