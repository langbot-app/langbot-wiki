# Integrating KOOK Bot

## Create a Bot

Visit the [KOOK Developer Center](https://developer.kookapp.cn/), log in and access the console.

![KOOK Developer Console](/assets/image/zh/deploy/bots/kook/01-dashboard.png)

Click "Create Application" and fill in the application information.

![Create Application](/assets/image/zh/deploy/bots/kook/02-create-app.png)

After the application is created, enter the application details page.

![Application Created](/assets/image/zh/deploy/bots/kook/03-app-created.png)

You can view the basic information of the application on the application overview page.

![Application Overview](/assets/image/zh/deploy/bots/kook/04-app-overview.png)

## Get Bot Token

In the application page, click the "Bot" tab, copy the Bot Token and save it securely. You will need it later.

![Get Bot Token](/assets/image/zh/deploy/bots/kook/05-bot-token.png)

## Configure Bot Permissions

**Important:** In the "Bot" settings, find the "Message Filtering" option and click to configure.

![Message Filter Settings](/assets/image/zh/deploy/bots/kook/07-message-filters.png)

Enable all message-related event permissions, including channel messages and private message events. Otherwise, the bot will not be able to receive messages.

![Enable Permissions](/assets/image/zh/deploy/bots/kook/08-permissions-enabled.png)

## Invite the Bot

In the bot settings page, you can generate an invitation link to invite the bot to your server.

![Generate Invitation Link](/assets/image/zh/deploy/bots/kook/06-invite-link.png)

## Connect to LangBot

Open the LangBot Webui page, and click to create a new bot on the "Bots" page.

![LangBot Bot Management](/assets/image/zh/deploy/bots/kook/09-langbot-bots.png)

Select the KOOK platform, fill in the bot name and Bot Token.

![Configure KOOK Bot](/assets/image/zh/deploy/bots/kook/10-bot-config.png)

After saving, the bot will appear in the list.

![Bot Created](/assets/image/zh/deploy/bots/kook/11-bot-created.png)

Click the enable button to start the bot. If successfully configured, the bot status will show as running.

![Bot Enabled](/assets/image/zh/deploy/bots/kook/12-bot-enabled.png)

## Using the Bot

Now in the KOOK server, the bot can receive and reply to messages normally. The bot supports both channel messages and private messages.
