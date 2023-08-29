import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Input, Modal } from "@ltopx/lx-ui";
import { useLLMStore } from "@/hooks/useLLM";
import type { Model } from "@/hooks/useLLM/types";

const Handler = React.forwardRef((_, forwardedRef) => {
  const tGlobal = useTranslations("global");

  const azureModels = useLLMStore((state) => state.azure.models);
  const [open, setOpen] = React.useState(false);
  const [modelName, setModelName] = React.useState("");
  const [deploymentName, setDeploymentName] = React.useState("");

  const inputRef = React.useRef<any>(null);

  const updateAzure = useLLMStore((state) => state.updateAzure);

  const onClose = () => setOpen(false);

  const onSubmit = () => {
    if (!deploymentName?.trim()) {
      inputRef.current?.focus();
      return toast.error(tGlobal("please-enter"), {
        id: "empty_name",
      });
    }
    const nowModels = [...azureModels];
    const find = nowModels.find((val) => val.label === modelName);
    if (find) {
      find.value = deploymentName;
      updateAzure(nowModels);
    }
    setOpen(false);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(data: Model) {
      setOpen(true);
      setModelName(data.label);
      setDeploymentName(data.value);
    },
  }));

  return (
    <Modal
      title={tGlobal("edit")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      onOk={onSubmit}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-sm mb-1">
            Model <span className="text-red-500">*</span>
          </div>
          <Input disabled value={modelName} />
        </div>
        <div>
          <div className="text-sm mb-1">
            {tGlobal("name")} <span className="text-red-500">*</span>
          </div>
          <Input
            ref={inputRef}
            placeholder={tGlobal("please-enter")}
            maxLength={30}
            allowClear
            value={deploymentName}
            onChange={setDeploymentName}
          />
        </div>
      </div>
    </Modal>
  );
});

Handler.displayName = "Handler";

export default Handler;
