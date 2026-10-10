/**
 * Revoraa Level 3: Intermediate Python - Module 2: Iterators and Generators
 * 
 * 8 comprehensive lessons covering the iterator protocol, custom iterators,
 * generator functions, yield from, lazy pipelines, and memory optimization.
 */

export const MODULE_2_ITERATORS_AND_GENERATORS = {
  id: 'mod-py-iter-generators',
  slug: 'iterators-and-generators',
  level_number: 3,
  title: 'Iterators and Generators',
  description: 'Understand iteration mechanics, write custom iterators, leverage generator functions with yield, and build memory-efficient streaming pipelines.',
  estimated_hours: 6,
  sort_order: 2,
  is_published: true,
  topics: [
    {
      id: 'top-iteration-mechanics',
      slug: 'iteration-and-streams',
      title: 'Iteration Protocols & Lazy Evaluation',
      summary: 'Explore iterables, iterators, generator functions, and stream processing.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-iterable-vs-iterator',
          slug: 'iterable-vs-iterator',
          title: 'Iterable versus Iterator',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Distinguish between iterables (containers you can loop over) and iterators (stateful pointers producing items).',
          learning_objectives: [
            'Differentiate between an iterable and an iterator',
            'Inspect magic methods __iter__() and __next__() using hasattr() and dir()',
            'Obtain an iterator from any collection using iter()'
          ],
          content_markdown: `### The Fundamental Distinction

In Python, the words *iterable* and *iterator* are not interchangeable:

1. **Iterable**: An object capable of returning its members one at a time. It implements **\`__iter__()\`** (or \`__getitem__()\`). Examples: \`list\`, \`tuple\`, \`str\`, \`dict\`, \`set\`. You can loop over an iterable many times.
2. **Iterator**: A stateful object representing a stream of data. It implements **\`__iter__()\` AND \`__next__()\`**. Calling \`next()\` advances the pointer. Once exhausted, it cannot be reset without re-creating it.

\`\`\`
Iterable (Container) ──[ iter() ]──► Iterator (Stream) ──[ next() ]──► Values
\`\`\`

A list is an iterable, NOT an iterator:
\`\`\`python
numbers = [1, 2, 3]
next(numbers)  # Raises TypeError: 'list' object is not an iterator

it = iter(numbers)  # Obtains a list_iterator
next(it)  # Returns 1
\`\`\``,
          code_snippet: `# Inspecting Iterable vs Iterator
numbers = [10, 20, 30]

print("Is list an iterable?", hasattr(numbers, "__iter__"))
print("Is list an iterator?", hasattr(numbers, "__next__"))

# Create iterator instance
num_iterator = iter(numbers)
print("Is list_iterator an iterator?", hasattr(num_iterator, "__next__"))

# Fetch items step by step
print("Step 1:", next(num_iterator))
print("Step 2:", next(num_iterator))
print("Step 3:", next(num_iterator))`,
          code_language: 'python',
          code_explanation: 'Demonstrates using hasattr() to prove that a list is an iterable implementing __iter__(), while iter(list) produces an iterator object implementing __next__().',
          expected_output: `Is list an iterable? True
Is list an iterator? False
Is list_iterator an iterator? True
Step 1: 10
Step 2: 20
Step 3: 30`,
          quiz: {
            id: 'quiz-iterable-iterator',
            title: 'Knowledge Check: Iterable vs Iterator',
            questions: [
              {
                id: 'q-ii-1',
                question_text: 'What method must an object implement to be classified as an iterator in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Only __len__()' },
                  { id: 'opt_2', text: 'Both __iter__() and __next__()' },
                  { id: 'opt_3', text: 'Only __getitem__()' },
                  { id: 'opt_4', text: '__yield__()' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The Python iterator protocol requires both __iter__() (returning self) and __next__() (returning the next value or raising StopIteration).'
              }
            ]
          },
          key_takeaways: [
            'An iterable produces an iterator when passed to iter().',
            'An iterator produces values one at a time via next().',
            'Iterators maintain state and are consumed progressively.'
          ],
          revision_prompts: [
            'Why does an iterator also implement __iter__() returning self?',
            'What exception is raised when next() is called on an exhausted iterator?'
          ]
        },

        // Lesson 2
        {
          id: 'les-iterator-protocol',
          slug: 'iterator-protocol',
          title: 'The Iterator Protocol: iter() and next()',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Examine how Python for loops work under the hood and handle iteration exhaustion with sentinels.',
          learning_objectives: [
            'Deconstruct the bytecode mechanics of Python for loops',
            'Catch and handle StopIteration exceptions explicitly',
            'Use next(iterator, default) to provide fallback sentinel values'
          ],
          content_markdown: `### How \`for\` Loops Actually Work

When you write a loop:

\`\`\`python
for item in collection:
    process(item)
\`\`\`

Python executes this exact sequence:
1. Calls \`iterator = iter(collection)\`.
2. Repeatedly executes \`next(iterator)\`.
3. Passes the returned item to the loop body.
4. When \`StopIteration\` is raised, Python silently catches it and exits the loop.

### Safe Stepping with Sentinel Defaults

Calling \`next()\` past the end of an iterator raises \`StopIteration\`. If you want to retrieve values defensively without a \`try/except\` block:

\`\`\`python
# Passing a default argument returns the default instead of raising StopIteration
val = next(my_iterator, "DEFAULT_VALUE")
\`\`\``,
          code_snippet: `# Handcrafted while-loop simulating Python's for loop exactly
fruits = ["apple", "banana", "cherry"]

# 1. Manual for loop simulation
it = iter(fruits)
while True:
    try:
        fruit = next(it)
        print(f"Looping: {fruit}")
    except StopIteration:
        print("Reached end of iteration cleanly.")
        break

# 2. Sentinel default with next()
empty_iter = iter([])
result = next(empty_iter, "FALLBACK_SENTINEL")
print(f"Safe next result: {result}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates replicating Python for-loop mechanics using a while loop with try/except StopIteration, and shows next(it, default) for safe retrieval.',
          expected_output: `Looping: apple
Looping: banana
Looping: cherry
Reached end of iteration cleanly.
Safe next result: FALLBACK_SENTINEL`,
          quiz: {
            id: 'quiz-iterator-protocol',
            title: 'Knowledge Check: Iterator Protocol',
            questions: [
              {
                id: 'q-ip-1',
                question_text: 'What happens if you call next(it, "finished") on an empty iterator?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It raises StopIteration.' },
                  { id: 'opt_2', text: 'It returns "finished" without raising an exception.' },
                  { id: 'opt_3', text: 'It returns None.' },
                  { id: 'opt_4', text: 'It raises a TypeError.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'When a second default argument is supplied to next(), that sentinel value is returned instead of raising StopIteration.'
              }
            ]
          },
          key_takeaways: [
            'Python for-loops are syntactic sugar around iter(), next(), and StopIteration.',
            'next(iterator, default) allows graceful exhaustion handling.',
            'Iterators can only be read forward, not backward.'
          ],
          revision_prompts: [
            'Can you rewind a standard Python iterator?',
            'What happens if an object implements __getitem__ but not __iter__?'
          ]
        },

        // Lesson 3
        {
          id: 'les-custom-iterators',
          slug: 'custom-iterators',
          title: 'Creating Custom Iterators',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Build custom iterator classes implementing __iter__() and __next__() to encapsulate stateful sequences.',
          learning_objectives: [
            'Implement __iter__() returning self and __next__() advancing state',
            'Raise StopIteration when termination conditions are met',
            'Build stateful sequence generators such as Countdown and StepRange'
          ],
          content_markdown: `### The Iterator Contract

To turn a custom class into an iterator:
1. **\`__iter__(self)\`**: Must return \`self\`. This enables custom iterators to be looped over directly in \`for\` loops.
2. **\`__next__(self)\`**: Must compute the next value, update internal state variables, and return the value. When no items remain, it **must raise \`StopIteration\`**.

\`\`\`python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        val = self.current
        self.current -= 1
        return val
\`\`\``,
          code_snippet: `class StepRange:
    """Custom iterator generating numbers with step increments."""
    def __init__(self, start, stop, step=1):
        self.current = start
        self.stop = stop
        self.step = step

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        result = self.current
        self.current += self.step
        return result

# Using custom iterator in a for-loop
print("Custom StepRange(0, 15, 3):")
for num in StepRange(0, 15, 3):
    print(f"  -> {num}")`,
          code_language: 'python',
          code_explanation: 'Defines a custom StepRange iterator class implementing __iter__() and __next__(), raising StopIteration when the limit is exceeded.',
          expected_output: `Custom StepRange(0, 15, 3):
  -> 0
  -> 3
  -> 6
  -> 9
  -> 12`,
          quiz: {
            id: 'quiz-custom-iterators',
            title: 'Knowledge Check: Custom Iterators',
            questions: [
              {
                id: 'q-ci-1',
                question_text: 'Why should a custom iterator\'s __iter__() method return self?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To allow the iterator to be passed directly to for-loops and iter().' },
                  { id: 'opt_2', text: 'To reset the iterator counter back to zero.' },
                  { id: 'opt_3', text: 'To prevent memory leaks in CPython.' },
                  { id: 'opt_4', text: 'It is optional and can return None.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Returning self satisfies Python\'s iterator protocol contract, ensuring the iterator itself is also recognized as an iterable.'
              }
            ]
          },
          key_takeaways: [
            'Custom iterators encapsulate traversal logic and state.',
            'Always raise StopIteration when the sequence finishes.',
            'Implement __iter__ returning self for loop compatibility.'
          ],
          revision_prompts: [
            'How can you separate the Iterable class from the Iterator class so an object can be looped over multiple times?',
            'What internal state does an iterator maintain during iteration?'
          ]
        },

        // Lesson 4
        {
          id: 'les-generator-functions-yield',
          slug: 'generator-functions-and-yield',
          title: 'Generator Functions and the yield Statement',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Write elegant, memory-efficient generators using the yield statement to suspend and resume function execution.',
          learning_objectives: [
            'Understand how yield pauses execution frame state',
            'Differentiate normal function returns from generator function objects',
            'Write infinite sequences like Fibonacci without crashing memory'
          ],
          content_markdown: `### The Power of \`yield\`

Writing a custom class with \`__iter__\` and \`__next__\` requires boilerplate. Python provides **generator functions** to achieve the exact same behavior with clean function syntax:

1. When a function contains the **\`yield\`** keyword, invoking it does NOT run the function immediately. Instead, it returns a **generator object**.
2. When \`next()\` is called on the generator, execution begins and runs until hitting \`yield <value>\`.
3. The function **freezes execution frame state** (local variables, instruction pointer) and returns the yielded value.
4. The next call to \`next()\` resumes immediately after the \`yield\` statement!
5. When the function returns, Python automatically raises \`StopIteration\`.`,
          code_snippet: `# Generator function yielding Fibonacci numbers
def fibonacci(limit):
    a, b = 0, 1
    count = 0
    while count < limit:
        yield a
        a, b = b, a + b
        count += 1

# Generate first 7 Fibonacci numbers
fib_gen = fibonacci(7)
print("Generator object:", fib_gen)
print("Fibonacci sequence:", list(fib_gen))`,
          code_language: 'python',
          code_explanation: 'Demonstrates a generator function using yield to produce Fibonacci numbers lazily without allocating an internal list.',
          expected_output: `Generator object: <generator object fibonacci at 0x...>
Fibonacci sequence: [0, 1, 1, 2, 3, 5, 8]`,
          quiz: {
            id: 'quiz-generator-yield',
            title: 'Knowledge Check: Generator Functions',
            questions: [
              {
                id: 'q-gy-1',
                question_text: 'What happens when you call a Python function that contains a yield statement?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The entire function runs immediately and returns a list.' },
                  { id: 'opt_2', text: 'It returns a generator object without executing the function body yet.' },
                  { id: 'opt_3', text: 'It raises a SyntaxError.' },
                  { id: 'opt_4', text: 'It launches a background thread.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Functions containing yield return a generator object immediately; code execution pauses until the first next() call.'
              }
            ]
          },
          key_takeaways: [
            'yield pauses execution and preserves local variables.',
            'Generator functions are concise, readable alternatives to custom iterator classes.',
            'Generators compute values on demand (lazy evaluation).'
          ],
          revision_prompts: [
            'What happens if a generator function executes a return statement with a value?',
            'How does yield differ from return?'
          ]
        },

        // Lesson 5
        {
          id: 'les-generator-expressions',
          slug: 'generator-expressions',
          title: 'Generator Expressions: High-Performance In-Line Streams',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Use generator expressions with parentheses to compute streaming pipelines with minimal memory overhead.',
          learning_objectives: [
            'Write generator expressions using (expr for x in iterable if cond) syntax',
            'Compare memory footprints between list comprehensions and generator expressions',
            'Feed generator expressions into consumer functions like sum(), min(), max()'
          ],
          content_markdown: `### List Comprehensions vs Generator Expressions

A list comprehension uses square brackets \`[...]\` and constructs the **entire list in RAM immediately**:

\`\`\`python
# Allocates 10 million integers in memory! (~80 Megabytes)
squares_list = [x ** 2 for x in range(10_000_000)]
\`\`\`

A **generator expression** uses parentheses \`(...)\` and produces values **one by one on demand**:

\`\`\`python
# Allocates only ~100 bytes of generator state!
squares_gen = (x ** 2 for x in range(10_000_000))
\`\`\`

### Idiomatic Reduction
When passing a generator expression as the single argument to a function, the outer parentheses can be omitted:

\`\`\`python
total = sum(x ** 2 for x in range(100))  # Clean and Pythonic!
\`\`\``,
          code_snippet: `import sys

# Memory consumption comparison
list_comp = [x * 2 for x in range(100_000)]
gen_expr  = (x * 2 for x in range(100_000))

print(f"List comprehension size: {sys.getsizeof(list_comp):,} bytes")
print(f"Generator expression size: {sys.getsizeof(gen_expr):,} bytes")

# Consuming on demand
print("Sum of first 100 squares:", sum(x**2 for x in range(100)))`,
          code_language: 'python',
          code_explanation: 'Compares the memory size of a 100,000-item list comprehension vs an identical generator expression using sys.getsizeof().',
          expected_output: `List comprehension size: 800,984 bytes
Generator expression size: 104 bytes
Sum of first 100 squares: 328350`,
          quiz: {
            id: 'quiz-gen-expressions',
            title: 'Knowledge Check: Generator Expressions',
            questions: [
              {
                id: 'q-ge-1',
                question_text: 'What is the syntax for a generator expression in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '[x for x in seq]' },
                  { id: 'opt_2', text: '{x for x in seq}' },
                  { id: 'opt_3', text: '(x for x in seq)' },
                  { id: 'opt_4', text: '<x for x in seq>' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'Parentheses (x for x in seq) create a generator expression, while square brackets create a list comprehension.'
              }
            ]
          },
          key_takeaways: [
            'Generator expressions use parentheses and compute values lazily.',
            'They consume negligible memory regardless of collection size.',
            'They pair naturally with reduction functions like sum, min, max, and any.'
          ],
          revision_prompts: [
            'When would you prefer a list comprehension over a generator expression?',
            'Can you index into a generator expression with gen[0]?'
          ]
        },

        // Lesson 6
        {
          id: 'les-lazy-evaluation-memory',
          slug: 'lazy-evaluation-memory-efficiency',
          title: 'Lazy Evaluation and Memory Efficiency',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Architect stream processing pipelines capable of handling gigabytes of records without exhausting machine memory.',
          learning_objectives: [
            'Architect lazy streaming pipelines connecting multiple generator stages',
            'Process unbounded or infinite streams safely',
            'Avoid loading entire files or database queries into memory simultaneously'
          ],
          content_markdown: `### The Unix Pipe Philosophy in Python

Generators allow you to link operations together like Unix pipes (\`cat log | grep ERROR | awk ...\`):

\`\`\`
Raw Source ──► [ Generator 1: Parse ] ──► [ Generator 2: Filter ] ──► [ Output Consumer ]
\`\`\`

Each item flows through the entire pipeline individually:
- Item 1 is generated ──► parsed ──► filtered ──► consumed.
- Then Item 2 begins.
- At no point is a giant list of all items created in memory! This allows Python to process a 50GB dataset on a machine with only 4GB of RAM.`,
          code_snippet: `# Simulating a multi-stage lazy pipeline
raw_logs = [
    "2026-10-10 10:00:01 INFO Server started",
    "2026-10-10 10:00:02 ERROR DB connection timeout",
    "2026-10-10 10:00:03 WARNING Memory high",
    "2026-10-10 10:00:04 ERROR Out of disk space",
    "2026-10-10 10:00:05 INFO Heartbeat OK"
]

# Stage 1: Line parser generator
def parse_logs(lines):
    for line in lines:
        parts = line.split(" ", 3)
        yield {"timestamp": f"{parts[0]} {parts[1]}", "level": parts[2], "message": parts[3]}

# Stage 2: Filter generator
def filter_errors(records):
    for r in records:
        if r["level"] == "ERROR":
            yield r

# Stage 3: Consumer
parsed_stream = parse_logs(raw_logs)
error_stream = filter_errors(parsed_stream)

print("Errors captured in pipeline:")
for err in error_stream:
    print(f"  [{err['timestamp']}] {err['message']}")`,
          code_language: 'python',
          code_explanation: 'Shows two generator functions piped together, processing log records lazily on demand without intermediate array allocations.',
          expected_output: `Errors captured in pipeline:
  [2026-10-10 10:00:02] DB connection timeout
  [2026-10-10 10:00:04] Out of disk space`,
          quiz: {
            id: 'quiz-lazy-pipelines',
            title: 'Knowledge Check: Lazy Pipelines',
            questions: [
              {
                id: 'q-lp-1',
                question_text: 'Why does a generator pipeline consume constant memory even when processing millions of items?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It compresses items using gzip.' },
                  { id: 'opt_2', text: 'Only one item passes through the pipeline at any given moment.' },
                  { id: 'opt_3', text: 'Python stores generator items on the hard drive.' },
                  { id: 'opt_4', text: 'Generators execute in C rather than Python.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Generators process one item at a time on demand. When an item finishes, its memory can be reclaimed before the next item is generated.'
              }
            ]
          },
          key_takeaways: [
            'Chaining generators creates streaming pipelines.',
            'Memory usage remains constant regardless of the total dataset size.',
            'Generators make it possible to process datasets larger than physical RAM.'
          ],
          revision_prompts: [
            'How can you introduce a batching stage into a generator pipeline?',
            'What happens if an exception is raised in the middle of a generator pipeline?'
          ]
        },

        // Lesson 7
        {
          id: 'les-yield-from-delegation',
          slug: 'yield-from-delegation',
          title: 'Subgenerator Delegation with yield from',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Simplify generator chaining and flatten hierarchical structures using the yield from delegation syntax.',
          learning_objectives: [
            'Use yield from to delegate iteration directly to subgenerators',
            'Flatten nested tree and list structures cleanly without manual loops',
            'Understand how yield from establishes a transparent communication channel'
          ],
          content_markdown: `### The Evolution of \`yield from\`

Before Python 3.3, chaining generators or yielding from nested iterables required manual loops:

\`\`\`python
# Old, verbose pattern
for sub_item in subgenerator():
    yield sub_item
\`\`\`

Python 3.3 introduced **\`yield from\`**:

\`\`\`python
# Clean, idiomatic delegation
yield from subgenerator()
\`\`\`

### Recursive Flattening
\`yield from\` makes recursive tree traversal remarkably clean. If an item is an iterable, delegate to the recursive generator; otherwise, yield the scalar value directly.`,
          code_snippet: `# Flattening nested lists recursively using yield from
def flatten(nested_data):
    for item in nested_data:
        if isinstance(item, (list, tuple)):
            yield from flatten(item)
        else:
            yield item

nested = [1, [2, [3, 4], 5], [6, 7], 8]
flattened_result = list(flatten(nested))
print("Original nested structure:", nested)
print("Flattened sequence:       ", flattened_result)`,
          code_language: 'python',
          code_explanation: 'Uses recursive yield from delegation to flatten arbitrary nested list and tuple structures into a single stream.',
          expected_output: `Original nested structure: [1, [2, [3, 4], 5], [6, 7], 8]
Flattened sequence:        [1, 2, 3, 4, 5, 6, 7, 8]`,
          quiz: {
            id: 'quiz-yield-from',
            title: 'Knowledge Check: yield from',
            questions: [
              {
                id: 'q-yf-1',
                question_text: 'What does "yield from sub_iterable" do in a generator function?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It creates a new thread for sub_iterable.' },
                  { id: 'opt_2', text: 'It yields every item from sub_iterable sequentially, delegating iteration.' },
                  { id: 'opt_3', text: 'It returns sub_iterable as a single list object.' },
                  { id: 'opt_4', text: 'It terminates the generator immediately.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'yield from iterates through the sub_iterable, transparently yielding each item to the caller.'
              }
            ]
          },
          key_takeaways: [
            'yield from replaces manual for-loops when delegating iteration.',
            'It enables clean recursive traversals of tree-like data structures.',
            'It establishes a direct channel between the outer caller and the subgenerator.'
          ],
          revision_prompts: [
            'How can a subgenerator return a value to the delegating generator using yield from?',
            'What happens if an exception is thrown into a generator delegating via yield from?'
          ]
        },

        // Lesson 8
        {
          id: 'les-iterator-exhaustion-pitfalls',
          slug: 'iterator-exhaustion-and-pitfalls',
          title: 'Iterator Exhaustion and Common Traps',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Diagnose and avoid one-time consumption bugs, len() errors, and clone iterators safely using itertools.tee().',
          learning_objectives: [
            'Identify the iterator exhaustion trap where a second iteration produces nothing',
            'Understand why len() and index lookups raise TypeError on generators',
            'Split independent streams using itertools.tee() safely'
          ],
          content_markdown: `### The One-Time Consumption Trap

The most common bug in intermediate Python:

\`\`\`python
gen = (x * 2 for x in [1, 2, 3])

# First pass: consumes all items
print("First loop:", list(gen))  # [2, 4, 6]

# Second pass: already exhausted!
print("Second loop:", list(gen)) # [] (EMPTY!)
\`\`\`

Because generators do not store items in memory, **they cannot be restarted**.

### Common Mistakes
1. **Calling \`len(gen)\`**: Raises \`TypeError: object of type 'generator' has no len()\`. Generators do not know their length in advance.
2. **Checking boolean \`if gen:\`**: A generator always evaluates to \`True\`, even if it is completely exhausted!
3. **Duplicating Streams**: If you need two independent consumers, use **\`itertools.tee(gen, 2)\`**.`,
          code_snippet: `from itertools import tee

# 1. The exhaustion bug
numbers_gen = (x for x in [10, 20, 30])
first_sum = sum(numbers_gen)
second_sum = sum(numbers_gen) # Bug: Already exhausted!

print(f"First sum:  {first_sum}")
print(f"Second sum: {second_sum} (Exhausted!)")

# 2. Correct duplication using itertools.tee
raw_stream = (x for x in [10, 20, 30])
stream_a, stream_b = tee(raw_stream, 2)

print(f"Stream A sum: {sum(stream_a)}")
print(f"Stream B max: {max(stream_b)}")`,
          code_language: 'python',
          code_explanation: 'Shows how an exhausted generator produces 0 on a second pass, and how itertools.tee() creates two independent iterator copies.',
          expected_output: `First sum:  60
Second sum: 0 (Exhausted!)
Stream A sum: 60
Stream B max: 30`,
          quiz: {
            id: 'quiz-exhaustion-pitfalls',
            title: 'Knowledge Check: Iterator Pitfalls',
            questions: [
              {
                id: 'q-iep-1',
                question_text: 'What is the boolean evaluation of an exhausted generator object (bool(gen))?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'False' },
                  { id: 'opt_2', text: 'True' },
                  { id: 'opt_3', text: 'It raises a StopIteration exception.' },
                  { id: 'opt_4', text: 'None' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A generator object is an instance that does not implement __len__ or __bool__, so it always evaluates to True in boolean contexts.'
              }
            ]
          },
          key_takeaways: [
            'Iterators can only be consumed once.',
            'Never rely on if gen: to check whether items remain.',
            'Use itertools.tee() when multiple independent iterations are required.'
          ],
          revision_prompts: [
            'What is the memory cost of using itertools.tee() if one stream is consumed far ahead of the other?',
            'How can you verify that a function receives an iterable rather than an iterator?'
          ]
        }
      ]
    }
  ]
};
