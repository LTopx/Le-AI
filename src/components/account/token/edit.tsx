import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  Modal,
  Input,
  DatePicker,
  Tabs,
  Button,
  type TabsOption,
} from "@ltopx/lx-ui";
import { useFetchError } from "@/hooks/useFetchError";

interface EditTokenProps {
  onLoad: () => Promise<void>;
}

interface FormData {
  id?: string;
  name: string;
  expire?: Date;
  total_quota: number;
}

const EditToken = React.forwardRef<any, EditTokenProps>(
  ({ onLoad }, forwardedRef) => {
    const tAccount = useTranslations("account");
    const tCommon = useTranslations("common");

    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState<"add" | "edit">("add");
    const [activeTab, setActiveTab] = React.useState("limited");
    const [loadingAdd, setLoadingAdd] = React.useState(false);
    const [formData, setFormData] = React.useState<FormData>({
      id: "",
      name: "",
      expire: undefined,
      total_quota: 0,
    });

    const options: TabsOption[] = [
      {
        label: tAccount("token-quota-limited"),
        value: "limited",
      },
      {
        label: tAccount("token-quota-unlimited"),
        value: "unlimited",
      },
    ];

    const { catchError } = useFetchError();

    const onClose = () => setOpen(false);

    const onChangeForm = (key: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const onOk = async () => {
      if (!formData.name?.trim()) {
        return toast.error(tAccount("token-name-needed"), {
          id: "token-name-needed",
        });
      }
      if (formData.expire && +new Date(formData.expire) < +new Date()) {
        return toast.error(tAccount("token-expire-tip"), {
          id: "token-expire-tip",
        });
      }
      const params: any = {
        name: formData.name.trim(),
        expire: formData.expire || null,
        total_quota: activeTab === "limited" ? formData.total_quota : -1,
      };
      if (type === "edit") params.id = formData.id;
      try {
        setLoadingAdd(true);
        const res = await fetch("/api/token", {
          method: type === "edit" ? "PUT" : "POST",
          body: JSON.stringify(params),
        }).then((res) => res.json());
        if (res.error) {
          return toast.error(catchError(res), { id: "token_error" });
        }
        toast.success(tCommon("operation-successful"));
        onClose();
        onLoad();
      } finally {
        setLoadingAdd(false);
      }
    };

    React.useImperativeHandle(forwardedRef, () => ({
      init(data: any) {
        setType(data ? "edit" : "add");
        if (data) {
          setActiveTab(data.total_quota === -1 ? "unlimited" : "limited");
          setFormData({
            id: data.id,
            name: data.name,
            expire: data.expire ? new Date(data.expire) : undefined,
            total_quota: data.total_quota === -1 ? 0 : data.total_quota,
          });
        } else {
          setActiveTab("limited");
          setFormData({
            id: "",
            name: "",
            expire: undefined,
            total_quota: 0,
          });
        }

        setOpen(true);
      },
    }));

    return (
      <Modal
        title={
          type === "add" ? tAccount("token-add") : tAccount("token-update")
        }
        maskClosable={false}
        open={open}
        onClose={onClose}
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={onClose}>{tCommon("cancel")}</Button>
            <Button type="primary" loading={loadingAdd} onClick={onOk}>
              {tCommon("ok")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-sm mb-1">{tAccount("token-name")}</div>
            <Input
              allowClear
              placeholder={tCommon("please-enter")}
              value={formData.name}
              onChange={(value) => onChangeForm("name", value)}
              maxLength={15}
            />
          </div>
          <div>
            <div className="text-sm mb-1">{tAccount("token-expire")}</div>
            <DatePicker
              value={formData.expire}
              onChange={(value) => onChangeForm("expire", value)}
            />
          </div>
          <div>
            <div className="text-sm mb-1">{tAccount("token-limit")}</div>
            <Tabs
              itemsFull
              options={options}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <Input
              type="number"
              allowClear
              placeholder={tCommon("please-enter")}
              disabled={activeTab === "unlimited"}
              value={formData.total_quota}
              onChange={(value) => onChangeForm("total_quota", value)}
              max={1000000}
            />
          </div>
        </div>
      </Modal>
    );
  }
);

EditToken.displayName = "EditToken";

export default EditToken;
