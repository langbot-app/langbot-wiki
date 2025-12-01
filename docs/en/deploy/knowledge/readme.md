# Using the Knowledge Base

LangBot natively supports RAG (Retrieval-Augmented Generation). You can create a built-in knowledge base and bind it to a pipeline, allowing the pipeline to answer questions based on the contents of the knowledge base. LangBot also supports connecting to external knowledge retrieval services (e.g., Dify, RAGFlow).

## Build a Built-in Knowledge Base

:::info
- Creating and using a built-in knowledge base requires configuring an embedding model first. Please read [Configure Models](/en/deploy/models/readme).
:::

On the knowledge base page, click the `Create Knowledge Base` button, fill in the name, select an already configured embedding model, then click `Create`.  
After creation, go to the "Documents" tab of your knowledge base and upload documents. LangBot will automatically parse and index these in the background.

<img width="400px" src="/assets/image/zh/deploy/knowledge/upload_docs.png" alt="create_kb" />

## Connect External Knowledge Base

On the knowledge base page, switch to the "External Knowledge Base" tab and add an external retriever. In the dialog, select the knowledge retriever plugin to use (please install the related plugin in Plugin Management first). Supported retrievers can be found in the [Plugin Marketplace](https://space.langbot.app/market?category=KnowledgeRetriever).

## Use the Knowledge Base

Go to your pipeline configuration, under the "AI" tab, choose `Local Agent` as the runner, then select the knowledge base you just created.

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_local_agent.png" alt="use_kb" />

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_kb.png" alt="use_kb" />

:::info
LangBot's built-in knowledge base can be used only when the runner is set to `Local Agent`. For other runners, refer to their documentation.
:::

Now you can use the knowledge base in `Chat Debug`, or through the bot linked to this pipeline:

<img width="400px" src="/assets/image/zh/deploy/knowledge/use_kb_in_chat.png" alt="use_kb_in_chat" />