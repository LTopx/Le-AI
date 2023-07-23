import React from "react";
import { useTheme } from "next-themes";
import Icon from "@/components/icon";
import { cn } from "@/lib";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [nowTheme, setNowTheme] = React.useState(theme);

  const onToggleTheme = () => setTheme(nowTheme === "light" ? "dark" : "light");

  React.useEffect(() => {
    setNowTheme(theme === "dark" ? "dark" : "light");
  }, [theme]);

  return (
    <div className="flex flex-1 justify-center">
      <div
        onClick={onToggleTheme}
        className={cn(
          "w-8 h-8 flex justify-center items-center cursor-pointer transition-colors rounded-md",
          "hover:bg-gray-200/60",
          "dark:hover:bg-slate-700/70"
        )}
      >
        {nowTheme === "light" ? (
          <Icon icon="moon_fill" size={24} />
        ) : (
          <Icon icon="sun_line" size={22} />
        )}
      </div>
    </div>
  );
}
