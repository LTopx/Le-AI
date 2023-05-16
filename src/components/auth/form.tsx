"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const AuthForm: React.FC = () => {
  const router = useRouter();
  const inputRef = React.useRef<any>(null);
  const [email, setEmail] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const t = useTranslations("auth");

  const onLogin = async () => {
    if (loading) return;

    if (!email?.trim()) {
      toast.error(t("input-email"), { id: "email" });
      inputRef.current?.focus();
      return;
    }

    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    if (!reg.test(email)) {
      toast.error(t("input-valid-email"), { id: "valid_email" });
      inputRef.current?.focus();
      return;
    }
    try {
      setLoading(true);
      const res: any = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) return toast.error(t("auth-failed"));
      toast.success(t("auth-success"));
      router.push(res.url);
    } catch (error) {
      console.log(error, "login failed");
      toast.error(t("auth-failed"));
    } finally {
      setLoading(false);
    }
  };

  const onGithubLogin = async () => {
    await signIn("github", { redirect: false, callbackUrl: "/" });
  };

  const onGoogleLogin = async () => {
    await signIn("google", { redirect: false, callbackUrl: "/" });
  };

  return (
    <>
      <div className="text-3xl font-bold mb-10">{t("title")}</div>
      <div className="w-[20rem] max-w-[calc(100vw-3rem)]">
        <Input
          ref={inputRef}
          className="w-full"
          size="large"
          placeholder={t("input-email")}
          allowClear
          value={email}
          onChange={setEmail}
          onEnter={onLogin}
        />
        <Button
          className="w-full mt-2 mb-4"
          size="base"
          type="primary"
          loading={loading}
          onClick={onLogin}
        >
          {t("button-text")}
        </Button>
        <div className="w-full h-[1px] bg-neutral-200 mb-4" />
        <div className="flex flex-col gap-2">
          <Button
            size="base"
            block
            leftIcon={<AiFillGithub />}
            onClick={onGithubLogin}
          >
            Continue with Github
          </Button>
          <Button
            size="base"
            block
            leftIcon={<FcGoogle />}
            onClick={onGoogleLogin}
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
