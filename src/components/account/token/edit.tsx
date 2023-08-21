import React, { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Modal, Input, DatePicker } from "@ltopx/lx-ui";

const EditToken = React.forwardRef<any, any>((props, forwardedRef) => {
  const tAccount = useTranslations("account");
  const tCommon = useTranslations("common");

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState({
    name: "",
    expire: undefined,
    limit: 0,
  });

  const onClose = () => setOpen(false);

  const onChangeForm = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onOk = async () => {
    console.log(formData, "formData");
    if (!formData.name) {
      return toast.error(tAccount("token-name-needed"), {
        id: "token-name-needed",
      });
    }
    if (!formData.expire) {
      return toast.error(tAccount("token-expire-needed"), {
        id: "token-expire-needed",
      });
    }
    if (+new Date(formData.expire) < +new Date()) {
      return toast.error(tAccount("token-expire-tip"), {
        id: "token-expire-tip",
      });
    }
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(data: any) {
      setType(data ? "edit" : "add");
      if (data) {
      } else {
        setFormData({
          name: "",
          expire: undefined,
          limit: 0,
        });
      }

      setOpen(true);
    },
  }));

  return (
    <Modal
      title={type === "add" ? tAccount("token-add") : tAccount("token-update")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      okText={tCommon("ok")}
      cancelText={tCommon("cancel")}
      onOk={onOk}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1 text-sm">{tAccount("token-name")}</div>
          <Input
            allowClear
            placeholder={tCommon("please-enter")}
            value={formData.name}
            onChange={(value) => onChangeForm("name", value)}
          />
        </div>
        <div>
          <div className="mb-1 text-sm">{tAccount("token-expire")}</div>
          <DatePicker
            value={formData.expire}
            onChange={(value) => onChangeForm("expire", value)}
          />
        </div>
        <div>
          <div className="mb-1 text-sm">{tAccount("token-limit")}</div>
          <Input
            type="number"
            allowClear
            placeholder={tCommon("please-enter")}
            value={formData.limit}
            onChange={(value) => onChangeForm("limit", value)}
          />
        </div>
      </div>
    </Modal>
  );
});

EditToken.displayName = "EditToken";

export default EditToken;
