import * as React from "react";
import toast from "react-hot-toast";

export interface UseRevokeProps {
  btn?: string;
  length?: number;
  revoke?: (value: any[]) => void;
  tip?: string;
}

export interface UseRevokeReturn {}

const useRevoke = ({ btn, length = 1, revoke, tip }: UseRevokeProps) => {
  const revokeListRef = React.useRef<any[]>([]);

  const set = (key: string, value: any) => {
    if (revokeListRef.current.length >= length) {
      revokeListRef.current.push({ key, value });
      revokeListRef.current = revokeListRef.current.slice(
        1,
        revokeListRef.current.length
      );
    } else {
      revokeListRef.current.push({ key, value });
    }
    toast.dismiss();
    toast(() => (
      <div className="flex gap-2 text-sm">
        <span>{tip || "Deleted."}</span>
        <button onClick={onRevoke} style={{ color: "#1677ff" }}>
          {btn || "undo"}
        </button>
      </div>
    ));
  };

  const onRevoke = () => {
    revoke?.(revokeListRef.current);
    toast.dismiss();
  };

  return { set };
};

export { useRevoke };
