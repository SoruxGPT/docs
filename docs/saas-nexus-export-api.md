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
                    "text": "sss"
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