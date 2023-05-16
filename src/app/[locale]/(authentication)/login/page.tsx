import * as React from "react";
import { cn } from "@/lib";
import AuthForm from "@/components/auth/form";
import Logo from "@/components/logo";

const Login: React.FC = () => {
  return (
    <div className="flex flex-col fixed inset-0">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
      </div>
      <div className="flex flex-col justify-center items-center flex-1">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
