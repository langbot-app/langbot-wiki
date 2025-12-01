# 使用知识库 (Knowledge Base)

LangBot 原生支持 RAG（Retrieval-Augmented Generation，即检索增强生成），您可以创建内置知识库，并将其与流水线绑定，流水线将根据知识库中的内容回答问题。同时，我们支持接入外部服务（Dify、RAGFLow等）提供的知识检索服务。

## 构建内置知识库

:::info
- 内置知识库的创建和使用需要先配置嵌入模型，请先阅读[配置模型](/zh/deploy/models/readme)。
:::

在知识库页面，点击`创建知识库`按钮，填写知识库名称，选择已配置好的嵌入模型，然后点击`创建`按钮。  
之后请到知识库的“文档”页面，上传文档，LangBot 将会在后台开始解析和索引。

<img width="400px" src="/assets/image/zh/deploy/knowledge/upload_docs.png" alt="create_kb" />

## 接入外部知识库

请在知识库页面，切换到“外部知识库”标签页，添加外部知识库。在对话框中可以选择需要使用的外部知识库检索器，您需要先在插件管理中安装对应的插件。目前支持的知识检索器可以在[插件市场](https://space.langbot.app/market?category=KnowledgeRetriever)中查看。

## 使用知识库

请到流水线配置中，“AI 能力”页，选择`内置 Agent`作为运行器，并在下方选择您刚刚创建的知识库。

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_local_agent.png" alt="use_kb" />

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_kb.png" alt="use_kb" />

:::info
仅当运行器为`内置 Agent`时，才可以使用 LangBot 原生知识库，若要在使用其他运行器时使用知识库，请参考所使用的运行器对应产品的文档。
:::

现在即可在`对话调试`或流水线所绑定的机器人上使用知识库进行对话：

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_kb_in_chat.png" alt="use_kb_in_chat" />