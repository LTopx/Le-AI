import type * as React from "react";
import LInput, { InputProps, InputRef } from "./input";
import TextArea from "./textarea";

export type { InputProps, InputRef } from "./input";
export type { TextAreaProps, TextAreaRef } from "./textarea";

type Component = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  TextArea: typeof TextArea;
};

const Input = LInput as Component;

Input.TextArea = TextArea;

export default Input;
