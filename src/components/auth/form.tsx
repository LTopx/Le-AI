"use client";

import * as React from "react";
import { useRouter } from "next-intl/client";
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
  const [loadingEmial, setLoadingEmail] = React.useState(false);
  const [loadingGithub, setLoadingGithub] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);

  const t = useTranslations("auth");

  const onLogin = async () => {
    if (loadingEmial) return;

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
      setLoadingEmail(true);
      const res: any = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) return toast.error(t("auth-failed"));
      toast.success(t("auth-success"));
      router.push(res.url);
    } catch (error) {
      setLoadingEmail(false);
      console.log(error, "login failed");
      toast.error(t("auth-failed"));
    }
  };

  const onGithubLogin = async () => {
    setLoadingGithub(true);
    await signIn("github", { callbackUrl: "/" });
  };

  const onGoogleLogin = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <>
      <div className="shadow-[0_24px_48px_rgba(0,0,0,0.16)] py-7 px-8 md:py-12 md:px-10 rounded-xl max-w-[calc(100vw-2rem)]">
        <div className="text-2xl font-bold mb-10">{t("title")}</div>
        <div className="w-[20rem] max-w-[calc(100vw-8rem)]">
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
            loading={loadingEmial}
            onClick={onLogin}
          >
            {t("button-text")}
          </Button>
          <div className="w-full h-[1px] bg-neutral-200 mb-4" />
          <div className="flex flex-col gap-2">
            <Button
              size="base"
              block
              loading={loadingGithub}
              leftIcon={<AiFillGithub />}
              onClick={onGithubLogin}
            >
              Continue with Github
            </Button>
            <Button
              size="base"
              block
              loading={loadingGoogle}
              leftIcon={<FcGoogle />}
              onClick={onGoogleLogin}
            >
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
      {(loadingEmial || loadingGithub || loadingGoogle) && (
        <div className="absolute left-0 top-0 w-full h-full bg-white opacity-40 z-10" />
      )}
    </>
  );
};

export default AuthForm;
