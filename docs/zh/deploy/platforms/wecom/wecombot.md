# 部署企业微信智能机器人


## 创建机器人

首先登录[企业微信管理后台](https://work.weixin.qq.com/wework_admin/frame#/)。

![主页](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_1.png)

点击左边栏的`安全与管理`，点击`管理工具`里面的`智能机器人`。

如图:

![智能机器人](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_2.png)

点击`创建机器人`，拉至页面最底部，点击`API模式创建`，进入页面：

![API模式创建](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_3.png)

点击随机获取 Token 和 EncodingAESKey，然后填写上方的机器人基本信息，**注意设置可见范围**。

点击左边栏的`我的企业`，保存最下方的企业ID。

## 配置回调地址

启动 LangBot 主程序，适配器选择 `企业微信智能机器人`，填写配置项，
其中，令牌为 Token，消息加解密密钥为 EncodingAESKey，机器人ID填写入xxx（或者随便填写，后续会改），填写之后点击
`保存`，并`启用`机器人。

![企业微信智能机器人适配器](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_4.png)

在 LangBot 主页中，启用并选择对应的机器人，点击进入配置页面，复制其中的 Webhook 回调地址

![Webhook 回调地址](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_8.png)

返回企业微信机器人配置页面将复制的webhook地址填写到`URL回调`中。若创建成功，则会跳转至详情页面，若出现`请求URL失败`字样，请再三检查上述操作是否一一完成。

创建成功之后的详情页：
![创建成功](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_5.png)

复制企业微信机器人详情页的`Bot ID`，回到LangBot管理页面，将部署的智能机器人的机器人Id改为复制的ID，重新启动机器人。

## 开始使用

进入企业微信，点击 `➕`,如图：

![添加机器人](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_6.png)

点击`企业创建的`,选择创建的机器人，进入聊天界面。

同理，若想邀请机器人进入群聊，那么点击群聊的添加人员，在其中添加机器人。

## 效果图

![效果图1](/assets/image/zh/deploy/bots/wecom/wecombot/wecombot_7.png)




