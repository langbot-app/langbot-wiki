# 部署企业微信客服

:::info

本文详细讲述 LangBot 部署到企业微信客服号的过程，此功能可以将客服号与普通微信进行对话。若只需要在企业微信内部使用，请参考[企业微信内部应用实现](wecom.md)。

**部署企业微信客服号需要企业资质**，具体查看[企业微信客服号接入指南](https://developer.work.weixin.qq.com/document/path/94638)，并且根据此文档提供对应的企业资质证明。

:::

## 效果图

![效果图](/assets/image/zh/deploy/bots/wecom/wecomcs/wecomcs_01.jpg)

## 对接 LangBot

![对接 LangBot](/assets/image/zh/deploy/bots/wecom/wecomcs/connect_to_langbot.png)

后续的配置方式和配置项和[企业微信内部应用](wecom.md)一样，只是不需要 `contacts_secret`。

## 注意事项

1. 一定要按照上文的企业微信官方文档步骤走，将客服账号添加入 `api 管理`中。
2. 步骤与企业微信内部应用一样，不要漏看，同样需要保存回调地址，因为本质上只是在企业微信内部应用上增加了其他的权限。
3. LangBot 不会读取敏感信息如聊天记录和企业资质内容。

