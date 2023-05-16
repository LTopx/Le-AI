import * as React from "react";
import { cn } from "@/lib";
import AuthForm from "@/components/auth/form";

const Login: React.FC = () => {
  return (
    <div className="flex flex-col fixed inset-0">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <div className="flex font-extrabold h-12 text-transparent text-2xl items-center">
          <span className="bg-clip-text bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
            L - GPT
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center flex-1">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
