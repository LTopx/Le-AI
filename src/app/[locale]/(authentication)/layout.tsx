import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/plugin/auth";
import { checkAuth } from "@/lib/checkEnv";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user || !checkAuth()) return redirect("/");

  return <>{children}</>;
}
