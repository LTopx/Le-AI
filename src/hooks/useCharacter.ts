import { create } from "zustand";
import type { Character } from "@/lib/character";

export type CharacterStore = {
  list: Character[];

  updateList: (list: Character[]) => void;
  addList: (item: Character) => void;
  deleteItem: (id: string) => void;
};

export const useCharacterStore = create<CharacterStore>((set) => ({
  list: [],

  updateList: (list) => {
    localStorage.setItem("characterList", JSON.stringify(list));
    set({ list });
  },

  addList: (item) => {
    set((state) => {
      const list = [...state.list, item];
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
