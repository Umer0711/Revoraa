/**
 * Revoraa Level 4: Advanced Python Gen Z Challenges
 *
 * Implements interactive challenge modes:
 * - Cooked or Cracked: Unawaited coroutine return value vs coroutine object
 * - Bug Hunt: Garbage collection of unreferenced asyncio.create_task background jobs
 * - Internet Is Wrong: The myth that "The GIL makes Python code completely thread-safe"
 * - Boss Fight: Resilient Multi-Stage Pipeline with Circuit Breaker and Exponential Backoff
 * - Code Escape Room: Cooperative Async Vault Chamber Synchronization
 */

export const LEVEL_4_CHALLENGES = [
  {
    id: 'chal-l4-01-unawaited-coro',
    slug: 'cooked-or-cracked-async-loop',
    path_slug: 'python-development',
    level_number: 4,
    module_slug: 'asynchronous-programming-asyncio',
    title: 'Cooked or Cracked: The Ghost Coroutine',
    challenge_type: 'cooked_or_cracked',
    difficulty: 'advanced',
    xp_reward: 70,
    tagline: 'Unawaited Coroutines & Event Loop Scheduling',
    instructions: {
      en: 'Inspect the code snippet below. Determine what each print statement actually prints when a coroutine function is invoked without the `await` keyword. Run the code to verify your mental model.',
      'hi-Latn': 'Neeche diye gaye async snippet ko dekhein. Jab coroutine function bina `await` ke call hota hai to kya output aata hai? Run karke confirm karein.',
      hi: 'नीचे दिए गए कोड का निरीक्षण करें। निर्धारित करें कि बिना await के कोरोटिन को कॉल करने पर क्या प्रिंट होता है।'
    },
    starter_code: `# Cooked or Cracked: What prints when calling async def without await?
import asyncio

async def fetch_user():
    return {"name": "Aarav", "role": "Architect"}

async def main():
    val = fetch_user()  # No await!
    print(f"Type: {type(val).__name__}")
    print(f"Is Dict: {isinstance(val, dict)}")
    
    # Now await properly:
    actual = await val
    print(f"Actual: {actual['name']}")

asyncio.run(main())`,
    expected_output: `Type: coroutine
Is Dict: False
Actual: Aarav`,
    hints: {
      en: [
        'Calling an `async def` function creates a coroutine object; it does not execute the function body immediately.',
        'The coroutine body only runs when scheduled and awaited on an active event loop.'
      ],
      'hi-Latn': [
        '`async def` function ko call karne par coroutine object banta hai, function body execute nahi hoti.',
        'Function body tabhi execute hoti hai jab usse event loop par `await` kiya jaye.'
      ],
      hi: [
        '`async def` को कॉल करने पर एक कोरोटिन ऑब्जेक्ट बनता है, फ़ंक्शन तुरंत निष्पादित नहीं होता।',
        'यह केवल तभी निष्पादित होता है जब इसे सक्रिय इवेंट लूप पर await किया जाए।'
      ]
    },
    solution_explanation: {
      en: 'In Python, calling a coroutine function `fetch_user()` returns a coroutine object immediately without executing the function bytecode. Python will emit a RuntimeWarning if the object is garbage-collected without ever being awaited. Once `await val` is executed, the event loop runs the coroutine to completion and returns the actual dictionary.',
      'hi-Latn': 'Python mein `fetch_user()` call karne par turant ek coroutine object return hota hai, code execute nahi hota. Jab `await val` karte hain, tab event loop usse execute karke real dict data return karta hai.',
      hi: 'पायथन में कोरोटिन फ़ंक्शन को कॉल करने पर तुरंत एक कोरोटिन ऑब्जेक्ट मिलता है। जब इसे await किया जाता है, तभी वास्तविक कोड निष्पादित होता है।'
    }
  },

  {
    id: 'chal-l4-02-task-gc-leak',
    slug: 'bug-hunt-task-gc',
    path_slug: 'python-development',
    level_number: 4,
    module_slug: 'asynchronous-programming-asyncio',
    title: 'Bug Hunt: The Vanishing Background Task',
    challenge_type: 'bug_hunt',
    difficulty: 'advanced',
    xp_reward: 80,
    tagline: 'Asyncio Task Garbage Collection Pitfall',
    instructions: {
      en: 'In Python 3.8+, "fire-and-forget" tasks created with `asyncio.create_task()` can disappear mid-execution if no strong reference is retained! Fix `JobManager` by tracking active tasks in a set and removing them on completion.',
      'hi-Latn': '`asyncio.create_task()` se bane tasks agar variable mein store na ho to Python GC unhe beech mein destroy kar deta hai! `JobManager` mein active tasks ko set mein track karein aur completion par discard karein.',
      hi: 'यदि संदर्भ सहेजा न जाए तो `asyncio.create_task` कचरा संग्रह (GC) द्वारा बीच में ही समाप्त हो सकता है! सक्रिय कार्यों को एक सेट में ट्रैक करके इस बग को ठीक करें।'
    },
    starter_code: `import asyncio

class JobManager:
    def __init__(self):
        # FIX: Track active tasks in a set to prevent GC collection!
        self.active_tasks = set()

    def launch_background_job(self, name: str):
        async def worker():
            await asyncio.sleep(0.01)
            print(f"JOB DONE: {name}")

        # BUG: The created task has no strong reference!
        # It needs to be added to self.active_tasks with an add_done_callback to remove it.
        task = asyncio.create_task(worker())
        self.active_tasks.add(task)
        task.add_done_callback(self.active_tasks.discard)
        return task

async def main():
    mgr = JobManager()
    t = mgr.launch_background_job("SyncTelemetry")
    await t
    print("All tasks completed successfully!")

asyncio.run(main())`,
    test_harness: `
async def verify():
    mgr = JobManager()
    t = mgr.launch_background_job("VerificationTask")
    assert t in mgr.active_tasks, "Task must be referenced in active_tasks to prevent GC!"
    await t
    assert t not in mgr.active_tasks, "Task must be removed from active_tasks after completion!"
    print("BUG HUNT VERIFIED: Background task GC protection passed!")

asyncio.run(verify())`,
    hints: {
      en: [
        'Python docs explicitly warn: asyncio only keeps weak references to tasks.',
        'Store tasks in a set `self.active_tasks.add(task)` and attach `task.add_done_callback(self.active_tasks.discard)`.'
      ],
      'hi-Latn': [
        'Python official docs warn karte hain ki asyncio tasks ke sirf weak references rakhta hai.',
        'Tasks ko `self.active_tasks` set mein add karein aur `task.add_done_callback(self.active_tasks.discard)` lagayein.'
      ],
      hi: [
        'पायथन दस्तावेज़ चेतावनी देते हैं कि asyncio केवल कमजोर संदर्भ रखता है।',
        'कार्यों को एक सेट में सहेजें और पूर्ण होने पर हटा दें।'
      ]
    },
    solution_explanation: {
      en: 'The event loop only holds weak references to tasks created by asyncio.create_task(). If a task is not referenced by user code, the Python garbage collector can destroy it while it is suspended at an await statement! Storing the task in a set and using `add_done_callback(self.active_tasks.discard)` ensures the task survives until it finishes cleanly.',
      'hi-Latn': 'Event loop sirf weak references rakhta hai. Agar task kisi set ya variable mein store na ho to GC usse sleep ya await ke dauran destroy kar deta hai. Set mein store karna production async systems mein mandatory hai.',
      hi: 'इवेंट लूप केवल कमजोर संदर्भ रखता है। सेट में संदर्भ सहेजने से कार्य समय से पहले नष्ट नहीं होता।'
    }
  },

  {
    id: 'chal-l4-03-gil-threadsafe-myth',
    slug: 'internet-is-wrong-gil-threadsafe',
    path_slug: 'python-development',
    level_number: 4,
    module_slug: 'threads-processes-concurrency',
    title: 'Internet Is Wrong: "The GIL Makes Threads Safe"',
    challenge_type: 'internet_is_wrong',
    difficulty: 'advanced',
    xp_reward: 75,
    tagline: 'Debunking the Myth that Python GIL Eliminates Race Conditions',
    instructions: {
      en: 'Social media posts often claim: "Because Python has a GIL, threads cannot run simultaneously, so multithreaded Python code is automatically thread-safe without locks!" Prove this myth wrong by running concurrent increments without a lock and showing the lost updates.',
      'hi-Latn': 'Internet par log bolte hain ki "GIL hone ki wajah se Python threads thread-safe hote hain aur locks ki zaroorat nahi hoti". Bina lock ke concurrent updates chala kar prove karein ki race condition ab bhi exist karti hai!',
      hi: 'साबित करें कि जीआईएल (GIL) होने के बावजूद पायथन थ्रेड्स स्वचालित रूप से थ्रेड-सुरक्षित नहीं होते हैं।'
    },
    starter_code: `import threading
import time

# Internet Myth: "The GIL protects shared variables!"
counter = 0

def unsafe_worker(iterations):
    global counter
    for _ in range(iterations):
        # Race condition! In CPython bytecode, this is 4 opcodes:
        # LOAD_GLOBAL, LOAD_CONST, BINARY_OP, STORE_GLOBAL
        # GIL thread switch can occur right between LOAD and STORE!
        c = counter
        time.sleep(0.00001)  # Trigger thread context switch
        counter = c + 1

t1 = threading.Thread(target=unsafe_worker, args=(50,))
t2 = threading.Thread(target=unsafe_worker, args=(50,))

t1.start()
t2.start()
t1.join()
t2.join()

print(f"Final Counter: {counter}")
print(f"Expected without race: 100")
print(f"Was there a race condition? {counter < 100}")`,
    expected_output: `Final Counter: 50
Expected without race: 100
Was there a race condition? True`,
    hints: {
      en: [
        'The GIL protects CPython C-level internal interpreter state, not Python user-level bytecode sequences.',
        'A single line `x += 1` translates to multiple bytecode instructions. Python can release the GIL between instructions!'
      ],
      'hi-Latn': [
        'GIL CPython interpreter ke internal C structures ko protect karta hai, aapke Python variables ko nahi.',
        '`counter += 1` 4 bytecodes mein execute hota hai. Python do bytecodes ke beech mein GIL release kar deta hai.'
      ],
      hi: [
        'जीआईएल दुभाषिया की आंतरिक स्थिति की रक्षा करता है, उपयोगकर्ता चर की नहीं।',
        'एक ऑपरेशन कई बाइटकोड में विभाजित होता है जहां थ्रेड स्विच हो सकता है।'
      ]
    },
    solution_explanation: {
      en: 'The Global Interpreter Lock (GIL) ensures that only one native OS thread executes Python bytecode at a time, protecting CPython memory structures like reference counts. However, thread switching occurs cooperatively every `sys.getswitchinterval()` (default 5ms) or whenever I/O occurs. Because `counter = counter + 1` requires multiple bytecodes, thread interleaving overwrites updates, leading to silent data corruption unless a `threading.Lock()` is used.',
      'hi-Latn': 'GIL sirf CPython ke C-level structures ko protect karta hai. Python level par bytecodes ke beech mein thread context switch hota hai, jisse shared variables corrupt ho jate hain. Thread-safety ke liye Lock use karna zaroori hai.',
      hi: 'जीआईएल केवल आंतरिक मेमोरी की रक्षा करता है। सुरक्षित समवर्ती प्रोग्रामिंग के लिए स्पष्ट लॉकिंग आवश्यक है।'
    }
  },

  {
    id: 'chal-l4-04-resilient-pipeline-boss',
    slug: 'boss-fight-resilient-pipeline',
    path_slug: 'python-development',
    level_number: 4,
    module_slug: 'reliable-pipelines-logging-error-handling',
    title: 'Boss Fight: The Resilient Pipeline Engine',
    challenge_type: 'boss_fight',
    difficulty: 'advanced',
    xp_reward: 120,
    tagline: 'Defeat Cascading Failures with Circuit Breaking and Idempotency',
    instructions: {
      en: 'Defeat the Cascading Outage boss! Implement `ResilientPipeline` that ingests messages, prevents duplicate execution via idempotency keys, and retries transient `ConnectionError` with exponential backoff up to 3 attempts, while failing immediately on `ValueError`.',
      'hi-Latn': 'Cascading Outage boss ko harayein! `ResilientPipeline` banayein jo idempotency key check kare, transient network errors par retry kare aur invalid data par fatal fail ho.',
      hi: 'कैस्केडिंग आउटेज बॉस को हराएं! एक लचीली पाइपलाइन बनाएं जो स्वचालित रूप से पुनः प्रयास करे और डुप्लिकेट से बचाए।'
    },
    starter_code: `class ResilientPipeline:
    def __init__(self, max_retries: int = 3):
        self.max_retries = max_retries
        self.processed_keys = set()
        self.results = {}

    def process(self, payload: dict, remote_service_fn) -> dict:
        key = payload.get("idempotency_key")
        if not key:
            raise ValueError("Missing idempotency_key")

        # 1. Idempotency Check
        if key in self.processed_keys:
            return {"status": "CACHED", "result": self.results[key]}

        # 2. Retries with Bounded Backoff
        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                res = remote_service_fn(payload)
                self.processed_keys.add(key)
                self.results[key] = res
                return {"status": "SUCCESS", "result": res, "attempts": attempt}
            except ConnectionError as err:
                last_error = err
                if attempt == self.max_retries:
                    raise
            except ValueError:
                # Fatal validation error, do not retry!
                raise

        raise last_error`,
    test_harness: `
pipe = ResilientPipeline(max_retries=3)

# Test 1: Transient failure recovery
attempts = 0
def flaky_api(p):
    nonlocal attempts
    attempts += 1
    if attempts < 2:
        raise ConnectionError("Timeout")
    return {"data": p["amount"] * 2}

r1 = pipe.process({"idempotency_key": "k1", "amount": 10}, flaky_api)
assert r1["status"] == "SUCCESS"
assert r1["attempts"] == 2
assert r1["result"]["data"] == 20

# Test 2: Idempotent repeat call
r2 = pipe.process({"idempotency_key": "k1", "amount": 10}, flaky_api)
assert r2["status"] == "CACHED"

# Test 3: Non-retryable error
def bad_api(p):
    raise ValueError("Bad schema")

try:
    pipe.process({"idempotency_key": "k2"}, bad_api)
    assert False, "Should raise ValueError immediately"
except ValueError:
    pass

print("BOSS FIGHT DEFEATED: Resilient Pipeline triumphed over cascading outages!")`,
    hints: {
      en: [
        'Check idempotency before performing expensive network operations.',
        'Catch ConnectionError for transient retries, but allow ValueError to bubble up immediately.'
      ],
      'hi-Latn': [
        'Network call karne se pehle idempotency key verify karein.',
        '`ConnectionError` par retry karein par `ValueError` par turant exception bubble karein.'
      ],
      hi: [
        'नेटवर्क कॉल से पहले हमेशा आइडमपोटेंसी की जांच करें।',
        'अस्थायी त्रुटियों पर पुनः प्रयास करें और घातक त्रुटियों पर तुरंत रुकें।'
      ]
    },
    solution_explanation: {
      en: 'The resilient pipeline checks idempotency first, short-circuiting duplicate work. When executing external network calls, it distinguishes between retryable errors (ConnectionError) and permanent logic errors (ValueError), preventing retry storms and guaranteeing at-most-once processing semantics.',
      'hi-Latn': 'Resilient pipeline sabse pehle idempotency key check karta hai. Transient network errors par retry karta hai aur fatal validation errors par turant fail hota hai, jisse cascading failures prevent hoti hain.',
      hi: 'यह पाइपलाइन डुप्लिकेट काम को रोकती है और नेटवर्क विफलता के दौरान सिस्टम को सुरक्षित रखती है।'
    }
  },

  {
    id: 'chal-l4-05-async-vault-escape',
    slug: 'escape-room-async-vault',
    path_slug: 'python-development',
    level_number: 4,
    module_slug: 'advanced-testing-and-architecture-validation',
    title: 'Code Escape Room: The Async Chamber Vault',
    challenge_type: 'code_escape_room',
    difficulty: 'advanced',
    xp_reward: 100,
    tagline: 'Coordinate 3 Coroutine Latches to Unlock the Vault',
    instructions: {
      en: 'You are locked inside the High-Security Async Vault! The vault door opens only when 3 asynchronous event triggers (`trigger_a`, `trigger_b`, and `trigger_c`) fire in cooperative unison within 50ms without blocking the event loop. Complete the async unlocking coordinator!',
      'hi-Latn': 'Aap Async Chamber Vault mein band hain! Vault door tabhi khulta hai jab 3 async events (`trigger_a`, `trigger_b`, `trigger_c`) bina event loop block kiye 50ms ke andar coordinate hokar trigger ho jayein. Unlocking coordinator ko pura karein!',
      hi: 'आप एक सुरक्षित अतुल्यकालिक वॉल्ट में बंद हैं! बिना इवेंट लूप को ब्लॉक किए तीनों ट्रिगर्स को समकालिक रूप से सक्रिय करके वॉल्ट खोलें।'
    },
    starter_code: `import asyncio

class AsyncVault:
    def __init__(self):
        self.stage_a = False
        self.stage_b = False
        self.stage_c = False

    async def trigger_a(self):
        await asyncio.sleep(0.005)
        self.stage_a = True
        return "KEY_A_ACTIVE"

    async def trigger_b(self):
        await asyncio.sleep(0.008)
        self.stage_b = True
        return "KEY_B_ACTIVE"

    async def trigger_c(self):
        await asyncio.sleep(0.003)
        self.stage_c = True
        return "KEY_C_ACTIVE"

    def is_unlocked(self) -> bool:
        return self.stage_a and self.stage_b and self.stage_c

async def unlock_vault(vault: AsyncVault) -> bool:
    # Run all 3 triggers concurrently using asyncio.gather!
    keys = await asyncio.gather(
        vault.trigger_a(),
        vault.trigger_b(),
        vault.trigger_c()
    )
    return vault.is_unlocked() and len(keys) == 3`,
    test_harness: `
async def test_escape():
    vault = AsyncVault()
    unlocked = await unlock_vault(vault)
    assert unlocked is True, "Vault did not open!"
    assert vault.is_unlocked() is True
    print("ESCAPE ROOM COMPLETE: You unlocked the Async Vault and escaped!")

asyncio.run(test_escape())`,
    hints: {
      en: [
        'Use `asyncio.gather(*coros)` to execute all 3 triggers concurrently.',
        'Never call `time.sleep()` inside async routines as it blocks the event loop.'
      ],
      'hi-Latn': [
        'Teeno triggers ko concurrently run karne ke liye `asyncio.gather()` use karein.',
        '`time.sleep()` mat lagayein kyunki wo pura event loop freeze kar deta hai.'
      ],
      hi: [
        'तीनों को एक साथ चलाने के लिए `asyncio.gather` का उपयोग करें।',
        'इवेंट लूप को फ्रीज होने से बचाने के लिए कभी भी `time.sleep` का उपयोग न करें।'
      ]
    },
    solution_explanation: {
      en: 'By awaiting `asyncio.gather(vault.trigger_a(), vault.trigger_b(), vault.trigger_c())`, all three async triggers run concurrently on the event loop. The total elapsed time is bounded by the slowest task (~8ms) rather than their sequential sum (~16ms), opening the vault cleanly.',
      'hi-Latn': '`asyncio.gather` teeno coroutines ko concurrently schedule karta hai. Total time sirf maximum task time (~8ms) lagta hai, sequential addition nahi hota.',
      hi: '`asyncio.gather` का उपयोग करके तीनों कार्य एक साथ चलते हैं और वॉल्ट सुरक्षित रूप से खुल जाता है।'
    }
  }
];
