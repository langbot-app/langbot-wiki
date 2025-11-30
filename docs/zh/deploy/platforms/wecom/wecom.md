# 部署企业微信机器人

部署企业微信机器人接入 LangBot 。

:::info
此种接入方式为企业内部自建应用，是在企业内部使用的，若需要对外接待，请查看[企业微信客服接入方案](wecomcs.md)。
:::


## 创建机器人

进入[企业微信管理后台](https://work.weixin.qq.com/)，登陆账号，进入主页面后，点击` 应用管理 `,` 自建 `,` 创建应用 `,填写机器人基本信息，创建好之后，会出现类似这样的界面：
![机器人页面](/assets/image/zh/deploy/bots/wecom/wecom/wecom1.png)

## 设置回调地址

### 获取企业微信配置项

1. 打开企业微信管理后台主页，点击`我的企业`，记录下最下面的企业ID。

![企业ID](/assets/image/zh/deploy/bots/wecom/wecom/wecom2.png)

2. 开启通讯录同步权限

:::info
- 此配置项是为了实现 LangBot 的群发消息，具体代码位于libs/wecom_api/api.py 。
- 目前 LangBot 仍在开发，所以未实现此配置项的相关功能。
- 此配置项可以填写入随机字符，**不能为空**。
:::

![通讯录权限](/assets/image/zh/deploy/bots/wecom/wecom/wecom5.png)

点击`安全与管理`,`管理工具`,`通讯录同步`

![通讯录同步secret](/assets/image/zh/deploy/bots/wecom/wecom/wecom3.jpg)

点击`查看secret`，记录下来，这是 contacts_secret（通讯录同步 secret）。

3. 点击`应用管理`，找到刚才创建的机器人，查看机器人的 secret ,记录下来。

![机器人secret](/assets/image/zh/deploy/bots/wecom/wecom/wecom4.png)

至此，已经获得了三个配置项，分别是 corpid（企业ID），secret（机器人 secret），contacts_secret（通讯录同步 secret）。

### 配置回调地址

进入机器人页面。

点击最下方的`企业可信IP`，将部署 LangBot 的服务器添加进去。

点击` 接收消息 `，` 设置API接收 `，开始填写接收服务器消息配置。

在 LangBot 主页中，启用并选择对应的机器人，点击进入配置页面，复制其中的 Webhook 回调地址，填写到 URL 中。
![Webhook 回调地址](/assets/image/zh/deploy/bots/wecom/wecom/wecom6.png)

Token 和 EncodingAESKey 点击随机获取，并记录下来

## 对接 LangBot

![对接 LangBot](/assets/image/zh/deploy/bots/wecom/wecom/connect_to_langbot.png)

## 保存回调地址
当前面五个配置项已经正确获取，并且准确的填入到企业微信适配器中，那么**启动 LangBot**。

回到配置回调地址页面并且点击保存，如果以上的配置项填写正确，那么可以保存成功，这意味着企业微信和 LangBot 可以进行通信（部署成功），如果出现**openapi 请求回调地址不通过**，请再三检查你的配置项填写是否正确。











