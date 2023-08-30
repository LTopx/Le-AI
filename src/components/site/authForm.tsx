"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { signIn } from "next-auth/react";
import { Button, Input, Divider } from "@ltopx/lx-ui";
import toast from "react-hot-toast";
import { cn } from "@/lib";
import Icon from "@/components/icon";
import { checkGithub, checkGoogle, checkEmail } from "@/lib/checkEnv";

export default function AuthForm() {
  const router = useRouter();
  const tGlobal = useTranslations("global");
  const tAuth = useTranslations("auth");

  const inputRef = React.useRef<any>(null);

  const [email, setEmail] = React.useState<string>("");
  const [loadingEmial, setLoadingEmail] = React.useState(false);
  const [loadingGithub, setLoadingGithub] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  const onGithubLogin = async () => {
    setLoadingGithub(true);
    await signIn("github", { callbackUrl: "/" });
  };

  const onGoogleLogin = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const onLogin = async () => {
    if (loadingEmial) return;

    if (!email?.trim()) {
      toast.error(tGlobal("please-enter"), { id: "email" });
      inputRef.current?.focus();
      return;
    }

    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    if (!reg.test(email)) {
      toast.error(tAuth("input-valid-email"), { id: "valid_email" });
      inputRef.current?.focus();
      return;
    }

    try {
      setLoadingEmail(true);
      const res: any = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) return toast.error(tAuth("auth-failed"));
      toast.success(tAuth("auth-success"));
      router.push(res.url);
    } catch (error) {
      setLoadingEmail(false);
      console.log(error, "login failed");
      toast.error(tAuth("auth-failed"));
    }
  };

  return (
    <div
      className={cn(
        "shadow-md w-96 z-10 m-auto rounded-xl px-8 py-4 max-w-[calc(100vw-2rem)]",
        "border border-neutral-200 dark:border-neutral-700/80",
        "dark:bg-[rgba(24,24,27,.8)]",
        {
          "pointer-events-none": loadingEmial || loadingGithub || loadingGoogle,
        }
      )}
    >
      <div className="font-bold mb-2 text-2xl">{tAuth("title")}</div>
      <div className="text-neutral-500 text-[15px]">
        {tAuth("continue-gpt")}
      </div>
      <div className="flex flex-col mt-8 gap-2">
        {checkGithub() && (
          <Button
            className="select-none"
            size="lg"
            icon={
              <Icon
                className="text-black dark:text-white"
                icon="github_line"
                size={16}
              />
            }
            loading={loadingGithub}
            onClick={onGithubLogin}
          >
            {tAuth("continue-with-github")}
          </Button>
        )}
        {checkGoogle() && (
          <Button
            className="select-none"
            size="lg"
            icon={<Icon icon="google_line" size={16} />}
            loading={loadingGoogle}
            onClick={onGoogleLogin}
          >
            {tAuth("continue-with-google")}
          </Button>
        )}
      </div>
      {checkEmail() && (checkGithub() || checkGoogle()) && (
        <Divider className="my-8">
          <span className="text-sm uppercase">{tGlobal("or")}</span>
        </Divider>
      )}
      {checkEmail() && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-medium mb-1 text-[13px]">
              {tAuth("email-address")}
            </div>
            <Input
              ref={inputRef}
              size="lg"
              placeholder={tGlobal("please-enter")}
              allowClear
              value={email}
              onChange={setEmail}
              onEnter={onLogin}
            />
          </div>
          <Button
            type="primary"
            size="lg"
            loading={loadingEmial}
            onClick={onLogin}
          >
            {tGlobal("continue")}
          </Button>
        </div>
      )}
    </div>
  );
}
