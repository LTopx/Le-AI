import { cn } from "@/lib";
import Logo from "@/components/logo";
import Avatar from "@/components/auth/avatar";

interface ApiKeyLayoutProps {
  children: React.ReactNode;
}

export default async function ApiKeyLayout({ children }: ApiKeyLayoutProps) {
  return (
    <div>
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
        <Avatar />
      </div>
      <>{children}</>
    </div>
  );
}
