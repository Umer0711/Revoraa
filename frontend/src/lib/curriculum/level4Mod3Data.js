/**
 * Revoraa Level 4: Advanced Python - Module 3: Threads, Processes, and Concurrency
 * 
 * 12 comprehensive lessons covering concurrency vs parallelism, threading, locks,
 * race conditions, deadlocks, multiprocessing, process pools, thread-safe queues,
 * architecture selection, and concurrent debugging with honest browser execution transparency.
 */

export const MODULE_3_THREADS_PROCESSES_CONCURRENCY = {
  id: 'mod-py-threads-processes',
  slug: 'threads-processes-and-concurrency',
  level_number: 4,
  title: 'Threads, Processes, and Concurrency',
  description: 'Master multi-threaded coordination, race conditions, mutex locks, multiprocessing architectures, IPC, and concurrent workload design.',
  estimated_hours: 10,
  sort_order: 3,
  is_published: true,
  topics: [
    {
      id: 'top-concurrency-architectures',
      slug: 'threading-multiprocessing-coordination',
      title: 'Threading, Multiprocessing & Synchronization Primitives',
      summary: 'Explore concurrency vs parallelism, race condition mechanics, deadlock prevention, process isolation, and concurrent architecture decision trees.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-concurrency-vs-parallelism',
          slug: 'concurrency-versus-parallelism',
          title: 'Concurrency Versus Parallelism: Conceptual Foundations',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Clarify the fundamental distinction: Concurrency is about structure and handling multiple things at once; Parallelism is about simultaneous physical execution.',
          learning_objectives: [
            'Differentiate between concurrency (dealing with a lot of things at once) and parallelism (doing a lot of things simultaneously)',
            'Understand how single-core time slicing simulates concurrency without physical parallelism',
            'Relate hardware architectures (multi-core CPUs, hyperthreads) to Python execution models'
          ],
          content_markdown: `### The Classic Rob Pike Distinction

- **Concurrency**: The composition of independently executing processes. It is about **structure**. Dealing with a lot of things at once (e.g., juggling balls, single-threaded event loops, interleaved threads).
- **Parallelism**: The simultaneous physical execution of multiple computational tasks on separate hardware cores. It is about **execution**. Doing a lot of things at once.

\`\`\`
Concurrency without Parallelism (Single Core Time-Slicing / Event Loop):
Core 1: [Task A] ──► [Task B] ──► [Task A] ──► [Task C] ──► [Task B]

Parallelism (Multi-Core Physical Execution):
Core 1: [Task A ───────────────────────────────]
Core 2: [Task B ───────────────────────────────]
Core 3: [Task C ───────────────────────────────]
\`\`\`

### Execution Environment Note
When running in browser-based Pyodide environments, execution runs within a single WebAssembly worker thread. Concurrency is simulated cooperatively; native multi-core OS process forking requires native Python environments.`,
          code_snippet: `def explain_concurrency_models():
    models = {
        "asyncio": "Single-thread, cooperative interleaving via event loop (Concurrency)",
        "threading": "Multiple OS threads, preemptive time-slicing under GIL (Concurrency)",
        "multiprocessing": "Multiple OS processes, separate memory & GILs per core (True Parallelism)"
    }
    for model, desc in models.items():
        print(f"[{model:15}] -> {desc}")

explain_concurrency_models()`,
          code_language: 'python',
          code_explanation: 'This comparison summarizes how asyncio, threading, and multiprocessing map to concurrency and physical parallelism.',
          expected_output: `[asyncio        ] -> Single-thread, cooperative interleaving via event loop (Concurrency)
[threading      ] -> Multiple OS threads, preemptive time-slicing under GIL (Concurrency)
[multiprocessing] -> Multiple OS processes, separate memory & GILs per core (True Parallelism)`,
          quiz: {
            id: 'quiz-l4-conc-vs-par',
            title: 'Concurrency vs Parallelism Check',
            questions: [
              {
                id: 'q-l4-cvp-1',
                question_text: 'Can a program achieve concurrency on a machine with only a single CPU core?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'No, concurrency requires at least two CPU cores.' },
                  { id: 'opt_2', text: 'Yes, through time-slicing or cooperative task interleaving (like an event loop).' },
                  { id: 'opt_3', text: 'Only if running in a 64-bit operating system.' },
                  { id: 'opt_4', text: 'Only if using GPU shaders.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Concurrency is about structure. A single core can time-slice across multiple tasks or yield during I/O, achieving concurrency without simultaneous physical parallelism.'
              }
            ]
          },
          key_takeaways: [
            'Concurrency is handling multiple tasks by interleaving their execution.',
            'Parallelism is executing multiple tasks simultaneously across physical CPU cores.',
            'Python achieves parallelism through multiprocessing or C extensions that release the GIL.'
          ],
          revision_prompts: [
            'Can you have parallelism without concurrency? Provide an example (e.g. SIMD vectorization).',
            'Why does the GIL prevent threading from achieving parallelism for pure Python code?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-io-vs-cpu-bound-workloads',
          slug: 'io-bound-versus-cpu-bound-workloads',
          title: 'I/O-Bound Versus CPU-Bound Workloads',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Classify workloads accurately to select the optimal concurrency model: Network/Disk I/O vs algorithmic number crunching.',
          learning_objectives: [
            'Classify workloads into I/O-bound (network, disk, DB) and CPU-bound (parsing, encryption, math)',
            'Identify why threading and asyncio succeed for I/O-bound tasks',
            'Explain why CPU-bound tasks in Python require multiprocessing'
          ],
          content_markdown: `### Workload Classification

1. **I/O-Bound Workloads**:
   - The program spends the majority of its time waiting for external input/output devices (network latency, database query responses, disk read/write).
   - CPU utilization is typically low (5-15%).
   - **Optimal Python Solution**: \`asyncio\` (highest density) or \`threading\` (for legacy synchronous APIs).

2. **CPU-Bound Workloads**:
   - The program spends the majority of its time executing mathematical operations, data compression, image manipulation, or AST parsing.
   - CPU utilization sits at 100% on the executing core.
   - **Optimal Python Solution**: \`multiprocessing\` (ProcessPoolExecutor) to bypass the GIL and utilize multiple physical CPU cores.`,
          code_snippet: `def categorize_workload(task_name: str, cpu_time_pct: float) -> str:
    if cpu_time_pct > 70.0:
        return f"{task_name}: CPU-Bound -> Use multiprocessing.ProcessPoolExecutor"
    else:
        return f"{task_name}: I/O-Bound -> Use asyncio or threading"

tasks = [
    ("Video Transcoding", 95.0),
    ("Web Scraping & API Fetching", 10.0),
    ("Password Hash Hashing (bcrypt)", 99.0),
    ("Database Query Reporting", 15.0)
]

for name, cpu_pct in tasks:
    print(categorize_workload(name, cpu_pct))`,
          code_language: 'python',
          code_explanation: 'Analyzing the ratio of CPU compute time vs idle I/O wait dictates whether to employ asyncio or multiprocessing.',
          expected_output: `Video Transcoding: CPU-Bound -> Use multiprocessing.ProcessPoolExecutor
Web Scraping & API Fetching: I/O-Bound -> Use asyncio or threading
Password Hash Hashing (bcrypt): CPU-Bound -> Use multiprocessing.ProcessPoolExecutor
Database Query Reporting: I/O-Bound -> Use asyncio or threading`,
          quiz: {
            id: 'quiz-l4-io-cpu',
            title: 'Workload Classification Check',
            questions: [
              {
                id: 'q-l4-ic-1',
                question_text: 'Which Python concurrency tool should you choose for calculating SHA-256 hashes of 1,000 large files across an 8-core CPU?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'asyncio coroutines' },
                  { id: 'opt_2', text: 'concurrent.futures.ProcessPoolExecutor (Multiprocessing)' },
                  { id: 'opt_3', text: 'time.sleep()' },
                  { id: 'opt_4', text: 'A single while loop' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Cryptographic hashing is CPU-bound. Multiprocessing bypasses the single-core GIL restriction, distributing the computational load across all 8 cores in parallel.'
              }
            ]
          },
          key_takeaways: [
            'I/O-bound tasks wait on external devices; use asyncio or threading.',
            'CPU-bound tasks compute heavily on CPU registers; use multiprocessing.',
            'Applying threading to CPU-bound Python code does not increase throughput due to GIL contention.'
          ],
          revision_prompts: [
            'What happens to CPU utilization when an I/O-bound task is blocked?',
            'Can a task be both I/O-bound and CPU-bound (e.g. streaming compressed telemetry)?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-threading-fundamentals-module',
          slug: 'threading-fundamentals',
          title: 'Threading Fundamentals: Thread Objects and Daemon Lifecycles',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Explore the threading module, Thread creation, thread.join() synchronization, and daemon vs non-daemon thread shutdown.',
          learning_objectives: [
            'Spawn native threads using threading.Thread(target=..., args=...)',
            'Synchronize thread completion using thread.join()',
            'Understand daemon thread behavior and process termination rules'
          ],
          content_markdown: `### The \`threading.Thread\` Interface

In standard Python environments, the \`threading\` module creates native operating system threads:

1. **Instantiation**: \`t = threading.Thread(target=worker, args=(arg1,))\`
2. **Execution**: \`t.start()\` spawns the thread and invokes the target.
3. **Synchronization**: \`t.join()\` blocks the calling thread until target finishes.

### Daemon vs Non-Daemon Threads

- **Non-Daemon (Default)**: The main Python process will **refuse to exit** until all non-daemon threads have completed.
- **Daemon (\`daemon=True\`)**: Background support threads (e.g., metrics reporters). When all non-daemon threads exit, daemon threads are **abruptly terminated** without running cleanup blocks.`,
          code_snippet: `import threading
import time

shared_log = []

def worker(worker_id: int):
    time.sleep(0.01) # Simulated network call
    shared_log.append(f"Worker {worker_id} completed")

# Spawn 3 worker threads
threads = [threading.Thread(target=worker, args=(i,)) for i in range(3)]

for t in threads: t.start()
for t in threads: t.join() # Await all threads

print("All threads completed execution.")
print("Shared log results:", sorted(shared_log))`,
          code_language: 'python',
          code_explanation: 't.start() kicks off execution in a separate thread, and t.join() guarantees the main thread waits for completion.',
          expected_output: `All threads completed execution.
Shared log results: ['Worker 0 completed', 'Worker 1 completed', 'Worker 2 completed']`,
          quiz: {
            id: 'quiz-l4-threading-basics',
            title: 'Threading Basics Check',
            questions: [
              {
                id: 'q-l4-tb-1',
                question_text: 'What happens to daemon threads (daemon=True) when the main Python thread finishes?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They prevent the Python interpreter from exiting.' },
                  { id: 'opt_2', text: 'They are killed abruptly and the Python process terminates immediately.' },
                  { id: 'opt_3', text: 'They are automatically converted into processes.' },
                  { id: 'opt_4', text: 'They raise a SystemExit exception.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Daemon threads run in the background. As soon as all non-daemon threads exit, the process terminates immediately without waiting for daemon threads.'
              }
            ]
          },
          key_takeaways: [
            'threading.Thread spawns OS threads managed by the Python runtime.',
            'thread.join() blocks until the target thread finishes execution.',
            'Non-daemon threads keep the process alive; daemon threads are terminated abruptly upon process exit.'
          ],
          revision_prompts: [
            'Why is it dangerous to open database transactions inside daemon threads?',
            'What happens if you call thread.start() twice on the same Thread object?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-thread-safe-communication-queue',
          slug: 'thread-safe-communication-and-shared-state',
          title: 'Thread-Safe Communication: queue.Queue and Shared State',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 4,
          summary: 'Coordinate multi-threaded pipelines safely using queue.Queue, sentinel poison pills, and task_done() synchronization.',
          learning_objectives: [
            'Avoid shared mutable memory by passing messages via queue.Queue',
            'Understand the internal thread-safety of queue.Queue (mutex + condition variables)',
            'Implement producer-consumer shutdown patterns using sentinel values'
          ],
          content_markdown: `### "Do Not Communicate by Sharing Memory; Share Memory by Communicating"

The safest way to design multi-threaded programs is to avoid shared mutable state entirely. Instead, use **message passing** through \`queue.Queue\`:

- \`queue.Queue\` is internally synchronized with atomic locking and condition variables.
- Producers \`put()\` items without manual locking.
- Consumers \`get()\` items, blocking when the queue is empty.
- \`q.task_done()\` and \`q.join()\` provide deterministic completion synchronization.
- **Poison Pill Pattern**: A sentinel value (e.g. \`None\`) tells consumers to shut down cleanly.`,
          code_snippet: `import queue
import threading

work_queue = queue.Queue()
processed_items = []

def consumer():
    while True:
        item = work_queue.get()
        if item is None: # Poison pill sentinel
            work_queue.task_done()
            break
        processed_items.append(item * 2)
        work_queue.task_done()

# Start consumer thread
t = threading.Thread(target=consumer)
t.start()

# Produce work
for val in [10, 20, 30]:
    work_queue.put(val)

# Send poison pill and wait for completion
work_queue.put(None)
work_queue.join()
t.join()

print("Processed results from consumer thread:", processed_items)`,
          code_language: 'python',
          code_explanation: 'queue.Queue handles thread synchronization internally. The consumer processes tasks and exits when receiving None.',
          expected_output: `Processed results from consumer thread: [20, 40, 60]`,
          quiz: {
            id: 'quiz-l4-queue-comm',
            title: 'Thread Communication Check',
            questions: [
              {
                id: 'q-l4-qc-1',
                question_text: 'Why is `queue.Queue` preferred over a standard Python `list` for multi-threaded work distribution?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Lists cannot store more than 100 items.' },
                  { id: 'opt_2', text: 'queue.Queue provides built-in thread safety and blocking synchronization primitives, preventing race conditions.' },
                  { id: 'opt_3', text: 'queue.Queue uses less memory than a list.' },
                  { id: 'opt_4', text: 'Lists are immutable.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Standard lists are not thread-safe for concurrent read/write and lack blocking primitives. queue.Queue encapsulates mutex locks and condition variables.'
              }
            ]
          },
          key_takeaways: [
            'Use message passing with queue.Queue rather than shared mutable variables.',
            'queue.Queue provides thread-safe put(), get(), and join() methods.',
            'Use poison pill sentinels (like None) to shut down consumer worker threads cleanly.'
          ],
          revision_prompts: [
            'What happens if a consumer thread fails to call work_queue.task_done()?',
            'What is the difference between queue.Queue, queue.LifoQueue, and queue.PriorityQueue?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-locks-race-conditions-mutex',
          slug: 'locks-and-race-conditions',
          title: 'Locks and Race Conditions: Mutex Synchronization and RLock',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 5,
          summary: 'Analyze how race conditions occur when bytecodes interleave, and protect critical sections using threading.Lock and RLock.',
          learning_objectives: [
            'Understand that Python statements like x += 1 are not atomic (LOAD, ADD, STORE bytecodes)',
            'Identify race conditions resulting from preemptive thread context switches',
            'Protect shared resources using threading.Lock and reentrant threading.RLock'
          ],
          content_markdown: `### Why \`counter += 1\` is NOT Atomic

A common misconception is that the GIL makes Python code thread-safe. **It does not!**
The statement \`counter += 1\` compiles into multiple distinct bytecode opcodes:
1. \`LOAD_GLOBAL (counter)\`
2. \`LOAD_CONST (1)\`
3. \`BINARY_OP (+)\`
4. \`STORE_GLOBAL (counter)\`

If the OS preempts Thread A between \`LOAD_GLOBAL\` and \`STORE_GLOBAL\`, Thread B reads the stale value, increments it, and writes. When Thread A resumes, it overwrites Thread B's update—causing a **lost update race condition**!

### The Mutex Solution: \`threading.Lock()\`

A **Mutex Lock** guarantees that only one thread can execute the critical section at a time:

\`\`\`python
lock = threading.Lock()

with lock:
    counter += 1
\`\`\``,
          code_snippet: `import threading

class SafeCounter:
    def __init__(self):
        self.value = 0
        self._lock = threading.Lock()

    def increment(self):
        # Critical section protected by Mutex Lock
        with self._lock:
            current = self.value
            # Simulating preemptive context switch
            self.value = current + 1

counter = SafeCounter()

def worker():
    for _ in range(500):
        counter.increment()

# Run two competing threads
t1 = threading.Thread(target=worker)
t2 = threading.Thread(target=worker)
t1.start(); t2.start()
t1.join(); t2.join()

print(f"Final counter value: {counter.value} (Expected: 1000)")`,
          code_language: 'python',
          code_explanation: 'The with self._lock block guarantees mutual exclusion. No thread can interleave during the read-modify-write cycle.',
          expected_output: `Final counter value: 1000 (Expected: 1000)`,
          quiz: {
            id: 'quiz-l4-race-conditions',
            title: 'Race Condition Check',
            questions: [
              {
                id: 'q-l4-rc-1',
                question_text: 'Why doesn\'t Python\'s Global Interpreter Lock (GIL) prevent race conditions on shared variables?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because the GIL only applies to string variables.' },
                  { id: 'opt_2', text: 'Because the GIL only protects CPython internal memory structures; threads can still be preempted between bytecode instructions in high-level Python operations.' },
                  { id: 'opt_3', text: 'Because the GIL is disabled when threading is imported.' },
                  { id: 'opt_4', text: 'Because Python numbers are immutable.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The GIL prevents CPython memory corruption, but thread context switches occur between individual bytecode opcodes. Multi-step operations like += still require user-space locks.'
              }
            ]
          },
          key_takeaways: [
            'Operations like += are not atomic and require mutual exclusion locks in multi-threaded code.',
            'threading.Lock prevents simultaneous access to critical sections.',
            'Use threading.RLock (Reentrant Lock) if the same thread needs to acquire the lock multiple times recursively.'
          ],
          revision_prompts: [
            'What happens if a thread tries to acquire a standard threading.Lock that it already owns?',
            'What is the difference between threading.Lock and threading.RLock?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-deadlocks-prevention-strategies',
          slug: 'deadlocks-and-how-to-prevent-them',
          title: 'Deadlocks and How to Prevent Them: Lock Ordering and Timeouts',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 6,
          summary: 'Analyze Coffman deadlock conditions, circular wait graphs, strict global lock ordering, and bounded acquisition timeouts.',
          learning_objectives: [
            'Understand the 4 Coffman conditions required for a deadlock to occur',
            'Identify circular wait patterns (Thread A holds Lock 1 waiting for 2; Thread B holds Lock 2 waiting for 1)',
            'Enforce consistent global lock ordering and acquisition timeouts to prevent deadlocks'
          ],
          content_markdown: `### The Anatomy of a Deadlock

A **deadlock** occurs when two or more threads are permanently blocked, each waiting for a lock held by the other:

\`\`\`
Thread 1 holds [Lock A] ──(waits for)──► [Lock B] (held by Thread 2)
Thread 2 holds [Lock B] ──(waits for)──► [Lock A] (held by Thread 1)
\`\`\`

Both threads freeze forever, consuming CPU context cycles and halting execution.

### Prevention Strategy 1: Strict Global Lock Ordering
Always acquire locks in a globally consistent order (e.g., sorted by object ID or memory address). If all threads acquire Lock A before Lock B, circular wait is mathematically impossible.

### Prevention Strategy 2: Acquisition Timeouts
Never use indefinite \`lock.acquire()\`. Use \`lock.acquire(timeout=5.0)\` and roll back if the lock cannot be obtained within the deadline.`,
          code_snippet: `import threading

lock_a = threading.Lock()
lock_b = threading.Lock()

def safe_transfer(account_1_id: int, account_2_id: int):
    """Acquires locks in consistent ascending numerical order to prevent circular wait."""
    first_lock = lock_a if account_1_id < account_2_id else lock_b
    second_lock = lock_b if account_1_id < account_2_id else lock_a

    with first_lock:
        with second_lock:
            return f"Transferred funds between {account_1_id} and {account_2_id}"

# Both threads acquire locks in the exact same order regardless of argument order
t1 = threading.Thread(target=safe_transfer, args=(1, 2))
t2 = threading.Thread(target=safe_transfer, args=(2, 1))

t1.start(); t2.start()
t1.join(); t2.join()
print("Transfers completed without deadlock!")`,
          code_language: 'python',
          code_explanation: 'Sorting the locks by ID ensures both threads request resources in the identical order, eliminating the circular wait condition.',
          expected_output: `Transfers completed without deadlock!`,
          quiz: {
            id: 'quiz-l4-deadlock-prevention',
            title: 'Deadlock Prevention Check',
            questions: [
              {
                id: 'q-l4-dp-1',
                question_text: 'Which technique is the most reliable architectural solution to eliminate deadlocks across multiple locks?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Increasing the CPU core count.' },
                  { id: 'opt_2', text: 'Enforcing a strict, consistent global acquisition ordering across all locks in all threads.' },
                  { id: 'opt_3', text: 'Disabling the Python garbage collector.' },
                  { id: 'opt_4', text: 'Converting all threads into daemon threads.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Enforcing consistent global lock ordering breaks the Coffman circular wait condition, guaranteeing that cyclic dependency deadlocks cannot occur.'
              }
            ]
          },
          key_takeaways: [
            'Deadlocks occur when threads hold resources while waiting cyclically for each other.',
            'Enforcing a consistent global lock ordering eliminates circular wait conditions.',
            'Use lock acquisition timeouts (lock.acquire(timeout=...)) to recover gracefully if contention occurs.'
          ],
          revision_prompts: [
            'What are the 4 Coffman conditions required for a deadlock?',
            'What is the Dining Philosophers problem and how does lock ordering solve it?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-multiprocessing-fundamentals',
          slug: 'multiprocessing-fundamentals',
          title: 'Multiprocessing Fundamentals: Process Isolation and IPC',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 7,
          summary: 'Examine OS process creation (fork vs spawn), isolated memory spaces, the multiprocessing module, and IPC serialization.',
          learning_objectives: [
            'Understand that each Process has its own independent Python interpreter and GIL',
            'Contrast process start methods: fork (POSIX copy-on-write) vs spawn (fresh process)',
            'Understand inter-process communication (IPC) serialization via pickle'
          ],
          content_markdown: `### Overcoming the GIL with \`multiprocessing\`

To achieve true multi-core CPU parallelism, the \`multiprocessing\` module creates **separate operating system processes**:
- Each process runs its **own independent Python Virtual Machine** with its own private heap memory and GIL.
- Multi-core CPU utilization scales linearly across all available physical cores.

### Process Start Methods

1. **\`fork\` (Default on legacy POSIX)**:
   - Duplicates the parent process instantly via OS copy-on-write.
   - **Hazard**: Unsafe with multi-threaded parents (can copy locks in deadlocked states).
2. **\`spawn\` (Default on Windows and macOS, recommended on Linux)**:
   - Starts a fresh, clean Python interpreter executable.
   - Modules are re-imported; requires \`if __name__ == '__main__':\` guards to prevent infinite recursive process spawning!
3. **IPC via Pickle**: Because processes do not share memory, passing data requires **serialization** via \`pickle\`. Objects that cannot be pickled cannot be passed between processes.`,
          code_snippet: `import multiprocessing

def square_worker(number: int) -> int:
    """Worker executed in an isolated OS process."""
    return number * number

# Conceptual demonstration of Process instantiation
# Native execution requires if __name__ == '__main__': guard
print("Multiprocessing CPU count available:", multiprocessing.cpu_count())
print("Default start method:", multiprocessing.get_start_method())`,
          code_language: 'python',
          code_explanation: 'multiprocessing.cpu_count() detects available hardware cores for parallel scheduling.',
          expected_output: `Multiprocessing CPU count available: <cpu_cores>
Default start method: <start_method>`,
          quiz: {
            id: 'quiz-l4-mp-basics',
            title: 'Multiprocessing Basics Check',
            questions: [
              {
                id: 'q-l4-mp-1',
                question_text: 'Why MUST multiprocessing entrypoints be protected with `if __name__ == "__main__":`?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To comply with PEP 8 styling.' },
                  { id: 'opt_2', text: 'Under the "spawn" start method, child processes re-import the main script; without the guard, child processes would spawn infinite child loops.' },
                  { id: 'opt_3', text: 'To enable type checking.' },
                  { id: 'opt_4', text: 'It is optional and has no effect on execution.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'With spawn, child processes re-import the entry module from scratch. Without the __main__ guard, the child would re-execute the process spawn code recursively.'
              }
            ]
          },
          key_takeaways: [
            'Each multiprocessing.Process runs an independent interpreter with its own GIL, enabling true multi-core parallelism.',
            'Processes do not share memory; arguments and return values must be serializable via pickle.',
            'Always protect entry scripts with if __name__ == "__main__": to support spawn cleanly.'
          ],
          revision_prompts: [
            'Why is fork considered unsafe in multi-threaded programs (POSIX fork-safety)?',
            'What happens if you attempt to pass an unpickleable lambda or file handle to a multiprocessing.Process?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-process-pools-task-distribution',
          slug: 'process-pools-and-task-distribution',
          title: 'Process Pools and Task Distribution: ProcessPoolExecutor',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 8,
          summary: 'Distribute CPU-intensive batches using concurrent.futures.ProcessPoolExecutor, chunking, and worker pool reuse.',
          learning_objectives: [
            'Distribute batch computations using ProcessPoolExecutor.map()',
            'Understand chunking to amortize inter-process serialization overhead',
            'Manage worker pool lifecycles cleanly using context managers'
          ],
          content_markdown: `### \`concurrent.futures.ProcessPoolExecutor\`

Spawning a new OS process takes 20-100ms. Spawning a new process for every single micro-calculation destroys performance.

**Solution: The Process Pool**:
- Pre-spawns a fixed pool of $N$ worker processes (typically equal to the number of CPU cores).
- Reuses warm worker processes across thousands of tasks.
- **Chunking**: When mapping over large sequences, passes items in chunks (e.g. \`chunksize=100\`) to minimize IPC pickle round-trips.`,
          code_snippet: `from concurrent.futures import ProcessPoolExecutor
import time

def compute_heavy_hash(seed: int) -> int:
    total = seed
    for _ in range(50_000):
        total = (total * 1664525 + 1013904223) & 0xFFFFFFFF
    return total

# Conceptual usage pattern of ProcessPoolExecutor
# with ProcessPoolExecutor() as executor:
#     results = list(executor.map(compute_heavy_hash, range(10), chunksize=2))
print("ProcessPoolExecutor reuses warm worker processes to amortize startup overhead.")`,
          code_language: 'python',
          code_explanation: 'ProcessPoolExecutor distributes tasks across warm child processes, maximizing multi-core CPU throughput.',
          expected_output: `ProcessPoolExecutor reuses warm worker processes to amortize startup overhead.`,
          quiz: {
            id: 'quiz-l4-ppe',
            title: 'Process Pool Check',
            questions: [
              {
                id: 'q-l4-pp-1',
                question_text: 'Why does increasing `chunksize` in ProcessPoolExecutor.map() improve performance for large datasets?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It creates more CPU cores.' },
                  { id: 'opt_2', text: 'It bundles multiple items per IPC message, reducing inter-process serialization and context-switching overhead.' },
                  { id: 'opt_3', text: 'It disables error checking.' },
                  { id: 'opt_4', text: 'It converts the data into JSON.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Chunking amortizes the cost of inter-process IPC communication by packaging multiple items into a single serialized payload.'
              }
            ]
          },
          key_takeaways: [
            'ProcessPoolExecutor maintains a pool of pre-forked/spawned worker processes.',
            'Reusing warm processes avoids the heavy startup latency of repeated process creation.',
            'Use chunksize to batch small tasks and minimize IPC serialization costs.'
          ],
          revision_prompts: [
            'How should you choose the default max_workers value for ProcessPoolExecutor?',
            'What happens if a worker process crashes abruptly with a Segmentation Fault inside a pool?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-choosing-concurrency-model',
          slug: 'choosing-between-threads-processes-and-asyncio',
          title: 'Choosing Between Threads, Processes, and asyncio: Architectural Decision Framework',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 9,
          summary: 'Build a rigorous decision tree to select between asyncio, threading, and multiprocessing based on I/O vs CPU, libraries, and scale.',
          learning_objectives: [
            'Apply a decision matrix comparing asyncio, threading, and multiprocessing',
            'Evaluate the impact of third-party ecosystem dependencies (sync vs async drivers)',
            'Design hybrid architectures combining asyncio with worker pools'
          ],
          content_markdown: `### The Concurrency Decision Matrix

| Dimension | \`asyncio\` | \`threading\` | \`multiprocessing\` |
| :--- | :--- | :--- | :--- |
| **Best For** | High-volume I/O (1,000+ sockets) | I/O with blocking legacy libraries | Heavy CPU calculations |
| **Parallelism** | No (Single thread) | No (Constrained by GIL) | Yes (Multi-core) |
| **Memory per Task** | Extremely low (~2-4 KB) | Moderate (~1-8 MB stack) | High (~15-40 MB per process) |
| **Shared State** | Direct heap access (cooperative) | Direct heap access (requires locks) | Isolated (requires IPC / pickle) |
| **Failure Mode** | Blocking call freezes loop | Unhandled race conditions | IPC bottlenecks, serialization failures |

### The Golden Rule
1. If **I/O-bound** and can use async libraries: **Use \`asyncio\`**.
2. If **I/O-bound** but constrained to synchronous drivers: **Use \`concurrent.futures.ThreadPoolExecutor\`**.
3. If **CPU-bound**: **Use \`concurrent.futures.ProcessPoolExecutor\`**.`,
          code_snippet: `def recommend_architecture(workload: str, client_scale: int, has_async_driver: bool) -> str:
    if workload == "cpu":
        return "multiprocessing.ProcessPoolExecutor"
    elif client_scale > 1000 and has_async_driver:
        return "asyncio (Event Loop)"
    else:
        return "concurrent.futures.ThreadPoolExecutor"

print("Recommendations:")
print("1. Image processing batch:           ", recommend_architecture("cpu", 100, False))
print("2. 50,000 WebSocket connections:      ", recommend_architecture("io", 50000, True))
print("3. Legacy DB queries (synchronous):   ", recommend_architecture("io", 50, False))`,
          code_language: 'python',
          code_explanation: 'Applying workload type, connection scale, and library ecosystem constraints deterministically points to the optimal concurrency tool.',
          expected_output: `Recommendations:
1. Image processing batch:            multiprocessing.ProcessPoolExecutor
2. 50,000 WebSocket connections:       asyncio (Event Loop)
3. Legacy DB queries (synchronous):    concurrent.futures.ThreadPoolExecutor`,
          quiz: {
            id: 'quiz-l4-arch-decision',
            title: 'Architecture Decision Check',
            questions: [
              {
                id: 'q-l4-ad-1',
                question_text: 'You need to build a service connecting to a legacy third-party SDK that only provides blocking synchronous methods and makes 20 concurrent HTTP calls. What is the best model?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'ThreadPoolExecutor' },
                  { id: 'opt_2', text: 'Pure single-threaded asyncio without threads' },
                  { id: 'opt_3', text: 'Shell scripts' },
                  { id: 'opt_4', text: 'CUDA GPU kernels' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Because the SDK is synchronous and blocking, pure asyncio would freeze. At a modest scale of 20 concurrent calls, ThreadPoolExecutor handles blocking I/O cleanly.'
              }
            ]
          },
          key_takeaways: [
            'Match the tool to the bottleneck: asyncio for massive I/O, ThreadPool for blocking I/O, ProcessPool for CPU workloads.',
            'Never force asyncio on a codebase locked to synchronous blocking database drivers.',
            'Hybrid architectures frequently use asyncio for networking while offloading CPU tasks to ProcessPoolExecutor.'
          ],
          revision_prompts: [
            'How does asyncio.get_running_loop().run_in_executor() bridge asyncio with ThreadPoolExecutor?',
            'What are the memory implications of running 100 processes vs 100 threads?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-gil-deep-dive-threading',
          slug: 'understanding-gil-and-its-implications',
          title: "The GIL Deep Dive: Thread Contention and PyMutex Mechanics",
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 10,
          summary: 'Inspect sys.getswitchinterval(), GIL thread preemption intervals, the convoy effect, and free-threaded Python developments.',
          learning_objectives: [
            'Inspect thread switch intervals with sys.getswitchinterval()',
            'Understand how CPython signals running threads to release the GIL',
            'Analyze the convoy effect and lock contention in mixed CPU/IO workloads'
          ],
          content_markdown: `### The GIL Switch Interval

How does CPython force threads to yield the GIL?
- CPython maintains a configurable **switch interval** (default **5 milliseconds** in Python 3.2+).
- After running for 5ms without an I/O wait, the interpreter sets an internal flag \`gil_drop_request = 1\`.
- At the next bytecode boundary, the running thread releases the GIL and yields to waiting threads.

\`\`\`python
import sys
sys.getswitchinterval() # Returns 0.005 seconds (5ms)
\`\`\`

### The "Convoy Effect" Hazard
When a fast I/O thread competes with a heavy CPU thread, the I/O thread may wake up, request the GIL, and be forced to wait 5ms behind the CPU thread before getting scheduled—introducing unexpected latency spikes!`,
          code_snippet: `import sys

current_interval = sys.getswitchinterval()
print(f"Current GIL switch interval: {current_interval * 1000:.1f} ms")

# Conceptual test of switch interval adjustment
# sys.setswitchinterval(0.001) would switch every 1ms
print("Switch interval determines the maximum time a thread computes before yielding the GIL.")`,
          code_language: 'python',
          code_explanation: 'sys.getswitchinterval() reveals the periodic time slice after which CPython requests the active thread to release the GIL.',
          expected_output: `Current GIL switch interval: 5.0 ms
Switch interval determines the maximum time a thread computes before yielding the GIL.`,
          quiz: {
            id: 'quiz-l4-gil-switch',
            title: 'GIL Mechanics Check',
            questions: [
              {
                id: 'q-l4-gs-1',
                question_text: 'What is the default GIL switch interval in modern CPython?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '5 milliseconds (0.005 seconds)' },
                  { id: 'opt_2', text: '1 second' },
                  { id: 'opt_3', text: '1 microsecond' },
                  { id: 'opt_4', text: 'The GIL never switches automatically.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'In Python 3.2+, the GIL switch interval is set to 5 milliseconds by default, striking a balance between responsiveness and switching overhead.'
              }
            ]
          },
          key_takeaways: [
            'CPython requests threads to release the GIL after a 5ms switch interval.',
            'Heavy CPU threads can starve lightweight I/O threads, creating the convoy effect.',
            'Keep CPU-bound processing separate from latency-critical I/O threads.'
          ],
          revision_prompts: [
            'How does Python 3.13 free-threaded mode (PEP 703) remove the global interpreter lock?',
            'What are biased locking and immortal objects in CPython internals?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-worker-pools-bounded-concurrency',
          slug: 'worker-pools-and-bounded-concurrency',
          title: 'Worker Pools and Bounded Concurrency: Backpressure and Queue Sizing',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 11,
          summary: 'Prevent out-of-memory crashes by implementing backpressure, bounded queues (maxsize), and graceful degradation.',
          learning_objectives: [
            'Understand how unbounded queues cause catastrophic Out-Of-Memory (OOM) failures under burst traffic',
            'Enforce producer backpressure using bounded queues (queue.Queue(maxsize=N))',
            'Implement load shedding and rejected task handling'
          ],
          content_markdown: `### The Unbounded Queue Catastrophe

When a producer ingests 50,000 requests/sec while consumers can only process 5,000/sec:
- If the work queue is **unbounded** (\`maxsize=0\`), millions of pending items accumulate in memory.
- Heap memory balloons exponentially until the OS invokes the OOM Killer (\`SIGKILL\`), crashing the service.

### Applying Backpressure

**Backpressure** signals the producer to slow down or reject incoming traffic when the system is at capacity:
1. Initialize queue with a fixed capacity: \`queue.Queue(maxsize=1000)\`.
2. When the queue reaches 1,000 items, \`q.put(item)\` blocks the producer until consumers make space.
3. Or use \`q.put_nowait(item)\` to return a fast \`HTTP 503 Service Unavailable\` (load shedding).`,
          code_snippet: `import queue

# Create a bounded queue with max capacity of 2 items
bounded_queue = queue.Queue(maxsize=2)

# Fill to capacity
bounded_queue.put("Job_A")
bounded_queue.put("Job_B")

print("Queue full?:", bounded_queue.full())

# Attempting to add another item with nowait triggers Full exception
try:
    bounded_queue.put_nowait("Job_C")
except queue.Full:
    print("[BACKPRESSURE] Queue is full! Applying load shedding (HTTP 503 Rejected).")`,
          code_language: 'python',
          code_explanation: 'Bounded queues prevent memory exhaustion by refusing additional items when saturated, applying backpressure to callers.',
          expected_output: `Queue full?: True
[BACKPRESSURE] Queue is full! Applying load shedding (HTTP 503 Rejected).`,
          quiz: {
            id: 'quiz-l4-backpressure',
            title: 'Backpressure Check',
            questions: [
              {
                id: 'q-l4-bp-1',
                question_text: 'Why should production message queues always have a finite `maxsize`?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To speed up network cards.' },
                  { id: 'opt_2', text: 'To prevent memory exhaustion (OOM) during traffic spikes by applying backpressure to producers.' },
                  { id: 'opt_3', text: 'Because Python lists cannot hold more than 1,000 elements.' },
                  { id: 'opt_4', text: 'To comply with HTTP 2 standards.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Finite queue bounds prevent memory bloat, forcing producers to pause or reject traffic when consumer capacity is saturated.'
              }
            ]
          },
          key_takeaways: [
            'Unbounded queues cause memory exhaustion under traffic surges.',
            'Bounded queues (maxsize) enforce backpressure, forcing producers to pace their output.',
            'Load shedding protects core system stability during extreme overload.'
          ],
          revision_prompts: [
            'What is the difference between put() and put_nowait() in queue.Queue?',
            'How does asyncio.Queue support bounded async backpressure?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-testing-debugging-concurrent-apps',
          slug: 'testing-and-debugging-concurrent-applications',
          title: 'Testing and Debugging Concurrent Applications: Stress, Determinism and Tracing',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 12,
          summary: 'Detect race conditions systematically using threading stress harnesses, deterministic simulated time, and thread dump tracing.',
          learning_objectives: [
            'Build concurrency stress harnesses that reproduce race conditions deterministically',
            'Capture thread stack dumps across all active threads using sys._current_frames()',
            'Design deterministic tests that do not rely on unpredictable sleep intervals'
          ],
          content_markdown: `### Why Concurrent Code is Hard to Test

Heisenbugs disappear when inspected:
- A race condition may trigger once in 100,000 executions under specific OS scheduler conditions.
- Running tests under a debugger alters timing, masking the bug.

### Diagnostic Technique: Thread Dumps with \`sys._current_frames()\`

When a multi-threaded application appears hung or deadlocked, inspect where all threads are blocked using \`sys._current_frames()\`:

\`\`\`python
import sys, traceback

for thread_id, frame in sys._current_frames().items():
    print(f"--- Thread ID: {thread_id} ---")
    traceback.print_stack(frame)
\`\`\``,
          code_snippet: `import threading
import sys
import traceback

def inspect_active_threads():
    frames = sys._current_frames()
    for t in threading.enumerate():
        frame = frames.get(t.ident)
        print(f"Thread: '{t.name}' (Alive: {t.is_alive()}, Daemon: {t.daemon})")
        if frame:
            # Print top function in stack
            print(f"  Executing: {frame.f_code.co_name} in {frame.f_code.co_filename}")

inspect_active_threads()`,
          code_language: 'python',
          code_explanation: 'sys._current_frames() provides programmatic introspection of all active threads, diagnosing where locks or deadlocks are held.',
          expected_output: `Thread: 'MainThread' (Alive: True, Daemon: False)
  Executing: inspect_active_threads in <filename>`,
          quiz: {
            id: 'quiz-l4-debug-threads',
            title: 'Concurrent Debugging Check',
            questions: [
              {
                id: 'q-l4-dt-1',
                question_text: 'How can a developer inspect the exact call stack of all running threads when diagnosing a frozen Python service?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'By examining `sys._current_frames()` and printing stack traces.' },
                  { id: 'opt_2', text: 'By inspecting `sys.argv`.' },
                  { id: 'opt_3', text: 'By deleting the `__pycache__` directory.' },
                  { id: 'opt_4', text: 'Call stacks cannot be inspected once threads start.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: '`sys._current_frames()` returns a dictionary mapping each active thread ID to its topmost frame, allowing complete stack trace inspection.'
              }
            ]
          },
          key_takeaways: [
            'Never use arbitrary time.sleep() delays to synchronize tests; use threading.Event or queue.join().',
            'sys._current_frames() enables runtime inspection of hung or deadlocked threads.',
            'Run stress tests under high loop iteration counts to flush out subtle race conditions.'
          ],
          revision_prompts: [
            'How can the faulthandler module dump thread tracebacks upon receiving a SIGUSR1 signal?',
            'What is ThreadSanitizer (TSan) and can it be used with CPython?'
          ]
        }
      ]
    }
  ]
};
