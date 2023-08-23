<h4 align="right">English | <strong><a href="https://github.com/LTopx/L-GPT/blob/main/README_CN.md">中文</a></strong></h4>

<p align="center">
    <a href="https://chat.ltopx.com" target="_blank" rel="noopener noreferrer">
        <img width="100" src="./public/favicon-96x96.png" alt="L-GPT" />
    </a>
</p>

<h1 align="center">L-GPT</h1>

<p align="center">Your open-source AI Assistant Hub, helping you boost efficiency UP UP~</p>

<p align="center">
<a href="https://github.com/LTopx/L-GPT/releases">
  <img alt="GitHub release" src="https://img.shields.io/github/release/LTopx/L-GPT.svg?style=flat-square&include_prereleases" />
</a>
<a href="https://github.com/LTopx/L-GPT/commits">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/LTopx/L-GPT.svg?style=flat-square" />
</a>
<a href="https://twitter.com/peekbomb" target="_blank">
  <img alt="twitter" src="https://img.shields.io/badge/follow-Ethan Liu-red?style=flat-square&logo=Twitter">
</a>
<a href="https://t.me/+7fLJJoGV_bJhYTk1" target="_blank">
  <img alt="telegram" src="https://img.shields.io/badge/chat-telegram-blueviolet?style=flat-square&logo=Telegram">
</a>

<div align="center">

[Demo](https://chat.ltopx.com/) | [Docs](https://docs.ltopx.com/) | [Q&A](https://docs.ltopx.com/faq) | [Change Log](https://docs.ltopx.com/change-log) | [Feedback](https://github.com/LTopx/L-GPT/issues) | [Telegram](https://t.me/+7fLJJoGV_bJhYTk1) | [Contact Me](https://goethan.cc/)

</div>

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LTopx/L-GPT)

</div>

<p align="center">
  <img src="./public/screenshots/screenshot.png" height="500px">
</p>

## ✨ Demo

Direct access: [https://chat.ltopx.com](https://chat.ltopx.com/)

Project documentation: [https://docs.ltopx.com](https://docs.ltopx.com/)

## 🎯 Key Features

- No need to configure additional environment variables, can be easily deployed to Vercel for free
- Ensures privacy and security, all session records and system configurations are stored locally in the browser
- Responsive design with dark mode, providing a great experience on different devices
- Supports voice reading with customizable voices and speeds
- Supports displaying markdown with code highlighting and copy operations
- Supports OpenAI and Azure OpenAI
- Supports custom role templates to create more AI possibilities
- Supports i18n multilingual internationalization: English, Simplified Chinese
- For more information, please refer to the [documentation](https://docs.ltopx.com/)

## 📍 Development Plan

- [x] Support custom prompt repository
- [x] Support Function call for implementing more functionalities
- [x] Support for large language model APIs such as Claude, PaLM, and Llama 2.
- [x] Support distributing keys for use in an unauthenticated state.
- [ ] Support long conversations
- [ ] Support integration of Midjourney drawing
- [ ] Desktop version development

## 💿 One-click Deployment

Currently supports one-click deployment to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LTopx/L-GPT)

## 🪄 Local Development

**0. Node Environment Requirements**

NodeJS >= 18

**1. Install PNPM**

If you have not previously installed or used `pnpm`, you can install it by running the following command.

```bash
npm install pnpm -g
```

**2. Install Dependencies**

```bash
pnpm i
```

**3. Configure Environment Variables**

Rename .evn.local.demo to .env.local

**4. Run the Project**

```bash
pnpm dev
```

**5. Build the Project**

```bash
pnpm build && pnpm start
```

## More Optional Environment Variables

Refer to the documentation: [https://docs.ltopx.com](https://docs.ltopx.com/develop/env)

## License

[GNU](https://github.com/LTopx/L-GPT/blob/main/LICENSE)
