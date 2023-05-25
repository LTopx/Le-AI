import { BiCommand } from "react-icons/bi";
import type { Platform } from "@/lib";

// Ways to send messages: Enter or Command + Enter
export const sendMessageTypes = (platform: Platform) => {
  return [
    {
      label: "Enter",
      value: "Enter",
    },
    {
      label: (
        <div className="flex items-center gap-1">
          {platform === "mac" ? <BiCommand /> : "Ctrl"}
          <span>+</span>
          Enter
        </div>
      ),
      value: "CommandEnter",
    },
  ];
};
