import React from "react";
import { Divider } from "@ltopx/lx-ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLLMStore } from "@/hooks/useLLM";
import OpenAI from "./openai";
import Azure from "./azure";
import OpenRouter from "./openRouter";

export default function ConfigureModel() {
  const [model, setModel] = React.useState<string>("");
  const [openai, azure, openRouter] = useLLMStore((state) => [
    state.openai,
    state.azure,
    state.openRouter,
  ]);

  const LLMOptions = React.useMemo(
    () => [openai, azure, openRouter],
    [openai, azure, openRouter]
  );

  const findLLM = LLMOptions.find((item) => item.value === model);

  React.useEffect(() => {
    setModel(LLMOptions[0].value);
  }, []);

  return (
    <>
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {LLMOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className="flex gap-2 items-center">
                  {item.ico}
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Divider>{findLLM?.ico_big}</Divider>
      {model === LLMOptions[0].value && <OpenAI />}
      {model === LLMOptions[1].value && <Azure />}
      {model === LLMOptions[2].value && <OpenRouter />}
    </>
  );
}
