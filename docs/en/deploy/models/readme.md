# Configure Models (Models)

## LLM Model

Models will be used by pipelines to process messages. The first model you configure will be set as the model for the default pipeline.

![arch](/assets/image/zh/deploy/models/arch.png)

You can add multiple models, and then select which model to use in the pipeline.

<img width="400px" src="/assets/image/zh/deploy/models/model_config.png" alt="model_config" />

Enter these four parameters: `Model Name`, `Model Provider`, `Request URL`, and `API Key`, then submit.

For model capabilities, please choose according to the specific model characteristics:

- Visual Capability: Needs to be enabled to recognize images

- Function Calling: Needs to be enabled to use Agent tools in conversations

:::info

*If you don't have an API Key, you can [get one from this relay station](https://api.qhaigc.net/)*

If you need to use third-party API relays or other model providers,

Select `OpenAI`

Fill in the relay's Base URL for the Request URL, for example:

<img width="400px" src="/assets/image/zh/deploy/models/other_provider.png" alt="other_provider" />

:::

## Embedding Model

Embedding models are used to compute vector representations of messages. If you need to use knowledge bases, please configure this model.

<img width="400px" src="/assets/image/zh/deploy/models/embedding_model.png" alt="embedding_model" />

Enter these four parameters: `Model Name`, `Model Provider`, `Request URL`, and `API Key`, then submit. After that, please configure the knowledge base to use this model.

### Using seekdb Built-in Embedding Model (Zero Configuration)
The system has integrated the official embedding model provided by seekdb, no parameters required.
- On the "Embedding Model" page, select "seekdb-built-in";
- Click "Save" to use it immediately;
- Then select this model in your knowledge base to take effect.
