import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Modal, Input, Tabs, Button, type TabsOption } from "@ltopx/lx-ui";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib";
import { Button as NewButton } from "@/components/ui/button";
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
    const tGlobal = useTranslations("global");
    const tAccount = useTranslations("account");

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

    const nameRef = React.useRef<any>(null);

    const options: TabsOption[] = [
      {
        label: tAccount("quota-limited"),
        value: "limited",
      },
      {
        label: tAccount("quota-unlimited"),
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
        nameRef.current?.focus();
        return toast.error(tGlobal("please-enter"), {
          id: "please-enter",
        });
      }
      if (formData.expire && +new Date(formData.expire) < +new Date()) {
        return toast.error(tAccount("token-expire"), {
          id: "token-expire",
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
        toast.success(tGlobal("operation-successful"));
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
        title={type === "add" ? tGlobal("create") : tGlobal("edit")}
        maskClosable={false}
        open={open}
        onClose={onClose}
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={onClose}>{tGlobal("cancel-spacing")}</Button>
            <Button type="primary" loading={loadingAdd} onClick={onOk}>
              {tGlobal("ok-spacing")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-sm mb-1">{tGlobal("name")}</div>
            <Input
              ref={nameRef}
              allowClear
              placeholder={tGlobal("please-enter")}
              value={formData.name}
              onChange={(value) => onChangeForm("name", value)}
              maxLength={15}
            />
          </div>
          <div>
            <div className="text-sm mb-1">{tAccount("expire-date")}</div>
            <Popover>
              <PopoverTrigger asChild>
                <NewButton
                  variant={"outline"}
                  size="sm"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expire && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expire ? (
                    format(formData.expire, "PPP")
                  ) : (
                    <span>{tGlobal("please-select")}</span>
                  )}
                </NewButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expire}
                  onSelect={(value) => onChangeForm("expire", value)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <div className="text-sm mb-1">{tGlobal("limit")}</div>
            <Tabs
              itemsFull
              options={options}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <Input
              type="number"
              allowClear
              placeholder={tGlobal("please-enter")}
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
