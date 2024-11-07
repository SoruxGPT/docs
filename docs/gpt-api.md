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