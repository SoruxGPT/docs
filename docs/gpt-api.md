# SoruxGPT SaaS API 支持

SoruxGPT SaaS 是一款 SaaS 平台，提供 SoruxGPT 最新研制的 Next 应用级程序，具有开箱即用，立即托管的功能。

:::tip
SoruxGPT SaaS 支持无感迁移所有其他镜像系统的用户数据，让你开箱即用的使用 SoruxGPT SaaS，并兼容已有的软件生态。
:::


:::tip
所有请求均需要携带 adminapi 的 Header，值为管理员下发给你的值。
特别的，如果你使用的是 SoruxGPT Proxy 渠道商服务，无需考虑本 API，您的分区管理员会为您操作。
:::


## 加号 <Badge type="tip" text="POST" />
:::tip
SoruxGPT Next 支持 API 形式加号，支持 rc, rk, rt, at, app 模式的加号
:::

向 /adminapi/addAccount 发送 POST 请求，请求体（form-data）为：

```
account: 账号
password: 密码
refresh_token: 可选
access_token: 可选
refresh_cookies: 可选
```

## 获取账号情况 <Badge type="tip" text="POST" />
:::tip
SoruxGPT Next 支持 API 形式加号，支持 rc, rk, rt, at, app 模式的加号
:::

向 /adminapi/stateAccount 发送 POST 请求

## Audit 接口 <Badge type="tip" text="POST" />
:::tip
SoruxGPT Next 支持 Audit 用户审计
:::

请求内容：
1. Header 携带 Authorization 字段，格式为 `Bearer xxx`, xxx 为用户 Token
2. POST 请求体为 Json，内容为用户提问的请求体
3. Header 携带 queries 字段，表示倍率计费

返回内容：
1. 状态码 200 表示正常
2. 状态码非 200 表示异常，并且把返回 Json 的 detail.message 字段作为错误信息展示给前端

:::tip
在语音提问的场景下，如果携带了 queries，表示用户一次性对话了多少条。例如，如果这个值为 queries = 2，那么你需要计费 2 次
:::

## OAuth 接口 <Badge type="tip" text="POST" />
:::tip
SoruxGPT Next 支持 Audit 用户审计
:::

请求内容：
1. Form-Data 格式请求，传递 usertoken 信息

返回 Json 格式的回复，你需要包含以下属性：
1. code: 1 表示成功，0 表示失败。
2. 【可选】avatar：头像地址，应为一个 url 绝对地址
3. 【可选】email：邮箱地址，如果不填默认为 default-user@gmail.com
4. 【可选】nickname：昵称，如果不填默认为 default-user
5. 【可选】uid：用户 ID，如果不填默认为 1

:::tip
可选信息不给，不会发生任何错误。
:::