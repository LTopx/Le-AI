<h4 align="right"><strong><a href="https://github.com/LTopx/L-GPT/blob/main/README.md">English</a></strong> | 中文</h4>

<p align="center">
    <a href="https://chat.ltopx.com" target="_blank" rel="noopener noreferrer">
        <img width="100" src="./public/favicon-96x96.png" alt="L-GPT" />
    </a>
</p>

<h1 align="center">L-GPT</h1>

<p align="center">您的开源 AI 聚合服务助手，帮您效率UP UP~</p>

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

[直接访问](https://chat.ltopx.com/) | [帮助文档](https://docs.ltopx.com/) | [常见问题](https://docs.ltopx.com/faq) | [更新日志](https://docs.ltopx.com/change-log) | [反馈](https://github.com/LTopx/L-GPT/issues) | [TG 群](https://t.me/+7fLJJoGV_bJhYTk1) | [联系作者](https://goethan.cc/)

</div>

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LTopx/L-GPT)

</div>

<p align="center">
  <img src="./public/screenshots/screenshot.png" height="500px">
</p>

## ✨ Demo

直接访问：[https://chat.ltopx.com](https://chat.ltopx.com/)

项目帮助文档：[https://docs.ltopx.com](https://docs.ltopx.com/)

## 🎯 功能特色

- 无需配置额外环境变量，可一键免费发布到 Vercel
- 保证隐私安全，所有会话记录和系统各项配置均存储在浏览器本地
- 响应式设计，暗黑模式，在不同设备上都有良好的体验
- 支持语音朗读，可自定义不同音色和语速
- 支持展示 markdown，支持代码高亮复制等操作
- 支持 OpenAI 和 Azure OpenAI
- 支持自定义角色模板，创造更多 AI 可能性
- 支持 i18n 多语言国际化: English、简体中文
- 了解更多，更多请查阅 [帮助文档](https://docs.ltopx.com/)

## 📍 开发计划

- [x] 支持自定义 prompt 仓库
- [ ] 支持超长会话
- [ ] 支持 Function call，实现更多功能
- [ ] 支持接入 Midjourney 绘画
- [ ] 支持 Claude API 以及更多大语言模型
- [ ] 桌面版本开发

## 💿 一键部署

目前支持一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LTopx/L-GPT)

## 🪄 本地开发

**0. Node 环境要求**

NodeJS >= 18

**1. 安装 PNPM**

如果你之前没有安装或使用过`pnpm`，你可以通过运行以下命令来安装它。

```bash
npm install pnpm -g
```

**2. 安装依赖**

```bash
pnpm i
```

**3. 配置环境变量**

将 .evn.local.demo 重命名为 .env.local

**4. 运行项目**

```bash
pnpm dev
```

**5. 打包项目**

```bash
pnpm build && pnpm start
```

## 更多可选环境变量

参考文档：[https://docs.ltopx.com](https://docs.ltopx.com/develop/env)

## 协议

[GUN](./LICENSE)
