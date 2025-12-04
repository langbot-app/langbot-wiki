# Pipeline Events and APIs

:::info Table of Contents
[[toc]]
:::

LangBot plugins can register and handle pipeline events. For usage instructions, see [Component: Event Listener](/en/plugin/dev/components/event-listener).

## List of Events

Some events have `settable attributes`, which can be modified by plugin code and used in subsequent LangBot processing.

### *MessageReceived

Triggered when any message is received in group chat or private chat.

```python
class PersonMessageReceived(BaseEventModel):
    """When any private chat message is received"""

    event_name: str = "PersonMessageReceived"

    launcher_type: str
    """Launcher object type (person)"""

    launcher_id: typing.Union[int, str]
    """Sender ID"""

    sender_id: typing.Union[int, str]
    """Sender ID"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """Raw message chain"""

class GroupMessageReceived(BaseEventModel):
    """When any group chat message is received"""

    event_name: str = "GroupMessageReceived"

    launcher_type: str
    """Launcher object type (group)"""

    launcher_id: typing.Union[int, str]
    """Group ID"""

    sender_id: typing.Union[int, str]
    """Sender ID"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """Raw message chain"""
```

### *NormalMessageReceived

Triggered when a group chat or private chat message is received and determined to be a message that needs to be processed by LLM (non-command message).

```python
class PersonNormalMessageReceived(BaseEventModel):
    """Triggered when a private chat normal message that should be processed is determined"""

    event_name: str = "PersonNormalMessageReceived"

    launcher_type: str

    launcher_id: typing.Union[int, str]

    sender_id: typing.Union[int, str]

    text_message: str
    """Message text"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """Raw message chain"""

    # ========== Settable Attributes ==========

    user_message_alter: typing.Optional[provider_message.ContentElement] = None
    """Modified message text, langbot_plugin.api.entities.builtin.provider.message.ContentElement type"""

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """Reply message component list, only effective when preventing default behavior"""

class GroupNormalMessageReceived(BaseEventModel):
    """Triggered when a group chat normal message that should be processed is determined"""

    event_name: str = "GroupNormalMessageReceived"

    launcher_type: str

    launcher_id: typing.Union[int, str]

    sender_id: typing.Union[int, str]

    text_message: str
    """Message text"""

    message_chain: platform_message.MessageChain = pydantic.Field(
        serialization_alias="message_chain"
    )
    """Raw message chain"""

    # ========== Settable Attributes ==========

    user_message_alter: typing.Optional[provider_message.ContentElement] = None
    """Modified message text, langbot_plugin.api.entities.builtin.provider.message.ContentElement type"""

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """Reply message component list, only effective when preventing default behavior"""
```

### *CommandSent

:::warning Note
No longer recommended for use, please use [Component: Command](/en/plugin/dev/components/command) instead.
:::

Triggered when a group chat or private chat command is received.

```python
class PersonCommandSent(BaseEventModel):
    """Triggered when a private chat command that should be processed is determined"""

    event_name: str = "PersonCommandSent"

    launcher_type: str

    launcher_id: typing.Union[int, str]

    sender_id: typing.Union[int, str]

    command: str
    """Command text"""

    params: list[str]
    """Command parameters"""

    text_message: str
    """Message text"""

    is_admin: bool
    """Whether it's an administrator"""


class GroupCommandSent(BaseEventModel):
    """Triggered when a group chat command that should be processed is determined"""

    event_name: str = "GroupCommandSent"

    launcher_type: str

    launcher_id: typing.Union[int, str]

    sender_id: typing.Union[int, str]

    command: str
    """Command text"""

    params: list[str]
    """Command parameters"""

    text_message: str
    """Message text"""

    is_admin: bool
    """Whether it's an administrator"""

```

### NormalMessageResponded

Triggered when a message receives an LLM response.

```python
class NormalMessageResponded(BaseEventModel):
    """Triggered when replying to a normal message"""

    event_name: str = "NormalMessageResponded"

    launcher_type: str

    launcher_id: typing.Union[int, str]

    sender_id: typing.Union[int, str]

    session: provider_session.Session
    """Session object"""

    prefix: str
    """Reply message prefix"""

    response_text: str
    """Reply message text"""

    finish_reason: str
    """Response end reason"""

    funcs_called: list[str]
    """List of called functions"""

    # ========== Settable Attributes ==========

    reply_message_chain: typing.Optional[platform_message.MessageChain] = None
    """Reply message component list, only effective when preventing default behavior"""
```

### PromptPreProcessing

Triggered when building the LLM response context (prompt).

```python
class PromptPreProcessing(BaseEventModel):
    """Triggered when preprocessing prompt in session"""

    event_name: str = "PromptPreProcessing"

    session_name: str

    # ========== Settable Attributes ==========

    default_prompt: list[typing.Union[provider_message.Message, provider_message.MessageChunk]]
    """Scenario preset for this conversation, can be modified, langbot_plugin.api.entities.builtin.provider.message.Message or langbot_plugin.api.entities.builtin.provider.message.MessageChunk type"""

    prompt: list[typing.Union[provider_message.Message, provider_message.MessageChunk]]
    """Existing message records for this conversation, can be modified, langbot_plugin.api.entities.builtin.provider.message.Message or langbot_plugin.api.entities.builtin.provider.message.MessageChunk type"""
```

## Event Context APIs

```python
...
        @self.handler(events.PersonMessageReceived)
        async def handler(event_context: context.EventContext):
            ...
```

Event processing methods will be passed the `EventContext` object, which contains event context information, and the object has both [Request API](/en/plugin/dev/apis/common) and event context specific APIs. The following is a list of event context specific APIs:

### Get Original Event Attributes

`event_context.event` attribute is the original event object, which can get the attributes of the original event. The type is the type of the event being listened to.

For example, when the event being listened to is `GroupMessageReceived`:

```python
event = event_context.event
print(event.launcher_type)  # Launcher object type (group)
print(event.launcher_id)    # Group ID
print(event.sender_id)      # Sender account ID
print(event.message_chain)  # Message chain
```

### Prevent Default Behavior

```python
def prevent_default(self):
    """Prevent default behavior"""

# Usage example
event_context.prevent_default()
```

Calling this method will prevent the default subsequent behavior of this event, and the pipeline will end directly.

:::info
Only the following events can prevent default behavior:

- PersonMessageReceived
- GroupMessageReceived
- PersonNormalMessageReceived
- GroupNormalMessageReceived
- PersonCommandSent
- GroupCommandSent
- NormalMessageResponded

:::

### Prevent Postorder Execution

```python
def prevent_postorder(self):
    """Prevent postorder execution"""

# Usage example
event_context.prevent_postorder()
```

Calling this method will prevent the subsequent plugins from executing this time.
