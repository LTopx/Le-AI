import { cn } from "@/lib";
import Logo from "@/components/site/logo";
import BackHome from "@/components/share/backHome";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-gray-100/60 w-full top-0 left-0 fixed dark:bg-neutral-900">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "bg-white/90 dark:bg-gray-900/50",
          "dark:border-neutral-600"
        )}
      >
        <Logo disabled share version={false} />
        <BackHome />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="m-auto max-w-[75rem] py-6 px-6">{children}</div>
      </div>
    </div>
  );
}
