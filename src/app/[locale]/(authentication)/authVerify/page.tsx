import * as React from "react";
import { cn } from "@/lib";
import Logo from "@/components/logo";

const AuthVerify: React.FC = () => {
  return (
    <div className="bg-neutral-200 fixed inset-0">
      <div
        className={cn(
          "w-[32.5rem] max-w-[calc(100vw-2rem)] bg-white px-12 py-6 rounded-md fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%]",
          "flex flex-col items-center justify-center gap-4"
        )}
      >
        <Logo disabled size="large" />
        <div className="text-2xl font-medium">Check your email</div>
        <div>A sign in link has been sent to your email address.</div>
      </div>
    </div>
  );
};

export default AuthVerify;
