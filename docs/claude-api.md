# 镜像 API 支持

## OAUTH <Badge type="tip" text="POST" />
:::tip
本 API 用于首页用户登录
:::

向指定地址发送 POST 请求，请求体为：

```bash
userToken: xxx
```

返回 200 表示鉴权成功，返回以下内容表示鉴权失败：

```http
Non 200 Code

{
    "detail": "xxx"
}
```

## AUDIT_LIMIT_URL <Badge type="tip" text="POST" />
:::tip
本 API 用户鉴权和审计
:::

向指定地址发送 POST 请求，请求体为 ChatGPT 聊天格式的 API：

返回 200 表示鉴权成功，返回以下内容表示鉴权失败：

```http
Non 200 Code

{
    "error": {
        "message": "xxx"
    }
}
```

## NOTIFY_URL <Badge type="tip" text="POST" />
:::tip
本 API 表示对话成功，用于计数
:::

向指定地址发送 POST 请求，表示对话完成，格式同 AUDIT_LIMIT_URL

# 网关 API 支持

均需要携带 Cookie: sessionKey=xxx 和 authkey 的 Header

## /check <Badge type="tip" text="GET" />

判断账号是否还活着

## /claudeAccount/sendMagicLink <Badge type="tip" text="POST" />

向指定地址发送登录链接

```json
{
    "captchaType": "yescaptcha",
    "captchaToken": "", // 密钥
    "email":""
}
```

## /claudeAccount/getsession <Badge type="tip" text="POST" />

向指定地址登录

```json
{
    "captchaType": "yescaptcha",
    "captchaToken": "", // 密钥
    "username":"", // 邮箱
    "password": "", // (可选)填写密码，使用邮箱直接登录，仅支持 Outlook 和 HotMail
    "magicLink": "", // (可选)填写链接，使用链接直接登录
    "code":"" // (可选)填写验证码，使用验证码直接登录
}
```