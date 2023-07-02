"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Input, Button } from "@/components/ui";

interface UserInfo {
  name: string;
  email: string;
  image: string;
}

export default function Account() {
  const { data: session, update } = useSession();
  const t = useTranslations("account");
  const tCommon = useTranslations("common");

  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    name: "",
    email: "",
    image: "",
  });

  const onchange = (value: any, type: keyof UserInfo) => {
    setUserInfo((info) => {
      const newInfo = JSON.parse(JSON.stringify(info));
      newInfo[type] = value;
      return newInfo;
    });
  };

  const save = () => {
    if (!userInfo.name?.trim()) {
      return toast.error(t("name-placeholder"), { id: "input-name" });
    }
    const params = {
      name: userInfo.name,
      image: userInfo.image || "",
    };

    setLoading(true);
    fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(params),
    })
      .then(async (response) => {
        if (!response.ok) {
          const res = await response.json();
          return toast.error(res.msg || tCommon("service-error"), {
            id: "service-error",
          });
        }
        const res = await response.json();
        if (res.error) {
          return toast.error(res.msg || tCommon("service-error"), {
            id: "service-error",
          });
        }

        toast.success(t("save-success"), { id: "save-success" });
        // update session
        update();
      })
      .catch(() => {
        toast.error(tCommon("service-error"), { id: "service-error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (!session?.user) {
      setUserInfo({ name: "", email: "", image: "" });
    } else {
      setUserInfo(session.user as UserInfo);
    }
  }, [session?.user]);

  return (
    <div>
      <div className="text-2xl font-semibold">{t("user-info")}</div>
      <div className="text-sm mt-4 mb-8">{t("account-tip")}</div>
      <div className="p-6 border rounded-md dark:border-neutral-600">
        <div className="mb-5">
          <div className="text-sm mb-1.5">{t("email")}</div>
          <Input
            disabled
            placeholder={t("email-placeholder")}
            allowClear
            value={userInfo.email}
          />
        </div>
        <div className="mb-5">
          <div className="text-sm mb-1.5">
            {t("name")}
            <span className="text-rose-500"> *</span>
          </div>
          <Input
            placeholder={t("name-placeholder")}
            allowClear
            value={userInfo.name}
            onChange={(value) => onchange(value, "name")}
          />
        </div>
        <div className="mb-5">
          <div className="text-sm mb-1.5">{t("avatar")}</div>
          <Input
            placeholder={t("avatar-placeholder")}
            allowClear
            value={userInfo.image}
            onChange={(value) => onchange(value, "image")}
          />
        </div>
        <div>
          <Button type="primary" loading={loading} onClick={save}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
