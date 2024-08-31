# Claude 部署常见问题

## 我的前端界面几乎显示不了，是空白的

1. 请检查你的邮箱是否为正确的邮箱（含大小写区别）

## 更新后，我似乎没有更新

1. 对于宝塔用户，请运行：

```bash
rm -rf /www/server/nginx/proxy_*
```

然后重启你的 Nginx 服务

2. 对于 1Panel 用户，请尝试直接重启服务器

## 我应该怎么移动我的数据

数据都备份在 /data 文件夹下，下次在新服务器启动建议直接打包文件夹移动过去，然后输入 `docker-compose up -d`

## 为什么我的账号会显示翻车

:::tip
请注意，Claude Gateway 支持自动刷新 SessionKey
:::

这可能是因为网络波动的原因造成的，部署程序会在 24h 后自动判断账号的可用性，如果一个账号长期翻车，那么就是真的被官网封了。

## 如何添加账号

share添加账号的三种方式：
1. ck添加：输入账号，密码，并在session填写sessionKey，所有账号都可以这么做
2～3需要你提供 Yes Captcha 的打码密钥，可通过 [YesCaptcha](https://yescaptcha.com/i/VNJzq7) 注册
2. 输入邮箱账号，密码随意，session为空，可以直接向指定邮箱发送登录链接，形式是 https://claude.ai/magic-link#xxxxx ，你把这个链接填入 session 栏，可自动登录
3. 输入 outlook 或者 hotmail 的邮箱，且填写邮箱密码。claude share server 可以自动通过邮箱账号密码获取 sessionKey。

