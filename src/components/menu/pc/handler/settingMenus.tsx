import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Dropdown, type DropdownOption } from "@ltopx/lx-ui";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import Icon from "@/components/icon";

export default function SettingMenus() {
  const { theme, setTheme } = useTheme();

  const tCommon = useTranslations("common");
  const tMenu = useTranslations("menu");

  const [nowTheme, setNowTheme] = React.useState(theme);

  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);

  const options: DropdownOption[] = [
    {
      label: (
        <div className="flex items-center w-[100px] justify-between">
          {nowTheme === "light" ? (
            <Icon icon="moon_fill" size={20} />
          ) : (
            <Icon icon="sun_line" size={20} />
          )}
          <div>{tCommon("theme")}</div>
        </div>
      ),
      value: "theme",
    },
    {
      label: (
        <div className="flex items-center w-[100px] justify-between">
          <Icon icon="safe_alert_line" size={20} />
          <div>{tCommon("privacy")}</div>
        </div>
      ),
      value: "privacy",
    },
    {
      label: (
        <div className="flex items-center w-[100px] justify-between">
          <Icon icon="contacts_line" size={18} />
          <div>{tCommon("contact")}</div>
        </div>
      ),
      value: "contact",
    },
    {
      label: (
        <div className="flex items-center w-[100px] justify-between">
          <Icon icon="telegram_fill" size={18} className="text-[#3aa9ea]" />
          <div>Telegram</div>
        </div>
      ),
      value: "telegram",
    },
    {
      label: (
        <div className="flex items-center w-[100px] justify-between">
          <Icon icon="settings_3_line" size={20} />
          <div>{tMenu("setting")}</div>
        </div>
      ),
      value: "setting",
    },
  ];

  const onSelect = (value: string) => {
    if (value === "theme") {
      setTheme(nowTheme === "light" ? "dark" : "light");
    } else if (value === "privacy") {
      window.open("https://docs.ltopx.com/privacy");
    } else if (value === "contact") {
      window.open("https://goethan.cc");
    } else if (value === "telegram") {
      window.open("https://t.me/+7fLJJoGV_bJhYTk1");
    } else if (value === "setting") {
      updateSettingOpen(true);
    }
  };

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  return (
    <Dropdown side="top" options={options} onSelect={onSelect}>
      <div className="flex flex-1 justify-center">
        <div
          className={cn(
            "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
            "hover:bg-gray-200/60",
            "dark:hover:bg-slate-700/70"
          )}
        >
          <Icon icon="more_1_fill" size={22} />
        </div>
      </div>
    </Dropdown>
  );
}
