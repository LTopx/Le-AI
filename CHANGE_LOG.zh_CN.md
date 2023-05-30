# L-GPT 更新日志

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
