"use client";

import React from "react";
import { Button } from "@ltopx/lx-ui";
import Icon from "@/components/icon";

interface Props {
  disabled: boolean;
}

const Btn = React.forwardRef<any, Props>(({ disabled }, forwardedRef) => {
  return (
    <Button
      type="primary"
      size="sm"
      icon={<Icon icon="user_add_2_line" size={18} />}
      loading={!!disabled}
    />
  );
});

Btn.displayName = "Btn";

export default Btn;
