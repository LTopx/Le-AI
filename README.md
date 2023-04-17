# L-GPT

English / [简体中文](./README_CN.md)

L-GPT is an open-source project that imitates the OpenAI ChatGPT. The
theme adopts the style of Feishu. [Demo](https://gpt.ltops.cn)

## Deploy on Vercel

Get your own website.

```
# Configure Project

# OpenAI API Key - If set, it will be used as the default authentication information for requesting the OpenAI API. Otherwise, it needs to be configured after the project is up and running.
# sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=

# OPENAI_API_PROXY - Default is https://api.openai.com. you can set it to your own proxy server.
OPENAI_API_PROXY=
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peek-A-Booo/L-GPT&env=NEXT_PUBLIC_OPENAI_API_KEY&env=OPENAI_API_PROXY)

## Running Local

**1. Clone Repo**

```bash
git clone https://github.com/Peek-A-Booo/L-GPT.git
```

**2. PNPM**

If you are not install `pnpm`, you can install it by running the following command.

```bash
npm install pnpm -g
```

**3. Install Dependencies**

```bash
pnpm i
```

**4. Configure Environment Variables**

Rename .evn.local.demo to .env.local and configure it.

```bash
# sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=
# your own api proxy url. default is https://api.openai.com
OPENAI_API_PROXY=
```

**5. Run App**

```bash
pnpm dev
```

**6. Build App**

```bash
pnpm build && pnpm start
```

## Configuration

You can configure the following environment variables.

| Environment Variable         | Desc                                              | Required | Default                  |
| ---------------------------- | ------------------------------------------------- | -------- | ------------------------ |
| `NEXT_PUBLIC_OPENAI_API_KEY` | when set,it will be used for your default api key | false    |                          |
| `OPENAI_API_PROXY`           | your OpenAI proxy server                          | false    | `https://api.openai.com` |
