import React from "react";
import Icon from "../icon";

export default function LoadingPage() {
  return (
    <div className="flex inset-0 fixed justify-center items-center">
      <Icon
        className="animate-spin text-sky-400 dark:text-sky-500"
        icon="loading_line"
        size={24}
      />
    </div>
  );
}
