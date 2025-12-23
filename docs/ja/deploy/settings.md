# システム環境設定

システム動作のための環境情報を設定します。`data/config.yaml`ファイルに配置されています。
通常、変更は必要ありません。

```yaml
# 管理者セッションリスト、コマンド処理時のみ有効
# 形式はセッションID(person_xxxxまたはgroup_xxxx)
# セッションIDはメッセージ送信時のコンソールログで確認できます
# 例:
# admins:
#   - person_1234567890
#   - group_1234567890
admins: []

# APIポート
api:
    port: 5300
    # LangBotはWebhookリスニングを必要とするすべてのボットアドレスを一元管理します
    # これはWebhook接続を必要とするボットページに表示されるWebhookアドレスプレフィックスです
    # ネットワーク環境に応じて変更できます
    webhook_prefix: 'http://127.0.0.1:5300'

# コマンド設定
command:
    # コマンドプレフィックス、これらのプレフィックスを持つメッセージはコマンドとして認識されます
    prefix:
    - '!'
    - ！

    # コマンド権限設定、キーはコマンドプレフィックス、値は権限タイプ
    privilege: {}

# 同時実行設定
concurrency:
    # 単一パイプライン同時実行
    pipeline: 20
    # 単一セッション同時実行
    session: 1

# データベース設定
database:
    # 使用するデータベース
    # サポートされているデータベース:
    # - sqlite (ローカルSQLiteデータベース、デフォルト)
    # - postgresql (PostgreSQLデータベース、以下で設定してください)
    use: sqlite
    # SQLite設定
    sqlite:
        path: 'data/langbot.db'
    # PostgreSQL設定
    postgresql:
        host: '127.0.0.1'
        port: 5432
        database: 'postgres'
        user: 'postgres'
        password: 'postgres'

# プラグインシステム設定
plugin:
    # プラグインシステムを有効にするか
    enable: true
    # プラグインランタイムWebSocketアドレス
    # Docker環境のデフォルト値
    # スタンドアロンのPlugin Runtimeを使用する場合は、https://docs.langbot.app/en/develop/plugin-runtime.htmlを参照してください
    runtime_ws_url: 'ws://langbot_plugin_runtime:5400/control/ws'
    # プラグインマーケットプレイスを有効にするか
    enable_marketplace: true
    # プラグインマーケットプレイスURL
    cloud_service_url: 'https://space.langbot.app'

# プロキシ設定
proxy:
    # HTTPプロキシアドレス
    # プロキシが既に環境変数に設定されている場合、設定は不要です
    # 例:
    # proxy:
    #     http: 'http://127.0.0.1:7890'
    #     https: 'http://127.0.0.1:7890'
    http: ''
    https: ''

# オブジェクトストレージ設定
storage:
    # 使用するオブジェクトストレージ
    # サポートされているオブジェクトストレージ:
    # - local (ローカルストレージ、デフォルト)
    # - s3 (S3プロトコルオブジェクトストレージ、R2、MinIOなどをサポート。以下で設定してください)
    use: local
    # S3設定
    s3:
        endpoint_url: ''
        access_key_id: ''
        secret_access_key: ''
        region: 'us-east-1'
        bucket: 'langbot-storage'

# システム設定
system:
    # JWT設定
    jwt:
        # JWT有効期限(秒)
        expire: 604800
        # JWTシークレットキー、最初の起動時に自動生成されます
        secret: 'xxxx'
    # パスワード変更を許可するか
    allow_change_password: true
    # 復旧キー
    recovery_key: 'xxxx'

# ベクトルデータベース設定
vdb:
    # 使用するベクトルデータベース
    # サポートされているベクトルデータベース:
    # - chroma (デフォルト、組み込みベクトルデータベース)
    # - qdrant (外部ベクトルデータベース、以下で設定してください)
    # - milvus (スケーラブルベクトルデータベース、以下で設定してください)
    # - pgvector (PostgreSQL拡張、以下で設定してください)
    # - seekdb (組み込み埋め込みモデルを提供するデータベース、以下で設定してください)
    use: chroma
    # Qdrant設定
    qdrant:
        # Qdrant URL
        url: ''
        # Qdrant Host
        host: localhost
        # Qdrant Port
        port: 6333
        # Qdrant API Key
        api_key: ''
    # Milvus設定
    milvus:
        uri: 'http://127.0.0.1:19530'
        token: ''
    # pgvector設定
    pgvector:
        host: '127.0.0.1'
        port: 5433
        database: 'langbot'
        user: 'postgres'
        password: 'postgres'
    seekdb:
        # 動作モード（'embedded' または 'server'）
        mode: embedded  
        # 組み込みモード設定：
        path: './data/seekdb'          
        database: 'langbot'            
        # サーバーモード設定（mode='server'の場合に有効）：
        host: 'localhost'              
        port: 2881                     
        user: 'root'                   
        password: ''                   
        # OceanBaseマルチテナントシナリオ用、オプション
        tenant: ''     
```

## 環境変数による設定

`config.yaml`の設定は環境変数を介して設定できます。環境変数名は大文字で、二重アンダースコアで接続されます。例: `API__PORT`は`api.port`を表します。

- `API__PORT`は`api.port`を表します
- `CONCURRENCY__PIPELINE`は`concurrency.pipeline`を表します
- `CONCURRENCY__SESSION`は`concurrency.session`を表します
- `DATABASE__POSTGRESQL__DATABASE`は`database.postgresql.database`を表します
- `DATABASE__POSTGRESQL__HOST`は`database.postgresql.host`を表します
- `DATABASE__SQLITE__PATH`は`database.sqlite.path`を表します

...

起動時、LangBotはすべての環境変数を読み取り、対応する設定を`config.yaml`に適用して`data/config.yaml`ファイルに書き込みます。
