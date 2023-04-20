import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>L-GPT</title>
        <meta
          name="description"
          content="A Chat gpt webapp build with OpenAI Api"
        />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="L-GPT" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={inter.className}>
        <Toaster
          toastOptions={{
            style: {
              fontSize: 14,
            },
          }}
        />
        <ThemeProvider attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
        <Analytics />
      </div>
    </>
  );
};

export default appWithTranslation(App);
