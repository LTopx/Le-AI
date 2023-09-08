import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Input,
  Select,
  Textarea,
  Tooltip,
  type SelectOption,
} from "@ltopx/lx-ui";
import Icon from "@/components/icon";
import MenuIcon from "@/components/menu/icon";
import type { Character } from "@/lib/character";
import { useCharacterStore } from "@/hooks/useCharacter";

interface ICharacter {
  name: Character["name"];
  icon: Character["icon"];
  desc: Character["desc"];
  content: Character["content"];
  welcome: Character["welcome"];
  model_config: Character["model_config"];
}

const options: SelectOption[] = [
  {
    label: "RiChatSmile2Line",
    value: "RiChatSmile2Line",
  },
  {
    label: "HiOutlineTranslate",
    value: "HiOutlineTranslate",
  },
  {
    label: "FaBook",
    value: "FaBook",
  },
  {
    label: "MdMovieEdit",
    value: "MdMovieEdit",
  },
  {
    label: "AiFillAlert",
    value: "AiFillAlert",
  },
  {
    label: "BsVectorPen",
    value: "BsVectorPen",
  },
  {
    label: "TbSailboat",
    value: "TbSailboat",
  },
  {
    label: "BsCodeSlash",
    value: "BsCodeSlash",
  },
  {
    label: "AngelFill",
    value: "AngelFill",
  },
  {
    label: "UnlockLine",
    value: "UnlockLine",
  },
  {
    label: "DocumentLine",
    value: "DocumentLine",
  },
  {
    label: "GameLine",
    value: "GameLine",
  },
];

const renderLabel = (row: any) => {
  return (
    <div className="flex gap-2 items-center">
      <MenuIcon className="" name={row.value} />
      <span>{row.value}</span>
    </div>
  );
};

const CreateCharacter = React.forwardRef((_, forwardedRef) => {
  const tGlobal = useTranslations("global");
  const tCharacter = useTranslations("character");

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<ICharacter>({
    name: "",
    icon: "RiChatSmile2Line",
    desc: "",
    content: "",
    welcome: "",
    model_config: {
      model_type: "openai",
      model_name: "gpt-3.5-turbo-16k",
      context_length: 8,
    },
  });

  const nameRef = React.useRef<any>(null);
  const descRef = React.useRef<any>(null);
  const contentRef = React.useRef<any>(null);

  const onClose = () => setOpen(false);

  const onChangeForm = (value: any, key: keyof ICharacter) => {
    setFormData((data: ICharacter) => {
      const newData = JSON.parse(JSON.stringify(data));
      newData[key] = value;
      return newData;
    });
  };

  const addList = useCharacterStore((state) => state.addList);

  const onOk = () => {
    if (!formData.name) {
      nameRef.current?.focus();
      return toast.error(tGlobal("please-enter"), {
        id: "enter-name",
      });
    }
    if (!formData.desc) {
      descRef.current?.focus();
      return toast.error(tGlobal("please-enter"), { id: "enter-desc" });
    }
    if (!formData.content) {
      contentRef.current?.focus();
      return toast.error(tGlobal("please-enter"), { id: "enter-content" });
    }
    const params: Character = {
      id: uuidv4(),
      icon: formData.icon,
      type: "mine",
      handle_type: "text",
      name: formData.name,
      desc: formData.desc,
      content: formData.content,
      welcome: formData.welcome,
      model_config: {
        model_type: "openai",
        model_name: "gpt-3.5-turbo-16k",
        context_length: 8,
      },
    };
    addList(params);
    toast.success(tGlobal("operation-successful"));
    setOpen(false);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setFormData({
        name: "",
        icon: "RiChatSmile2Line",
        desc: "",
        content: "",
        welcome: "",
        model_config: {
          model_type: "openai",
          model_name: "gpt-3.5-turbo-16k",
          context_length: 8,
        },
      });
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={tGlobal("create")}
      open={open}
      maskClosable={false}
      okText={tGlobal("ok-spacing")}
      cancelText={tGlobal("cancel-spacing")}
      onClose={onClose}
      onOk={onOk}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tGlobal("name")}
          </div>
          <Input
            ref={nameRef}
            allowClear
            placeholder={tGlobal("please-enter")}
            maxLength={40}
            value={formData.name}
            onChange={(value) => onChangeForm(value, "name")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tGlobal("icon")}
          </div>
          <Select
            options={options}
            renderLabel={renderLabel}
            value={formData.icon}
            onChange={(value) => onChangeForm(value, "icon")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tGlobal("desc")}
          </div>
          <Textarea
            ref={descRef}
            className="h-28"
            allowClear
            placeholder={tGlobal("please-enter")}
            maxLength={40}
            value={formData.desc}
            onChange={(value) => onChangeForm(value, "desc")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            Prompt {tGlobal("content")}
          </div>
          <Textarea
            ref={contentRef}
            className="h-28"
            allowClear
            placeholder={tGlobal("please-enter")}
            value={formData.content}
            onChange={(value) => onChangeForm(value, "content")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90 flex items-center gap-1">
            {tCharacter("welcome-message")}
            <Tooltip title={tCharacter("welcome-message-tip")}>
              <Icon icon="question_line" size={18} />
            </Tooltip>
          </div>
          <Textarea
            className="h-20"
            allowClear
            placeholder={tGlobal("please-enter")}
            value={formData.welcome}
            onChange={(value) => onChangeForm(value, "welcome")}
          />
        </div>
      </div>
    </Modal>
  );
});

CreateCharacter.displayName = "CreateCharacter";

export default CreateCharacter;
