import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { FaCheckCircle } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { Modal, Button, Link } from "@/components/ui";
import { useRecharge } from "@/hooks";
import { cn } from "@/lib";

type TokenTypes = "1" | "2";

const Recharge: React.FC = () => {
  const [open, setOpen] = useRecharge();
  const [type, setType] = React.useState<TokenTypes>("1");

  const t = useTranslations("recharge");

  const onClose = () => setOpen(false);

  const onClick = () => {
    window.location.href =
      "https://lgpt.lemonsqueezy.com/checkout/buy/c1dcfdb0-57c6-406a-87d2-a1347daab068";
  };

  return (
    <Modal
      title={t("tokens-recharge")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <Tabs.Root
        value={type}
        onValueChange={(value) => setType(value as TokenTypes)}
      >
        <div className="flex mb-2 gap-4 justify-between items-center">
          <Tabs.List
            className={cn(
              "flex-1 flex rounded-md text-sm w-auto p-1 text-[hsl(215.4,16.3%,56.9%)]",
              "bg-neutral-200/70 dark:bg-slate-900"
            )}
          >
            <Tabs.Trigger
              value="1"
              className={cn(
                "rounded-md py-1 px-3 transition-colors flex-1",
                "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
              )}
            >
              <div className="flex gap-2 items-center justify-center">
                {t("pkg")} 1
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="2"
              className={cn(
                "rounded-md py-1 px-3 transition-colors flex-1",
                "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
              )}
            >
              <div className="flex gap-2 items-center justify-center">
                {t("pkg")} 2
              </div>
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content
          value="1"
          className="border rounded-md max-h-[calc(100vh-400px)] p-4 box-border overflow-y-auto relative dark:border-neutral-200/40"
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="dark:text-neutral-300">L-GPT Tokens 1</span>
            </div>
            <div>
              <span className="bg-clip-text bg-license-premium font-semibold text-transparent text-3xl">
                $5.00
              </span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("pkg-1-desc-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("pkg-1-desc-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("no-expiration-date")}
              </div>
            </div>
          </div>
          <BsLightningChargeFill
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </Tabs.Content>
        <Tabs.Content
          value="2"
          className="border rounded-md max-h-[calc(100vh-400px)] p-4 box-border overflow-y-auto relative dark:border-neutral-200/40"
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="dark:text-neutral-300">L-GPT Tokens 2</span>
            </div>
            <div>
              <span className="bg-clip-text bg-license-premium font-semibold text-transparent text-3xl">
                $10.00
              </span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("pkg-2-desc-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("pkg-2-desc-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("no-expiration-date")}
              </div>
            </div>
          </div>
          <BsLightningChargeFill
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </Tabs.Content>
      </Tabs.Root>
      <div className="flex mt-3 justify-center">
        <Button type="primary" onClick={onClick}>
          {t("recharge")}
        </Button>
      </div>
      <div className="mt-2">
        <Link
          className="text-sm"
          target="_blank"
          href="https://docs.ltopx.com/token"
        >
          {t("learn-more-about-token")}
        </Link>
      </div>
    </Modal>
  );
};

export default Recharge;
