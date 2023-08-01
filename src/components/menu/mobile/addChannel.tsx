import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@ltopx/lx-ui";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useChannelStore, initChannelList } from "@/hooks/useChannel";
import { useModelCacheStore } from "@/hooks/useModelCache";

export default function AddChannel() {
  const tMenu = useTranslations("menu");
  const tChat = useTranslations("chat");

  const [list, addList] = useChannelStore((state) => [
    state.list,
    state.addList,
  ]);
  const license_type = useUserInfoStore((state) => state.license_type);

  const checkModel = useModelCacheStore((state) => state.checkModel);

  const onChannelAdd = () => {
    if (
      list.length >= 10 &&
      license_type !== "premium" &&
      license_type !== "team"
    ) {
      return toast.error(tChat("conversation-limit"), {
        id: "conversation-limit",
      });
    }

    const channel_id = uuidv4();
    const addItem = { ...initChannelList[0], channel_id };

    checkModel(addItem);
    addList(addItem);
  };

  return (
    <Button
      className="mb-2"
      block
      type="primary"
      size="lg"
      onClick={onChannelAdd}
    >
      {tMenu("new-chat")}
    </Button>
  );
}
