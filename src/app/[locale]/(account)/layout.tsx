import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { cn } from "@/lib";
import Avatar from "@/components/site/avatar";
import Logo from "@/components/site/logo";
import Menu from "@/components/account/menu";
import MobileMenu from "@/components/account/mobileMenu";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) return redirect("/login");

  return (
    <div className="fixed left-0 top-0 w-full h-full">
      <div
        className={cn(
          "h-14 flex items-center justify-between px-6 border-b",
          "dark:border-neutral-600"
        )}
      >
        <Logo />
        <Avatar />
      </div>
      <div className="pt-10 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-[75rem] m-auto px-6">
          <div className="flex gap-12">
            <div className="hidden md:block">
              <Menu />
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
      <MobileMenu />
    </div>
  );
}
