# System Environment Settings

Configure some environment information for system operation, located in the `data/config.yaml` file.  
Generally, no modification is needed.

```yaml
# Administrator session list, only valid when processing commands
# Format is session ID (person_xxxx or group_xxxx)
# Session ID can be found in the console logs when sending messages
# For example:
# admins:
#   - person_1234567890
#   - group_1234567890
admins: []

# API port
api:
    port: 5300
    # LangBot centrally manages all bot addresses that require Webhook listening
    # This is the Webhook address prefix displayed on the bot page that requires Webhook connection
    # You can modify it according to your network environment
    webhook_prefix: 'http://127.0.0.1:5300'

# Command configuration
command:
    # Command prefixes, messages with these prefixes will be recognized as commands
    prefix:
    - '!'
    - ！

    # Command permission configuration, key is the command prefix, value is the permission type
    privilege: {}

# Concurrency settings
concurrency:
    # Single pipeline concurrency
    pipeline: 20
    # Single session concurrency
    session: 1

# Database configuration
database:
    # The database to use
    # Supported databases:
    # - sqlite (local SQLite database, default)
    # - postgresql (PostgreSQL database, please configure below)
    use: sqlite
    # SQLite configuration
    sqlite:
        path: 'data/langbot.db'
    # PostgreSQL configuration
    postgresql:
        host: '127.0.0.1'
        port: 5432
        database: 'postgres'
        user: 'postgres'
        password: 'postgres'

# Plugin system configuration
plugin:
    # Whether to enable the plugin system
    enable: true
    # Plugin runtime WebSocket address
    # Default value for Docker environment
    # If you want to use a standalone Plugin Runtime, please refer to https://docs.langbot.app/en/develop/plugin-runtime.html
    runtime_ws_url: 'ws://langbot_plugin_runtime:5400/control/ws'
    # Whether to enable the plugin marketplace
    enable_marketplace: true
    # Plugin marketplace URL
    cloud_service_url: 'https://space.langbot.app'

# Proxy configuration
proxy:
    # HTTP proxy address
    # If proxy is already set in environment variables, no configuration is needed
    # For example:
    # proxy:
    #     http: 'http://127.0.0.1:7890'
    #     https: 'http://127.0.0.1:7890'
    http: ''
    https: ''

# Object storage configuration
storage:
    # The object storage to use
    # Supported object storage:
    # - local (local storage, default)
    # - s3 (S3 protocol object storage, supports R2, MinIO, etc. Please configure below)
    use: local
    # S3 configuration
    s3:
        endpoint_url: ''
        access_key_id: ''
        secret_access_key: ''
        region: 'us-east-1'
        bucket: 'langbot-storage'

# System configuration
system:
    # JWT configuration
    jwt:
        # JWT expiration time in seconds
        expire: 604800
        # JWT secret key, a key will be automatically generated on first startup
        secret: 'xxxx'
    # Whether to allow changing the password
    allow_change_password: true
    # Recovery password key
    recovery_key: 'xxxx'

# Vector database configuration
vdb:
    # The vector database to use
    # Supported vector databases:
    # - chroma (default, embedded vector database)
    # - qdrant (external vector database, please configure below)
    # - milvus (scalable vector database, please configure below)
    # - pgvector (PostgreSQL extension, please configure below)
    # - seekdb (Built-in embedded-model database, please configure below)
    use: chroma
    # Qdrant configuration
    qdrant:
        # Qdrant URL
        url: ''
        # Qdrant Host
        host: localhost
        # Qdrant Port
        port: 6333
        # Qdrant API Key
        api_key: ''
    # Milvus configuration
    milvus:
        uri: 'http://127.0.0.1:19530'
        token: ''
    # pgvector configuration
    pgvector:
        host: '127.0.0.1'
        port: 5433
        database: 'langbot'
        user: 'postgres'
        password: 'postgres'
    seekdb:
        # 'embedded' or 'server'
        mode: embedded  
        # Embedded mode options:
        path: './data/seekdb'          
        database: 'langbot'            
         # Server mode options (used when mode='server'):
        host: 'localhost'              
        port: 2881                     
        user: 'root'                   
        password: ''                   
        # Optional, for OceanBase server
        tenant: ''  
```

## Set configuration via environment variables

The configuration in `config.yaml` can be set via environment variables. The environment variable name is uppercase letters, using double underscores to connect, for example: `API__PORT` represents `api.port`.

- `API__PORT` represents `api.port`
- `CONCURRENCY__PIPELINE` represents `concurrency.pipeline`
- `CONCURRENCY__SESSION` represents `concurrency.session`
- `DATABASE__POSTGRESQL__DATABASE` represents `database.postgresql.database`
- `DATABASE__POSTGRESQL__HOST` represents `database.postgresql.host`
- `DATABASE__SQLITE__PATH` represents `database.sqlite.path`

...

When starting, LangBot will read all environment variables and apply the corresponding configuration to `config.yaml` and write to the `data/config.yaml` file.
