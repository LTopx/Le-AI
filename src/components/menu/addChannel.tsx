import React from "react";
import { useTranslations } from "next-intl";
import { Button, Confirm } from "@ltopx/lx-ui";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { useChannelStore, initChannelList } from "@/hooks/useChannel";
import { useModelCacheStore } from "@/hooks/useModelCache";
import Icon from "@/components/icon";

export default function AddChannel() {
  const tGlobal = useTranslations("global");
  const tChat = useTranslations("chat");

  const [list, addList] = useChannelStore((state) => [
    state.list,
    state.addList,
  ]);
  const license_type = useUserInfoStore((state) => state.license_type);

  const checkModel = useModelCacheStore((state) => state.checkModel);
  const clearList = useChannelStore((state) => state.clearList);

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
    <div className="flex gap-1.5">
      <Button
        className="mb-2"
        block
        type="primary"
        size="lg"
        onClick={onChannelAdd}
      >
        {tChat("new-chat")}
      </Button>

      <Confirm
        triggerClassName="flex-1"
        title={tChat("clear-context")}
        content={tChat("clear-all-context")}
        onOk={clearList}
        okText={tGlobal("ok-spacing")}
        cancelText={tGlobal("cancel-spacing")}
        type="danger"
      >
        <Button
          className="px-3"
          size="lg"
          type="danger"
          icon={<Icon icon="delete_2_line" size={18} />}
        />
      </Confirm>
    </div>
  );
}
