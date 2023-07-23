import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/plugin/auth";
import { redirect } from "next/navigation";

export default async function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user) return redirect("/");

  return <>{children}</>;
}
