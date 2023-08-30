import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Input, Button, Progress } from "@ltopx/lx-ui";
import { encrypt, decrypt } from "@/lib";
import { useFetchError } from "@/hooks/useFetchError";
import { useOpenAIStore } from "@/hooks/useOpenAI";
import { useChannelStore } from "@/hooks/useChannel";
import { useCharacterStore } from "@/hooks/useCharacter";
import { useUserInfoStore } from "@/hooks/useUserInfo";
import { syncStore } from "@/store/sync";
import { FREE_SYNC_SIZE, PRO_SYNC_SIZE } from "@/utils/constant";

interface IProps {
  onClose: () => void;
}

export default function ModalContent({ onClose }: IProps) {
  const tBackup = useTranslations("backup");
  const tGlobal = useTranslations("global");

  const { catchError } = useFetchError();

  const inputRef = React.useRef<any>(null);

  const [key, setKey] = React.useState("");
  const [openai, azure, openRouter] = useOpenAIStore((state) => [
    state.openai,
    state.azure,
    state.openRouter,
  ]);
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const characterList = useCharacterStore((state) => state.list);
  const license_type = useUserInfoStore((state) => state.license_type);
  const syncSize = syncStore((state) => state.size);
  const [loadingBackup, setLoadingBackup] = React.useState(false);
  const [loadingRestore, setLoadingRestore] = React.useState(false);

  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);
  const updateOpenAI = useOpenAIStore((state) => state.updateOpenAI);
  const updateAzure = useOpenAIStore((state) => state.updateAzure);
  const updateOpenRouter = useOpenAIStore((state) => state.updateOpenRouter);
  const importCharacterList = useCharacterStore((state) => state.importList);
  const updateSyncSize = syncStore((state) => state.updateSize);

  const isFree = license_type !== "premium" && license_type !== "team";
  const totalSize = isFree ? FREE_SYNC_SIZE : PRO_SYNC_SIZE;

  const syncUsage = React.useMemo(() => {
    return (syncSize / totalSize) * 100;
  }, [syncSize, isFree]);

  const getSyncSize = async () => {
    if (syncSize) return;
    const res = await fetch("/api/sync/size").then((res) => res.json());
    const size = ((res.data.size || 0) / 1024).toFixed(2);
    updateSyncSize(Number(size));
  };

  // The verification must be a 16-character string.
  const checkKey = (key: string) => {
    if (!key?.trim()) {
      inputRef.current?.focus();
      toast.error(tGlobal("please-enter"), { id: "no-key" });
      return false;
    }

    if (key?.trim()?.length !== 16) {
      inputRef.current?.focus();
      toast.error(tBackup("key-length-error"), { id: "key-error" });
      return false;
    }

    return true;
  };

  const onBackup = async () => {
    if (!checkKey(key)) return;

    const content = {
      configure: { openai, azure, openRouter },
      messages: { activeId, list },
      characters: characterList.map((item) => ({
        id: item.id,
        icon: item.icon,
        type: item.type,
        handle_type: item.handle_type,
        name: item.name,
        desc: item.desc,
        content: item.content,
        welcome: item.welcome || "",
        model_config: item.model_config,
      })),
    };

    const encryptContent = encrypt(JSON.stringify(content), key);

    setLoadingBackup(true);

    await fetch("/api/sync", {
      method: "POST",
      body: JSON.stringify({
        content: encryptContent,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return toast.error(catchError(res), { id: "sync_error" });
        }
        toast.success(tGlobal("operation-successful"), { id: "sync_success" });
        const size = ((res.data.size || 0) / 1024).toFixed(2);
        updateSyncSize(Number(size));
        onClose();
      })
      .finally(() => {
        setLoadingBackup(false);
      });
  };

  const onRestore = () => {
    if (!checkKey(key)) return;

    setLoadingRestore(true);

    fetch("/api/sync")
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return toast.error(catchError(res), { id: "sync_error" });
        }

        const decryptContent = decrypt(res.data, key);

        if (!decryptContent) {
          return toast.error(tGlobal("operation-failed"), { id: "sync_error" });
        }

        let json;

        try {
          json = JSON.parse(decryptContent);
        } catch {
          return toast.error(tGlobal("operation-failed"), { id: "sync_error" });
        }

        if (json.messages) {
          const { activeId, list } = json.messages;
          const find = list.find((item: any) => item.channel_id === activeId);
          if (find) {
            updateActiveId(activeId);
            updateList(list);
          }
        }
        if (json.configure) {
          const { openai, azure, openRouter } = json.configure;
          updateOpenAI(openai);
          updateAzure(azure);
          updateOpenRouter(openRouter);
        }
        if (json.characters?.length) {
          importCharacterList(json.characters);
        }

        toast.success(tGlobal("operation-successful"), { id: "sync_success" });
        onClose();
      })
      .finally(() => {
        setLoadingRestore(false);
      });
  };

  React.useEffect(() => {
    getSyncSize();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1 text-sm">{tGlobal("introduction")}</div>
        <div>
          <ul className="list-disc space-y-2 pl-5 text-slate-500 dark:text-slate-300 marker:text-sky-400">
            <li>{tBackup("rule-1")}</li>
            <li>{tBackup("rule-2")}</li>
            <li className="text-rose-400">{tBackup("rule-3")}</li>
          </ul>
          <div className="flex">
            <Button
              href="https://docs.le-ai.app/features/cloud-synchronous"
              target="_blank"
              type="link"
            >
              {tGlobal("learn-more")}
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm flex justify-between">
          <div>{tGlobal("usage")}</div>
          <div className="flex gap-1">
            <div>
              {syncSize} KB / {totalSize} KB
            </div>
            {isFree && (
              <a
                className="text-sky-400 dark:text-sky-500 hover:underline cursor-pointer"
                href="https://docs.le-ai.app/features/cloud-synchronous"
                target="_blank"
              >
                (Free)
              </a>
            )}
          </div>
        </div>
        <Progress
          type="danger"
          value={syncUsage}
          className="bg-emerald-400 dark:bg-emerald-500"
        />
      </div>
      <div>
        <div className="mb-1 text-sm">{tBackup("key")}</div>
        <Input
          ref={inputRef}
          allowClear
          maxLength={16}
          placeholder={tGlobal("please-enter")}
          value={key}
          onChange={setKey}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="primary"
          loading={loadingBackup}
          disabled={loadingRestore}
          onClick={onBackup}
        >
          {tGlobal("backup")}
        </Button>
        <Button
          type="primary"
          loading={loadingRestore}
          disabled={loadingBackup}
          onClick={onRestore}
        >
          {tGlobal("restore")}
        </Button>
      </div>
    </div>
  );
}
