# 系统环境设置

配置系统运行的一些环境信息，文件位于`data/config.yaml`。  
一般不需要修改。

```yaml
# 管理员会话列表，仅在处理命令时有效
# 格式为会话ID（person_xxxx 或 group_xxxx）
# 会话ID 可以在发送消息时查看控制台日志找到
# 例如：
# admins:
#   - person_1234567890
#   - group_1234567890
admins: []

# API 端口
api:
    port: 5300
    # LangBot 统一管理所有需要 Webhook 监听的机器人地址
    # 这是显示在需要 Webhook 连接的机器人页面上的 Webhook地址前缀
    # 您可以根据自身网络环境修改
    webhook_prefix: 'http://127.0.0.1:5300'

# 命令配置
command:
    # 命令前缀，具有这些前缀的消息会被识别为命令
    prefix:
    - '!'
    - ！

    # 命令权限配置，key 为命令前缀，value 为权限类型
    privilege: {}

# 并发设置
concurrency:
    # 单流水线并发数
    pipeline: 20
    # 单会话并发数
    session: 1

# 数据库配置
database:
    # 所使用的数据库
    # 支持的数据库：
    # - sqlite（本地 SQLite 数据库，默认）
    # - postgresql（PostgreSQL 数据库，请在下方配置）
    use: sqlite
    sqlite:
        path: 'data/langbot.db'
    postgresql:
        host: '127.0.0.1'
        port: 5432
        user: 'postgres'
        password: 'postgres'
        database: 'postgres'

# 插件系统配置
plugin:
    # 是否启用插件系统
    enable: true
    # 插件运行时 WebSocket 地址
    # 默认为 Docker 环境下的默认值
    # 若要使用独立的 Plugin Runtime，请参考 https://docs.langbot.app/zh/develop/plugin-runtime.html
    runtime_ws_url: 'ws://langbot_plugin_runtime:5400/control/ws'
    # 是否启用插件市场
    enable_marketplace: true
    # 插件市场 URL
    cloud_service_url: 'https://space.langbot.app'

# 代理配置
proxy:
    # HTTP 代理地址
    # 如果已经在环境变量设置了代理，则不需要配置
    # 例如：
    # proxy:
    #     http: 'http://127.0.0.1:7890'
    #     https: 'http://127.0.0.1:7890'
    http: ''
    https: ''

# 对象存储配置
storage:
    # 所使用的对象存储
    # 支持的对象存储：
    # - local（本地存储，默认）
    # - s3（S3 协议对象存储，支持 R2、MinIO 等兼容 S3 协议的对象存储服务，请在下方配置）
    use: local
    # S3 配置
    s3:
        endpoint_url: ''
        access_key_id: ''
        secret_access_key: ''
        region: 'us-east-1'
        bucket: 'langbot-storage'

# 系统配置
system:
    # JWT 配置
    jwt:
        # JWT 过期时间，单位为秒
        expire: 604800
        # JWT 密钥，首次启动时会自动生成一个密钥
        secret: 'xxxx'

# 向量数据库配置
vdb:
    # 所使用的向量数据库
    # 支持的向量数据库：
    # - chroma（默认，嵌入式向量数据库）
    # - qdrant（外部向量数据库，请在下方配置）
    # - milvus（可扩展的向量数据库，请在下方配置）
    # - pgvector（PostgreSQL 扩展，请在下方配置）
    # - seekdb（提供内置嵌入模型的数据库，请在下方配置）
    use: chroma
    # Qdrant 配置
    qdrant:
        url: ''
        host: localhost
        port: 6333
        api_key: ''
    milvus:
        uri: 'http://127.0.0.1:19530'
        token: ''
    pgvector:
        host: '127.0.0.1'
        port: 5433
        database: 'langbot'
        user: 'postgres'
        password: 'postgres'
    seekdb:
        mode: embedded  # 嵌入式模式（'embedded' 或 'server'）
        # 嵌入式模式配置：
        path: './data/seekdb'          # 数据库文件存放路径
        database: 'langbot'            # 数据库名称
        # 服务器模式配置（当 mode='server' 时生效）：
        host: 'localhost'              # 数据库服务器地址
        port: 2881                     # 数据库端口
        user: 'root'                   # 用户名
        password: ''                   # 密码
        tenant: ''                     # 可选，用于 OceanBase 多租户场景
```

## 通过环境变量设置

config.yaml 中的配置可以通过环境变量进行设置。环境变量名称为大写字母，使用双下划线连接，例如：`API__PORT`代表`api.port`。

- `API__PORT` 代表 `api.port`
- `CONCURRENCY__PIPELINE` 代表 `concurrency.pipeline`
- `CONCURRENCY__SESSION` 代表 `concurrency.session`
- `DATABASE__POSTGRESQL__DATABASE` 代表 `database.postgresql.database`
- `DATABASE__POSTGRESQL__HOST` 代表 `database.postgresql.host`
- `DATABASE__SQLITE__PATH` 代表 `database.sqlite.path`

...

在启动时，LangBot 会读取所有环境变量，将对应的配置应用到 config.yaml 中并写入到 data/config.yaml 文件中。
