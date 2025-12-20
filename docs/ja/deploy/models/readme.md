# モデルの設定(Models)

## 対話モデル (LLM Model)

モデルはパイプラインによってメッセージ処理に使用されます。最初に設定したモデルがデフォルトパイプラインのモデルとして設定されます。

![arch](/assets/image/zh/deploy/models/arch.png)

複数のモデルを追加して、パイプラインでどのモデルを使用するかを選択できます。

<img width="400px" src="/assets/image/zh/deploy/models/model_config.png" alt="model_config" />

これら4つのパラメータを入力します: `モデル名`、`モデルプロバイダー`、`リクエストURL`、`APIキー`、そして送信します。

モデルの機能については、特定のモデルの特性に応じて選択してください:

- ビジュアル機能: 画像を認識するために有効にする必要があります

- Function Calling: 会話でAgentツールを使用するために有効にする必要があります

:::info

*APIキーをお持ちでない場合は、[このリレーステーションから入手できます](https://api.qhaigc.net/)*

サードパーティのAPIリレーや他のモデルプロバイダーを使用する必要がある場合、

`OpenAI`を選択してください

リクエストURLにリレーのBase URLを入力します。例:

<img width="400px" src="/assets/image/zh/deploy/models/other_provider.png" alt="other_provider" />

:::

## 埋め込みモデル (Embedding Model)

埋め込みモデルはメッセージのベクトル表現を計算するために使用されます。ナレッジベースを使用する場合は、このモデルを設定してください。

<img width="400px" src="/assets/image/zh/deploy/models/embedding_model.png" alt="embedding_model" />

これら4つのパラメータを入力します: `モデル名`、`モデルプロバイダー`、`リクエストURL`、`APIキー`、そして送信します。その後、ナレッジベースでこのモデルを使用するように設定してください。

### seekdb内蔵埋め込みモデルの使用（ゼロ設定）
システムにはseekdbが提供する公式埋め込みモデルが統合されており、パラメータの入力は不要です。
- 「埋め込みモデル」ページで「seekdb-内蔵」を選択します；
- 「保存」をクリックするとすぐに使用できます；
- その後、ナレッジベースでこのモデルを選択すると有効になります。
