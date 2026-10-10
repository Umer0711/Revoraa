/**
 * Revoraa Level 4: Advanced Python - Module 5: Advanced Type Hints and Protocols
 * 
 * 12 comprehensive lessons covering static type analysis, collections typing, Union/Optional,
 * TypeAlias/type statement, Generics, TypeVar covariance/contravariance, Protocols,
 * Callable, TypedDict, runtime validation boundaries, and API contract design.
 */

export const MODULE_5_ADVANCED_TYPE_HINTS = {
  id: 'mod-py-advanced-typing',
  slug: 'advanced-type-hints-and-protocols',
  level_number: 4,
  title: 'Advanced Type Hints and Protocols',
  description: 'Master static analysis, Generic functions, TypeVar variance, Protocols (structural subtyping), Callable signatures, and TypedDict contracts.',
  estimated_hours: 10,
  sort_order: 5,
  is_published: true,
  topics: [
    {
      id: 'top-type-systems-and-protocols',
      slug: 'static-typing-generics-protocols',
      title: 'Static Typing, Generics & Structural Subtyping',
      summary: 'Explore PEP 484/585, Generic containers, TypeVar bounds, Protocol duck typing, ParamSpec, and static verification with Mypy/Pyright.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-why-type-annotations-matter',
          slug: 'why-type-annotations-matter',
          title: 'Why Type Annotations Matter: Maintenance, Refactoring and Tooling',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Understand the role of static type annotations in large-scale Python codebases, IDE autocomplete, and catching defects before deployment.',
          learning_objectives: [
            'Understand that Python type annotations are static metadata and do NOT enforce runtime type constraints by default',
            'Analyze how static type checkers (Mypy, Pyright) detect type mismatches and None-dereference bugs',
            'Explain the impact of type hints on team velocity, code documentation, and safe refactoring'
          ],
          content_markdown: `### The Evolution of Python Typing

Python remains a dynamically typed language at runtime:
- The Python Virtual Machine **ignores** type annotations during execution. Writing \`x: int = "hello"\` executes without a runtime exception!
- **Why use type hints then?**:
  1. **Automated Defect Detection**: Static type checkers catch \`NoneType has no attribute\` and wrong parameter types before code is merged.
  2. **Self-Documenting Code**: Function signatures act as verified contracts, eliminating ambiguous docstrings.
  3. **Rich IDE Intelligence**: Autocomplete, jump-to-definition, and rename refactorings become 100% reliable.

### Important Truth
Type hints are **static analysis tools**, not automatic runtime validators. To validate dynamic JSON payloads from an external user, you must use validation logic or libraries like Pydantic.`,
          code_snippet: `def calculate_order_total(items: list[dict[str, float]], tax_rate: float) -> float:
    """Type annotations communicate exact data contracts to callers and static analyzers."""
    subtotal = sum(item["price"] for item in items)
    return round(subtotal * (1.0 + tax_rate), 2)

cart = [{"price": 29.99}, {"price": 49.50}]
print("Calculated total:", calculate_order_total(cart, 0.08))

# Type annotations can be inspected at runtime via __annotations__
print("Function annotations dict:", calculate_order_total.__annotations__)`,
          code_language: 'python',
          code_explanation: 'calculate_order_total uses PEP 585 generic collections and float return types, exposing annotations via the __annotations__ attribute.',
          expected_output: `Calculated total: 85.85
Function annotations dict: {'items': list[dict[str, float]], 'tax_rate': <class 'float'>, 'return': <class 'float'>}`,
          quiz: {
            id: 'quiz-l4-why-types',
            title: 'Type Hints Rationale Check',
            questions: [
              {
                id: 'q-l4-wt-1',
                question_text: 'Does standard CPython raise a TypeError at runtime if you pass a string to a function annotated as def foo(x: int)?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Yes, CPython raises a TypeError immediately.' },
                  { id: 'opt_2', text: 'No, Python ignores type hints at runtime; they are static metadata analyzed by tools like Mypy/Pyright.' },
                  { id: 'opt_3', text: 'Only if running in Python 3.12+.' },
                  { id: 'opt_4', text: 'Only if the file has a .ts extension.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Standard Python does not enforce type annotations at runtime. They are purely metadata consumed by static analysis tools, IDEs, and linters.'
              }
            ]
          },
          key_takeaways: [
            'Python type annotations are static metadata and do not enforce runtime validation by default.',
            'Static type checkers catch defects, None-pointer traps, and signature mismatches during CI/CD.',
            'Type annotations provide self-documenting APIs and power rich IDE refactoring tools.'
          ],
          revision_prompts: [
            'What is the difference between dynamic typing, static typing, and gradual typing?',
            'How can typing.get_type_hints() be used to inspect annotated types safely at runtime?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-advanced-collection-types',
          slug: 'advanced-use-of-collection-types',
          title: 'Advanced Use of list, dict, and Collection Types (PEP 585)',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Modern built-in generics (list[T], dict[K, V], tuple[T, ...]), collections.abc abstract types (Sequence, Mapping, Iterable).',
          learning_objectives: [
            'Use modern PEP 585 built-in collection generics (list, dict, set, tuple) without importing from typing',
            'Annotate variable-length tuples (tuple[int, ...]) vs fixed-length tuples (tuple[int, str])',
            'Prefer collections.abc abstract container types (Sequence, Mapping, Iterable) for function parameters'
          ],
          content_markdown: `### Modern Built-in Generics (PEP 585)

In Python 3.9+, you no longer need \`from typing import List, Dict, Set, Tuple\`. Standard built-in types support indexing directly:
- \`list[str]\`: Homogeneous list of strings.
- \`dict[str, int]\`: Dictionary mapping string keys to integer values.
- \`set[int]\`: Set of integers.

### Fixed-Length vs Variable-Length Tuples
- \`tuple[int, str, bool]\`: Exact 3-element tuple (heterogeneous record).
- \`tuple[int, ...]\`: Arbitrary-length homogeneous sequence of integers (using the ellipsis \`...\`).

### Best Practice: Accept Abstract, Return Concrete
When accepting arguments, accept **\`collections.abc.Sequence[T]\`** or **\`Mapping[K, V]\`** rather than strict \`list\` or \`dict\`, allowing callers to pass tuples, lists, or custom containers seamlessly!`,
          code_snippet: `from collections.abc import Sequence, Mapping

def summarize_scores(scores: Sequence[float]) -> dict[str, float]:
    """Accepts any Sequence (list, tuple) and returns a concrete dict."""
    return {
        "count": float(len(scores)),
        "average": round(sum(scores) / len(scores), 2)
    }

# Callers can pass either lists or tuples!
list_scores = [85.5, 92.0, 78.0]
tuple_scores = (90.0, 95.5, 88.0)

print("List summary: ", summarize_scores(list_scores))
print("Tuple summary:", summarize_scores(tuple_scores))`,
          code_language: 'python',
          code_explanation: 'Using Sequence allows the function to accept both lists and tuples, making the API more flexible and reusable.',
          expected_output: `List summary:  {'count': 3.0, 'average': 85.17}
Tuple summary: {'count': 3.0, 'average': 91.17}`,
          quiz: {
            id: 'quiz-l4-collections-typing',
            title: 'Collection Types Check',
            questions: [
              {
                id: 'q-l4-ct-1',
                question_text: 'How should you annotate a function parameter that only needs to iterate over elements and inspect len(), so callers can pass either a list, tuple, or custom sequence?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'items: list[Any]' },
                  { id: 'opt_2', text: 'items: collections.abc.Sequence[T]' },
                  { id: 'opt_3', text: 'items: dict[str, int]' },
                  { id: 'opt_4', text: 'items: set[int]' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Sequence from collections.abc is an abstract base type representing indexed sequences with __len__ and __getitem__, accepting lists, tuples, and custom sequences.'
              }
            ]
          },
          key_takeaways: [
            'Use modern built-in generics list[T], dict[K, V], and set[T] in Python 3.9+.',
            'tuple[T, ...] specifies an arbitrary-length homogeneous tuple.',
            'Accept abstract interfaces (Sequence, Mapping) in function parameters to maximize flexibility.'
          ],
          revision_prompts: [
            'What is the difference between collections.abc.Iterable and collections.abc.Sequence?',
            'Why is it bad practice to annotate function arguments as concrete list when only iteration is needed?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-union-and-optional-types',
          slug: 'union-and-optional-types',
          title: 'Union and Optional Types: The Pipe Operator (PEP 604) and Type Narrowing',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Use Python 3.10+ pipe union syntax (A | B), Optional[T] as T | None, and isinstance() type narrowing.',
          learning_objectives: [
            'Write clean union types using the pipe syntax (int | str) in Python 3.10+',
            'Represent nullable values with T | None instead of typing.Optional[T]',
            'Perform type narrowing using isinstance() guards'
          ],
          content_markdown: `### Modern Union Syntax (PEP 604)

In Python 3.10+, the pipe operator \`|\` replaces \`typing.Union\` and \`typing.Optional\`:
- \`int | float\`: Can be either an \`int\` or a \`float\`.
- \`str | None\`: Equivalent to \`Optional[str]\` (a string or \`None\`).

### Type Narrowing (Type Guards)

Static type checkers track conditional execution flow. When a variable has type \`str | None\`, calling \`val.upper()\` raises a type error because \`None\` has no \`upper()\` method. Using an \`if val is not None:\` guard **narrows** the type to \`str\`.`,
          code_snippet: `def parse_user_input(raw: str | int | None) -> str:
    # 1. Type narrowing against None
    if raw is None:
        return "UNKNOWN_USER"

    # 2. Type narrowing against int
    if isinstance(raw, int):
        return f"USER_ID_{raw}"

    # Here, static type checker knows raw is guaranteed to be str!
    return raw.strip().upper()

print("Parsed None: ", parse_user_input(None))
print("Parsed int:  ", parse_user_input(1024))
print("Parsed str:  ", parse_user_input("  alice_dev  "))`,
          code_language: 'python',
          code_explanation: 'isinstance and is not None checks narrow the union type step-by-step, allowing safe operations on the resolved types.',
          expected_output: `Parsed None:  UNKNOWN_USER
Parsed int:   USER_ID_1024
Parsed str:   ALICE_DEV`,
          quiz: {
            id: 'quiz-l4-unions',
            title: 'Union Types Check',
            questions: [
              {
                id: 'q-l4-un-1',
                question_text: 'In Python 3.10+, what is the idiomatic syntax for annotating a function that returns either a float or None?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: '-> float or None' },
                  { id: 'opt_2', text: '-> float | None' },
                  { id: 'opt_3', text: '-> Maybe(float)' },
                  { id: 'opt_4', text: '-> float?' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'PEP 604 introduced the pipe operator `|` for union types, making `float | None` the modern replacement for `Optional[float]`.'
              }
            ]
          },
          key_takeaways: [
            'Use the pipe operator A | B for union types in Python 3.10+.',
            'T | None is the modern replacement for Optional[T].',
            'Use isinstance() and is not None guards to narrow union types safely.'
          ],
          revision_prompts: [
            'What happens if a static type checker encounters a method call on a variable of type str | None without a guard?',
            'How does typing.Literal allow restricting types to specific literal values?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-type-aliases-and-type-statement',
          slug: 'type-aliases-and-the-type-statement',
          title: 'Type Aliases: From typing.TypeAlias to Python 3.12 type Statement',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 4,
          summary: 'Eliminate complex, unwieldy type repetition using TypeAlias and the Python 3.12 type statement.',
          learning_objectives: [
            'Simplify complex nested types with meaningful domain-specific type aliases',
            'Contrast legacy variable assignments with explicit typing.TypeAlias',
            'Understand Python 3.12+ soft keyword type statement syntax'
          ],
          content_markdown: `### Why Type Aliases Matter

When working with complex signatures (e.g., JSON structures or callback maps), repeating \`dict[str, list[tuple[int, float]]]\` across dozens of functions impairs readability.

### Evolution of Type Aliases
1. **Legacy Assignment (Python 3.9-)**:
   \`\`\`python
   UserId = int # Ambiguous: is it a constant or a type?
   \`\`\`
2. **Explicit TypeAlias (Python 3.10 - 3.11)**:
   \`\`\`python
   from typing import TypeAlias
   UserId: TypeAlias = int
   \`\`\`
3. **The \`type\` Statement (Python 3.12+ PEP 695)**:
   \`\`\`python
   type UserId = int
   type JSONValue = str | int | float | bool | None | list[JSONValue] | dict[str, JSONValue]
   \`\`\``,
          code_snippet: `from typing import TypeAlias

# Domain-specific type aliases
UserId: TypeAlias = int
Coordinate: TypeAlias = tuple[float, float]
GeoFence: TypeAlias = list[Coordinate]

def is_point_in_zone(point: Coordinate, zone: GeoFence) -> bool:
    lat, lon = point
    print(f"Verifying ({lat}, {lon}) against {len(zone)} boundary nodes...")
    return True

my_location: Coordinate = (37.7749, -122.4194)
san_francisco: GeoFence = [(37.70, -122.50), (37.80, -122.35)]

print("Result:", is_point_in_zone(my_location, san_francisco))`,
          code_language: 'python',
          code_explanation: 'Type aliases clarify code intention by naming domain concepts (Coordinate, GeoFence) without adding runtime performance overhead.',
          expected_output: `Verifying (37.7749, -122.4194) against 2 boundary nodes...
Result: True`,
          quiz: {
            id: 'quiz-l4-type-aliases',
            title: 'Type Aliases Check',
            questions: [
              {
                id: 'q-l4-ta-1',
                question_text: 'What is the primary benefit of creating domain type aliases in an application?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It creates a new C struct in memory.' },
                  { id: 'opt_2', text: 'It clarifies domain meaning, simplifies complex nested types, and ensures consistent interfaces across modules.' },
                  { id: 'opt_3', text: 'It makes Python execute faster.' },
                  { id: 'opt_4', text: 'It encrypts variable names.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Type aliases give domain names to complex types, improving readability and allowing centralized updates to type definitions.'
              }
            ]
          },
          key_takeaways: [
            'Type aliases simplify complex signatures and express domain concepts.',
            'Use typing.TypeAlias in Python 3.10-3.11, or type Name = ... in Python 3.12+.',
            'Type aliases have zero runtime performance cost.'
          ],
          revision_prompts: [
            'How does typing.NewType differ from a standard TypeAlias?',
            'When should you use NewType("UserId", int) instead of type UserId = int?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-generic-functions-classes',
          slug: 'generic-functions-and-classes',
          title: 'Generic Functions and Classes: Writing Reusable Type-Safe Components',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 5,
          summary: 'Build reusable generic algorithms and containers parameterized by types using typing.Generic.',
          learning_objectives: [
            'Write generic functions where return type matches parameter type',
            'Create generic container classes inheriting from typing.Generic[T]',
            'Ensure type safety without resorting to typing.Any'
          ],
          content_markdown: `### The Problem with \`Any\`

If you write a stack container using \`Any\`:
\`\`\`python
class Stack:
    def push(self, item: Any): ...
    def pop(self) -> Any: ...
\`\`\`
Type checkers lose all ability to verify what comes out of the stack. You lose type safety!

### Generic Classes with \`Generic[T]\`

Using **Generics**, the container is parameterized by a type variable \`T\`:
- When you instantiate \`Stack[int]()\`, \`pop()\` is statically guaranteed to return an \`int\`.
- Trying to push a \`str\` triggers an immediate static analysis error.`,
          code_snippet: `from typing import TypeVar, Generic

T = TypeVar("T")

class TypedStack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T | None:
        return self._items[-1] if self._items else None

# Parameterize stack with float
stock_prices = TypedStack[float]()
stock_prices.push(102.50)
stock_prices.push(105.75)

top_price: float = stock_prices.pop()
print("Popped price:", top_price)
print("Remaining items count:", len(stock_prices._items))`,
          code_language: 'python',
          code_explanation: 'TypedStack[T] guarantees that stock_prices only accepts and returns floats, preserving complete type safety across operations.',
          expected_output: `Popped price: 105.75
Remaining items count: 1`,
          quiz: {
            id: 'quiz-l4-generics',
            title: 'Generics Check',
            questions: [
              {
                id: 'q-l4-gn-1',
                question_text: 'Why is defining a generic class `Box(Generic[T])` better than using `Any` for item storage?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Generic[T] automatically encrypts the data.' },
                  { id: 'opt_2', text: 'Because Generic[T] preserves specific type information, ensuring type checkers verify that extracted items match inserted items.' },
                  { id: 'opt_3', text: 'Because Any causes runtime SyntaxError.' },
                  { id: 'opt_4', text: 'There is no difference.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Generics preserve type relationships. Any discards static type checking, whereas Generic[T] ensures strong compile-time type verification.'
              }
            ]
          },
          key_takeaways: [
            'Generics allow authoring reusable abstractions without losing static type safety.',
            'Generic classes inherit from typing.Generic[T] and parameterize their methods.',
            'Never use Any when a type relationship can be expressed with a generic TypeVar.'
          ],
          revision_prompts: [
            'How does Python 3.12 PEP 695 simplify generic class syntax: class Stack[T]:?',
            'Can a generic class accept multiple type variables (e.g. Generic[K, V])?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-typevar-bounds-variance',
          slug: 'typevar-and-generic-programming',
          title: 'TypeVar Bounds and Variance: Covariance and Contravariance Explained',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 6,
          summary: 'Master TypeVar constraints, upper bounds (bound=...), and subtyping variance (covariant=True, contravariant=True).',
          learning_objectives: [
            'Restrict TypeVar to specific types using constraints or upper bounds (bound=Class)',
            'Understand covariance (covariant=True) for read-only producer containers',
            'Understand contravariance (contravariant=True) for write-only consumer sinks'
          ],
          content_markdown: `### TypeVar Bounds

Sometimes a generic type variable cannot be just any type; it must inherit from a specific base class:
\`\`\`python
T = TypeVar("T", bound=BaseModel) # Must be BaseModel or a subclass
\`\`\`

### Variance: The Subtyping Relationship

If \`Dog\` is a subclass of \`Animal\`, is \`List[Dog]\` a subclass of \`List[Animal]\`?
**No!** If you could pass \`List[Dog]\` to a function expecting \`List[Animal]\`, that function might append a \`Cat\` to your list of dogs! Mutable containers are **invariant**.

1. **Invariance (Default)**: \`Container[Dog]\` and \`Container[Animal]\` have no subtyping relationship.
2. **Covariance (\`covariant=True\`)**: For **read-only producers** (like a read-only \`Sequence\`). If \`Dog <: Animal\`, then \`Producer[Dog] <: Producer[Animal]\`.
3. **Contravariance (\`contravariant=True\`)**: For **write-only consumers** (like a logger or sink). If \`Dog <: Animal\`, then \`Consumer[Animal] <: Consumer[Dog]\`.`,
          code_snippet: `from typing import TypeVar, Generic

class Animal: pass
class Dog(Animal): pass

# Covariant TypeVar: Read-only producer
T_co = TypeVar("T_co", covariant=True)

class ReadOnlyStream(Generic[T_co]):
    def __init__(self, item: T_co):
        self._item = item
    def read(self) -> T_co:
        return self._item

# A stream of Dogs can safely be treated as a stream of Animals!
dog_stream: ReadOnlyStream[Dog] = ReadOnlyStream(Dog())
animal_stream: ReadOnlyStream[Animal] = dog_stream # Safe because T_co is covariant

print("Covariant stream subtyping verified.")`,
          code_language: 'python',
          code_explanation: 'Covariance allows ReadOnlyStream[Dog] to be safely assigned to ReadOnlyStream[Animal] because items are only read, never written.',
          expected_output: `Covariant stream subtyping verified.`,
          quiz: {
            id: 'quiz-l4-variance',
            title: 'Variance Check',
            questions: [
              {
                id: 'q-l4-vr-1',
                question_text: 'Why is a mutable list (list[T]) invariant rather than covariant in static type theory?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because lists cannot hold subclasses.' },
                  { id: 'opt_2', text: 'Because if list[Dog] were accepted where list[Animal] is expected, a caller could append a Cat, corrupting the dog list.' },
                  { id: 'opt_3', text: 'Because variance only applies to numbers.' },
                  { id: 'opt_4', text: 'Because CPython disables subtyping.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Mutable collections must be invariant. If a dog list were treated as an animal list, callers could insert other animal subtypes (cats), violating type safety.'
              }
            ]
          },
          key_takeaways: [
            'Use bound=Base to constrain a TypeVar to subclasses of a specific type.',
            'Read-only sources should be covariant (covariant=True).',
            'Write-only sinks should be contravariant (contravariant=True); mutable read-write containers must be invariant.'
          ],
          revision_prompts: [
            'Why are function parameter types contravariant while function return types are covariant?',
            'How does Python 3.12 syntax express variance: type Container[+T] and type Sink[-T]?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-protocols-structural-subtyping',
          slug: 'protocols-and-structural-subtyping',
          title: 'Protocols and Structural Subtyping: Pythonic Static Duck Typing (PEP 544)',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 7,
          summary: 'Embrace static duck typing using typing.Protocol: Define interfaces by shape and behavior without rigid inheritance hierarchies.',
          learning_objectives: [
            'Differentiate nominal subtyping (ABC inheritance) from structural subtyping (Protocols)',
            'Define structural contracts using typing.Protocol',
            'Enable runtime isinstance() checks using the @runtime_checkable decorator'
          ],
          content_markdown: `### Nominal vs Structural Subtyping

- **Nominal Subtyping (Abstract Base Classes)**: A class is considered an implementation **only** if it explicitly inherits from the base class: \`class MyWriter(ABCWriter):\`. Rigid and couples packages together.
- **Structural Subtyping (Protocols / Duck Typing)**: A class satisfies the contract if it possesses the **matching methods and signatures**, with **no inheritance required**!
  > "If it walks like a duck and quacks like a duck, static type checkers treat it as a duck."

### Defining a Protocol
Inherit from \`typing.Protocol\`. Any class implementing the declared methods automatically satisfies the type checker.`,
          code_snippet: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Renderable(Protocol):
    """Structural protocol: Any object with a render() -> str method."""
    def render(self) -> str: ...

# Class A: Unrelated third-party class with NO inheritance
class MarkdownDoc:
    def render(self) -> str:
        return "# Markdown Header"

# Class B: Completely different class
class HtmlWidget:
    def render(self) -> str:
        return "<div>Widget</div>"

def display_content(item: Renderable):
    print("Rendered:", item.render())

# Both classes satisfy Renderable purely by structural match!
display_content(MarkdownDoc())
display_content(HtmlWidget())
print("isinstance check with @runtime_checkable:", isinstance(MarkdownDoc(), Renderable))`,
          code_language: 'python',
          code_explanation: 'Neither class inherits from Renderable, yet static type checkers and runtime checks accept both because they implement the render() method.',
          expected_output: `Rendered: # Markdown Header
Rendered: <div>Widget</div>
isinstance check with @runtime_checkable: True`,
          quiz: {
            id: 'quiz-l4-protocols',
            title: 'Protocols Check',
            questions: [
              {
                id: 'q-l4-pr-1',
                question_text: 'What is the primary architectural advantage of `typing.Protocol` over `abc.ABC`?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Protocols run faster.' },
                  { id: 'opt_2', text: 'Classes do not need to explicitly inherit from the Protocol; structural compatibility is verified automatically by matching methods.' },
                  { id: 'opt_3', text: 'Protocols do not allow type hints.' },
                  { id: 'opt_4', text: 'Protocols can only have 1 method.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Protocols implement structural subtyping (duck typing). Implementations do not need to import or subclass the Protocol, decoupling packages completely.'
              }
            ]
          },
          key_takeaways: [
            'Protocols bring static type safety to Python duck typing.',
            'Classes satisfy a Protocol purely by implementing matching method signatures.',
            'Decorate with @runtime_checkable to allow isinstance() and issubclass() checks at runtime.'
          ],
          revision_prompts: [
            'When should you prefer an ABC over a Protocol in library design?',
            'What happens if an implementation has a matching method name but incompatible parameter types?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-callable-types-parameter-specs',
          slug: 'callable-types-and-parameter-specs',
          title: 'Callable Types and Parameter Specs: Typing Higher-Order Functions and Decorators',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 8,
          summary: 'Type function arguments and returns using collections.abc.Callable, and preserve decorator signatures using ParamSpec and Concatenate.',
          learning_objectives: [
            'Annotate function callbacks using collections.abc.Callable[[ArgTypes], ReturnType]',
            'Solve decorator signature erasure using typing.ParamSpec (PEP 612)',
            'Add parameters to decorated functions using typing.Concatenate'
          ],
          content_markdown: `### Annotating Callables

A function callback is annotated using:
\`\`\`python
Callable[[int, str], bool] # Takes int and str, returns bool
Callable[..., str]        # Takes arbitrary arguments, returns str
\`\`\`

### The Decorator Signature Erasure Problem

Standard decorators often wipe out parameter hints:
\`\`\`python
def my_dec(func: Callable[..., Any]) -> Callable[..., Any]: ...
\`\`\`
Any IDE inspecting the decorated function loses autocomplete for its original parameters!

### The Solution: \`ParamSpec\` (PEP 612)
\`ParamSpec\` captures the exact parameter specification (all positional and keyword argument types) of the wrapped function and transfers them onto the wrapper, preserving 100% of IDE autocomplete!`,
          code_snippet: `from typing import TypeVar, ParamSpec, Callable
from functools import wraps

P = ParamSpec("P")
R = TypeVar("R")

def audit_decorator(func: Callable[P, R]) -> Callable[P, R]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"[CALL] Invoking {func.__name__}...")
        return func(*args, **kwargs)
    return wrapper

@audit_decorator
def calculate_salary(base: float, bonus: float = 0.0) -> float:
    return base + bonus

# Type checkers preserve parameter names (base, bonus) and return float!
total = calculate_salary(85000.0, bonus=5000.0)
print("Calculated salary:", total)`,
          code_language: 'python',
          code_explanation: 'ParamSpec captures the exact parameter signature of calculate_salary, ensuring type checkers preserve parameter names and types after decoration.',
          expected_output: `[CALL] Invoking calculate_salary...
Calculated salary: 90000.0`,
          quiz: {
            id: 'quiz-l4-paramspec',
            title: 'Callable & ParamSpec Check',
            questions: [
              {
                id: 'q-l4-ps-1',
                question_text: 'What problem does `typing.ParamSpec` solve when writing Python decorators?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It prevents decorator infinite loops.' },
                  { id: 'opt_2', text: 'It preserves the exact parameter types and names of the decorated function for IDEs and type checkers.' },
                  { id: 'opt_3', text: 'It compiles the wrapper into C code.' },
                  { id: 'opt_4', text: 'It turns synchronous functions into async coroutines.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'ParamSpec captures positional and keyword arguments as a unified specification, preventing the loss of parameter hints when functions are wrapped.'
              }
            ]
          },
          key_takeaways: [
            'Callable[[ArgTypes], ReturnType] annotates callback parameters.',
            'ParamSpec preserves parameter signatures across decorator wrappers.',
            'Use typing.Concatenate when a decorator injects or modifies leading arguments.'
          ],
          revision_prompts: [
            'How does typing.Concatenate allow decorating methods that inject a db_session parameter?',
            'What is the difference between Callable[[], None] and Callable[..., None]?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-typeddict-dataclasses-models',
          slug: 'typed-data-models-and-return-contracts',
          title: 'Typed Data Models: TypedDict vs dataclass vs NamedTuple',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 9,
          summary: 'Choose the right data modeling primitive: TypedDict for JSON dictionaries, dataclasses for domain models, and NamedTuple for immutable records.',
          learning_objectives: [
            'Model heterogeneous dictionary schemas using typing.TypedDict with total=False',
            'Build rich domain models with @dataclass and slots=True',
            'Contrast memory footprints and validation characteristics across primitives'
          ],
          content_markdown: `### Choosing Your Data Modeling Primitive

| Tool | Underlying Type | Mutable? | Best Use Case |
| :--- | :--- | :--- | :--- |
| **\`TypedDict\`** | Standard \`dict\` | Yes | Interacting with external JSON APIs, HTTP bodies |
| **\`dataclass\`** | Custom Class | Configurable | Domain entities, business logic, rich methods |
| **\`NamedTuple\`** | Standard \`tuple\` | No (Immutable) | Lightweight database rows, coordinate records |

### \`TypedDict\` with \`NotRequired\`
In Python 3.11+, use \`typing.NotRequired[T]\` to mark optional keys in JSON dictionaries without setting \`total=False\` globally.`,
          code_snippet: `from typing import TypedDict
from dataclasses import dataclass

# 1. TypedDict for raw API payloads
class UserApiPayload(TypedDict):
    id: int
    username: str
    email: str

# 2. Dataclass for domain model with slots for memory efficiency
@dataclass(slots=True)
class UserDomainModel:
    id: int
    username: str
    email: str
    
    def display_name(self) -> str:
        return f"{self.username} <{self.email}>"

# TypedDict is a pure dict at runtime!
raw_json: UserApiPayload = {"id": 101, "username": "alex", "email": "alex@revoraa.com"}
print("TypedDict is isinstance dict?:", isinstance(raw_json, dict))

# Domain model instantiation
user = UserDomainModel(raw_json["id"], raw_json["username"], raw_json["email"])
print("Domain model display name:", user.display_name())`,
          code_language: 'python',
          code_explanation: 'TypedDict provides static dictionary key validation for JSON payloads, while dataclasses provide structured domain entities.',
          expected_output: `TypedDict is isinstance dict?: True
Domain model display name: alex <alex@revoraa.com>`,
          quiz: {
            id: 'quiz-l4-models',
            title: 'Data Models Check',
            questions: [
              {
                id: 'q-l4-dm-1',
                question_text: 'What is a key difference at runtime between a TypedDict and a dataclass?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'TypedDict creates a binary SQLite table.' },
                  { id: 'opt_2', text: 'A TypedDict is a standard Python dict at runtime with zero instantiation overhead; a dataclass is a custom instance object.' },
                  { id: 'opt_3', text: 'dataclasses cannot hold strings.' },
                  { id: 'opt_4', text: 'TypedDict requires compiling with Cython.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'TypedDict does not create a new class type at runtime—it is an ordinary dict. dataclass generates a full class with __init__, __repr__, and __eq__.'
              }
            ]
          },
          key_takeaways: [
            'Use TypedDict to type dictionary shapes for JSON APIs without serialization overhead.',
            'Use @dataclass(slots=True) for rich domain models with methods and high memory efficiency.',
            'Use NamedTuple for lightweight, hashable, immutable record structures.'
          ],
          revision_prompts: [
            'What does slots=True in a dataclass do to memory layout?',
            'What is the difference between TypedDict total=True and total=False?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-static-analysis-mypy-pyright',
          slug: 'static-analysis-and-type-checking-fundamentals',
          title: 'Static Analysis Fundamentals: Mypy, Pyright, and CI Verification',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 10,
          summary: 'Configure static type checking in CI/CD pipelines, understand pyproject.toml strict flags, and type stub files (.pyi).',
          learning_objectives: [
            'Configure Mypy and Pyright strictness rules in pyproject.toml',
            'Understand type stub files (.pyi) and the typeshed repository',
            'Integrate static type checking as an automated gate in CI/CD pipelines'
          ],
          content_markdown: `### Integrating Type Checkers in CI

Static type checking should be an automated, non-negotiable step in your CI/CD test suite:
- **Mypy**: The reference type checker maintained by the Python core team.
- **Pyright**: Microsoft's high-speed type checker powering VS Code Pylance.

### Recommended \`pyproject.toml\` Configuration
\`\`\`toml
[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
no_implicit_optional = true
\`\`\`

### Type Stubs (\`.pyi\`)
For legacy libraries or C extensions that lack inline annotations, stub files (\`.pyi\`) declare type signatures in parallel without modifying source code.`,
          code_snippet: `def sample_type_check_rules():
    rules = [
        ("disallow_untyped_defs", "Rejects functions lacking parameter or return annotations"),
        ("no_implicit_optional", "Requires explicit T | None instead of defaulting to None"),
        ("warn_return_any",       "Flags when a typed function accidentally returns Any"),
        ("strict_equality",      "Prevents comparing incompatible types (e.g. str == int)")
    ]
    print("Core Mypy / Pyright Strictness Flags:")
    for flag, desc in rules:
        print(f" -> {flag:22}: {desc}")

sample_type_check_rules()`,
          code_language: 'python',
          code_explanation: 'Strict type checking flags prevent subtle defects from escaping into production by disallowing implicit Any types and untyped functions.',
          expected_output: `Core Mypy / Pyright Strictness Flags:
 -> disallow_untyped_defs : Rejects functions lacking parameter or return annotations
 -> no_implicit_optional  : Requires explicit T | None instead of defaulting to None
 -> warn_return_any       : Flags when a typed function accidentally returns Any
 -> strict_equality       : Prevents comparing incompatible types (e.g. str == int)`,
          quiz: {
            id: 'quiz-l4-static-ci',
            title: 'Static Analysis Check',
            questions: [
              {
                id: 'q-l4-sc-1',
                question_text: 'What does the mypy flag `disallow_untyped_defs = true` enforce?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It prevents writing comments.' },
                  { id: 'opt_2', text: 'It reports an error if any function definition is missing type annotations on its parameters or return value.' },
                  { id: 'opt_3', text: 'It deletes untyped functions.' },
                  { id: 'opt_4', text: 'It turns off unit tests.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'disallow_untyped_defs forces full typing coverage across the codebase by flagging any function definition that omits annotations.'
              }
            ]
          },
          key_takeaways: [
            'Configure Mypy or Pyright in pyproject.toml with strict mode enabled.',
            'Enforce type checks in continuous integration before code reviews.',
            'Use stub files (.pyi) to type external C extensions or untyped third-party packages.'
          ],
          revision_prompts: [
            'What is the reveal_type() helper function and how is it used during type debugging?',
            'What does # type: ignore[error-code] do and why should it be used sparingly?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-designing-reusable-typed-interfaces',
          slug: 'designing-reusable-typed-interfaces',
          title: 'Designing Reusable Typed Interfaces: Contract Architecture',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 11,
          summary: 'Architect clean, loosely-coupled packages using Protocol boundaries, Typed return contracts, and dependency substitution.',
          learning_objectives: [
            'Combine Protocols, Generics, and TypeAliases into a cohesive architectural interface',
            'Isolate domain layers from storage layers using typed repository boundaries',
            'Enable seamless mock substitution in automated tests'
          ],
          content_markdown: `### The Typed Interface Pattern

A well-architected Python system defines **typed contracts** at module boundaries:
1. **Domain Entities**: Defined as dataclasses or TypedDicts.
2. **Service Interfaces**: Defined as Protocols.
3. **Implementations**: Multiple interchangeable classes (e.g. SQLite, PostgreSQL, Mock Memory) satisfying the Protocol structurally.

Because consumers type-hint against the Protocol, switching from an in-memory test store to a production database requires zero changes to business logic!`,
          code_snippet: `from typing import Protocol, TypeVar
from dataclasses import dataclass

@dataclass
class Account:
    id: str
    balance: float

class AccountRepository(Protocol):
    """Architectural contract boundary."""
    def get_by_id(self, account_id: str) -> Account | None: ...
    def save(self, account: Account) -> None: ...

# In-Memory implementation for automated testing
class MemoryAccountRepo:
    def __init__(self):
        self._store: dict[str, Account] = {}

    def get_by_id(self, account_id: str) -> Account | None:
        return self._store.get(account_id)

    def save(self, account: Account) -> None:
        self._store[account.id] = account

# Business logic consumes the Protocol contract!
def deposit_funds(repo: AccountRepository, account_id: str, amount: float) -> float:
    acct = repo.get_by_id(account_id)
    if not acct:
        raise ValueError("Account not found")
    acct.balance += amount
    repo.save(acct)
    return acct.balance

repo = MemoryAccountRepo()
repo.save(Account("ACCT_100", 500.0))
new_bal = deposit_funds(repo, "ACCT_100", 250.0)
print("Updated balance:", new_bal)`,
          code_language: 'python',
          code_explanation: 'deposit_funds depends strictly on the AccountRepository Protocol, decoupling business logic from concrete storage implementations.',
          expected_output: `Updated balance: 750.0`,
          quiz: {
            id: 'quiz-l4-typed-interfaces',
            title: 'Typed Interfaces Check',
            questions: [
              {
                id: 'q-l4-ti-1',
                question_text: 'How does typing business logic against a Protocol interface improve software testability?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It disables test assertions.' },
                  { id: 'opt_2', text: 'Tests can supply lightweight in-memory implementations that satisfy the Protocol without requiring real external databases.' },
                  { id: 'opt_3', text: 'It automatically writes unit tests.' },
                  { id: 'opt_4', text: 'It eliminates the need for test mocks.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'By depending on Protocol contracts rather than concrete database classes, unit tests can substitute fast in-memory stores seamlessly.'
              }
            ]
          },
          key_takeaways: [
            'Define architectural service boundaries using typing.Protocol.',
            'Business services should depend on Protocol interfaces, not concrete implementations.',
            'Typed contracts make automated testing with fast in-memory substitutes trivial.'
          ],
          revision_prompts: [
            'How does this approach mirror the Dependency Inversion Principle (DIP)?',
            'What happens if an in-memory repository implementation omits one of the Protocol methods?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-balancing-typing-with-readability',
          slug: 'balancing-strict-typing-with-readability',
          title: 'Balancing Strict Typing with Readability: Avoiding Type System Gymnastics',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 12,
          summary: 'Avoid over-engineering type signatures, when to use cast(), and keeping Python code readable and ergonomic.',
          learning_objectives: [
            'Identify type over-engineering (excessive type gymnastics that hinder readability)',
            'Use typing.cast() judiciously when static analysis cannot infer valid runtime types',
            'Balance static verification guarantees with Pythonic developer ergonomics'
          ],
          content_markdown: `### The Trap of Type System Gymnastics

While static typing provides immense value, taking typing to an extreme can produce signatures that are harder to read than C++ template metaprogramming:
- **Red Flag**: A 5-line signature with 6 nested \`TypeVar\`, \`Concatenate\`, and \`Union\` constraints for a simple 3-line helper function.
- **The Pragmatic Balance**: The goal of typing is to **help developers catch bugs and document intent**, not to prove mathematical perfection at the expense of readability.

### When to Use \`typing.cast()\`
Sometimes you know more than the type checker (e.g. after verifying external invariants):
\`\`\`python
val = typing.cast(str, complex_payload["user"])
\`\`\`
- \`cast()\` tells the static type checker to treat the value as that type.
- **At runtime, \`cast()\` is a no-op that returns the value directly.** Use it sparingly when the type checker cannot follow dynamic logic.`,
          code_snippet: `from typing import cast, Any

def fetch_untyped_legacy_data() -> dict[str, Any]:
    # Simulates an untyped third-party JSON API response
    return {"status": "ok", "user_count": 42}

def process_active_users() -> int:
    raw_data = fetch_untyped_legacy_data()
    # Using cast() to inform the type checker after validating the key
    if "user_count" in raw_data and isinstance(raw_data["user_count"], int):
        count = cast(int, raw_data["user_count"])
        return count * 2
    return 0

print("Processed active count:", process_active_users())`,
          code_language: 'python',
          code_explanation: 'cast() tells the static analyzer to treat raw_data["user_count"] as int after explicit runtime validation.',
          expected_output: `Processed active count: 84`,
          quiz: {
            id: 'quiz-l4-typing-balance',
            title: 'Typing Ergonomics Check',
            questions: [
              {
                id: 'q-l4-tb-1',
                question_text: 'What does `typing.cast(TargetType, value)` do at runtime during execution?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It converts the value using TargetType(value).' },
                  { id: 'opt_2', text: 'Nothing; it is a no-op that simply returns the original value unchanged, serving solely as a hint for static type checkers.' },
                  { id: 'opt_3', text: 'It raises an exception if value is not an instance of TargetType.' },
                  { id: 'opt_4', text: 'It serializes the object to disk.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'typing.cast() has zero runtime behavior—it literally returns value unchanged. It is solely an instruction to satisfy the static type checker.'
              }
            ]
          },
          key_takeaways: [
            'Type annotations should enhance clarity, not obscure business logic.',
            'typing.cast() is a static analyzer override with zero runtime overhead or validation.',
            'Strive for pragmatic typing that catches real-world defects while remaining enjoyable to read.'
          ],
          revision_prompts: [
            'Why is typing.cast() dangerous if not preceded by actual runtime validation?',
            'What is the difference between typing.assert_never() and a standard Exception?'
          ]
        }
      ]
    }
  ]
};
