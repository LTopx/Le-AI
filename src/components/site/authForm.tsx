"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { MD5 } from "crypto-js";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const accountRef = React.useRef<any>(null);
  const passwordRef = React.useRef<any>(null);

  // account, password
  const [activeTab, setActiveTab] = React.useState("email");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loadingGithub, setLoadingGithub] = React.useState(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);
  const [loadingEmail, setLoadingEmail] = React.useState(false);
  const [loadingAccount, setLoadingAccount] = React.useState(false);

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
    if (activeTab === "email") return onEmailLogin();
    if (activeTab === "account") return onAccountLogin();
  };

  const onEmailLogin = async () => {
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

  const onAccountLogin = async () => {
    if (loadingAccount) return;

    if (!email?.trim()) {
      toast.error(tGlobal("please-enter"), { id: "account" });
      accountRef.current?.focus();
      return;
    }

    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    if (!reg.test(email)) {
      toast.error(tAuth("input-valid-email"), { id: "valid_email" });
      accountRef.current?.focus();
      return;
    }

    if (!password?.trim()) {
      toast.error(tGlobal("please-enter"), { id: "account" });
      passwordRef.current?.focus();
      return;
    }

    try {
      setLoadingAccount(true);
      const res: any = await signIn("credentials", {
        callbackUrl: "/",
        redirect: false,
        username: email,
        password: MD5(password).toString(),
      });

      if (res.error) {
        setLoadingAccount(false);
        toast.error(tAuth("auth-failed"));
        return;
      }

      toast.success(tAuth("auth-success"));
      router.push(res.url);
    } catch (error) {
      setLoadingAccount(false);
      console.log(error, "login failed");
      toast.error(tAuth("auth-failed"));
    }
  };

  return (
    <Card
      className={cn("w-96 max-w-[calc(100vw-2rem)] relative z-20", {
        "pointer-events-none":
          loadingEmail || loadingAccount || loadingGithub || loadingGoogle,
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
            className="mb-2 w-full gap-4 justify-start"
            disabled={loadingGithub}
            onClick={onGithubLogin}
          >
            {loadingGithub ? (
              <Loader2 className="h-4 animate-spin w-4" />
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
            className="w-full gap-4 justify-start"
            disabled={loadingGoogle}
            onClick={onGoogleLogin}
          >
            {loadingGoogle ? (
              <Loader2 className="h-4 animate-spin w-4" />
            ) : (
              <Icon icon="google_line" size={20} />
            )}
            {tAuth("continue-with-google")}
          </Button>
        )}
        {checkEmail() && (checkGithub() || checkGoogle()) && (
          <div className="flex my-8 items-center">
            <div className="bg-[rgba(0,0,0,0.16)] dark:bg-[#27272a] flex-1 h-[1px]"></div>
            <div className="mx-4 text-[13px] uppercase">{tGlobal("or")}</div>
            <div className="bg-[rgba(0,0,0,0.16)] dark:bg-[#27272a] flex-1 h-[1px]"></div>
          </div>
        )}
        {checkEmail() && (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="email">{tAuth("email-login")}</TabsTrigger>
                <TabsTrigger value="account">
                  {tAuth("account-login")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <div className="flex flex-col space-y-1.5 my-4">
                  <Label htmlFor="email">{tAuth("email-address")}</Label>
                  <Input
                    ref={inputRef}
                    id="email"
                    className="h-[38px]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="account">
                <div className="my-4 w-full grid gap-4 items-center">
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="account"
                      className="flex items-center gap-1"
                    >
                      {tAuth("account")}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Icon
                                icon="question_line"
                                size={18}
                                className="cursor-pointer"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[calc(100vw-4rem)]">
                            {tAuth("account-tip")}{" "}
                            <a
                              className="text-sky-400 hover:underline dark:text-sky-500 transition-colors"
                              href="https://docs.le-ai.app/basic/login"
                              target="_blank"
                            >
                              {tGlobal("learn-more")}
                            </a>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      ref={accountRef}
                      className="h-[38px]"
                      id="account"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">{tAuth("password")}</Label>
                    <Input
                      ref={passwordRef}
                      className="h-[38px]"
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <Button
              className="w-full"
              onClick={onLogin}
              disabled={loadingEmail || loadingAccount}
            >
              {(loadingEmail || loadingAccount) && (
                <Loader2 className="h-4 mr-2 animate-spin w-4" />
              )}
              {tGlobal("continue")}
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter>
        <p className="px-8 text-center text-sm text-muted-foreground">
          {tAuth("agree-privacy-policy")}{" "}
          <a
            className="underline underline-offset-4 hover:text-primary transition-colors"
            href="https://docs.le-ai.app/privacy"
            target="_blank"
          >
            {tAuth("privacy-policy")}
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
