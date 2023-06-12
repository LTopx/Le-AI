import * as React from "react";
import { cn } from "@/lib";
import { AiOutlinePieChart, AiOutlineLoading } from "react-icons/ai";
import { useTokens } from "@/hooks";

interface TokenProps {
  type: "pc" | "mobile";
}

const Tokens: React.FC<TokenProps> = ({ type }) => {
  const [tokens, setTokens] = useTokens();

  const { costTokens, loading } = tokens;

  React.useEffect(() => {
    setTokens();
  }, []);

  return (
    <div
      className={cn(
        "h-11 text-sm cursor-pointer flex items-center gap-2 px-2 transition-colors",
        "hover:bg-gray-200/60 dark:hover:bg-slate-700/70",
        { "rounded-md text-black/90 dark:text-white/90": type === "mobile" }
      )}
    >
      <AiOutlinePieChart size={16} />
      <div className="flex items-center gap-2">
        {!!(!costTokens && loading) ? (
          <AiOutlineLoading className="animate-spin" />
        ) : (
          costTokens
        )}
        <span>Tokens</span>
      </div>
    </div>
  );
};

export default Tokens;
