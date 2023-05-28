import * as React from "react";
import { useTranslations } from "next-intl";
import {
  AiOutlineQuestionCircle,
  AiOutlineCheck,
  AiOutlinePlus,
  AiOutlineDelete,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { cn } from "@/lib";
import Confirm from "@/components/ui/Confirm";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import Tooltip from "@/components/ui/Tooltip";
import Divider from "@/components/ui/Divider";
import Modal from "@/components/ui/Modal";
import { useOpenAI, useLLM } from "@/hooks";

type CheckStatus = "" | "success" | "error";

const Azure: React.FC = () => {
  const t = useTranslations("setting");
  const [openAI, setOpenAI] = useOpenAI();
  const { azure, updateAzure } = useLLM();
  const [loadingCheck, setLoadingCheck] = React.useState(false);
  const [checkStatus, setCheckStatus] = React.useState<CheckStatus>("");

  // Deployments data
  const [open, setOpen] = React.useState(false);
  const [modelType, setModelType] = React.useState<"add" | "edit">("add");
  const [deployment, setDeployment] = React.useState({
    model: undefined,
    name: "",
  });

  // available models
  const azureModelOptions = () => {
    const azureModels: any[] = [
      {
        label: "gpt-3.5",
        value: "gpt-3.5",
      },
      {
        label: "gpt-4",
        value: "gpt-4",
      },
      {
        label: "gpt-4-32k",
        value: "gpt-4-32k",
      },
    ];
    azureModels.map((item) => {
      const findModel = azure.models.find((val) => val.label === item.value);
      if (findModel) item.disabled = true;
    });
    return azureModels;
  };

  const mapTemperature = (value: number) => {
    if (value === 0) return t("deterministic");
    if (value === 0.5) return t("neutral");
    if (value === 1) return t("random");
    return "";
  };

  const onChange = (value: any, key: string) => {
    setOpenAI((query) => {
      if (key === "apiKey") {
        query.azure.apiKey = value;
      } else if (key === "resourceName") {
        query.azure.resourceName = value;
      } else if (key === "temperature") {
        query.azure.temperature = value;
      } else if (key === "max_tokens") {
        query.azure.max_tokens = value;
      }
      return query;
    });
  };

  // Deployments Function
  const onClose = () => setOpen(false);
  const onAdd = () => {
    setModelType("add");
    setDeployment({ model: undefined, name: "" });
    setOpen(true);
  };
  const onEdit = (item: any) => {
    setModelType("edit");
    setDeployment({ model: item.label, name: item.value });
    setOpen(true);
  };
  const onDelete = (item: any) => {
    updateAzure(azure.models.filter((val) => val.label !== item.label));
  };
  const onChangeDeployment = (value: any, type: "name" | "model") => {
    setDeployment((data) => {
      const newData = { ...data };
      if (type === "name") newData.name = value;
      if (type === "model") newData.model = value;
      return newData;
    });
  };
  const submit = () => {
    if (!deployment.model) {
      return toast.error(t("select-model"), { id: "empty_model" });
    }
    if (!deployment.name?.trim()) {
      return toast.error(t("enter-deployment-name"), { id: "empty_name" });
    }

    if (modelType === "add") {
      const params = {
        label: deployment.model,
        value: deployment.name,
      };
      const nowModels = [...azure.models, params].sort((x, y) =>
        x.label.localeCompare(y.label)
      );
      updateAzure(nowModels);
    } else {
      const nowModels = [...azure.models];
      const find = nowModels.find((val) => val.label === deployment.model);
      if (find) find.value = deployment.name;
      updateAzure(nowModels);
    }

    setOpen(false);
  };

  const onCheck = () => {};

  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1 text-sm flex gap-4 items-end">
            <span>API Key</span>
            <a
              href="https://portal.azure.com"
              target="_blank"
              className="text-xs text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500"
            >
              ({t("get-apiKey")})
            </a>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              allowClear
              placeholder={t("set-api-key") as string}
              value={openAI.azure.apiKey}
              onChange={(value) => onChange(value, "apiKey")}
            />
            {/* <Button
              type="primary"
              leftIcon={<AiOutlineCheck />}
              loading={loadingCheck}
              onClick={onCheck}
            >
              {t("check")}
            </Button> */}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm">{t("resource-name")}</div>
          <Input
            allowClear
            placeholder={t("set-resource-name") as string}
            value={openAI.azure.resourceName}
            onChange={(value) => onChange(value, "resourceName")}
          />
        </div>
        <div>
          <div className="mb-1 text-sm flex items-center gap-2">
            {t("temperature")}
            <Tooltip title={t("temperature-tip")}>
              <AiOutlineQuestionCircle size={18} />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              className="flex-1"
              max={1}
              step={0.5}
              defaultValue={openAI.azure.temperature}
              onChange={(value) => onChange(value, "temperature")}
            />
            <div
              className={cn(
                "text-sm hidden md:flex w-28 h-8 justify-center items-center rounded-md",
                "bg-neutral-200 dark:bg-neutral-700/90"
              )}
            >
              {mapTemperature(openAI.azure.temperature)}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm flex items-center gap-2">
            {t("max-tokens")}
            <Tooltip title={t("max-tokens-tip")}>
              <AiOutlineQuestionCircle size={18} />
            </Tooltip>
          </div>
          <Input
            type="number"
            min={1}
            max={4000}
            step={1}
            placeholder={t("set-temperature") as string}
            value={openAI.azure.max_tokens}
            onChange={(value) => onChange(value, "max_tokens")}
          />
        </div>
        <Divider />
        <div>
          <div className="mb-3 text-sm flex items-center justify-between">
            <div>{t("deployments")}</div>
            {/* <Button
              size="xs"
              type="primary"
              leftIcon={<AiOutlinePlus />}
              onClick={onAdd}
            /> */}
          </div>
          <div className="flex flex-col gap-2">
            {azure.models.map((item) => (
              <div
                key={item.label}
                onClick={() => onEdit(item)}
                className={cn(
                  "h-9 px-4 rounded-md text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors",
                  "bg-gray-200/70 hover:bg-gray-200",
                  "dark:bg-neutral-700/90 dark:hover:bg-zinc-600"
                )}
              >
                <div className="flex gap-1 max-w-[50%] whitespace-nowrap">
                  <div>{t("name")}:</div>
                  <div className="overflow-hidden text-ellipsis">
                    {item.value}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="xs" type="outline">
                    {item.label}
                  </Button>
                  {/* <Confirm
                    title={t("confirm-delete")}
                    content={t("sure-delete-deployment")}
                    trigger={
                      <div onClick={(e) => e.stopPropagation()}>
                        <AiOutlineDelete size={16} className="text-rose-500" />
                      </div>
                    }
                    onOk={() => onDelete(item)}
                  /> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        title={
          modelType === "add"
            ? t("create-new-deployment")
            : t("edit-deployment")
        }
        maskClosable={false}
        open={open}
        onClose={onClose}
        onOk={submit}
      >
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-sm mb-1">
              {t("select-model")} <span className="text-red-500">*</span>
            </div>
            <Select
              className="w-full"
              placeholder={t("select-model")}
              disabled={modelType === "edit"}
              options={azureModelOptions()}
              value={deployment.model}
              onChange={(value) => onChangeDeployment(value, "model")}
            />
          </div>
          <div>
            <div className="text-sm mb-1">
              {t("deployment-name")} <span className="text-red-500">*</span>
            </div>
            <Input
              placeholder={t("enter-deployment-name")}
              maxLength={30}
              allowClear
              value={deployment.name}
              onChange={(value) => onChangeDeployment(value, "name")}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Azure;
