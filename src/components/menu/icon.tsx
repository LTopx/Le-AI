import type { ChannelIcon } from "@/hooks/useChannel/types";
import { isUndefined } from "@/lib";
import Icon from "@/components/icon";

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
        <Icon icon="loading_line" size={16} className="animate-spin" />
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

  if (name === "AiFillAlert")
    return <Icon icon="alert_octagon_fill" {...props} />;

  return null;
}
