"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { LuStore } from "react-icons/lu";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import { BiCustomize } from "react-icons/bi";
import { SiCodereview } from "react-icons/si";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { Button, Modal } from "@/components/ui";
import { usePromptOpen, usePrompt } from "@/hooks";
import { Prompt } from "@prisma/client";
import { cn } from "@/lib";
import PromptGroup from "./group";
import Apply from "../apply";
import Add from "../add";
import Release from "../release";
import Revoke from "../confirm/revoke";

const PromptMarket: React.FC = () => {
  const session = useSession();
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");

  // ref
  const applyRef = React.useRef<any>(null);
  const addRef = React.useRef<any>(null);
  const releaseRef = React.useRef<any>(null);
  const revokeRef = React.useRef<any>(null);

  // data
  const [open, setOpen] = usePromptOpen();
  const [prompts, setPrompts] = usePrompt();
  const [type, setType] = React.useState("market");
  const [loading, setLoading] = React.useState(false);
  const [marketList, setMarketList] = React.useState([]);
  const [awesomeList, setAwesomeList] = React.useState([]);
  const [reviewList, setReviewList] = React.useState([]);

  // delete prompt data
  const [deletePrompt, setDeletePrompt] = React.useState<Prompt | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const onClose = () => setOpen(false);
  const onDeletePromptClose = () => setDeleteOpen(false);

  const getData = (type: string) => {
    setLoading(true);
    fetch(`/api/prompt?type=${type}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) return toast.error(res.msg, { id: "get-prompt-error" });

        if (type === "market") {
          setMarketList(res.data.list);
        }
        if (type === "awesome-chatgpt-prompts") {
          setAwesomeList(res.data.list);
        }
        if (type === "review") {
          setReviewList(res.data.list);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeTab = (value: string) => {
    setType(value);
    if (value === "market") {
      if (!marketList.length) {
        getData(value);
      }
    } else if (value === "awesome-chatgpt-prompts") {
      if (!awesomeList.length) {
        getData(value);
      }
    } else if (value === "review") {
      setReviewList([]);
      getData(value);
    }
  };

  const onAdd = () => addRef.current?.init();

  const onSelect = (data: Prompt) => applyRef.current?.init(data);

  const onRevoke = (data: Prompt) => revokeRef.current?.init(data);

  const onEdit = (data: Prompt) => addRef.current?.init(data);

  const onDelete = (data: Prompt) => {
    setDeletePrompt(data);
    setDeleteOpen(true);
  };

  const onRelease = (data: Prompt) => releaseRef.current?.init(data);

  const onDeletePrompt = () => {
    setPrompts((prompts) => {
      prompts.list = prompts.list.filter(
        (item) => item.id !== deletePrompt?.id
      );
      return prompts;
    });
    setDeleteOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      setType("market");
      if (!marketList?.length) getData("market");
    }
  }, [open]);

  return (
    <>
      <Modal
        rootClassName="top-[50%]"
        title={
          <div className="flex items-center gap-2">
            <AiOutlineDeploymentUnit size={18} />
            {t("prompt-market")}
          </div>
        }
        maskClosable={false}
        width="calc(90vw)"
        open={open}
        onClose={onClose}
        footer={null}
      >
        <Tabs.Root value={type} onValueChange={onChangeTab}>
          <div className="flex gap-4 mb-2 justify-between items-center">
            <Tabs.List
              className={cn(
                "flex-1 flex rounded-md text-sm w-auto p-1 text-[hsl(215.4,16.3%,56.9%)]",
                "bg-neutral-200/70 dark:bg-slate-900"
              )}
            >
              <Tabs.Trigger
                value="market"
                className={cn(
                  "rounded-md py-1.5 px-3 transition-colors flex-1",
                  "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                  "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
                )}
              >
                <div className="flex gap-2 items-center justify-center">
                  <LuStore size={16} />
                  <span className="hidden lg:block">{t("market")}</span>
                </div>
              </Tabs.Trigger>
              <Tabs.Trigger
                value="awesome-chatgpt-prompts"
                className={cn(
                  "rounded-md py-1.5 px-3 transition-colors flex-1",
                  "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                  "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
                )}
              >
                <div className="flex gap-2 items-center justify-center">
                  <MdOutlineAutoAwesome size={16} />
                  <span className="hidden lg:block whitespace-nowrap">
                    Awesome ChatGPT Prompts
                  </span>
                </div>
              </Tabs.Trigger>
              {!!session.data && (
                <>
                  <Tabs.Trigger
                    value="custom"
                    className={cn(
                      "rounded-md py-1.5 px-3 transition-colors flex-1",
                      "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                      "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
                    )}
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <BiCustomize size={16} />
                      <span className="hidden lg:block">{t("custom")}</span>
                    </div>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="review"
                    className={cn(
                      "rounded-md py-1.5 px-3 transition-colors flex-1",
                      "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                      "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
                    )}
                  >
                    <div className="flex gap-2 items-center justify-center">
                      <SiCodereview size={16} />
                      <span className="hidden lg:block">
                        {t("under-review")}
                      </span>
                    </div>
                  </Tabs.Trigger>
                </>
              )}
            </Tabs.List>
            {type === "custom" && (
              <div className="flex gap-2">
                <Button type="primary" onClick={onAdd}>
                  {tCommon("add")}
                </Button>
              </div>
            )}
          </div>
          <Tabs.Content
            value="market"
            className={cn(
              "border rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40",
              "bg-gray-50 dark:bg-slate-900"
            )}
          >
            <PromptGroup
              loading={loading}
              list={marketList}
              onSelect={onSelect}
            />
          </Tabs.Content>
          <Tabs.Content
            value="awesome-chatgpt-prompts"
            className="border rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40"
          >
            <PromptGroup
              loading={loading}
              list={awesomeList}
              onSelect={onSelect}
            />
          </Tabs.Content>
          {!!session.data && (
            <>
              <Tabs.Content
                value="custom"
                className="border rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40"
              >
                <PromptGroup
                  type="custom"
                  loading={loading}
                  list={prompts as any[]}
                  onSelect={onSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRelease={onRelease}
                />
              </Tabs.Content>
              <Tabs.Content
                value="review"
                className="border rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40"
              >
                <PromptGroup
                  type="review"
                  loading={loading}
                  list={reviewList}
                  onRevoke={onRevoke}
                />
              </Tabs.Content>
            </>
          )}
        </Tabs.Root>
      </Modal>
      <Apply ref={applyRef} onChoose={onClose} />
      <Add ref={addRef} />
      <Release ref={releaseRef} />
      <Revoke ref={revokeRef} onReload={() => getData("review")} />
      <Modal
        title={t("delete-prompt")}
        maskClosable={false}
        open={deleteOpen}
        onClose={onDeletePromptClose}
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={onDeletePromptClose}>{tCommon("cancel")}</Button>
            <Button type="danger" onClick={onDeletePrompt}>
              {tCommon("ok")}
            </Button>
          </div>
        }
      >
        {t("sure-delete")} 《{deletePrompt?.title}》?
      </Modal>
    </>
  );
};

export default PromptMarket;
