# Deploy WeCom Bot

Deploy WeCom (Enterprise WeChat) bot to connect with LangBot.

:::info
This integration method is for internal enterprise applications, used within the enterprise. If you need external customer service, please check the [WeCom Customer Service integration solution](wecomcs.md).
:::


## Create Bot

Enter the [WeCom Admin Portal](https://work.weixin.qq.com/), log in to your account, after entering the main page, click `App Management`, `Build Your Own`, `Create App`, fill in the basic information of the bot, after creation, you will see a page similar to this:
![Bot Page](/assets/image/zh/deploy/bots/wecom/wecom/wecom1.png)

## Set Callback Address

### Get WeCom Configuration Items

1. Open the WeCom Admin Portal homepage, click `My Enterprise`, and record the Enterprise ID at the bottom.

![Enterprise ID](/assets/image/zh/deploy/bots/wecom/wecom/wecom2.png)

2. Enable Contact Sync Permission

:::info
- This configuration item is for implementing LangBot's mass messaging feature, the specific code is located in libs/wecom_api/api.py.
- LangBot is still under development, so the functionality related to this configuration item has not been implemented yet.
- This configuration item can be filled with random characters, but **cannot be empty**.
:::

![Contact Permission](/assets/image/zh/deploy/bots/wecom/wecom/wecom5.png)

Click `Security and Management`, `Management Tools`, `Contact Sync`

![Contact Sync Secret](/assets/image/zh/deploy/bots/wecom/wecom/wecom3.jpg)

Click `View Secret`, record it, this is the contacts_secret (Contact Sync Secret).

3. Click `App Management`, find the bot you just created, view the bot's secret, and record it.

![Bot Secret](/assets/image/zh/deploy/bots/wecom/wecom/wecom4.png)

At this point, you have obtained three configuration items: corpid (Enterprise ID), secret (Bot Secret), and contacts_secret (Contact Sync Secret).

### Configure Callback Address

Enter the bot page.

Click `Enterprise Trusted IP` at the bottom and add the server where LangBot is deployed.

Click `Receive Messages`, `Set API Reception`, and start filling in the server message reception configuration.

On the LangBot homepage, enable and select the corresponding bot, click to enter the configuration page, copy the Webhook callback address, and fill it into the URL.

::: info
We recommend that you first refer to [Configure HTTP Reverse Proxy](/en/workshop/production/proxy-and-ssl) to configure the LangBot callback address.
:::

![Webhook Callback Address](/assets/image/zh/deploy/bots/wecom/wecom/wecom6.png)

Click to randomly generate the Token and EncodingAESKey, and record them

## Connect to LangBot

![Connect to LangBot](/assets/image/zh/deploy/bots/wecom/wecom/connect_to_langbot.png)

## Save Callback Address
When the five configuration items above have been correctly obtained and accurately filled into the WeCom adapter, then **start LangBot**.

Return to the callback address configuration page and click save. If the above configuration items are filled in correctly, the save will be successful, which means that WeCom and LangBot can communicate (deployment successful). If you see **openapi request callback address failed**, please triple-check that your configuration items are filled in correctly.
