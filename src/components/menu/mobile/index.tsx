import React from "react";
import { Drawer } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import Logo from "@/components/site/logo";
import AddChannel from "../addChannel";
import List from "./list";
import Handler from "./handler";

export default function MobileMenu() {
  const [open, setOpen] = useOpenStore((state) => [
    state.mobileMenuOpen,
    state.updateMobileMenuOpen,
  ]);

  const onClose = () => setOpen(false);

  return (
    <Drawer
      className="md:hidden"
      overlayClassName="md:hidden"
      placement="left"
      width="78%"
      title={<Logo disabled />}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col h-[calc(100%-0.5rem)] px-2">
        <AddChannel />
        <List onClose={onClose} />
        <Handler />
      </div>
    </Drawer>
  );
}
