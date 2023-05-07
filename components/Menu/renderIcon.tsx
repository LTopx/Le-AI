import { RiChatSmile2Line } from "react-icons/ri";
import { HiOutlineTranslate } from "react-icons/hi";
import { FaBook } from "react-icons/fa";
import { MdMovieEdit } from "react-icons/md";

const renderIcon = (name: string) => {
  const className = "top-[50%] left-0 translate-y-[-50%] absolute";

  if (name === "RiChatSmile2Line")
    return <RiChatSmile2Line size={16} className={className} />;

  if (name === "HiOutlineTranslate")
    return <HiOutlineTranslate size={16} className={className} />;

  if (name === "FaBook") return <FaBook size={16} className={className} />;

  if (name === "MdMovieEdit")
    return <MdMovieEdit size={16} className={className} />;

  return null;
};

export default renderIcon;
