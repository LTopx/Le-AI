import React, { memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

export const MemoizedReactMarkdown: React.FC<Options> = memo(ReactMarkdown);
