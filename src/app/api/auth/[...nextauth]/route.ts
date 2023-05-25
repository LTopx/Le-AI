import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],
  secret: process.env.EMAIL_SECRET,
  callbacks: {
    async jwt({ token, trigger }) {
      const id = token.sub || token.id;

      if (trigger === "update") {
        const databaseUser = await prisma.user.findUnique({
          where: { id: id as string },
        });
        return {
          id,
          name: databaseUser?.name,
          email: databaseUser?.email,
          image: databaseUser?.image,
        };
      }

      return {
        id,
        name: token.name,
        email: token.email,
        image: token.picture || token.image,
      };
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      // through to web browser
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    // 1. If the user does not act within the validity period, the session will expire and they must log in again.
    // 2. All actions that trigger the useSession behavior in the interface will refresh this validity period
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  pages: {
    error: "/authError",
    verifyRequest: "/authVerify",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
