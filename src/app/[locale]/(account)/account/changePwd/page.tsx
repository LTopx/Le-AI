"use client";

import React from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { MD5 } from "crypto-js";
import { Loader2 } from "lucide-react";
import { useFetchError } from "@/hooks/useFetchError";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ChangePwd() {
  const tGlobal = useTranslations("global");
  const tAuth = useTranslations("auth");

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);

  const [hasPwd, setHasPwd] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  const { catchError } = useFetchError();

  const getUserInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user").then((res) => res.json());
      setHasPwd(!!res.data.password);
    } finally {
      setLoading(false);
    }
  };

  const onHandlePwd = async () => {
    if (hasPwd && !password?.trim()) {
      passwordRef.current?.focus();
      return toast.error(tGlobal("please-enter"), { id: "password_empty" });
    }

    if (!newPassword?.trim()) {
      newPasswordRef.current?.focus();
      return toast.error(tGlobal("please-enter"), { id: "newPassword_empty" });
    }

    if (password.trim() === newPassword.trim()) {
      passwordRef.current?.focus();
      return toast.error(tAuth("theme-password-error"), {
        id: "theme_password",
      });
    }

    const params: any = {
      newPassword: MD5(newPassword).toString(),
    };
    if (hasPwd) params.password = MD5(password).toString();

    try {
      setLoadingSubmit(true);

      const res = await fetch("/api/user", {
        method: "PUT",
        body: JSON.stringify(params),
      }).then((res) => res.json());

      if (res.error) {
        return toast.error(catchError(res), { id: "set_pwd_error" });
      }

      toast.success(tGlobal("operation-successful"));
      setPassword("");
      setNewPassword("");
      getUserInfo();
    } finally {
      setLoadingSubmit(false);
    }
  };

  React.useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{tAuth("change-password")}</h3>
        <p className="text-sm text-muted-foreground">
          {tAuth("change-password-tip")}
        </p>
      </div>
      <Separator />
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="flex space-x-4 items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 max-w-[calc(100vw-3rem)] w-[600px]" />
              <Skeleton className="h-4 max-w-[calc(100vw-3rem)] w-[600px]" />
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="space-y-2">
              <Skeleton className="h-4 max-w-[calc(100vw-3rem)] w-[600px]" />
              <Skeleton className="h-4 max-w-[calc(100vw-3rem)] w-[600px]" />
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {hasPwd && (
            <div className="space-y-2">
              <Label htmlFor="password">{tAuth("current-password")}</Label>
              <Input
                ref={passwordRef}
                id="password"
                type="password"
                className="max-w-[calc(100vw-6.9rem)] w-[600px]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="new_password">{tAuth("new-password")}</Label>
            <Input
              ref={newPasswordRef}
              id="new_password"
              type="password"
              className="max-w-[calc(100vw-6.9rem)] w-[600px]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button onClick={onHandlePwd} disabled={loadingSubmit}>
            {loadingSubmit && <Loader2 className="h-4 mr-2 animate-spin w-4" />}
            {hasPwd ? tAuth("change-password") : tAuth("set-password")}
          </Button>
        </div>
      )}
    </div>
  );
}
