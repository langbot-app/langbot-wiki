# 流水线事件和 API

:::info 目录
[[toc]]
:::

LangBot 插件可注册并处理流水线事件。使用方法见[组件：事件监听器](/zh/plugin/dev/components/event-listener)。

## 可监听的事件列表

某些事件具有`可设置的属性`，这些属性可以被插件代码修改，并在之后被用在 LangBot 后续的处理中。

### *MessageReceived

接收到群聊或私聊任何消息时触发。

```python
class PersonMessageReceived(BaseEventModel):
    """收到任何私聊消息时"""

    event_name: str = "PersonMessageReceived"

    launcher_type: str
    """发起对象类型(person)"""

    launcher_id: typing.Union[int, str]
    """发送者ID"""

    sender_id: typing.Union[int, str]
    """发送者ID，私聊情况下与 launcher_id 相同"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """消息链"""


class GroupMessageReceived(BaseEventModel):
    """收到任何群聊消息时"""

    event_name: str = "GroupMessageReceived"

    launcher_type: str
    """发起对象类型(group)"""

    launcher_id: typing.Union[int, str]
    """群号"""

    sender_id: typing.Union[int, str]
    """发送者ID"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """消息链"""
```

### *NormalMessageReceived

接收到群聊或私聊消息，并判断为需要由 LLM 处理的消息（非命令消息）时触发。

```python
class PersonNormalMessageReceived(BaseEventModel):
    """判断为应该处理的私聊普通消息时触发"""

    event_name: str = "PersonNormalMessageReceived"

    launcher_type: str
    """发起对象类型(person)"""

    launcher_id: typing.Union[int, str]
    """发起对象ID"""

    sender_id: typing.Union[int, str]
    """发送者ID，私聊情况下与 launcher_id 相同"""

    text_message: str
    """消息文本"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """消息链"""

    # ========== 可设置的属性 ==========

    user_message_alter: typing.Optional[provider_message.ContentElement] = None
    """修改后的消息文本，langbot_plugin.api.entities.builtin.provider.message.ContentElement 类型"""

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """直接回复消息链，仅在阻止默认行为时生效"""


class GroupNormalMessageReceived(BaseEventModel):
    """判断为应该处理的群聊普通消息时触发"""

    event_name: str = "GroupNormalMessageReceived"

    launcher_type: str
    """发起对象类型(group)"""

    launcher_id: typing.Union[int, str]
    """群号"""

    sender_id: typing.Union[int, str]
    """发送者ID"""

    text_message: str
    """消息文本"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """消息链"""

    # ========== 可设置的属性 ==========

    user_message_alter: typing.Optional[provider_message.ContentElement] = None
    """修改后的消息文本，langbot_plugin.api.entities.builtin.provider.message.ContentElement 类型"""

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """直接回复消息链，仅在阻止默认行为时生效"""
```

### *CommandSent

:::warning 注意
不再推荐使用，请改为使用[组件：命令](/zh/plugin/dev/components/command)。
:::

接收到群聊或私聊命令时触发。

```python
class PersonCommandSent(BaseEventModel):
    """判断为应该处理的私聊命令时触发"""

    event_name: str = "PersonCommandSent"

    launcher_type: str
    """发起对象类型(person)"""

    launcher_id: typing.Union[int, str]
    """发起对象ID"""

    sender_id: typing.Union[int, str]
    """发送者ID，私聊情况下与 launcher_id 相同"""

    command: str
    """命令文本"""

    params: list[str]
    """命令参数"""

    text_message: str
    """消息文本"""

    is_admin: bool
    """是否为管理员"""


class GroupCommandSent(BaseEventModel):
    """判断为应该处理的群聊命令时触发"""

    event_name: str = "GroupCommandSent"

    launcher_type: str
    """发起对象类型(group)"""

    launcher_id: typing.Union[int, str]
    """群号"""

    sender_id: typing.Union[int, str]
    """发送者ID"""

    command: str
    """命令文本"""

    params: list[str]
    """命令参数"""

    text_message: str
    """消息文本"""

    is_admin: bool
    """是否为管理员"""

```

### NormalMessageResponded

消息得到 LLM 响应时触发。

```python
class NormalMessageResponded(BaseEventModel):
    """收到对普通消息的响应时触发"""

    event_name: str = "NormalMessageResponded"

    launcher_type: str
    """发起对象类型(person)"""

    launcher_id: typing.Union[int, str]
    """发起对象ID"""

    sender_id: typing.Union[int, str]
    """发送者ID，私聊情况下与 launcher_id 相同"""

    session: provider_session.Session
    """会话对象"""

    prefix: str
    """回复消息的前缀"""

    response_text: str
    """回复消息的文本"""

    finish_reason: str
    """响应结束原因"""

    funcs_called: list[str]
    """调用的函数列表"""

    # ========== 可设置的属性 ==========

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """直接回复消息链，仅在阻止默认行为时生效"""
```

### PromptPreProcessing

在构建 LLM 响应的上下文（prompt）时触发。

```python
class PromptPreProcessing(BaseEventModel):
    """会话中的Prompt预处理时触发"""

    event_name: str = "PromptPreProcessing"

    session_name: str
    """会话名称，格式为 person_1234567890 或 group_1234567890"""

    # ========== 可设置的属性 ==========

    default_prompt: list[
        typing.Union[provider_message.Message, provider_message.MessageChunk]
    ]
    """此对话的情景预设（系统提示词），可修改，langbot_plugin.api.entities.builtin.provider.message.Message 或 langbot_plugin.api.entities.builtin.provider.message.MessageChunk 类型"""

    prompt: list[typing.Union[provider_message.Message, provider_message.MessageChunk]]
    """此对话现有消息记录，可修改，langbot_plugin.api.entities.builtin.provider.message.Message 或 langbot_plugin.api.entities.builtin.provider.message.MessageChunk 类型"""

```

## 事件上下文 API

```python
...
        @self.handler(events.PersonMessageReceived)
        async def handler(event_context: context.EventContext):
            ...
```

事件处理方法将被传入`EventContext`对象，该对象包含事件的上下文信息，该对象同时具有[请求 API](/zh/plugin/dev/apis/common)和事件上下文特定 API，以下为事件上下文特定 API 列表：

### 获取原事件属性

`event_context.event` 属性为原事件对象，可获取原事件的属性。其类型即为监听的事件类型。

例如：当监听的事件是`GroupMessageReceived`时：

```python
event = event_context.event
print(event.launcher_type)  # 发起对象类型(group)
print(event.launcher_id)    # 群号
print(event.sender_id)      # 发送者账号 ID
print(event.message_chain)  # 消息链
```

### 阻止默认行为

```python
def prevent_default(self):
    """阻止默认行为"""

# 调用示例
event_context.prevent_default()
```

调用该方法后，该事件后续默认行为将被阻止，流水线将直接结束。

:::info
仅以下事件可阻止默认行为：

- PersonMessageReceived
- GroupMessageReceived
- PersonNormalMessageReceived
- GroupNormalMessageReceived
- PersonCommandSent
- GroupCommandSent
- NormalMessageResponded

:::

### 阻止后序插件执行

```python
def prevent_postorder(self):
    """阻止后序插件执行"""

# 调用示例
event_context.prevent_postorder()
```

调用该方法后，注册了该事件的后序插件此次将不被执行。
