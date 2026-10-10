/**
 * Revoraa Developer Learning Platform - Curriculum Data Definition
 * 
 * Comprehensive Python Development curriculum across Level 1 (Beginner)
 * and Level 2 (Foundation), providing authoritative educational content, runnable Python examples,
 * guided exercises, and aligned interactive knowledge checks.
 */

import { LEVEL_3_DEFINITION } from './curriculum/level3Modules.js';
import { LEVEL_4_DEFINITION } from './curriculum/level4Modules.js';
import { LEVEL_5_DEFINITION } from './curriculum/level5Modules.js';

export const PYTHON_PATH = {
  id: 'path-python-dev',
  slug: 'python-development',
  title: 'Python Development',
  tagline: 'From Syntax Fundamentals to Production Architecture',
  description: 'Master Python through structured, foundational levels. Progress from language syntax and object-oriented design to advanced collections, generators, decorators, APIs, SQLite databases, and comprehensive automated testing.',
  icon: 'Terminal',
  badge_color: 'var(--color-primary)',
  estimated_hours: 190,
  total_lessons: 279,
  is_published: true,
  learning_objectives: [
    'Understand CPython bytecode execution, heap allocation, and dynamic typing.',
    'Write idiomatic control flow with guard clauses, while loops, and range sequence iteration.',
    'Structure clean functions using LEGB scope resolution and *args/**kwargs unpacking.',
    'Leverage core collections (lists, tuples, dicts, sets) with O(1) lookups and comprehensions.',
    'Design object-oriented systems with encapsulation, properties, inheritance, and super().',
    'Organize production Python packages and leverage standard library modules.',
    'Safely handle file I/O with context managers and build robust exception hierarchies.',
    'Write automated unit tests using the standard library unittest framework.',
    'Work confidently with advanced collections, hashing, custom sorting, and Big-O computational complexity.',
    'Build custom iterators and memory-efficient streaming generator pipelines using yield and yield from.',
    'Construct custom decorators, closures, and parameterized function wrappers preserving metadata with functools.wraps.',
    'Write expressive comprehensions, lambda expressions, and pure functional transformations.',
    'Consume REST APIs safely, handle network errors and timeouts, parse JSON payloads, and mock HTTP calls.',
    'Connect Python to SQLite databases using parameterized queries, transactions, and the Repository pattern.',
    'Structure cohesive Python packages avoiding circular imports and configuring structured logging.',
    'Write comprehensive automated test suites using unittest, table-driven subtests, and mocks.',
    'Explain synchronous, asynchronous, concurrent, and parallel execution.',
    'Use asyncio and coroutines appropriately with task cancellation, timeouts, and error handling.',
    'Compare threads, processes, and asynchronous I/O and select suitable concurrency strategies.',
    'Profile Python programs, eliminate bottlenecks, and implement memoization caching.',
    'Use advanced type hints, generic TypeVars, and structural Protocols to improve maintainability.',
    'Apply design patterns (Strategy, Factory, Adapter, Observer, Repository) and clean separation of concerns.',
    'Build reliable data pipelines with correlation IDs, structured logging, exponential retries, and idempotency.',
    'Test asynchronous code, concurrent behavior, and architecture fitness functions with deterministic test doubles.',
    'Organize production Python projects using the src-layout, __all__ boundaries, and isolated virtual environments.',
    'Build and release distributable Python packages with pyproject.toml and Semantic Versioning.',
    'Configure applications using 12-factor environment variables, fail-fast schema validation, and masked SecretString types.',
    'Engineer automated test quality gates with unit tests, transactional rollbacks, autospec mocks, and branch coverage.',
    'Build reliable services with connection pooling, Alembic migrations, idempotency keys, and circuit breakers.',
    'Write hardened multi-stage Dockerfiles running as unprivileged users with graceful SIGTERM signal draining.',
    'Implement continuous integration test matrices, OIDC identity tokens, structured JSON logging, and Prometheus RED metrics.',
    'Conduct comprehensive Production Readiness Reviews (PRR), post-deployment smoke tests, and blameless incident runbooks.'
  ],
  levels: [

    {
      level_number: 1,
      level_title: 'Beginner',
      badge: 'Level 1',
      description: 'Language syntax, variables, conditional logic, loops, functions, and core collections.',
      modules: [
        {
          id: 'mod-py-fund',
          slug: 'python-fundamentals',
          level_number: 1,
          title: 'Python Fundamentals',
          description: 'Core execution model, indentation rules, dynamic variables, and numeric arithmetic.',
          estimated_hours: 4,
          sort_order: 1,
          is_published: true,
          topics: [
            {
              id: 'top-syntax-exec',
              slug: 'syntax-and-execution',
              title: 'Execution Model & Basic Syntax',
              summary: 'How CPython compiles and runs scripts, indentation significance, and variable references.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-how-python-runs',
                  slug: 'how-python-runs',
                  title: 'How Python Runs: Interpreters, Bytecode & The REPL',
                  lesson_type: 'reading',
                  estimated_minutes: 8,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Discover the lifecycle of Python code from source text to bytecode execution in the virtual machine.',
                  learning_objectives: [
                    'Understand the role of the CPython compiler and bytecode (.pyc)',
                    'Differentiate script execution from interactive REPL evaluation',
                    'Master Python indentation and statement termination rules'
                  ],
                  content_markdown: `### The Python Execution Lifecycle

When you execute a Python program (\`python script.py\`), the runtime does not interpret your source text directly line-by-line as a shell script does. Instead, it follows a two-phase process:

1. **Compilation to Bytecode**: The CPython interpreter parses your source code (\`.py\`) into an Abstract Syntax Tree (AST), checks syntax, and compiles it into platform-independent intermediate instructions known as **bytecode** (often cached in the \`__pycache__\` folder as \`.pyc\` files).
2. **Virtual Machine Evaluation**: The Python Virtual Machine (PVM) is the runtime engine loop that reads the bytecode instructions and executes the corresponding native machine operations.

\`\`\`
Source Code (.py) ──► Compiler ──► Bytecode (.pyc) ──► PVM Loop ──► Machine Output
\`\`\`

### Significant Whitespace and Indentation

Unlike languages that delimit blocks with curly braces (\`{}\`) or keywords (\`begin\` / \`end\`), Python uses indentation to declare block scope. PEP 8—the official Python style guide—standardizes on **4 spaces per indentation level**. Never mix tabs and spaces.

### Common Misconceptions
- **Myth**: Python is purely interpreted and never compiled.
  - *Reality*: Python is always compiled into bytecode before execution. The compiler phase just occurs automatically in memory without a separate manual build command.`,
                  code_snippet: `# Exploring Python's execution model and basic output
def explain_python():
    message = "Python compiles source code into bytecode before PVM execution."
    version = 3.12
    is_interpreted = True
    
    print(f"Status: {message}")
    print(f"Target runtime: Python {version} (Interpreted loop: {is_interpreted})")

if __name__ == "__main__":
    explain_python()`,
                  code_language: 'python',
                  code_explanation: 'This script defines a basic function and uses the canonical `if __name__ == "__main__":` idiom to guarantee execution only when run directly as a script.',
                  expected_output: `Status: Python compiles source code into bytecode before PVM execution.
Target runtime: Python 3.12 (Interpreted loop: True)`,
                  guided_exercise: {
                    prompt: 'Modify the script to define a variable `author = "Guido van Rossum"` and print an attribution line.',
                    starter_code: `def introduce_python():
    language = "Python"
    # Task: Add author variable and print it
    print(f"Learning {language}!")

introduce_python()`,
                    expected_output: 'Learning Python!'
                  },
                  quiz: {
                    id: 'quiz-how-python-runs',
                    slug: 'quiz-how-python-runs',
                    title: 'Execution Model & Bytecode Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-py-exec-1',
                        question_text: 'What is the role of the Python Virtual Machine (PVM)?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'It converts C++ code into Python source code.' },
                          { id: 'opt_2', text: 'It reads compiled bytecode instructions and executes native machine operations.' },
                          { id: 'opt_3', text: 'It serves as a browser CSS rendering engine.' },
                          { id: 'opt_4', text: 'It transfiles Python directly into binary assembly files on disk.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'CPython first compiles source code to bytecode, and the PVM is the runtime loop that interprets and executes those bytecode instructions.'
                      },
                      {
                        id: 'q-py-exec-2',
                        question_text: 'Which statements about Python indentation are true?',
                        question_type: 'multiple_choice',
                        options: [
                          { id: 'opt_1', text: 'Indentation defines code block scope instead of curly braces.' },
                          { id: 'opt_2', text: 'PEP 8 recommends 4 spaces per indentation level.' },
                          { id: 'opt_3', text: 'Mixing tabs and spaces in the same block causes an IndentationError.' },
                          { id: 'opt_4', text: 'Indentation is ignored by CPython and is purely cosmetic.' }
                        ],
                        correct_option_ids: ['opt_1', 'opt_2', 'opt_3'],
                        explanation: 'Indentation is syntactically significant in Python. Blocks are defined by whitespace, PEP 8 mandates 4 spaces, and mixing tabs and spaces raises IndentationError.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Python is byte-compiled into .pyc files before being evaluated by the Python Virtual Machine (PVM).',
                    'Indentation defines scope; use exactly 4 spaces per nesting level.',
                    'The interactive REPL evaluates statements using a Read-Eval-Print-Loop.'
                  ],
                  revision_prompts: [
                    'Describe the two distinct stages CPython executes when running a .py script.',
                    'Why does Python forbid mixing tabs and spaces in source files?'
                  ]
                },
                {
                  id: 'les-variables-typing',
                  slug: 'variables-and-typing',
                  title: 'Variables, References & Dynamic Typing',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Learn how Python variables act as pointers to heap-allocated objects rather than fixed memory slots.',
                  learning_objectives: [
                    'Understand object binding and reference assignment',
                    'Differentiate identity (`is`) from equality (`==`)',
                    'Inspect object types and memory IDs using built-ins'
                  ],
                  content_markdown: `### Variables are Names Bound to Objects

In languages like C or Go, a variable represents a labeled memory box of a fixed type. In Python, **variables are reference tags (names) bound to objects living on the heap**.

When you write \`x = 42\`:
- Python allocates an integer object with value \`42\` on the heap.
- The name \`x\` is bound in the current scope dictionary to point to that object.
- Reassigning \`x = "hello"\` does not change the memory layout of \`42\`; it simply re-binds \`x\` to a newly created string object.

### Identity vs. Equality

- **Equality (\`==\`)**: Compares values or contents of two objects by calling their \`__eq__\` method.
- **Identity (\`is\`)**: Checks whether two variables refer to the exact same object in memory (\`id(a) == id(b)\`).

### Common Mistake: Using \`is\` with Numbers or Strings
Python caches small integers (-5 to 256) and interned strings for optimization. Never rely on \`a is b\` for numerical value comparison—always use \`==\`!`,
                  code_snippet: `# Inspecting object identity and dynamic rebinding
x = [1, 2, 3]
y = x            # y references the exact same list
z = [1, 2, 3]    # z is a distinct list with identical contents

print(f"x == y: {x == y}")   # True: values match
print(f"x is y: {x is y}")   # True: same memory address
print(f"x == z: {x == z}")   # True: values match
print(f"x is z: {x is z}")   # False: distinct heap objects

# Built-in type inspection
print(f"Type of x: {type(x).__name__}")`,
                  code_language: 'python',
                  code_explanation: 'Variables `x` and `y` reference the same memory pointer, while `z` points to a distinct list allocated separately.',
                  expected_output: `x == y: True
x is y: True
x == z: True
x is z: False
Type of x: list`,
                  guided_exercise: {
                    prompt: 'Create two distinct integer lists `a` and `b` with identical items `[10, 20]`. Print both equality and identity checks.',
                    starter_code: `a = [10, 20]
b = [10, 20]

# Check equality and identity
print(a == b)
print(a is b)`,
                    expected_output: `True\nFalse`
                  },
                  quiz: {
                    id: 'quiz-variables-typing',
                    slug: 'quiz-variables-typing',
                    title: 'Variables & Object Identity Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-var-1',
                        question_text: 'What does the `is` operator compare in Python?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'Whether two objects have identical values.' },
                          { id: 'opt_2', text: 'Whether two references point to the exact same memory object (identity).' },
                          { id: 'opt_3', text: 'Whether two strings have the same length.' },
                          { id: 'opt_4', text: 'Whether a variable is defined in the global scope.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'The `is` operator checks memory address identity (id(a) == id(b)), whereas `==` checks value equality.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Variables do not have types; the objects they reference have types.',
                    'Use `==` to compare values; use `is` to check object identity (e.g., `x is None`).',
                    'Functions `type()` and `id()` provide runtime inspection of object classes and addresses.'
                  ],
                  revision_prompts: [
                    'What happens under the hood when a variable is reassigned to an object of a different type?',
                    'Under what circumstances would `a == b` evaluate to True while `a is b` evaluates to False?'
                  ]
                }
              ]
            },
            {
              id: 'top-numbers-math',
              slug: 'numbers-and-operators',
              title: 'Numeric Types & Arithmetic Operators',
              summary: 'Integers with arbitrary precision, floating point representations, and floor division.',
              sort_order: 2,
              lessons: [
                {
                  id: 'les-numbers-operators',
                  slug: 'numbers-and-math',
                  title: 'Integers, Floats & Division Operators',
                  lesson_type: 'reading',
                  estimated_minutes: 8,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Understand Python arbitrary precision integers, float precision nuances, and floor vs. true division.',
                  learning_objectives: [
                    'Master true division (`/`) vs. floor division (`//`)',
                    'Understand arbitrary precision integers in Python 3',
                    'Prevent floating point rounding pitfalls'
                  ],
                  content_markdown: `### Number Representations in Python 3

Python provides three distinct numeric types:
1. **\`int\` (Arbitrary Precision)**: In Python 3, integers have no fixed 32-bit or 64-bit maximum. They expand dynamically in memory up to available system RAM, avoiding numeric overflow bugs.
2. **\`float\` (IEEE 754 64-bit Double)**: Decimal numbers represented with double precision.
3. **\`complex\`**: Built-in support for complex numbers (\`3 + 4j\`).

### Division Operators

- **True Division (\`/\`)**: Always yields a \`float\`, even if the operands divide evenly (\`8 / 2 == 4.0\`).
- **Floor Division (\`//\`)**: Truncates towards negative infinity, returning the largest integer less than or equal to the quotient (\`7 // 2 == 3\`, but \`-7 // 2 == -4\`).
- **Modulo (\`%\`)**: Computes the remainder (\`7 % 2 == 1\`).`,
                  code_snippet: `# Arithmetic operations and division nuances
a = 15
b = 4

print(f"True Division (a / b): {a / b}")      # 3.75 (float)
print(f"Floor Division (a // b): {a // b}")    # 3 (int)
print(f"Modulo (a % b): {a % b}")              # 3
print(f"Exponentiation (a ** 2): {a ** 2}")    # 225

# Demonstrating arbitrary-precision integers (no overflow)
large_int = 2 ** 64
print(f"2^64 calculated precisely: {large_int}")`,
                  code_language: 'python',
                  code_explanation: 'Notice how true division automatically promotes the return value to a float, while floor division returns the truncated integer floor.',
                  expected_output: `True Division (a / b): 3.75
Floor Division (a // b): 3
Modulo (a % b): 3
Exponentiation (a ** 2): 225
2^64 calculated precisely: 18446744073709551616`,
                  guided_exercise: {
                    prompt: 'Compute the quotient and remainder of dividing 29 by 6 using floor division and modulo.',
                    starter_code: `dividend = 29
divisor = 6

quotient = dividend // divisor
remainder = dividend % divisor

print(f"Quotient: {quotient}, Remainder: {remainder}")`,
                    expected_output: 'Quotient: 4, Remainder: 5'
                  },
                  quiz: {
                    id: 'quiz-numbers-math',
                    slug: 'quiz-numbers-math',
                    title: 'Numeric Operators Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-num-1',
                        question_text: 'What is the return type of `10 / 2` in Python 3?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'int (value 5)' },
                          { id: 'opt_2', text: 'float (value 5.0)' },
                          { id: 'opt_3', text: 'decimal' },
                          { id: 'opt_4', text: 'rational' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'The true division operator `/` always produces a float in Python 3, even when the division is exact.'
                      }
                    ]
                  },
                  key_takeaways: [
                    '`/` always produces a float in Python 3.',
                    '`//` truncates towards negative infinity.',
                    'Integers automatically expand to arbitrary precision without 32-bit or 64-bit overflow.'
                  ],
                  revision_prompts: [
                    'What is the result of `-7 // 2` and why does it evaluate to -4 rather than -3?',
                    'How does Python prevent integer overflow errors compared to statically typed languages?'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-control',
          slug: 'control-flow',
          level_number: 1,
          title: 'Control Flow',
          description: 'Conditional decision branching, truthiness evaluation, while loops, and for loop sequence iteration.',
          estimated_hours: 4,
          sort_order: 2,
          is_published: true,
          topics: [
            {
              id: 'top-conditionals',
              slug: 'conditionals',
              title: 'Conditional Branching',
              summary: 'Using if, elif, and else statements, boolean logic, and guard clause patterns.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-if-elif-else',
                  slug: 'if-elif-else',
                  title: 'if, elif, and else Branching Decisions',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Master multi-way conditional branching, comparison chaining, and short-circuit boolean logic.',
                  learning_objectives: [
                    'Structure multi-case branching with if, elif, and else',
                    'Use chained comparisons (e.g., 0 <= score <= 100)',
                    'Leverage short-circuit evaluation with and / or operators'
                  ],
                  content_markdown: `### Conditional Execution

Decision making in Python relies on \`if\`, \`elif\` (short for *else if*), and \`else\` keywords. Python evaluates conditions sequentially from top to bottom; the first block whose expression evaluates to true executes, and all remaining branches are skipped.

### Comparison Chaining

Python supports natural mathematical comparison chaining:
\`\`\`python
if 18 <= age < 65:
    print("Working age adult")
\`\`\`
This expression is equivalent to \`18 <= age and age < 65\`, but evaluates \`age\` only once.

### Short-Circuit Evaluation

- **\`and\`**: Evaluates the right operand only if the left operand is truthy.
- **\`or\`**: Evaluates the right operand only if the left operand is falsy.

### Guard Clause Pattern
Rather than deeply nesting \`if\` statements, write guard clauses that exit or return early when preconditions fail:
\`\`\`python
def process_user(user):
    if not user.is_active:
        return "User inactive"
    if not user.has_permission:
        return "Access denied"
    return "Processed"
\`\`\``,
                  code_snippet: `# Multi-way branching with comparison chaining
def evaluate_grade(score):
    if not (0 <= score <= 100):
        return "Invalid score"
    elif score >= 90:
        return "Grade A"
    elif score >= 80:
        return "Grade B"
    elif score >= 70:
        return "Grade C"
    else:
        return "Needs Revision"

print(evaluate_grade(95))
print(evaluate_grade(82))
print(evaluate_grade(64))
print(evaluate_grade(105))`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates chained range validation (`0 <= score <= 100`) and structured `elif` decision ladders.',
                  expected_output: `Grade A
Grade B
Needs Revision
Invalid score`,
                  guided_exercise: {
                    prompt: 'Write a function `is_even_and_positive(n)` that returns True only if n is both greater than 0 and divisible by 2.',
                    starter_code: `def is_even_and_positive(n):
    # Return True if n > 0 and n % 2 == 0
    return n > 0 and n % 2 == 0

print(is_even_and_positive(4))
print(is_even_and_positive(-2))
print(is_even_and_positive(7))`,
                    expected_output: `True\nFalse\nFalse`
                  },
                  quiz: {
                    id: 'quiz-if-elif-else',
                    slug: 'quiz-if-elif-else',
                    title: 'Conditionals & Short-Circuit Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-cond-1',
                        question_text: 'In the expression `a and b`, when is `b` evaluated?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'Always, regardless of `a`.' },
                          { id: 'opt_2', text: 'Only if `a` evaluates to truthy.' },
                          { id: 'opt_3', text: 'Only if `a` evaluates to falsy.' },
                          { id: 'opt_4', text: 'Never; Python evaluates `and` in parallel.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Because of short-circuit evaluation, `a and b` only checks `b` if `a` is truthy. If `a` is falsy, the result is already determined.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Python conditions evaluate sequentially; the first matching branch wins.',
                    'Chained comparisons like `0 <= x <= 100` are idiomatic and efficient.',
                    'Guard clauses prevent deep indentation nesting.'
                  ],
                  revision_prompts: [
                    'How does short-circuit evaluation help prevent Null/None pointer errors in condition checks?',
                    'Convert a nested 3-level if statement into guard clauses.'
                  ]
                }
              ]
            },
            {
              id: 'top-loops',
              slug: 'iteration-and-loops',
              title: 'Iteration & Loops',
              summary: 'While loops, for loops with range(), enumerate(), and loop control statements.',
              sort_order: 2,
              lessons: [
                {
                  id: 'les-while-loops',
                  slug: 'while-loops',
                  title: 'While Loops & Loop Invariants',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Build conditional repetition using while loops, loop invariants, and termination conditions.',
                  learning_objectives: [
                    'Construct reliable termination conditions in while loops',
                    'Use break and continue statements effectively',
                    'Understand while-else loop semantics'
                  ],
                  content_markdown: `### The While Loop Structure

A \`while\` loop repeatedly executes its block as long as its condition expression remains truthy:
\`\`\`python
while condition:
    # loop body
\`\`\`

### Preventing Infinite Loops
Every while loop must ensure that its body advances state toward the loop termination condition. If the condition never becomes falsy, the program enters an infinite loop.

### Loop Control: Break and Continue
- **\`break\`**: Immediately terminates the innermost loop.
- **\`continue\`**: Skips the remainder of the current iteration and re-evaluates the condition.

### The while-else Clause
Python supports an \`else\` block on loops. The \`else\` branch executes **only if the loop terminates normally (without encountering a \`break\`)**. This is frequently used for search algorithms.`,
                  code_snippet: `# While loop with break and else search pattern
def find_factor(target):
    candidate = 2
    while candidate < target:
        if target % candidate == 0:
            print(f"Found factor: {candidate}")
            break
        candidate += 1
    else:
        print(f"{target} is a prime number!")

find_factor(15)
find_factor(13)`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates loop progression, early termination with break, and the while-else branch executing when no factor is found.',
                  expected_output: `Found factor: 2
Found factor: 3
13 is a prime number!`,
                  guided_exercise: {
                    prompt: 'Write a while loop that calculates the sum of integers from 1 to 5 inclusive.',
                    starter_code: `total = 0
count = 1
while count <= 5:
    total += count
    count += 1
print(f"Total: {total}")`,
                    expected_output: 'Total: 15'
                  },
                  quiz: {
                    id: 'quiz-while-loops',
                    slug: 'quiz-while-loops',
                    title: 'While Loops Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-while-1',
                        question_text: 'When does the `else` clause of a while loop execute?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'Whenever a `break` statement is hit.' },
                          { id: 'opt_2', text: 'Only when the loop condition becomes false without encountering a `break`.' },
                          { id: 'opt_3', text: 'After every iteration of the loop.' },
                          { id: 'opt_4', text: 'Only if an exception is raised inside the loop.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'In Python, loop `else` blocks run only if the loop terminates naturally, not when exited prematurely via `break`.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Ensure loop state advances toward termination on every cycle.',
                    'Use `break` to exit early and `continue` to jump to next cycle.',
                    '`while-else` executes only when the loop terminates without `break`.'
                  ],
                  revision_prompts: [
                    'What makes a loop invariant crucial for verifying loop termination?',
                    'Explain an idiomatic use-case for a loop else clause in search logic.'
                  ]
                },
                {
                  id: 'les-for-loops',
                  slug: 'for-loops',
                  title: 'For Loops, range(), and enumerate()',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Master sequence iteration with Python for loops, range arithmetic, and index tracking via enumerate.',
                  learning_objectives: [
                    'Iterate directly over sequence elements without index-based loops',
                    'Use range(start, stop, step) generator parameters',
                    'Track indices idiomatically with enumerate()'
                  ],
                  content_markdown: `### Sequence Iteration

Unlike C-style \`for (int i=0; i<n; i++)\` loops, Python \`for\` loops are **collection iterators**. They iterate directly over iterable objects (lists, strings, tuples, dictionaries):

\`\`\`python
for item in collection:
    process(item)
\`\`\`

### The \`range()\` Function
To produce a sequence of arithmetic numbers without allocating a full list in memory:
- \`range(stop)\`: From 0 up to stop (exclusive).
- \`range(start, stop)\`: From start up to stop.
- \`range(start, stop, step)\`: Custom increment or decrement.

### Idiomatic Indexing: \`enumerate()\`
Never write \`for i in range(len(items)):\`! Use \`enumerate(items)\` to unpack both index and value simultaneously.`,
                  code_snippet: `# Iterating with range and enumerate
languages = ["Python", "Go", "Rust"]

# Using enumerate for index-value pairs
for index, lang in enumerate(languages, start=1):
    print(f"Rank {index}: {lang}")

# Range with step
print("Stepped range:")
for num in range(10, 0, -3):
    print(num, end=" ")
print()`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates `enumerate(..., start=1)` and stepped descending `range()` arithmetic.',
                  expected_output: `Rank 1: Python
Rank 2: Go
Rank 3: Rust
Stepped range:
10 7 4 1 `,
                  guided_exercise: {
                    prompt: 'Iterate over numbers from 2 to 10 in steps of 2 and print their squares.',
                    starter_code: `for n in range(2, 11, 2):
    print(f"{n}^2 = {n ** 2}")`,
                    expected_output: `2^2 = 4\n4^2 = 16\n6^2 = 36\n8^2 = 64\n10^2 = 100`
                  },
                  quiz: {
                    id: 'quiz-for-loops',
                    slug: 'quiz-for-loops',
                    title: 'For Loops & Iteration Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-for-1',
                        question_text: 'What is the most idiomatic way to loop through a list while tracking indices?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: '`for i in range(len(my_list)):`' },
                          { id: 'opt_2', text: '`for index, value in enumerate(my_list):`' },
                          { id: 'opt_3', text: 'Using a manual counter variable with `while`.' },
                          { id: 'opt_4', text: '`for item in my_list.indexes():`' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: '`enumerate()` yields (index, element) tuples and is the official Pythonic pattern for indexing.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Python `for` loops iterate directly over items rather than indices.',
                    '`range()` generates arithmetic sequences lazily in O(1) memory.',
                    'Use `enumerate(collection)` to access index and element cleanly.'
                  ],
                  revision_prompts: [
                    'Why does `range(0, 1000000)` take negligible memory in Python 3?',
                    'Explain the difference between `zip()` and `enumerate()`.'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-functions',
          slug: 'functions',
          level_number: 1,
          title: 'Functions & Scope',
          description: 'Function parameters, returns, scope resolution (LEGB rule), and variable-length arguments.',
          estimated_hours: 4,
          sort_order: 3,
          is_published: true,
          topics: [
            {
              id: 'top-func-basics',
              slug: 'function-parameters-and-scope',
              title: 'Function Design & Scope',
              summary: 'Defining pure functions, parameters, return values, and namespace resolution rules.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-func-basics',
                  slug: 'function-parameters-returns',
                  title: 'Function Parameters, Defaults & Return Values',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Design modular functions with positional parameters, default arguments, and return types.',
                  learning_objectives: [
                    'Define functions with def and explicit return statements',
                    'Avoid the classic mutable default argument trap',
                    'Use positional vs. keyword arguments'
                  ],
                  content_markdown: `### Defining Functions

Functions are defined using the \`def\` keyword:
\`\`\`python
def calculate_area(width, height=10):
    return width * height
\`\`\`

### The Mutable Default Argument Pitfall
**Never use mutable objects (lists, dictionaries, sets) as default parameter values!**
Default argument expressions are evaluated **once at function definition time**, not each time the function is called.
\`\`\`python
# DANGEROUS: list is shared across all function calls!
def add_item(item, target_list=[]):
    target_list.append(item)
    return target_list

# IDIOMATIC SOLUTION:
def add_item(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list
\`\`\``,
                  code_snippet: `# Idiomatic function design with None default guard
def append_log(entry, history=None):
    if history is None:
        history = []
    history.append(entry)
    return history

log1 = append_log("First request")
log2 = append_log("Second request")

print(f"Log 1: {log1}")
print(f"Log 2: {log2}")
print(f"Are logs isolated? {log1 is not log2}")`,
                  code_language: 'python',
                  code_explanation: 'Using `history=None` ensures a new list instance is allocated on each call rather than reusing a shared pointer.',
                  expected_output: `Log 1: ['First request']
Log 2: ['Second request']
Are logs isolated? True`,
                  guided_exercise: {
                    prompt: 'Write a function `clamp(val, min_val=0, max_val=100)` that restricts `val` to the range [min_val, max_val].',
                    starter_code: `def clamp(val, min_val=0, max_val=100):
    if val < min_val:
        return min_val
    elif val > max_val:
        return max_val
    return val

print(clamp(150))
print(clamp(-10))
print(clamp(45))`,
                    expected_output: `100\n0\n45`
                  },
                  quiz: {
                    id: 'quiz-func-basics',
                    slug: 'quiz-func-basics',
                    title: 'Function Design Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-fn-1',
                        question_text: 'Why should you avoid `def append_item(x, items=[]):` in Python?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'Python syntax forbids brackets in parameter lists.' },
                          { id: 'opt_2', text: 'The default list is created once at definition and shared across all calls.' },
                          { id: 'opt_3', text: 'Empty lists always evaluate to False in math expressions.' },
                          { id: 'opt_4', text: 'It creates a memory leak in the garbage collector.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Default arguments are evaluated once when the function is defined. A mutable default like `[]` will retain modifications across calls.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Use `None` as the default for mutable parameters, then initialize inside the body.',
                    'Keyword arguments allow passing parameters by name regardless of order.',
                    'Functions without an explicit return statement implicitly return `None`.'
                  ],
                  revision_prompts: [
                    'Explain step-by-step why mutable defaults persist across calls in CPython.',
                    'How does Python handle positional-only vs keyword-only parameters?'
                  ]
                },
                {
                  id: 'les-func-scope',
                  slug: 'scope-and-legb',
                  title: 'Scope Resolution & The LEGB Rule',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Understand namespace lookups in Python using Local, Enclosing, Global, and Built-in scopes.',
                  learning_objectives: [
                    'Apply the LEGB scope lookup order',
                    'Differentiate global vs. nonlocal keywords',
                    'Avoid unintended global variable mutation'
                  ],
                  content_markdown: `### The LEGB Scope Resolution Rule

When Python encounters a variable name, it searches namespaces in a strict 4-level sequence:

1. **L - Local**: Names assigned inside the current function body.
2. **E - Enclosing**: Names in outer enclosing functions (closures).
3. **G - Global**: Names declared at the top level of the current module file.
4. **B - Built-in**: Pre-loaded Python names (\`len\`, \`range\`, \`ValueError\`, etc.).

\`\`\`
[ Local ] ──► [ Enclosing ] ──► [ Global ] ──► [ Built-in ] ──► NameError
\`\`\`

### The \`global\` and \`nonlocal\` Keywords
- To rebind a global variable inside a function, declare \`global var_name\`.
- To rebind a variable in an enclosing closure function, declare \`nonlocal var_name\`.`,
                  code_snippet: `# Demonstrating LEGB and closure state with nonlocal
def make_counter(start=0):
    count = start  # Enclosing scope variable
    
    def increment():
        nonlocal count
        count += 1
        return count
        
    return increment

counter = make_counter(10)
print(f"First call: {counter()}")
print(f"Second call: {counter()}")
print(f"Third call: {counter()}")`,
                  code_language: 'python',
                  code_explanation: 'The `nonlocal` keyword allows `increment()` to rebind `count` in the enclosing `make_counter` frame.',
                  expected_output: `First call: 11
Second call: 12
Third call: 13`,
                  guided_exercise: {
                    prompt: 'Create a closure `make_multiplier(factor)` that returns a function multiplying its input by factor.',
                    starter_code: `def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))
print(triple(5))`,
                    expected_output: `10\n15`
                  },
                  quiz: {
                    id: 'quiz-scope-legb',
                    slug: 'quiz-scope-legb',
                    title: 'LEGB Scope Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-scope-1',
                        question_text: 'What order does Python follow when resolving variable names?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'Global → Local → Built-in → Enclosing' },
                          { id: 'opt_2', text: 'Local → Enclosing → Global → Built-in' },
                          { id: 'opt_3', text: 'Built-in → Global → Local → Enclosing' },
                          { id: 'opt_4', text: 'Enclosing → Local → Global → Built-in' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Python resolves names using LEGB: Local, Enclosing (closures), Global (module), and Built-in.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'LEGB defines the hierarchy for variable name resolution.',
                    'Reading global variables works directly; modifying them requires `global`.',
                    'Closures use `nonlocal` to mutate enclosing scope variables.'
                  ],
                  revision_prompts: [
                    'What exception is raised if a variable is not found in any of the LEGB scopes?',
                    'Explain how shadow naming occurs when a local variable shares a name with a built-in function like `list`.'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-structures',
          slug: 'basic-data-structures',
          level_number: 1,
          title: 'Basic Data Structures',
          description: 'Lists, tuples, dictionaries, sets, comprehensions, and memory performance.',
          estimated_hours: 5,
          sort_order: 4,
          is_published: true,
          topics: [
            {
              id: 'top-sequences',
              slug: 'lists-and-tuples',
              title: 'Lists & Tuples',
              summary: 'Dynamic arrays, slicing, comprehensions, and immutable tuple unpacking.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-lists-mutability',
                  slug: 'lists-and-comprehensions',
                  title: 'Lists, Slicing & List Comprehensions',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Master list operations, negative indexing, slicing copies, and idiomatic comprehensions.',
                  learning_objectives: [
                    'Understand list dynamic array allocation and O(1) indexed lookups',
                    'Use slicing [start:stop:step] syntax',
                    'Write readable, high-performance list comprehensions'
                  ],
                  content_markdown: `### Lists: Dynamic Arrays in Python

In CPython, a \`list\` is implemented as a **contiguous dynamic array of pointers**. This provides:
- **O(1)** indexed access (\`items[i]\`) and append (\`items.append(x)\`).
- **O(n)** insertion or deletion at the beginning or middle (\`items.insert(0, x)\`).

### Slicing Syntax: \`[start:stop:step]\`
- Omitted start defaults to \`0\`.
- Omitted stop defaults to \`len(items)\`.
- Negative step reverses direction (\`items[::-1]\`).

### List Comprehensions
Transform and filter sequences concisely:
\`\`\`python
[expression for item in iterable if condition]
\`\`\``,
                  code_snippet: `# List operations, slicing, and comprehensions
numbers = [10, 20, 30, 40, 50]

print(f"Last item: {numbers[-1]}")
print(f"Slice [1:4]: {numbers[1:4]}")
print(f"Reversed: {numbers[::-1]}")

# Filter even numbers and square them
squares = [x ** 2 for x in numbers if x % 20 == 0]
print(f"Even multiple squares: {squares}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates negative indexing, slicing, and list comprehension filtering.',
                  expected_output: `Last item: 50
Slice [1:4]: [20, 30, 40]
Reversed: [50, 40, 30, 20, 10]
Even multiple squares: [400, 1600]`,
                  guided_exercise: {
                    prompt: 'Use a list comprehension to extract all words with more than 3 letters from `words = ["cat", "elephant", "dog", "tiger"]`.',
                    starter_code: `words = ["cat", "elephant", "dog", "tiger"]
long_words = [w for w in words if len(w) > 3]
print(long_words)`,
                    expected_output: "['elephant', 'tiger']"
                  },
                  quiz: {
                    id: 'quiz-lists-comprehensions',
                    slug: 'quiz-lists-comprehensions',
                    title: 'Lists & Comprehensions Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-list-1',
                        question_text: 'What does the slice `arr[::-1]` return?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'The last element of the list.' },
                          { id: 'opt_2', text: 'A new list containing all elements in reverse order.' },
                          { id: 'opt_3', text: 'An empty list.' },
                          { id: 'opt_4', text: 'A reversed iterator without copying.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'A step of `-1` with default start and stop creates a reversed shallow copy of the list.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Lists are mutable dynamic arrays with O(1) indexed lookups.',
                    'Negative indices count backwards from the end (`-1` is the last item).',
                    'Slicing produces a new shallow copy of the requested slice range.'
                  ],
                  revision_prompts: [
                    'Why is inserting at index 0 in a list an O(n) operation?',
                    'Explain the difference between shallow copy (`list.copy()`) and deep copy (`copy.deepcopy()`).'
                  ]
                },
                {
                  id: 'les-tuples-unpacking',
                  slug: 'tuples-and-immutability',
                  title: 'Tuples, Immutability & Structural Unpacking',
                  lesson_type: 'reading',
                  estimated_minutes: 8,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Discover tuples as immutable records, hashable keys, and structural unpacking with the asterisk operator.',
                  learning_objectives: [
                    'Understand tuple immutability and memory efficiency',
                    'Use tuple unpacking (e.g., a, b = b, a)',
                    'Use the star operator * for extended unpacking'
                  ],
                  content_markdown: `### Tuples: Immutable Heterogeneous Records

A \`tuple\` is an immutable sequence of Python objects. Once created, its length and elements cannot be modified:
\`\`\`python
point = (10, 20)
\`\`\`

### Why Use Tuples Instead of Lists?
1. **Immutability Protection**: Guarantees that values cannot be mutated accidentally by downstream functions.
2. **Hashable**: Unlike lists, tuples containing immutable items can be used as dictionary keys or set members.
3. **Memory Optimization**: Tuples have less memory overhead than lists because their size is fixed.

### Extended Tuple Unpacking
\`\`\`python
first, *middle, last = [1, 2, 3, 4, 5]
# first = 1, middle = [2, 3, 4], last = 5
\`\`\``,
                  code_snippet: `# Tuple unpacking and swapping
a = 10
b = 20

# Idiomatic in-place swap without temporary variable
a, b = b, a
print(f"Swapped: a={a}, b={b}")

# Extended unpacking with asterisk
scores = [98, 85, 92, 78, 90]
top, *others, bottom = sorted(scores, reverse=True)
print(f"Top: {top}, Middle count: {len(others)}, Lowest: {bottom}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates Python tuple unpacking for variable swapping and extended unpacking.',
                  expected_output: `Swapped: a=20, b=10
Top: 98, Middle count: 3, Lowest: 78`,
                  guided_exercise: {
                    prompt: 'Unpack the 3D coordinate `coord = (100, 250, 50)` into `x`, `y`, `z` and print their sum.',
                    starter_code: `coord = (100, 250, 50)
x, y, z = coord
print(f"Sum: {x + y + z}")`,
                    expected_output: 'Sum: 400'
                  },
                  quiz: {
                    id: 'quiz-tuples-unpacking',
                    slug: 'quiz-tuples-unpacking',
                    title: 'Tuples Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-tup-1',
                        question_text: 'Which of the following can be used as a key in a Python dictionary?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'A list: `[1, 2]`' },
                          { id: 'opt_2', text: 'A tuple of integers: `(1, 2)`' },
                          { id: 'opt_3', text: 'A set: `{1, 2}`' },
                          { id: 'opt_4', text: 'A dictionary: `{"a": 1}`' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Dictionary keys must be hashable. Tuples containing immutable items are hashable, whereas lists, sets, and dicts are mutable and unhashable.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Tuples are immutable; their length and item references cannot change.',
                    'Tuples can be used as dictionary keys if all their elements are hashable.',
                    'Extended unpacking (`*rest`) provides clean sequence destructuring.'
                  ],
                  revision_prompts: [
                    'Can a tuple containing a list be used as a dictionary key? Why or why not?',
                    'How does Python execute `a, b = b, a` atomically without data loss?'
                  ]
                }
              ]
            },
            {
              id: 'top-hashmaps',
              slug: 'dicts-and-sets',
              title: 'Dictionaries & Sets',
              summary: 'Hash tables, O(1) average lookup performance, dict methods, and set uniqueness operations.',
              sort_order: 2,
              lessons: [
                {
                  id: 'les-dicts-lookups',
                  slug: 'dictionaries-and-hashmaps',
                  title: 'Dictionaries, Hash Maps & Safe Lookups',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Understand dictionary hash table mechanics, collision resolution, safe .get() queries, and dict comprehensions.',
                  learning_objectives: [
                    'Understand hash table lookups and O(1) average time complexity',
                    'Use dict.get(key, default) to prevent KeyError',
                    'Construct dictionary comprehensions'
                  ],
                  content_markdown: `### Dictionaries: Hash Tables in Python

A \`dict\` is an associative array mapping unique hashable keys to values.
Under the hood, CPython uses an open-addressing hash table that preserves insertion order (standardized in Python 3.7+).

- **Average Lookup, Insert, Delete**: **O(1)**
- **Worst Case**: O(n) (hash collisions)

### Safe Lookups with \`.get()\`
Direct indexing (\`d["missing"]\`) raises a \`KeyError\` if the key is absent. Use \`.get(key, default)\` to handle missing keys gracefully without \`try/except\`.

### Dictionary Comprehensions
\`\`\`python
{key_expr: val_expr for item in iterable if condition}
\`\`\``,
                  code_snippet: `# Dictionary operations and safe get lookups
user_roles = {"alice": "admin", "bob": "developer"}

# Safe retrieval with fallback default
role_alice = user_roles.get("alice", "guest")
role_charlie = user_roles.get("charlie", "guest")

print(f"Alice: {role_alice}")
print(f"Charlie: {role_charlie}")

# Dictionary comprehension: invert mapping
inverted = {role: user for user, role in user_roles.items()}
print(f"Inverted mapping: {inverted}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates `get()` with fallback defaults and dictionary comprehension comprehension inversion.',
                  expected_output: `Alice: admin
Charlie: guest
Inverted mapping: {'admin': 'alice', 'developer': 'bob'}`,
                  guided_exercise: {
                    prompt: 'Create a dictionary comprehension mapping numbers 1 through 4 to their cubes.',
                    starter_code: `cubes = {x: x ** 3 for x in range(1, 5)}
print(cubes)`,
                    expected_output: '{1: 1, 2: 8, 3: 27, 4: 64}'
                  },
                  quiz: {
                    id: 'quiz-dicts-lookups',
                    slug: 'quiz-dicts-lookups',
                    title: 'Dictionaries Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-dict-1',
                        question_text: 'What happens when you access `my_dict["missing_key"]` directly in Python?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'It returns None.' },
                          { id: 'opt_2', text: 'It raises a KeyError.' },
                          { id: 'opt_3', text: 'It automatically creates the key with value 0.' },
                          { id: 'opt_4', text: 'It returns an empty string.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Direct bracket indexing on a nonexistent key raises KeyError. To return None or a default value, use `dict.get(key)`.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Dictionaries offer O(1) average time complexity for lookups and insertions.',
                    'Always use `.get(key, default)` when a key might not be present.',
                    'Since Python 3.7, dictionaries maintain insertion order.'
                  ],
                  revision_prompts: [
                    'How does Python resolve hash collisions in its open-addressing hash table?',
                    'Why cannot a list be used as a dictionary key?'
                  ]
                },
                {
                  id: 'les-sets-dedup',
                  slug: 'sets-and-set-theory',
                  title: 'Sets, Deduplication & Mathematical Set Operations',
                  lesson_type: 'reading',
                  estimated_minutes: 8,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Leverage sets for deduplication, O(1) membership testing, and union/intersection/difference operations.',
                  learning_objectives: [
                    'Deduplicate collections using set()',
                    'Perform union (|), intersection (&), and difference (-) operations',
                    'Understand set membership performance compared to lists'
                  ],
                  content_markdown: `### Sets: Unordered Collections of Unique Elements

A \`set\` is an unordered collection of distinct hashable items. Under the hood, a set is essentially a dictionary hash table containing only keys without values.

### Membership Testing: O(1) vs O(n)
Testing membership (\`item in collection\`):
- In a \`list\`: **O(n)** (linear scan from start to finish).
- In a \`set\`: **O(1)** (hash lookup).
For large collections (e.g., 100,000 items), testing membership with a set is thousands of times faster!

### Mathematical Set Operators
- **Union (\`|\`)**: Elements in either set (\`a | b\`).
- **Intersection (\`&\`)**: Elements common to both sets (\`a & b\`).
- **Difference (\`-\`)**: Elements in \`a\` but not in \`b\` (\`a - b\`).`,
                  code_snippet: `# Set deduplication and set theory operations
cohort_a = {"alice", "bob", "charlie"}
cohort_b = {"bob", "david", "edward"}

# Set operations
common_students = cohort_a & cohort_b   # Intersection
all_students = cohort_a | cohort_b      # Union
only_in_a = cohort_a - cohort_b         # Difference

print(f"Common: {sorted(list(common_students))}")
print(f"All students: {len(all_students)} total")
print(f"Only in A: {sorted(list(only_in_a))}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates intersection (&), union (|), and difference (-) on sets.',
                  expected_output: `Common: ['bob']
All students: 5 total
Only in A: ['alice', 'charlie']`,
                  guided_exercise: {
                    prompt: 'Deduplicate `raw = [1, 2, 2, 3, 4, 4, 5]` using a set, and print the sorted unique list.',
                    starter_code: `raw = [1, 2, 2, 3, 4, 4, 5]
unique_items = sorted(list(set(raw)))
print(unique_items)`,
                    expected_output: '[1, 2, 3, 4, 5]'
                  },
                  quiz: {
                    id: 'quiz-sets-dedup',
                    slug: 'quiz-sets-dedup',
                    title: 'Sets Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-set-1',
                        question_text: 'What is the average time complexity of `item in my_set`?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'O(n)' },
                          { id: 'opt_2', text: 'O(1)' },
                          { id: 'opt_3', text: 'O(log n)' },
                          { id: 'opt_4', text: 'O(n^2)' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'Sets are implemented as hash tables; membership tests take O(1) average time compared to O(n) for lists.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Sets store unique elements and discard duplicates automatically.',
                    'Membership checks (`x in s`) run in O(1) average time.',
                    'Use `&`, `|`, and `-` for mathematical set operations.'
                  ],
                  revision_prompts: [
                    'Why can sets only store hashable items?',
                    'When would you choose a frozenset over a regular set?'
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      level_number: 2,
      level_title: 'Foundation',
      badge: 'Level 2',
      description: 'Object-oriented programming, packages, exception handling, and automated unit testing.',
      modules: [
        {
          id: 'mod-py-oop',
          slug: 'object-oriented-programming',
          level_number: 2,
          title: 'Object-Oriented Programming',
          description: 'Classes, instance methods, encapsulation, inheritance, and super().',
          estimated_hours: 5,
          sort_order: 1,
          is_published: true,
          topics: [
            {
              id: 'top-classes-objects',
              slug: 'classes-and-objects',
              title: 'Classes, Instances & Encapsulation',
              summary: 'Class blueprints, __init__ constructor, self parameter, and property decorators.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-classes-intro',
                  slug: 'classes-and-instances',
                  title: 'Class Blueprints, __init__, and The self Parameter',
                  lesson_type: 'reading',
                  estimated_minutes: 12,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Understand the class blueprint, object instantiation, __init__ constructor, and how self binds instance state.',
                  learning_objectives: [
                    'Define classes and instantiate concrete objects',
                    'Understand how the `self` parameter passes the instance pointer',
                    'Differentiate instance variables from class-level variables'
                  ],
                  content_markdown: `### What is a Class in Python?

A class is a blueprint for creating objects. An object encapsulates **state** (attributes) and **behavior** (methods) in a unified structure:

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner          # Instance variable
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance
\`\`\`

### The \`self\` Parameter
When you call \`account.deposit(50)\`, CPython translates this call behind the scenes to:
\`\`\`python
BankAccount.deposit(account, 50)
\`\`\`
The \`self\` parameter explicitly receives the reference to the instance on which the method was invoked.

### Instance vs. Class Attributes
- **Instance attributes** (\`self.x = 10\`): Unique to each instance.
- **Class attributes** (\`x = 10\` at class level): Shared across all instances of the class.`,
                  code_snippet: `# Object-oriented class blueprint with methods
class Developer:
    # Class attribute (shared)
    species = "Homo sapiens"

    def __init__(self, name, primary_lang):
        # Instance attributes (unique)
        self.name = name
        self.primary_lang = primary_lang
        self.projects_completed = 0

    def complete_project(self, project_name):
        self.projects_completed += 1
        return f"{self.name} shipped '{project_name}' in {self.primary_lang}!"

dev = Developer("Sarah", "Python")
print(dev.complete_project("Billing Engine"))
print(f"Total projects: {dev.projects_completed}")`,
                  code_language: 'python',
                  code_explanation: 'Shows `__init__` initialization, instance method invocation modifying `self.projects_completed`, and instance attribute access.',
                  expected_output: `Sarah shipped 'Billing Engine' in Python!
Total projects: 1`,
                  guided_exercise: {
                    prompt: 'Create a class `Rectangle` with `width` and `height` attributes and an `area()` method returning width * height.',
                    starter_code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

rect = Rectangle(10, 5)
print(f"Area: {rect.area()}")`,
                    expected_output: 'Area: 50'
                  },
                  quiz: {
                    id: 'quiz-classes-intro',
                    slug: 'quiz-classes-intro',
                    title: 'Classes & Objects Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-oop-1',
                        question_text: 'What does the `self` parameter represent in an instance method?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'A pointer to the parent superclass.' },
                          { id: 'opt_2', text: 'A reference to the specific object instance invoking the method.' },
                          { id: 'opt_3', text: 'A global dictionary storing all class methods.' },
                          { id: 'opt_4', text: 'The CPython interpreter process.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: '`self` represents the instance itself, allowing methods to read and modify that specific object\'s state.'
                      }
                    ]
                  },
                  key_takeaways: [
                    '`__init__` initializes newly created object instances.',
                    '`self` explicitly passes the instance pointer to methods.',
                    'Instance attributes belong to individual objects; class attributes are shared.'
                  ],
                  revision_prompts: [
                    'How does Python differentiate calling `obj.method()` from `Class.method(obj)`?',
                    'What occurs if you mutate a shared mutable class attribute from one instance?'
                  ]
                },
                {
                  id: 'les-inheritance-super',
                  slug: 'inheritance-and-super',
                  title: 'Inheritance, Method Overriding & super()',
                  lesson_type: 'reading',
                  estimated_minutes: 12,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 2,
                  summary: 'Build hierarchical object models, override subclass methods, and reuse base class logic with super().',
                  learning_objectives: [
                    'Subclass parent classes with class Child(Parent) syntax',
                    'Override methods while preserving base logic using super()',
                    'Understand Method Resolution Order (MRO)'
                  ],
                  content_markdown: `### Inheritance: Code Reuse & Specialization

Inheritance allows a subclass to inherit attributes and methods from a base class:
\`\`\`python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

class Manager(Employee):
    def __init__(self, name, salary, department):
        # Call parent constructor
        super().__init__(name, salary)
        self.department = department
\`\`\`

### Calling Base Logic with \`super()\`
\`super()\` dynamically resolves the next class in the Method Resolution Order (MRO). It guarantees that base class initialization logic runs properly without hardcoding the parent class name.

### Checking Types with \`isinstance()\`
Always use \`isinstance(obj, ClassName)\` rather than \`type(obj) == ClassName\` so subclasses are accepted polymorphically.`,
                  code_snippet: `# Inheritance, method overriding, and super()
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

    def describe(self):
        return f"{self.brand} vehicle"

class ElectricCar(Vehicle):
    def __init__(self, brand, battery_kwh):
        super().__init__(brand)
        self.battery_kwh = battery_kwh

    def describe(self):
        # Extend base class description
        base_desc = super().describe()
        return f"{base_desc} with {self.battery_kwh}kWh battery"

car = ElectricCar("Tesla", 75)
print(car.describe())
print(f"Is car a Vehicle? {isinstance(car, Vehicle)}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates `super().__init__()` and calling `super().describe()` to extend base functionality cleanly.',
                  expected_output: `Tesla vehicle with 75kWh battery
Is car a Vehicle? True`,
                  guided_exercise: {
                    prompt: 'Create a base class `Shape` with a method `name()`. Subclass `Circle` that calls `super().name()` and appends " (circular)".',
                    starter_code: `class Shape:
    def name(self):
        return "Generic Shape"

class Circle(Shape):
    def name(self):
        return super().name() + " (circular)"

c = Circle()
print(c.name())`,
                    expected_output: 'Generic Shape (circular)'
                  },
                  quiz: {
                    id: 'quiz-inheritance-super',
                    slug: 'quiz-inheritance-super',
                    title: 'Inheritance & super() Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-inh-1',
                        question_text: 'Why is `isinstance(x, BaseClass)` preferred over `type(x) is BaseClass`?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: '`isinstance` is faster because it does not allocate memory.' },
                          { id: 'opt_2', text: '`isinstance` correctly returns True for subclasses of BaseClass (polymorphism).' },
                          { id: 'opt_3', text: '`type()` is deprecated in Python 3.' },
                          { id: 'opt_4', text: '`isinstance` converts the object to a string before comparison.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: '`isinstance` respects the inheritance hierarchy and returns True for any instance of a subclass, enabling polymorphism.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Subclasses inherit attributes and methods from base classes.',
                    '`super()` delegates method calls along the Method Resolution Order (MRO).',
                    'Use `isinstance()` to check types polymorphically.'
                  ],
                  revision_prompts: [
                    'What is Method Resolution Order (MRO) and how can you inspect it using `Class.__mro__`?',
                    'Explain the difference between composition ("has-a") and inheritance ("is-a").'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-modules',
          slug: 'modules-and-packages',
          level_number: 2,
          title: 'Modules and Packages',
          description: 'Organizing code into modules, the import system, sys.path, and standard library essentials.',
          estimated_hours: 4,
          sort_order: 2,
          is_published: true,
          topics: [
            {
              id: 'top-imports-packages',
              slug: 'imports-and-namespaces',
              title: 'Imports & Modular Architecture',
              summary: 'Module creation, sys.path, the import cache, and __name__ == "__main__".',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-modules-overview',
                  slug: 'importing-modules',
                  title: 'Module Creation & The Import System',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Learn how Python locates, executes, and caches imported modules using sys.modules and sys.path.',
                  learning_objectives: [
                    'Understand how Python searches for modules along sys.path',
                    'Inspect sys.modules caching and prevent duplicate execution',
                    'Master the if __name__ == "__main__": script entrypoint guard'
                  ],
                  content_markdown: `### What is a Python Module?

Any Python file (\`.py\`) is automatically a module. When you execute \`import math\`:
1. Python checks the **\`sys.modules\` cache** to see if \`math\` has already been loaded. If present, it returns the cached module object immediately.
2. If not cached, Python searches directories listed in **\`sys.path\`** (starting with the current working directory).
3. It compiles the source to bytecode, executes the module top-to-bottom in its own namespace, and inserts it into \`sys.modules\`.

### The \`__name__ == '__main__'\` Guard
When a file is executed directly (e.g. \`python script.py\`), Python sets its special variable \`__name__\` to \`"__main__"\`.
When the same file is imported by another module (\`import script\`), \`__name__\` is set to the module's file name (\`"script"\`).
This allows a single file to serve as both an **importable library** and a **standalone executable script**.`,
                  code_snippet: `# Standard library imports and namespace inspection
import math
import sys

# Functions available under math module namespace
radius = 5.0
circumference = 2 * math.pi * radius
area = math.pi * (radius ** 2)

print(f"Circumference: {circumference:.2f}")
print(f"Area: {area:.2f}")
print(f"Is 'math' cached in sys.modules? {'math' in sys.modules}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates importing a standard library module, using dot-notation namespacing, and verifying module caching.',
                  expected_output: `Circumference: 31.42
Area: 78.54
Is 'math' cached in sys.modules? True`,
                  guided_exercise: {
                    prompt: 'Import `math` and calculate the hypotenuse of a right triangle with sides 3 and 4 using `math.sqrt()`.',
                    starter_code: `import math

side_a = 3
side_b = 4
hypotenuse = math.sqrt(side_a**2 + side_b**2)
print(f"Hypotenuse: {hypotenuse}")`,
                    expected_output: 'Hypotenuse: 5.0'
                  },
                  quiz: {
                    id: 'quiz-importing-modules',
                    slug: 'quiz-importing-modules',
                    title: 'Imports & Modules Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-mod-1',
                        question_text: 'What is the value of `__name__` when a Python file is run directly from the command line?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: '`"__init__"`' },
                          { id: 'opt_2', text: '`"__main__"`' },
                          { id: 'opt_3', text: 'The filename without extension.' },
                          { id: 'opt_4', text: '`"root"`' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'CPython assigns the string `"__main__"` to the `__name__` variable of the entrypoint script executed directly.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Imported modules are executed once and cached in `sys.modules`.',
                    '`sys.path` defines the ordered search path for module resolution.',
                    '`if __name__ == "__main__":` isolates executable code from reusable library functions.'
                  ],
                  revision_prompts: [
                    'Why are circular imports problematic and how does module caching relate to them?',
                    'What is the purpose of an `__init__.py` file in Python packages?'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-exceptions',
          slug: 'files-and-exceptions',
          level_number: 2,
          title: 'Files and Exceptions',
          description: 'Robust error handling with try/except/finally, custom exceptions, and context managers.',
          estimated_hours: 5,
          sort_order: 3,
          is_published: true,
          topics: [
            {
              id: 'top-error-handling',
              slug: 'exception-handling',
              title: 'Exception Hierarchies & Context Managers',
              summary: 'Handling exceptions cleanly and managing resources reliably with context managers.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-try-except',
                  slug: 'try-except-patterns',
                  title: 'Try, Except, Else & Finally Blocks',
                  lesson_type: 'reading',
                  estimated_minutes: 10,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Handle runtime errors cleanly, catch specific exception classes, and guarantee cleanup with finally.',
                  learning_objectives: [
                    'Structure complete try/except/else/finally blocks',
                    'Catch specific exceptions without bare except: clauses',
                    'Guarantee resource cleanup using finally'
                  ],
                  content_markdown: `### The Complete Exception Block

Python provides four clauses for exception handling:
\`\`\`python
try:
    # Code that might raise an exception
    result = dangerous_operation()
except SpecificError as e:
    # Executes ONLY if SpecificError was raised
    handle_error(e)
else:
    # Executes ONLY if NO exception was raised in try
    commit_transaction(result)
finally:
    # ALWAYS executes, whether an error occurred or not
    cleanup_resources()
\`\`\`

### Never Catch Bare \`except:\`
Never write \`except:\` or \`except Exception:\` without good reason. A bare except catches system-exiting signals like \`KeyboardInterrupt\` and \`SystemExit\`, making your program impossible to stop from the terminal! Catch specific exceptions like \`ValueError\`, \`KeyError\`, or \`TypeError\`.`,
                  code_snippet: `# Structured exception handling with specific types and finally
def safe_divide(numerator, denominator):
    try:
        val = numerator / denominator
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None
    except TypeError as err:
        print(f"Error: Invalid operand type ({err})")
        return None
    else:
        print("Division successful.")
        return val
    finally:
        print("Execution of safe_divide completed.")

print(safe_divide(10, 2))
print("---")
print(safe_divide(10, 0))`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates catching specific exceptions (`ZeroDivisionError`, `TypeError`), using `else` on success, and guaranteeing `finally` execution.',
                  expected_output: `Division successful.
Execution of safe_divide completed.
5.0
---
Error: Cannot divide by zero!
Execution of safe_divide completed.
None`,
                  guided_exercise: {
                    prompt: 'Write a function `parse_int(text)` that returns the integer or None if a ValueError occurs.',
                    starter_code: `def parse_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(parse_int("42"))
print(parse_int("not_a_number"))`,
                    expected_output: `42\nNone`
                  },
                  quiz: {
                    id: 'quiz-try-except',
                    slug: 'quiz-try-except',
                    title: 'Exception Handling Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-exc-1',
                        question_text: 'When does the `else` block of a try statement execute?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'When an unhandled exception is caught.' },
                          { id: 'opt_2', text: 'Only when the try block completes successfully without raising any exceptions.' },
                          { id: 'opt_3', text: 'After the finally block completes.' },
                          { id: 'opt_4', text: 'Whenever a return statement is reached.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'The `else` clause in a try statement executes only when the `try` block ran to completion without encountering any exceptions.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Catch specific exceptions rather than using bare `except:`.',
                    'The `else` block separates normal continuation logic from guarded code.',
                    'The `finally` block is guaranteed to run for resource cleanup.'
                  ],
                  revision_prompts: [
                    'Why should you avoid silencing exceptions with `except Exception: pass`?',
                    'Explain the built-in Python Exception hierarchy (BaseException vs Exception).'
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 'mod-py-testing',
          slug: 'testing-fundamentals',
          level_number: 2,
          title: 'Testing Fundamentals',
          description: 'Writing automated unit tests with the standard library unittest module, assertions, and test isolation.',
          estimated_hours: 5,
          sort_order: 4,
          is_published: true,
          topics: [
            {
              id: 'top-unittest-basics',
              slug: 'unittest-basics',
              title: 'Unit Testing with unittest',
              summary: 'Structuring test cases, writing assertions, test discovery, and fixtures.',
              sort_order: 1,
              lessons: [
                {
                  id: 'les-writing-tests',
                  slug: 'writing-first-tests',
                  title: 'Writing Automated Unit Tests with unittest',
                  lesson_type: 'reading',
                  estimated_minutes: 12,
                  xp_reward: 25,
                  is_published: true,
                  sort_order: 1,
                  summary: 'Build test cases that verify function correctness automatically using Python\'s built-in unittest framework.',
                  learning_objectives: [
                    'Structure test classes inheriting from unittest.TestCase',
                    'Use self.assertEqual, self.assertTrue, and self.assertRaises',
                    'Understand how test runners discover and execute test methods'
                  ],
                  content_markdown: `### Why Automated Testing?

Automated tests provide a safety net that lets you refactor, add features, and fix bugs without breaking existing code. Python includes a production-grade testing framework directly in its standard library: **\`unittest\`**.

### Anatomy of a \`unittest.TestCase\`

1. Subclass \`unittest.TestCase\`.
2. Write test methods whose names start with **\`test_\`** (e.g. \`test_addition\`). Any method without this prefix is ignored by the test runner.
3. Use assertion methods to verify outcomes:
   - \`self.assertEqual(a, b)\`: Checks \`a == b\`.
   - \`self.assertTrue(x)\`: Checks \`bool(x) is True\`.
   - \`self.assertIn(item, list)\`: Checks \`item in list\`.
   - \`with self.assertRaises(ValueError):\`: Verifies an expected exception is raised.`,
                  code_snippet: `# Complete automated unit test suite using standard library unittest
import unittest

def format_name(first, last):
    if not first or not last:
        raise ValueError("First and last name required")
    return f"{first.strip().title()} {last.strip().title()}"

class TestFormatName(unittest.TestCase):
    def test_standard_name(self):
        result = format_name("ada", "lovelace")
        self.assertEqual(result, "Ada Lovelace")

    def test_whitespace_trimming(self):
        result = format_name("  alan  ", "  turing  ")
        self.assertEqual(result, "Alan Turing")

    def test_empty_input_raises_error(self):
        with self.assertRaises(ValueError):
            format_name("", "Hopper")

# Run tests in current module
suite = unittest.TestLoader().loadTestsFromTestCase(TestFormatName)
runner = unittest.TextTestRunner(verbosity=2)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}, Errors: {len(result.errors)}, Failures: {len(result.failures)}")`,
                  code_language: 'python',
                  code_explanation: 'Demonstrates a test class inheriting `unittest.TestCase`, test methods starting with `test_`, assertions, and `self.assertRaises`.',
                  expected_output: `test_empty_input_raises_error (__main__.TestFormatName.test_empty_input_raises_error) ... ok
test_standard_name (__main__.TestFormatName.test_standard_name) ... ok
test_whitespace_trimming (__main__.TestFormatName.test_whitespace_trimming) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.000s

OK
Tests run: 3, Errors: 0, Failures: 0`,
                  guided_exercise: {
                    prompt: 'Write a unit test verifying that `abs(-5)` equals 5 and `abs(5)` equals 5.',
                    starter_code: `import unittest

class TestAbsolute(unittest.TestCase):
    def test_abs_values(self):
        self.assertEqual(abs(-5), 5)
        self.assertEqual(abs(5), 5)

suite = unittest.TestLoader().loadTestsFromTestCase(TestAbsolute)
unittest.TextTestRunner(verbosity=1).run(suite)`,
                    expected_output: `Ran 1 test in 0.000s\n\nOK`
                  },
                  quiz: {
                    id: 'quiz-writing-tests',
                    slug: 'quiz-writing-tests',
                    title: 'Automated Unit Testing Check',
                    passing_score: 75,
                    xp_reward: 50,
                    questions: [
                      {
                        id: 'q-test-1',
                        question_text: 'What naming convention must a test method follow in a `unittest.TestCase` class?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: 'It must end with `_test`.' },
                          { id: 'opt_2', text: 'It must begin with the prefix `test_`.' },
                          { id: 'opt_3', text: 'It must be decorated with `@unit_test`.' },
                          { id: 'opt_4', text: 'It must be named `main()`.' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'The unittest TestLoader discovers test methods by scanning for methods whose names start with the `test_` prefix.'
                      },
                      {
                        id: 'q-test-2',
                        question_text: 'How do you verify that a function raises an expected exception in unittest?',
                        question_type: 'single_choice',
                        options: [
                          { id: 'opt_1', text: '`self.assertException(fn())`' },
                          { id: 'opt_2', text: '`with self.assertRaises(ExpectedException): fn()`' },
                          { id: 'opt_3', text: 'Wrapping in a bare try/except block.' },
                          { id: 'opt_4', text: '`self.expect_error(ExpectedException)`' }
                        ],
                        correct_option_ids: ['opt_2'],
                        explanation: 'The context manager `with self.assertRaises(ExceptionType):` is the standard way to verify that a block raises the intended exception.'
                      }
                    ]
                  },
                  key_takeaways: [
                    'Test methods must begin with the `test_` prefix to be discovered by runners.',
                    '`self.assertEqual`, `self.assertTrue`, and `self.assertRaises` verify behavior.',
                    'Automated tests ensure changes and refactors do not introduce regressions.'
                  ],
                  revision_prompts: [
                    'What is the purpose of `setUp()` and `tearDown()` methods in a test case?',
                    'Explain the difference between a unit test, an integration test, and an end-to-end test.'
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    LEVEL_3_DEFINITION,
    LEVEL_4_DEFINITION,
    LEVEL_5_DEFINITION
  ]
};


// Available learning paths registry
export const ALL_LEARNING_PATHS = [
  PYTHON_PATH
];
