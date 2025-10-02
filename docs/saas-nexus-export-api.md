# Nexus Export API 格式介绍

我们的一个最小 API 请求例子为：

```json
{
    "model": "gpt-5",
    "messages": [
        {
            "role": "user",
            "content": "Hello!"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "file_asset",
                    "file_id": "saasnexus_xxx_id" // 由 SoruxGPT Nexus OSS 提供资产中转
                },
                {
                    "type": "text",
                    "content": "sss"
                }
            ]
        }
    ],
    "stream": false,
}
```
并且我们的 API 遵守 OpenAI 的回复格式，在这个地方，我们将 API 消息分为如下几个部分：
- 原生消息体
- 由 Base64 驱动的 image_url 格式
- 由 Nexus OSS 驱动的资产中转格式
- 由 Nexus 驱动的原生上下文切换功能
- 由 Nexus 驱动的平台参数控制功能 

其中，资产中转格式支持所有通用文件，并且由 Nexus 处理模型平台无法处理的内容。

:::tip
例如，Claude 平台无法处理 Docx 文件，但是 Nexus 会自动读取 Docx 内容，并且以 Claude 平台的 TXT 文件格式提供内容
:::

## 平台额外参数输出

POST 端点： `{SaaS-Endpoint}/backend-api/expose/api`

Header: `Authorization: Bearer <Your token here>`

```json
{
    "choices": [
        {
            "delta": {
                "content": "Hello, World",
                "role": "assistant"
            },
            "finish_reason": null,
            "index": 0
        }
    ],
    "created": 1759320975,
    "id": "c232dc7a-702d-49f2-a052-4f159f8aa0f3",
    "metadata": {
        "assistant_id": "ae6eb956-71ca-4ca3-a2cc-912939bb6d5e",
        "conversation_id": "7b732fb9-5c6e-4fc8-a977-a1be8d33af48",
        "provider": "sorux_nexus",
        "user_id": "df4e0a39-6935-4ebe-bc0e-4e3eed20b81a"
    },
    "model": "claude-sonnet-4-5-20250929",
    "object": "chat.completion.chunk"
}
```

如上所说，我们添加了 metadata 属性，并且问您提供了额外的信息，以方便您后续追踪 API 内容。
其中的细节如下：
- assistant_id: 当前回复的助手消息 ID
- conversation_id: 当前的对话 ID
- provider: 值恒为 sorux_nexus，表示 metadata 提供者
- user_id: 当前提问本身的消息 ID
- title: 本地对话的 ID

如果你需要接着 assistant_id 往下面对话，那么你的 last_id 应该是 assistant_id.

以上为平台均有的 metadata，但是部分平台会提供额外的 metadata 细节，其中有些需要你在控制平台细节的时候，显式返回这些细节，请注意查看下方文档。

:::tip
注意，我们支持提供参数 non_permit_fallback: bool，这是一个反转选项，如果开启，那么在我们没有寻找到所属对话的账号时，我们将显式返回报错，而不是为您调度上下文重新分配一个账号
:::

## 平台参数控制

我们为不同的平台提供了若干参数精细控制，你可以在对应的分类中找到属性和可接受的值类型。

特别的，我们为每一个平台提供了：

- soruxgpt_nexus_history_id: str，表示这个 API 归属的全局对话
- soruxgpt_nexus_last_id: str，表示这个 API 是在哪个对话后接着对话的。注意，由于平台不对你的消息进行存储，因此有的平台需要在重试某一个 assistant 消息时显式提供 "variant" 选项

以上值我们在消息体的 metadata 部分提供。


### Claude

- web_search: bool，是否开启网络搜索
- thinking: bool，是否开启思考功能
- compress_assets: bool，是否开启压缩文件功能
- compass: bool，是否开启搜索功能
- variant: bool，是否为重新生成

### Grok

#### 模型

为了呼应官网的 Auto 模式，我们虚拟了一个模型名为 "grok-4-auto", 你可以使用 "grok-4-auto" 的格式请求

#### 参数特性

- force_model_mode: str，默认为 Nexus 填写，你可以覆写本属性，默认的对应关系与官网一致，其中虚拟模型 "grok-4-auto" 为 "MODEL_MODE_AUTO"
- disable_search: bool，注意这是一个反转选项，因为 grok 默认开启搜索
- image: bool, 是否开启图片生成
- image_generate_count: int，默认为 2
- compress_assets: bool，是否开启压缩文件功能
- variant: bool，是否为重新生成
- disable_artifact: bool，是否禁止使用 Artifact


## 资产中转

由于部分的 API 有文件资产中转的需求，我们为您提供如下 API：

PUT: `{SaaS-EntPoint}/backend-api/expose/assets`

Header: `Authorization: Bearer <Your Token here>`

文件通过 Body 传递后，你应该可以得到如下回复：

