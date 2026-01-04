# WeCom ボットのデプロイ

WeCom（企業微信）ボットをデプロイして LangBot に接続します。

:::info
- この統合方法は、企業内部アプリケーション用であり、企業内で使用されます。外部カスタマーサービスが必要な場合は、[WeCom Customer Service 統合ソリューション](wecomcs.md)を確認してください。
- WeCom コールバックアドレスにはパブリック IP とドメイン名が必要です。まず [HTTP リバースプロキシの設定](/ja/workshop/production/proxy-and-ssl)を参照して LangBot コールバックアドレスを設定することをお勧めします。
:::

## 企業 ID の記録

[WeCom 管理ポータル](https://work.weixin.qq.com/)を開き、`私の企業`をクリックして、一番下の`企業 ID`を記録します。

![Corp ID](/assets/image/zh/deploy/bots/wecom/wecom/03-corp-id.png)

## ボットの作成

`アプリ管理`、`自社開発`、`アプリを作成`をクリックします。

![App Management](/assets/image/zh/deploy/bots/wecom/wecom/01-wecom-apps.png)

ボットの基本情報を入力します:

![Create Application](/assets/image/zh/deploy/bots/wecom/wecom/02-create-app.png)

ボットのシークレット（Secret）を確認して記録します:

![Bot Secret](/assets/image/zh/deploy/bots/wecom/wecom/04-bot-secret.png)

WeCom クライアントからプロンプトに従って取得します。

## 連絡先同期権限の有効化

:::info
- この設定項目は、LangBot の一斉送信機能を実装するためのものです。具体的なコードは libs/wecom_api/api.py にあります。
- LangBot はまだ開発中であるため、この設定項目に関連する機能はまだ実装されていません。
- この設定項目はランダムな文字で埋めることができますが、**空にすることはできません**。
:::

`セキュリティと管理`、`管理ツール`、`連絡先同期`をクリックします。まず信頼できる IP を設定し、LangBot がデプロイされているサーバーの IP を追加します。

`Secret を表示`をクリックして記録します。これが contacts_secret（連絡先同期 Secret）です。

![Contact Sync Secret](/assets/image/zh/deploy/bots/wecom/wecom/08-contact-secret.png)

## LangBot でボットを作成

LangBot のボットページで、`ボットを作成`をクリックし、名前を入力し、`企業微信`を選択します。このステップでは、企業 ID、ボットシークレット、連絡先同期 Secret のみを入力する必要があります。

![Create WeCom Bot](/assets/image/zh/deploy/bots/wecom/wecom/05-fill-in-corpid-secret.png)

送信をクリックして、ボット編集ページにジャンプし、有効化をクリックします。この時点で Webhook コールバックアドレスが表示されるので、コピーします:

![Webhook Callback Address](/assets/image/zh/deploy/bots/wecom/wecom/06-webhook-callback-address.png)

## コールバックアドレスの設定

WeCom のボット管理ページに戻り、`メッセージを受信`、`API 受信を設定`をクリックし、LangBot の Webhook コールバックアドレスを`URL`に入力します:

![Set API Receiver](/assets/image/zh/deploy/bots/wecom/wecom/07-set-api-receiver.png)

Token と EncodingAESKey の`ランダム生成`をクリックして記録し、**このページを開いたままにします**。LangBot の WeCom ボット設定ページに戻り、Token と EncodingAESKey を入力して、保存をクリックします。

![Save WeCom Bot](/assets/image/zh/deploy/bots/wecom/wecom/09-save-wecom-bot.png)

**先ほど Webhook コールバックアドレスを入力したページ**に戻り、保存をクリックして設定を完了します。**リクエスト URL 失敗**が表示された場合は、設定項目が正しく入力されているか再度確認してください。

## アプリの企業信頼 IP の設定

このアプリの管理ページに戻り、下部の`企業信頼 IP`を見つけ、LangBot がデプロイされているサーバーの IP を追加します。

![Corp Trusted IP](/assets/image/zh/deploy/bots/wecom/wecom/10-corp-trusted-ip.png)

保存をクリックして完了です。

## よくある質問

Q: WeCom でボットのチャットが見つかりませんか?
A: WeCom 管理ページのこのアプリの詳細ページに移動し、`機能`->`メッセージを送信`->`メッセージを送信`をクリックし、自分のアカウントを選択してメッセージを送信すると、自分のチャットウィンドウでボットが表示されます。
