import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
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
        <meta name="apple-mobile-web-app-title" content="L-GPT"></meta>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className={inter.className}>
        <Toaster />
        <Component {...pageProps} />
      </div>
    </>
  );
}
