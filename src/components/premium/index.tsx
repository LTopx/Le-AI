import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { AiFillGift, AiOutlineTeam } from "react-icons/ai";
import { FaCrown } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { cn } from "@/lib";
import { usePremium, useUserInfo } from "@/hooks";
import { Modal, Link } from "@/components/ui";
import PremiumBtn, { type LicenseTabTypes } from "./button";

const Premium: React.FC = () => {
  const router = useRouter();
  const [userInfo] = useUserInfo();
  const { license_type, freeTrialed } = userInfo;

  const t = useTranslations("premium");

  const [open, setOpen] = usePremium();
  const [type, setType] = React.useState<LicenseTabTypes>("premium");

  const onClose = () => setOpen(false);

  const onLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  const onPay = (url: string) => {
    window.location.href = url;
  };

  React.useEffect(() => {
    if (open) setType("premium");
  }, [open]);

  return (
    <Modal
      rootClassName="top-[50%]"
      title={t("license")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <Tabs.Root
        value={type}
        onValueChange={(value) => setType(value as LicenseTabTypes)}
      >
        <div className="flex mb-2 gap-4 justify-between items-center">
          <Tabs.List
            className={cn(
              "flex-1 flex rounded-md text-sm w-auto p-1 text-[hsl(215.4,16.3%,56.9%)]",
              "bg-neutral-200/70 dark:bg-slate-900"
            )}
          >
            <Tabs.Trigger
              value="free"
              className={cn(
                "rounded-md py-1 px-3 transition-colors flex-1",
                "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
              )}
            >
              <div className="flex gap-2 items-center justify-center">
                {t("free")}
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="premium"
              className={cn(
                "rounded-md py-1 px-3 transition-colors flex-1",
                "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
              )}
            >
              <div className="flex gap-2 items-center justify-center">
                {t("premium")}
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="team"
              className={cn(
                "rounded-md py-1 px-3 transition-colors flex-1",
                "data-[state=active]:bg-white data-[state=active]:text-neutral-950",
                "dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-[hsl(213,31%,91%)]"
              )}
            >
              <div className="flex gap-2 items-center justify-center">
                {t("team")}
              </div>
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content
          value="free"
          className="border rounded-md max-h-[calc(100vh-400px)] p-4 box-border overflow-y-auto relative dark:border-neutral-200/40"
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span>L-GPT</span>
              <span>{t("free")}</span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("free-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("free-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("free-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("free-4")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("free-5")}
              </div>
            </div>
          </div>
          <AiFillGift
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </Tabs.Content>
        <Tabs.Content
          value="premium"
          className={cn(
            "border border-blue-50/50 rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40",
            "bg-gradient-to-r from-blue-100 to-cyan-100 relative"
          )}
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="dark:text-neutral-600">L-GPT</span>
              <span className="bg-clip-text bg-license-premium text-transparent">
                {t("premium")}
              </span>
            </div>
            <div>
              <span className="bg-clip-text bg-license-premium font-semibold text-transparent text-3xl">
                $9.99
              </span>
              <span className="ml-1 text-zinc-500 line-through">$26.99</span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-4")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-5")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-6")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("premium-7")}
              </div>
            </div>
          </div>
          <FaCrown
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </Tabs.Content>
        <Tabs.Content
          value="team"
          className={cn(
            "border border-violet-50/50 rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40",
            "bg-gradient-to-r from-violet-100 to-fuchsia-100 relative"
          )}
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="dark:text-neutral-600">L-GPT</span>
              <span className="bg-clip-text bg-license-team text-transparent">
                {t("team")}
              </span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("team-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("team-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("team-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <FaCheckCircle
                  size={16}
                  className="left-0 text-green-400 absolute"
                />
                {t("team-4")}
              </div>
            </div>
          </div>
          <AiOutlineTeam
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </Tabs.Content>
      </Tabs.Root>
      <PremiumBtn
        type={type}
        license_type={license_type}
        freeTrialed={freeTrialed}
        onLogin={onLogin}
        onPay={onPay}
      />
      <div className="my-2 text-orange-400 text-sm">{t("bought-success")}</div>
      <div>
        <Link
          className="text-sm"
          target="_blank"
          href="https://docs.ltopx.com/license"
        >
          {t("learn-more-license")}
        </Link>
      </div>
    </Modal>
  );
};

export default Premium;
