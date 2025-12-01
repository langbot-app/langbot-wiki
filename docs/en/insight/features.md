# Features

LangBot is an open-source LLM native instant messaging robot development platform, aiming to provide an out-of-the-box IM robot development experience, with Agent, RAG, MCP and other LLM application functions, supporting global instant messaging platforms, and providing rich API interfaces, supporting custom development.

## Instant Messaging Platform Support

| Platform | Status | Remarks |
| --- | --- | --- |
| Personal QQ | ✅ |  |
| QQ Official API | ✅ |  |
| WeCom | ✅ |  |
| WeComCS | ✅ |  |
| WeComIntelligentBot | ✅ | Support streaming output |
| Lark | ✅ | Support streaming output |
| DingTalk | ✅ | Support streaming output |
| Discord | ✅ |  |
| Telegram | ✅ | Support streaming output |
| Slack | ✅ |  |
| LINE | ✅ |  |
| WhatsApp | 🚧 |  |

🚧: In development

## Model and LLMOps Platform Support

| Provider/Service | Status | Remarks |
| --- | --- | --- |
| [OpenAI](https://platform.openai.com/) | ✅ | Available for any OpenAI interface format model |
| [DeepSeek](https://www.deepseek.com/) | ✅ |  |
| [Moonshot](https://www.moonshot.cn/) | ✅ |  |
| [Anthropic](https://www.anthropic.com/) | ✅ |  |
| [xAI](https://x.ai/) | ✅ |  |
| [Zhipu AI](https://open.bigmodel.cn/) | ✅ |  |
| [CompShare](https://www.compshare.cn/?ytag=GPU_YY-gh_langbot) | ✅ | LLM and GPU resource platform |
| [Dify](https://dify.ai) | ✅ | LLMOps platform |
| [n8n](https://n8n.io/) | ✅ | LLMOps platform |
| [Langflow](https://langflow.org/) | ✅ | LLMOps platform |
| [PPIO](https://ppio.com/user/register?invited_by=QJKFYD&utm_source=github_langbot) | ✅ | LLM and GPU resource platform |
| [ShengSuanYun](https://www.shengsuanyun.com/login?code=7DS2QLH5) | ✅ | LLM and GPU resource platform |
| [302.AI](https://share.302.ai/SuTG99) | ✅ | LLM gateway(MaaS) |
| [Google Gemini](https://aistudio.google.com/prompts/new_chat) | ✅ | |
| [Ollama](https://ollama.com/) | ✅ | Local LLM running platform |
| [LMStudio](https://lmstudio.ai/) | ✅ | Local LLM running platform |
| [GiteeAI](https://ai.gitee.com/) | ✅ | LLM interface gateway(MaaS) |
| [SiliconFlow](https://siliconflow.cn/) | ✅ | LLM gateway(MaaS) |
| [Aliyun Bailian](https://bailian.console.aliyun.com/) | ✅ | LLM gateway(MaaS), LLMOps platform |
| [Volc Engine Ark](https://console.volcengine.com/ark/region:ark+cn-beijing/model?vendor=Bytedance&view=LIST_VIEW) | ✅ | LLM gateway(MaaS), LLMOps platform |
| [ModelScope](https://modelscope.cn/docs/model-service/API-Inference/intro) | ✅ | LLM gateway(MaaS) |
| [Coze](https://coze.com) | ✅ | LLMOps platform |

## LLM Application Paradigm Implementation

| Application Paradigm | Status | Remarks |
| --- | --- | --- |
| Agent | ✅ |  |
| RAG | ✅ | Using Chroma as vector database |
| MCP | ✅ | Support Stdio and HTTP protocol |

## System Extensibility

- HTTP Service API: Supports accessing various entities of LangBot through HTTP API interfaces with API key authentication.
- Outgoing Webhook: Supports sending internal events of LangBot to external systems through Webhook.
- Production-grade plugin system: A production-grade plugin system based on cross-process communication technology and asynchronous technology, supporting various component extensions.

## Case Screenshots

![bot_page](/assets/image/zh/insight/features/bot-page.png)

![create_model](/assets/image/zh/insight/features/create-model.png)

![edit_pipeline](/assets/image/zh/insight/features/edit-pipeline.png)

![plugin_market](/assets/image/zh/insight/features/plugin-market.png)

![private_chat](/assets/image/zh/insight/private_chat.png)

![group_chat](/assets/image/zh/insight/group_chat.png)