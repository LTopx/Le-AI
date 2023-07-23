import React from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { Dropdown, DropdownOption } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";

export const languages: DropdownOption[] = [
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇺🇸 English", value: "en" },
];

export default function LanguageSelect({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [loadingChangeLang, setLoadingChangeLang] = React.useState(false);

  const updateMobileMenuOpen = useOpenStore(
    (state) => state.updateMobileMenuOpen
  );

  const onLocaleChange = (value: string) => {
    if (value === locale) return;
    setLoadingChangeLang(true);
    router.replace(value);
    if (mobile) updateMobileMenuOpen(false);
  };

  return (
    <Dropdown
      selectable
      side="top"
      options={languages}
      value={locale}
      onSelect={onLocaleChange}
    >
      <div className="flex flex-1 justify-center">
        <div
          className={cn(
            "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
            "hover:bg-gray-200/60",
            "dark:hover:bg-slate-700/70"
          )}
        >
          {loadingChangeLang ? (
            <Icon icon="loading_line" size={20} className="animate-spin" />
          ) : (
            <Icon icon="translate_2_line" size={24} />
          )}
        </div>
      </div>
    </Dropdown>
  );
}
