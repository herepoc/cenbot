```markdown
# Chat App API

Chat applications support session persistence, allowing previous chat history to be used as context for responses. This can be applicable for chatbot, customer service AI, etc.

## Base URL

```plaintext
https://api.dify.ai/v1
```

## Authentication

The Service API uses `API-Key` authentication.  
**Strongly recommend storing your API Key on the server-side, not shared or stored on the client-side, to avoid possible API-Key leakage that can lead to serious consequences.**

For all API requests, include your API Key in the `Authorization` HTTP Header, as shown below:

```javascript
Authorization: Bearer {API_KEY}
```

---

## Send Chat Message

**POST** `/chat-messages`

Send a request to the chat application.

### Request Body

- **query** (string): User Input/Question content
- **inputs** (object): Allows the entry of various variable values defined by the App. Default `{}`
- **response_mode** (string): The mode of response return, supporting:
  - `streaming`: Streaming mode (recommended), implements a typewriter-like output through SSE.
  - `blocking`: Blocking mode, returns result after execution is complete.
- **user** (string): User identifier, used to define the identity of the end-user for retrieval and statistics.
- **conversation_id** (string): Conversation ID, to continue the conversation based on previous chat records.
- **files** (array[object]): File list, suitable for inputting files (images) combined with text understanding and answering questions.
  - **type** (string): Supported type: `image`
  - **transfer_method** (string): Transfer method, `remote_url` for image URL / `local_file` for file upload
  - **url** (string): Image URL (when the transfer method is `remote_url`)
  - **upload_file_id** (string): Uploaded file ID (when the transfer method is `local_file`)
- **auto_generate_name** (bool): Auto-generate title, default is `true`.

### Response

- **ChatCompletionResponse**: Returns the complete App result.
  - `message_id` (string): Unique message ID
  - `conversation_id` (string): Conversation ID
  - `mode` (string): App mode, fixed as `chat`
  - `answer` (string): Complete response content
  - `metadata` (object): Metadata
    - `usage` (Usage): Model usage information
    - `retriever_resources` (array[RetrieverResource]): Citation and Attribution List
  - `created_at` (int): Message creation timestamp

- **ChunkChatCompletionResponse**: Returns the stream chunks outputted by the App.
  - `event: message`: LLM returns text chunk event.
  - `event: agent_message`: LLM returns text chunk event (Agent mode).
  - `event: tts_message`: TTS audio stream event.
  - `event: tts_message_end`: TTS audio stream end event.
  - `event: agent_thought`: Thought of Agent.
  - `event: message_file`: Message file event.
  - `event: message_end`: Message end event.
  - `event: message_replace`: Message content replacement event.
  - `event: error`: Exceptions during the streaming process.
  - `event: ping`: Ping event every 10 seconds.

### Errors

- 404: Conversation does not exist
- 400: `invalid_param`, abnormal parameter input
- 400: `app_unavailable`, App configuration unavailable
- 400: `provider_not_initialize`, no available model credential configuration
- 400: `provider_quota_exceeded`, model invocation quota insufficient
- 400: `model_currently_not_support`, current model unavailable
- 400: `completion_request_error`, text generation failed
- 500: Internal server error

---

## File Upload

**POST** `/files/upload`

Upload a file (currently only images are supported) for use when sending messages, enabling multimodal understanding of images and text.

### Request Body

- **file** (File): The file to be uploaded.
- **user** (string): User identifier, defined by the developer's rules, must be unique within the application.

### Response

- **id** (uuid): ID
- **name** (string): File name
- **size** (int): File size (bytes)
- **extension** (string): File extension
- **mime_type** (string): File mime-type
- **created_by** (uuid): End-user ID
- **created_at** (timestamp): Creation timestamp

### Errors

- 400: `no_file_uploaded`, a file must be provided
- 400: `too_many_files`, currently only one file is accepted
- 400: `unsupported_preview`, the file does not support preview
- 400: `unsupported_estimate`, the file does not support estimation
- 413: `file_too_large`, the file is too large
- 415: `unsupported_file_type`, unsupported extension
- 503: `s3_connection_failed`, unable to connect to S3 service
- 503: `s3_permission_denied`, no permission to upload files to S3
- 503: `s3_file_too_large`, file exceeds S3 size limit
- 500: Internal server error

---

## Stop Generate

**POST** `/chat-messages/:task_id/stop`

Only supported in streaming mode.

### Path

- **task_id** (string): Task ID, can be obtained from the streaming chunk return.

### Request Body

- **user** (string): User identifier, must be consistent with the user passed in the send message interface.

### Response

- **result** (string): Always returns "success"

---

## Message Feedback

**POST** `/messages/:message_id/feedbacks`

End-users can provide feedback messages, facilitating application developers to optimize expected outputs.

### Path

- **message_id** (string): Message ID

### Request Body

- **rating** (string): Upvote as `like`, downvote as `dislike`, revoke upvote as `null`
- **user** (string): User identifier, defined by the developer's rules, must be unique within the application.
- **content** (string): The specific content of message feedback.

### Response

- **result** (string): Always returns "success"

---

## Next Suggested Questions

**GET** `/messages/{message_id}/suggested`

Get next questions suggestions for the current message.

### Path Params

- **message_id** (string): Message ID

### Query

- **user** (string): User identifier, used to define the identity of the end-user for retrieval and statistics.

### Response

- **result** (string): Always returns "success"
- **data** (array[string]): List of suggested questions

---

## Get Conversation History Messages

**GET** `/messages`

Returns historical chat records in a scrolling load format.

### Query

- **conversation_id** (string): Conversation ID
- **user** (string): User identifier, used to define the identity of the end-user for retrieval and statistics.
- **first_id** (string): The ID of the first chat record on the current page, default is null.
- **limit** (int): How many chat history messages to return in one request, default is 20.

### Response

- **data** (array[object]): Message list
  - **id** (string): Message ID
  - **conversation_id** (string): Conversation ID
  - **inputs** (object): User input parameters.
  - **query** (string): User input / question content.
  - **message_files** (array[object]): Message files
    - **id** (string): File ID
    - **type** (string): File type, image for images
    - **url** (string): Preview image URL
    - **belongs_to** (string): Belongs to, user or assistant
  - **agent_thoughts** (array[object]): Agent thought (Empty if it's a Basic Assistant)
    - **id** (string): Agent thought ID
    - **message_id** (string): Unique message ID
    - **position** (int): Position of current agent thought
    - **thought** (string): What LLM is thinking about
    - **observation** (string): Response from tool calls
    - **tool** (string): A list of tools represents which tools are called
    - **tool_input** (string): Input of tools in JSON format
    - **created_at** (int): Creation timestamp
    - **message_files** (array[string]): Refer to message_file event
  - **answer** (string): Response message content
  - **created_at** (timestamp): Creation timestamp
  - **feedback** (object): Feedback information
    - **rating** (string): Upvote as `like` / Downvote as `dislike`
  - **retriever_resources** (array[RetrieverResource]): Citation and Attribution List
  - **has_more** (bool): Whether there is a next page
  - **limit** (int): Number of returned items

---

## Get Conversations

**GET** `/conversations`

Retrieve the conversation list for the current user, defaulting to the most recent 20 entries.

### Query

- **user** (string): User identifier, used to define the identity of the end-user for retrieval and statistics.
- **last_id** (string): The ID of the last record on the current page, default is null.
- **limit** (int): How many records to return in one request, default is 20.
- **sort_by** (string): Sorting Field, Default: `-updated_at`

### Response

- **data** (array[object]): List of conversations
  - **id** (string): Conversation ID
  - **name** (string): Conversation name
  - **inputs** (object): User input parameters
  - **status** (string): Conversation status
  - **introduction** (string): Introduction
  - **created_at** (timestamp): Creation timestamp
  - **updated_at** (timestamp): Update timestamp
- **has_more** (bool): Whether there is a next page
- **limit** (int): Number of entries returned

---

## Delete Conversation

**DELETE** `/conversations/:conversation_id`

Delete a conversation.

### Path

- **conversation_id** (string): Conversation ID

### Request Body

- **user** (string): The user identifier, defined by the developer, must ensure uniqueness within the application.

### Response

- **result** (string): Always returns "success"

---

## Conversation Rename

**POST** `/conversations/:conversation_id/name`

Rename the session, the session name is used for display on clients that support multiple sessions.

### Path

- **conversation_id** (string): Conversation ID

### Request Body

- **name** (string): (Optional) The name of the conversation.
- **auto_generate** (bool): (Optional) Automatically generate the title, default is `false`
- **user** (string): The user identifier, defined by the developer, must ensure uniqueness within the application.

### Response

- **id** (string): Conversation ID
- **name** (string): Conversation name
- **inputs** (object): User input parameters
- **status** (string): Conversation status
- **introduction** (string): Introduction
- **created_at** (timestamp): Creation timestamp
- **updated_at** (timestamp): Update timestamp

---

## Speech to Text

**POST** `/audio-to-text`

Convert speech to text.

### Request Body

- **file** (File): Audio file. Supported formats: `['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']`
- **user** (string): User identifier, defined by the developer's rules, must be unique within the application.

### Response

- **text** (string): Output text

---

## Text to Audio

**POST** `/text-to-audio`

Convert text to audio.

### Request Body

- **message_id** (string): For text messages generated by Dify, pass the generated message-id directly.
- **text** (string): Speech generated content.
- **user** (string): The user identifier, defined by the developer, must ensure uniqueness within the app.

### Response

- **Content-Type**: `audio/wav`

---

## Get Application Basic Information

**GET** `/info`

Used to get basic information about this application.

### Response

- **name** (string): Application name
- **description** (string): Application description
- **tags** (array[string]): Application tags

---

## Get Application Parameters Information

**GET** `/parameters`

Used at the start of entering the page to obtain information such as features, input parameter names, types, and default values.

### Query

- **user** (string): User identifier, defined by the developer's rules, must be unique within the application.

### Response

- **opening_statement** (string): Opening statement
- **suggested_questions** (array[string]): List of suggested questions for the opening
- **suggested_questions_after_answer** (object): Suggest questions after enabling the answer.
  - **enabled** (bool): Whether it is enabled
- **speech_to_text** (object): Speech to text
  - **enabled** (bool): Whether it is enabled
- **retriever_resource** (object): Citation and Attribution
  - **enabled** (bool): Whether it is enabled
- **annotation_reply** (object): Annotation reply
  - **enabled** (bool): Whether it is enabled
- **user_input_form** (array[object]): User input form configuration
  - **text-input** (object): Text input control
    - **label** (string): Variable display label name
    - **variable** (string): Variable ID
    - **required** (bool): Whether it is required
    - **default** (string): Default value
  - **paragraph** (object): Paragraph text input control
    - **label** (string): Variable display label name
    - **variable** (string): Variable ID
    - **required** (bool): Whether it is required
    - **default** (string): Default value
  - **select** (object): Dropdown control
    - **label** (string): Variable display label name
    - **variable** (string): Variable ID
    - **required** (bool): Whether it is required
    - **default** (string): Default value
    - **options** (array[string]): Option values
- **file_upload** (object): File upload configuration
  - **image** (object): Image settings
    - **enabled** (bool): Whether it is enabled
    - **number_limits** (int): Image number limit, default is 3
    - **transfer_methods** (array[string]): List of transfer methods, `remote_url`, `local_file`
- **system_parameters** (object): System parameters
  - **file_size_limit** (int): Document upload size limit (MB)
  - **image_file_size_limit** (int): Image file upload size limit (MB)
  - **audio_file_size_limit** (int): Audio file upload size limit (MB)
  - **video_file_size_limit** (int): Video file upload size limit (MB)

---

## Get Application Meta Information

**GET** `/meta`

Used to get icons of tools in this application.

### Response

- **tool_icons** (object[string]): Tool icons
  - **tool_name** (string)
    - **icon** (object|string)
      - **background** (string): Background color in hex format
      - **content** (string): Emoji
      - **url** (string): URL of icon
```
