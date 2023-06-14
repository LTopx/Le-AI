import { RiChatSmile2Line } from "react-icons/ri";
import { HiOutlineTranslate } from "react-icons/hi";
import { AiFillAlert, AiOutlineLoading } from "react-icons/ai";
import { FaBook } from "react-icons/fa";
import { TbSailboat } from "react-icons/tb";
import { BsVectorPen, BsCodeSlash } from "react-icons/bs";
import { MdMovieEdit } from "react-icons/md";
import type { ChannelIcon } from "@/hooks";
import { isUndefined } from "@/lib";

export default function MenuIcon({
  name,
  className,
  loading = false,
}: {
  name: ChannelIcon;
  className?: string;
  loading?: boolean;
}) {
  const localClassName = "top-[50%] left-0 translate-y-[-50%] absolute";

  const props = {
    size: 16,
    className: isUndefined(className) ? localClassName : className,
  };

  if (loading) {
    return (
      <div className="top-[50%] left-0 translate-y-[-50%] absolute">
        <AiOutlineLoading size={16} className="animate-spin" />
      </div>
    );
  }

  if (name === "RiChatSmile2Line") return <RiChatSmile2Line {...props} />;

  if (name === "BsVectorPen") return <BsVectorPen {...props} />;

  if (name === "HiOutlineTranslate") return <HiOutlineTranslate {...props} />;

  if (name === "FaBook") return <FaBook {...props} />;

  if (name === "TbSailboat") return <TbSailboat {...props} />;

  if (name === "BsCodeSlash") return <BsCodeSlash {...props} />;

  if (name === "MdMovieEdit") return <MdMovieEdit {...props} />;

  if (name === "AiFillAlert") return <AiFillAlert {...props} />;

  return null;
}
