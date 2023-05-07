# L-GPT

English / [简体中文](./README_CN.md)

L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models. [Demo](https://gpt.ltopx.com)

[QQ 群](./public/screenshots/qq.jpeg)

## Preview

<img src="./public/screenshots/screenshot-pc.png">

<img src="./public/screenshots/screenshot-m.png">

## Features

- Deploy for free on Vercel
- Responsive design and dark mode
- Safe, all data based on local
- Support i18n
- Support [Azure OpenAI Service](./azure.md)
- Support configuration and use of custom prompt

## Next

- [x] Support Azure OpenAI
- [x] Introduce prompt words and prompt word templates
- [ ] Chat record import and export
- [ ] Support GPT-4 and Claude
- [ ] Compress context to save chat tokens
- [ ] Desktop version development

## Deploy on Vercel

Get your own website.

```bash
# Configure Project

# Prefer using user-configured key.
# If user hasn't configured, then use this key.
# If neither are configured, it is not possible to use OpenAI API.
# eg: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=

# Prefer using user-configured proxy address.
# If the user hasn't configured, then use this proxy.
# If none of these are being used, then connect directly to the Open AI official address: https://api.openai.com.
NEXT_PUBLIC_OPENAI_API_PROXY=

# Set Your Azure OpenAI API key.
NEXT_PUBLIC_AZURE_OPENAI_API_KEY=

# Set Your Azure OpenAI API resource name.
NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME=

# set your own sentry dsn. if empty here, it will not report error to sentry
NEXT_PUBLIC_SENTRY_DSN=
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peek-A-Booo/L-GPT&env=NEXT_PUBLIC_OPENAI_API_KEY&env=NEXT_PUBLIC_OPENAI_API_PROXY&env=NEXT_PUBLIC_AZURE_OPENAI_API_KEY&env=NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME&env=NEXT_PUBLIC_SENTRY_DSN)

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
# your own OpenAI Api proxy url.
NEXT_PUBLIC_OPENAI_API_PROXY=
# Azure OpenAI API Key. eg: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AZURE_OPENAI_API_KEY=
# Azure OpenAI resource name.
NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME=
# set your own sentry dsn. if empty here, it will not report error to sentry
NEXT_PUBLIC_SENTRY_DSN=
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

| Environment Variable                     | Desc                                                            | Required | Default                  |
| ---------------------------------------- | --------------------------------------------------------------- | -------- | ------------------------ |
| `NEXT_PUBLIC_OPENAI_API_KEY`             | your OpenAI API Key                                             | false    |                          |
| `NEXT_PUBLIC_OPENAI_API_PROXY`           | your OpenAI API proxy server                                    | false    | `https://api.openai.com` |
| `NEXT_PUBLIC_AZURE_OPENAI_API_KEY`       | your Azure OpenAI API Key. [View Example](./azure.md)           | false    |                          |
| `NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME` | your Azure OpenAI API resource name. [View Example](./azure.md) | false    |                          |
| `NEXT_PUBLIC_SENTRY_DSN`                 | your sentry dsn. If empty, it will not report error to sentry   | false    |                          |

## Contact

Any questions, please feel free to join our QQ group or contact us on [Twitter](https://twitter.com/peekbomb).
