import type { ChannelIcon } from "@/hooks/useChannel/types";
import { isUndefined } from "@/lib";
import Icon from "@/components/icon";
import { Loader2 } from "lucide-react";

export default function MenuIcon({
  name,
  className,
  loading = false,
}: {
  name: ChannelIcon;
  className?: string;
  loading?: boolean;
}) {
  const localClassName = "top-[50%] left-0 -translate-y-[50%] absolute";

  const props = {
    size: 16,
    className: isUndefined(className) ? localClassName : className,
  };

  if (loading) {
    return (
      <div className="top-[50%] left-0 -translate-y-[50%] absolute">
        <Loader2 className="h-4 w-4 animate-spin text-sky-400 dark:text-sky-400/90" />
      </div>
    );
  }

  if (name === "RiChatSmile2Line")
    return <Icon icon="chat_4_line" {...props} />;

  if (name === "BsVectorPen") return <Icon icon="pen_line" {...props} />;

  if (name === "HiOutlineTranslate")
    return <Icon icon="translate_2_line" {...props} />;

  if (name === "FaBook") return <Icon icon="book_2_fill" {...props} />;

  if (name === "TbSailboat") return <Icon icon="sailboat_line" {...props} />;

  if (name === "BsCodeSlash") return <Icon icon="code_line" {...props} />;

  if (name === "MdMovieEdit") return <Icon icon="film_line" {...props} />;

  if (name === "AngelFill") return <Icon icon="angel_fill" {...props} />;

  if (name === "UnlockLine") return <Icon icon="unlock_line" {...props} />;

  if (name === "DocumentLine") return <Icon icon="document_line" {...props} />;

  if (name === "GameLine") return <Icon icon="game_2_line" {...props} />;

  if (name === "AiFillAlert")
    return <Icon icon="alert_octagon_fill" {...props} />;

  return null;
}
