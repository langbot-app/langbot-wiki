# 特性规格

LangBot 是一个开源的大语言模型原生即时通信机器人开发平台，旨在提供开箱即用的 IM 机器人开发体验，具有 Agent、RAG、MCP 等多种 LLM 应用功能，适配全球主流即时通信平台，并提供丰富的 API 接口，支持自定义开发。

## 即时通信平台支持性

| 平台 | 状态 | 备注 |
| --- | --- | --- |
| QQ 个人号 | ✅ | 由支持 onebot11 协议的第三方应用端支持，支持 QQ 个人号私聊、群聊 |
| QQ 官方机器人 | ✅ | QQ 官方机器人，支持频道、私聊、群聊 |
| 企业微信 | ✅ |  |
| 企微智能机器人 | ✅ | 支持流式输出 |
| 企微对外客服 | ✅ |  |
| 微信公众号 | ✅ |  |
| 飞书 | ✅ | 支持流式输出 |
| 钉钉 | ✅ | 支持流式输出 |
| Discord | ✅ |  |
| Telegram | ✅ | 支持流式输出 |
| Slack | ✅ |  |
| LINE | ✅ |  |
| WhatsApp | 🚧 |  |

🚧: 正在开发中

## 模型和 LLMOps 平台支持性

| 供应商/服务 | 状态 | 备注 |
| --- | --- | --- |
| [OpenAI](https://platform.openai.com/) | ✅ | 可接入任何 OpenAI 接口格式模型 |
| [DeepSeek](https://www.deepseek.com/) | ✅ |  |
| [Moonshot](https://www.moonshot.cn/) | ✅ |  |
| [Anthropic](https://www.anthropic.com/) | ✅ |  |
| [xAI](https://x.ai/) | ✅ |  |
| [智谱AI](https://open.bigmodel.cn/) | ✅ |  |
| [胜算云](https://www.shengsuanyun.com/?from=CH_KYIPP758) | ✅ | 全球大模型都可调用（友情推荐） |
| [优云智算](https://www.compshare.cn/?ytag=GPU_YY-gh_langbot) | ✅ | 大模型和 GPU 资源平台 |
| [PPIO](https://ppio.com/user/register?invited_by=QJKFYD&utm_source=github_langbot) | ✅ | 大模型和 GPU 资源平台 |
| [302.AI](https://share.302.ai/SuTG99) | ✅ | 大模型聚合平台 |
| [Google Gemini](https://aistudio.google.com/prompts/new_chat) | ✅ | |
| [Dify](https://dify.ai) | ✅ | LLMOps 平台 |
| [n8n](https://n8n.io/) | ✅ | LLMOps 平台 |
| [Langflow](https://langflow.org/) | ✅ | LLMOps 平台 |
| [Ollama](https://ollama.com/) | ✅ | 本地大模型运行平台 |
| [LMStudio](https://lmstudio.ai/) | ✅ | 本地大模型运行平台 |
| [GiteeAI](https://ai.gitee.com/) | ✅ | 大模型接口聚合平台 |
| [SiliconFlow](https://siliconflow.cn/) | ✅ | 大模型聚合平台 |
| [阿里云百炼](https://bailian.console.aliyun.com/) | ✅ | 大模型聚合平台, LLMOps 平台 |
| [火山方舟](https://console.volcengine.com/ark/region:ark+cn-beijing/model?vendor=Bytedance&view=LIST_VIEW) | ✅ | 大模型聚合平台, LLMOps 平台 |
| [ModelScope](https://modelscope.cn/docs/model-service/API-Inference/intro) | ✅ | 大模型聚合平台 |
| [TBox（蚂蚁百宝箱）](https://tbox.cn/) | ✅ | LLMOps 平台 |
| [Coze](https://coze.cn) | ✅ | LLMOps 平台 |

## LLM 应用范式实现

| 应用范式 | 状态 | 备注 |
| --- | --- | --- |
| Agent | ✅ |  |
| RAG | ✅ | 使用 Chroma 作为向量数据库 |
| MCP | ✅ | 支持 Stdio 和 HTTP 两种方式 |

## 系统扩展性

- HTTP Service API: 支持通过基于 API key 鉴权的 HTTP API 接口访问 LangBot 各种实体。
- Outgoing Webhook: 支持通过 Webhook 发送 LangBot 内部事件到外部系统。
- 生产级插件系统: 基于跨进程通信技术和异步技术实现的生产级插件系统，支持多种组件扩展。

## 案例截图

![bot_page](/assets/image/zh/insight/features/bot-page.png)

![create_model](/assets/image/zh/insight/features/create-model.png)

![edit_pipeline](/assets/image/zh/insight/features/edit-pipeline.png)

![plugin_market](/assets/image/zh/insight/features/plugin-market.png)

![private_chat](/assets/image/zh/insight/private_chat.png)

![group_chat](/assets/image/zh/insight/group_chat.png)

