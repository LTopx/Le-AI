# L-GPT

L-GPT 是一款开源项目，通过提供不同的 AI 模型来帮助你提高学习、工作、生活的效率。 [Demo](https://gpt.ltopx.com)

## 预览

<img src="./public/screenshots/screenshot-pc.png">

<img src="./public/screenshots/screenshot-m.png">

## 特性

- 一键免费发布到 Vercel
- 支持响应式，暗黑模式和 PWA
- 安全，所有数据均基于本地存储
- 支持 i18n
- 支持 [Azure OpenAI Service](./azure_CN.md)
- 支持配置和使用自定义 prompt

## 下一步计划

- [x] 支持 Azure OpenAI
- [x] 引入提示词以及提示词模板
- [ ] 聊天记录导入导出
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

# 配置你的 sentry dsn地址。如果为空, 将不会将错误报告到 sentry
NEXT_PUBLIC_SENTRY_DSN=
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Peek-A-Booo/L-GPT&env=NEXT_PUBLIC_OPENAI_API_KEY&env=NEXT_PUBLIC_OPENAI_API_PROXY&env=NEXT_PUBLIC_AZURE_OPENAI_API_KEY&env=NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME&env=NEXT_PUBLIC_SENTRY_DSN)

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

将 .evn.local.demo 重命名为 .env.local 并进行配置。

```bash
# OpenAI 官方key： sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=
# 你个人的 OpenAI api 代理地址。
NEXT_PUBLIC_OPENAI_API_PROXY=
# Azure OpenAI Key： eg: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_AZURE_OPENAI_API_KEY=
# Azure OpenAI 资源名称
NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME=
# 配置你的 sentry dsn地址。如果为空, 将不会将错误报告到 sentry
NEXT_PUBLIC_SENTRY_DSN=
```

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

| 环境变量                                 | 描述                                                              | 是否必须配置 | 默认值                   |
| ---------------------------------------- | ----------------------------------------------------------------- | ------------ | ------------------------ |
| `NEXT_PUBLIC_OPENAI_API_KEY`             | 你个人的 OpenAI API key                                           | 否           |                          |
| `NEXT_PUBLIC_OPENAI_API_PROXY`           | 你个人的 OpenAI API 代理地址                                      | 否           | `https://api.openai.com` |
| `NEXT_PUBLIC_AZURE_OPENAI_API_KEY`       | 你个人的 Azure OpenAI API key。[查看示例](./azure_CN.md)          | 否           |                          |
| `NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME` | 你个人的 Azure OpenAI API 服务资源名称。[查看示例](./azure_CN.md) | 否           |                          |
| `NEXT_PUBLIC_SENTRY_DSN`                 | 你的 sentry dsn 地址。如果为空, 将不会将错误报告到 sentry         | 否           |                          |

## 联系方式

有任何疑问欢迎加入 QQ 群或联系 [Twitter](https://twitter.com/peekbomb).
