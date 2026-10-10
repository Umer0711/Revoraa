/**
 * Revoraa Level 3: Intermediate Python Gen Z Challenges
 *
 * Implements interactive challenge modes:
 * - Cooked or Cracked: Generator exhaustion & single-pass iteration
 * - Bug Hunt: Decorator wrapper argument forwarding & return omission
 * - Internet Is Wrong: In-place .sort() vs sorted() return value myth
 * - Boss Fight: Memory-efficient streaming log aggregator combining generators & dictionaries
 * - Code Escape Room: Multi-stage closure vault security token generator
 */

export const LEVEL_3_CHALLENGES = [
  {
    id: 'chal-l3-01-gen-exhaust',
    slug: 'cooked-or-cracked-generator',
    path_slug: 'python-development',
    level_number: 3,
    module_slug: 'iterators-and-generators',
    title: 'Cooked or Cracked: The Ghost Generator',
    challenge_type: 'cooked_or_cracked',
    difficulty: 'intermediate',
    xp_reward: 60,
    tagline: 'Single-Pass Iteration & Generator Exhaustion',
    instructions: {
      en: 'Inspect the code snippet below. Determine whether each print statement outputs items or empty lists due to generator exhaustion. Run the code to verify your mental model, then submit your diagnosis.',
      'hi-Latn': 'Neeche diye gaye generator snippet ko dekhein. Pehli pass aur doosri pass ke results predict karein. Generator exhaust hone par kya print hota hai? Run karke confirm karein.',
      hi: 'नीचे दिए गए जनरेटर कोड का निरीक्षण करें। निर्धारित करें कि प्रत्येक प्रिंट स्टेटमेंट जनरेटर निकास के कारण क्या आउटपुट देता है। कोड चलाकर सत्यापित करें।'
    },
    starter_code: `# Cooked or Cracked: What prints on Pass 1 vs Pass 2?
def square_stream(numbers):
    for n in numbers:
        yield n * n

gen = square_stream([1, 2, 3])

pass_1 = list(gen)
pass_2 = list(gen)

print(f"Pass 1: {pass_1}")
print(f"Pass 2: {pass_2}")
print(f"Equal?: {pass_1 == pass_2}")`,
    expected_output: `Pass 1: [1, 4, 9]
Pass 2: []
Equal?: False`,
    hints: {
      en: [
        'Generators are one-way streams that produce values lazily on demand.',
        'Once a generator yields its final item and raises StopIteration, it is permanently exhausted.'
      ],
      'hi-Latn': [
        'Generators single-pass streams hote hain jo on-demand values generate karte hain.',
        'Ek baar pura consume hone ke baad generator empty ho jata hai, isliye pass_2 empty list [] return karta hai.'
      ],
      hi: [
        'जनरेटर एकतरफा स्ट्रीम हैं जो मांग पर मान उत्पन्न करते हैं।',
        'एक बार पूरी तरह से उपयोग किए जाने के बाद, जनरेटर स्थायी रूप से समाप्त हो जाता है।'
      ]
    },
    solution_explanation: {
      en: 'Generators maintain internal execution state. `list(gen)` in Pass 1 consumes all yielded values until StopIteration. Pass 2 attempts to iterate over the exhausted generator, immediately encountering StopIteration and producing `[]`. Hence, `pass_1 == pass_2` is False.',
      'hi-Latn': 'Generator internal state yaad rakhta hai. Pass 1 mein `list(gen)` saare items consume kar leta hai. Pass 2 mein generator already empty hota hai, isliye `[]` milta hai aur `Equal?` False aata hai.',
      hi: 'जनरेटर आंतरिक निष्पादन स्थिति बनाए रखते हैं। पहली बार में सारे मान समाप्त हो जाते हैं, इसलिए दूसरी बार में खाली सूची मिलती है।'
    }
  },

  {
    id: 'chal-l3-02-decorator-bug',
    slug: 'bug-hunt-decorator-scope',
    path_slug: 'python-development',
    level_number: 3,
    module_slug: 'functions-closures-decorators',
    title: 'Bug Hunt: The Vanishing Return Value',
    challenge_type: 'bug_hunt',
    difficulty: 'intermediate',
    xp_reward: 70,
    tagline: 'Fix Wrapper Signatures & Missing Returns',
    instructions: {
      en: 'A developer wrote a `@log_call` decorator to print function invocations, but decorated functions now return `None` and fail when called with keyword arguments! Fix both bugs inside `wrapper`.',
      'hi-Latn': 'Ek developer ne `@log_call` decorator banaya, lekin decorated function ab `None` return kar raha hai aur keyword arguments accept nahi karta! `wrapper` ke andar dono bugs ko fix karein.',
      hi: 'एक डेवलपर ने `@log_call` डेकोरेटर लिखा, लेकिन डेकोरेटेड फ़ंक्शन अब `None` लौटाता है और कीवर्ड तर्कों के साथ विफल हो जाता है! दोनों बग ठीक करें।'
    },
    starter_code: `import functools

def log_call(func):
    # BUG: Missing *args, **kwargs and return statement!
    @functools.wraps(func)
    def wrapper():
        print(f"Calling {func.__name__}")
        func()
    return wrapper

@log_call
def multiply(a, b, multiplier=1):
    return (a * b) * multiplier

# Expected: multiply(3, 4, multiplier=2) == 24
result = multiply(3, 4, multiplier=2)
print("Result:", result)`,
    test_harness: `
assert multiply(3, 4, multiplier=2) == 24, f"Expected 24, got {multiply(3, 4, multiplier=2)}"
assert multiply(5, 5) == 25, f"Expected 25, got {multiply(5, 5)}"
assert multiply.__name__ == "multiply", "functools.wraps must preserve original function name"
print("ALL TESTS PASSED: Decorator bug successfully squashed! 🎯")`,
    hints: {
      en: [
        'The wrapper must accept `*args, **kwargs` to forward any positional and keyword arguments.',
        'The wrapper must return the result of `func(*args, **kwargs)`.'
      ],
      'hi-Latn': [
        '`def wrapper(*args, **kwargs):` likhein taaki saare arguments pass ho sakein.',
        '`return func(*args, **kwargs)` statement add karein taaki original function ka result caller tak pahuche.'
      ],
      hi: [
        'रैपर को `*args, **kwargs` स्वीकार करना चाहिए।',
        '`return func(*args, **kwargs)` वापस करना सुनिश्चित करें।'
      ]
    },
    solution_explanation: {
      en: 'Decorators wrapping arbitrary functions must declare `*args, **kwargs` in the wrapper signature and forward them to the target function. Crucially, the wrapper must `return func(*args, **kwargs)` so the caller receives the computed value rather than implicit `None`.',
      'hi-Latn': 'Wrapper function ko generic banana padta hai `*args, **kwargs` use karke, aur function ka return value explicitly return karna zaroori hai warna caller ko `None` milta hai.',
      hi: 'डेकोरेटर रैपर को मनमाने तर्कों के लिए `*args, **kwargs` स्वीकार करना चाहिए और परिणाम वापस लौटाना चाहिए।'
    }
  },

  {
    id: 'chal-l3-03-sort-myth',
    slug: 'internet-is-wrong-sort-return',
    path_slug: 'python-development',
    level_number: 3,
    module_slug: 'advanced-data-structures',
    title: 'Internet Is Wrong: In-Place Sort vs sorted()',
    challenge_type: 'internet_is_wrong',
    difficulty: 'intermediate',
    xp_reward: 65,
    tagline: 'Debunking the .sort() Return Value Trap',
    instructions: {
      en: 'A popular coding blog claims that `records = records.sort(key=...)` sorts a list and reassigns the sorted list. This crashes production with `NoneType has no attribute`. Refactor `get_top_students(records)` using either proper in-place sorting or `sorted()`.',
      'hi-Latn': 'Ek viral post claim karta hai ki `records = records.sort()` se sorted list assign hoti hai. Ye bohot bada trap hai kyunki `.sort()` hamesha `None` return karta hai! `get_top_students` function ko fix karein.',
      hi: 'एक ब्लॉग का दावा है कि `records = records.sort()` से क्रमबद्ध सूची मिलती है। `.sort()` हमेशा `None` लौटाता है! फ़ंक्शन को ठीक करें।'
    },
    starter_code: `# Fix the .sort() return value trap
def get_top_students(students, top_n=2):
    # DEFECT: .sort() modifies in-place and returns None!
    # Reassigning students = students.sort() destroys the list!
    sorted_students = students.sort(key=lambda s: s["score"], reverse=True)
    return sorted_students[:top_n]

sample = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 90}
]

print(get_top_students(sample))`,
    test_harness: `
data = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 95},
    {"name": "Charlie", "score": 90}
]
res = get_top_students(data, top_n=2)
assert res is not None, "get_top_students must not return None!"
assert len(res) == 2, f"Expected 2 students, got {len(res)}"
assert res[0]["name"] == "Bob" and res[0]["score"] == 95, "First should be Bob"
assert res[1]["name"] == "Charlie" and res[1]["score"] == 90, "Second should be Charlie"
print("ALL TESTS PASSED: Myth debunked and code fixed! ⚡")`,
    hints: {
      en: [
        'Either use the built-in `sorted(students, key=..., reverse=True)` which returns a new list, or call `students.sort(...)` on its own line without assignment.'
      ],
      'hi-Latn': [
        'Built-in `sorted(students, key=..., reverse=True)` use karein jo nayi list return karta hai, ya fir `students.sort(...)` ko alag line mein call karein bina kisi variable mein assign kiye.'
      ],
      hi: [
        'अंतर्निहित `sorted(...)` का उपयोग करें जो एक नई सूची लौटाता है, या अलग लाइन पर `.sort()` चलाएं।'
      ]
    },
    solution_explanation: {
      en: 'In Python, `list.sort()` is strictly an in-place mutating method that returns `None` by design to prevent accidental mutation ambiguity. Assigning its result rebinds the name to `None`. Using `sorted()` creates a new sorted list cleanly.',
      'hi-Latn': 'Python mein `list.sort()` in-place change karta hai aur hamesha `None` return karta hai. Assignment karne se variable `None` ban jata hai. Pure function ke liye `sorted()` use karna chahiye.',
      hi: 'पायथन में `list.sort()` हमेशा `None` लौटाता है। परिणाम असाइन करने से वेरिएबल नष्ट हो जाता है। `sorted()` का उपयोग करें।'
    }
  },

  {
    id: 'chal-l3-04-boss-stream',
    slug: 'boss-fight-streamed-log-aggregator',
    path_slug: 'python-development',
    level_number: 3,
    module_slug: 'iterators-and-generators',
    title: 'Boss Fight: Memory-Efficient Log Streamer',
    challenge_type: 'boss_fight',
    difficulty: 'intermediate',
    xp_reward: 95,
    tagline: 'Process Streaming Logs Without Memory Bloat',
    instructions: {
      en: 'Defeat the Boss! Implement `stream_error_counts(log_lines)`. Given an iterable of raw log strings formatted as `"TIMESTAMP [LEVEL] SERVICE: MESSAGE"`, write a generator pipeline that: 1) strips whitespace and skips empty lines, 2) filters only `"ERROR"` and `"CRITICAL"` lines, 3) yields `(service_name, message)` tuples lazily, and 4) provides a summary function `summarize_errors(log_lines)` returning `{service: count}`.',
      'hi-Latn': 'Boss Fight! Streaming Log Analyzer banayein. Generator functions use karke sirf "ERROR" aur "CRITICAL" lines filter karein aur lazily `(service, message)` yield karein. Phir `summarize_errors` mein `{service: count}` dictionary return karein.',
      hi: 'बॉस फाइट! मेमोरी-कुशल लॉग स्ट्रीमर बनाएं। जनरेटर पाइपलाइन का उपयोग करके केवल "ERROR" और "CRITICAL" लॉग प्रोसेस करें और सारांश डिक्शनरी बनाएं।'
    },
    starter_code: `def parse_log_stream(lines):
    """Yields (service, message) for ERROR and CRITICAL logs only."""
    for line in lines:
        cleaned = line.strip()
        if not cleaned:
            continue
        # Format: "2026-10-10 [ERROR] auth_service: Invalid token"
        if "[ERROR]" in cleaned or "[CRITICAL]" in cleaned:
            parts = cleaned.split("] ", 1)
            if len(parts) == 2:
                svc_msg = parts[1].split(": ", 1)
                service = svc_msg[0].strip()
                message = svc_msg[1].strip() if len(svc_msg) > 1 else ""
                yield (service, message)

def summarize_errors(lines):
    """Returns a dictionary of error counts per service."""
    counts = {}
    for service, _ in parse_log_stream(lines):
        counts[service] = counts.get(service, 0) + 1
    return counts

# Sample execution
logs = [
    "2026-10-10 [INFO] auth_service: Login ok",
    "2026-10-10 [ERROR] auth_service: Bad password",
    "2026-10-10 [CRITICAL] payment_service: Gateway down",
    "2026-10-10 [ERROR] auth_service: Timeout",
    ""
]

print(summarize_errors(logs))`,
    test_harness: `
test_logs = [
    "2026-10-10 [INFO] auth_service: Login ok",
    "2026-10-10 [ERROR] auth_service: Bad password",
    "2026-10-10 [CRITICAL] payment_service: Gateway down",
    "2026-10-10 [ERROR] auth_service: Rate limit exceeded",
    "2026-10-10 [WARNING] cache_service: Key miss",
    "2026-10-10 [CRITICAL] db_service: Connection pool exhausted"
]
stream = parse_log_stream(test_logs)
import types
assert isinstance(stream, types.GeneratorType), "parse_log_stream must be a lazy generator function!"
summary = summarize_errors(test_logs)
assert summary.get("auth_service") == 2, f"auth_service expected 2 errors, got {summary.get('auth_service')}"
assert summary.get("payment_service") == 1, f"payment_service expected 1 error, got {summary.get('payment_service')}"
assert summary.get("db_service") == 1, f"db_service expected 1 error, got {summary.get('db_service')}"
assert "cache_service" not in summary, "WARNING logs must not be included in error summary!"
print("ALL TESTS PASSED: Boss Defeated! Streaming Pipeline Verified! ⚔️")`,
    hints: {
      en: [
        'Ensure `parse_log_stream` uses `yield (service, message)` so it returns a generator.',
        'Split the log string by `"] "` to isolate the service and message, then count occurrences in `summarize_errors`.'
      ],
      'hi-Latn': [
        '`parse_log_stream` mein `yield` use karein taaki wo pure memory mein list na banaye balki lazy generator rahe.',
        '`summarize_errors` mein dictionary `.get(service, 0) + 1` pattern use karke counts aggregate karein.'
      ],
      hi: [
        'सुनिश्चित करें कि `parse_log_stream` जनरेटर के रूप में `yield` का उपयोग करता है।',
        'सेवा अनुसार त्रुटियों की गणना के लिए डिक्शनरी का उपयोग करें।'
      ]
    },
    solution_explanation: {
      en: 'Combining generator pipelines with dictionary aggregation enables streaming gigabytes of log files with constant O(1) memory overhead, processing lines lazily as they are read.',
      'hi-Latn': 'Generator pipeline aur dictionary counting ko combine karne se GBs of logs ko bina memory fill kiye O(1) space mein lazily process kiya ja sakta hai.',
      hi: 'जनरेटर पाइपलाइन और डिक्शनरी काउंटिंग को जोड़कर विशाल लॉग फ़ाइलों को न्यूनतम मेमोरी में प्रोसेस किया जा सकता है।'
    }
  },

  {
    id: 'chal-l3-05-escape-room',
    slug: 'escape-room-decorator-vault',
    path_slug: 'python-development',
    level_number: 3,
    module_slug: 'functions-closures-decorators',
    title: 'Code Escape Room: The Decorator Vault',
    challenge_type: 'code_escape_room',
    difficulty: 'intermediate',
    xp_reward: 100,
    tagline: 'Solve 3 Security Chambers to Escape',
    instructions: {
      en: 'You are trapped in the Secure Python Vault! To unlock the blast doors, you must complete three chambers: 1) Implement a closure counter `create_gate_keeper(passcode)` that unlocks only after 3 consecutive correct tries, 2) Write an `@audit_shield` decorator that records call attempts, and 3) Connect both to extract the final `VAULT_TOKEN`.',
      'hi-Latn': 'Python Vault Escape Room! Blast doors unlock karne ke liye 3 chambers solve karein: 1) Closure counter jo 3 correct attempts ke baad gate open kare, 2) `@audit_shield` decorator jo calls audit kare, aur 3) Vault access token generate karein.',
      hi: 'पायथन वॉल्ट से बाहर निकलें! तीन कक्षों को पूरा करें: क्लोजर काउंटर, ऑडिट शील्ड डेकोरेटर, और अंतिम सुरक्षा टोकन प्राप्त करें।'
    },
    starter_code: `def create_gate_keeper(secret_passcode):
    """Chamber 1: Closure holding private attempt counter."""
    attempts = 0
    def unlock(code):
        nonlocal attempts
        if code == secret_passcode:
            attempts += 1
            if attempts >= 3:
                return "ACCESS_GRANTED"
            return f"VERIFIED_{attempts}_OF_3"
        attempts = 0
        return "ACCESS_DENIED"
    return unlock

def audit_shield(func):
    """Chamber 2: Decorator maintaining total invocation log."""
    history = []
    def wrapper(*args, **kwargs):
        res = func(*args, **kwargs)
        history.append((args, res))
        return res
    wrapper.get_history = lambda: list(history)
    return wrapper

# Chamber 3: Combine both to reach the token
keeper = audit_shield(create_gate_keeper("OMEGA_KEY"))
print("Attempt 1:", keeper("OMEGA_KEY"))
print("Attempt 2:", keeper("OMEGA_KEY"))
print("Attempt 3:", keeper("OMEGA_KEY"))`,
    test_harness: `
keeper_fn = create_gate_keeper("SECRET_123")
assert keeper_fn("WRONG") == "ACCESS_DENIED"
assert keeper_fn("SECRET_123") == "VERIFIED_1_OF_3"
assert keeper_fn("SECRET_123") == "VERIFIED_2_OF_3"
assert keeper_fn("SECRET_123") == "ACCESS_GRANTED"

shielded = audit_shield(keeper_fn)
ans = shielded("SECRET_123")
hist = shielded.get_history()
assert len(hist) >= 1, "audit_shield must track invocations"
print("ALL TESTS PASSED: Vault unlocked! You have escaped! 🗝️✨")`,
    hints: {
      en: [
        'Use `nonlocal attempts` inside the inner closure so modifying `attempts` persists across calls.',
        'Attach `wrapper.get_history` as an attribute function to inspect the closure history list.'
      ],
      'hi-Latn': [
        'Inner closure mein `nonlocal attempts` use karein taaki counter reset na ho.',
        'Wrapper function par `.get_history` lambda attach karein jo recorded history return kare.'
      ],
      hi: [
        'क्लोजर के अंदर `nonlocal attempts` का उपयोग करें ताकि स्थिति बनी रहे।',
        'इतिहास की जांच के लिए फ़ंक्शन विशेषता जोड़ें।'
      ]
    },
    solution_explanation: {
      en: 'Chamber 1 leverages lexical closures and the `nonlocal` keyword to encapsulate private state without a class. Chamber 2 demonstrates higher-order function decoration and function attribute reflection.',
      'hi-Latn': 'Chamber 1 `nonlocal` closure state encapsulation demonstrate karta hai bina kisi OOP class ke. Chamber 2 higher-order decorator aur function introspection sikhata hai.',
      hi: 'यह चुनौती लेक्सिकल क्लोजर, नॉन-लोकल स्थिति और उच्च-स्तरीय डेकोरेटर पैटर्न को जोड़ती है।'
    }
  }
];
