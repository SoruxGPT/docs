# 授权说明

在使用本教程之前，请先联系微信：xosoder 购买 Claude 网关和程序服务。  

# 部署支持

本教程在 Ubuntu 22.04 中提供演示。

## 基于 Docker-Compose 的部署编排

1. 克隆 [Claude Share Server](https://github.com/SoruxGPT/soruxgpt-claude-share-deploy) 仓库

2. 编辑 docker-compose.yml 文件，参考以下的说明：

- CHATPROXY：网关地址，形如 https://xxx.soruxgpt.com 的网关地址
- AUTHKEY: 网关鉴权密钥
- PORT: 端口号
- OAUTH_URL: 登录鉴权地址（当登录时，若含有此项，则会POST此地址）
- AUDIT_LIMIT_URL: 鉴权地址（当对话时，会POST此地址）
- MY_SELF: 反代域名
- APIAUTH: API 调用密钥
- NOTIFY_URL: 通知地址，当成功完成一次对话时，会主动通知此地址
- ROAM_CONVERSATION: true/false 是否开启漫游
- LOG_OUT_AS_GO_TO_LIST: true/false 是否将左下角退出直接跳转到选车页面（即无需清空Session）
- SUIT_FOR_SHARE_IN_SESSION: 是否使用默认 SESSION，以兼容其他项目
- YES_CAPTCHA: 打码密钥，可通过 [YesCaptcha](https://yescaptcha.com/i/VNJzq7) 注册

3. 执行命令 `docker-compose up -d` 运行程序。

## 基于 Kubernetes 的部署编排

:::tip
待完工....
:::