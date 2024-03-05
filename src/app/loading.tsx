import React from "react";

export default function Loading() {
  return (
    <div className="inset-0 fixed flex justify-center items-center">
      <span className="i-mingcute-loading-fill h-6 w-6 animate-spin text-sky-400 dark:text-sky-500" />
    </div>
  );
}
