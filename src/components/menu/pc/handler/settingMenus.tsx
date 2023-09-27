import React from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { cn } from "@/lib";
import { useOpenStore } from "@/hooks/useOpen";
import Icon from "@/components/icon";
import {
  Settings,
  Moon,
  Sun,
  ShieldAlert,
  Contact,
  Cloudy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingMenus() {
  const session = useSession();
  const { theme, setTheme } = useTheme();

  const tGlobal = useTranslations("global");
  const tCode = useTranslations("code");

  const [nowTheme, setNowTheme] = React.useState(theme);

  const updateSettingOpen = useOpenStore((state) => state.updateSettingOpen);
  const updateBackupOpen = useOpenStore((state) => state.updateBackupOpen);

  const onSelect = (value: string) => {
    if (value === "theme") {
      setTimeout(() => {
        setTheme(nowTheme === "light" ? "dark" : "light");
      }, 200);
    } else if (value === "privacy") {
      window.open("https://docs.le-ai.app/privacy");
    } else if (value === "contact") {
      window.open("https://goethan.cc");
    } else if (value === "backup-sync") {
      if (session.data) {
        updateBackupOpen(true);
      } else {
        toast.error(tCode("20001"), { id: "login-first" });
      }
    } else if (value === "setting") {
      setTimeout(() => {
        updateSettingOpen(true);
      }, 0);
    }
  };

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

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
            <Icon icon="more_1_fill" size={22} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 z-[500]">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSelect("theme")}
          >
            {nowTheme === "light" ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            <span>{tGlobal("theme")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSelect("privacy")}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>{tGlobal("privacy")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSelect("contact")}
          >
            <Contact className="mr-2 h-4 w-4" />
            <span>{tGlobal("contact")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSelect("backup-sync")}
          >
            <Cloudy className="mr-2 h-4 w-4" />
            <span>{tGlobal("backup-sync")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onSelect("setting")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{tGlobal("setting")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
