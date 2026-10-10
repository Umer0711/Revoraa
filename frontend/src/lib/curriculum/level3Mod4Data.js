/**
 * Revoraa Level 3: Intermediate Python - Module 4: Comprehensions and Functional Programming
 * 
 * 9 comprehensive lessons covering list/dict/set comprehensions, nested comprehensions,
 * lambdas, map/filter/reduce, pure functions, and Pythonic readability.
 */

export const MODULE_4_COMPREHENSIONS_FUNCTIONAL = {
  id: 'mod-py-comp-functional',
  slug: 'comprehensions-functional-programming',
  level_number: 3,
  title: 'Comprehensions and Functional Programming',
  description: 'Write expressive, Pythonic transformations with list, dict, and set comprehensions, lambdas, functional iterators, and pure functions.',
  estimated_hours: 6,
  sort_order: 4,
  is_published: true,
  topics: [
    {
      id: 'top-functional-patterns',
      slug: 'comprehensions-and-functional-design',
      title: 'Comprehensions & Functional Paradigms',
      summary: 'Master list, dict, and set comprehensions, functional primitives, and pure transformations.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-comprehensions-list-dict-set',
          slug: 'comprehensions-list-dict-set',
          title: 'List, Dictionary, and Set Comprehensions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Write declarative transformations across lists, dictionaries, and sets using concise comprehension syntax.',
          learning_objectives: [
            'Construct list, dictionary, and set comprehensions with filter predicates',
            'Invert key-value mappings using dictionary comprehensions',
            'Eliminate repetitive accumulator loops'
          ],
          content_markdown: `### The Power of Comprehensions

Comprehensions provide a concise syntax for creating new collections from existing iterables:

1. **List Comprehension**: \`[expression for item in iterable if condition]\`
2. **Set Comprehension**: \`{expression for item in iterable if condition}\`
3. **Dictionary Comprehension**: \`{key_expr: val_expr for item in iterable if condition}\`

### Why Use Comprehensions?
- **Speed**: In CPython, comprehensions run at native C speed using optimized bytecode instructions (\`LIST_APPEND\`, \`MAP_ADD\`, \`SET_ADD\`) rather than looking up the \`.append()\` method in Python each iteration.
- **Declarative Style**: Focuses on *what* data to produce rather than *how* to loop and initialize arrays.`,
          code_snippet: `# 1. List comprehension with filter predicate
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_squares = [n ** 2 for n in numbers if n % 2 == 0]
print("Even squares:", even_squares)

# 2. Set comprehension (automatic deduplication)
words = ["Apple", "banana", "APPLE", "Cherry", "BANANA"]
unique_lower = {w.lower() for w in words}
print("Unique lowercased set:", sorted(unique_lower))

# 3. Dict comprehension: Invert a mapping
roles = {"alice": "admin", "bob": "editor", "charlie": "viewer"}
users_by_role = {role: user for user, role in roles.items()}
print("Users indexed by role:", users_by_role)`,
          code_language: 'python',
          code_explanation: 'Demonstrates list, set, and dictionary comprehensions with filtering and key-value mapping inversion.',
          expected_output: `Even squares: [4, 16, 36, 64, 100]
Unique lowercased set: ['apple', 'banana', 'cherry']
Users indexed by role: {'admin': 'alice', 'editor': 'bob', 'viewer': 'charlie'}`,
          quiz: {
            id: 'quiz-comprehensions-basics',
            title: 'Knowledge Check: Comprehensions',
            questions: [
              {
                id: 'q-cb-1',
                question_text: 'What is the syntax for creating a set comprehension in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '[x for x in seq]' },
                  { id: 'opt_2', text: '{x for x in seq}' },
                  { id: 'opt_3', text: '{k: v for k, v in seq}' },
                  { id: 'opt_4', text: 'set([x for x in seq]) only' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Curly braces without colons {x for x in seq} construct a set comprehension.'
              }
            ]
          },
          key_takeaways: [
            'Comprehensions are faster and more readable than manual append loops.',
            'Dictionary comprehensions use {k: v for ...}.',
            'Set comprehensions use {x for ...} and automatically discard duplicates.'
          ],
          revision_prompts: [
            'What happens if two keys collide in a dictionary comprehension?',
            'How does a comprehension create its own local scope in Python 3?'
          ]
        },

        // Lesson 2
        {
          id: 'les-nested-comprehensions-readability',
          slug: 'nested-comprehensions-readability',
          title: 'Nested Comprehensions and Readability Constraints',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Flatten 2D matrices, compute Cartesian products, and identify when nested comprehensions should be replaced with explicit loops.',
          learning_objectives: [
            'Flatten 2D nested lists using multiple for clauses in a comprehension',
            'Generate Cartesian products (combinations) cleanly',
            'Know when a nested comprehension becomes unreadable and violates PEP 20'
          ],
          content_markdown: `### Multiple \`for\` Clauses in Comprehensions

The order of \`for\` clauses in a comprehension matches the order of nested \`for\` loops in standard Python:

\`\`\`python
# Flattening a 2D matrix
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Reads identically to:
# for row in matrix:
#     for item in row:
flattened = [item for row in matrix for item in row]
\`\`\`

### The Readability Constraint (Zen of Python)
*"Readability counts."*
If a comprehension spans more than 2 lines, nests more than 2 \`for\` clauses, or uses complex conditional expressions (\`x if cond else y\`), **refactor it into a regular nested loop**. Cleverness should never compromise maintainability.`,
          code_snippet: `# 1. Flattening a 2D grid
grid = [
    ["A1", "A2", "A3"],
    ["B1", "B2", "B3"]
]
flat_cells = [cell for row in grid for cell in row]
print("Flattened grid:", flat_cells)

# 2. Cartesian product (Suits and Ranks)
suits = ["♠", "♥"]
ranks = ["A", "K", "Q"]
deck = [f"{r}{s}" for s in suits for r in ranks]
print("Sample deck:   ", deck)`,
          code_language: 'python',
          code_explanation: 'Shows multi-loop list comprehensions for flattening a 2D grid and generating a deck of cards through a Cartesian product.',
          expected_output: `Flattened grid: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3']
Sample deck:    ['A♠', 'K♠', 'Q♠', 'A♥', 'K♥', 'Q♥']`,
          quiz: {
            id: 'quiz-nested-comprehensions',
            title: 'Knowledge Check: Nested Comprehensions',
            questions: [
              {
                id: 'q-nc-1',
                question_text: 'In "[x for row in matrix for x in row]", which for loop corresponds to the outer loop?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'for x in row' },
                  { id: 'opt_2', text: 'for row in matrix' },
                  { id: 'opt_3', text: 'Both run simultaneously' },
                  { id: 'opt_4', text: 'It alternates randomly' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Clauses in comprehensions follow standard indentation order from left to right; for row in matrix is the outer loop.'
              }
            ]
          },
          key_takeaways: [
            'Multiple for clauses follow normal outer-to-inner loop order.',
            'Keep comprehensions simple: at most 2 for clauses.',
            'If it is hard to read in 5 seconds, use a standard nested loop.'
          ],
          revision_prompts: [
            'How can you transpose a 2D matrix using a list comprehension?',
            'What is the difference between [x for row in m for x in row] and [[x for x in row] for row in m]?'
          ]
        },

        // Lesson 3
        {
          id: 'les-gen-expressions-functional',
          slug: 'generator-expressions-functional',
          title: 'Generator Expressions in Functional Pipelines',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Combine generator expressions with any(), all(), sum(), and min() for memory-free short-circuiting validation.',
          learning_objectives: [
            'Use any() and all() with generator expressions for short-circuiting evaluations',
            'Perform streaming aggregations without creating intermediate lists',
            'Analyze performance gains from lazy boolean verification'
          ],
          content_markdown: `### Short-Circuiting Boolean Evaluations

Two of Python's most powerful functional primitives are:
- **\`any(iterable)\`**: Returns \`True\` as soon as **any** item is truthy. Stops immediately!
- **\`all(iterable)\`**: Returns \`False\` as soon as **any** item is falsy. Stops immediately!

When combined with generator expressions, they evaluate lazily:

\`\`\`python
# Evaluates lazily: stops at the very first match!
has_admin = any(u["role"] == "admin" for u in user_stream)

# Verifies all values satisfy criteria; stops at first violation
all_active = all(u["is_active"] for u in user_stream)
\`\`\``,
          code_snippet: `# Validating transaction records using all() and any()
transactions = [
    {"id": "tx_1", "amount": 120, "verified": True},
    {"id": "tx_2", "amount": 450, "verified": True},
    {"id": "tx_3", "amount": 50,  "verified": True},
    {"id": "tx_4", "amount": 9500, "verified": True}
]

# Check if all transactions are verified
all_verified = all(tx["verified"] for tx in transactions)

# Check if any transaction is a high-value flag (> 5000)
has_high_value = any(tx["amount"] > 5000 for tx in transactions)

# Sum total verified amounts
total_amount = sum(tx["amount"] for tx in transactions if tx["verified"])

print(f"All transactions verified? {all_verified}")
print(f"High-value audit triggered? {has_high_value}")
print(f"Total transaction volume:   \${total_amount}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates any(), all(), and sum() combined with generator expressions to perform streaming validations and aggregations without allocating lists.',
          expected_output: `All transactions verified? True
High-value audit triggered? True
Total transaction volume:   \$10120`,
          quiz: {
            id: 'quiz-gen-functional',
            title: 'Knowledge Check: any() and all()',
            questions: [
              {
                id: 'q-gf-1',
                question_text: 'Why is any(x > 10 for x in items) faster than any([x > 10 for x in items])?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Lists cannot be passed to any().' },
                  { id: 'opt_2', text: 'The generator expression stops evaluating immediately upon finding the first match, while the list comprehension evaluates every item up front.' },
                  { id: 'opt_3', text: 'The list comprehension runs in parallel.' },
                  { id: 'opt_4', text: 'There is no difference in speed.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A list comprehension constructs the entire list before passing it to any(), while a generator expression streams items and short-circuits on the first True.'
              }
            ]
          },
          key_takeaways: [
            'any() and all() short-circuit on the first decisive element.',
            'Always pass generator expressions (not lists) to any() and all().',
            'Clean functional pipelines replace verbose flag-checking loops.'
          ],
          revision_prompts: [
            'What does all([]) return on an empty sequence?',
            'What does any([]) return on an empty sequence?'
          ]
        },

        // Lesson 4
        {
          id: 'les-lambda-expressions',
          slug: 'lambda-expressions',
          title: 'Anonymous lambda Expressions and Appropriate Use Cases',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Write lightweight inline anonymous functions with lambda, understanding their single-expression limitations.',
          learning_objectives: [
            'Construct anonymous functions using lambda arguments: expression syntax',
            'Understand restrictions: single expression, no statements, no assignments',
            'Apply lambdas effectively as sorting keys and callback predicates'
          ],
          content_markdown: `### The \`lambda\` Syntax

A \`lambda\` is an inline, anonymous function:

\`\`\`python
# Syntax: lambda arg1, arg2, ...: single_expression
square = lambda x: x ** 2
print(square(6))  # 36
\`\`\`

### Limitations
1. **Single Expression Only**: A lambda cannot contain statements like \`return\`, \`raise\`, \`while\`, or assignments (\`=\`).
2. **Readability Warning**: PEP 8 discourages binding lambdas to names (\`f = lambda ...\`). If a function needs a name, define it with \`def\`!
3. **Primary Use Case**: Throwaway inline key functions for \`sorted()\`, \`max()\`, \`min()\`.`,
          code_snippet: `# Practical use cases for lambda expressions
inventory = [
    {"item": "Laptop", "stock": 5, "price": 1200},
    {"item": "Mouse",  "stock": 45, "price": 25},
    {"item": "Monitor", "stock": 12, "price": 300}
]

# Sort by inventory valuation: stock * price descending
sorted_by_value = sorted(inventory, key=lambda p: p["stock"] * p["price"], reverse=True)

print("Inventory sorted by total value:")
for item in sorted_by_value:
    val = item["stock"] * item["price"]
    print(f"  {item['item']}: \${val}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates using a lambda function as a custom sorting key calculating dynamic item valuation.',
          expected_output: `Inventory sorted by total value:
  Laptop: \$6000
  Monitor: \$3600
  Mouse: \$1125`,
          quiz: {
            id: 'quiz-lambda-expressions',
            title: 'Knowledge Check: Lambdas',
            questions: [
              {
                id: 'q-le-1',
                question_text: 'Which statement is TRUE regarding Python lambda expressions?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They can contain multiple statements separated by semicolons.' },
                  { id: 'opt_2', text: 'They can contain only a single expression whose value is returned automatically.' },
                  { id: 'opt_3', text: 'They must always include an explicit return keyword.' },
                  { id: 'opt_4', text: 'They execute in a separate operating system process.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A Python lambda body is restricted to a single expression that is implicitly evaluated and returned.'
              }
            ]
          },
          key_takeaways: [
            'Lambdas are anonymous, single-expression inline functions.',
            'Best suited as throwaway key functions in sorted, min, and max.',
            'If a function requires multiple lines, documentation, or a name, use def.'
          ],
          revision_prompts: [
            'Why does PEP 8 advise against "my_fn = lambda x: x + 1"?',
            'How can you use conditional expressions inside a lambda (e.g. lambda x: "even" if x % 2 == 0 else "odd")?'
          ]
        },

        // Lesson 5
        {
          id: 'les-map-and-filter',
          slug: 'map-and-filter',
          title: 'The Functional Primitives: map() and filter()',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Examine Python built-ins map() and filter(), their iterator return values, and comparisons with comprehensions.',
          learning_objectives: [
            'Use map(fn, iterable) to apply transformations lazily',
            'Use filter(predicate, iterable) to filter sequences',
            'Compare readability and idiomatic conventions between map/filter and comprehensions'
          ],
          content_markdown: `### \`map()\` and \`filter()\` Mechanics

- **\`map(function, iterable)\`**: Applies \`function\` to every item in \`iterable\`. Returns an **iterator**.
- **\`filter(predicate, iterable)\`**: Returns an **iterator** of items for which \`predicate(item)\` is \`True\`.

\`\`\`python
nums = [1, 2, 3, 4]
doubled_it = map(lambda x: x * 2, nums)  # Lazy iterator
evens_it   = filter(lambda x: x % 2 == 0, nums) # Lazy iterator
\`\`\`

### Pythonic Convention
In modern Python, list comprehensions and generator expressions are usually preferred over \`map()\` and \`filter()\` with \`lambda\`:
\`\`\`python
# Functional style:
list(map(lambda x: x * 2, filter(lambda x: x > 0, nums)))

# Pythonic comprehension style (much easier to read!):
[x * 2 for x in nums if x > 0]
\`\`\``,
          code_snippet: `# Comparing map/filter with idiomatic comprehensions
prices_usd = [19.99, 5.50, 120.00, 45.00]
exchange_rate = 83.5

# 1. Using map and filter
inr_prices_it = map(lambda p: round(p * exchange_rate, 2), filter(lambda p: p > 10, prices_usd))
print("Via map/filter:    ", list(inr_prices_it))

# 2. Via idiomatic list comprehension
inr_prices_comp = [round(p * exchange_rate, 2) for p in prices_usd if p > 10]
print("Via comprehension: ", inr_prices_comp)`,
          code_language: 'python',
          code_explanation: 'Compares map/filter chaining with equivalent list comprehensions, demonstrating identical results with cleaner comprehension syntax.',
          expected_output: `Via map/filter:     [1669.16, 10020.0, 3757.5]
Via comprehension:  [1669.16, 10020.0, 3757.5]`,
          quiz: {
            id: 'quiz-map-filter',
            title: 'Knowledge Check: map and filter',
            questions: [
              {
                id: 'q-mf-1',
                question_text: 'What does map(str, [1, 2, 3]) return in Python 3?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'A list: [\'1\', \'2\', \'3\']' },
                  { id: 'opt_2', text: 'A lazy map iterator' },
                  { id: 'opt_3', text: 'A tuple: (\'1\', \'2\', \'3\')' },
                  { id: 'opt_4', text: 'A single string "123"' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'In Python 3, map returns a lazy iterator rather than a pre-allocated list.'
              }
            ]
          },
          key_takeaways: [
            'map() and filter() return lazy iterators in Python 3.',
            'Passing existing functions like map(int, strings) is very clean.',
            'When lambdas are required, list comprehensions are generally more readable.'
          ],
          revision_prompts: [
            'How can map take multiple iterables simultaneously (e.g. map(pow, base_list, exp_list))?',
            'What does filter(None, sequence) do?'
          ]
        },

        // Lesson 6
        {
          id: 'les-sorted-key-functions',
          slug: 'sorted-with-key-functions',
          title: 'Advanced Sorting with Custom Key Functions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Leverage operator.itemgetter, operator.attrgetter, and compound tuple keys for clean, high-performance sorting.',
          learning_objectives: [
            'Replace lambda keys with operator.itemgetter and attrgetter for speed',
            'Sort case-insensitively using str.lower key functions',
            'Understand Timsort stability when performing multi-pass sorts'
          ],
          content_markdown: `### The \`operator\` Module: Faster Keys

While \`lambda x: x["age"]\` works, the standard library **\`operator\`** module provides C-implemented callables that execute faster and read cleanly:

- **\`operator.itemgetter(key)\`**: Replaces \`lambda d: d[key]\`
- **\`operator.attrgetter(attr)\`**: Replaces \`lambda obj: obj.attr\`
- **\`operator.methodcaller(method_name)\`**: Calls a method on each item

\`\`\`python
from operator import itemgetter

users.sort(key=itemgetter("age"))
# Multi-field sorting:
users.sort(key=itemgetter("department", "salary"))
\`\`\``,
          code_snippet: `from operator import itemgetter, attrgetter

class Product:
    def __init__(self, name, category, price):
        self.name = name
        self.category = category
        self.price = price

    def __repr__(self):
        return f"{self.name} (\${self.price})"

catalog = [
    Product("Headphones", "Electronics", 120),
    Product("Keyboard",   "Electronics", 80),
    Product("Coffee Mug", "Home",        15),
    Product("Monitor",    "Electronics", 300)
]

# Sort objects by price using attrgetter
catalog.sort(key=attrgetter("price"))
print("Sorted by price with attrgetter:")
for p in catalog:
    print(f"  {p}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates operator.attrgetter sorting custom Product objects cleanly without lambda definitions.',
          expected_output: `Sorted by price with attrgetter:
  Coffee Mug (\$15)
  Keyboard (\$80)
  Headphones (\$120)
  Monitor (\$300)`,
          quiz: {
            id: 'quiz-sorted-keys',
            title: 'Knowledge Check: operator Key Functions',
            questions: [
              {
                id: 'q-sk-1',
                question_text: 'Why is operator.itemgetter("name") often preferred over lambda x: x["name"]?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'itemgetter can only be used on strings.' },
                  { id: 'opt_2', text: 'itemgetter is implemented in C and runs slightly faster while expressing intent cleanly.' },
                  { id: 'opt_3', text: 'itemgetter mutates the dictionary in-place.' },
                  { id: 'opt_4', text: 'lambdas are deprecated in Python 3.12.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'operator.itemgetter avoids creating a Python bytecode frame per comparison, delivering higher performance and cleaner code.'
              }
            ]
          },
          key_takeaways: [
            'Use operator.itemgetter for dictionaries and tuples.',
            'Use operator.attrgetter for class objects.',
            'Sorting stability guarantees that items with identical keys maintain original order.'
          ],
          revision_prompts: [
            'How can you sort a list of filenames numerically (file1, file2, file10)?',
            'How does str.casefold differ from str.lower for sorting?'
          ]
        },

        // Lesson 7
        {
          id: 'les-functools-reduce-alternatives',
          slug: 'functools-reduce-and-alternatives',
          title: 'functools.reduce() and When to Avoid It',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Understand cumulative fold reductions with functools.reduce, and identify when Pythonic alternatives are superior.',
          learning_objectives: [
            'Understand how reduce(fn, iterable, initial) computes cumulative values',
            'Compute cumulative products and nested dictionary lookups',
            'Choose specialized built-ins (sum, math.prod, "".join) for readability'
          ],
          content_markdown: `### How \`reduce()\` Works

\`functools.reduce(function, sequence, initial)\` folds a sequence down to a single value by applying a 2-argument function cumulatively from left to right:

\`\`\`
reduce(add, [1, 2, 3, 4])
Step 1: add(1, 2) -> 3
Step 2: add(3, 3) -> 6
Step 3: add(6, 4) -> 10
\`\`\`

### Why Python Removed It from Built-ins
In Python 2, \`reduce\` was built-in. Guido van Rossum moved it to \`functools\` in Python 3 because dense reductions are notoriously difficult to read:
- Instead of \`reduce(lambda a, b: a + b, seq)\` ──► Use **\`sum(seq)\`**
- Instead of \`reduce(lambda a, b: a * b, seq)\` ──► Use **\`math.prod(seq)\`**
- Instead of \`reduce(lambda a, b: a + b, strings)\` ──► Use **\`"".join(strings)\`**`,
          code_snippet: `from functools import reduce
import operator

# 1. Cumulative multiplication using operator.mul
numbers = [2, 3, 4, 5]
product = reduce(operator.mul, numbers, 1)
print(f"Product of {numbers}: {product}")

# 2. Deep dictionary navigation with reduce
config = {
    "database": {
        "primary": {
            "credentials": {
                "port": 5432
            }
        }
    }
}

path = ["database", "primary", "credentials", "port"]
deep_val = reduce(lambda current, key: current.get(key, {}), path, config)
print(f"Navigated deep port: {deep_val}")`,
          code_language: 'python',
          code_explanation: 'Shows using functools.reduce with operator.mul for multiplication and traversing nested dictionary trees safely.',
          expected_output: `Product of [2, 3, 4, 5]: 120
Navigated deep port: 5432`,
          quiz: {
            id: 'quiz-functools-reduce',
            title: 'Knowledge Check: functools.reduce',
            questions: [
              {
                id: 'q-fr-1',
                question_text: 'What is the recommended Pythonic replacement for reduce(lambda a, b: a + b, items)?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'items.total()' },
                  { id: 'opt_2', text: 'The built-in sum(items) function.' },
                  { id: 'opt_3', text: 'math.accumulate(items)' },
                  { id: 'opt_4', text: 'items.sum()' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Built-in sum() is faster, clearer, and idiomatic.'
              }
            ]
          },
          key_takeaways: [
            'reduce() folds sequences into single cumulative values.',
            'Always supply an explicit initial argument when possible.',
            'Prefer dedicated built-ins (sum, math.prod, "".join) for readability.'
          ],
          revision_prompts: [
            'What happens if reduce() is called on an empty sequence without an initial value?',
            'How does itertools.accumulate differ from functools.reduce?'
          ]
        },

        // Lesson 8
        {
          id: 'les-immutability-side-effects',
          slug: 'immutability-and-side-effects',
          title: 'Immutability and Pure Functions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Write pure functions with zero side effects, avoid in-place parameter mutations, and leverage immutable data types.',
          learning_objectives: [
            'Define pure functions: deterministic output for given inputs, zero side effects',
            'Identify bugs caused by unexpected in-place argument mutation',
            'Return new copies or immutable tuples to preserve data integrity'
          ],
          content_markdown: `### What Is a Pure Function?

A **pure function** satisfies two properties:
1. **Deterministic**: Given the same inputs, it always returns the exact same output.
2. **No Side Effects**: It does not modify external variables, mutate mutable arguments in-place, write to files, or change system state.

### The In-Place Mutation Bug

\`\`\`python
# Impure anti-pattern: Mutates the caller's list!
def add_bonus(scores):
    for i in range(len(scores)):
        scores[i] += 5  # Corrupts the original data!
    return scores

# Pure function: Returns a fresh transformed list
def add_bonus_pure(scores):
    return [s + 5 for s in scores]  # Original is safe!
\`\`\``,
          code_snippet: `# Comparing impure mutation with pure functional transformation
original_scores = [85, 90, 78, 92]

# Pure transformation
def grant_curve(scores, curve_points=5):
    # Returns a new list; does not mutate input
    return [min(100, s + curve_points) for s in scores]

curved = grant_curve(original_scores, 5)

print("Original scores (unaffected):", original_scores)
print("Curved scores:                ", curved)`,
          code_language: 'python',
          code_explanation: 'Demonstrates writing a pure function that returns a new transformed list, keeping the caller\'s original collection intact.',
          expected_output: `Original scores (unaffected): [85, 90, 78, 92]
Curved scores:                 [90, 95, 83, 97]`,
          quiz: {
            id: 'quiz-pure-functions',
            title: 'Knowledge Check: Pure Functions',
            questions: [
              {
                id: 'q-pf-1',
                question_text: 'Which of the following causes a function to be IMPURE?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Returning a new list comprehension.' },
                  { id: 'opt_2', text: 'Mutating an input list in-place with list.append().' },
                  { id: 'opt_3', text: 'Using type hints on parameters.' },
                  { id: 'opt_4', text: 'Calling len() on an argument.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Mutating an input argument modifies external state outside the function, introducing side effects and making the function impure.'
              }
            ]
          },
          key_takeaways: [
            'Pure functions produce predictable, bug-free, easily testable code.',
            'Never mutate input lists or dicts in-place unless explicitly requested.',
            'Return new collections or immutable tuples.'
          ],
          revision_prompts: [
            'Why are pure functions easier to test and parallelize?',
            'What is the difference between shallow immutability and deep immutability?'
          ]
        },

        // Lesson 9
        {
          id: 'les-choosing-loops-vs-functional',
          slug: 'choosing-loops-vs-functional',
          title: 'Choosing Between Loops and Functional Techniques',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Balance functional conciseness with Pythonic readability, knowing when a clear loop surpasses a convoluted comprehension.',
          learning_objectives: [
            'Evaluate code maintainability using PEP 20 (Zen of Python)',
            'Refactor convoluted functional one-liners into clean, readable loops',
            'Select the right balance between functional style and imperative clarity'
          ],
          content_markdown: `### The Zen of Python Tradeoff

Python is a multi-paradigm language. It supports functional programming, but it is **not Haskell**.

When choosing between loops and functional expressions:

1. **Use Comprehensions When**:
   - Performing a 1-to-1 transformation or simple filtering.
   - The expression fits comfortably on 1 or 2 readable lines.
   - Constructing a dictionary or set directly.
2. **Use Explicit \`for\` Loops When**:
   - The loop body contains complex error handling (\`try/except\`).
   - Logging, file I/O, or multiple conditional side effects occur.
   - The logic requires breaking or continuing based on complex state.

### Anti-Pattern: The Unreadable 5-Line Comprehension
If someone needs to read your comprehension 3 times to understand what it does, refactor it into a 5-line \`for\` loop!`,
          code_snippet: `# Refactoring a convoluted functional one-liner into clean Python
raw_records = [
    {"user": "alice", "status": "active", "points": [10, 20, 30]},
    {"user": "bob",   "status": "pending", "points": [5]},
    {"user": "charlie", "status": "active", "points": [40, 50]}
]

# Clean, idiomatic approach: Explicit loop with clear purpose
active_averages = {}
for r in raw_records:
    if r["status"] == "active" and r["points"]:
        avg = sum(r["points"]) / len(r["points"])
        active_averages[r["user"]] = round(avg, 1)

print("Active user point averages:")
for user, avg in active_averages.items():
    print(f"  {user}: {avg} pts")`,
          code_language: 'python',
          code_explanation: 'Demonstrates choosing a clean, readable loop with explicit validation and calculation over an obscure multi-nested dictionary comprehension.',
          expected_output: `Active user point averages:
  alice: 20.0 pts
  charlie: 45.0 pts`,
          quiz: {
            id: 'quiz-loops-vs-functional',
            title: 'Knowledge Check: Loops vs Functional',
            questions: [
              {
                id: 'q-lvf-1',
                question_text: 'According to Pythonic conventions, when should an explicit for-loop be chosen over a comprehension?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'When the operation contains complex branching, try/except blocks, or side effects.' },
                  { id: 'opt_2', text: 'Loops should never be used in intermediate Python.' },
                  { id: 'opt_3', text: 'Only when working with numbers.' },
                  { id: 'opt_4', text: 'When you want the code to run 10x slower.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Comprehensions are meant for pure data creation; complex error handling, side effects, and multi-stage logic belong in explicit loops.'
              }
            ]
          },
          key_takeaways: [
            'Python favors clarity over extreme functional brevity.',
            'Use comprehensions for straightforward transformations.',
            'Use explicit loops for multi-step logic, logging, and exception handling.'
          ],
          revision_prompts: [
            'How does code readability impact maintenance cost in production codebases?',
            'What is the cognitive load of a 3-level nested dictionary comprehension?'
          ]
        }
      ]
    }
  ]
};
