import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendVerificationRequest } from "@/email";

const providers: NextAuthOptions["providers"] = [];

// EmailProvider
if (
  process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST &&
  process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT &&
  process.env.NEXT_PUBLIC_EMAIL_SERVER_USER &&
  process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD &&
  process.env.NEXT_PUBLIC_EMAIL_FROM
) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST,
        port: process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT as any,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER,
          pass: process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
      sendVerificationRequest,
    })
  );

  providers.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const databaseUser = await prisma.user.findUnique({
          where: { email: credentials?.username },
        });

        // Return null if user data could not be retrieved
        if (
          !databaseUser?.password ||
          databaseUser.password !== credentials?.password
        ) {
          return null;
        }

        // If no error and we have user data, return it
        return databaseUser;
      },
    })
  );
}

// GithubProvider
if (
  process.env.NEXT_PUBLIC_GITHUB_ID &&
  process.env.NEXT_PUBLIC_GITHUB_SECRET
) {
  providers.push(
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// GoogleProvider
if (
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 40000,
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET || "secret",
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
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },
  pages: {
    signIn: "/login",
    error: "/authError",
    verifyRequest: "/authVerify",
  },
};
