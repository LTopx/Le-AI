import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import AuthForm from "@/components/site/authForm";

export default function Login() {
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
      <div className="flex flex-col items-center pt-[20%] md:p-[10%] flex-1 relative">
        <AuthForm />
      </div>
    </div>
  );
}
