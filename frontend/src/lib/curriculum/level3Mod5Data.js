/**
 * Revoraa Level 3: Intermediate Python - Module 5: HTTP, APIs, and JSON
 * 
 * 10 comprehensive lessons covering client-server architecture, status codes,
 * JSON serialization, urllib/requests, timeouts, rate limits, pagination, env vars,
 * mock testing, and robust ApiClient design.
 */

export const MODULE_5_HTTP_APIS_JSON = {
  id: 'mod-py-http-apis-json',
  slug: 'http-apis-json',
  level_number: 3,
  title: 'HTTP, APIs, and JSON',
  description: 'Consume REST APIs safely, handle network errors, parse JSON payloads, paginate results, and build resilient API clients.',
  estimated_hours: 6,
  sort_order: 5,
  is_published: true,
  topics: [
    {
      id: 'top-http-rest-clients',
      slug: 'rest-apis-and-json',
      title: 'REST APIs & Network Communication',
      summary: 'Explore HTTP methods, status codes, JSON parsing, error boundaries, and API client architectures.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-http-rest-fundamentals',
          slug: 'http-and-rest-fundamentals',
          title: 'What HTTP and REST APIs Are',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Understand the client-server request-response lifecycle, URLs, endpoints, statelessness, and REST resource architecture.',
          learning_objectives: [
            'Deconstruct the HTTP Request-Response cycle',
            'Understand stateless client-server communication',
            'Map REST resource URLs and endpoints to domain entities'
          ],
          content_markdown: `### The Request-Response Lifecycle

**HTTP (Hypertext Transfer Protocol)** is the communication standard of the web:
1. **Client**: A Python program that initiates a request to a server.
2. **Server**: A remote host that receives the request, processes it, and returns a response.
3. **Statelessness**: Each request is completely independent. The server does not store client session state between requests unless explicit tokens or cookies are sent.

### Anatomy of an HTTP Request
\`\`\`
GET /api/v1/students?grade=10 HTTP/1.1
Host: api.revoraa.dev
Accept: application/json
User-Agent: RevoraaPythonClient/1.0
\`\`\`

### Anatomy of an HTTP Response
\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 124

{"status": "success", "total": 2, "students": [{"id": 1}, {"id": 2}]}
\`\`\``,
          code_snippet: `# Modeling an HTTP Request and Response in Python dataclasses
from dataclasses import dataclass, field
from typing import Dict, Any

@dataclass
class HttpRequest:
    method: str
    endpoint: str
    headers: Dict[str, str] = field(default_factory=dict)
    params: Dict[str, str] = field(default_factory=dict)

@dataclass
class HttpResponse:
    status_code: int
    headers: Dict[str, str]
    body: Dict[str, Any]

# Construct simulated request and response
req = HttpRequest(
    method="GET",
    endpoint="/api/v1/courses",
    headers={"Accept": "application/json"}
)

res = HttpResponse(
    status_code=200,
    headers={"Content-Type": "application/json"},
    body={"courses": ["Intermediate Python", "FastAPI Mastery"]}
)

print(f"Request:  {req.method} {req.endpoint}")
print(f"Response: Status {res.status_code} with {len(res.body['courses'])} courses")`,
          code_language: 'python',
          code_explanation: 'Models client-server request and response structures using clean Python dataclasses.',
          expected_output: `Request:  GET /api/v1/courses
Response: Status 200 with 2 courses`,
          quiz: {
            id: 'quiz-http-fundamentals',
            title: 'Knowledge Check: HTTP Fundamentals',
            questions: [
              {
                id: 'q-hf-1',
                question_text: 'What does it mean that HTTP is a "stateless" protocol?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Requests can only be made within the same country.' },
                  { id: 'opt_2', text: 'Each request is handled independently without the server automatically retaining previous request state.' },
                  { id: 'opt_3', text: 'Servers never send responses.' },
                  { id: 'opt_4', text: 'Data cannot be stored in databases.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Statelessness means the server treats each request as entirely new, requiring credentials or context to be sent with each request.'
              }
            ]
          },
          key_takeaways: [
            'HTTP follows a synchronous request-response protocol.',
            'REST structures endpoints around resources (e.g. /users, /posts).',
            'Requests consist of method, URL, headers, and optional body.'
          ],
          revision_prompts: [
            'What is the difference between an endpoint and a resource in REST?',
            'Why is JSON the most prevalent data format for modern REST APIs?'
          ]
        },

        // Lesson 2
        {
          id: 'les-http-methods-status-codes',
          slug: 'http-methods-and-status-codes',
          title: 'HTTP Methods and Status Codes',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Master standard HTTP verbs (GET, POST, PUT, DELETE) and status code categories (2xx, 3xx, 4xx, 5xx).',
          learning_objectives: [
            'Understand HTTP methods: GET, POST, PUT, PATCH, DELETE',
            'Classify status codes: 2xx success, 3xx redirect, 4xx client errors, 5xx server errors',
            'Dispatch response handlers according to status code ranges'
          ],
          content_markdown: `### Standard HTTP Verbs

- **GET**: Retrieve resource representation without side effects (Idempotent, Safe).
- **POST**: Create a new subordinate resource (Not idempotent).
- **PUT**: Replace a resource completely (Idempotent).
- **PATCH**: Partially modify an existing resource.
- **DELETE**: Remove a resource (Idempotent).

### Status Code Categories

\`\`\`
Code Range   Meaning          Key Examples
2xx          Success          200 OK, 201 Created, 204 No Content
3xx          Redirection      301 Moved Permanently, 304 Not Modified
4xx          Client Error     400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests
5xx          Server Error     500 Internal Error, 502 Bad Gateway, 503 Service Unavailable
\`\`\``,
          code_snippet: `# Dispatching response handlers by HTTP status code
def handle_api_status(status_code, payload):
    if 200 <= status_code < 300:
        return f"SUCCESS ({status_code}): Processed data for {payload.get('user', 'guest')}"
    elif status_code == 401:
        return f"AUTH_ERROR (401): Invalid or expired API credentials"
    elif status_code == 404:
        return f"NOT_FOUND (404): Resource does not exist"
    elif status_code == 429:
        return f"RATE_LIMITED (429): Quota exceeded. Please back off."
    elif 500 <= status_code < 600:
        return f"SERVER_FAULT ({status_code}): Upstream provider error"
    else:
        return f"UNEXPECTED_STATUS ({status_code})"

print(handle_api_status(200, {"user": "Fatima"}))
print(handle_api_status(401, {}))
print(handle_api_status(429, {}))
print(handle_api_status(503, {}))`,
          code_language: 'python',
          code_explanation: 'Demonstrates categorizing HTTP status codes into appropriate client response classifications.',
          expected_output: `SUCCESS (200): Processed data for Fatima
AUTH_ERROR (401): Invalid or expired API credentials
RATE_LIMITED (429): Quota exceeded. Please back off.
SERVER_FAULT (503): Upstream provider error`,
          quiz: {
            id: 'quiz-http-status-codes',
            title: 'Knowledge Check: Status Codes',
            questions: [
              {
                id: 'q-sc-1',
                question_text: 'What status code indicates that the client has sent too many requests and exceeded their rate limit?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '400' },
                  { id: 'opt_2', text: '404' },
                  { id: 'opt_3', text: '429' },
                  { id: 'opt_4', text: '500' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'HTTP 429 Too Many Requests is the standard status code indicating rate limit exhaustion.'
              }
            ]
          },
          key_takeaways: [
            'GET is safe and idempotent; POST creates resources.',
            '4xx codes represent client mistakes (bad params, invalid keys, missing routes).',
            '5xx codes represent upstream server crashes or gateway timeouts.'
          ],
          revision_prompts: [
            'What is the difference between 401 Unauthorized and 403 Forbidden?',
            'What does idempotency mean in the context of PUT vs POST?'
          ]
        },

        // Lesson 3
        {
          id: 'les-headers-params-json-payloads',
          slug: 'headers-params-json-payloads',
          title: 'Request Headers, Query Parameters, and JSON Bodies',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Format URL query strings with urllib.parse, configure authentication headers, and prepare JSON payloads.',
          learning_objectives: [
            'Encode URL query strings safely using urllib.parse.urlencode()',
            'Configure standard headers (Content-Type, Authorization, Accept)',
            'Prepare and serialize JSON payload bodies'
          ],
          content_markdown: `### Query Parameters vs Request Bodies

- **Query Parameters**: Key-value pairs appended to the URL (\`?page=2&limit=50\`). Used in GET requests for filtering, pagination, and sorting.
- **Request Headers**: Metadata sent alongside the request (e.g. \`Authorization: Bearer sec_abc\`, \`Content-Type: application/json\`).
- **Request Body**: The payload sent with POST, PUT, or PATCH requests containing structured data.

### URL Encoding
Never manually concatenate strings like \`url + "?search=" + query\`. If the query contains spaces, slashes, or ampersands (\`&\`), it corrupts the URL! Always use **\`urllib.parse.urlencode()\`**.`,
          code_snippet: `from urllib.parse import urlencode
import json

base_url = "https://api.revoraa.dev/v1/search"
query_params = {
    "query": "machine learning & python",
    "limit": 25,
    "sort": "popular"
}

# 1. Safely encode URL parameters
encoded_query = urlencode(query_params)
full_url = f"{base_url}?{encoded_query}"
print("Safely encoded URL:")
print(" ", full_url)

# 2. Prepare headers and JSON payload
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer tok_demo_12345",
    "User-Agent": "RevoraaClient/1.0"
}

payload = {
    "title": "Decorators in Practice",
    "author": "Dr. Raman",
    "tags": ["python", "intermediate"]
}

json_payload = json.dumps(payload)
print("\\nSerialized JSON body:")
print(" ", json_payload)`,
          code_language: 'python',
          code_explanation: 'Uses urllib.parse.urlencode to escape special characters in URL parameters and json.dumps to format request payloads.',
          expected_output: `Safely encoded URL:
  https://api.revoraa.dev/v1/search?query=machine+learning+%26+python&limit=25&sort=popular

Serialized JSON body:
  {"title": "Decorators in Practice", "author": "Dr. Raman", "tags": ["python", "intermediate"]}`,
          quiz: {
            id: 'quiz-headers-params',
            title: 'Knowledge Check: Headers & Params',
            questions: [
              {
                id: 'q-hp-1',
                question_text: 'Why should you use urllib.parse.urlencode() instead of string concatenation for query parameters?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To encrypt the URL with AES.' },
                  { id: 'opt_2', text: 'To percent-encode special characters (like spaces and &) so the URL remains syntactically valid.' },
                  { id: 'opt_3', text: 'urlencode speeds up DNS resolution.' },
                  { id: 'opt_4', text: 'String concatenation is deprecated in Python.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'urlencode converts special characters like spaces, &, and ? into valid percent-encoded representations.'
              }
            ]
          },
          key_takeaways: [
            'Use urllib.parse.urlencode for query parameters.',
            'Include Content-Type: application/json when sending JSON payloads.',
            'Never place secrets in URL parameters if headers can be used.'
          ],
          revision_prompts: [
            'Why is placing API keys in URL query strings a security risk?',
            'What is the purpose of the Accept header?'
          ]
        },

        // Lesson 4
        {
          id: 'les-sending-http-requests',
          slug: 'sending-http-requests-urllib-requests',
          title: 'Sending HTTP Requests with Python Standard Library',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Use urllib.request to construct HTTP requests, transmit headers, and decode binary responses into Python strings.',
          learning_objectives: [
            'Use urllib.request.Request to configure headers and methods',
            'Transmit and receive HTTP data streams',
            'Decode response bytes to UTF-8 strings'
          ],
          content_markdown: `### Standard Library \`urllib.request\`

While third-party libraries like \`requests\` and \`httpx\` are popular, Python includes a full HTTP client in its standard library: **\`urllib.request\`**.

Using standard library tools guarantees your application has **zero external dependencies**:

\`\`\`python
from urllib.request import Request, urlopen

req = Request(
    url="https://api.example.com/items",
    headers={"User-Agent": "MyClient/1.0"}
)

with urlopen(req) as response:
    raw_bytes = response.read()
    text = raw_bytes.decode("utf-8")
\`\`\``,
          code_snippet: `# Simulating an HTTP transport client using urllib-compatible pattern
class MockHttpResponse:
    def __init__(self, status, payload_bytes):
        self.status = status
        self.payload = payload_bytes

    def read(self):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

# Demonstrating byte decoding from an HTTP response stream
sample_payload = b'{"status": "ok", "message": "Connection verified"}'
response = MockHttpResponse(200, sample_payload)

with response as res:
    raw_data = res.read()
    decoded_text = raw_data.decode("utf-8")
    print(f"Response status: {res.status}")
    print(f"Decoded body:    {decoded_text}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates reading raw bytes from an HTTP response stream context manager and decoding to a UTF-8 string.',
          expected_output: `Response status: 200
Decoded body:    {"status": "ok", "message": "Connection verified"}`,
          quiz: {
            id: 'quiz-sending-http',
            title: 'Knowledge Check: urllib Requests',
            questions: [
              {
                id: 'q-sh-1',
                question_text: 'What data type does response.read() return when reading from an HTTP connection in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'str' },
                  { id: 'opt_2', text: 'bytes' },
                  { id: 'opt_3', text: 'dict' },
                  { id: 'opt_4', text: 'int' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'HTTP transmits raw octets, so response.read() returns bytes that must be decoded (typically via .decode("utf-8")).'
              }
            ]
          },
          key_takeaways: [
            'urllib.request requires zero third-party dependencies.',
            'HTTP responses return raw bytes that must be decoded to UTF-8.',
            'Always wrap network connections in with context managers for safe cleanup.'
          ],
          revision_prompts: [
            'How do you pass a POST body using urllib.request.Request?',
            'What happens if a response body uses an encoding other than UTF-8?'
          ]
        },

        // Lesson 5
        {
          id: 'les-parsing-validating-json',
          slug: 'parsing-and-validating-json',
          title: 'Parsing and Validating JSON Responses',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Parse JSON strings with json.loads(), catch JSONDecodeError, and validate response schema structures defensively.',
          learning_objectives: [
            'Convert JSON strings into Python dicts and lists using json.loads()',
            'Handle corrupt or HTML error responses with json.JSONDecodeError',
            'Validate schema types and required fields defensively'
          ],
          content_markdown: `### From JSON Text to Python Data

JSON maps directly to Python primitives:
- JSON Object ──► Python \`dict\`
- JSON Array ──► Python \`list\`
- JSON String ──► Python \`str\`
- JSON Number ──► Python \`int\` or \`float\`
- JSON Boolean ──► Python \`bool\` (\`true\` -> \`True\`)
- JSON Null ──► Python \`None\`

### Defensive Validation
Never assume an API response matches your expectations. If an API is behind a proxy that crashes, it might return a 502 HTML error page instead of JSON!

\`\`\`python
import json

try:
    data = json.loads(response_text)
except json.JSONDecodeError as err:
    raise ValueError(f"Server did not return valid JSON: {err}")
\`\`\``,
          code_snippet: `import json

# Validating incoming API payloads defensively
raw_json = '{"course_id": 402, "title": "Iterators", "is_published": true, "lessons": 8}'

def parse_and_validate_course(raw_payload):
    try:
        data = json.loads(raw_payload)
    except json.JSONDecodeError as err:
        return None, f"Invalid JSON format: {err}"

    required_keys = ["course_id", "title", "is_published"]
    missing = [k for k in required_keys if k not in data]
    if missing:
        return None, f"Schema error: Missing required keys {missing}"

    if not isinstance(data["course_id"], int):
        return None, "Type error: 'course_id' must be an integer"

    return data, None

parsed_data, error = parse_and_validate_course(raw_json)
print("Validation success:", error is None)
print("Parsed course title:", parsed_data["title"])`,
          code_language: 'python',
          code_explanation: 'Demonstrates defensive JSON decoding and structural schema validation checking for missing keys and type correctness.',
          expected_output: `Validation success: True
Parsed course title: Iterators`,
          quiz: {
            id: 'quiz-parsing-json',
            title: 'Knowledge Check: JSON Parsing',
            questions: [
              {
                id: 'q-pj-1',
                question_text: 'What exception is raised when json.loads() is passed a corrupt or non-JSON string?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'TypeError' },
                  { id: 'opt_2', text: 'json.JSONDecodeError' },
                  { id: 'opt_3', text: 'KeyError' },
                  { id: 'opt_4', text: 'AttributeError' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'json.JSONDecodeError (a subclass of ValueError) is raised when the provided string is not valid JSON.'
              }
            ]
          },
          key_takeaways: [
            'Always wrap json.loads() in try/except json.JSONDecodeError.',
            'JSON null converts to Python None.',
            'Validate schema keys and types before accessing nested fields.'
          ],
          revision_prompts: [
            'What is the difference between json.load() and json.loads()?',
            'How can custom types (like datetime objects) be serialized using json.dumps(default=...)?'
          ]
        },

        // Lesson 6
        {
          id: 'les-timeouts-error-handling',
          slug: 'timeouts-and-error-handling',
          title: 'Timeouts, Network Errors, and HTTP Errors',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Enforce explicit request timeouts to prevent application freezing and translate low-level socket errors into domain exceptions.',
          learning_objectives: [
            'Set explicit connection and read timeouts on HTTP requests',
            'Differentiate HTTPError (status codes) from URLError (network connection loss)',
            'Implement exponential backoff retry policies for transient errors'
          ],
          content_markdown: `### The Infinite Hang Bug

If you send an HTTP request without setting a **timeout**, Python will wait indefinitely if the remote server drops the connection or stalls! In production, this locks threads and crashes servers.

**Golden Rule: Never make an HTTP request without an explicit timeout.**

\`\`\`python
# Always pass timeout in seconds
response = urlopen(req, timeout=5.0)
\`\`\`

### Error Hierarchy in \`urllib.error\`
- **\`HTTPError\`**: The server responded with an HTTP error code (e.g. 404, 500). Inherits from \`URLError\`.
- **\`URLError\`**: A low-level network failure occurred (DNS lookup failed, connection refused, connection timed out).`,
          code_snippet: `import socket

# Simulating network timeout and error translation
class NetworkTimeoutException(Exception):
    pass

class ResourceNotFoundException(Exception):
    pass

def simulate_fetch_resource(url, timeout=3.0):
    if timeout < 1.0:
        raise socket.timeout("Connection timed out after limit")
    if "missing" in url:
        return 404, "Not Found"
    return 200, '{"data": "active"}'

# Resilient error boundary
try:
    status, payload = simulate_fetch_resource("https://api.revoraa.dev/missing", timeout=5.0)
    if status == 404:
        raise ResourceNotFoundException("Target endpoint does not exist")
except socket.timeout:
    print("Caught connection timeout!")
except ResourceNotFoundException as err:
    print(f"Domain error caught: {err}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates translating low-level network and HTTP status errors into meaningful domain exceptions.',
          expected_output: `Domain error caught: Target endpoint does not exist`,
          quiz: {
            id: 'quiz-timeouts-errors',
            title: 'Knowledge Check: Timeouts & Errors',
            questions: [
              {
                id: 'q-te-1',
                question_text: 'Why is setting an explicit timeout parameter mandatory for production HTTP requests?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To encrypt data in transit.' },
                  { id: 'opt_2', text: 'Without a timeout, a stalled server can hang the Python thread indefinitely.' },
                  { id: 'opt_3', text: 'It reduces bandwidth costs.' },
                  { id: 'opt_4', text: 'HTTP 2 requires it.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A missing timeout defaults to socket.getdefaulttimeout() (often None), allowing stuck socket connections to freeze threads forever.'
              }
            ]
          },
          key_takeaways: [
            'Always specify an explicit timeout in seconds.',
            'HTTPError indicates the server replied with a 4xx/5xx status.',
            'URLError indicates network failure, DNS error, or connection refusal.'
          ],
          revision_prompts: [
            'What is exponential backoff and why should you add jitter to retries?',
            'Should 404 Not Found errors be retried with exponential backoff?'
          ]
        },

        // Lesson 7
        {
          id: 'les-pagination-rate-limits',
          slug: 'pagination-and-rate-limits',
          title: 'Pagination and Rate-Limit Awareness',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Traverse multi-page API responses using generator pagination and respect 429 rate limit thresholds.',
          learning_objectives: [
            'Implement page-based, offset/limit, and cursor-based pagination traversals',
            'Write generator functions that lazily fetch pages as items are requested',
            'Parse Retry-After headers when encountering HTTP 429 responses'
          ],
          content_markdown: `### API Pagination Patterns

APIs do not return 1,000,000 items in a single response. They paginate:
1. **Page-based**: \`?page=1&per_page=50\`
2. **Offset/Limit**: \`?offset=100&limit=50\`
3. **Cursor-based**: \`?cursor=eyJpZCI6MTAxfQ==\`

### Streaming Paginated Results with Generators
Wrap paginated requests in a generator so the caller can loop over records smoothly without managing page numbers:

\`\`\`python
def stream_all_records():
    page = 1
    while True:
        data = fetch_page(page)
        if not data["items"]:
            break
        yield from data["items"]
        page += 1
\`\`\``,
          code_snippet: `# Simulating a paginated API generator
SIMULATED_DB = [f"Item_{i}" for i in range(1, 13)]

def mock_api_page(page, page_size=4):
    start = (page - 1) * page_size
    items = SIMULATED_DB[start:start + page_size]
    has_more = (start + page_size) < len(SIMULATED_DB)
    return {"items": items, "page": page, "has_more": has_more}

def stream_catalog():
    current_page = 1
    while True:
        resp = mock_api_page(current_page, page_size=4)
        yield from resp["items"]
        if not resp["has_more"]:
            break
        current_page += 1

print("Streaming paginated catalog items:")
for item in stream_catalog():
    print(f"  Received: {item}")`,
          code_language: 'python',
          code_explanation: 'Implements a generator that transparently navigates paginated API responses and yields individual items sequentially.',
          expected_output: `Streaming paginated catalog items:
  Received: Item_1
  Received: Item_2
  Received: Item_3
  Received: Item_4
  Received: Item_5
  Received: Item_6
  Received: Item_7
  Received: Item_8
  Received: Item_9
  Received: Item_10
  Received: Item_11
  Received: Item_12`,
          quiz: {
            id: 'quiz-pagination-rates',
            title: 'Knowledge Check: Pagination',
            questions: [
              {
                id: 'q-pr-1',
                question_text: 'What response header should a client inspect when encountering HTTP 429 Too Many Requests?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Content-Type' },
                  { id: 'opt_2', text: 'Retry-After' },
                  { id: 'opt_3', text: 'Server' },
                  { id: 'opt_4', text: 'Accept-Encoding' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The Retry-After header indicates how many seconds (or a specific timestamp) the client must wait before making another request.'
              }
            ]
          },
          key_takeaways: [
            'Paginate using generator streams to hide pagination complexity.',
            'Cursor-based pagination is resilient against database insertion shifts.',
            'Respect 429 Retry-After headers to prevent IP bans.'
          ],
          revision_prompts: [
            'Why does offset-based pagination degrade in performance for deep pages (e.g. offset=1,000,000)?',
            'How can you prevent infinite loops if an API returns has_more=True indefinitely?'
          ]
        },

        // Lesson 8
        {
          id: 'les-api-keys-environment-vars',
          slug: 'api-keys-and-environment-variables',
          title: 'API Keys and Environment Variables',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Secure secrets and configuration credentials using os.environ and 12-Factor principles, avoiding hard-coded tokens.',
          learning_objectives: [
            'Read configuration variables safely using os.environ.get()',
            'Raise clear configuration errors when mandatory keys are missing',
            'Understand why committing API tokens to git is a catastrophic security risk'
          ],
          content_markdown: `### The Golden Rule of API Secrets

**NEVER commit API keys, tokens, passwords, or credentials into source code.**

If committed, automated scanners find public keys within seconds.

### The 12-Factor Solution: Environment Variables
Store secrets in environment variables on the operating system:

\`\`\`python
import os

# Safe lookup with default fallback
timeout = int(os.environ.get("API_TIMEOUT", "10"))

# Mandatory secret lookup with descriptive failure
api_key = os.environ.get("REVORAA_API_KEY")
if not api_key:
    raise RuntimeError("REVORAA_API_KEY environment variable is not configured!")
\`\`\``,
          code_snippet: `import os

class ApiConfiguration:
    def __init__(self, env_dict=None):
        env = env_dict if env_dict is not None else os.environ
        
        self.api_key = env.get("API_KEY")
        if not self.api_key:
            raise ValueError("Configuration Error: 'API_KEY' is required.")
            
        self.base_url = env.get("API_BASE_URL", "https://api.revoraa.dev/v1")
        self.timeout = int(env.get("API_TIMEOUT", "10"))

# Testing valid configuration
simulated_env = {
    "API_KEY": "sec_live_99887766",
    "API_TIMEOUT": "15"
}

config = ApiConfiguration(simulated_env)
print("Config loaded successfully:")
print("  Base URL:", config.base_url)
print("  Timeout: ", config.timeout)
print("  Masked key:", config.api_key[:8] + "...")`,
          code_language: 'python',
          code_explanation: 'Demonstrates reading configuration from an environment dictionary with validation, sensible defaults, and type casting.',
          expected_output: `Config loaded successfully:
  Base URL: https://api.revoraa.dev/v1
  Timeout:  15
  Masked key: sec_live...`,
          quiz: {
            id: 'quiz-api-keys',
            title: 'Knowledge Check: API Keys & Secrets',
            questions: [
              {
                id: 'q-ak-1',
                question_text: 'Where should production API credentials and private tokens be stored?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Hardcoded in python constants at the top of the script.' },
                  { id: 'opt_2', text: 'In environment variables or secure secret managers.' },
                  { id: 'opt_3', text: 'In public git commit messages.' },
                  { id: 'opt_4', text: 'In the client browser HTML source.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Environment variables isolate secrets from source control, allowing different credentials across development, staging, and production.'
              }
            ]
          },
          key_takeaways: [
            'Never commit credentials to git.',
            'Use os.environ.get(KEY, default) for configuration.',
            'Fail fast with informative error messages when required keys are missing.'
          ],
          revision_prompts: [
            'How do .env files work in local development with python-dotenv?',
            'Why should you never log or print raw API keys in application logs?'
          ]
        },

        // Lesson 9
        {
          id: 'les-mocking-http-responses',
          slug: 'mocking-http-responses',
          title: 'Mocking HTTP Responses in Automated Tests',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Write deterministic, fast, offline unit tests for API-dependent functions using unittest.mock.',
          learning_objectives: [
            'Use unittest.mock.Mock to simulate HTTP response objects',
            'Test 200 success, 404 missing, and 500 error scenarios without network calls',
            'Isolate unit tests from third-party network flakiness'
          ],
          content_markdown: `### Why Real Network Calls Ruin Tests

Unit tests should never hit live external APIs:
1. **Flaky**: Network lag or downtime causes random test failures.
2. **Slow**: Network handshakes add hundreds of milliseconds per test.
3. **Destructive**: Testing \`delete_user()\` against a real service deletes real data!
4. **Rate limits**: Running tests 50 times in CI consumes your API quota.

### The Mocking Pattern with \`unittest.mock\`
Mock the network boundary so your tests verify your business parsing logic in isolation:

\`\`\`python
from unittest.mock import Mock

mock_res = Mock()
mock_res.status = 200
mock_res.read.return_value = b'{"status": "ok"}'
\`\`\``,
          code_snippet: `from unittest.mock import Mock
import json

def fetch_user_name(transport_fn, user_id):
    """Business function that queries an API and extracts the user name."""
    response = transport_fn(f"/users/{user_id}")
    if response.status != 200:
        raise ValueError(f"User not found (Status: {response.status})")
    data = json.loads(response.read().decode("utf-8"))
    return data["name"]

# 1. Test Success scenario using Mock
mock_ok = Mock()
mock_ok.status = 200
mock_ok.read.return_value = b'{"id": 42, "name": "Deepak"}'

mock_transport = Mock(return_value=mock_ok)
result_name = fetch_user_name(mock_transport, 42)
print("Test Success: Extracted name =", result_name)
mock_transport.assert_called_once_with("/users/42")

# 2. Test Failure scenario
mock_fail = Mock()
mock_fail.status = 404
mock_transport_fail = Mock(return_value=mock_fail)

try:
    fetch_user_name(mock_transport_fail, 999)
except ValueError as err:
    print("Test Failure: Caught expected domain error ->", err)`,
          code_language: 'python',
          code_explanation: 'Demonstrates using unittest.mock.Mock to test success and failure paths of an API parser without making actual network requests.',
          expected_output: `Test Success: Extracted name = Deepak
Test Failure: Caught expected domain error -> User not found (Status: 404)`,
          quiz: {
            id: 'quiz-mocking-http',
            title: 'Knowledge Check: Mocking HTTP',
            questions: [
              {
                id: 'q-mh-1',
                question_text: 'Why should unit tests mock HTTP calls rather than calling live endpoints?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Live endpoints are required for unit testing.' },
                  { id: 'opt_2', text: 'Mocking ensures tests are fast, deterministic, repeatable offline, and do not consume rate limits.' },
                  { id: 'opt_3', text: 'Python disables network connections during pytest runs.' },
                  { id: 'opt_4', text: 'Mocks automatically fix bugs in production.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Mocking decouples unit tests from external internet conditions, ensuring consistent and fast test suite execution.'
              }
            ]
          },
          key_takeaways: [
            'Never make live network calls in automated unit tests.',
            'Use unittest.mock.Mock to simulate response objects and status codes.',
            'Assert that the transport was called with the exact expected endpoint.'
          ],
          revision_prompts: [
            'What is the difference between unit testing an API client and integration testing it?',
            'How can unittest.mock.patch be used to intercept urllib.request.urlopen?'
          ]
        },

        // Lesson 10
        {
          id: 'les-building-reliable-api-client',
          slug: 'building-reliable-api-client',
          title: 'Building a Reliable API Client Architecture',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 10,
          summary: 'Encapsulate networking, authentication, error boundaries, and serialization into a production-grade ApiClient class.',
          learning_objectives: [
            'Design an object-oriented ApiClient class encapsulating baseUrl and headers',
            'Implement centralized request dispatching with timeout and error translation',
            'Expose clean domain methods like client.get_user(id) to callers'
          ],
          content_markdown: `### The ApiClient Architecture

Raw HTTP calls scattered across application code create maintenance nightmares when endpoints change. 

A dedicated **API Client** class:
1. Stores the \`base_url\` and authentication credentials in one place.
2. Encapsulates header generation, timeouts, and JSON serialization.
3. Translates raw HTTP status codes into domain exceptions.
4. Exposes clear, high-level business methods (\`get_user()\`, \`create_order()\`).`,
          code_snippet: `import json

class ApiClientError(Exception):
    """Base exception for API client failures."""
    pass

class RevoraaApiClient:
    def __init__(self, base_url, api_key, transport=None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        # Configurable transport enables mock injection for unit testing
        self.transport = transport

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def get_course(self, course_id):
        endpoint = f"{self.base_url}/courses/{course_id}"
        if self.transport:
            status, raw_body = self.transport("GET", endpoint, self._headers())
        else:
            # Fallback to simulated offline response
            status, raw_body = 200, '{"id": 101, "title": "Advanced Python"}'

        if status == 404:
            raise ApiClientError(f"Course {course_id} not found")
        elif status != 200:
            raise ApiClientError(f"API request failed with status {status}")

        return json.loads(raw_body)

# Instantiating and executing client
client = RevoraaApiClient("https://api.revoraa.dev/v1", "key_secret_123")
course = client.get_course(101)
print("Client successfully fetched course:")
print("  ID:   ", course["id"])
print("  Title:", course["title"])`,
          code_language: 'python',
          code_explanation: 'Implements an object-oriented API client encapsulating authentication headers, URL generation, and error checking with dependency injection for testing.',
          expected_output: `Client successfully fetched course:
  ID:    101
  Title: Advanced Python`,
          quiz: {
            id: 'quiz-api-client-architecture',
            title: 'Knowledge Check: API Client Design',
            questions: [
              {
                id: 'q-aca-1',
                question_text: 'What is the primary benefit of encapsulating HTTP requests inside an ApiClient class?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It automatically bypasses API rate limits.' },
                  { id: 'opt_2', text: 'It centralizes authentication, error handling, and URL construction while exposing domain methods.' },
                  { id: 'opt_3', text: 'It allows HTTP requests to run without Python.' },
                  { id: 'opt_4', text: 'It prevents the need for JSON parsing.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A client class decouples the rest of the application from raw HTTP mechanics, headers, and endpoint URLs.'
              }
            ]
          },
          key_takeaways: [
            'Encapsulate API interaction inside dedicated client classes.',
            'Support transport injection to enable fast, offline unit testing.',
            'Expose high-level domain methods rather than raw URLs.'
          ],
          revision_prompts: [
            'How can an ApiClient class implement automatic token refreshing when encountering a 401 response?',
            'What is the benefit of mapping JSON dictionaries into dataclass instances before returning to callers?'
          ]
        }
      ]
    }
  ]
};
