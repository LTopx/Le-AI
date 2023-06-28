import React from "react";
import ReactMarkdown, { Options } from "react-markdown";

export const MemoizedReactMarkdown: React.FC<Options> =
  React.memo(ReactMarkdown);
