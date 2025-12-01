# Using QQ Official Bot API (Using webhook method)

This article only provides the deployment of test bots. For the official launch of bots, please follow the [release process](https://q.qq.com/qqbot/#/home).

## Register QQ Bot (Test Bot)

### Configure Basic Bot Information

Go to the [QQ Open Platform](https://q.qq.com/#/), find `Application Management` at the bottom, click Create Bot, fill in the basic information, and then enter the bot page, as shown:

![Bot Main Page](/assets/image/zh/deploy/bots/qq/official/qqofficial1.png)

The `Release Process` in the `Home` option is the step to launch the bot. Since you are deploying a test version bot, you only need to complete the `Information` and `Sandbox Configuration` sections.<br>

First fill in the information, then click on Sandbox Configuration.

#### Configure Sandbox Settings

Click on `Sandbox Configuration`.
If you want to deploy in a QQ group, follow the requirements under `QQ Group ID` to select a group chat, and add users with private chat permissions in the message list configuration.<br>
If you want to deploy in a QQ channel, follow the requirements under `Channel ID` to select a channel ID, with bot type 0.

#### Configure Development Management

Click on `Development Management`.

![Development Management Page](/assets/image/zh/deploy/bots/qq/official/qqofficial2.png)

Record the `AppID`, `Token`, and `AppSecret`, and add the IP address of the server where LangBot is located to the IP whitelist.

## Connect to LangBot

Next, open the LangBot configuration page

Click on Bots, then click Add

Select `QQ Official API` for `Platform/Adapter Selection`

![QQ Official Bot Integration with LangBot](/assets/image/zh/deploy/bots/qq/official/qqofficial3.png)


## Configure Callback Address

Since QQ official bots require the callback address to be an https request, but LangBot only provides http, you need to configure a reverse proxy yourself.

This article recommends using [Caddy](https://caddy2.dengxiaolong.com/docs/) for reverse proxy, with the process as follows.

### Caddy Operation Process

#### Install Caddy

Go to the [Caddy Installation Documentation](https://caddy2.dengxiaolong.com/docs/install). Choose the installation steps for your operating system and install.

#### Fill in Caddyfile

This article assumes that LangBot is deployed on an Ubuntu system, where the default location of Caddyfile is `/etc/caddy/Caddyfile`.
Use vim or nano to edit Caddyfile, and fill in the Caddyfile as:
```json
your_domain_name {
        reverse_proxy 127.0.0.1:2284
}
```
For example, if you have a domain testlb.com that resolves to your machine, and you have port **443** open, fill in:
```json
testlb.com {
        reverse_proxy 127.0.0.1:2284
}
```

Save and exit the file.

**Note, the Caddyfile format is very strict, please fill it in correctly. If you encounter problems, please refer to the Caddy documentation or ask AI.**

#### Start Caddy
Enter the command
```bash
sudo systemctl start caddy
```

After successful startup, check the Caddy status with:
```bash
sudo systemctl status caddy
```


#### Subsequent Configuration

If Caddy fails to start, please read the [Caddy documentation](https://caddy2.dengxiaolong.com/docs/quick-starts/caddyfile) or join the LangBot community group for help.<br>

Here are some possible issues:

- Port 443 is not open
- The domain is not resolved to your machine
- Caddyfile was not saved successfully

### Set Management Portal Callback Address


First **start LangBot**.

Click on `Callback Configuration` in the bot management portal, check all events under `Add Event`. In the request address, enter the domain set in Caddyfile, with the suffix `/callback/command`.

For example, if the domain is `testlb.com`, then enter `testlb.com/callback/command` in the request address, and click to confirm the configuration. If the callback address is saved successfully, it means the deployment is successful. If you see `Verification Failed`, please carefully check if the above configuration items are filled in correctly.

## Publication Method

Enter the release process in `Home` and follow the process to publish and launch the bot.
