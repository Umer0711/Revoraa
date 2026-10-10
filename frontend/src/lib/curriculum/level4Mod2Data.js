/**
 * Revoraa Level 4: Advanced Python - Module 2: Asynchronous Programming with asyncio
 * 
 * 12 comprehensive lessons covering cooperative multitasking, coroutines, event loop,
 * task scheduling, asyncio.gather, TaskGroup, timeouts, cancellation, exception handling,
 * async context managers, async iterators, and event loop blocking hazards.
 */

export const MODULE_2_ASYNCIO_PROGRAMMING = {
  id: 'mod-py-asyncio-programming',
  slug: 'asynchronous-programming-asyncio',
  level_number: 4,
  title: 'Asynchronous Programming with asyncio',
  description: 'Master coroutines, event loop dispatch, concurrent task scheduling, structured concurrency, timeouts, and asynchronous stream processing.',
  estimated_hours: 10,
  sort_order: 2,
  is_published: true,
  topics: [
    {
      id: 'top-async-concurrency',
      slug: 'coroutines-event-loop-and-tasks',
      title: 'Coroutines, The Event Loop & Structured Concurrency',
      summary: 'Explore async/await syntax, event loop execution, TaskGroup concurrency, cancellation invariants, and async dunder protocols.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-why-async-exists',
          slug: 'why-asynchronous-programming-exists',
          title: 'Why Asynchronous Programming Exists: The I/O Bound Concurrency Problem',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Examine the C10K problem, OS thread overhead, blocking I/O bottlenecks, and cooperative multitasking efficiency.',
          learning_objectives: [
            'Understand the memory and context-switching cost of OS threads (1-8MB stack per thread)',
            'Analyze cooperative multitasking vs preemptive scheduling',
            'Recognize when asynchronous I/O drastically outperforms multi-threaded architectures'
          ],
          content_markdown: `### The Problem with Thread-per-Connection

In traditional network servers, each incoming client connection is assigned a dedicated operating system thread:
- Each OS thread allocates **1MB to 8MB of memory** for its stack space.
- 10,000 concurrent connections (the famous **C10K problem**) would require 10GB–80GB of RAM just for thread stacks!
- The OS kernel spends substantial CPU cycles performing preemptive context switches between thousands of threads that are mostly idle, waiting on network packets.

### The Asynchronous Solution: Single-Threaded Multiplexing

Asynchronous programming uses an **event loop** operating over non-blocking OS I/O notifications (\`epoll\` on Linux, \`kqueue\` on macOS, \`IOCP\` on Windows):
- A single OS thread can manage tens of thousands of concurrent sockets.
- Tasks voluntarily yield control back to the event loop whenever they wait for I/O.
- Memory consumption drops to a few kilobytes per task.`,
          code_snippet: `# Conceptual comparison of Thread vs Async memory footprint
threads_count = 10_000
thread_stack_mb = 4
total_thread_ram_gb = (threads_count * thread_stack_mb) / 1024

async_tasks_count = 10_000
async_task_kb = 3
total_async_ram_mb = (async_tasks_count * async_task_kb) / 1024

print(f"Memory for {threads_count:,} OS threads: ~{total_thread_ram_gb:.1f} GB")
print(f"Memory for {async_tasks_count:,} async tasks: ~{total_async_ram_mb:.1f} MB")
print(f"Async is ~{(total_thread_ram_gb * 1024) / total_async_ram_mb:.0f}x more memory efficient for I/O concurrency.")`,
          code_language: 'python',
          code_explanation: 'Async tasks are lightweight Python objects, enabling high concurrency without the steep memory and scheduling overhead of native OS threads.',
          expected_output: `Memory for 10,000 OS threads: ~39.1 GB
Memory for 10,000 async tasks: ~29.3 MB
Async is ~1365x more memory efficient for I/O concurrency.`,
          quiz: {
            id: 'quiz-l4-why-async',
            title: 'Async Rationale Check',
            questions: [
              {
                id: 'q-l4-wa-1',
                question_text: 'What is the primary advantage of asynchronous programming over multi-threaded servers for I/O-bound workloads?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It automatically makes CPU-bound mathematical operations 10x faster.' },
                  { id: 'opt_2', text: 'It supports massive concurrency with minimal memory overhead and zero OS thread context-switching penalties.' },
                  { id: 'opt_3', text: 'It disables all Python exceptions.' },
                  { id: 'opt_4', text: 'It eliminates the need for unit testing.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Asynchronous tasks are lightweight user-space objects managed by a single event loop, allowing thousands of concurrent I/O operations with small memory usage.'
              }
            ]
          },
          key_takeaways: [
            'OS threads consume substantial stack memory and incur heavy kernel context-switch costs.',
            'Asynchronous I/O uses non-blocking event loops to coordinate thousands of tasks concurrently.',
            'Async is designed for I/O-bound waiting (networks, databases), not CPU-heavy calculations.'
          ],
          revision_prompts: [
            'What is the C10K problem and why did it prompt the development of async architectures?',
            'What is the difference between preemptive multitasking and cooperative multitasking?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-sync-vs-async-execution',
          slug: 'synchronous-versus-asynchronous-execution',
          title: 'Synchronous Versus Asynchronous Execution Flow',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Trace execution flow, call stacks, blocking waits vs yielding pauses, and cooperative scheduling.',
          learning_objectives: [
            'Contrast synchronous step-by-step blocking with asynchronous interleaved execution',
            'Understand how yielding allows other tasks to progress during wait intervals',
            'Calculate throughput gains from overlapping I/O latency'
          ],
          content_markdown: `### Tracing Execution Flow

Consider fetching data from 3 microservices, each taking 100ms:

- **Synchronous (Sequential)**:
  \`\`\`
  Service 1 (100ms) ──► Service 2 (100ms) ──► Service 3 (100ms) = Total: 300ms
  \`\`\`
  The program blocks and sleeps on each request in turn.

- **Asynchronous (Concurrent Interleaving)**:
  \`\`\`
  Service 1 [Start] ──(Yield)──┐
  Service 2 [Start] ──(Yield)──┼── (All 3 wait concurrently) ──► Complete in ~100ms
  Service 3 [Start] ──(Yield)──┘
  \`\`\`
  All three requests fire concurrently. Total runtime is determined by the slowest individual request rather than the sum of all requests!`,
          code_snippet: `import asyncio
import time

async def simulate_fetch(source: str, delay: float) -> str:
    print(f"[{source}] Fetch started...")
    # Yield control to event loop during simulated network latency
    await asyncio.sleep(delay)
    print(f"[{source}] Fetch finished!")
    return f"{source}_data"

async def main():
    start = time.perf_counter()
    # Concurrently execute 3 tasks
    results = await asyncio.gather(
        simulate_fetch("AuthService", 0.1),
        simulate_fetch("BillingService", 0.1),
        simulate_fetch("ProfileService", 0.1)
    )
    elapsed = time.perf_counter() - start
    print(f"\\nAll fetched: {results}")
    print(f"Total time elapsed: {elapsed:.2f}s (Sequential would take 0.30s)")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'asyncio.gather schedules all three coroutines concurrently. Because they yield during sleep, all three complete in ~0.1s.',
          expected_output: `[AuthService] Fetch started...
[BillingService] Fetch started...
[ProfileService] Fetch started...
[AuthService] Fetch finished!
[BillingService] Fetch finished!
[ProfileService] Fetch finished!

All fetched: ['AuthService_data', 'BillingService_data', 'ProfileService_data']
Total time elapsed: 0.10s (Sequential would take 0.30s)`,
          quiz: {
            id: 'quiz-l4-sync-async',
            title: 'Sync vs Async Check',
            questions: [
              {
                id: 'q-l4-sa-1',
                question_text: 'If 5 independent network requests each take 200ms, approximately how long will they take when run concurrently with asyncio.gather()?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '1000ms (1.0 second)' },
                  { id: 'opt_2', text: '~200ms (0.2 seconds)' },
                  { id: 'opt_3', text: '40ms' },
                  { id: 'opt_4', text: 'Instantaneous (0ms)' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Because network waiting times overlap concurrently, the total duration is approximately equal to the single slowest request (~200ms).'
              }
            ]
          },
          key_takeaways: [
            'Synchronous code accumulates latency additively (Total = t1 + t2 + t3).',
            'Asynchronous concurrent code overlaps latency (Total ≈ max(t1, t2, t3)).',
            'Cooperative yielding enables one thread to service other work during I/O waits.'
          ],
          revision_prompts: [
            'Why does time.sleep() block the entire event loop when called inside a coroutine?',
            'What is the difference between concurrency and parallelism?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-coroutines-async-await',
          slug: 'coroutines-async-and-await',
          title: 'Coroutines, async, and await: Syntax and Mechanics',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Master async def function declarations, coroutine objects, await expressions, and awaitable protocols.',
          learning_objectives: [
            'Understand that calling an async def function returns an unexecuted coroutine object',
            'Use await to pause execution and yield control to awaitables',
            'Identify the three native awaitable types: Coroutines, Tasks, and Futures'
          ],
          content_markdown: `### The Anatomy of Coroutines

1. **\`async def\` Definition**: Declares a native coroutine function.
2. **Calling a Coroutine**: Calling \`my_coro()\` does **NOT** run the function immediately! It creates and returns a **coroutine object**:
   \`\`\`python
   c = fetch_data() # c is a <coroutine object fetch_data at 0x...>
   \`\`\`
3. **The \`await\` Keyword**:
   - Suspends the execution of the surrounding coroutine.
   - Hands control back to the event loop.
   - Can only be used inside \`async def\` functions.
   - Only accepts an **awaitable** object (Coroutine, \`asyncio.Task\`, or \`asyncio.Future\`).`,
          code_snippet: `import asyncio

async def compute_checksum(data: str) -> int:
    await asyncio.sleep(0.01) # Yield to event loop
    return sum(ord(c) for c in data)

async def main():
    # Calling without await only creates the coroutine object
    coro = compute_checksum("Revoraa")
    print("Direct invocation returns:", type(coro))

    # Awaiting executes the coroutine to completion
    result = await coro
    print("Awaited result:", result)

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'Direct invocation returns a coroutine object. The await operator drives the coroutine to completion and extracts its return value.',
          expected_output: `Direct invocation returns: <class 'coroutine'>
Awaited result: 727`,
          quiz: {
            id: 'quiz-l4-coro-mechanics',
            title: 'Coroutine Mechanics Check',
            questions: [
              {
                id: 'q-l4-cm-1',
                question_text: 'What happens if you call an `async def` function without using `await` or scheduling it on the event loop?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The function runs synchronously in the background.' },
                  { id: 'opt_2', text: 'A coroutine object is created, but its code does not execute, triggering a RuntimeWarning: coroutine was never awaited.' },
                  { id: 'opt_3', text: 'Python throws a SyntaxError.' },
                  { id: 'opt_4', text: 'The computer CPU freezes.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Calling an async def function only returns a coroutine generator wrapper. It must be awaited or scheduled as a Task for its body to execute.'
              }
            ]
          },
          key_takeaways: [
            'async def defines a native coroutine function.',
            'Calling a coroutine function returns a coroutine object without executing it.',
            'The await keyword pauses execution until the awaitable finishes and yields its return value.'
          ],
          revision_prompts: [
            'What are the three types of awaitable objects recognized by Python?',
            'Can you use await outside of an async def function in a standard Python script?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-event-loop-architecture',
          slug: 'creating-and-running-an-event-loop',
          title: 'Creating and Running an Event Loop: asyncio.run and Lifecycle',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 4,
          summary: 'Examine event loop internals, asyncio.run lifecycle management, and loop policy providers.',
          learning_objectives: [
            'Understand how asyncio.run manages loop creation, execution, and cleanup',
            'Trace the event loop selector/epoll readiness cycle',
            'Avoid legacy get_event_loop() anti-patterns in modern Python 3.10+'
          ],
          content_markdown: `### The Event Loop Engine

The **event loop** is the central scheduler that powers asyncio. It continuously executes a cycle:

1. **Select**: Queries OS I/O selectors (\`epoll\` / \`kqueue\`) to determine which sockets or timers are ready.
2. **Dispatch**: Advances coroutines and callbacks associated with ready descriptors.
3. **Repeat**: Continues looping until all scheduled tasks complete or cancellation is triggered.

### The Modern Standard: \`asyncio.run()\`

Introduced in Python 3.7+, \`asyncio.run(main())\` should be used as the single entrypoint:
- Creates a fresh event loop.
- Runs the passed coroutine until completion.
- Finalizes all asynchronous generators.
- Closes the loop and thread executors cleanly.
- Never use legacy \`asyncio.get_event_loop().run_until_complete()\` in new code!`,
          code_snippet: `import asyncio

async def app_entrypoint():
    loop = asyncio.get_running_loop()
    print("Running loop identifier:", id(loop))
    print("Loop is running?:", loop.is_running())
    await asyncio.sleep(0.01)
    return "Application shutdown cleanly"

# Modern idiomatic entrypoint
result = asyncio.run(app_entrypoint())
print(result)`,
          code_language: 'python',
          code_explanation: 'asyncio.run sets up the loop, executes the root coroutine, cleans up pending tasks, and shuts down the loop deterministically.',
          expected_output: `Running loop identifier: <loop_id>
Loop is running?: True
Application shutdown cleanly`,
          quiz: {
            id: 'quiz-l4-loop-lifecycle',
            title: 'Event Loop Lifecycle Check',
            questions: [
              {
                id: 'q-l4-ll-1',
                question_text: 'Why should you prefer asyncio.run(coro()) over manually creating and closing event loops?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because asyncio.run() runs in a separate thread.' },
                  { id: 'opt_2', text: 'Because it automatically manages loop creation, task cancellation, generator cleanup, and threadpool shutdown.' },
                  { id: 'opt_3', text: 'Because asyncio.run() disables the GIL.' },
                  { id: 'opt_4', text: 'Because manual loops cannot run more than 1 coroutine.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'asyncio.run handles the complete lifecycle, ensuring pending async generators and executors are cleanly shut down without leaking descriptors.'
              }
            ]
          },
          key_takeaways: [
            'The event loop monitors I/O readiness and drives coroutines cooperatively.',
            'Use asyncio.run() as the single top-level entrypoint for asyncio programs.',
            'Use asyncio.get_running_loop() inside coroutines to access the current loop.'
          ],
          revision_prompts: [
            'What happens if you call asyncio.run() from inside an already running coroutine?',
            'What is uvloop and how does it replace the default CPython event loop?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-scheduling-tasks-asyncio',
          slug: 'scheduling-tasks-with-asyncio',
          title: 'Scheduling Tasks with asyncio.create_task',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 5,
          summary: 'Wrap coroutines into concurrent asyncio.Task instances, background execution, and reference retention to prevent garbage collection.',
          learning_objectives: [
            'Convert coroutines into actively scheduled asyncio.Task instances',
            'Understand that tasks begin executing concurrently immediately upon creation',
            'Prevent task garbage collection bugs by maintaining strong references'
          ],
          content_markdown: `### Coroutines vs Tasks

- A **Coroutine** is inert until awaited.
- An **\`asyncio.Task\`** wraps a coroutine and immediately schedules it on the event loop to run during the next iteration.

\`\`\`python
task = asyncio.create_task(my_coroutine())
\`\`\`

### The "Disappearing Task" Garbage Collection Trap

A critical bug in long-running Python applications:
- Python only keeps a **weak reference** to tasks created via \`asyncio.create_task()\`.
- If you fire a background task without saving a reference to a variable or set (\`asyncio.create_task(background_job())\`), the garbage collector may sweep the task mid-execution!
- **Rule**: Always store background tasks in a collection until they complete.`,
          code_snippet: `import asyncio

# Global set to hold strong references to running background tasks
background_tasks = set()

async def background_logger(message: str):
    await asyncio.sleep(0.02)
    print(f"[AUDIT LOG] {message}")

async def main():
    # Schedule background tasks safely
    for i in range(3):
        task = asyncio.create_task(background_logger(f"Event #{i}"))
        background_tasks.add(task)
        # Remove from set once finished
        task.add_done_callback(background_tasks.discard)

    print("Background tasks scheduled. Continuing main work...")
    await asyncio.sleep(0.05) # Allow background tasks to run
    print(f"Remaining active tasks in set: {len(background_tasks)}")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'create_task starts executing in the background immediately. Storing references in background_tasks prevents premature garbage collection.',
          expected_output: `Background tasks scheduled. Continuing main work...
[AUDIT LOG] Event #0
[AUDIT LOG] Event #1
[AUDIT LOG] Event #2
Remaining active tasks in set: 0`,
          quiz: {
            id: 'quiz-l4-task-scheduling',
            title: 'Task Scheduling Check',
            questions: [
              {
                id: 'q-l4-ts-1',
                question_text: 'Why should you store a reference to tasks created with asyncio.create_task()?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because tasks will not execute unless assigned to a variable.' },
                  { id: 'opt_2', text: 'Because the event loop only holds weak references to tasks; unreferenced tasks can be garbage collected mid-execution.' },
                  { id: 'opt_3', text: 'Because Python requires all tasks to be exported.' },
                  { id: 'opt_4', text: 'To encrypt task metadata.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'CPython event loops maintain weak references to scheduled tasks. If no strong reference exists in user code, cyclic GC can deallocate running tasks prematurely.'
              }
            ]
          },
          key_takeaways: [
            'asyncio.create_task() schedules a coroutine on the event loop concurrently.',
            'Tasks begin executing on the next loop tick, even before being awaited.',
            'Always maintain strong references to background tasks to prevent garbage collection.'
          ],
          revision_prompts: [
            'What is the difference between await coro() and await asyncio.create_task(coro())?',
            'How does task.add_done_callback() work?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-running-concurrent-coroutines',
          slug: 'running-concurrent-coroutines',
          title: 'Running Concurrent Coroutines: asyncio.as_completed and Concurrency Limits',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 6,
          summary: 'Stream results as they finish using asyncio.as_completed and bound concurrency using asyncio.Semaphore.',
          learning_objectives: [
            'Stream completed values immediately using asyncio.as_completed()',
            'Limit concurrent connections using asyncio.Semaphore',
            'Prevent server overload when processing thousands of asynchronous requests'
          ],
          content_markdown: `### Processing Results in Order of Completion

While \`asyncio.gather()\` waits until all tasks finish before returning results in input order, **\`asyncio.as_completed()\`** yields an iterator of coroutines that resolve as individual tasks finish, delivering immediate streaming feedback.

### Bounding Concurrency with \`asyncio.Semaphore\`

Firing 50,000 asynchronous requests simultaneously will overwhelm database connection pools and trigger HTTP 429 Too Many Requests errors. Use an **\`asyncio.Semaphore\`** to cap the maximum number of concurrent operations:

\`\`\`python
sem = asyncio.Semaphore(10) # At most 10 concurrent requests

async def bounded_fetch(url):
    async with sem:
        return await fetch(url)
\`\`\``,
          code_snippet: `import asyncio

async def worker(item_id: int, delay: float, sem: asyncio.Semaphore):
    async with sem:
        await asyncio.sleep(delay)
        return f"Item {item_id} processed"

async def main():
    # Allow at most 2 concurrent workers
    sem = asyncio.Semaphore(2)
    tasks = [
        worker(1, 0.04, sem),
        worker(2, 0.01, sem),
        worker(3, 0.02, sem),
        worker(4, 0.01, sem)
    ]

    print("Streaming completed items with as_completed:")
    for future in asyncio.as_completed(tasks):
        result = await future
        print(f" -> {result}")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'asyncio.Semaphore limits active workers to 2, and as_completed yields each result as soon as it resolves.',
          expected_output: `Streaming completed items with as_completed:
 -> Item 2 processed
 -> Item 1 processed
 -> Item 4 processed
 -> Item 3 processed`,
          quiz: {
            id: 'quiz-l4-semaphore',
            title: 'Concurrency Limiting Check',
            questions: [
              {
                id: 'q-l4-sm-1',
                question_text: 'What is the purpose of an asyncio.Semaphore in high-volume network clients?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To encrypt socket packets.' },
                  { id: 'opt_2', text: 'To limit the maximum number of concurrent tasks executing a critical section simultaneously.' },
                  { id: 'opt_3', text: 'To convert asynchronous code into multi-threaded code.' },
                  { id: 'opt_4', text: 'To automatically retry failed requests.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A Semaphore maintains an internal counter, blocking additional tasks from entering when the capacity limit is reached, protecting downstream services.'
              }
            ]
          },
          key_takeaways: [
            'asyncio.as_completed() yields tasks in the order they finish rather than input order.',
            'asyncio.Semaphore enforces bounded concurrency to prevent resource starvation.',
            'Always guard high-volume asynchronous network calls with a concurrency limit.'
          ],
          revision_prompts: [
            'How does asyncio.as_completed differ from asyncio.gather()?',
            'What is the difference between an asyncio.Lock and an asyncio.Semaphore?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-asyncio-gather-taskgroups',
          slug: 'asyncio-gather-and-structured-task-management',
          title: 'Structured Concurrency: asyncio.gather vs asyncio.TaskGroup',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 7,
          summary: 'Compare asyncio.gather with modern Python 3.11+ TaskGroup structured concurrency, ExceptionGroup handling, and leak prevention.',
          learning_objectives: [
            'Contrast unstructured concurrency (gather) with structured concurrency (TaskGroup)',
            'Understand how TaskGroup automatically cancels sibling tasks if one fails',
            'Handle multi-exception failures using Python 3.11+ ExceptionGroup and except*'
          ],
          content_markdown: `### The Problem with \`asyncio.gather()\`

Historically, \`asyncio.gather()\` was used to aggregate coroutines:
- If one task failed, by default the others kept running in the background ("orphaned tasks").
- Errors could leak silently or be masked.

### Structured Concurrency: \`asyncio.TaskGroup\` (Python 3.11+)

**Structured Concurrency** treats a group of concurrent tasks as a single lexical block:
- Entered via \`async with asyncio.TaskGroup() as tg:\`.
- If any task inside the group raises an exception:
  1. All other pending tasks in the group are **automatically cancelled**.
  2. The \`TaskGroup\` waits for all cancellations to finish.
  3. All encountered exceptions are bundled into an **\`ExceptionGroup\`**.
- No orphaned tasks can escape the block.`,
          code_snippet: `import asyncio

async def fetch_success():
    await asyncio.sleep(0.01)
    return "Profile loaded"

async def fetch_failure():
    await asyncio.sleep(0.02)
    raise ValueError("Database connection dropped")

async def main():
    try:
        # Python 3.11+ Structured Concurrency
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(fetch_success())
            t2 = tg.create_task(fetch_failure())
    except* ValueError as eg:
        print(f"Caught ExceptionGroup with error: {eg.exceptions[0]}")
    
    print("TaskGroup exited cleanly with all siblings accounted for.")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'When t2 raises ValueError, TaskGroup cancels remaining tasks and packages errors into an ExceptionGroup.',
          expected_output: `Caught ExceptionGroup with error: Database connection dropped
TaskGroup exited cleanly with all siblings accounted for.`,
          quiz: {
            id: 'quiz-l4-taskgroup',
            title: 'Structured Concurrency Check',
            questions: [
              {
                id: 'q-l4-tg-1',
                question_text: 'What happens to other running tasks in an asyncio.TaskGroup when one task raises an unhandled exception?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They continue running indefinitely in the background.' },
                  { id: 'opt_2', text: 'All remaining tasks in the group are immediately cancelled and awaited.' },
                  { id: 'opt_3', text: 'The Python interpreter crashes immediately.' },
                  { id: 'opt_4', text: 'They are converted into synchronous threads.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Structured concurrency guarantees no orphaned tasks. When one task fails, TaskGroup cancels all sibling tasks before exiting.'
              }
            ]
          },
          key_takeaways: [
            'asyncio.TaskGroup provides structured concurrency in Python 3.11+.',
            'If a task fails, sibling tasks are automatically cancelled, preventing resource leaks.',
            'Multiple concurrent exceptions are propagated together via ExceptionGroup.'
          ],
          revision_prompts: [
            'How does return_exceptions=True in asyncio.gather change its error behavior?',
            'What is the except* syntax and how does it match exception types inside an ExceptionGroup?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-timeouts-and-cancellation',
          slug: 'timeouts-and-cancellation',
          title: 'Timeouts and Cancellation: asyncio.timeout and CancelledError',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 8,
          summary: 'Master task cancellation mechanics, handling asyncio.CancelledError, and Python 3.11+ asyncio.timeout context managers.',
          learning_objectives: [
            'Cancel running tasks using task.cancel() and observe CancelledError propagation',
            'Enforce task deadlines using asyncio.timeout() and asyncio.wait_for()',
            'Maintain cleanup invariants when handling CancelledError'
          ],
          content_markdown: `### How Task Cancellation Works

When you call \`task.cancel()\`:
1. The event loop injects an \`asyncio.CancelledError\` into the coroutine at its next \`await\` point.
2. The coroutine unwinds its stack, executing any active \`finally:\` cleanup blocks.
3. If the coroutine does not catch and suppress \`CancelledError\`, the task state becomes \`cancelled()\`.

### Modern Deadlines: \`asyncio.timeout()\` (Python 3.11+)

Instead of wrapper functions like \`asyncio.wait_for()\`, modern Python uses the context manager \`asyncio.timeout(seconds)\`:

\`\`\`python
async with asyncio.timeout(2.0):
    await long_running_task()
\`\`\`
If 2.0 seconds elapse, it raises \`TimeoutError\` and cancels the inner coroutine cleanly.`,
          code_snippet: `import asyncio

async def slow_network_service():
    try:
        print("[SERVICE] Request received. Waiting for data...")
        await asyncio.sleep(1.0) # Exceeds timeout
        return "Complete payload"
    except asyncio.CancelledError:
        print("[SERVICE] Cancelled! Running cleanup rollback...")
        raise # Re-raise to acknowledge cancellation

async def main():
    try:
        # Enforce 0.05s timeout
        async with asyncio.timeout(0.05):
            await slow_network_service()
    except TimeoutError:
        print("[CLIENT] TimeoutError caught: Request aborted after 0.05s")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'asyncio.timeout raises TimeoutError, injecting CancelledError into slow_network_service, which executes its cleanup before aborting.',
          expected_output: `[SERVICE] Request received. Waiting for data...
[SERVICE] Cancelled! Running cleanup rollback...
[CLIENT] TimeoutError caught: Request aborted after 0.05s`,
          quiz: {
            id: 'quiz-l4-timeouts',
            title: 'Timeout & Cancellation Check',
            questions: [
              {
                id: 'q-l4-tc-1',
                question_text: 'What should you do inside an except asyncio.CancelledError block after performing cleanup?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Always re-raise CancelledError unless explicitly intending to swallow cancellation.' },
                  { id: 'opt_2', text: 'Return a string "cancelled".' },
                  { id: 'opt_3', text: 'Call sys.exit().' },
                  { id: 'opt_4', text: 'Call time.sleep().' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Swallowing CancelledError without re-raising prevents the task from completing its cancellation contract, hanging callers waiting for task completion.'
              }
            ]
          },
          key_takeaways: [
            'Calling task.cancel() raises asyncio.CancelledError at the next await statement.',
            'Always allow CancelledError to propagate after executing necessary cleanup.',
            'asyncio.timeout() provides a clean, scoped context manager for enforcing deadlines.'
          ],
          revision_prompts: [
            'What is asyncio.shield() and when is it necessary during cancellation?',
            'What happens if an asynchronous cleanup block inside finally contains an await statement?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-async-exception-handling',
          slug: 'handling-exceptions-in-asynchronous-code',
          title: 'Handling Exceptions in Asynchronous Code',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 9,
          summary: 'Manage exception boundaries across coroutines, tasks, and background executors, and avoid unhandled exception leaks.',
          learning_objectives: [
            'Understand how exceptions propagate across await boundaries',
            'Capture task exceptions using task.exception() without crashing event loops',
            'Set custom exception handlers via loop.set_exception_handler()'
          ],
          content_markdown: `### Asynchronous Exception Propagation

When an exception occurs inside a coroutine:
- If **awaited directly** (\`await my_coro()\`), it propagates up the call stack identically to synchronous code.
- If running as a **background task** (\`asyncio.create_task()\`) and **never awaited**, the exception is stored inside the \`Task\` object.
- When the task is deallocated, Python logs:
  \`Task exception was never retrieved\` and dumps the traceback to stderr.

### Global Exception Handlers

For production servers, register a global handler on the event loop to catch unhandled background task exceptions and route them to your telemetry/logging system:

\`\`\`python
loop.set_exception_handler(custom_error_handler)
\`\`\``,
          code_snippet: `import asyncio

def global_exception_handler(loop, context):
    msg = context.get("exception", context["message"])
    print(f"[GLOBAL HANDLER] Caught unhandled async error: {msg}")

async def faulty_background_worker():
    await asyncio.sleep(0.01)
    raise ConnectionResetError("Remote server closed socket unexpectedly")

async def main():
    loop = asyncio.get_running_loop()
    loop.set_exception_handler(global_exception_handler)

    # Fire background task without awaiting it
    task = asyncio.create_task(faulty_background_worker())
    await asyncio.sleep(0.03)

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'The global exception handler intercepts unhandled background task failures, preventing silent crashes.',
          expected_output: `[GLOBAL HANDLER] Caught unhandled async error: Remote server closed socket unexpectedly`,
          quiz: {
            id: 'quiz-l4-async-err',
            title: 'Async Errors Check',
            questions: [
              {
                id: 'q-l4-ae-1',
                question_text: 'What happens if a background asyncio.Task raises an exception and is never awaited?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The entire operating system reboots.' },
                  { id: 'opt_2', text: 'The exception is held in the Task; when garbage-collected, Python logs "Task exception was never retrieved".' },
                  { id: 'opt_3', text: 'The task automatically retries 3 times.' },
                  { id: 'opt_4', text: 'The error is silently discarded without any log.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Unretrieved task exceptions are logged when the task object is destroyed. Setting a loop exception handler captures them immediately.'
              }
            ]
          },
          key_takeaways: [
            'Awaited coroutines propagate exceptions naturally through try...except blocks.',
            'Unawaited background tasks store their exceptions; configure a global loop handler to capture them.',
            'Use task.exception() to inspect failures programmatically.'
          ],
          revision_prompts: [
            'What parameters does a loop exception handler callback receive?',
            'How does return_exceptions=True in asyncio.gather prevent one failure from halting all tasks?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-async-context-managers',
          slug: 'asynchronous-context-managers',
          title: 'Asynchronous Context Managers: __aenter__ and __aexit__',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 10,
          summary: 'Master async with, implementing __aenter__ and __aexit__, and contextlib.asynccontextmanager.',
          learning_objectives: [
            'Implement the asynchronous context management protocol (__aenter__ and __aexit__)',
            'Use contextlib.asynccontextmanager for concise generator-based async contexts',
            'Manage async network client sessions and transaction lifecycles'
          ],
          content_markdown: `### The Asynchronous Context Management Protocol

When acquiring or releasing a resource involves asynchronous I/O (e.g., establishing a TLS connection or sending an asynchronous database \`ROLLBACK\`), standard \`__enter__\`/\`__exit__\` cannot be used because they are synchronous.

Python provides \`async with\` which invokes:
- **\`async def __aenter__(self)\`**: Awaited during entry.
- **\`async def __aexit__(self, exc_type, exc_val, exc_tb)\`**: Awaited during exit.

### Using \`@contextlib.asynccontextmanager\`

Just like synchronous \`@contextmanager\`, you can create lightweight async context managers with an \`async def\` generator yielding once.`,
          code_snippet: `from contextlib import asynccontextmanager
import asyncio

class AsyncDatabasePool:
    async def __aenter__(self):
        print("[POOL] Acquiring connection from async pool...")
        await asyncio.sleep(0.01) # Simulated network handshake
        return "ConnHandle_42"

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("[POOL] Releasing connection back to pool...")
        await asyncio.sleep(0.01) # Simulated release protocol
        return False

@asynccontextmanager
async def trace_span(name: str):
    print(f"[SPAN START] {name}")
    try:
        yield
    finally:
        print(f"[SPAN END]   {name}")

async def main():
    async with AsyncDatabasePool() as conn:
        async with trace_span("QueryUsers"):
            print(f"Executing query with {conn}")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: '__aenter__ and __aexit__ allow asynchronous network handshake and release logic during context entry and exit.',
          expected_output: `[POOL] Acquiring connection from async pool...
[SPAN START] QueryUsers
Executing query with ConnHandle_42
[SPAN END]   QueryUsers
[POOL] Releasing connection back to pool...`,
          quiz: {
            id: 'quiz-l4-async-cm',
            title: 'Async Context Manager Check',
            questions: [
              {
                id: 'q-l4-acm-1',
                question_text: 'Why can you NOT use a standard synchronous `with` block for an aiohttp ClientSession or async database connection?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Python disallows with inside async functions.' },
                  { id: 'opt_2', text: 'Because closing an async connection requires awaiting network teardown packets in __aexit__.' },
                  { id: 'opt_3', text: 'Because synchronous with statements require root privileges.' },
                  { id: 'opt_4', text: 'Because async connections do not have headers.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Network sockets require non-blocking async cleanup (flushing buffers, TLS close_notify). __aexit__ allows awaiting these asynchronous teardown operations.'
              }
            ]
          },
          key_takeaways: [
            'async with uses __aenter__ and __aexit__ to support asynchronous resource management.',
            'contextlib.asynccontextmanager provides clean generator-based asynchronous contexts.',
            'Always use async context managers for asynchronous database connections and HTTP sessions.'
          ],
          revision_prompts: [
            'How does exception suppression work in __aexit__ compared to __exit__?',
            'What is contextlib.AsyncExitStack and when should it be used?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-async-iterators-generators',
          slug: 'asynchronous-iteration-and-generators',
          title: 'Asynchronous Iteration and Generators: async for and yield',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 11,
          summary: 'Stream asynchronous data pipelines using async for, __aiter__, __anext__, and async generator functions with yield.',
          learning_objectives: [
            'Implement the asynchronous iteration protocol (__aiter__ and __anext__)',
            'Write asynchronous generator functions combining async def with yield',
            'Stream unbounded real-time data feeds with constant memory footprint'
          ],
          content_markdown: `### The Asynchronous Iteration Protocol

When values in a stream arrive over time (e.g., SSE event streams, WebSocket packets, paginated API results), synchronous iteration blocks the thread:

1. **\`async for item in async_stream:\`**
   - Calls \`stream.__aiter__()\` to obtain an asynchronous iterator.
   - Awaits \`stream.__anext__()\` on each iteration.
   - Terminates when \`StopAsyncIteration\` is raised.

2. **Asynchronous Generator Functions**:
   - Any \`async def\` function containing \`yield\` is an **asynchronous generator**.
   - Yields values lazily across await intervals.`,
          code_snippet: `import asyncio

async def stream_ticker_prices(symbol: str, count: int):
    """Asynchronous generator streaming live price ticks."""
    base_price = 100.0
    for tick in range(count):
        await asyncio.sleep(0.01) # Simulated network arrival latency
        base_price += (tick * 1.5)
        yield {"symbol": symbol, "tick": tick + 1, "price": base_price}

async def main():
    print("Streaming ticker data using async for:")
    async for tick in stream_ticker_prices("REV", 3):
        print(f" -> [{tick['symbol']}] Tick {tick['tick']}: \${tick['price']:.2f}")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'async for consumes items as they are yielded lazily, pausing between arrivals without blocking the event loop.',
          expected_output: `Streaming ticker data using async for:
 -> [REV] Tick 1: \$100.00
 -> [REV] Tick 2: \$101.50
 -> [REV] Tick 3: \$104.50`,
          quiz: {
            id: 'quiz-l4-async-iter',
            title: 'Async Iterators Check',
            questions: [
              {
                id: 'q-l4-ai-1',
                question_text: 'What exception signals the termination of an asynchronous iterator in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'StopIteration' },
                  { id: 'opt_2', text: 'StopAsyncIteration' },
                  { id: 'opt_3', text: 'GeneratorExit' },
                  { id: 'opt_4', text: 'EOFError' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'In Python asynchronous iteration, raising StopAsyncIteration signals that the iterator has completed and has no further items.'
              }
            ]
          },
          key_takeaways: [
            'async for consumes asynchronous iterators implementing __aiter__ and __anext__.',
            'Asynchronous generators combine async def and yield to stream data lazily.',
            'Streams terminate when StopAsyncIteration is raised.'
          ],
          revision_prompts: [
            'Can you use a list comprehension with async for? How does an async list comprehension work?',
            'How do you properly clean up an asynchronous generator if iteration is stopped early?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-common-async-mistakes-blocking',
          slug: 'common-asyncio-mistakes-and-event-loop-blocking',
          title: 'Common asyncio Mistakes: Blocking the Event Loop and Fixes',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 12,
          summary: 'Diagnose the cardinal sin of asyncio: blocking synchronous calls, CPU-heavy work, and offloading via asyncio.to_thread.',
          learning_objectives: [
            'Identify code that freezes the event loop (time.sleep, requests.get, CPU loops)',
            'Use asyncio.to_thread() to offload blocking synchronous libraries into worker threads',
            'Enable asyncio debug mode to detect slow callbacks automatically'
          ],
          content_markdown: `### The Cardinal Sin of asyncio: Blocking the Loop

Because asyncio is single-threaded, **any synchronous blocking call freezes ALL concurrent tasks**:
- Using \`time.sleep(5)\` halts all 10,000 active web connections for 5 seconds!
- Using synchronous \`requests.get()\` or standard \`sqlite3\` queries blocks the loop.
- Heavy CPU computation (cryptography, image processing) starves other tasks.

### The Remedy: \`asyncio.to_thread()\` (Python 3.9+)

When you must call a legacy synchronous library, offload it to a separate worker thread using \`asyncio.to_thread()\`:

\`\`\`python
# Synchronous library offloaded to a thread without freezing the event loop
response = await asyncio.to_thread(sync_blocking_function, arg1, arg2)
\`\`\``,
          code_snippet: `import asyncio
import time

def legacy_heavy_calculation(n: int) -> int:
    """Simulated legacy blocking computation."""
    time.sleep(0.02) # Synchronous blocking call
    return sum(i * i for i in range(n))

async def heartbeat():
    """Lightweight task that should run without interruption."""
    for i in range(3):
        await asyncio.sleep(0.01)
        print(f"[HEARTBEAT] Tick {i + 1} healthy")

async def main():
    print("Running background heartbeat alongside offloaded computation:")
    # Run heartbeat and heavy calculation concurrently without freezing heartbeat!
    res, _ = await asyncio.gather(
        asyncio.to_thread(legacy_heavy_calculation, 50_000),
        heartbeat()
    )
    print(f"Calculated result: {res}")

asyncio.run(main())`,
          code_language: 'python',
          code_explanation: 'asyncio.to_thread runs legacy_heavy_calculation in a background threadpool thread, allowing heartbeat to tick uninterrupted.',
          expected_output: `Running background heartbeat alongside offloaded computation:
[HEARTBEAT] Tick 1 healthy
[HEARTBEAT] Tick 2 healthy
[HEARTBEAT] Tick 3 healthy
Calculated result: 41665416675000`,
          quiz: {
            id: 'quiz-l4-blocking-loop',
            title: 'Blocking Prevention Check',
            questions: [
              {
                id: 'q-l4-bl-1',
                question_text: 'What is the correct way to execute a synchronous blocking library function (like a legacy database driver) inside an asyncio program?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Call it directly inside the coroutine.' },
                  { id: 'opt_2', text: 'Wrap it with `await asyncio.to_thread(func, *args)` to run it in a separate threadpool worker.' },
                  { id: 'opt_3', text: 'Add an @asyncio.coroutine decorator.' },
                  { id: 'opt_4', text: 'Call time.sleep() before the function.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'asyncio.to_thread offloads the blocking execution to a background OS thread, keeping the event loop responsive to other concurrent tasks.'
              }
            ]
          },
          key_takeaways: [
            'Never call blocking synchronous functions (time.sleep, requests) directly inside coroutines.',
            'Blocking the event loop starves all other concurrent tasks.',
            'Use asyncio.to_thread() to delegate blocking work to a threadpool worker safely.'
          ],
          revision_prompts: [
            'How do you enable asyncio debug mode to log warnings whenever a callback takes longer than 100ms?',
            'When should CPU-bound tasks be moved to ProcessPoolExecutor instead of asyncio.to_thread?'
          ]
        }
      ]
    }
  ]
};
