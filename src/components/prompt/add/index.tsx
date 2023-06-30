import React from "react";
import { useTranslations } from "next-intl";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { Prompt } from "@prisma/client";
import Icon from "@/components/icon";
import { Modal, Input, Textarea, Dropdown } from "@/components/ui";
import type { IDropdownItems } from "@/components/ui/Dropdown";
import MenuIcon from "@/components/menu/icon";
import { usePrompt } from "@/hooks";
import type { ChannelIcon } from "@/hooks";

const options: IDropdownItems[] = [
  {
    label: "RiChatSmile2Line",
    value: "RiChatSmile2Line",
    icon: <Icon icon="chat_4_line" />,
  },
  {
    label: "HiOutlineTranslate",
    value: "HiOutlineTranslate",
    icon: <Icon icon="translate_2_line" />,
  },
  {
    label: "FaBook",
    value: "FaBook",
    icon: <Icon icon="book_2_fill" />,
  },
  {
    label: "MdMovieEdit",
    value: "MdMovieEdit",
    icon: <Icon icon="film_line" />,
  },
  {
    label: "AiFillAlert",
    value: "AiFillAlert",
    icon: <Icon icon="alert_octagon_fill" />,
  },
  {
    label: "BsVectorPen",
    value: "BsVectorPen",
    icon: <Icon icon="pen_line" />,
  },
  {
    label: "TbSailboat",
    value: "TbSailboat",
    icon: <Icon icon="sailboat_line" />,
  },
  {
    label: "BsCodeSlash",
    value: "BsCodeSlash",
    icon: <Icon icon="code_line" />,
  },
];

const Add = React.forwardRef((_, forwardedRef) => {
  const t = useTranslations("prompt");
  const tCommon = useTranslations("common");

  // state
  const [open, setOpen] = React.useState(false);

  // data
  const [, setPrompt] = usePrompt();
  const [form, setForm] = React.useState({
    id: "",
    title: "",
    icon: "RiChatSmile2Line",
    desc: "",
    content: { cn: "", en: "" },
  });

  const onClose = () => setOpen(false);

  const onChangeValue = (value: string, type: string, extra?: any) => {
    setForm((form) => {
      const newForm = JSON.parse(JSON.stringify(form));
      if (type === "content") {
        newForm[type][extra] = value;
      } else {
        newForm[type] = value;
      }
      return newForm;
    });
  };

  const onOk = () => {
    if (!form.title?.trim()) {
      return toast.error(t("enter-title"), { id: "empty_title" });
    }
    if (!form.desc?.trim()) {
      return toast.error(t("enter-desc"), { id: "empty_desc" });
    }
    if (!form.content.cn?.trim() && !form.content.en?.trim()) {
      return toast.error(t("enter-content"), { id: "empty_content" });
    }
    setPrompt((prompt) => {
      if (form.id) {
        const findPrompt = prompt.list.find((item) => item.id === form.id);
        if (!findPrompt) return prompt;
        findPrompt.title = form.title;
        findPrompt.icon = form.icon;
        findPrompt.desc = form.desc;
        findPrompt.content = form.content;
      } else {
        prompt.list.push({ ...form, id: uuidv4() });
      }
      return prompt;
    });
    setOpen(false);
  };

  React.useImperativeHandle(forwardedRef, () => ({
    init(data?: Prompt) {
      const content: any = data?.content || { cn: "", en: "" };

      setForm({
        id: data?.id || "",
        title: data?.title || "",
        icon: data?.icon || "RiChatSmile2Line",
        desc: data?.desc || "",
        content: { cn: content.cn, en: content.en },
      });
      setOpen(true);
    },
  }));

  return (
    <Modal
      title={form.id ? t("edit-prompt") : t("add-prompt")}
      maskClosable={false}
      open={open}
      onClose={onClose}
      onOk={onOk}
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm mb-1">{t("title")}</div>
          <div className="flex gap-2 items-center">
            <Dropdown
              selectable
              align="start"
              content={
                <div className="text-sm p-2 border-b dark:border-neutral-200/40">
                  {t("choose-prompt-icon")}
                </div>
              }
              trigger={
                <div className="border dark:border-neutral-200/40 rounded-md cursor-pointer flex h-8 w-8 justify-center items-center">
                  <MenuIcon
                    className="nothing"
                    name={form.icon as ChannelIcon}
                  />
                </div>
              }
              options={options}
              value={form.icon}
              onSelect={(val) => onChangeValue(val, "icon")}
            />
            <Input
              className="flex-1"
              allowClear
              maxLength={50}
              placeholder={tCommon("please-enter")}
              value={form.title}
              onChange={(val) => onChangeValue(val, "title")}
            />
          </div>
        </div>
        <div>
          <div className="text-sm mb-1">{t("desc")}</div>
          <Input
            allowClear
            maxLength={200}
            placeholder={tCommon("please-enter")}
            value={form.desc}
            onChange={(val) => onChangeValue(val, "desc")}
          />
        </div>
        <div>
          <div className="text-sm mb-1">{t("content")}</div>
          <div className="border dark:border-neutral-200/40 rounded-md flex flex-col p-3 gap-3">
            <div>
              <div className="text-sm mb-1">CN</div>
              <Textarea
                placeholder={tCommon("please-enter")}
                value={form.content.cn}
                onChange={(val) => onChangeValue(val, "content", "cn")}
              />
            </div>
            <div>
              <div className="text-sm mb-1">EN</div>
              <Textarea
                placeholder={tCommon("please-enter")}
                value={form.content.en}
                onChange={(val) => onChangeValue(val, "content", "en")}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
});

Add.displayName = "Add";

export default Add;
