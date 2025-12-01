# 部署微信公众号机器人

部署微信公众号机器人接入 LangBot 。

## LangBot 微信公众号接入模式

目前，LangBot 提供两种方式接入微信公众号：

1. **传统收发消息模式**  
   - 公众号要求请求必须在 **15 秒内** 处理完成，超时的 AI 生成内容将无法发送。
   - 当 AI 生成内容超时发生后，LangBot 会在控制台打印请求超时信息。

2. **“发送任意文字回复消息”模式**  
   - 该方法可突破 **15 秒** 限制，但 **过长的文本** 可能无法成功发送。
   - 使用此方法时，给公众号发消息，公众号会回复“AI正在思考中，请发送任意内容获取回答”，此时，需要发送任意内容获取回答。

如需更复杂的功能，请联系 **LangBot 团队** 进行定制化支持。

## 创建机器人

进入[微信公众平台](https://mp.weixin.qq.com/)，如果已经有公众号账号，那么直接扫码登录，进入控制台。
如果之前没有注册过公众号，那么点击立即注册，选择 `公众号`，依次填写信息，进入控制台。控制台是这样的：
![控制台页面](/assets/image/zh/deploy/bots/wxoa/wxoa1.png)


## 设置回调地址

### 获取配置项 

点击`设置与开发`，`开发接口管理`，出现这样的页面：
![设置开发项](/assets/image/zh/deploy/bots/wxoa/wxoa2.png)

记录下来`开发者ID（AppID）`，`开发者密码（AppSecret）`，并将部署 LangBot 的服务器添加入`IP白名单`。

### 为 LangBot 设置反向代理

由于微信公众号的只支持http（80端口），https（443端口），请根据文档[配置 HTTP 反向代理和 SSL](/zh/workshop/production/proxy-and-ssl) 操作。

### 保存回调地址

点击设置服务器配置，输入`Token`，`EncodingAESKey`，并将消息加解密方式改为`安全模式`。

至此，打开 LangBot Webui 页面，创建一个新的机器人，将获取到的四个配置项( AppID , AppSecret , token , EncodingAESKey )填入

![设置开发项](/assets/image/zh/deploy/bots/wxoa/connect_to_langbot.png)

在配置项中，`Mode`选项为选择的接入模式，其中默认为`drop`，`drop` 为传统收发消息模式，`passive` 为发送任意文字获取回复模式。

`LoadingMessage`选项为加载信息，可以更改为其他内容，仅在模式为`passive`下有效。将 `enable` 设置为 `true` 。

填写成功后，在 LangBot 主页中，启用并选择对应的机器人，点击进入配置页面，复制其中的 Webhook 回调地址，返回微信公众号机器人配置页面，填写到`URL`。比如 URL 填写为`https://your_domain_name/bots/xxxxx`，其中的 `your_domain_name` 就是 Caddy 中填写的域名。点击保存。如果可以保存成功，那么意味着部署成功。如果出现**系统发生错误，请稍后重试**，那么请重新检查以上配置内容是否填写正确。

