/**
 * Revoraa Level 3: Intermediate Python - Module 3: Functions, Closures, and Decorators
 * 
 * 9 comprehensive lessons covering first-class functions, closures, nonlocal scope,
 * custom decorators, arguments, functools.wraps, and production patterns.
 */

export const MODULE_3_FUNCTIONS_CLOSURES_DECORATORS = {
  id: 'mod-py-func-closures-dec',
  slug: 'functions-closures-decorators',
  level_number: 3,
  title: 'Functions, Closures, and Decorators',
  description: 'Master higher-order functions, lexical closures, custom decorators, functools.wraps, and meta-programming design patterns.',
  estimated_hours: 6,
  sort_order: 3,
  is_published: true,
  topics: [
    {
      id: 'top-closures-decorators',
      slug: 'higher-order-metaprogramming',
      title: 'Higher-Order Functions & Decorators',
      summary: 'Explore first-class functions, closures, decorators with arguments, and validation patterns.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-functions-first-class',
          slug: 'functions-as-first-class-objects',
          title: 'Functions as First-Class Objects',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Treat functions as regular data: assign them to variables, store them in dictionaries, and inspect their runtime attributes.',
          learning_objectives: [
            'Understand what first-class citizen status means for functions in Python',
            'Store functions in data structures to build dynamic command registries',
            'Inspect function metadata like __name__, __doc__, and __annotations__'
          ],
          content_markdown: `### What Makes a Function "First-Class"?

In Python, functions are instances of the \`function\` object type. You can:
1. Assign them to variables.
2. Pass them as arguments to other functions.
3. Return them from other functions.
4. Store them inside lists, tuples, or dictionaries.
5. Attach custom attributes to them.

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

# Alias function to another name
say_hi = greet
print(say_hi("Kavita"))  # "Hello, Kavita!"
print(type(say_hi))      # <class 'function'>
\`\`\`

### Command Dispatcher Pattern
Instead of sprawling \`if/elif/else\` blocks to handle actions, store functions in a dictionary lookup:

\`\`\`python
dispatcher = {
    "add": add_func,
    "subtract": sub_func,
    "multiply": mul_func
}
result = dispatcher["add"](10, 5)
\`\`\``,
          code_snippet: `# Building a dynamic command dispatcher using first-class functions
def export_csv(data):
    return f"CSV export: {len(data)} rows generated"

def export_json(data):
    return f"JSON export: {len(data)} items serialized"

def export_xml(data):
    return f"XML export: <root>{len(data)} nodes</root>"

# Command registry mapping
EXPORTERS = {
    "csv": export_csv,
    "json": export_json,
    "xml": export_xml
}

dataset = [{"id": 1}, {"id": 2}, {"id": 3}]

def process_export(format_type, data):
    exporter = EXPORTERS.get(format_type)
    if not exporter:
        raise ValueError(f"Unsupported format: {format_type}")
    return exporter(data)

print(process_export("json", dataset))
print(process_export("csv", dataset))`,
          code_language: 'python',
          code_explanation: 'Demonstrates first-class functions stored in an EXPORTERS dictionary, dynamically dispatched by format name without if/elif branches.',
          expected_output: `JSON export: 3 items serialized
CSV export: 3 rows generated`,
          quiz: {
            id: 'quiz-first-class-functions',
            title: 'Knowledge Check: First-Class Functions',
            questions: [
              {
                id: 'q-fc-1',
                question_text: 'What is the type of a function defined with def in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '<class \'callable\'>' },
                  { id: 'opt_2', text: '<class \'function\'>' },
                  { id: 'opt_3', text: '<class \'method\'>' },
                  { id: 'opt_4', text: '<class \'pointer\'>' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'In Python, all functions created with def or lambda are instances of the built-in function class.'
              }
            ]
          },
          key_takeaways: [
            'Functions can be assigned, stored, and passed just like integers or strings.',
            'Dictionary dispatch tables replace fragile if/elif chains.',
            'Functions retain introspection metadata like __name__ and __doc__.'
          ],
          revision_prompts: [
            'What is the difference between referencing fn and calling fn()?',
            'Can functions have custom arbitrary attributes assigned to them (e.g. fn.custom_tag = 1)?'
          ]
        },

        // Lesson 2
        {
          id: 'les-passing-functions-arguments',
          slug: 'passing-functions-as-arguments',
          title: 'Passing Functions as Arguments',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Build higher-order functions that accept callable callbacks, custom predicates, and transform pipelines.',
          learning_objectives: [
            'Define higher-order functions accepting callback parameters',
            'Write custom predicate filters and data transformation runners',
            'Verify callable signatures with callable() built-in'
          ],
          content_markdown: `### Higher-Order Functions

A **higher-order function** is any function that either accepts another function as an argument, returns a function, or both.

Built-in examples include:
- \`sorted(iterable, key=fn)\`
- \`map(fn, iterable)\`
- \`filter(fn, iterable)\`

### Custom Transformation Pipelines
By accepting transformation functions, you decouple your algorithm logic from the data manipulation rules:

\`\`\`python
def transform_pipeline(data, *operations):
    current = data
    for op in operations:
        current = op(current)
    return current
\`\`\``,
          code_snippet: `# Higher-order pipeline applying custom transformation functions
def normalize_spaces(text):
    return " ".join(text.split())

def remove_punctuation(text):
    for char in "!?,.:;":
        text = text.replace(char, "")
    return text

def apply_pipeline(input_str, *transformers):
    result = input_str
    for fn in transformers:
        if not callable(fn):
            raise TypeError(f"Expected callable, received {type(fn)}")
        result = fn(result)
    return result

raw_text = "   Hello,   world!!  Welcome to Python:   "
cleaned = apply_pipeline(raw_text, str.strip, normalize_spaces, remove_punctuation, str.lower)
print("Raw input:    ", repr(raw_text))
print("Cleaned result:", repr(cleaned))`,
          code_language: 'python',
          code_explanation: 'Defines an apply_pipeline higher-order function that verifies callables and pipes text through multiple string transformation functions.',
          expected_output: `Raw input:     '   Hello,   world!!  Welcome to Python:   '
Cleaned result: 'hello world welcome to python'`,
          quiz: {
            id: 'quiz-passing-functions',
            title: 'Knowledge Check: Passing Functions',
            questions: [
              {
                id: 'q-pf-1',
                question_text: 'What built-in function tests whether an object can be invoked like a function with ()?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'is_function(obj)' },
                  { id: 'opt_2', text: 'callable(obj)' },
                  { id: 'opt_3', text: 'has_call(obj)' },
                  { id: 'opt_4', text: 'invocable(obj)' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The callable() function returns True if the argument is a function, method, lambda, or class implementing __call__().'
              }
            ]
          },
          key_takeaways: [
            'Functions accepting callables decouple execution flow from processing logic.',
            'Use callable() to validate function arguments before invocation.',
            'Piping functions together creates composable, modular workflows.'
          ],
          revision_prompts: [
            'What happens if you pass print instead of print() as an argument?',
            'How does sorted(key=...) utilize higher-order function principles?'
          ]
        },

        // Lesson 3
        {
          id: 'les-returning-functions',
          slug: 'returning-functions-from-functions',
          title: 'Returning Functions from Functions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Construct dynamic function factories that generate customized function variants on the fly.',
          learning_objectives: [
            'Write function factories returning nested functions',
            'Parameterize behavior dynamically based on factory arguments',
            'Understand how nested functions capture factory configuration'
          ],
          content_markdown: `### Function Factories

Just as functions can return numbers, dictionaries, or objects, they can also return **newly created functions**:

\`\`\`python
def make_multiplier(factor):
    # Inner function defined inside the factory
    def multiply(x):
        return x * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
\`\`\`

Here, \`make_multiplier\` is a factory. Each call produces a brand new function customized with the provided \`factor\`.`,
          code_snippet: `# Function factory generating HTML tag wrappers
def make_tag_formatter(tag):
    def wrap_tag(content):
        return f"<{tag}>{content}</{tag}>"
    return wrap_tag

bold = make_tag_formatter("strong")
italic = make_tag_formatter("em")
header = make_tag_formatter("h1")

print(bold("Important notice"))
print(italic("Secondary text"))
print(header("Chapter 1: The Foundations"))`,
          code_language: 'python',
          code_explanation: 'Demonstrates a make_tag_formatter factory that returns specialized HTML tag wrapping functions.',
          expected_output: `<strong>Important notice</strong>
<em>Secondary text</em>
<h1>Chapter 1: The Foundations</h1>`,
          quiz: {
            id: 'quiz-returning-functions',
            title: 'Knowledge Check: Function Factories',
            questions: [
              {
                id: 'q-rf-1',
                question_text: 'When double = make_multiplier(2) is called, what is the type of double?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'int' },
                  { id: 'opt_2', text: 'function' },
                  { id: 'opt_3', text: 'NoneType' },
                  { id: 'opt_4', text: 'generator' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'make_multiplier returns the inner multiply function object, so double is a function.'
              }
            ]
          },
          key_takeaways: [
            'Function factories return customized function instances.',
            'Inner functions retain access to the factory arguments.',
            'This forms the foundation for lexical closures and decorators.'
          ],
          revision_prompts: [
            'How does Python store the factor argument after make_multiplier finishes execution?',
            'What is the memory impact of generating 1000 distinct function factories?'
          ]
        },

        // Lesson 4
        {
          id: 'les-scope-closures-lexical',
          slug: 'scope-closures-lexical-variables',
          title: 'Scope, Closures, and Lexical Variables',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Master LEGB scope resolution, inspect closure cell objects, and mutate enclosing variables using nonlocal.',
          learning_objectives: [
            'Trace the LEGB (Local, Enclosing, Global, Built-in) lookup sequence',
            'Understand how closures capture enclosing scope in __closure__ cells',
            'Use the nonlocal keyword to modify enclosing variables without globals'
          ],
          content_markdown: `### The LEGB Scope Hierarchy

When Python resolves a variable name, it searches in this exact order:
1. **L - Local**: Variables defined inside the current function.
2. **E - Enclosing**: Variables in outer enclosing functions (closures).
3. **G - Global**: Variables defined at the module top level.
4. **B - Built-in**: Python built-in names (\`len\`, \`range\`, \`print\`).

### What Is a Closure?

A **closure** is an inner function that remembers and retains access to variables in its enclosing scope, **even after the outer function has finished executing and returned**.

Python stores these captured variables in the inner function's **\`__closure__\`** attribute as cell objects.

### The \`nonlocal\` Keyword
To reassign a variable in the enclosing scope from inside the inner function, declare it with \`nonlocal\`:

\`\`\`python
def make_counter():
    count = 0
    def increment():
        nonlocal count  # Required to reassign count!
        count += 1
        return count
    return increment
\`\`\``,
          code_snippet: `# Stateful accumulator closure using nonlocal
def make_accumulator(initial_balance=0):
    balance = initial_balance
    
    def deposit(amount):
        nonlocal balance
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        balance += amount
        return balance

    return deposit

account = make_accumulator(100)
print("After deposit 50: ", account(50))
print("After deposit 200:", account(200))

# Inspect the closure cell
print("Captured closure value:", account.__closure__[0].cell_contents)`,
          code_language: 'python',
          code_explanation: 'Demonstrates a closure maintaining private state balance across function calls using nonlocal, and inspects the underlying cell in __closure__.',
          expected_output: `After deposit 50:  150
After deposit 200: 350
Captured closure value: 350`,
          quiz: {
            id: 'quiz-closures-nonlocal',
            title: 'Knowledge Check: Closures and Scope',
            questions: [
              {
                id: 'q-cn-1',
                question_text: 'What keyword allows an inner function to reassign a variable defined in an enclosing outer function?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'global' },
                  { id: 'opt_2', text: 'nonlocal' },
                  { id: 'opt_3', text: 'outer' },
                  { id: 'opt_4', text: 'super' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'nonlocal tells Python that an identifier refers to a variable in the nearest enclosing scope rather than creating a local variable.'
              }
            ]
          },
          key_takeaways: [
            'Closures capture enclosing variables in __closure__ cells.',
            'nonlocal allows mutating enclosing variables without global pollution.',
            'Closures enable lightweight stateful encapsulation without writing full classes.'
          ],
          revision_prompts: [
            'What happens if you try count += 1 in an inner function without declaring nonlocal count?',
            'What is an UnboundLocalError and why does it occur in nested scopes?'
          ]
        },

        // Lesson 5
        {
          id: 'les-understanding-decorators',
          slug: 'understanding-decorators',
          title: 'Understanding Decorators and Syntactic Sugar',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Demystify Python @decorator syntax by understanding how wrapper closures wrap and enhance existing functions.',
          learning_objectives: [
            'Deconstruct @decorator syntax into its underlying assignment equivalence',
            'Write wrapper functions accepting *args and **kwargs',
            'Return inner wrapper results transparently'
          ],
          content_markdown: `### The Essence of a Decorator

A decorator is simply **a callable that takes a function as input, extends its behavior, and returns an enhanced function**.

The \`@decorator\` syntax is pure syntactic sugar:

\`\`\`python
@my_decorator
def greet():
    print("Hello")

# The exact equivalent of:
def greet():
    print("Hello")
greet = my_decorator(greet)
\`\`\`

### The Standard Decorator Pattern

\`\`\`python
def my_decorator(fn):
    def wrapper(*args, **kwargs):
        # 1. Code before original function runs
        result = fn(*args, **kwargs)
        # 2. Code after original function runs
        return result
    return wrapper
\`\`\``,
          code_snippet: `# Building a simple logger decorator
def log_execution(fn):
    def wrapper(*args, **kwargs):
        print(f"[LOG] Executing '{fn.__name__}' with args={args}, kwargs={kwargs}")
        result = fn(*args, **kwargs)
        print(f"[LOG] '{fn.__name__}' returned: {result}")
        return result
    return wrapper

@log_execution
def calculate_total(price, tax_rate=0.08):
    return price * (1 + tax_rate)

final_price = calculate_total(100, tax_rate=0.10)
print(f"Result in caller: {final_price}")`,
          code_language: 'python',
          code_explanation: 'Shows a standard decorator wrapping calculate_total, printing logging messages before and after execution, and returning the computed result.',
          expected_output: `[LOG] Executing 'calculate_total' with args=(100,), kwargs={'tax_rate': 0.1}
[LOG] 'calculate_total' returned: 110.0
Result in caller: 110.0`,
          quiz: {
            id: 'quiz-understanding-decorators',
            title: 'Knowledge Check: Decorator Mechanics',
            questions: [
              {
                id: 'q-ud-1',
                question_text: 'What does the syntax @my_decorator above "def foo(): pass" do at definition time?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It executes foo() immediately.' },
                  { id: 'opt_2', text: 'It reassigns foo = my_decorator(foo).' },
                  { id: 'opt_3', text: 'It compiles foo into bytecode twice.' },
                  { id: 'opt_4', text: 'It deletes foo from memory.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: '@decorator is syntactic sugar for reassigning the function name to the output of decorator(function).'
              }
            ]
          },
          key_takeaways: [
            '@decorator is shorthand for target_fn = decorator(target_fn).',
            'Always accept *args, **kwargs in wrappers for universal compatibility.',
            'Always return the result of the wrapped function from the wrapper.'
          ],
          revision_prompts: [
            'What happens if the wrapper function forgets to return result?',
            'When does the decorator function itself execute: at import/definition time or at call time?'
          ]
        },

        // Lesson 6
        {
          id: 'les-decorators-with-arguments',
          slug: 'decorators-with-arguments',
          title: 'Decorators with Arguments: The Three-Tier Pattern',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Build parameterized decorators by creating a decorator factory returning the decorator function.',
          learning_objectives: [
            'Construct 3-level nested functions to support decorator arguments',
            'Trace the execution flow of @decorator(arg=val)',
            'Build practical parameterized decorators like @repeat(times=N)'
          ],
          content_markdown: `### Adding Parameters to Decorators

When you want to pass parameters to a decorator:

\`\`\`python
@repeat(num_times=3)
def send_ping():
    ...
\`\`\`

Notice that \`repeat(num_times=3)\` is **called immediately**. Therefore, \`repeat\` must return the actual decorator!

This requires **three nested functions**:
1. **Tier 1 (Outer Factory)**: Receives decorator configuration (\`num_times\`). Returns the decorator.
2. **Tier 2 (Decorator)**: Receives the target function (\`fn\`). Returns the wrapper.
3. **Tier 3 (Wrapper)**: Receives \`*args, **kwargs\` and executes the enhanced behavior.

\`\`\`python
def repeat(num_times=2):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(num_times):
                result = fn(*args, **kwargs)
            return result
        return wrapper
    return decorator
\`\`\``,
          code_snippet: `# Parameterized decorator: @repeat(times)
def repeat(num_times=2):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            results = []
            for i in range(num_times):
                print(f"  [Attempt {i + 1}/{num_times}]")
                results.append(fn(*args, **kwargs))
            return results[-1]
        return wrapper
    return decorator

@repeat(num_times=3)
def ping_service(host):
    return f"Ping to {host} OK"

response = ping_service("api.revoraa.dev")
print("Final response:", response)`,
          code_language: 'python',
          code_explanation: 'Implements the 3-tier parameterized decorator pattern to repeat a function invocation 3 times.',
          expected_output: `  [Attempt 1/3]
  [Attempt 2/3]
  [Attempt 3/3]
Final response: Ping to api.revoraa.dev OK`,
          quiz: {
            id: 'quiz-decorators-arguments',
            title: 'Knowledge Check: Parameterized Decorators',
            questions: [
              {
                id: 'q-da-1',
                question_text: 'Why does a decorator with arguments require three nested function definitions?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Python syntax requires at least 3 levels for all closures.' },
                  { id: 'opt_2', text: 'Level 1 receives decorator arguments, Level 2 receives the function, Level 3 receives call arguments.' },
                  { id: 'opt_3', text: 'To ensure thread safety in the Python interpreter.' },
                  { id: 'opt_4', text: 'Because of garbage collection limits in CPython.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The outer level configures parameters, the middle level accepts the function, and the inner level wraps runtime calls.'
              }
            ]
          },
          key_takeaways: [
            'Decorators with arguments are decorator factories.',
            'They involve three nested levels: config -> function -> runtime call.',
            'Always verify the return statements at every tier.'
          ],
          revision_prompts: [
            'How can you write a decorator that works BOTH with and without arguments (e.g. @timed vs @timed(unit="ms"))?',
            'What happens if the outer factory forgets to return decorator?'
          ]
        },

        // Lesson 7
        {
          id: 'les-functools-wraps-metadata',
          slug: 'functools-wraps-metadata',
          title: 'Preserving Metadata with functools.wraps',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Prevent lost docstrings and masked function names using @functools.wraps on every wrapper function.',
          learning_objectives: [
            'Understand how naive decorators mask __name__ and __doc__ with "wrapper"',
            'Apply @functools.wraps(fn) to copy introspection attributes',
            'Ensure compatibility with documentation generators and test runners'
          ],
          content_markdown: `### The Disappearing Metadata Problem

When you decorate a function naively:

\`\`\`python
def bad_decorator(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@bad_decorator
def fetch_user_data(user_id):
    """Fetches user record from storage."""
    pass

print(fetch_user_data.__name__) # 'wrapper' (NOT 'fetch_user_data'!)
print(fetch_user_data.__doc__)  # None (Docstring LOST!)
\`\`\`

This breaks debuggers, logging libraries, automatic doc generators (Sphinx), and \`unittest\` discovery!

### The Solution: \`@functools.wraps\`

Always decorate the inner \`wrapper\` with **\`@wraps(fn)\`** from Python's standard \`functools\` module:

\`\`\`python
from functools import wraps

def good_decorator(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper
\`\`\``,
          code_snippet: `from functools import wraps

def audit_decorator(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        """Audited wrapper execution."""
        return fn(*args, **kwargs)
    return wrapper

@audit_decorator
def calculate_tax(amount):
    """Calculates state tax on the provided amount."""
    return amount * 0.05

print("Function name preserved:", calculate_tax.__name__)
print("Docstring preserved:    ", calculate_tax.__doc__)`,
          code_language: 'python',
          code_explanation: 'Demonstrates how @functools.wraps preserves the original function name and docstring instead of replacing them with wrapper attributes.',
          expected_output: `Function name preserved: calculate_tax
Docstring preserved:     Calculates state tax on the provided amount.`,
          quiz: {
            id: 'quiz-functools-wraps',
            title: 'Knowledge Check: functools.wraps',
            questions: [
              {
                id: 'q-fw-1',
                question_text: 'What is the primary purpose of applying @functools.wraps(fn) to a wrapper function?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To speed up wrapper execution by 50%.' },
                  { id: 'opt_2', text: 'To preserve original metadata such as __name__, __doc__, and annotations.' },
                  { id: 'opt_3', text: 'To prevent the function from raising exceptions.' },
                  { id: 'opt_4', text: 'To make the function asynchronous.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: '@functools.wraps copies __module__, __name__, __qualname__, __doc__, and __annotations__ from the wrapped function to the wrapper.'
              }
            ]
          },
          key_takeaways: [
            'Naive decorators obscure original function names and docstrings.',
            'Always use @functools.wraps on every wrapper function.',
            'Preserving metadata ensures compatibility with debuggers and documentation tools.'
          ],
          revision_prompts: [
            'What happens to __wrapped__ attribute when using @wraps?',
            'Can you access the original undecorated function via fn.__wrapped__?'
          ]
        },

        // Lesson 8
        {
          id: 'les-practical-decorators-timing',
          slug: 'practical-decorators-timing-logging-validation',
          title: 'Practical Decorators: Timing, Logging, and Validation',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Build production-ready decorators for performance measurement with time.perf_counter(), input validation, and audit logging.',
          learning_objectives: [
            'Build a precision timing decorator using time.perf_counter()',
            'Implement input type and value validation decorators with guard clauses',
            'Chain multiple decorators together understanding top-to-bottom application order'
          ],
          content_markdown: `### Decorator Stacking Order

When stacking multiple decorators:

\`\`\`python
@decorator_a
@decorator_b
def work():
    pass
\`\`\`

Python applies them **bottom-up**:
\`\`\`python
work = decorator_a(decorator_b(work))
\`\`\`
At call time, \`decorator_a\` executes first (outer layer), then \`decorator_b\` (inner layer), then \`work()\`.

### Real-World Patterns
1. **Performance Timing**: Measure latency without cluttering business logic.
2. **Type/Contract Validation**: Enforce preconditions before expensive processing.`,
          code_snippet: `from functools import wraps
import time

def timed_execution(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        print(f"[{fn.__name__}] Execution took {duration:.2f}ms")
        return result
    return wrapper

def validate_positive(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        for arg in args:
            if isinstance(arg, (int, float)) and arg < 0:
                raise ValueError(f"Negative argument rejected: {arg}")
        return fn(*args, **kwargs)
    return wrapper

# Chained decorators: validate first, then time
@timed_execution
@validate_positive
def compute_factorial(n):
    total = 1
    for i in range(1, n + 1):
        total *= i
    return total

print("Result of 5!:", compute_factorial(5))`,
          code_language: 'python',
          code_explanation: 'Chains @timed_execution and @validate_positive decorators on compute_factorial, verifying argument positivity before executing and measuring latency.',
          expected_output: `[compute_factorial] Execution took 0.0...ms
Result of 5!: 120`,
          quiz: {
            id: 'quiz-practical-decorators',
            title: 'Knowledge Check: Practical Decorators',
            questions: [
              {
                id: 'q-pd-1',
                question_text: 'In what order are stacked decorators applied when written as @dec_a above @dec_b?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Top-down: dec_a wraps the function first.' },
                  { id: 'opt_2', text: 'Bottom-up: dec_b wraps the function first, then dec_a wraps the result.' },
                  { id: 'opt_3', text: 'Simultaneously in parallel threads.' },
                  { id: 'opt_4', text: 'Alphabetically by decorator name.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Python evaluates @dec_a @dec_b def fn() as fn = dec_a(dec_b(fn)), meaning dec_b wraps fn first.'
              }
            ]
          },
          key_takeaways: [
            'Decorators keep cross-cutting concerns (timing, logging) separate from business logic.',
            'Multiple decorators can be stacked; they wrap bottom-up.',
            'Use time.perf_counter() for high-resolution timing.'
          ],
          revision_prompts: [
            'What happens if a decorator earlier in the chain catches an exception raised by an inner decorator?',
            'How can you pass custom logging destinations into a logging decorator?'
          ]
        },

        // Lesson 9
        {
          id: 'les-decorator-mistakes-debugging',
          slug: 'decorator-mistakes-and-debugging',
          title: 'Common Decorator Mistakes and Debugging',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Diagnose the top 4 decorator bugs: forgetting to return wrappers, executing at definition time, and missing arguments.',
          learning_objectives: [
            'Spot and fix the missing return wrapper bug',
            'Differentiate between decorator call time vs definition time',
            'Inspect decorated call stacks and access the original unwrapped function'
          ],
          content_markdown: `### The 4 Most Common Decorator Bugs

1. **Forgetting to return \`wrapper\` from the decorator**:
   \`TypeError: 'NoneType' object is not callable\` when the decorated function is called.
2. **Forgetting to return \`result\` inside \`wrapper\`**:
   The decorated function executes properly but silently returns \`None\`.
3. **Accidental definition-time execution**:
   Writing \`@my_decorator()\` when the decorator does NOT take arguments invokes the function during import!
4. **Hardcoding parameters instead of \`*args, **kwargs\`**:
   Fails when the decorated function is called with different signatures or keyword arguments.

### Accessing the Raw Function
When using \`@functools.wraps\`, Python provides a **\`__wrapped__\`** attribute holding the original undecorated function:

\`\`\`python
# Bypass all decorator layers directly!
original_fn = decorated_fn.__wrapped__
\`\`\``,
          code_snippet: `from functools import wraps

# Demonstrating __wrapped__ access to bypass decorators during tests
def uppercase_decorator(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        res = fn(*args, **kwargs)
        return res.upper()
    return wrapper

@uppercase_decorator
def greet(name):
    return f"Hello, {name}"

print("Decorated output: ", greet("Priya"))
# Access raw unwrapped function
raw_fn = greet.__wrapped__
print("Unwrapped output: ", raw_fn("Priya"))`,
          code_language: 'python',
          code_explanation: 'Shows how __wrapped__ exposes the underlying function, allowing unit tests to verify raw logic without triggering decorator side effects.',
          expected_output: `Decorated output:  HELLO, PRIYA
Unwrapped output:  Hello, Priya`,
          quiz: {
            id: 'quiz-decorator-debugging',
            title: 'Knowledge Check: Decorator Debugging',
            questions: [
              {
                id: 'q-dd-1',
                question_text: 'If calling a decorated function produces TypeError: \'NoneType\' object is not callable, what did the decorator author likely forget?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They forgot to import sys.' },
                  { id: 'opt_2', text: 'They forgot "return wrapper" at the end of the decorator function.' },
                  { id: 'opt_3', text: 'They used *args instead of **kwargs.' },
                  { id: 'opt_4', text: 'They forgot to add type annotations.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'If a decorator does not return its inner wrapper, it implicitly returns None. Python then reassigns the function name to None, raising TypeError when called.'
              }
            ]
          },
          key_takeaways: [
            'Always return wrapper from the decorator and result from the wrapper.',
            'Use __wrapped__ to test the original function in isolation.',
            'Decorators execute at import/definition time, while wrappers execute at call time.'
          ],
          revision_prompts: [
            'How can you inspect how many decorator layers wrap a function?',
            'What happens if an exception is raised inside wrapper before fn is invoked?'
          ]
        }
      ]
    }
  ]
};
