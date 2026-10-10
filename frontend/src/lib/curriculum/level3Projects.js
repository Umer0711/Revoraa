/**
 * Revoraa Level 3: Intermediate Python - Guided Projects Dataset
 * 
 * 8 comprehensive, milestone-driven projects aligned directly with Modules 1 to 8.
 * Each project includes 4 progressive milestones with starter code, assertions,
 * and translations in English, Hinglish, and Hindi.
 */

export const LEVEL_3_PROJECTS = [
  // ─── Module 1 Project: Student Records Analyzer ─────────────────────────────
  {
    id: 'proj-03-student-analyzer',
    slug: 'student-records-analyzer',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Student Records Analyzer',
    tagline: 'Aggregate, sort, and analyze complex academic datasets',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Process complex nested student transcripts, calculate statistics (mean, median, top subject performers), and implement multi-criteria sorting using custom tuple keys.',
      'hi-Latn': 'Nested student records ko process karein, subject statistics calculate karein aur tuple keys ke saath multi-criteria sorting implement karein.',
      hi: 'नेस्टेड छात्र रिकॉर्ड को प्रोसेस करें, आँकड़ों की गणना करें और कस्टम टुपल कीज़ का उपयोग करके बहु-मानदंड सॉर्टिंग लागू करें।'
    },
    learning_objectives: [
      'Parse and sanitize nested dictionary records',
      'Compute aggregate statistics using collections.defaultdict',
      'Sort records by multiple criteria (GPA descending, name ascending)',
      'Produce clean formatted reports'
    ],
    milestones: [
      {
        id: 'm1-clean-records',
        title: 'Milestone 1: Clean and Normalize Transcripts',
        instructions: {
          en: 'Implement `normalize_student(record)` returning a dict with keys `id`, `name` (trimmed), and `grades` (dict mapping subject to list of float scores). Filter out any negative scores.',
          'hi-Latn': '`normalize_student(record)` banayein jo `id`, trimmed `name`, aur valid non-negative `grades` return kare.',
          hi: '`normalize_student(record)` लागू करें जो रिकॉर्ड को साफ़ करे और केवल मान्य गैर-ऋणात्मक स्कोर रखे।'
        },
        starter_code: `def normalize_student(raw_record):
    clean_name = raw_record["name"].strip()
    clean_grades = {}
    for subject, scores in raw_record.get("grades", {}).items():
        clean_grades[subject] = [float(s) for s in scores if s >= 0]
    return {
        "id": raw_record["id"],
        "name": clean_name,
        "grades": clean_grades
    }`,
        test_harness: `
raw = {"id": 1, "name": "  Aarav  ", "grades": {"math": [90, -5, 85], "cs": [100]}}
res = normalize_student(raw)
assert res["name"] == "Aarav"
assert res["grades"]["math"] == [90.0, 85.0]
assert res["grades"]["cs"] == [100.0]
print("MILESTONE 1 VERIFIED: Student normalization passed!")`
      },
      {
        id: 'm2-calculate-gpa',
        title: 'Milestone 2: Subject Aggregations & GPA',
        instructions: {
          en: 'Implement `calculate_gpa(grades_dict)` returning the average score across all subjects rounded to 2 decimals. If no scores exist, return 0.0.',
          'hi-Latn': '`calculate_gpa(grades_dict)` implement karein jo saare subjects ka overall average score 2 decimal places tak calculate kare.',
          hi: '`calculate_gpa(grades_dict)` लागू करें जो सभी विषयों के औसत स्कोर की गणना करे।'
        },
        starter_code: `def calculate_gpa(grades_dict):
    all_scores = [s for score_list in grades_dict.values() for s in score_list]
    if not all_scores:
        return 0.0
    return round(sum(all_scores) / len(all_scores), 2)`,
        test_harness: `
grades = {"math": [90.0, 80.0], "cs": [100.0]}
gpa = calculate_gpa(grades)
assert gpa == 90.0
assert calculate_gpa({}) == 0.0
print("MILESTONE 2 VERIFIED: GPA calculation verified!")`
      },
      {
        id: 'm3-multi-sort',
        title: 'Milestone 3: Multi-Criteria Ranking',
        instructions: {
          en: 'Implement `rank_students(students_list)` sorting students by overall GPA descending, then by name alphabetically ascending in case of GPA ties.',
          'hi-Latn': '`rank_students(students_list)` implement karein jo students ko GPA descending aur tie hone par name ascending sort kare.',
          hi: '`rank_students` लागू करें जो छात्रों को GPA अवरोही और नाम आरोही क्रम में रैंक करे।'
        },
        starter_code: `def rank_students(students_list):
    return sorted(students_list, key=lambda s: (-calculate_gpa(s["grades"]), s["name"]))`,
        test_harness: `
s1 = {"name": "Bob", "grades": {"m": [80.0]}}
s2 = {"name": "Alice", "grades": {"m": [90.0]}}
s3 = {"name": "Charlie", "grades": {"m": [90.0]}}
ranked = rank_students([s1, s2, s3])
assert [s["name"] for s in ranked] == ["Alice", "Charlie", "Bob"]
print("MILESTONE 3 VERIFIED: Multi-criteria ranking verified!")`
      },
      {
        id: 'm4-subject-leaderboard',
        title: 'Milestone 4: Top Subject Performers',
        instructions: {
          en: 'Implement `find_top_performer(students_list, subject)` returning the student with the highest average in that subject. Return None if no students took the subject.',
          'hi-Latn': '`find_top_performer(students_list, subject)` banayein jo kisi subject mein highest average score wale student ko return kare.',
          hi: '`find_top_performer` लागू करें जो किसी विषय में सर्वोच्च औसत वाले छात्र को लौटाए।'
        },
        starter_code: `def find_top_performer(students_list, subject):
    best_student = None
    best_avg = -1.0
    for s in students_list:
        scores = s.get("grades", {}).get(subject, [])
        if scores:
            avg = sum(scores) / len(scores)
            if avg > best_avg:
                best_avg = avg
                best_student = s
    return best_student`,
        test_harness: `
st1 = {"name": "Ananya", "grades": {"physics": [85.0]}}
st2 = {"name": "Dev", "grades": {"physics": [98.0]}}
top = find_top_performer([st1, st2], "physics")
assert top["name"] == "Dev"
assert find_top_performer([st1], "history") is None
print("MILESTONE 4 VERIFIED: Project 1 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 2 Project: Lazy Data Processing Pipeline ────────────────────────
  {
    id: 'proj-04-lazy-pipeline',
    slug: 'lazy-data-processing-pipeline',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Lazy Data Processing Pipeline',
    tagline: 'Construct memory-efficient generator streams for streaming records',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Build a multi-stage streaming data pipeline that parses, filters, enriches, and aggregates streaming log events without loading entire datasets into memory.',
      'hi-Latn': 'Generator streams ka use karke multi-stage data processing pipeline banayein jo log records ko bina memory overload kiye process kare.',
      hi: 'जेनरेटर स्ट्रीम का उपयोग करके एक मल्टी-स्टेज डेटा प्रोसेसिंग पाइपलाइन बनाएं जो मेमोरी कुशल हो।'
    },
    learning_objectives: [
      'Design chained generator functions with yield',
      'Filter and transform streams on demand',
      'Calculate window aggregations in O(1) memory',
      'Prevent iterator exhaustion traps'
    ],
    milestones: [
      {
        id: 'm1-log-reader',
        title: 'Milestone 1: Stream Reader Generator',
        instructions: {
          en: 'Implement `stream_lines(text_data)` yielding non-empty stripped lines one at a time.',
          'hi-Latn': '`stream_lines(text_data)` generator banayein jo non-empty lines ko strip karke yield kare.',
          hi: '`stream_lines` जेनरेटर लागू करें जो गैर-रिक्त लाइनों को स्ट्रिप करके लौटाए।'
        },
        starter_code: `def stream_lines(text_data):
    for line in text_data.splitlines():
        trimmed = line.strip()
        if trimmed:
            yield trimmed`,
        test_harness: `
data = "line 1\\n\\n  line 2  \\n\\nline 3"
gen = stream_lines(data)
assert list(gen) == ["line 1", "line 2", "line 3"]
print("MILESTONE 1 VERIFIED: Stream reader generator verified!")`
      },
      {
        id: 'm2-log-parser',
        title: 'Milestone 2: Log Parser Generator',
        instructions: {
          en: 'Implement `parse_log_events(lines_stream)` converting strings formatted as "TIMESTAMP LEVEL MSG" into dicts `{"timestamp": ..., "level": ..., "msg": ...}`.',
          'hi-Latn': '`parse_log_events(lines_stream)` generator banayein jo raw strings ko structured dicts mein convert kare.',
          hi: '`parse_log_events` लागू करें जो लॉग लाइनों को पार्स करके डिक्शनरी में बदले।'
        },
        starter_code: `def parse_log_events(lines_stream):
    for line in lines_stream:
        parts = line.split(" ", 2)
        if len(parts) == 3:
            yield {"timestamp": parts[0], "level": parts[1], "msg": parts[2]}`,
        test_harness: `
lines = ["2026-10-10 INFO Started", "2026-10-10 ERROR Crash"]
events = list(parse_log_events(lines))
assert len(events) == 2
assert events[1]["level"] == "ERROR" and events[1]["msg"] == "Crash"
print("MILESTONE 2 VERIFIED: Log parser generator verified!")`
      },
      {
        id: 'm3-level-filter',
        title: 'Milestone 3: Streaming Filter Stage',
        instructions: {
          en: 'Implement `filter_by_level(events_stream, target_level)` yielding only events matching `target_level`.',
          'hi-Latn': '`filter_by_level(events_stream, target_level)` generator banayein jo target severity level ke records yield kare.',
          hi: '`filter_by_level` लागू करें जो केवल लक्षित स्तर के इवेंट्स को फ़िल्टर करे।'
        },
        starter_code: `def filter_by_level(events_stream, target_level):
    for evt in events_stream:
        if evt["level"] == target_level:
            yield evt`,
        test_harness: `
evts = [{"level": "INFO"}, {"level": "ERROR"}, {"level": "INFO"}]
errors = list(filter_by_level(evts, "ERROR"))
assert len(errors) == 1 and errors[0]["level"] == "ERROR"
print("MILESTONE 3 VERIFIED: Level filtering stage verified!")`
      },
      {
        id: 'm4-pipeline-reducer',
        title: 'Milestone 4: Pipeline Aggregator',
        instructions: {
          en: 'Implement `count_errors_in_stream(raw_text)` connecting `stream_lines -> parse_log_events -> filter_by_level("ERROR")` and returning the count.',
          'hi-Latn': '`count_errors_in_stream(raw_text)` pipeline function banayein jo saare generator stages ko link karke error count return kare.',
          hi: '`count_errors_in_stream` लागू करें जो तीनों जेनरेटर चरणों को जोड़कर त्रुटियों की कुल संख्या लौटाए।'
        },
        starter_code: `def count_errors_in_stream(raw_text):
    lines = stream_lines(raw_text)
    events = parse_log_events(lines)
    errors = filter_by_level(events, "ERROR")
    count = 0
    for _ in errors:
        count += 1
    return count`,
        test_harness: `
raw = "10:00 INFO Up\\n10:01 ERROR DB fail\\n10:02 INFO Heartbeat\\n10:03 ERROR Socket close"
total_errs = count_errors_in_stream(raw)
assert total_errs == 2
print("MILESTONE 4 VERIFIED: Project 2 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 3 Project: Reusable Function Utilities ──────────────────────────
  {
    id: 'proj-05-function-utilities',
    slug: 'reusable-function-utilities',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Reusable Function Utilities',
    tagline: 'Engineer higher-order decorators for latency timing, retry, and memoization',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Build a production-grade utility library of composable decorators including latency timers, automatic retry policies, and memory-efficient result caching.',
      'hi-Latn': 'Production-ready decorator utilities banayein jisme timing, exception retries aur memoization caching supported ho.',
      hi: 'पुन: प्रयोज्य डेकोरेटर लाइब्रेरी बनाएं जिसमें टाइमिंग, रिट्राई और मेमोइज़ेशन शामिल हो।'
    },
    learning_objectives: [
      'Preserve introspection metadata with functools.wraps',
      'Build parameterized decorators with 3-tier architectures',
      'Implement custom memoization caches with stats tracking'
    ],
    milestones: [
      {
        id: 'm1-metadata-wrapper',
        title: 'Milestone 1: Metadata-Preserving Call Counter',
        instructions: {
          en: 'Build `@count_calls` decorator that increments `fn.call_count` every time `fn` is called and preserves `__name__` and `__doc__` using `@wraps`.',
          'hi-Latn': '`@count_calls` decorator banayein jo har execution par `call_count` track kare aur metadata preserve kare.',
          hi: '`@count_calls` डेकोरेटर बनाएं जो कॉल की संख्या ट्रैक करे और मेटाडेटा सुरक्षित रखे।'
        },
        starter_code: `from functools import wraps

def count_calls(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.call_count += 1
        return fn(*args, **kwargs)
    wrapper.call_count = 0
    return wrapper`,
        test_harness: `
@count_calls
def add(a, b):
    """Add two numbers."""
    return a + b

assert add(2, 3) == 5
assert add(10, 20) == 30
assert add.call_count == 2
assert add.__name__ == "add"
assert add.__doc__ == "Add two numbers."
print("MILESTONE 1 VERIFIED: Metadata call counter passed!")`
      },
      {
        id: 'm2-retry-decorator',
        title: 'Milestone 2: Parameterized Retry Decorator',
        instructions: {
          en: 'Implement `@retry(max_attempts=3)` catching exceptions and retrying up to `max_attempts` before allowing the exception to raise.',
          'hi-Latn': '`@retry(max_attempts=3)` parameterized decorator banayein jo exception aane par retry kare.',
          hi: '`@retry` डेकोरेटर लागू करें जो विफलता पर अधिकतम प्रयासों तक पुनः प्रयास करे।'
        },
        starter_code: `from functools import wraps

def retry(max_attempts=3):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            last_err = None
            for _ in range(max_attempts):
                try:
                    return fn(*args, **kwargs)
                except Exception as err:
                    last_err = err
            raise last_err
        return wrapper
    return decorator`,
        test_harness: `
attempts = 0
@retry(max_attempts=3)
def unstable_network():
    global attempts
    attempts += 1
    if attempts < 3:
        raise ConnectionError("Timeout")
    return "SUCCESS"

assert unstable_network() == "SUCCESS"
assert attempts == 3
print("MILESTONE 2 VERIFIED: Retry decorator verified!")`
      },
      {
        id: 'm3-memoize-cache',
        title: 'Milestone 3: Memoization Caching Decorator',
        instructions: {
          en: 'Implement `@memoize` caching return values based on positional arguments `args`. Include `wrapper.cache_hits` count.',
          'hi-Latn': '`@memoize` caching decorator banayein jo previous results store kare aur `cache_hits` track kare.',
          hi: '`@memoize` कैशिंग डेकोरेटर बनाएं जो परिणामों को स्टोर करे और कैश हिट ट्रैक करे।'
        },
        starter_code: `from functools import wraps

def memoize(fn):
    cache = {}
    @wraps(fn)
    def wrapper(*args):
        if args in cache:
            wrapper.cache_hits += 1
            return cache[args]
        res = fn(*args)
        cache[args] = res
        return res
    wrapper.cache_hits = 0
    return wrapper`,
        test_harness: `
calls = 0
@memoize
def fib(n):
    global calls
    calls += 1
    return n if n < 2 else n * 2

fib(5)
fib(5)
fib(5)
assert calls == 1
assert fib.cache_hits == 2
print("MILESTONE 3 VERIFIED: Memoization cache verified!")`
      },
      {
        id: 'm4-type-validator',
        title: 'Milestone 4: Argument Type Enforcement',
        instructions: {
          en: 'Implement `@require_types(*expected_types)` checking that positional arguments match the specified types, raising `TypeError` on mismatch.',
          'hi-Latn': '`@require_types(*expected_types)` decorator banayein jo arguments ke types verify kare aur galat hone par TypeError raise kare.',
          hi: '`@require_types` डेकोरेटर लागू करें जो तर्कों के प्रकारों की पुष्टि करे।'
        },
        starter_code: `from functools import wraps

def require_types(*expected_types):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for arg, exp_type in zip(args, expected_types):
                if not isinstance(arg, exp_type):
                    raise TypeError(f"Expected {exp_type.__name__}, got {type(arg).__name__}")
            return fn(*args, **kwargs)
        return wrapper
    return decorator`,
        test_harness: `
@require_types(int, str)
def format_item(count, name):
    return f"{count}x {name}"

assert format_item(5, "Apples") == "5x Apples"
try:
    format_item("five", "Apples")
    assert False, "Should have raised TypeError"
except TypeError:
    pass
print("MILESTONE 4 VERIFIED: Project 3 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 4 Project: Data Transformation Toolkit ──────────────────────────
  {
    id: 'proj-06-transform-toolkit',
    slug: 'data-transformation-toolkit',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Data Transformation Toolkit',
    tagline: 'Functional data cleansing, filtering, indexing, and pivot transformations',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Construct a reusable functional transformation toolkit to clean raw records, build multi-key index maps with dict comprehensions, and generate pivot aggregations.',
      'hi-Latn': 'Functional programming concepts se data transformation toolkit banayein jisme clean, index aur pivot tables generate ho sakein.',
      hi: 'फ़ंक्शनल डेटा ट्रांसफ़ॉर्मेशन टूलकिट बनाएं जो डेटा को साफ़, अनुक्रमित और सारांशित करे।'
    },
    learning_objectives: [
      'Write pure functions without side effects',
      'Build nested dictionaries using dictionary comprehensions',
      'Create composable predicate filtering engines'
    ],
    milestones: [
      {
        id: 'm1-clean-schema',
        title: 'Milestone 1: Pure Schema Cleanser',
        instructions: {
          en: 'Implement `cleanse_record(record)` returning a new dict with trimmed strings and float numbers, leaving the original record unmodified.',
          'hi-Latn': '`cleanse_record(record)` pure function banayein jo strings ko trim kare aur numbers ko float banaye bina input mutate kiye.',
          hi: '`cleanse_record` शुद्ध फ़ंक्शन लागू करें जो इनपुट को बदले बिना रिकॉर्ड को साफ़ करे।'
        },
        starter_code: `def cleanse_record(rec):
    cleaned = {}
    for k, v in rec.items():
        if isinstance(v, str):
            cleaned[k] = v.strip()
        elif isinstance(v, (int, float)):
            cleaned[k] = float(v)
        else:
            cleaned[k] = v
    return cleaned`,
        test_harness: `
orig = {"user": "  kiran ", "score": 42}
cleaned = cleanse_record(orig)
assert cleaned["user"] == "kiran" and cleaned["score"] == 42.0
assert orig["user"] == "  kiran " # Proves immutability
print("MILESTONE 1 VERIFIED: Pure schema cleanser verified!")`
      },
      {
        id: 'm2-index-builder',
        title: 'Milestone 2: Multi-Field Lookup Indexer',
        instructions: {
          en: 'Implement `build_index(records, key_field)` using a dict comprehension to map `record[key_field]` to the full record.',
          'hi-Latn': 'Dict comprehension ka use karke `build_index(records, key_field)` banayein jo rapid lookup index tayyar kare.',
          hi: 'डिक्शनरी समझ का उपयोग करके `build_index` लागू करें जो तेज़ लुकअप इंडेक्स तैयार करे।'
        },
        starter_code: `def build_index(records, key_field):
    return {r[key_field]: r for r in records if key_field in r}`,
        test_harness: `
items = [{"sku": "A10", "price": 5}, {"sku": "B20", "price": 10}]
idx = build_index(items, "sku")
assert idx["A10"]["price"] == 5
assert "B20" in idx
print("MILESTONE 2 VERIFIED: Index builder verified!")`
      },
      {
        id: 'm3-composable-filter',
        title: 'Milestone 3: Composable Predicate Filtering',
        instructions: {
          en: 'Implement `filter_all(records, *predicates)` returning only records that satisfy every single predicate function.',
          'hi-Latn': '`filter_all(records, *predicates)` banayein jo saare predicate functions ko satisfy karne wale records filter kare.',
          hi: '`filter_all` लागू करें जो सभी प्रेडिकेट फ़ंक्शंस को संतुष्ट करने वाले रिकॉर्ड्स लौटाए।'
        },
        starter_code: `def filter_all(records, *predicates):
    return [r for r in records if all(p(r) for p in predicates)]`,
        test_harness: `
recs = [{"active": True, "score": 90}, {"active": False, "score": 95}, {"active": True, "score": 40}]
res = filter_all(recs, lambda r: r["active"], lambda r: r["score"] >= 80)
assert len(res) == 1 and res[0]["score"] == 90
print("MILESTONE 3 VERIFIED: Composable filtering verified!")`
      },
      {
        id: 'm4-pivot-summarizer',
        title: 'Milestone 4: Pivot Category Summarizer',
        instructions: {
          en: 'Implement `summarize_by_category(records, cat_field, val_field)` returning a dict mapping each category to its sum of values.',
          'hi-Latn': '`summarize_by_category(records, cat_field, val_field)` banayein jo categories ke mutabik values ka sum nikale.',
          hi: '`summarize_by_category` लागू करें जो प्रत्येक श्रेणी के मानों का योग निकाले।'
        },
        starter_code: `def summarize_by_category(records, cat_field, val_field):
    summary = {}
    for r in records:
        cat = r.get(cat_field, "Unknown")
        val = r.get(val_field, 0.0)
        summary[cat] = summary.get(cat, 0.0) + val
    return summary`,
        test_harness: `
data = [
    {"dept": "Sales", "revenue": 100},
    {"dept": "IT", "revenue": 50},
    {"dept": "Sales", "revenue": 75}
]
summ = summarize_by_category(data, "dept", "revenue")
assert summ["Sales"] == 175.0 and summ["IT"] == 50.0
print("MILESTONE 4 VERIFIED: Project 4 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 5 Project: API Explorer ─────────────────────────────────────────
  {
    id: 'proj-07-api-explorer',
    slug: 'api-explorer',
    path_slug: 'python-development',
    level_number: 3,
    title: 'API Explorer',
    tagline: 'Build an API client with mock transport, retry policy, and pagination',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Construct a resilient REST API client featuring dependency-injected mock transports, status code classification, exponential backoff error translation, and paginated record traversal.',
      'hi-Latn': 'Resilient REST API client banayein jisme mock transport, error handling, status classification aur pagination support ho.',
      hi: 'एक मजबूत REST API क्लाइंट बनाएं जिसमें मॉक ट्रांसपोर्ट, त्रुटि प्रबंधन और पेजिनेशन शामिल हो।'
    },
    learning_objectives: [
      'Design testable HTTP clients using transport abstraction',
      'Translate HTTP status codes to domain exceptions',
      'Traverse paginated endpoints with generator streams'
    ],
    milestones: [
      {
        id: 'm1-mock-transport',
        title: 'Milestone 1: Deterministic Transport Adapter',
        instructions: {
          en: 'Implement `MockHttpTransport` storing endpoint routes in a dict and returning `(status, body_str)` for registered URLs.',
          'hi-Latn': '`MockHttpTransport` class banayein jo URL routes ko map kare aur register kiye gaye status aur body return kare.',
          hi: '`MockHttpTransport` लागू करें जो पंजीकृत एंडपॉइंट्स के लिए मॉक स्थिति और बॉडी लौटाए।'
        },
        starter_code: `class MockHttpTransport:
    def __init__(self):
        self.routes = {}

    def register(self, endpoint, status_code, body_str):
        self.routes[endpoint] = (status_code, body_str)

    def request(self, method, endpoint, headers=None):
        if endpoint in self.routes:
            return self.routes[endpoint]
        return 404, '{"error": "Endpoint Not Found"}'`,
        test_harness: `
t = MockHttpTransport()
t.register("/items", 200, '{"data": [1, 2]}')
status, body = t.request("GET", "/items")
assert status == 200 and "data" in body
status_404, _ = t.request("GET", "/unknown")
assert status_404 == 404
print("MILESTONE 1 VERIFIED: Mock transport adapter verified!")`
      },
      {
        id: 'm2-client-builder',
        title: 'Milestone 2: Request URL and Headers Builder',
        instructions: {
          en: 'Implement `build_request_url(base_url, endpoint, params_dict)` encoding query params cleanly.',
          'hi-Latn': '`build_request_url(base_url, endpoint, params_dict)` implement karein jo URL parameters ko properly encode kare.',
          hi: '`build_request_url` लागू करें जो क्वेरी पैरामीटर्स को साफ़-सुथरे ढंग से एनकोड करे।'
        },
        starter_code: `from urllib.parse import urlencode

def build_request_url(base_url, endpoint, params=None):
    clean_base = base_url.rstrip("/")
    clean_ep = "/" + endpoint.lstrip("/")
    url = f"{clean_base}{clean_ep}"
    if params:
        url += f"?{urlencode(params)}"
    return url`,
        test_harness: `
u = build_request_url("https://api.test.com/", "/search", {"q": "python & dsa"})
assert u == "https://api.test.com/search?q=python+%26+dsa"
print("MILESTONE 2 VERIFIED: URL builder verified!")`
      },
      {
        id: 'm3-error-classifier',
        title: 'Milestone 3: HTTP Error Classifier',
        instructions: {
          en: 'Implement `validate_response(status_code, body_str)` parsing JSON on 200, and raising `NotFoundError` on 404 or `RateLimitError` on 429.',
          'hi-Latn': '`validate_response(status_code, body_str)` banayein jo 200 par JSON parse kare, 404 par NotFoundError aur 429 par RateLimitError raise kare.',
          hi: '`validate_response` लागू करें जो स्थिति कोड के अनुसार सही अपवाद उठाए।'
        },
        starter_code: `import json

class NotFoundError(Exception): pass
class RateLimitError(Exception): pass

def validate_response(status_code, body_str):
    if status_code == 404:
        raise NotFoundError("Resource not found")
    elif status_code == 429:
        raise RateLimitError("Rate limit exceeded")
    elif 200 <= status_code < 300:
        return json.loads(body_str)
    raise RuntimeError(f"Unexpected status code: {status_code}")`,
        test_harness: `
data = validate_response(200, '{"ok": true}')
assert data["ok"] is True
try:
    validate_response(404, "")
    assert False, "Should raise NotFoundError"
except NotFoundError:
    pass
print("MILESTONE 3 VERIFIED: Error classifier verified!")`
      },
      {
        id: 'm4-paginated-client',
        title: 'Milestone 4: Paginated API Client Class',
        instructions: {
          en: 'Build `ApiClient` wrapping transport and implement `stream_all_pages(endpoint)` yielding items from all pages until `has_more` is False.',
          'hi-Latn': '`ApiClient` class banayein jo `stream_all_pages(endpoint)` generator ke through saare pages ke items yield kare.',
          hi: '`ApiClient` क्लास बनाएं जो सभी पेजों के माध्यम से आइटम्स को स्ट्रीम करे।'
        },
        starter_code: `class ApiClient:
    def __init__(self, transport):
        self.transport = transport

    def stream_all_pages(self, endpoint):
        page = 1
        while True:
            ep = f"{endpoint}?page={page}"
            status, body = self.transport.request("GET", ep)
            data = validate_response(status, body)
            for item in data.get("items", []):
                yield item
            if not data.get("has_more", False):
                break
            page += 1`,
        test_harness: `
trans = MockHttpTransport()
trans.register("/users?page=1", 200, '{"items": ["A", "B"], "has_more": true}')
trans.register("/users?page=2", 200, '{"items": ["C"], "has_more": false}')
client = ApiClient(trans)
items = list(client.stream_all_pages("/users"))
assert items == ["A", "B", "C"]
print("MILESTONE 4 VERIFIED: Project 5 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 6 Project: Personal Expense Tracker ─────────────────────────────
  {
    id: 'proj-08-expense-tracker',
    slug: 'personal-expense-tracker',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Personal Expense Tracker',
    tagline: 'Build an ACID SQLite database repository with safe parameterized queries',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Develop an automated database-backed personal finance tracker using SQLite, parameterized queries to prevent SQL injection, transactional integrity, and category aggregation queries.',
      'hi-Latn': 'SQLite database use karke personal expense tracker banayein jisme SQL injection prevention, transactions aur analytics query shamil hon.',
      hi: 'SQLite का उपयोग करके एक व्यक्तिगत व्यय ट्रैकर बनाएं जिसमें सुरक्षित SQL क्वेरी और लेन-देन सुरक्षा हो।'
    },
    learning_objectives: [
      'Initialize relational schemas with SQLite constraints',
      'Execute safe parameterized INSERT, SELECT, and UPDATE queries',
      'Implement atomic transactions with rollback protection',
      'Write database unit tests against in-memory databases'
    ],
    milestones: [
      {
        id: 'm1-db-schema',
        title: 'Milestone 1: Database Schema Initialization',
        instructions: {
          en: 'Implement `init_expense_db(conn)` creating an `expenses` table with `id INTEGER PRIMARY KEY`, `category TEXT NOT NULL`, `amount REAL NOT NULL CHECK(amount > 0)`, and `created_at TEXT`.',
          'hi-Latn': '`init_expense_db(conn)` banayein jo `expenses` table create kare valid constraints ke saath.',
          hi: '`init_expense_db` लागू करें जो सभी प्रतिबंधों के साथ व्यय तालिका बनाए।'
        },
        starter_code: `def init_expense_db(conn):
    conn.execute("""
    CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL CHECK(amount > 0),
        created_at TEXT NOT NULL
    );
    """)
    conn.commit()`,
        test_harness: `
import sqlite3
c = sqlite3.connect(":memory:")
init_expense_db(c)
cur = c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='expenses'")
assert cur.fetchone() is not None
print("MILESTONE 1 VERIFIED: Database schema initialized!")`
      },
      {
        id: 'm2-insert-expense',
        title: 'Milestone 2: Safe Parameterized Insertion',
        instructions: {
          en: 'Implement `add_expense(conn, category, amount, date_str)` inserting a record using parameterized SQL and returning the new row ID.',
          'hi-Latn': '`add_expense(conn, category, amount, date_str)` banayein jo parameterized query se record insert kare aur new ID return kare.',
          hi: '`add_expense` लागू करें जो पैरामीटराइज्ड SQL का उपयोग करके रिकॉर्ड जोड़े।'
        },
        starter_code: `def add_expense(conn, category, amount, date_str):
    with conn:
        cur = conn.execute(
            "INSERT INTO expenses (category, amount, created_at) VALUES (?, ?, ?)",
            (category.strip(), float(amount), date_str)
        )
        return cur.lastrowid`,
        test_harness: `
row_id = add_expense(c, "Food", 18.50, "2026-10-10")
assert row_id == 1
cur = c.execute("SELECT amount FROM expenses WHERE id = 1")
assert cur.fetchone()[0] == 18.50
print("MILESTONE 2 VERIFIED: Safe parameterized insert verified!")`
      },
      {
        id: 'm3-batch-transaction',
        title: 'Milestone 3: Atomic Batch Import with Rollback',
        instructions: {
          en: 'Implement `batch_import_expenses(conn, expense_tuples)` inserting records in a transaction. If any record has amount <= 0, roll back the entire batch and raise ValueError.',
          'hi-Latn': '`batch_import_expenses(conn, expense_tuples)` banayein jo atomic transaction mein insert kare aur invalid amount par rollback kare.',
          hi: '`batch_import_expenses` लागू करें जो परमाणु लेनदेन में रिकॉर्ड डाले और त्रुटि पर रोलबैक करे।'
        },
        starter_code: `def batch_import_expenses(conn, items):
    try:
        with conn:
            for cat, amt, dt in items:
                if amt <= 0:
                    raise ValueError("Amount must be positive")
                conn.execute(
                    "INSERT INTO expenses (category, amount, created_at) VALUES (?, ?, ?)",
                    (cat, amt, dt)
                )
    except Exception:
        raise`,
        test_harness: `
bad_items = [("Fuel", 40.0, "2026-10-10"), ("Bad", -10.0, "2026-10-10")]
try:
    batch_import_expenses(c, bad_items)
    assert False, "Should raise ValueError"
except ValueError:
    pass
cur = c.execute("SELECT COUNT(*) FROM expenses WHERE category = 'Fuel'")
assert cur.fetchone()[0] == 0 # Proves rollback!
print("MILESTONE 3 VERIFIED: Transaction rollback verified!")`
      },
      {
        id: 'm4-category-analytics',
        title: 'Milestone 4: Category Spending Analytics',
        instructions: {
          en: 'Implement `get_category_totals(conn)` returning a dictionary mapping category names to total spent.',
          'hi-Latn': '`get_category_totals(conn)` banayein jo SQL GROUP BY se category-wise totals calculate kare.',
          hi: '`get_category_totals` लागू करें जो श्रेणीवार कुल खर्च की गणना करे।'
        },
        starter_code: `def get_category_totals(conn):
    cur = conn.execute("""
    SELECT category, SUM(amount) as total 
    FROM expenses 
    GROUP BY category
    """)
    return {row[0]: row[1] for row in cur.fetchall()}`,
        test_harness: `
add_expense(c, "Food", 20.0, "2026-10-10")
add_expense(c, "Travel", 50.0, "2026-10-10")
totals = get_category_totals(c)
assert totals["Food"] == 38.50 and totals["Travel"] == 50.0
print("MILESTONE 4 VERIFIED: Project 6 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 7 Project: Modular Task Manager ─────────────────────────────────
  {
    id: 'proj-09-modular-tasks',
    slug: 'modular-task-manager',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Modular Task Manager',
    tagline: 'Deconstruct a monolith into 3 clean architectural layers with dependency injection',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Architect a clean, modular application separating Data Models, Repository Persistence, Business Logic Services, and Presentation CLI Controllers using dependency injection.',
      'hi-Latn': 'Clean 3-tier architecture implement karein jisme Presentation, Business Logic aur Storage layers decoupled hon.',
      hi: 'डेटा मॉडल, रिपॉजिटरी, बिजनेस लॉजिक और सीएलआई को अलग करते हुए एक साफ मॉड्यूलर आर्किटेक्चर बनाएं।'
    },
    learning_objectives: [
      'Eliminate tight coupling using dependency injection',
      'Decouple persistence from business validation',
      'Design cohesive modules with clear single responsibilities'
    ],
    milestones: [
      {
        id: 'm1-task-model',
        title: 'Milestone 1: Domain Task Model',
        instructions: {
          en: 'Implement `TaskModel` dataclass with `id: int`, `title: str`, `priority: str`, and `done: bool = False`. Validate that priority is "low", "medium", or "high".',
          'hi-Latn': '`TaskModel` dataclass banayein jisme priority validation ("low", "medium", "high") shamil ho.',
          hi: '`TaskModel` डेटाक्लास लागू करें जो प्राथमिकता की पुष्टि करे।'
        },
        starter_code: `from dataclasses import dataclass

@dataclass
class TaskModel:
    id: int
    title: str
    priority: str
    done: bool = False

    def __post_init__(self):
        if self.priority not in ("low", "medium", "high"):
            raise ValueError(f"Invalid priority: {self.priority}")`,
        test_harness: `
t = TaskModel(1, "Test Task", "high")
assert t.done is False
try:
    TaskModel(2, "Invalid", "urgent")
    assert False, "Should raise ValueError"
except ValueError:
    pass
print("MILESTONE 1 VERIFIED: Domain Task model verified!")`
      },
      {
        id: 'm2-task-repo',
        title: 'Milestone 2: Task Repository Layer',
        instructions: {
          en: 'Implement `TaskRepository` storing tasks in an internal dict with methods `save(task)` and `get_by_id(task_id)`.',
          'hi-Latn': '`TaskRepository` class banayein jo `save` aur `get_by_id` methods provide kare.',
          hi: '`TaskRepository` लागू करें जो डेटा स्टोर और फेच करे।'
        },
        starter_code: `class TaskRepository:
    def __init__(self):
        self._items = {}

    def save(self, task):
        self._items[task.id] = task
        return task

    def get_by_id(self, task_id):
        return self._items.get(task_id)`,
        test_harness: `
repo = TaskRepository()
repo.save(t)
assert repo.get_by_id(1).title == "Test Task"
assert repo.get_by_id(99) is None
print("MILESTONE 2 VERIFIED: Task repository verified!")`
      },
      {
        id: 'm3-task-service',
        title: 'Milestone 3: Business Logic Service Layer',
        instructions: {
          en: 'Implement `TaskService(repo)` with `create_task(id, title, priority)` validating title length >= 3 and saving via repo.',
          'hi-Latn': '`TaskService(repo)` implement karein jo title length validate karke repo ke through task create kare.',
          hi: '`TaskService` लागू करें जो टाइटल की लंबाई की पुष्टि करे।'
        },
        starter_code: `class TaskService:
    def __init__(self, repo):
        self.repo = repo

    def create_task(self, task_id, title, priority="medium"):
        clean_title = title.strip()
        if len(clean_title) < 3:
            raise ValueError("Title must be at least 3 characters")
        task = TaskModel(id=task_id, title=clean_title, priority=priority)
        return self.repo.save(task)`,
        test_harness: `
srv = TaskService(repo)
res = srv.create_task(10, "Ship Feature", "low")
assert res.title == "Ship Feature"
try:
    srv.create_task(11, "no")
    assert False, "Should raise ValueError"
except ValueError:
    pass
print("MILESTONE 3 VERIFIED: Task service layer verified!")`
      },
      {
        id: 'm4-app-controller',
        title: 'Milestone 4: Presentation CLI Controller',
        instructions: {
          en: 'Implement `TaskCliController(service)` with `dispatch(command_str)` returning formatted status strings.',
          'hi-Latn': '`TaskCliController(service)` banayein jo user commands ko parse karke service call kare aur status return kare.',
          hi: '`TaskCliController` लागू करें जो कमांड को पार्स करके स्थिति लौटाए।'
        },
        starter_code: `class TaskCliController:
    def __init__(self, service):
        self.service = service

    def dispatch(self, cmd_line):
        parts = cmd_line.strip().split()
        if not parts:
            return "ERROR: Empty command"
        action = parts[0].lower()
        if action == "add":
            # format: add <id> <priority> <title...>
            if len(parts) < 4:
                return "ERROR: Usage: add <id> <priority> <title>"
            try:
                t_id = int(parts[1])
                priority = parts[2]
                title = " ".join(parts[3:])
                task = self.service.create_task(t_id, title, priority)
                return f"SUCCESS: Task {task.id} created"
            except ValueError as err:
                return f"ERROR: {err}"
        return f"ERROR: Unknown action {action}"`,
        test_harness: `
cli = TaskCliController(srv)
msg = cli.dispatch("add 20 high Review Architecture")
assert msg == "SUCCESS: Task 20 created"
assert repo.get_by_id(20).priority == "high"
err_msg = cli.dispatch("add 21 high ok")
assert "at least 3 characters" in err_msg
print("MILESTONE 4 VERIFIED: Project 7 Successfully Completed! 🎓")`
      }
    ]
  },

  // ─── Module 8 Project: Repair and Test a Broken Python Package ───────────────
  {
    id: 'proj-10-repair-package',
    slug: 'repair-and-test-broken-package',
    path_slug: 'python-development',
    level_number: 3,
    title: 'Repair and Test a Broken Python Package',
    tagline: 'Diagnose defects, fix implementation bugs, and build a complete unittest suite',
    difficulty: 'intermediate',
    estimated_hours: 6,
    xp_reward: 250,
    is_published: true,
    description: {
      en: 'Take a deliberately flawed intermediate Python package with mutable defaults, unhandled exceptions, and leaky resource handles. Diagnose each defect, fix the implementation, and write regression tests proving 100% reliability.',
      'hi-Latn': 'Flawed Python package ke bugs (mutable defaults, off-by-one errors) diagnose karein, unhe fix karein aur comprehensive test suite likhein.',
      hi: 'एक त्रुटिपूर्ण पैकेज के दोषों का निदान करें, उन्हें ठीक करें और पूर्ण स्वचालित टेस्ट सूट लिखें।'
    },
    learning_objectives: [
      'Diagnose runtime defects using stack traces and assertions',
      'Fix mutable default argument and off-by-one bugs',
      'Write isolated unit tests using unittest and assertRaises',
      'Prove regression safety with automated tests'
    ],
    milestones: [
      {
        id: 'm1-diagnose-mutable-default',
        title: 'Milestone 1: Fix Mutable Default Argument Defect',
        instructions: {
          en: 'Fix `append_to_bucket(item, bucket=None)` so calls do not share the same list instance across invocations.',
          'hi-Latn': '`append_to_bucket(item, bucket=None)` ka mutable default argument bug fix karein taaki calls ek doosre ki list share na karein.',
          hi: '`append_to_bucket` में परिवर्तनीय डिफ़ॉल्ट तर्क दोष को ठीक करें।'
        },
        starter_code: `def append_to_bucket(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`,
        test_harness: `
b1 = append_to_bucket("A")
b2 = append_to_bucket("B")
assert b1 == ["A"]
assert b2 == ["B"]
assert b1 is not b2
print("MILESTONE 1 VERIFIED: Mutable default defect resolved!")`
      },
      {
        id: 'm2-fix-off-by-one',
        title: 'Milestone 2: Fix Off-by-One Pagination Slice',
        instructions: {
          en: 'Fix `paginate_items(items, page, page_size)` returning items for the 1-indexed page. (e.g. page 1 size 2 -> items[0:2]).',
          'hi-Latn': '`paginate_items(items, page, page_size)` ka off-by-one boundary bug fix karein.',
          hi: '`paginate_items` में ऑफ-बाय-वन पेजिनेशन दोष को ठीक करें।'
        },
        starter_code: `def paginate_items(items, page=1, page_size=10):
    if page < 1 or page_size < 1:
        raise ValueError("Page and page_size must be >= 1")
    start = (page - 1) * page_size
    end = start + page_size
    return items[start:end]`,
        test_harness: `
dataset = [1, 2, 3, 4, 5]
p1 = paginate_items(dataset, page=1, page_size=2)
p2 = paginate_items(dataset, page=2, page_size=2)
assert p1 == [1, 2]
assert p2 == [3, 4]
print("MILESTONE 2 VERIFIED: Off-by-one pagination fixed!")`
      },
      {
        id: 'm3-fix-resource-leak',
        title: 'Milestone 3: Fix Resource Leak with Context Manager',
        instructions: {
          en: 'Implement `safe_database_count(conn)` using `with conn:` to ensure query executes and rolls back cleanly on error.',
          'hi-Latn': '`safe_database_count(conn)` ko context manager use karke secure karein taaki resource leak na ho.',
          hi: '`safe_database_count` को संदर्भ प्रबंधक से सुरक्षित करें।'
        },
        starter_code: `def safe_database_count(conn, table_name="test_data"):
    with conn:
        cur = conn.execute(f"SELECT COUNT(*) FROM {table_name}")
        return cur.fetchone()[0]`,
        test_harness: `
import sqlite3
c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE test_data (id INT)")
c.execute("INSERT INTO test_data VALUES (1)")
assert safe_database_count(c) == 1
c.close()
print("MILESTONE 3 VERIFIED: Resource leak resolved!")`
      },
      {
        id: 'm4-full-regression-suite',
        title: 'Milestone 4: Complete Automated Test Suite',
        instructions: {
          en: 'Write `TestPackageSuite(unittest.TestCase)` verifying that all 3 fixed functions pass their assertions and handle error cases.',
          'hi-Latn': '`unittest.TestCase` test suite likhein jo teeno fixed functions ke normal aur error cases ko verify kare.',
          hi: 'पूर्ण टेस्ट सूट लिखें जो सभी निश्चित फ़ंक्शंस की पुष्टि करे।'
        },
        starter_code: `import unittest

class TestPackageSuite(unittest.TestCase):
    def test_bucket_isolation(self):
        self.assertNotEqual(id(append_to_bucket(1)), id(append_to_bucket(2)))

    def test_pagination_bounds(self):
        with self.assertRaises(ValueError):
            paginate_items([1, 2], page=0)

    def test_pagination_success(self):
        self.assertEqual(paginate_items(["a", "b", "c"], 1, 2), ["a", "b"])`,
        test_harness: `
suite = unittest.TestLoader().loadTestsFromTestCase(TestPackageSuite)
runner = unittest.TextTestRunner(verbosity=1)
res = runner.run(suite)
assert res.wasSuccessful() and res.testsRun == 3
print("MILESTONE 4 VERIFIED: Project 8 Successfully Completed! 🎓")`
      }
    ]
  }
];
