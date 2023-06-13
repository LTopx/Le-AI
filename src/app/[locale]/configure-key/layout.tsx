import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import Avatar from "@/components/site/avatar";

export default async function ApiKeyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
        <Avatar />
      </div>
      {children}
    </>
  );
}
