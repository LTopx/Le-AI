import Logo from "@/components/site/logo";
import Bg from "@/components/account/bg";
import AuthForm from "@/components/site/authForm";

export default function Login() {
  return (
    <div className="flex flex-col fixed inset-0">
      <Bg />
      <div className="h-14 pl-3 bg-transparent flex items-center z-10 relative">
        <Logo />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <AuthForm />
      </div>
    </div>
  );
}
