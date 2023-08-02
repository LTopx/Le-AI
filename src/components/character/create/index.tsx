import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import {
  Modal,
  Input,
  Select,
  Textarea,
  type SelectOption,
} from "@ltopx/lx-ui";
import MenuIcon from "@/components/menu/icon";
import type { Character } from "@/lib/character";
import { useCharacterStore } from "@/hooks/useCharacter";

interface ICharacter {
  name: Character["name"];
  icon: Character["icon"];
  desc: Character["desc"];
  content: Character["content"];
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
  const tCharacter = useTranslations("character");
  const tCommon = useTranslations("common");

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<ICharacter>({
    name: "",
    icon: "RiChatSmile2Line",
    desc: "",
    content: "",
    model_config: {
      model_type: "openai",
      model_name: "gpt-3.5-turbo-16k",
      context_length: 8,
    },
  });

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
      return toast.error(
        `${tCommon("please-enter")} ${tCharacter("template-name")}`,
        { id: "enter-name" }
      );
    }
    if (!formData.desc) {
      return toast.error(
        `${tCommon("please-enter")} ${tCharacter("template-desc")}`,
        { id: "enter-desc" }
      );
    }
    if (!formData.content) {
      return toast.error(
        `${tCommon("please-enter")} ${tCharacter("template-content")}`,
        { id: "enter-content" }
      );
    }
    const params: Character = {
      id: uuidv4(),
      icon: formData.icon,
      type: "mine",
      handle_type: "text",
      name: formData.name,
      desc: formData.desc,
      content: formData.content,
      model_config: {
        model_type: "openai",
        model_name: "gpt-3.5-turbo-16k",
        context_length: 8,
      },
    };
    addList(params);
    toast.success(tCharacter("create-success"));
    setOpen(false);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init() {
      setFormData({
        name: "",
        icon: "RiChatSmile2Line",
        desc: "",
        content: "",
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
      title={tCharacter("create")}
      open={open}
      maskClosable={false}
      okText={tCommon("ok")}
      cancelText={tCommon("cancel")}
      onClose={onClose}
      onOk={onOk}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tCharacter("template-name")}
          </div>
          <Input
            allowClear
            placeholder={tCommon("please-enter")}
            maxLength={40}
            value={formData.name}
            onChange={(value) => onChangeForm(value, "name")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tCharacter("template-icon")}
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
            {tCharacter("template-desc")}
          </div>
          <Textarea
            className="h-28"
            allowClear
            placeholder={tCommon("please-enter")}
            maxLength={40}
            value={formData.desc}
            onChange={(value) => onChangeForm(value, "desc")}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tCharacter("template-content")}
          </div>
          <Textarea
            className="h-28"
            allowClear
            placeholder={tCommon("please-enter")}
            maxLength={40}
            value={formData.content}
            onChange={(value) => onChangeForm(value, "content")}
          />
        </div>
      </div>
      {/* <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="text-sm text-black/90 mb-2 dark:text-white/90">
            {tCharacter("template-name")}
          </div>
          <Input
            allowClear
            placeholder={tCommon("please-enter")}
            maxLength={40}
            value={formData.name}
            onChange={(value) => onChangeForm(value, "name")}
          />
        </div>
      </div> */}
    </Modal>
  );
});

CreateCharacter.displayName = "CreateCharacter";

export default CreateCharacter;
