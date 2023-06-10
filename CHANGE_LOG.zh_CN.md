# L-GPT 更新日志

## v0.6.0

> 2023-06-10

### Add

- 新增 Prompt Market

### Fixed

- 修复移动端菜单新增会话时没有代入默认 prompt 的问题

### Changed

- 优化用户名缺失时的显示效果
- 其他大量细节优化
- 优化 prompt 和 Prompt Market 的 UI 细节

## v0.5.3

> 2023-06-06

### Add

- 新增为客户端单独写的接口，目前只支持传递自己的 key 实现对话
- 为接口添加跨域支持，方便客户端进行跨域调用

### Changed

- 优化 UI 组件的实现

## v0.5.2

> 2023-06-03

### Fixed

- 修复升级到 next 13.4.4 打包报错的问题
- 尝试修复 not-found 页面不生效的问题

### Add

- 新增跳转到文档项目的各种引导链接

### Changed

- 继续优化接口请求错误提示。现在能够正确的看到会话文本超长的错误提示
- 优化登录验证时发送的邮件样式

## v0.5.1

> 2023-06-02

### Add

- 添加清除 7 天之前无用的会话分享的定时服务
- 添加跳转 [L-GPT 文档链接](https://docs.ltopx.com)

### Fixed

- 修复配置 API Key 页面在中文下和暗黑模式下的显示问题
- 添加 lang 解决生成预览图片乱码的问题

### Changed

- 调整分享的会话没有标题时的默认展示内容
- 合并 share api 路由

## v0.5.0

> 2023-05-30

### Add

- 新增会话分享功能

### Changed

- 将 prisma 变量定义全部移动到.env.local
- 统一全局 Logo 样式
- 多处细节优化
- 优化更多极限情况下的 token 消耗计算逻辑

## v0.4.3

> 2023-05-28

### Fixed

- 修复未登录用户配置 api key 依旧无法正常对话的问题
- 修复 Select placeholder 的文本颜色问题以及 disabled 的逻辑问题
- 修复路由跳转丢失 locale path 的问题。替换 next/navigation/useRouter 为 next-intl/client/useRouter

### Changed

- 优化登录界面 UI
- 优化加载用户信息时，用户头像处的显示效果
- 升级默认的 Azure OpenAI Service API Version 从 2023-03-15-preview 到 2023-05-15
- 重构会话消耗的计算逻辑，现在支持展示当前会话内容消耗以及当前会话总消耗
- 优化 Select/Input/Modal/Slider/Button 等组件 UI 效果
- 重构 API Key 配置界面，将其移动到单独的界面进行配置。现在能更友好的配置 Azure OpenAI Service 相关信息

## v0.4.2

> 2023-05-25

### 修复

- 修复 session 回调频繁查询数据库的 bug

### 新增

- 新增当前会话消耗的 Token 和 USD 展示
- 新增有关 Token 和会话上下文限制相关介绍
- 新增问题意见反馈渠道：support.qq.com
- 新增支持切换 Enter 和 Command+Enter (Mac)/Ctrl+Enter (Windows) 输入信息的方式
- 新增在左侧菜单顶部展示当前应用版本号
- 新增支持点击会话标题修改当前会话配置

### 调整

- 简化会话聊天内容“复制”和“删除”的 UI 和逻辑
- 调整登录有效期时长为 3 天
