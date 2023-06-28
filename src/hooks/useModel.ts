import React from "react";
import { create } from "zustand";
import { useLLM } from "@/hooks";

interface IModel {
  model_type: string;
  model_name: string;
  updateType: (type: string) => void;
  updateName: (name: string) => void;
}

const useStore = create<IModel>((set) => ({
  model_type: "",
  model_name: "",
  updateType: (model_type) => {
    localStorage.setItem("recent_model_type", model_type);
    set({ model_type });
  },
  updateName: (model_name) => {
    localStorage.setItem("recent_model_name", model_name);
    set({ model_name });
  },
}));

export const useModel = () => {
  const { model_type, model_name } = useStore();
  const { openai, azure } = useLLM();

  const LLMOptions = React.useMemo(() => [openai, azure], [openai, azure]);

  const updateType = useStore((state) => state.updateType);
  const updateName = useStore((state) => state.updateName);

  const checkModel = () => {
    if (!model_type || !model_name) return false;

    const findModelType = LLMOptions.find((item) => item.value === model_type);
    if (!findModelType?.models?.length) return false;

    const findModelName = findModelType.models.find(
      (item) => item.value === model_name
    );
    return !!findModelName;
  };

  React.useEffect(() => {
    const localModelType = localStorage.getItem("recent_model_type") || "";
    const localModelName = localStorage.getItem("recent_model_name") || "";

    updateType(localModelType);
    updateName(localModelName);
  }, []);

  return { model_type, model_name, updateType, updateName, checkModel };
};
