import type { Platform } from "@/lib";
import Icon from "@/components/icon";

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
          {platform === "mac" ? <Icon icon="command_line" /> : "Ctrl"}
          <span>+</span>
          Enter
        </div>
      ),
      value: "CommandEnter",
    },
  ];
};
