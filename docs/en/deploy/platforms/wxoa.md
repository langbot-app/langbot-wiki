# Deploy WeChat Official Account Bot

Deploy WeChat Official Account bot to connect with LangBot.

## LangBot WeChat Official Account Integration Modes

Currently, LangBot provides two ways to integrate with WeChat Official Accounts:

1. **Traditional Message Exchange Mode**  
   - Official accounts require requests to be processed within **15 seconds**, AI-generated content that exceeds this timeout cannot be sent.
   - When AI content generation timeout occurs, LangBot will print request timeout information in the console.

2. **"Send Any Text to Get Reply" Mode**  
   - This method can break the **15 second** limit, but **very long text** may not be sent successfully.
   - When using this method, after sending a message to the official account, it will reply "AI is thinking, please send any content to get the answer". At this point, you need to send any content to get the answer.

For more complex functionality, please contact the **LangBot team** for customized support.

## Create Bot

Enter the [WeChat Official Account Platform](https://mp.weixin.qq.com/), if you already have an official account, scan the QR code to log in and enter the console.
If you haven't registered an official account before, click Register Now, select `Official Account`, fill in the information in sequence, and enter the console. The console looks like this:
![Console Page](/assets/image/zh/deploy/bots/wxoa/wxoa1.png)


## Set Callback Address

### Get Configuration Items 

Click `Settings and Development`, `Development Interface Management`, and you'll see a page like this:
![Set Development Items](/assets/image/zh/deploy/bots/wxoa/wxoa2.png)

Record the `Developer ID (AppID)`, `Developer Password (AppSecret)`, and add the server where LangBot is deployed to the `IP Whitelist`.

### Set Up Reverse Proxy

Since WeChat Official Accounts only support http (port 80) and https (port 443), this article assumes that port 80 is already occupied and uses port 443 to reverse proxy to LangBot.

The specific reverse proxy configuration tutorial is the same as the [QQ Official Bot Reverse Proxy Configuration](/en/deploy/platforms/qq/official_webhook.md#caddy-operation-process), except that `reverse_proxy 127.0.0.1:2284` is changed to `reverse_proxy 127.0.0.1:2287`.

### Save Callback Address

Click Set Server Configuration, enter `Token`, `EncodingAESKey`, and change the message encryption/decryption method to `Safe Mode`.

At this point, open the LangBot Webui page, create a new bot, and fill in the four configuration items obtained (AppID, AppSecret, token, EncodingAESKey)

![Set Development Items](/assets/image/zh/deploy/bots/wxoa/connect_to_langbot.png)

In the configuration items, the `Mode` option is the selected integration mode, where the default is `drop`. `drop` is the traditional message exchange mode, and `passive` is the "send any text to get reply" mode.

The `LoadingMessage` option is the loading message, which can be changed to other content, and is only valid when the mode is `passive`. Set `enable` to `true`.

After filling in successfully, **start LangBot**.
On the LangBot homepage, enable and select the corresponding bot, click to enter the configuration page, copy the Webhook callback address, return to the WeChat Official Account bot configuration page, and fill it into `URL`. For example, if the URL is filled as `https://your_domain_name/bots/xxxxx`, where `your_domain_name` is the domain name filled in Caddy. Click Save. If it can be saved successfully, it means the deployment is successful. If you see **System error, please try again later**, please recheck whether the above configuration content is filled in correctly.
