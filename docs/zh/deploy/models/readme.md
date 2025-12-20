# 配置模型 (Models)

## 对话模型 (LLM Model)

对话模型将被流水线用于处理消息，您配置的第一个模型将被设置为默认流水线的模型。

![arch](/assets/image/zh/deploy/models/arch.png)

可以添加多个模型，然后再流水线中选择具体使用什么模型

<img width="400px" src="/assets/image/zh/deploy/models/model_config.png" alt="model_config" />

填入这四个参数`模型名称`、`模型供应商`、`请求 URL`、`API Key`，然后提交即可

模型能力方面，请根据具体模型特性来选择：

- 视觉能力：需要启用才可以识图

- 函数调用：需要启用才可以在对话中使用 Agent 工具

:::info

*如果你没有API Key，你可以[在此中转站获取](https://api.qhaigc.net/)*

如果需要使用第三方中转 API 等模型提供商

选择 `OpenAI`即可

请求 URL 填入中转的 Base URL 即可，例如

<img width="400px" src="/assets/image/zh/deploy/models/other_provider.png" alt="other_provider" />

:::

## 嵌入模型 (Embedding Model)

嵌入模型将被用于计算消息的向量，若您需要使用知识库，请配置此模型。

<img width="400px" src="/assets/image/zh/deploy/models/embedding_model.png" alt="embedding_model" />

填入这四个参数`模型名称`、`模型供应商`、`请求 URL`、`API Key`，然后提交即可，之后请在知识库中配置使用此模型。

### 使用 seekdb 内置嵌入模型（零配置）
系统已集成 seekdb 提供的官方嵌入模型，无需填写任何参数。
- 在“嵌入模型”页面选择「seekdb-内置」；
- 点击「保存」即可立即使用；
- 后续在知识库中选择该模型即可生效。
