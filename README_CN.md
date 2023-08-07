<h4 align="right"><strong><a href="https://github.com/tw93/MiaoYan/blob/master/README_EN.md">English</a></strong> | 中文</h4>

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

[直接访问](https://chat.ltopx.com/) | [帮助文档](https://docs.ltopx.com/) | [反馈](https://github.com/LTopx/L-GPT/issues) | [TG 群](https://t.me/+7fLJJoGV_bJhYTk1) | [联系作者](https://goethan.cc/)

</div>

<p align="center">
  <img src="./public/screenshots/screenshot.png" height="500px">
</p>

## 功能特色

- 无需配置额外环境变量，可一键免费发布到 Vercel
- 保证隐私安全，所有会话记录和系统各项配置均存储在浏览器本地
- 响应式设计，暗黑模式，在不同设备上都有良好的体验
- 支持语音朗读，可自定义不同音色和语速
- 支持展示 markdown，支持代码高亮复制等操作
- 支持 OpenAI 和 Azure OpenAI
- 支持自定义角色模板，创造更多 AI 可能性
- 支持 i18n 多语言国际化: English、简体中文
- 了解更多，更多请查阅 [帮助文档](https://docs.ltopx.com/)

## 开发计划

- [x] 支持自定义 prompt 仓库
- [ ] 支持超长会话
- [ ] 支持 Function call，实现更多功能
- [ ] 支持接入 Midjourney 绘画
- [ ] 支持 Claude API 以及更多大语言模型
- [ ] 桌面版本开发

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LTopx/L-GPT)

## 发布到 Vercel

搭建属于你自己的网站。

```bash
# Configure Project

# 优先使用用户配置key
# 用户没有配置则使用此key
# 都没配置则无法使用OpenAI API服务
# 示例：sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=

# 优先使用用户配置的代理地址
# 用户没有配就使用此代理
# 都没有使用则直连Open AI 官方地址：https://api.openai.com
NEXT_PUBLIC_OPENAI_API_PROXY=

# 配置你的 Azure OpenAI API key.
NEXT_PUBLIC_AZURE_OPENAI_API_KEY=

# 配置你的 Azure OpenAI 资源名称.
NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME=

# Azure OpenAI Service API 版本号
NEXT_AZURE_OPENAI_API_VERSION=

# 配置你的 sentry dsn地址。如果为空, 将不会将错误报告到 sentry
NEXT_PUBLIC_SENTRY_DSN=


# 数据库连接地址
DATABASE_URL=

# NEXT-AUTH 邮件配置。参考文档：https://next-auth.js.org/providers/email
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
EMAIL_SECRET=

# NEXT-AUTH Github 配置。参考文档：https://next-auth.js.org/providers/github
GITHUB_ID=
GITHUB_SECRET=

# NEXT-AUTH Google 配置。参考文档：https://next-auth.js.org/providers/google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peek-A-Booo/L-GPT&env=NEXT_PUBLIC_OPENAI_API_KEY&env=NEXT_PUBLIC_OPENAI_API_PROXY&env=NEXT_PUBLIC_AZURE_OPENAI_API_KEY&env=NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME&env=NEXT_AZURE_OPENAI_API_VERSION&env=NEXT_PUBLIC_SENTRY_DSN&env=DATABASE_URL&env=EMAIL_SERVER_HOST&env=EMAIL_SERVER_PORT&env=EMAIL_SERVER_USER&env=EMAIL_SERVER_PASSWORD&env=EMAIL_FROM&env=EMAIL_SECRET&env=GITHUB_ID&env=GITHUB_SECRET&env=GOOGLE_CLIENT_ID&env=GOOGLE_CLIENT_SECRET)

## 本地运行

**1. 克隆项目**

```bash
git clone https://github.com/Peek-A-Booo/L-GPT.git
```

**2. 安装 PNPM**

如果你之前没有安装或使用过`pnpm`，你可以通过运行以下命令来安装它。

```bash
npm install pnpm -g
```

**3. 安装依赖**

```bash
pnpm i
```

**4. 配置环境变量**

将 .evn.local.demo 重命名为 .env.local 并按照要求进行配置。

**5. 运行项目**

```bash
pnpm dev
```

**6. 打包项目**

```bash
pnpm build && pnpm start
```

## 配置项

你可以配置以下环境变量。

| 环境变量                                 | 描述                                                                                            | 是否必须配置 | 默认值                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------ | ------------------------ |
| `NEXT_PUBLIC_OPENAI_API_KEY`             | OpenAI API key                                                                                  | 否           |                          |
| `NEXT_PUBLIC_OPENAI_API_PROXY`           | OpenAI API 代理地址                                                                             | 否           | `https://api.openai.com` |
| `NEXT_PUBLIC_AZURE_OPENAI_API_KEY`       | Azure OpenAI API key。[查看示例](https://docs.ltopx.com/zh-CN/api-key-configure/azure)          | 否           |                          |
| `NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME` | Azure OpenAI API 服务资源名称。[查看示例](https://docs.ltopx.com/zh-CN/api-key-configure/azure) | 否           |                          |
| `NEXT_AZURE_OPENAI_API_VERSION`          | Azure OpenAI API 服务版本号。[查看示例](https://docs.ltopx.com/zh-CN/api-key-configure/azure)   | 是           | 2023-05-15               |
| `NEXT_PUBLIC_SENTRY_DSN`                 | 你的 Sentry DSN 地址。如果为空, 将不会将错误报告到 Sentry                                       | 否           |                          |
| `DATABASE_URL`                           | postgresql 数据库连接地址                                                                       | 是           |                          |
| `EMAIL_SERVER_HOST`                      | next-auth email server host                                                                     | 是           |                          |
| `EMAIL_SERVER_PORT`                      | next-auth email server port                                                                     | 是           |                          |
| `EMAIL_SERVER_USER`                      | next-auth email server user                                                                     | 是           |                          |
| `EMAIL_SERVER_PASSWORD`                  | next-auth email server password                                                                 | 是           |                          |
| `EMAIL_FROM`                             | next-auth email from                                                                            | 否           |                          |
| `EMAIL_SECRET`                           | next-auth email secret                                                                          | 是           |                          |
| `GITHUB_ID`                              | next-auth github id                                                                             | 是           |                          |
| `GITHUB_SECRET`                          | next-auth github secret                                                                         | 是           |                          |
| `GOOGLE_CLIENT_ID`                       | next-auth google client id                                                                      | 是           |                          |
| `GOOGLE_CLIENT_SECRET`                   | next-auth google client secret                                                                  | 是           |                          |

## 联系方式

有任何疑问欢迎加入 TG 群或联系 [Twitter](https://twitter.com/peekbomb).
