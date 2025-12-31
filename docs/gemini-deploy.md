# SoruxGemini Share 部署指南

## 授权说明

在使用本教程之前，请先联系邮箱：epicmocn@gmail.com 购买 Gemini 网关和程序服务。

## 部署支持

本教程在 Ubuntu 22.04 中提供演示。

### 基于 Docker-Compose 的部署编排

1. 克隆 [Gemini Share Server](https://github.com/SoruxGPT/SoruxGemini) 仓库

2. 编辑 `docker-compose.yml` 文件，参考以下的说明：

| 环境变量 | 说明 | 示例 |
|---------|------|------|
| `GATEWAY` | 网关地址 | `https://xxx.soruxgpt.com` |
| `GATEWAY_KEY` | 网关鉴权密钥 | - |
| `PORT` | 端口号 | `9000` |
| `ADMIN_API_LOGIN_INIT_KEY` | 管理后台初始密码 | `your-admin-password` |
| `REDIS_ENABLE` | 是否启用 Redis | `true` / `false` |
| `REDIS_HOST` | Redis 地址 | `127.0.0.1` |
| `REDIS_PORT` | Redis 端口 | `6379` |
| `LICENSE` | 授权密钥 | - |

3. 执行命令 `docker-compose up -d` 运行程序。

### 基于 Kubernetes 的部署编排

::: tip
待完工....
:::

---

## 第三方集成接口

系统支持三种第三方集成接口，可在管理后台的「第三方集成」设置中配置。

### OAUTH_URL - 登录鉴权

当用户登录时，如果配置了此地址，系统会 POST 请求该地址进行用户验证。

::: warning 注意
配置 OAuth URL 后，将禁用本地的 Token/CDK 登录方式，所有登录请求都将转发至第三方系统验证。
:::

#### Request

```http
POST {OAUTH_URL}
Content-Type: application/json
```

```json
{
  "usertoken": "用户输入的 Token",
  "carid": "配置的 Car ID",
  "nodeType": "pro",
  "planType": "3"
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| `usertoken` | string | 用户登录时输入的凭证 |
| `carid` | string | 管理后台配置的 OAuth Car ID |
| `nodeType` | string | 节点类型 |
| `planType` | string | 套餐类型 |

#### Response

```json
{
  "code": 1,
  "msg": "success",
  "grant": "pro"
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| `code` | int | `1` 表示成功，其他值表示失败 |
| `msg` | string | 错误信息（失败时显示给用户） |
| `grant` | string | 可选，授权等级：`ultra` / `pro` / `free` |

#### Grant 等级说明

| 等级 | 值 | 可访问账号类型 |
|-----|---|--------------|
| Ultra | 3 | Ultra + Pro + Free |
| Pro | 2 | Pro + Free |
| Free | 1 | Free |

---

### AUDIT_LIMIT_URL - 对话鉴权

当用户发起对话时，系统会在请求发送到 Gemini 前 POST 该地址进行预检验证。

#### Request

```http
POST {AUDIT_LIMIT_URL}
Content-Type: application/json
Authorization: Bearer {userToken}
Carid: {carId}
```

```json
{
  "action": "next",
  "messages": [
    {
      "id": "uuid-string",
      "author": {
        "role": "user"
      },
      "create_time": 1704067200.123,
      "content": {
        "content_type": "text",
        "parts": ["用户输入的消息内容"]
      },
      "metadata": {}
    }
  ],
  "parent_message_id": "parent-uuid",
  "model": "gemini-3.0-flash",
  "timezone_offset_min": -480,
  "timezone": "Asia/Shanghai",
  "conversation_mode": {
    "kind": "primary_assistant"
  },
  "userToken": "用户 Token",
  "carId": "账号 ID",
  "raw_message": {}
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| `action` | string | 动作类型，固定为 `next` |
| `messages` | array | 消息数组 |
| `messages[].author.role` | string | 角色：`user` / `assistant` |
| `messages[].content.parts` | array | 消息内容数组 |
| `model` | string | 模型名称 |
| `userToken` | string | 用户 Token |
| `carId` | string | 当前使用的账号 ID |
| `raw_message` | object | 原始请求详情（可选） |

#### Response

| HTTP 状态码 | 说明 |
|------------|------|
| `200` | 验证通过，允许请求继续 |
| 非 `200` | 验证失败，响应 Body 内容将作为错误信息返回给用户 |

::: tip 用途示例
- 实现自定义的用量限制
- 实现内容审核/过滤
- 记录用户对话日志
:::

---

### NOTIFY_URL - 通知回调

当用户成功完成一次对话后，系统会异步 POST 该地址进行通知。

::: info
此请求为异步发送（Fire-and-Forget），不会阻塞用户的响应流。
:::

#### Request

请求格式与 [AUDIT_LIMIT_URL](#audit-limit-url-对话鉴权) 完全相同。

```http
POST {NOTIFY_URL}
Content-Type: application/json
Authorization: Bearer {userToken}
Carid: {carId}
```

#### Response

无需返回特定格式，系统不处理响应内容。

::: tip 用途示例
- 统计用户实际使用量
- 记录成功的对话日志
- 触发后续业务流程
:::

---

## 公开 API 接口

以下接口可供外部系统调用，用于集成和监控。

### /logintoken - Token 登录

通过 URL 参数实现自动登录，适用于单点登录场景。

#### Request

```http
GET /logintoken?access_token={token}&account={preferred_account}
```

| 参数 | 类型 | 必填 | 说明 |
|-----|------|-----|------|
| `access_token` | string | 是 | 用户 Token |
| `account` | string | 否 | 首选账号（别名：`carid`, `nickname`） |

#### Response

**成功时：** 自动重定向到 `/app` 页面

**失败时：**
```json
{
  "code": -1,
  "msg": "错误信息"
}
```

| code | 说明 |
|------|------|
| `0` | 成功 |
| `-1` | Token 无效或已过期 |
| `-2` | 授权已过期（如配置了 `expired_redirect_url` 则重定向） |

---

### /carpage - 账号列表分页

获取可用账号列表，支持分页。

#### Request

```http
POST /carpage
Content-Type: application/json
```

```json
{
  "page": 1,
  "size": 10
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| `page` | int | 页码，从 1 开始 |
| `size` | int | 每页数量 |

#### Response

```json
{
  "code": 0,
  "messages": "success",
  "data": {
    "accounts": [
      {
        "id": 1,
        "name": "account-name",
        "nickname": "显示名称",
        "type": "pro",
        "disabled": false
      }
    ],
    "total": 100,
    "page": 1,
    "size": 10
  },
  "notice": "公告内容"
}
```

---

### /status - 账号状态

获取指定账号的状态信息。

#### Request

```http
GET /status?carid={account_id}
```

| 参数 | 类型 | 说明 |
|-----|------|------|
| `carid` | string | 账号 ID 或名称 |

#### Response

```json
{
  "isPlus": true,
  "accountReady": true,
  "count": 50,
  "clears_in": 3600,
  "team_clears_in": 7200
}
```

| 字段 | 类型 | 说明 |
|-----|------|------|
| `isPlus` | bool | 是否为付费账号 |
| `accountReady` | bool | 账号是否可用 |
| `count` | int | 当前使用次数 |
| `clears_in` | int | 个人限额重置剩余秒数 |
| `team_clears_in` | int | 团队限额重置剩余秒数 |

---

### /endpoint - 状态徽章

返回 Shields.io 兼容的 JSON 格式，可用于 Markdown 徽章展示。

#### Request

```http
GET /endpoint?carid={account_id}
```

#### Response

```json
{
  "schemaVersion": 1,
  "label": "Gemini Status",
  "message": "Ready",
  "color": "green"
}
```

#### Markdown 使用示例

```markdown
![Status](https://img.shields.io/endpoint?url=https://your-domain.com/endpoint?carid=your-account)
```

---

## APIAUTH 说明

系统采用 **Session 认证机制**，所有请求通过 Cookie 中的 Session ID 进行身份识别。

### 认证流程

```
用户登录 → 创建 Session → 设置 Cookie → 后续请求携带 Cookie
```

### Session 配置

| 配置项 | 默认值 | 说明 |
|-------|-------|------|
| 有效期 | 24 小时 | Session 最大存活时间 |
| 存储后端 | Redis / 内存 | 取决于 `REDIS_ENABLE` 配置 |
| 设备限制 | 可配置 | 超出限制时踢出最早的会话 |

### 管理后台认证

管理后台使用独立的密码认证：

1. 访问 `/admin` 进入管理后台
2. 使用 `ADMIN_API_LOGIN_INIT_KEY` 配置的密码登录
3. 登录后可在设置中修改密码

### 内置限流器

当未配置第三方审计接口时，可使用内置限流器（需启用 Redis）：

| 模型 | 配置项 |
|-----|--------|
| gemini-3.0-flash | `flash_window`, `flash_limit` |
| gemini-3.0-think | `think_window`, `think_limit` |
| gemini-3.0-pro | `pro_window`, `pro_limit` |

窗口格式：`1h`（1小时）、`1d`（1天）等。