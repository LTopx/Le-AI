# L-GPT

帮助文档 https://docs.ltopx.com/zh-CN

L-GPT 是一款开源的 ChatGPT Web App。通过整合各个大语言模型的开放 API，给用户提供高度聚合的帮助型 AI 服务。它不仅支持基础的会话功能，后续还将支持文本转语音、语音输入、解析文件、插件等更多功能，能够多方面的来提升效率。 [点击体验](https://gpt.ltopx.com)

欢迎加入：[TG 群](https://t.me/+7fLJJoGV_bJhYTk1)

<img src="./public/screenshots/tg.jpeg" width="200">

## 预览

<img src="./public/screenshots/screenshot-pc.png">

<img src="./public/screenshots/screenshot-m.png">

## 重要通知

最近 web 端更新较少，主要是在开发客户端的第一个版本。目前 UI 界面已经基本移植完成，当前支持使用自己的 API Key 进行会话。接下来会恢复 web 端的功能更新。

以后功能会优先 web 端实现，然后同步移植到客户端，因此客户端的功能会比 web 端滞后一些。

- 尚不支持：登录、注册、分享会话、多语言等
- 目前因为还未支持登录，因此只能配置自己的 API Key 进行会话
- 客户端项目即将开源，敬请期待
- 客户端第一个完整功能稳定版本预计 6 月底推出

## 特性

- 一键免费发布到 Vercel
- 支持响应式，暗黑模式和 PWA
- 安全，所有数据均基于本地存储
- 支持 i18n
- 支持 [Azure OpenAI Service](https://docs.ltopx.com/zh-CN/api-key-configure/azure)
- 支持配置和使用自定义 prompt

## 下一步计划

- [x] 支持 Azure OpenAI
- [x] 引入提示词以及提示词模板
- [x] 聊天记录导入导出
- [x] 账号系统
- [x] 支持会话分享
- [x] 支持自定义 prompt 仓库
- [ ] 支持 GPT-4 和 Claude
- [ ] 压缩上下文，节省聊天 token
- [ ] 桌面版本开发

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
