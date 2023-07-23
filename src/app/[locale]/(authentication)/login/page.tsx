import Logo from "@/components/site/logo";
import AuthForm from "@/components/site/authForm";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex flex-col fixed inset-0">
      <div className="h-14 pl-6 bg-white dark:bg-zinc-700 backdrop-blur shadow-[0_4px_4px_-4px_rgba(0,0,0,.2)] flex items-center">
        <Logo />
      </div>
      <div className="flex-1 flex relative">
        <Image
          className="select-none"
          src="/login-bg.webp"
          alt="login-bg"
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            zIndex: 5,
          }}
        />
        <AuthForm />
      </div>
    </div>
  );
}
