import React from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next-intl/client";
import { DropdownOption } from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const languages: DropdownOption[] = [
  { label: "🇺🇸 English", value: "en" },
  { label: "🇨🇳 简体中文", value: "zh-CN" },
  { label: "🇭🇰 繁体中文", value: "zh-HK" },
  // { label: "🇯🇵 日本語", value: "ja" },
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={locale} onValueChange={onLocaleChange}>
          {languages.map((item) => (
            <DropdownMenuRadioItem
              className="cursor-pointer"
              key={item.value}
              value={item.value}
            >
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
