"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Icon from "@/components/icon";
import { checkGithub, checkGoogle, checkEmail } from "@/lib/checkEnv";

export default function AuthForm() {
  const router = useRouter();
  const tGlobal = useTranslations("global");
  const tAuth = useTranslations("auth");

  const inputRef = React.useRef<any>(null);

  const [email, setEmail] = React.useState<string>("");
  const [loadingGithub, setLoadingGithub] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  const [loadingEmail, setLoadingEmail] = React.useState(false);

  const onGithubLogin = async () => {
    setLoadingGithub(true);
    await signIn("github", { callbackUrl: "/" });
    // await signIn("credentials", {
    //   username: "asfasf",
    //   password: "112233",
    //   callbackUrl: "/",
    // });
  };

  const onGoogleLogin = async () => {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const onLogin = async () => {
    if (loadingEmail) return;

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
    <Card
      className={cn("w-96 max-w-[calc(100vw-2rem)] relative z-20", {
        "pointer-events-none": loadingEmail || loadingGithub || loadingGoogle,
      })}
    >
      <CardHeader>
        <CardTitle>{tGlobal("sign-in")}</CardTitle>
        <CardDescription>{tAuth("continue-gpt")}</CardDescription>
      </CardHeader>
      <CardContent>
        {checkGithub() && (
          <Button
            variant="outline"
            className="w-full justify-start gap-4 mb-2"
            disabled={loadingGithub}
            onClick={onGithubLogin}
          >
            {loadingGithub ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon
                className="text-black dark:text-white"
                icon="github_line"
                size={20}
              />
            )}
            {tAuth("continue-with-github")}
          </Button>
        )}
        {checkGoogle() && (
          <Button
            variant="outline"
            className="w-full justify-start gap-4"
            disabled={loadingGoogle}
            onClick={onGoogleLogin}
          >
            {loadingGoogle ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Icon icon="google_line" size={20} />
            )}
            {tAuth("continue-with-google")}
          </Button>
        )}
        {checkEmail() && (checkGithub() || checkGoogle()) && (
          <div className="flex items-center my-8">
            <div className="h-[1px] flex-1 bg-[rgba(0,0,0,0.16)]"></div>
            <div className="mx-4 text-[13px]">{tGlobal("or")}</div>
            <div className="h-[1px] flex-1 bg-[rgba(0,0,0,0.16)]"></div>
          </div>
        )}
        {checkEmail() && (
          <>
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="name">{tAuth("email-address")}</Label>
              <Input
                ref={inputRef}
                id="name"
                className="h-[38px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={onLogin}
              disabled={loadingEmail}
            >
              {loadingEmail && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tGlobal("continue")}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
