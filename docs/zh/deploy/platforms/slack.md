# 接入 Slack 机器人

## 创建机器人

前往 [Slack的App平台](https://api.slack.com/apps)。

![Slack平台](/assets/image/zh/deploy/bots/slack/slack_01.jpg)

点击右上角的 `Create New App` ，选择从 `from a manifest` ， 选择要部署机器人的工作区，选择下一步，
选择创建机器人。

进入左侧 `Basic Information` 选项，记录 `signing_secret`。

进入左侧 `OAuth & Permissions` ，往下拉到 `Scopes`，添加如下机器人权限：

![机器人权限1](/assets/image/zh/deploy/bots/slack/slack_02.jpg)


![机器人权限2](/assets/image/zh/deploy/bots/slack/slack_03.jpg)

添加上述权限之后，点击 `Install to your workspace`，记录下开头为 `xoxb-xxxxx`的token。<br>

**注：**
**若没有一次性添加成功权限，后续则需要重新安装App。**<br>

进入左侧 `App Home` 栏，滑到最下面有 `Message Tab`，打开并且勾选
`Allow users to send Slash commands and messages from the messages tab`。

## 对接 LangBot

进入左侧 `Event Subscriptions` ，打开开关，点击 `Subscribe to bot events`，
将如下权限添加进去:
![事件权限](/assets/image/zh/deploy/bots/slack/slack_04.jpg)

上述操作都完成之后，打开 LangBot Webui 配置页面，添加一个新的机器人

![事件权限](/assets/image/zh/deploy/bots/slack/connect_to_langbot.png)

## 启动机器人

::: info
由于 Slack 官方要求使用 https，可以参考[QQ官方机器人部署流程中的Caddy配置部分](/zh/deploy/platforms/qq/official_webhook.md#操作caddy流程)，端口映射到 LangBot 的启动端口。
:::

Slack 配置项在填写完成后，**启动 LangBot**。
启用并打开 LangBot 主页中的 Slack 机器人配置页面，复制其中的 WebHook URL ，然后依照Slack官方的要求，进行 Https 代理，再将代理之后的域名和WebHook URL进行拼接。
然后在刚才Event Subscriptions的 `Request URL`中，填写入拼接的 URL。


上述配置项都填写完成后，点击保存链接，若标识为绿色的**Verified**，那么就说明部署成功。
否则查看上述配置项是否填写正确。

## 效果图

![效果图](/assets/image/zh/deploy/bots/slack/slack_05.jpg)

