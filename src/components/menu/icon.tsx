import { RiChatSmile2Line } from "react-icons/ri";
import { HiOutlineTranslate } from "react-icons/hi";
import { FaBook } from "react-icons/fa";
import { MdMovieEdit } from "react-icons/md";
import type { ChannelIcon } from "@/hooks";

const MenuIcon: React.FC<{ name: ChannelIcon }> = ({ name }) => {
  const className = "top-[50%] left-0 translate-y-[-50%] absolute";

  const props = { size: 16, className };

  if (name === "RiChatSmile2Line") return <RiChatSmile2Line {...props} />;

  if (name === "HiOutlineTranslate") return <HiOutlineTranslate {...props} />;

  if (name === "FaBook") return <FaBook {...props} />;

  if (name === "MdMovieEdit") return <MdMovieEdit {...props} />;

  return null;
};

export default MenuIcon;
