"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserInfo {
  name: string;
  email: string;
  image: string;
}

export default function UserInfo() {
  const tGlobal = useTranslations("global");

  const { data: session, update } = useSession();

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

  const onSave = () => {
    if (!userInfo.name?.trim()) {
      return toast.error(tGlobal("please-enter"), { id: "input-name" });
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
          return toast.error(res.msg || tGlobal("service-error"), {
            id: "service-error",
          });
        }
        const res = await response.json();
        if (res.error) {
          return toast.error(res.msg || tGlobal("service-error"), {
            id: "service-error",
          });
        }

        toast.success(tGlobal("operation-successful"), {
          id: "operation-successful",
        });
        // update session
        update();
      })
      .catch(() => {
        toast.error(tGlobal("service-error"), { id: "service-error" });
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{tGlobal("user-info")}</h3>
        <p className="text-sm text-muted-foreground">
          {tGlobal("user-info-tip")}
        </p>
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="mail">{tGlobal("mail")}</Label>
          <Input id="mail" disabled value={userInfo.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nickname">{tGlobal("nickname")}</Label>
          <Input
            id="nickname"
            value={userInfo.name}
            onChange={(e) => onchange(e.target.value, "name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar">{tGlobal("avatar")}</Label>
          <Input
            id="avatar"
            value={userInfo.image}
            onChange={(e) => onchange(e.target.value, "image")}
          />
        </div>
        <Button onClick={onSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {tGlobal("save")}
        </Button>
      </div>
    </div>
  );
}
