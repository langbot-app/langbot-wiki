# Connect to Feishu Bot

## Create Bot

Go to the [Feishu Open Platform](https://open.feishu.cn/app), log in, and create an enterprise self-built application or store application. [(difference introduction)](https://open.feishu.cn/document/platform-overveiw/overview)

![alt text](/assets/image/zh/deploy/bots/lark/lark_01.png)

![alt text](/assets/image/zh/deploy/bots/lark/lark_02.png)

Add bot capability to the application:
![alt text](/assets/image/zh/deploy/bots/lark/lark_03.png)

Add the permissions shown in the image in the permission management:

![alt text](/assets/image/zh/deploy/bots/lark/lark_04.png)

If card streaming permissions are required, additionally add the following card creation and update permissions as shown in the image:

![img_1.png](../../../assets/image/zh/deploy/bots/lark/lark_14.png)

## Connect to LangBot

Find `app_id` and `app_secret` on the `Credentials and Basic Information` page.

![alt text](/assets/image/zh/deploy/bots/lark/lark_05.png)



Open LangBot's Webui configuration page, create a new bot

Fill in the relevant information in the form

![alt text](/assets/image/zh/deploy/bots/lark/connect_to_langbot.png)

Streaming related:
![Streaming related](../../../assets/image/zh/deploy/bots/lark/connect_to_langbot01.png)

After filling in, start LangBot. If configured successfully, the log will show `[01-29 23:42:56.796] manager.py (68) - [INFO] : Initializing platform adapter 1: lark`, keep LangBot running.

:::warning
By default, WebSocket long connection mode is used, corresponding to the long connection subscription below. But in some cases (such as international version of Feishu), long connection mode is not available, in which case you need to use Webhook mode, corresponding to the `Send events to developer server` mode, please refer to the following configuration:

- `enable-webhook`: Set to `true`
- `encrypt-key`: Set to `Encrypt Key` in the `Encryption Strategy` of the `Events and Callbacks` page

Note that in Webhook mode, LangBot needs to be deployed on a server with a public IP, and ensure that the firewall has opened the port configured above.
:::

## Configure Event Subscription

Go to the `Events and Callbacks` page, configure the subscription method as `Long Connection`:

![alt text](/assets/image/zh/deploy/bots/lark/lark_07.png)

And add the event: `Receive Messages`

![alt text](/assets/image/zh/deploy/bots/lark/lark_08.png)

:::warning
Webhook mode configuration method:

![alt text](/assets/image/zh/deploy/bots/lark/lark_13.png)

Please start LangBot first, fill in your server address and port here, the path is `/lark/callback`, click `Save`.

:::

## Publish Bot

Click `Create Version` at the top, fill in the version number and other information, click `Save` below.

![alt text](/assets/image/zh/deploy/bots/lark/lark_09.png)

Add the bot to a Feishu group to use it:

![alt text](/assets/image/zh/deploy/bots/lark/lark_10.png)

![alt text](/assets/image/zh/deploy/bots/lark/lark_11.png)

Private chat can also be used directly

![alt text](/assets/image/zh/deploy/bots/lark/lark_12.png)

## Common Issues
- Store app bots cannot respond to chat messages immediately after creation/saving. Due to the [app_ticket event](https://open.feishu.cn/document/server-docs/application-v6/event/app_ticket-events) delay mechanism, you need to wait about 2 minutes before it can work normally.