/**
 * Revoraa Level 4: Advanced Python - Module 4: Performance Profiling and Optimization
 * 
 * 12 comprehensive lessons covering performance methodology, time complexity vs wall-clock,
 * time.perf_counter, cProfile, tracemalloc, data structure benchmarks, functools.lru_cache,
 * cache invalidation, itertools streaming, statistical benchmarking, and clean optimization tradeoffs.
 */

export const MODULE_4_PERFORMANCE_OPTIMIZATION = {
  id: 'mod-py-performance-optimization',
  slug: 'performance-profiling-and-optimization',
  level_number: 4,
  title: 'Performance Profiling and Optimization',
  description: 'Master scientific measurement, cProfile bottlenecks, tracemalloc heap footprints, algorithmic optimization, LRU caching, and statistical benchmarking.',
  estimated_hours: 10,
  sort_order: 4,
  is_published: true,
  topics: [
    {
      id: 'top-profiling-and-optimization',
      slug: 'profiling-benchmarking-and-caching',
      title: 'Profiling, Memory Analysis, Caching & Optimization',
      summary: 'Explore deterministic profiling, memory heap tracing, LRU cache eviction policies, itertools lazy iteration, and data-driven refactoring.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-what-optimization-means',
          slug: 'what-performance-optimization-means',
          title: 'What Performance Optimization Means: The Scientific Method in Engineering',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Establish the scientific methodology of performance engineering: Establish baselines, hypothesize bottlenecks, measure profiles, and verify with tests.',
          learning_objectives: [
            'Follow the 4-step scientific performance cycle: Measure -> Hypothesize -> Refactor -> Verify',
            'Avoid guessing bottlenecks (the human intuition fallacy in software performance)',
            'Define Service Level Objectives (SLOs) for latency (p50, p95, p99) and memory limits'
          ],
          content_markdown: `### The Golden Rule of Optimization

> "Premature optimization is the root of all evil." — Donald Knuth

Engineers routinely spend days micro-optimizing code that accounts for 0.1% of runtime while ignoring an unindexed database query taking 90% of the request duration.

### The 4-Step Engineering Cycle

1. **Measure Baseline**: Record current wall-clock latency, throughput, and memory consumption under realistic production-grade inputs.
2. **Profile & Hypothesize**: Use profilers (\`cProfile\`, \`tracemalloc\`) to identify the **critical path** (the Pareto 80/20 bottleneck).
3. **Targeted Refactor**: Apply targeted algorithmic improvements (e.g., $O(N^2) \\to O(N)$) or caching.
4. **Empirical Verification**: Re-run the automated test suite to ensure correctness is preserved, then benchmark to prove statistically significant improvement.`,
          code_snippet: `def optimization_workflow_summary():
    stages = [
        ("1. Baseline", "Measure current p95 latency under realistic load"),
        ("2. Profile",  "Identify hot functions using cProfile or tracemalloc"),
        ("3. Refactor", "Upgrade data structure or eliminate repeated computation"),
        ("4. Verify",   "Prove unit tests pass and latency improves with benchmark data")
    ]
    for stage, action in stages:
        print(f"{stage:12} -> {action}")

optimization_workflow_summary()`,
          code_language: 'python',
          code_explanation: 'Performance engineering is an empirical discipline requiring measurable baselines before modifying production code.',
          expected_output: `1. Baseline  -> Measure current p95 latency under realistic load
2. Profile   -> Identify hot functions using cProfile or tracemalloc
3. Refactor  -> Upgrade data structure or eliminate repeated computation
4. Verify    -> Prove unit tests pass and latency improves with benchmark data`,
          quiz: {
            id: 'quiz-l4-opt-intro',
            title: 'Optimization Methodology Check',
            questions: [
              {
                id: 'q-l4-oi-1',
                question_text: 'What is the mandatory first step before making any performance optimization changes to a codebase?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Rewrite the module in C++ immediately.' },
                  { id: 'opt_2', text: 'Measure the baseline performance and profile where time is actually spent.' },
                  { id: 'opt_3', text: 'Delete all comments to make the file smaller.' },
                  { id: 'opt_4', text: 'Increase the server RAM.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Never optimize without profiling data. Always measure baseline metrics first to prove where the actual bottleneck exists.'
              }
            ]
          },
          key_takeaways: [
            'Never optimize based on intuition; always gather empirical profiling data first.',
            'Target the critical path that accounts for the majority of execution time.',
            'Always ensure existing automated test suites pass to verify that optimizations preserve correctness.'
          ],
          revision_prompts: [
            'What is the difference between average (mean) latency and p99 percentile latency?',
            'Why is code readability often more valuable than micro-optimizations that save nanoseconds?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-time-complexity-vs-runtime',
          slug: 'time-complexity-versus-measured-runtime',
          title: 'Time Complexity Versus Measured Runtime: Constants and Cache Lines',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Examine asymptotic Big-O bounds vs physical wall-clock runtime, constant factors, memory locality, and hardware CPU caches.',
          learning_objectives: [
            'Understand why an O(N) algorithm with high constant factor can be slower than an O(N log N) algorithm for small N',
            'Explain how CPU L1/L2/L3 cache line prefetching favors contiguous arrays over pointer-chasing structures',
            'Select algorithms based on realistic input sizes (N) rather than asymptotic theory alone'
          ],
          content_markdown: `### Big-O Ignores Constant Factors ($C$)

Asymptotic notation describes growth rate as $N \\to \\infty$:
$$\\text{Runtime} = C \\cdot f(N) + O(g(N))$$

- For small $N$ ($N < 50$), an algorithm with $O(N^2)$ can easily run faster than an $O(N)$ algorithm if the $O(N)$ algorithm involves high setup overhead (e.g., regex compilation or hash table allocation).
- **CPU Cache Locality**: CPUs read memory in 64-byte **cache lines**. Traversing contiguous memory (arrays/lists) triggers hardware prefetching. Traversing pointer-heavy graphs triggers constant RAM cache misses, incurring a 100x speed penalty per lookup!`,
          code_snippet: `import time

# Small N comparison: List scan vs Set allocation
small_items = [10, 20, 30, 40, 50]
target = 50

# Test 1: Direct linear scan on existing list
t0 = time.perf_counter()
for _ in range(10_000):
    found = target in small_items
t_list = time.perf_counter() - t0

# Test 2: Converting to set for "O(1)" lookup (high constant overhead)
t0 = time.perf_counter()
for _ in range(10_000):
    found = target in set(small_items)
t_set = time.perf_counter() - t0

print(f"Direct list scan:      {t_list * 1000:.2f} ms")
print(f"Set-conversion lookup: {t_set * 1000:.2f} ms")
print(f"Direct list was ~{t_set / t_list:.1f}x faster for N=5 because set allocation overhead dominates!")`,
          code_language: 'python',
          code_explanation: 'Converting to a set every loop iteration incurs hash table allocation overhead that dwarfs the linear scan for tiny arrays.',
          expected_output: `Direct list scan:      <time> ms
Set-conversion lookup: <time> ms
Direct list was ~<factor>x faster for N=5 because set allocation overhead dominates!`,
          quiz: {
            id: 'quiz-l4-big-o-vs-runtime',
            title: 'Complexity vs Runtime Check',
            questions: [
              {
                id: 'q-l4-cr-1',
                question_text: 'Why might an O(N) linear scan be faster than an O(1) set lookup for N=3 items?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Python lists have no memory footprint.' },
                  { id: 'opt_2', text: 'Because allocating and hashing a set has a constant overhead that exceeds 3 integer comparisons in contiguous memory.' },
                  { id: 'opt_3', text: 'Because Big-O only applies to Java.' },
                  { id: 'opt_4', text: 'Because sets are stored on the hard drive.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Big-O notation hides constant factors. For tiny N, memory allocation and hashing overhead exceed the cost of simple sequential pointer comparisons.'
              }
            ]
          },
          key_takeaways: [
            'Big-O notation characterizes asymptotic scaling as N grows large, not fixed wall-clock time for small N.',
            'High constant factors (object allocation, hashing) can make theoretically optimal algorithms slower on small datasets.',
            'Evaluate algorithms across realistic input distributions.'
          ],
          revision_prompts: [
            'Why does Timsort switch to insertion sort for arrays with fewer than 64 elements?',
            'What is a CPU cache miss and why does pointer chasing in trees cause it?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-measuring-execution-time-perf-counter',
          slug: 'measuring-execution-time-correctly',
          title: 'Measuring Execution Time Correctly: perf_counter vs time()',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Avoid wall-clock skew: Use time.perf_counter() for monotonic nanosecond resolution instead of time.time() or time.process_time().',
          learning_objectives: [
            'Understand why time.time() is vulnerable to NTP clock synchronization adjustments',
            'Use time.perf_counter() for high-resolution monotonic wall-clock benchmarking',
            'Contrast wall-clock time (perf_counter) with CPU compute time (process_time)'
          ],
          content_markdown: `### The Clocks of Python

1. **\`time.time()\` (Wall-Clock Real Time)**:
   - Measures system calendar time since Unix epoch.
   - **Vulnerable to Clock Skew**: If the OS syncs with an NTP server or daylight savings adjusts the clock, \`time.time()\` can jump backward or forward mid-measurement!
2. **\`time.perf_counter()\` (Monotonic High-Resolution)**:
   - Guaranteed **monotonic** (never moves backward).
   - Uses the highest resolution CPU hardware counter available (e.g., TSC on x86).
   - The gold standard for measuring code execution duration.
3. **\`time.process_time()\` (CPU Time Only)**:
   - Measures only CPU cycles spent inside the Python process, ignoring time spent sleeping or waiting for I/O.`,
          code_snippet: `import time

def benchmark_function():
    # Measure wall-clock with monotonic counter
    t_start = time.perf_counter()
    cpu_start = time.process_time()

    # Simulated workload with I/O sleep
    time.sleep(0.02) # I/O wait (0 CPU cycles)
    total = sum(i * i for i in range(100_000)) # CPU cycles

    t_elapsed = time.perf_counter() - t_start
    cpu_elapsed = time.process_time() - cpu_start

    print(f"Wall-clock elapsed (perf_counter): {t_elapsed * 1000:.2f} ms")
    print(f"CPU compute time   (process_time): {cpu_elapsed * 1000:.2f} ms")
    print("Notice that process_time ignored the 20ms spent sleeping on I/O!")

benchmark_function()`,
          code_language: 'python',
          code_explanation: 'perf_counter captures true end-to-end wall-clock latency, while process_time only tallies active CPU register utilization.',
          expected_output: `Wall-clock elapsed (perf_counter): <total_time> ms
CPU compute time   (process_time): <cpu_time> ms
Notice that process_time ignored the 20ms spent sleeping on I/O!`,
          quiz: {
            id: 'quiz-l4-clocks',
            title: 'Benchmarking Clocks Check',
            questions: [
              {
                id: 'q-l4-ck-1',
                question_text: 'Why is `time.perf_counter()` preferred over `time.time()` for benchmarking function execution?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because time.time() returns strings instead of floats.' },
                  { id: 'opt_2', text: 'Because time.perf_counter() is monotonic (never jumps backward due to NTP adjustments) and provides high hardware resolution.' },
                  { id: 'opt_3', text: 'Because perf_counter automatically turns off the garbage collector.' },
                  { id: 'opt_4', text: 'Because time.time() is deprecated in Python 3.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'perf_counter accesses the highest-resolution monotonic clock on the OS, ensuring measurements are never corrupted by system time sync jumps.'
              }
            ]
          },
          key_takeaways: [
            'Never benchmark execution with time.time() due to potential NTP clock skew.',
            'Always use time.perf_counter() for wall-clock benchmark measurements.',
            'Use time.process_time() when you want to measure pure CPU consumption excluding I/O wait.'
          ],
          revision_prompts: [
            'What is the difference between time.perf_counter() and time.monotonic() in Python?',
            'What is time.thread_time() and when is it useful in multi-threaded programs?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-profiling-cprofile-bottlenecks',
          slug: 'profiling-functions-and-identifying-bottlenecks',
          title: 'Deterministic Profiling with cProfile: Identifying the Critical Path',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 4,
          summary: 'Profile Python applications deterministically using the standard cProfile module, pstats sorting, and cumulative call time analysis.',
          learning_objectives: [
            'Profile execution using cProfile.Profile() and pstats.Stats',
            'Interpret ncalls, tottime, percall, and cumtime columns accurately',
            'Pinpoint the exact bottleneck function driving 80%+ of overall runtime'
          ],
          content_markdown: `### Deterministic Profiling with \`cProfile\`

\`cProfile\` is CPython's built-in C-extension profiler:
- Hooks into every function call and return.
- Measures invocation counts and elapsed time with low overhead.

### Reading \`pstats\` Columns

- **\`ncalls\`**: Number of times the function was called.
- **\`tottime\`**: Total time spent in the function itself, **excluding** calls to other sub-functions.
- **\`cumtime\`**: Cumulative time spent in the function **and all sub-functions** it called.
- **\`percall\`**: \`tottime\` divided by \`ncalls\`.

**Strategy**: Sort by **\`cumtime\`** to find the high-level operational bottleneck, then sort by **\`tottime\`** to locate the exact computational function burning CPU cycles.`,
          code_snippet: `import cProfile
import pstats
import io

def slow_subtask():
    # Bottleneck: repeated string concatenation
    s = ""
    for i in range(10_000):
        s += str(i)
    return len(s)

def fast_subtask():
    return sum(range(10_000))

def main_pipeline():
    fast_subtask()
    slow_subtask()

# Profile programmatically
pr = cProfile.Profile()
pr.enable()
main_pipeline()
pr.disable()

# Format and print top functions sorted by cumulative time
s = io.StringIO()
ps = pstats.Stats(pr, stream=s).sort_stats("cumtime")
ps.print_stats(5)

# Show first few lines of profile
lines = s.getvalue().splitlines()
for line in lines[:8]:
    print(line)`,
          code_language: 'python',
          code_explanation: 'cProfile measures every invocation. The pstats output highlights slow_subtask as the cumulative bottleneck.',
          expected_output: `<profile_header>
<profile_columns>
<function_rows>`,
          quiz: {
            id: 'quiz-l4-cprofile',
            title: 'cProfile Check',
            questions: [
              {
                id: 'q-l4-cp-1',
                question_text: 'What is the critical difference between `tottime` and `cumtime` in a cProfile report?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'tottime includes sub-functions; cumtime excludes sub-functions.' },
                  { id: 'opt_2', text: 'tottime measures time spent strictly inside the function body; cumtime includes all time spent in sub-functions called from it.' },
                  { id: 'opt_3', text: 'cumtime is measured in seconds; tottime in milliseconds.' },
                  { id: 'opt_4', text: 'There is no difference.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'tottime isolates the function self-time, whereas cumtime tracks total duration including all downstream nested child calls.'
              }
            ]
          },
          key_takeaways: [
            'cProfile provides deterministic function call profiling with standard library tooling.',
            'Sort by cumtime to identify high-level workflow bottlenecks; sort by tottime to locate CPU-heavy leaf functions.',
            'Profile with realistic production data volumes to capture true asymptotic behavior.'
          ],
          revision_prompts: [
            'How can you run cProfile directly from the command line: python -m cProfile -s cumtime script.py?',
            'What is sampling profiling (e.g. py-spy) and why is it preferred for production server monitoring?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-memory-allocation-tracemalloc',
          slug: 'memory-usage-and-allocation-fundamentals',
          title: 'Memory Usage and Heap Allocation: Profiling with tracemalloc',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 5,
          summary: 'Trace heap allocations, detect memory leaks, and take differential snapshots using the standard tracemalloc module.',
          learning_objectives: [
            'Trace memory allocations back to exact source file line numbers using tracemalloc',
            'Take memory snapshots and compute differential diffs (Snapshot.compare_to)',
            'Identify memory leaks and unexpected object retention'
          ],
          content_markdown: `### Tracing Python Heap Allocations

While CPU profiling finds slow code, memory profiling prevents **Out-Of-Memory (OOM)** server crashes.
The standard library **\`tracemalloc\`** module hooks into Python's PyMalloc and C allocators:
- Records the exact file, line number, and traceback of every heap allocation.
- Computes peak memory consumption.
- Compares two snapshots to reveal memory leaks.`,
          code_snippet: `import tracemalloc

# Start memory tracing
tracemalloc.start()

# Snapshot 1: Baseline
snapshot1 = tracemalloc.take_snapshot()

# Allocate a large data structure
leaked_data = [f"Record_{i}" * 10 for i in range(25_000)]

# Snapshot 2: After allocation
snapshot2 = tracemalloc.take_snapshot()

# Compare memory diff
top_stats = snapshot2.compare_to(snapshot1, "lineno")

print("Top 2 memory allocation lines:")
for stat in top_stats[:2]:
    print(f" -> {stat}")

current, peak = tracemalloc.get_traced_memory()
print(f"Peak memory traced: {peak / 1024 / 1024:.2f} MB")
tracemalloc.stop()`,
          code_language: 'python',
          code_explanation: 'tracemalloc isolates the exact source code line responsible for allocating the 25,000 strings and measures peak memory.',
          expected_output: `Top 2 memory allocation lines:
 -> <filename>:<line>: size=<size>, count=<count>
Peak memory traced: <peak_mb> MB`,
          quiz: {
            id: 'quiz-l4-tracemalloc',
            title: 'Memory Tracing Check',
            questions: [
              {
                id: 'q-l4-tm-1',
                question_text: 'How does `tracemalloc.take_snapshot().compare_to(previous_snapshot, "lineno")` help diagnose memory leaks?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It automatically frees leaked memory.' },
                  { id: 'opt_2', text: 'It computes the net increase in allocated memory per source code line between the two checkpoints.' },
                  { id: 'opt_3', text: 'It compresses the memory dump into a zip file.' },
                  { id: 'opt_4', text: 'It restarts the Python process.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Comparing two snapshots reveals which specific lines allocated objects that were not freed during the interval, pinpointing the leak.'
              }
            ]
          },
          key_takeaways: [
            'tracemalloc tracks memory allocations back to exact Python filenames and line numbers.',
            'Comparing snapshots before and after a workload exposes memory leaks and retained references.',
            'tracemalloc.get_traced_memory() reports current and peak heap memory footprint.'
          ],
          revision_prompts: [
            'How does sys.getsizeof() differ from tracemalloc memory tracing?',
            'What is the performance overhead of running tracemalloc in production?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-data-structures-performance',
          slug: 'choosing-appropriate-data-structures-performance',
          title: 'Choosing Appropriate Data Structures: Performance Benchmarks',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 6,
          summary: 'Benchmark collections.deque vs list for FIFO queues, bisect for binary searches, and set lookups.',
          learning_objectives: [
            'Demonstrate the O(1) vs O(N) performance difference between deque.popleft() and list.pop(0)',
            'Use the bisect module for O(log N) binary insertion and search in sorted lists',
            'Choose specialized collection containers (array, deque, set) for optimal runtime'
          ],
          content_markdown: `### The Cost of Data Structure Selection

Selecting the wrong container can turn an instantaneous operation into a multisecond freeze:

1. **FIFO Queues**:
   - \`list.pop(0)\`: **$O(N)$**. Shifting 1,000,000 pointers in memory on every dequeue.
   - \`collections.deque.popleft()\`: **$O(1)$**. Unlinks the head of a doubly-linked block array in nanoseconds.
2. **Membership Testing**:
   - \`item in list\`: **$O(N)$**. Scans elements linearly.
   - \`item in set\`: **$O(1)$**. Direct hash bucket lookup.`,
          code_snippet: `from collections import deque
import time

count = 20_000

# 1. Benchmark list.pop(0) - O(N) per pop
lst = list(range(count))
t0 = time.perf_counter()
while lst:
    lst.pop(0)
t_list = time.perf_counter() - t0

# 2. Benchmark deque.popleft() - O(1) per pop
dq = deque(range(count))
t0 = time.perf_counter()
while dq:
    dq.popleft()
t_deque = time.perf_counter() - t0

print(f"list.pop(0) for {count} items:     {t_list * 1000:.2f} ms")
print(f"deque.popleft() for {count} items: {t_deque * 1000:.2f} ms")
print(f"collections.deque was ~{t_list / t_deque:.1f}x faster for FIFO queues!")`,
          code_language: 'python',
          code_explanation: 'deque maintains a doubly-linked list of blocks, allowing O(1) appends and pops from both ends without pointer shifting.',
          expected_output: `list.pop(0) for 20000 items:     <time_list> ms
deque.popleft() for 20000 items: <time_deque> ms
collections.deque was ~<factor>x faster for FIFO queues!`,
          quiz: {
            id: 'quiz-l4-data-struct-perf',
            title: 'Data Structure Benchmarks Check',
            questions: [
              {
                id: 'q-l4-dsp-1',
                question_text: 'Why is `collections.deque.popleft()` drastically faster than `list.pop(0)` for large sequences?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because deque is written in Assembly while list is written in Python.' },
                  { id: 'opt_2', text: 'Because list.pop(0) must shift all remaining N-1 pointers forward in contiguous memory, whereas deque unlinks a block pointer in O(1).' },
                  { id: 'opt_3', text: 'Because deque does not support numbers.' },
                  { id: 'opt_4', text: 'Because lists only hold 1,000 items.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A Python list is a contiguous array of pointers. Deleting index 0 shifts every subsequent pointer in memory, incurring an O(N) penalty.'
              }
            ]
          },
          key_takeaways: [
            'Use collections.deque for FIFO queues; never use list.pop(0).',
            'Use set or dict for fast membership lookups.',
            'Use the standard library bisect module to maintain and search sorted lists in O(log N) time.'
          ],
          revision_prompts: [
            'When is the standard array.array module preferred over a standard Python list?',
            'What is the memory overhead of a deque compared to a list?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-avoiding-repeated-computation',
          slug: 'avoiding-unnecessary-repeated-computation',
          title: 'Avoiding Unnecessary Repeated Computation: Loop Hoisting and Pre-Filtering',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 7,
          summary: 'Refactor inner-loop invariant computations, hoist regex compilations, and pre-filter datasets early.',
          learning_objectives: [
            'Identify loop-invariant operations and hoist them outside iteration bodies',
            'Pre-compile regular expressions (re.compile) outside loops',
            'Pre-filter and transform records early to minimize downstream workload'
          ],
          content_markdown: `### Loop Invariants

A **loop invariant** is an expression inside a loop whose value does not change across iterations:
- Re-compiling a regex inside a loop: \`re.match(pattern, s)\` recompiles or checks the internal regex cache on every single iteration!
- Looking up global attributes or calling \`len(items)\` inside hot loops repeatedly when the size is fixed.
- Re-parsing configuration files or date formats inside the row processing loop.

**Rule**: Pre-compile, pre-allocate, and hoist all invariant expressions outside the loop.`,
          code_snippet: `import re
import time

log_lines = ["2026-10-10 [INFO] auth: User login"] * 20_000
pattern = r"\\[(INFO|ERROR)\\]\\s+(\\w+):"

# Invariant hoister: Pre-compile regex once
compiled_re = re.compile(pattern)

t0 = time.perf_counter()
for line in log_lines:
    match = compiled_re.search(line)
t_hoisted = time.perf_counter() - t0

print(f"Pre-compiled regex scanned 20,000 lines in: {t_hoisted * 1000:.2f} ms")`,
          code_language: 'python',
          code_explanation: 'Pre-compiling the regex object avoids repeating regex parsing across 20,000 iterations.',
          expected_output: `Pre-compiled regex scanned 20,000 lines in: <time> ms`,
          quiz: {
            id: 'quiz-l4-loop-hoisting',
            title: 'Loop Hoisting Check',
            questions: [
              {
                id: 'q-l4-lh-1',
                question_text: 'What is "loop hoisting" in code optimization?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Moving the loop to the beginning of the file.' },
                  { id: 'opt_2', text: 'Extracting calculations that do not change between iterations outside of the loop body.' },
                  { id: 'opt_3', text: 'Replacing a while loop with a for loop.' },
                  { id: 'opt_4', text: 'Deleting the loop entirely.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Loop hoisting evaluates invariant expressions once before the loop begins rather than repeating the redundant calculation on every iteration.'
              }
            ]
          },
          key_takeaways: [
            'Hoist loop-invariant expressions, regex compilations, and attribute lookups out of loops.',
            'Pre-filter datasets early in pipelines to avoid processing records destined to be discarded.',
            'Local variable binding (e.g. append = my_list.append) can optimize micro-benchmarks in hot loops.'
          ],
          revision_prompts: [
            'How does re.compile() cache patterns internally and why should you still hoist it?',
            'What is the performance difference between global variable lookups and local variable lookups in hot loops?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-memoization-functools-lru-cache',
          slug: 'memoization-and-caching',
          title: 'Memoization and Caching: functools.lru_cache and cache',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 8,
          summary: 'Transform exponential recursive algorithms into linear time using functools.lru_cache, eviction policies, and cache statistics.',
          learning_objectives: [
            'Apply functools.lru_cache to eliminate redundant sub-problem calculations',
            'Configure maxsize to prevent unbounded cache memory growth',
            'Inspect cache performance using cache_info() (hits, misses, currsize)'
          ],
          content_markdown: `### The Power of Memoization

Pure functions (functions with no side effects whose return values depend solely on their arguments) can be **memoized**:
- If \`f(x)\` has already been computed, return the cached result in $O(1)$ time.
- Transforms the naive Fibonacci from $O(2^N)$ (exponential) into $O(N)$ (linear)!

### \`@functools.lru_cache(maxsize=128)\`
- **LRU (Least Recently Used)**: When the cache reaches \`maxsize\`, it automatically evicts the entry that hasn't been accessed for the longest time.
- **Python 3.9+**: \`@functools.cache\` is shorthand for an unbounded cache (\`maxsize=None\`).
- **Hazard**: Function arguments must be **hashable**! Passing mutable lists will trigger \`TypeError: unhashable type: 'list'\`.`,
          code_snippet: `from functools import lru_cache

# Memoized recursive Fibonacci
@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Compute fibonacci(50) instantaneously
result = fibonacci(50)
print(f"fibonacci(50) = {result}")

# Inspect cache efficiency
info = fibonacci.cache_info()
print(f"Cache Stats: Hits={info.hits}, Misses={info.misses}, Size={info.currsize}/{info.maxsize}")`,
          code_language: 'python',
          code_explanation: 'lru_cache transforms an exponential calculation into an instantaneous linear lookup and tracks hit/miss statistics.',
          expected_output: `fibonacci(50) = 12586269025
Cache Stats: Hits=48, Misses=51, Size=51/128`,
          quiz: {
            id: 'quiz-l4-lru-cache',
            title: 'LRU Cache Check',
            questions: [
              {
                id: 'q-l4-lc-1',
                question_text: 'What requirement must function arguments satisfy to be used with @functools.lru_cache?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They must be integers.' },
                  { id: 'opt_2', text: 'All positional and keyword arguments must be hashable.' },
                  { id: 'opt_3', text: 'They must inherit from dict.' },
                  { id: 'opt_4', text: 'They must be JSON serializable.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'lru_cache uses a dictionary internally where keys are tuples of the function arguments. If any argument is unhashable (like a list), Python raises TypeError.'
              }
            ]
          },
          key_takeaways: [
            '@functools.lru_cache caches function return values for hashable inputs.',
            'Always set a reasonable maxsize to prevent memory exhaustion.',
            'Use function.cache_info() to verify that cache hit rates justify the memory overhead.'
          ],
          revision_prompts: [
            'Why does memoizing a function that depends on external state (e.g. database rows) lead to stale data bugs?',
            'What is the difference between @functools.cache and @functools.lru_cache(maxsize=128)?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-cache-invalidation-mechanics',
          slug: 'understanding-cache-invalidation',
          title: 'Understanding Cache Invalidation: The Hardest Problem in Computer Science',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 9,
          summary: 'Examine TTL (Time-To-Live), write-through vs write-around caches, and clearing caches with cache_clear().',
          learning_objectives: [
            'Understand why cache invalidation causes stale data bugs',
            'Manually invalidate cached functions using func.cache_clear()',
            'Implement TTL (Time-to-Live) expiry strategies for dynamic data'
          ],
          content_markdown: `### The Two Hard Things

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

When you cache data, you create a copy of the state:
- If the underlying database updates, your cache now contains **stale, incorrect data**.
- Failing to invalidate the cache causes ghost data, incorrect billing, and security bypasses.

### Invalidation Strategies
1. **Manual Invalidation**: Call \`my_cached_func.cache_clear()\` whenever mutations occur.
2. **TTL (Time-To-Live)**: Cache entries automatically expire after $N$ seconds.
3. **Key Versioning**: Append a version tag or last-modified timestamp to the cache key.`,
          code_snippet: `from functools import lru_cache

# Mock database state
user_database = {101: "Alice (Active)"}

@lru_cache(maxsize=100)
def get_user_profile(user_id: int) -> str:
    print(f" -> [DB QUERY] Fetching user {user_id} from database...")
    return user_database.get(user_id, "Not Found")

print("Call 1:", get_user_profile(101))
print("Call 2 (Cached):", get_user_profile(101))

# Database mutation occurs
user_database[101] = "Alice (Suspended)"

# Without invalidation, stale data is returned!
print("Call 3 (Stale!):", get_user_profile(101))

# Explicit cache invalidation
get_user_profile.cache_clear()
print("[CACHE CLEARED]")
print("Call 4 (Fresh):", get_user_profile(101))`,
          code_language: 'python',
          code_explanation: 'Demonstrates stale cache data after mutation and how calling cache_clear() invalidates the cache.',
          expected_output: ` -> [DB QUERY] Fetching user 101 from database...
Call 1: Alice (Active)
Call 2 (Cached): Alice (Active)
Call 3 (Stale!): Alice (Active)
[CACHE CLEARED]
 -> [DB QUERY] Fetching user 101 from database...
Call 4 (Fresh): Alice (Suspended)`,
          quiz: {
            id: 'quiz-l4-invalidation',
            title: 'Cache Invalidation Check',
            questions: [
              {
                id: 'q-l4-ci-1',
                question_text: 'What bug occurs when an underlying database record updates but the memoized cache is not cleared?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'SyntaxError' },
                  { id: 'opt_2', text: 'Stale Data (cache serves outdated information that does not match reality).' },
                  { id: 'opt_3', text: 'IndexError' },
                  { id: 'opt_4', text: 'The computer hard drive formats.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'When cached copies fall out of sync with authoritative data stores, the application serves stale, outdated results.'
              }
            ]
          },
          key_takeaways: [
            'Caching trades memory and consistency for execution speed.',
            'Always design an explicit invalidation strategy (event-driven cache_clear() or TTL expiration).',
            'Never memoize functions that depend on mutable global or database state without invalidation.'
          ],
          revision_prompts: [
            'What is a cache stampede (thundering herd) and how do locks mitigate it?',
            'What is the difference between write-through and write-back caching?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-efficient-iteration-itertools',
          slug: 'efficient-iteration-and-lazy-processing',
          title: 'Efficient Iteration and Lazy Processing with itertools',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 10,
          summary: 'Harness the C-speed of the itertools module: islice, chain, batched, product, and groupby.',
          learning_objectives: [
            'Chain and slice sequences without creating intermediate in-memory lists (itertools.chain, islice)',
            'Batch large datasets cleanly using itertools.batched (Python 3.12+)',
            'Combine lazy itertools pipelines for memory-efficient data processing'
          ],
          content_markdown: `### Why \`itertools\` Runs at C-Speed

The standard library **\`itertools\`** module is written in pure C:
- Iterators produce items on demand without allocating intermediate lists on the heap.
- Loops execute directly in C code without interpreter bytecode dispatch overhead.

### Key Tools
- **\`itertools.islice(iterable, start, stop)\`**: Slices any iterator (including generators) lazily without memory copying.
- **\`itertools.chain(*iterables)\`**: Combines multiple sequences into one continuous iterator.
- **\`itertools.batched(iterable, n)\`**: (Python 3.12+) Yields chunks of size $n$ cleanly.`,
          code_snippet: `import itertools

def generate_stream():
    """Unbounded generator."""
    n = 0
    while True:
        yield n * 10
        n += 1

# Lazy slicing of unbounded stream without memory allocation
stream = generate_stream()
first_five = list(itertools.islice(stream, 5))
print("islice(generate_stream(), 5):", first_five)

# Chaining multiple collections with zero copy overhead
combined = list(itertools.chain([1, 2], [10, 20], [100, 200]))
print("itertools.chain results:     ", combined)`,
          code_language: 'python',
          code_explanation: 'itertools operates lazily in pure C, avoiding memory allocation while maintaining high throughput.',
          expected_output: `islice(generate_stream(), 5): [0, 10, 20, 30, 40]
itertools.chain results:      [1, 2, 10, 20, 100, 200]`,
          quiz: {
            id: 'quiz-l4-itertools',
            title: 'itertools Check',
            questions: [
              {
                id: 'q-l4-it-1',
                question_text: 'Why does `list(itertools.islice(gen, 10))` consume significantly less memory than `list(gen)[:10]` on a 10-million item generator?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because islice compresses numbers.' },
                  { id: 'opt_2', text: 'Because list(gen) expands all 10 million items in memory before slicing, while islice stops consuming after exactly 10 items.' },
                  { id: 'opt_3', text: 'Because islice runs in a separate thread.' },
                  { id: 'opt_4', text: 'There is no difference in memory.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Calling list(gen) consumes and buffers the entire generator into memory before applying [:10]. islice consumes only the requested 10 items lazily.'
              }
            ]
          },
          key_takeaways: [
            'itertools functions execute in pure C, providing faster loops and zero intermediate allocations.',
            'Use islice to slice generators and streaming pipelines safely.',
            'Use chain to concatenate collections without creating temporary merged lists.'
          ],
          revision_prompts: [
            'How does itertools.groupby differ from SQL GROUP BY?',
            'What is the difference between itertools.product and nested for loops?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-benchmarking-timeit-statistical',
          slug: 'benchmarking-without-misleading-conclusions',
          title: 'Benchmarking Without Misleading Conclusions: The timeit Module and Statistical Rigor',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 11,
          summary: 'Benchmark reliably using timeit, multiple repetition trials, minimum vs average timings, and garbage collection isolation.',
          learning_objectives: [
            'Avoid micro-benchmark traps (JIT warming, GC interference, system noise)',
            'Use the standard timeit module with multiple repeats to isolate fastest runs',
            'Report statistical variance (min, mean, standard deviation) rather than a single measurement'
          ],
          content_markdown: `### The Micro-Benchmarking Traps

Why single-run benchmarks lie:
1. **Garbage Collection Spikes**: A GC cycle triggering during Run B makes Run B look 10x slower than Run A.
2. **OS Scheduling & CPU Frequency Scaling**: The OS may throttle the CPU or switch cores mid-test.
3. **Warm-up Effects**: Memory paging and branch predictors warm up after the first iteration.

### The \`timeit\` Solution
- Disables garbage collection during measurement loops to isolate pure code execution.
- Runs millions of iterations to amortize timer resolution limits.
- **Rule**: Report the **minimum** or **median** of multiple repeat batches, because external noise (OS interrupts) only ever makes code run slower, never faster!`,
          code_snippet: `import timeit

# Compare list comprehension vs map
code_comp = "[x * 2 for x in range(100)]"
code_map  = "list(map(lambda x: x * 2, range(100)))"

# Repeat 3 trials of 10,000 iterations each
trials_comp = timeit.repeat(code_comp, number=10_000, repeat=3)
trials_map  = timeit.repeat(code_map,  number=10_000, repeat=3)

# Best trial represents lowest OS interference
best_comp = min(trials_comp)
best_map  = min(trials_map)

print(f"List comprehension (best of 3 trials): {best_comp:.4f}s")
print(f"map with lambda    (best of 3 trials): {best_map:.4f}s")
print(f"Comprehension was ~{best_map / best_comp:.2f}x faster due to avoided lambda call overhead.")`,
          code_language: 'python',
          code_explanation: 'timeit.repeat executes multiple independent batches, isolating true execution performance from background OS noise.',
          expected_output: `List comprehension (best of 3 trials): <time>s
map with lambda    (best of 3 trials): <time>s
Comprehension was ~<factor>x faster due to avoided lambda call overhead.`,
          quiz: {
            id: 'quiz-l4-timeit',
            title: 'timeit Benchmarking Check',
            questions: [
              {
                id: 'q-l4-ti-1',
                question_text: 'Why do benchmarking guidelines recommend looking at the `min()` of several `timeit.repeat()` runs rather than the average?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because average is mathematically harder to calculate.' },
                  { id: 'opt_2', text: 'Because background OS processes and context switches only ever add artificial delays; the minimum trial represents the cleanest run.' },
                  { id: 'opt_3', text: 'Because timeit ignores the first trial.' },
                  { id: 'opt_4', text: 'Because min() runs faster.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'External system interrupts (disk I/O, other processes) can only increase execution time. The minimum duration represents execution with the least external interference.'
              }
            ]
          },
          key_takeaways: [
            'Use timeit for micro-benchmarks; it disables GC and runs repeated loops to eliminate noise.',
            'Report the minimum or median of several repeat batches rather than a single run.',
            'Micro-benchmarks do not replace macro-level system profiling under real loads.'
          ],
          revision_prompts: [
            'Why does map(str, items) run faster than [str(x) for x in items] when using built-in C functions?',
            'What is the difference between micro-benchmarking and load testing?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-premature-optimization-tradeoffs',
          slug: 'when-optimization-is-not-worth-the-complexity',
          title: 'When Optimization Is Not Worth the Complexity: Readability vs Speed Tradeoffs',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 12,
          summary: 'Balance performance with maintainability, code clarity, cognitive load, and engineering economics.',
          learning_objectives: [
            'Evaluate when micro-optimizations create unmaintainable, brittle code',
            'Identify anti-patterns: Bit-manipulation hacks, unreadable one-liners, premature caching',
            'Calculate the true business cost of maintenance complexity vs hardware scaling'
          ],
          content_markdown: `### The Maintenance Debt of Clever Code

Every optimization carries an architectural cost:
- **Higher Cognitive Load**: Complex bitwise tricks or manual pointer arrays are harder for teammates to read, debug, and safely modify.
- **Bug Surface Area**: Hand-rolled caches introduce race conditions, stale data bugs, and memory leaks.
- **Fragility**: Code tailored to internal CPython implementation details may break on new Python releases or alternative runtimes (PyPy).

### The Pragmatic Rule of Thumb
1. **Optimize Algorithmic Complexity First**: Upgrading $O(N^2) \\to O(N)$ is always justified and clean.
2. **Optimize Database Queries & I/O Next**: Adding an index or using connection pools yields massive gains with zero code contortion.
3. **Reject Micro-Optimization Hacks**: If saving 5 microseconds requires 40 lines of cryptic code, **reject it**. Developer hours cost more than CPU cycles.`,
          code_snippet: `def readability_tradeoff_comparison():
    # Approach A: Idiomatic, clear, maintainable
    def readable_even_squares(numbers):
        return [x * x for x in numbers if x % 2 == 0]

    # Approach B: Cryptic micro-optimization attempting to save bitwise cycles
    def cryptic_even_squares(numbers):
        # Using bitwise AND instead of modulo
        return list(map(lambda x: x * x, filter(lambda x: not (x & 1), numbers)))

    sample = list(range(10))
    assert readable_even_squares(sample) == cryptic_even_squares(sample)
    print("Both functions return identical results.")
    print("Approach A is readable in 2 seconds; Approach B requires cognitive decoding.")

readability_tradeoff_comparison()`,
          code_language: 'python',
          code_explanation: 'Idiomatic Python comprehensions are easier to maintain than convoluted functional expressions with negligible performance differences.',
          expected_output: `Both functions return identical results.
Approach A is readable in 2 seconds; Approach B requires cognitive decoding.`,
          quiz: {
            id: 'quiz-l4-tradeoffs',
            title: 'Optimization Tradeoffs Check',
            questions: [
              {
                id: 'q-l4-to-1',
                question_text: 'When should a micro-optimization that makes code significantly harder to understand be REJECTED?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'When it is not on the measured critical path and yields negligible real-world user benefit.' },
                  { id: 'opt_2', text: 'Always, performance never matters.' },
                  { id: 'opt_3', text: 'Only if it uses more than 5 variables.' },
                  { id: 'opt_4', text: 'Only in open-source projects.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'If code is not a critical bottleneck, increasing complexity increases bug risk and developer maintenance costs with no tangible user benefit.'
              }
            ]
          },
          key_takeaways: [
            'Clarity and correctness take precedence over unmeasured micro-optimizations.',
            'Prioritize algorithmic gains (O(N^2) to O(N)) and I/O caching over micro-hacks.',
            'Code is read far more often than it is written; maintainability is a first-class feature.'
          ],
          revision_prompts: [
            'What is the difference between optimizing for latency vs optimizing for throughput?',
            'How can profiling benchmarks in CI/CD prevent performance regressions automatically?'
          ]
        }
      ]
    }
  ]
};
