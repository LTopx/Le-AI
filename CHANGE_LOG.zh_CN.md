# Le-AI 更新日志

## v0.9.3

> 2023-09-27

### 修复

- 修复点击头像下拉菜单部分的弹窗无法正常显示的问题
- 修复 metadata image 无法正常显示的问题

## v0.9.2

> 2023-09-27

### 新增

- 支持 Docker 部署，[#15](https://github.com/LTopx/Le-AI/pull/15)
- 新增支持配置会员阈值进行会话总结，达到“无限会话”的效果
- "会话设置" 新增支持配置 历史消息压缩阈值

### 修复

- 修复 avatar UI 显示错误问题
- 修复 .env.local.demo 文件中的配置错误
- 修复多语言配置错误
- 修复 remark-gfm 版本升级后造成 react-markdown 内容解析错误的问题
- 修复会话 loading 时的 Loading 图标显示效果
- 修复 next-intl 缺少默认时区报错的问题
- 修复部分情况下系统设置菜单无法正常打开的问题
- 修复 [#10](https://github.com/LTopx/Le-AI/issues/10)

### 调整

- 重构部分页面模块 UI，迁移到 shadcn/ui
- 调整 OpenAI API Key 的代理配置逻辑，修复 [#11](https://github.com/LTopx/Le-AI/issues/11)
- 会话 loading 时禁止播放语音
- 调整 Serverless Functions 的超时时间为 5 分钟
- 调整账户中心 UI 界面

## v0.9.1

> 2023-09-11

### 修复

- 修复部署项目时配置自定义的 API Key 后鉴权逻辑有误的问题
- 修复部分情况下回复出现乱码的问题
- 修复 [#8](https://github.com/LTopx/Le-AI/issues/8)
- 修复邮件登录页面背景图片显示不正确的问题
- 修复新建角色时，prompt 和欢迎语字数限制的问题

### 新增

- 支持账号密码登录
- API Key 配置页面新增返回首页按钮
- 登录界面新增隐私协议和登录指引
- 兼容配置其他第三方 OpenAI API Key。例如：nextweb，API2D 等等

### 调整

- 更新 Azure OpenAI API Version 为 2023-08-01-preview
- 调整系统左侧底部菜单 UI
- 重构新建角色弹出框 UI
- 调整 prompt, messages 传参实现逻辑，全部由前端解析并组装

## v0.9.0

> 2023-09-02

### 修复

- 修复未登录但配置了 API KEY 时无法使用的问题
- 修复无效链接
- 修复 chatgpt 接口的跨域问题
- 修复 metadataBase 缺失的问题
- 修复 OpenRouter Key 的跳转链接问题
- 修复请求错误时没有携带跨域头的问题
- 修复令牌页面 Table 的样式问题
- 修复 issue of missing metadataBase and env variable [#6](https://github.com/LTopx/Le-AI/issues/6)

### 新增

- 新增支持 Windows、Mac Beta 客户端
- 新增支持一键清空会话
- 新增令牌管理页面相关逻辑和数据库表构建
- 新增左侧菜单重要公告提示
- 自构建令牌打通 OpenAI、Azure OpenAI、OpenRouter 接口逻辑
- 新增支持配置 Le-AI API Key
- 引入 shadcn/ui 优化部分组件样式
- 新增繁体中文支持

### 调整

- 调整项目名称：L-GPT => Le-AI
- 调整项目内所有关于 L-GPT 的文案和相关链接
- 调整部分代码结构
- 判断是否配置 key 的逻辑把 Le-AI API Key 加上了
- 调整用户凭证过期时间为 14 天
- 重构精简全局多语言配置
- 重构登录界面 UI
- 调整 OpenRouter 部分模型的权限

## v0.8.4

> 2023-08-19

### 新增

- 角色模板新增支持配置欢迎语，作为会话默认的第一句话
- 新增隐私协议和联系方式
- 新增云同步功能，可以同步会话内容到云端，方便在不同设备之间同步

### 调整

- 支持 OpenRouter 配置的导入导出
- 调整左侧底部菜单布局
- 调整 OpenRouter 提供的模型权限为 free
- 调整云备份额度，免费用户可备份 50KB 数据

## v0.8.3

> 2023-08-13

### 修复

- 修复移动端会话内容遮挡底部输入框的问题
- 重构 function calling 的调用逻辑，修复 bug
- 修复新会话选择模型时，下拉选择框出现“漂移”的情况
- 修复会话列表头像被挤压的问题

### 新增

- 新增 function calling 支持.
- 新增插件系统
- 新增支持谷歌搜索，在遇到超出 AI 模型训练日期的问题时能够调用谷歌 api 进行搜索并返回结果
- 引入 OpenRouter，支持 Claude、PaLM2、Llama 2 等模型

### 调整

- 调整编辑聊天内容的文本输入框为 Textarea
- 将谷歌搜索 由官方 API 更换为 [Serper API](https://serper.dev/)，配置更方便
- 各个模型在获取会话标题时统一使用 openai gpt-3.5-turbo，节省 token 消耗
- 在使用 OpenRouter 提供的模型时，隐藏插件，因为他们暂不支持插件

## v0.8.2

> 2023-08-07

### 修复

- 修复生产环境可能缺失 AUTH_SECRET 的问题

### 新增

- 新增支持 Azure GPT-4/GPT-4-32K
- 未配置 NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME 时的报错信息提示

### 调整

- 调整环境变量配置和相关代码逻辑，现在无需任何环境变量即可一键部署
- 调整 readme 文档
- 调整环境变量示例文档 .env.local.demo

## v0.8.1

> 2023-08-03

### 修复

- 修复重新生成对话出错时无法正常弹出错误信息的问题

### 新增

- 新增 AI 角色模板模板功能，内置部分常用模板
- AI 角色模板新增自定义功能，用户可以自定义模板使用
- 支持 url 传参的形式导入 prompt
- 新增 AI 角色模板的收藏功能
- 添加更多 AI 角色模板
- 新增 AI 角色模板的导入和导出功能
- 新增支持编辑聊天内容
- 会话内容操作按钮区域新增文字提示信息
- 新增项目 logo
- 新增 opengraph-image 和 twitter-image

### 调整

- 调整 gpt-tokens 计算模块，现在能够正确计算所有消耗的 token
- 调整注册策略，现在用户注册即送 10000 点数
- 优化 AI 角色模板弹窗界面的显示效果
- 配合官方文档，调整 zustand api
- 替换部分 Input 为 Textarea

## v0.8.0

> 2023-07-23

### 新增

- 新增引入 @ltopx/lx-ui 组件库，进一步统一全局风格样式

### 修复

- 修复不同模型下费用扣除不正确的问题（之前少扣了不少费用）

### 调整

- 移除 @vercel/analytics
- 移除 sentry
- 暂时移除 prompt market，下周末之前重构好上线
- 重构 zustand 状态相关的大部分逻辑，极大的减少 render 次数，提升整体性能
- 移除 plausible，替换监控为 umami

## v0.7.4

> 2023-07-04

### 新增

- 新增账户中心界面移动端切换菜单按钮

## v0.7.3

> 2023-07-04

### 修复

- 修复 Select 组件显示 bug

### 新增

- 新增支持 Azure 的 0613 和 0613-16K 模型
- 新增支持查看消耗的 token 详情
- 新增输入框顶部显示当前会话使用的语言模型
- 新增设置会话携带上下文数量的最大长度功能
- 输入框顶部新增”新建会话“快捷操作按钮
- 新增 Plausible Analytics 统计，替换 vercel analytics

### 调整

- 调整输入框顶部按钮布局
- 调整非会员最多只能创建 10 个会话（Premium）
- 升级 Azure api-version 为 2023-06-01-preview
- 优化会话列表头像图标，按照当前使用的语言模型显示

## v0.7.2

> 2023-06-30

### 修复

- 修复本地引入 azure tts 后，缺失 bufferutil 和 utf-8-validate 的 bug
- 修复在 service 端错误引用了 client 代码的问题
- 修复 azure tts 播放和暂停控制的 bug

### 新增

- 新建会话时，沿用用户之前选择的语言模型
- 添加初始化全局 loading
- Azure TTS 新增自动播放选项（Premium）

### 调整

- 重构滚动列表模块，优化性能
- 删减部分多余功能，提升性能
- 优化 UI 细节，统一全局图标样式。将 react-icons 替换为 MingCute Icon
- 优化 OpenAI/Azure 接口返回错误格式
- 升级 gpt-tokens 依赖

## v0.7.1

> 2023-06-28

### 新增

- 新增 vervel 全局变量 CRON_SECRET, 用于定时任务的安全校验
- 新增 Azure TTS 功能，支持将会话回复的内容转换为语音（Premium）

### 调整

- 优化初始获取用户信息的逻辑：未登录用户不拉取用户信息
- 完善 OpenAI 返回报错信息的展示
- 优化部分国际化内容
- 优化部分 UI 细节
- 优化发送会话消息逻辑代码，重构“重新生成”会话的逻辑

## v0.7.0

> 2023-06-21

### 修复

- 修复 polyfill 不生效的问题，确保其在 client 加载
- 修复高级版用户再免费试用时用户权限错误变更的问题

### 新增

- 新增 Premium 功能，支持作者后续研发
- 新增支持 Token 充值，解锁更多会话额度
- 新增激活许可证引导
- 新增 Token 不足时的引导：开始免费试用 or 充值 Token
- 新增 Free trial 和 Premium 的 token 赠送数额说明
- 新增定时任务每日核算 Token 消耗
- 新增 Product Hunt/Twitter 平台活动码

### 调整

- 调整激活 license key 的位置到左侧菜单，更加醒目
- 优化 clipboard 使用

## v0.6.2

> 2023-06-16

### 修复

- 修复 Github 登录时点击取消返回页面显示有误的问题 [#2](https://github.com/LTopx/Le-AI/issues/2)

### 新增

- 补全之前新增的所有模型（除 OpenAI-0301 模型外）

## v0.6.1

> 2023-06-14

### 修复

- 后端计算 token 修改为异步，不然会导致计算不准确
- 修复菜单置顶计算排序方式有误的问题

### 新增

- 新增后端计算 token 消耗的能力
- 新增菜单处显示当前消耗的总 token 数量
- 新增支持多会话同时对话，切换会话时不会断掉当前会话的链接
- 新增支持 openai 刚更新的模型： gpt-3.5-turbo-0613/gpt-3.5-turbo-16k
- 新增支持在设置弹窗里导入、导出本地 prompt

### 修改

- 优化前端计算 token 的逻辑，现在能够正确计算所有消耗的 token
- 大量代码和交互细节优化

## v0.6.0

> 2023-06-10

### 新增

- 新增 Prompt Market
- 新增首页还原 prompt 为默认的功能按钮

### 修复

- 修复移动端菜单新增会话时没有代入默认 prompt 的问题
- 修复首页 prompt 超长时的显示问题

### 修改

- 优化用户名缺失时的显示效果
- 其他大量细节优化
- 优化 prompt 和 Prompt Market 的 UI 细节

## v0.5.3

> 2023-06-06

### 新增

- 新增为客户端单独写的接口，目前只支持传递自己的 key 实现对话
- 为接口添加跨域支持，方便客户端进行跨域调用

### 修改

- 优化 UI 组件的实现

## v0.5.2

> 2023-06-03

### 修复

- 修复升级到 next 13.4.4 打包报错的问题
- 尝试修复 not-found 页面不生效的问题

### 新增

- 新增跳转到文档项目的各种引导链接

### 修改

- 继续优化接口请求错误提示。现在能够正确的看到会话文本超长的错误提示
- 优化登录验证时发送的邮件样式

## v0.5.1

> 2023-06-02

### 新增

- 添加清除 7 天之前无用的会话分享的定时服务
- 添加跳转 [Le-AI 文档链接](https://docs.le-ai.app)

### 修复

- 修复配置 API Key 页面在中文下和暗黑模式下的显示问题
- 添加 lang 解决生成预览图片乱码的问题

### 修改

- 调整分享的会话没有标题时的默认展示内容
- 合并 share api 路由

## v0.5.0

> 2023-05-30

### Add

- 新增会话分享功能

### 修改

- 将 prisma 变量定义全部移动到.env.local
- 统一全局 Logo 样式
- 多处细节优化
- 优化更多极限情况下的 token 消耗计算逻辑

## v0.4.3

> 2023-05-28

### 修复

- 修复未登录用户配置 api key 依旧无法正常对话的问题
- 修复 Select placeholder 的文本颜色问题以及 disabled 的逻辑问题
- 修复路由跳转丢失 locale path 的问题。替换 next/navigation/useRouter 为 next-intl/client/useRouter

### 修改

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

### 修改

- 简化会话聊天内容“复制”和“删除”的 UI 和逻辑
- 调整登录有效期时长为 3 天
