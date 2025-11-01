# 授权说明

在使用本教程之前，请先联系邮箱：epicmocn@gmail.com 购买授权码

# 部署支持

本教程在 Ubuntu 22.04 中提供演示。

## 基于 Docker-Compose 的部署编排

1. 克隆 [SoruxGPT SaaS Connect](https://github.com/liaosunny123/SoruxGPT-SaaS-Connect) 仓库

2. 编辑 docker-compose.yml 文件，参考以下的说明：

- LICENSE_KEY：授权密码，形如 ABCD-EFGH-IJKL-MNOP 的密钥串，需要报备 IP 和反代域名.
- JWT_SECRET: 请修改成随意的字符串

3. 执行命令 `docker-compose up -d` 运行程序。

## 基于 Kubernetes 的部署编排

:::tip
待完工....
:::