```json
{
    "fileId": "saas_export_file-1c121c70261e49f4bd6dde2e58b526d9",
    "message": "文件上传成功，您可以通过文件ID使用该文件",
    "success": true
}
```


## 例子

### 继续对话

我们以 Claude 模型为例子：

```bash
curl --location '{Host}/backend-api/expose/api' \
--header 'Authorization: Bearer {Token}' \
--header 'Content-Type: application/json' \
--data '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
}'
```

我们随意抓取一个 Response，例如：

```json
{
    "choices": [
        {
            "delta": {
                "content": "有什么我可以帮助",
                "role": "assistant"
            },
            "finish_reason": null,
            "index": 0
        }
    ],
    "created": 1759422405,
    "id": "23e55130-6af5-4b3a-be62-b595698e53f6",
    "metadata": {
        "assistant_id": "5cb45432-cc7f-47ea-92bb-414002d2863b",
        "conversation_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884",
        "provider": "sorux_nexus",
        "user_id": "b5eea872-c120-4f28-80b5-4b1bd327aa06"
    },
    "model": "claude-sonnet-4-5-20250929",
    "object": "chat.completion.chunk"
}
```

那么如果我们想继续对话的话，只需要：

```bash
curl --location '{Host}/backend-api/expose/api' \
--header 'Authorization: Bearer {Token}' \
--header 'Content-Type: application/json' \
--data '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
        {
            "role": "user",
            "content": "我刚刚问了什么"
        }
    ],
    "soruxgpt_nexus_last_id": "5cb45432-cc7f-47ea-92bb-414002d2863b",
    "soruxgpt_nexus_history_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884"
}'
```

然后得到回复：

```json
{
    "choices": [
        {
            "delta": {
                "content": "刚刚说",
                "role": "assistant"
            },
            "finish_reason": null,
            "index": 0
        }
    ],
    "created": 1759422502,
    "id": "a5d0ad88-37a6-4c2f-acb5-2d9995038979",
    "metadata": {
        "assistant_id": "3100a5ad-669b-4abc-85a4-be5e9a4beaae",
        "conversation_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884",
        "provider": "sorux_nexus",
        "user_id": "ea2eb014-a7a3-42d0-ad1d-66a7613b3686"
    },
    "model": "claude-sonnet-4-5-20250929",
    "object": "chat.completion.chunk"
}
```

```json
{
    "choices": [
        {
            "delta": {
                "content": "的是\"你好\"，这",
                "role": "assistant"
            },
            "finish_reason": null,
            "index": 0
        }
    ],
    "created": 1759422502,
    "id": "a5d0ad88-37a6-4c2f-acb5-2d9995038979",
    "metadata": {
        "assistant_id": "3100a5ad-669b-4abc-85a4-be5e9a4beaae",
        "conversation_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884",
        "provider": "sorux_nexus",
        "user_id": "ea2eb014-a7a3-42d0-ad1d-66a7613b3686"
    },
    "model": "claude-sonnet-4-5-20250929",
    "object": "chat.completion.chunk"
}
```

如果需要携带文件，那么我们可以：

```bash
curl --location --request PUT '{Host}/backend-api/expose/assets' \
--header 'Authorization: Bearer {Token}' \
--header 'Content-Type: application/pdf' \
--data-binary '@/path/to/your/file'
```

得到响应:

```json
{
    "fileId": "saas_export_file-25d1e0fec569415195345d8a81835b4f",
    "message": "文件上传成功，您可以通过文件ID使用该文件",
    "success": true
}
```


然后我们直接使用它：

```bash
curl --location '{Host}/backend-api/expose/api' \
--header 'Authorization: Bearer {Token}' \
--header 'Content-Type: application/json' \
--data '{
    "model": "claude-sonnet-4-5-20250929",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "content": "文件的内容是？"
                },
                {
                    "type": "file_asset",
                    "file_id": "saas_export_file-25d1e0fec569415195345d8a81835b4f"
                }
            ]
        }
    ],
    "soruxgpt_nexus_last_id": "3100a5ad-669b-4abc-85a4-be5e9a4beaae",
    "soruxgpt_nexus_history_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884"
}'
```

得到回复：

```json
{
    "choices": [
        {
            "delta": {
                "content": "看到这是一张来自 xxx",
                "role": "assistant"
            },
            "finish_reason": null,
            "index": 0
        }
    ],
    "created": 1759422705,
    "id": "e034d724-3abe-4add-b70b-d4e3d59038ee",
    "metadata": {
        "assistant_id": "48ba4663-d1aa-4433-b330-31fb83fdf201",
        "conversation_id": "d080fd0d-dfb4-480e-8bd2-a5a7d6753884",
        "provider": "sorux_nexus",
        "user_id": "6d6fe20a-c2c8-4cde-93d5-13fc77326fd1"
    },
    "model": "claude-sonnet-4-5-20250929",
    "object": "chat.completion.chunk"
}
```