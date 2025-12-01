# Deploy WeCom Customer Service

:::info

This article details the process of deploying LangBot to a WeCom customer service account, which allows conversations between the customer service account and regular WeChat. If you only need to use it within WeCom, please refer to [WeCom Internal Application Implementation](wecom.md).

**Deploying a WeCom customer service account requires enterprise qualifications**. Please check the [WeCom Customer Service Integration Guide](https://developer.work.weixin.qq.com/document/path/94638) and provide the corresponding enterprise qualification certificates according to this document.

:::

## Effect Demonstration

![Effect Demonstration](/assets/image/zh/deploy/bots/wecom/wecomcs/wecomcs_01.jpg)

## Connect to LangBot

![Connect to LangBot](/assets/image/zh/deploy/bots/wecom/wecomcs/connect_to_langbot.png)

The subsequent configuration method and configuration items are the same as [WeCom Internal Application](wecom.md), except that `contacts_secret` is not required.

## Notes

1. Be sure to follow the steps in the official WeCom documentation above and add the customer service account to `API Management`.
2. The steps are the same as for WeCom internal applications, don't miss anything. You also need to save the callback address, because essentially it's just adding other permissions to the WeCom internal application.
3. LangBot will not read sensitive information such as chat records and enterprise qualification content.
