import React from "react";
import { useTranslations } from "next-intl";
import { Modal, Tabs, type TabsOption } from "@ltopx/lx-ui";
import { useOpenStore } from "@/hooks/useOpen";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import PremiumBtn, { type LicenseTypes } from "./button";

export default function Premium() {
  const tGlobal = useTranslations("global");
  const tPremium = useTranslations("premium");

  const [open, setOpen] = useOpenStore((state) => [
    state.premiumOpen,
    state.updatePremiumOpen,
  ]);
  const [type, setType] = React.useState<LicenseTypes>("premium");
  const options: TabsOption[] = [
    {
      label: tPremium("free"),
      value: "free",
      children: (
        <div className="border rounded-md max-h-[calc(100vh-400px)] p-4 box-border overflow-y-auto relative dark:border-neutral-200/40">
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span>Le-AI</span>
              <span>{tPremium("free")}</span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("free-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("free-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("free-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("free-4")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-300">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("free-5")}
              </div>
            </div>
          </div>
          <Icon
            icon="gift_fill"
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </div>
      ),
    },
    {
      label: tGlobal("premium"),
      value: "premium",
      children: (
        <div
          className={cn(
            "border border-blue-50/50 rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40",
            "bg-gradient-to-r from-blue-100 to-cyan-100 relative"
          )}
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="bg-clip-text bg-license-premium text-transparent">
                {tGlobal("premium")}
              </span>
            </div>
            <div>
              <span className="bg-clip-text bg-license-premium font-semibold text-transparent text-3xl">
                $12.99
              </span>
              <span className="ml-1 text-zinc-500 line-through">$26.99</span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-4")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-5")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-6")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-7")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("premium-8")}
              </div>
            </div>
          </div>
          <Icon
            icon="vip_2_fill"
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </div>
      ),
    },
    {
      label: tPremium("team"),
      value: "team",
      children: (
        <div
          className={cn(
            "border border-violet-50/50 rounded-md max-h-[calc(100vh-400px)] p-4 overflow-y-auto dark:border-neutral-200/40",
            "bg-gradient-to-r from-violet-100 to-fuchsia-100 relative"
          )}
        >
          <div>
            <div className="flex font-semibold text-2xl gap-2">
              <span className="dark:text-neutral-600">Le-AI</span>
              <span className="bg-clip-text bg-license-team text-transparent">
                {tPremium("team")}
              </span>
            </div>
            <div className="flex flex-col mt-2 text-sm gap-2">
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("team-1")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("team-2")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("team-3")}
              </div>
              <div className="flex pl-6 text-neutral-600 gap-2 items-center relative dark:text-neutral-600">
                <Icon
                  icon="check_circle_fill"
                  size={18}
                  className="left-0 text-green-400 absolute"
                />
                {tPremium("team-4")}
              </div>
            </div>
          </div>
          <Icon
            icon="group_fill"
            size={32}
            className="top-4 right-4 text-orange-400 absolute"
          />
        </div>
      ),
    },
  ];

  const onClose = () => setOpen(false);

  React.useEffect(() => {
    if (open) setType("premium");
  }, [open]);

  return (
    <Modal
      title={tPremium("license")}
      open={open}
      onClose={onClose}
      footer={null}
    >
      <Tabs
        itemsFull
        options={options}
        activeTab={type}
        onChange={(value) => setType(value as LicenseTypes)}
      />
      <PremiumBtn type={type} />
    </Modal>
  );
}
