/**
 * Revoraa Level 3: Intermediate Python - Module 7: Modular Design and Maintainability
 * 
 * 10 comprehensive lessons covering module organization, package structure,
 * circular imports, utility design, separation of concerns, configuration, logging,
 * refactoring code smells, type hints, and testing modular architectures.
 */

export const MODULE_7_MODULAR_DESIGN = {
  id: 'mod-py-modular-design',
  slug: 'modular-design-maintainability',
  level_number: 3,
  title: 'Modular Design and Maintainability',
  description: 'Organize code into clean packages, eliminate circular imports, decouple architecture layers, configure logging, and apply clean code refactoring.',
  estimated_hours: 6,
  sort_order: 7,
  is_published: true,
  topics: [
    {
      id: 'top-modular-clean-code',
      slug: 'architecture-and-maintainability',
      title: 'Package Architecture & Code Maintainability',
      summary: 'Explore modular decomposition, clean imports, logging, refactoring, and separation of concerns.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-organizing-code-modules',
          slug: 'organizing-code-into-modules',
          title: 'Organizing Code into Modules',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Transition from single monolithic scripts to cohesive multi-module architectures using Python namespaces and sys.path.',
          learning_objectives: [
            'Understand what constitutes a Python module (.py file) and namespace',
            'Trace module resolution through sys.path and sys.modules',
            'Decompose monolithic scripts into single-responsibility modules'
          ],
          content_markdown: `### From Monolith to Modules

In beginner programming, writing everything in a single 1,000-line \`main.py\` file is common. In intermediate systems, this causes merge conflicts, cognitive overload, and spaghetti dependencies.

A **module** in Python is simply a \`.py\` file. When you write \`import math\`, Python:
1. Checks **\`sys.modules\`** cache (if already loaded, returns the cached module).
2. If not cached, searches the directories in **\`sys.path\`**.
3. Compiles the file to bytecode (\`.pyc\`), executes module-level statements, and stores the resulting namespace dictionary in \`sys.modules\`.

\`\`\`
my_project/
├── app.py          # Main entrypoint
├── models.py       # Entity data models
├── validators.py   # Pure validation functions
└── database.py     # Database connection and queries
\`\`\``,
          code_snippet: `import sys

# Inspecting module search paths and cached modules
print("Top 3 module search directories in sys.path:")
for path in sys.path[:3]:
    print(f"  -> {path}")

# Demonstrating namespace inspection
import math
print("\\nMath module namespace keys (sample):")
math_keys = [k for k in dir(math) if not k.startswith("_")][:5]
print(" ", math_keys)
print(f"Is math cached in sys.modules? {'math' in sys.modules}")`,
          code_language: 'python',
          code_explanation: 'Inspects Python\'s module resolution paths in sys.path and proves that imported modules are cached in sys.modules.',
          expected_output: `Top 3 module search directories in sys.path:
  -> ...
Math module namespace keys (sample):
  ['acos', 'acosh', 'asin', 'asinh', 'atan']
Is math cached in sys.modules? True`,
          quiz: {
            id: 'quiz-organizing-modules',
            title: 'Knowledge Check: Organizing Modules',
            questions: [
              {
                id: 'q-om-1',
                question_text: 'Where does Python check first to see if an imported module has already been loaded into memory?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'sys.path' },
                  { id: 'opt_2', text: 'sys.modules' },
                  { id: 'opt_3', text: 'The Windows Registry' },
                  { id: 'opt_4', text: '__pycache__' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'sys.modules is a dictionary acting as a module cache. If a module name is present in sys.modules, Python returns it immediately without re-reading disk.'
              }
            ]
          },
          key_takeaways: [
            'Every .py file is a module with its own isolated global namespace.',
            'sys.path defines the directories searched during import.',
            'sys.modules caches loaded modules to avoid redundant imports.'
          ],
          revision_prompts: [
            'What happens if you mutate sys.path at runtime in Python?',
            'What is the difference between import foo and from foo import bar?'
          ]
        },

        // Lesson 2
        {
          id: 'les-imports-package-structure',
          slug: 'imports-and-package-structure',
          title: 'Imports, Package Structure, and __all__',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Structure production packages with __init__.py, contrast absolute and relative imports, and expose clean public APIs with __all__.',
          learning_objectives: [
            'Design directory packages containing __init__.py',
            'Contrast absolute imports (pkg.module) with explicit relative imports (.sibling)',
            'Define public API exports using the __all__ dunder list'
          ],
          content_markdown: `### What Is a Python Package?

A **package** is a directory containing Python modules:

\`\`\`
ecommerce/
├── __init__.py        # Defines package public interface
├── models/
│   ├── __init__.py
│   ├── user.py
│   └── order.py
└── services/
    ├── __init__.py
    └── payment.py
\`\`\`

### Absolute vs Relative Imports
- **Absolute Import**: \`from ecommerce.models.user import User\` (Clear, explicit, recommended by PEP 8).
- **Relative Import**: \`from .order import Order\` or \`from ..models.user import User\` (Convenient inside packages, but cannot be run directly as a standalone script).

### Controlling Public API with \`__all__\`
In \`__init__.py\`, specify **\`__all__\`** to control what gets imported when users write \`from package import *\`:

\`\`\`python
# __init__.py
__all__ = ["ApiClient", "ApiError"]
from .client import ApiClient
from .exceptions import ApiError
\`\`\``,
          code_snippet: `# Simulating package exports controlled by __all__
class PublicClient:
    pass

class InternalHelper:
    pass

# Package namespace export definition
__all__ = ["PublicClient"]

# Verify export filtering simulation
exported_symbols = [sym for sym in ["PublicClient", "InternalHelper"] if sym in __all__]
print("Symbols exported by __all__:", exported_symbols)`,
          code_language: 'python',
          code_explanation: 'Demonstrates defining __all__ to declare the official public API of a module while keeping internal helper classes private.',
          expected_output: `Symbols exported by __all__: ['PublicClient']`,
          quiz: {
            id: 'quiz-package-structure',
            title: 'Knowledge Check: Package Structure',
            questions: [
              {
                id: 'q-ps-1',
                question_text: 'What is the role of the __all__ variable in a Python module or __init__.py?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It deletes all unused variables.' },
                  { id: 'opt_2', text: 'It lists the public symbol names exported when someone executes "from module import *".' },
                  { id: 'opt_3', text: 'It enforces strict typing across all functions.' },
                  { id: 'opt_4', text: 'It lists all installed pip packages.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: '__all__ defines the public interface of a module, dictating which names are imported during wildcard imports.'
              }
            ]
          },
          key_takeaways: [
            'Packages are folders containing __init__.py and modules.',
            'Prefer absolute imports for clarity and maintainability.',
            'Use __all__ to hide internal implementation details from library consumers.'
          ],
          revision_prompts: [
            'What is a namespace package (PEP 420) and how does it work without __init__.py?',
            'Why does running python package/module.py fail when relative imports are used?'
          ]
        },

        // Lesson 3
        {
          id: 'les-avoiding-circular-imports',
          slug: 'avoiding-circular-imports',
          title: 'Diagnosing and Avoiding Circular Imports',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Understand the mechanics of ImportError: cannot import name cycles and resolve them using clean dependency DAGs.',
          learning_objectives: [
            'Understand why circular imports cause partially initialized module errors',
            'Refactor cyclic architectures into clean Directed Acyclic Graphs (DAGs)',
            'Apply emergency deferred local imports when architectural refactoring is constrained'
          ],
          content_markdown: `### The Circular Import Deadlock

Circular imports happen when two modules depend on each other:
1. \`module_a.py\` executes \`from module_b import helper_b\`.
2. Python begins executing \`module_b.py\`, which hits \`from module_a import helper_a\`.
3. But \`module_a\` has NOT finished initializing yet! \`helper_a\` does not exist in its namespace!
4. Python raises: **\`ImportError: cannot import name 'helper_a' from partially initialized module 'module_a'\`**.

### Clean Architectural Solutions
1. **Extract Shared Abstractions**: Move the shared data types, exceptions, or helper functions into a third module (e.g. \`common.py\` or \`models.py\`). Both \`A\` and \`B\` now import from \`common\`, creating a clean Directed Acyclic Graph (DAG).
2. **Import Module, Not Symbol**: Write \`import module_a\` instead of \`from module_a import func\`. Accessing \`module_a.func()\` at call time avoids premature symbol binding.
3. **Local Deferred Import**: Move the import inside the specific function that uses it.`,
          code_snippet: `# Simulating clean DAG architecture vs circular dependency
# Circular anti-pattern:
# users.py imports Order from orders.py
# orders.py imports User from users.py

# Solution: Extract shared domain entity or common interfaces
class CommonUser:
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name

class CommonOrder:
    def __init__(self, order_id, user_id, amount):
        self.order_id = order_id
        self.user_id = user_id
        self.amount = amount

# Both users_service and orders_service depend on common, creating a DAG:
# users_service -> common <- orders_service (Zero circular cycles!)
print("Architecture Refactoring:")
print("  Dependency Graph: [Service A] ──► [Common Models] ◄── [Service B]")
print("  Cyclic dependencies eliminated successfully.")`,
          code_language: 'python',
          code_explanation: 'Illustrates refactoring circular dependencies into a clean Directed Acyclic Graph by extracting shared models into a common layer.',
          expected_output: `Architecture Refactoring:
  Dependency Graph: [Service A] ──► [Common Models] ◄── [Service B]
  Cyclic dependencies eliminated successfully.`,
          quiz: {
            id: 'quiz-circular-imports',
            title: 'Knowledge Check: Circular Imports',
            questions: [
              {
                id: 'q-ci-1',
                question_text: 'What is the most robust architectural solution to resolve a circular import between module A and module B?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Merge all project files into a single 5000-line script.' },
                  { id: 'opt_2', text: 'Extract shared dependencies and types into a third module that both A and B can import without cycles.' },
                  { id: 'opt_3', text: 'Disable Python bytecode compilation.' },
                  { id: 'opt_4', text: 'Use global variables across modules.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Extracting shared types or interfaces into a separate common module breaks the cycle, forming a clean acyclic dependency graph.'
              }
            ]
          },
          key_takeaways: [
            'Circular imports cause partially initialized module errors.',
            'Design dependencies as a Directed Acyclic Graph (DAG).',
            'Extract shared entities into separate models or common modules.'
          ],
          revision_prompts: [
            'Why does "import a" sometimes work in circular imports when "from a import b" fails?',
            'What is the downside of using local function-level imports as a quick fix?'
          ]
        },

        // Lesson 4
        {
          id: 'les-reusable-utility-modules',
          slug: 'reusable-utility-modules',
          title: 'Designing Reusable Utility Modules',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Build high-cohesion helper modules with single responsibilities, avoiding the catch-all utils.py dumping ground.',
          learning_objectives: [
            'Recognize the "utils.py" antipattern and decompose it into cohesive units',
            'Build focused modules: text_helpers, date_utils, validation',
            'Ensure utility functions remain pure and stateless'
          ],
          content_markdown: `### The "utils.py" Antipattern

In many codebases, \`utils.py\` becomes a 2,000-line junk drawer containing database queries, string formatting, cryptography helpers, and email senders.

When \`utils.py\` has low cohesion:
- Any change risks breaking unrelated parts of the codebase.
- Testing becomes tedious because unit tests pull in unnecessary dependencies.

### High Cohesion Architecture
Break utilities into focused, domain-specific modules:
- \`string_utils.py\`: Slug generation, sanitization, case conversion.
- \`validation.py\`: Regex checks, range guards, email validation.
- \`time_helpers.py\`: Timezone conversions, timestamp parsing.`,
          code_snippet: `# Example of a focused, high-cohesion string validation module
import re

class TextValidationUtils:
    @staticmethod
    def is_valid_slug(text: str) -> bool:
        """Verifies if text contains only lowercase alphanumeric characters and hyphens."""
        return bool(re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", text))

    @staticmethod
    def truncate_words(text: str, max_words: int, suffix: str = "...") -> str:
        words = text.split()
        if len(words) <= max_words:
            return text
        return " ".join(words[:max_words]) + suffix

print("Is 'python-3-guide' valid slug?  ", TextValidationUtils.is_valid_slug("python-3-guide"))
print("Is 'Python Guide!!' valid slug?  ", TextValidationUtils.is_valid_slug("Python Guide!!"))
print("Truncated summary:               ", TextValidationUtils.truncate_words("The quick brown fox jumps over the lazy dog", 4))`,
          code_language: 'python',
          code_explanation: 'Demonstrates a focused, cohesive utility module with pure static functions for slug verification and word truncation.',
          expected_output: `Is 'python-3-guide' valid slug?   True
Is 'Python Guide!!' valid slug?   False
Truncated summary:                The quick brown fox...`,
          quiz: {
            id: 'quiz-utility-modules',
            title: 'Knowledge Check: Utility Design',
            questions: [
              {
                id: 'q-um-1',
                question_text: 'Why is a monolithic "utils.py" file considered an architectural code smell?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Python restricts files to 100 lines.' },
                  { id: 'opt_2', text: 'It suffers from low cohesion and high coupling, mixing unrelated responsibilities.' },
                  { id: 'opt_3', text: 'Utility files cannot be imported.' },
                  { id: 'opt_4', text: 'It uses too much disk space.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A catch-all utils.py lacks cohesion, making code navigation difficult and creating hidden inter-module dependencies.'
              }
            ]
          },
          key_takeaways: [
            'Group utilities by domain: string_utils, date_helpers, validation.',
            'Keep utility functions pure and stateless where possible.',
            'High cohesion makes utility modules easy to unit test.'
          ],
          revision_prompts: [
            'When should a utility function be converted into an instance method of a class?',
            'How can package-level __all__ be used to export utilities cleanly?'
          ]
        },

        // Lesson 5
        {
          id: 'les-separation-of-concerns',
          slug: 'separation-of-concerns',
          title: 'Separation of Concerns: Multi-Tier Architecture',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Structure applications into clean architectural layers: Presentation (CLI/API) -> Business Logic (Service) -> Data Access (Repository).',
          learning_objectives: [
            'Understand the 3-tier architecture: Presentation, Domain/Service, and Data Access',
            'Decouple business rules from input parsing and SQL database execution',
            'Enable painless swapping of CLI with Web APIs or SQLite with PostgreSQL'
          ],
          content_markdown: `### The 3 Core Architectural Layers

1. **Presentation Layer (Interface)**:
   - Formats user output, parses CLI flags, or handles HTTP requests.
   - Example: \`cli_app.py\` or \`web_routes.py\`.
2. **Business Logic Layer (Services)**:
   - Contains core business rules, validation calculations, and domain logic.
   - Completely independent of HTTP or database SQL!
   - Example: \`order_service.py\` or \`grading_engine.py\`.
3. **Data Access Layer (Persistence / Repositories)**:
   - Handles saving and loading records from SQLite, files, or APIs.
   - Example: \`student_repository.py\`.

\`\`\`
Presentation (CLI / Web) ──► Business Logic (Service) ──► Data Access (Repository)
\`\`\``,
          code_snippet: `# Demonstrating 3-tier architectural decoupling
# Tier 3: Data Access (In-memory storage)
class TaskRepository:
    def __init__(self):
        self._storage = {}

    def save(self, task_id, title):
        self._storage[task_id] = {"title": title, "done": False}

    def find_all(self):
        return list(self._storage.values())

# Tier 2: Business Logic Service
class TaskService:
    def __init__(self, repo: TaskRepository):
        self.repo = repo

    def create_task(self, task_id, title):
        clean_title = title.strip()
        if len(clean_title) < 3:
            raise ValueError("Task title must be at least 3 characters long")
        self.repo.save(task_id, clean_title)

# Tier 1: Presentation CLI Controller
class TaskCliController:
    def __init__(self, service: TaskService):
        self.service = service

    def handle_user_input(self, user_text):
        try:
            self.service.create_task(1, user_text)
            return f"SUCCESS: Task recorded"
        except ValueError as err:
            return f"VALIDATION_ERROR: {err}"

# Wiring the layers
repo = TaskRepository()
service = TaskService(repo)
cli = TaskCliController(service)

print(cli.handle_user_input("   "))
print(cli.handle_user_input("Build Modular Architecture"))`,
          code_language: 'python',
          code_explanation: 'Demonstrates a complete 3-tier architecture separating the Presentation CLI from the Business TaskService and the Data TaskRepository.',
          expected_output: `VALIDATION_ERROR: Task title must be at least 3 characters long
SUCCESS: Task recorded`,
          quiz: {
            id: 'quiz-separation-concerns',
            title: 'Knowledge Check: Separation of Concerns',
            questions: [
              {
                id: 'q-sc-1',
                question_text: 'In a properly decoupled 3-tier architecture, where should SQL queries be written?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'In the Presentation CLI controller.' },
                  { id: 'opt_2', text: 'Exclusively inside the Data Access / Repository layer.' },
                  { id: 'opt_3', text: 'Directly inside unit tests.' },
                  { id: 'opt_4', text: 'In HTML templates.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'SQL statements belong strictly in the Data Access layer, leaving the business service and presentation layers agnostic of database syntax.'
              }
            ]
          },
          key_takeaways: [
            'Separate Presentation, Business Service, and Persistence layers.',
            'Business logic should not know whether output is printed to a CLI terminal or sent over an HTTP socket.',
            'Decoupled layers can be unit-tested in isolation without mocking the entire system.'
          ],
          revision_prompts: [
            'How does dependency injection facilitate swapping out the Repository layer during tests?',
            'What is the difference between a DTO (Data Transfer Object) and a Domain Entity?'
          ]
        },

        // Lesson 6
        {
          id: 'les-config-vs-hardcoding',
          slug: 'configuration-vs-hardcoding',
          title: 'Configuration versus Hard-Coded Values',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Apply 12-Factor principles to extract magic numbers and environment constants into strongly typed AppConfig classes.',
          learning_objectives: [
            'Eliminate magic numbers and hardcoded URLs from business logic',
            'Construct an immutable, strongly-typed AppConfig dataclass',
            'Load configuration dynamically from environment dictionaries with fallback defaults'
          ],
          content_markdown: `### The Problem: Magic Constants Everywhere

Writing code like:
\`\`\`python
# Bad: Hardcoded magic constants!
if retries > 5:
    send_alert("https://prod-slack.internal/hook/xyz")
\`\`\`
Causes failures when deploying to staging or changing environments.

### The Solution: Centralized \`AppConfig\`
Adhere to 12-Factor App methodology: **Strict separation of config from code**.

\`\`\`python
@dataclass(frozen=True)
class AppConfig:
    max_retries: int
    webhook_url: str
    debug_mode: bool
\`\`\``,
          code_snippet: `from dataclasses import dataclass

@dataclass(frozen=True)
class ApplicationConfiguration:
    app_env: str
    max_batch_size: int
    enable_cache: bool
    timeout_seconds: float

    @classmethod
    def from_dict(cls, env_dict):
        return cls(
            app_env=env_dict.get("APP_ENV", "development"),
            max_batch_size=int(env_dict.get("MAX_BATCH_SIZE", "50")),
            enable_cache=env_dict.get("ENABLE_CACHE", "true").lower() == "true",
            timeout_seconds=float(env_dict.get("TIMEOUT_SECONDS", "5.0"))
        )

# Example production environment configuration
prod_settings = {
    "APP_ENV": "production",
    "MAX_BATCH_SIZE": "500",
    "ENABLE_CACHE": "true",
    "TIMEOUT_SECONDS": "2.5"
}

config = ApplicationConfiguration.from_dict(prod_settings)
print(f"Loaded config for environment: {config.app_env}")
print(f"Max batch size: {config.max_batch_size} (Cache enabled: {config.enable_cache})")
print(f"Timeout limit:  {config.timeout_seconds}s")`,
          code_language: 'python',
          code_explanation: 'Defines an immutable frozen dataclass ApplicationConfiguration with factory validation and type coercion from environment settings.',
          expected_output: `Loaded config for environment: production
Max batch size: 500 (Cache enabled: True)
Timeout limit:  2.5s`,
          quiz: {
            id: 'quiz-config-hardcoding',
            title: 'Knowledge Check: Configuration Design',
            questions: [
              {
                id: 'q-ch-1',
                question_text: 'Why should dataclass(frozen=True) be used for application configuration objects?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To freeze Python execution.' },
                  { id: 'opt_2', text: 'To make the configuration immutable, preventing accidental runtime tampering with settings.' },
                  { id: 'opt_3', text: 'To encrypt the config in memory.' },
                  { id: 'opt_4', text: 'Frozen dataclasses use zero memory.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'frozen=True guarantees that configuration fields cannot be mutated accidentally after application startup.'
              }
            ]
          },
          key_takeaways: [
            'Centralize configuration in dedicated dataclasses.',
            'Use frozen=True to guarantee immutability.',
            'Coerce types (strings to ints, floats, booleans) during config initialization.'
          ],
          revision_prompts: [
            'How can you validate that required environment variables are not empty on startup?',
            'What is the 12-Factor App principle regarding configuration?'
          ]
        },

        // Lesson 7
        {
          id: 'les-logging-informative-errors',
          slug: 'logging-and-informative-errors',
          title: 'Logging and Informative Error Handling',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Replace print() with Python\'s standard logging module, format timestamps, configure log levels, and raise descriptive exceptions.',
          learning_objectives: [
            'Understand why print() is an antipattern for production observability',
            'Configure logging levels: DEBUG, INFO, WARNING, ERROR, CRITICAL',
            'Format log outputs with timestamps, module names, and severity tags'
          ],
          content_markdown: `### Why \`print()\` Fails in Production

Using \`print()\` for debugging creates severe problems:
1. Cannot be toggled off without modifying source code.
2. Lacks timestamps, log levels, thread IDs, and source file locations.
3. Cannot be routed to different destinations (e.g. stderr, files, log collectors).

### The Standard Library \`logging\` Module

Python includes a complete, high-performance logging subsystem:

\`\`\`python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

logger.info("Application initialized successfully")
logger.warning("Storage volume is at 85% capacity")
logger.error("Failed to authenticate user", exc_info=True)
\`\`\``,
          code_snippet: `import logging
import io

# Setup isolated memory stream for logger demonstration
log_stream = io.StringIO()
logger = logging.getLogger("revoraa.core")
logger.setLevel(logging.DEBUG)

# Configure stream handler and formatter
handler = logging.StreamHandler(log_stream)
formatter = logging.Formatter("[%(levelname)s] %(name)s -> %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

# Emit messages across severity levels
logger.debug("Parsing record #402")
logger.info("Batch processing started")
logger.warning("Slow network response detected (120ms)")
logger.error("Transaction verification failed")

# Inspect captured log output
print(log_stream.getvalue().strip())`,
          code_language: 'python',
          code_explanation: 'Demonstrates configuring Python standard library logging with custom handlers, formatters, and severity levels (DEBUG through ERROR).',
          expected_output: `[DEBUG] revoraa.core -> Parsing record #402
[INFO] revoraa.core -> Batch processing started
[WARNING] revoraa.core -> Slow network response detected (120ms)
[ERROR] revoraa.core -> Transaction verification failed`,
          quiz: {
            id: 'quiz-logging-errors',
            title: 'Knowledge Check: Logging & Errors',
            questions: [
              {
                id: 'q-le-1',
                question_text: 'Which logging level should be used for detailed diagnostic information useful primarily to developers during debugging?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'INFO' },
                  { id: 'opt_2', text: 'DEBUG' },
                  { id: 'opt_3', text: 'WARNING' },
                  { id: 'opt_4', text: 'CRITICAL' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'DEBUG is the most granular log level, intended for deep diagnostic traces that are typically silenced in production environments.'
              }
            ]
          },
          key_takeaways: [
            'Never use print() for production application tracing.',
            'Use logging.getLogger(__name__) to establish hierarchical logger namespaces.',
            'Pass exc_info=True to logger.error() to capture complete tracebacks.'
          ],
          revision_prompts: [
            'How do log handlers and log formatters differ in the logging module?',
            'What happens if a child logger emits a message when propagate=True?'
          ]
        },

        // Lesson 8
        {
          id: 'les-refactoring-code-smells',
          slug: 'refactoring-code-smells',
          title: 'Refactoring Duplicated Code and Code Smells',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Identify code smells like DRY violations, arrow antipatterns, and long methods, applying Extract Function and Guard Clauses.',
          learning_objectives: [
            'Identify code smells: duplication (DRY), deep nesting (Arrow pattern), long functions',
            'Refactor nested if-else structures using early exit guard clauses',
            'Apply the Extract Function refactoring technique to improve readability'
          ],
          content_markdown: `### The Arrow Antipattern (Deep Nesting)

Deeply nested code shaped like an arrow (\`>\`) is hard to read:

\`\`\`python
# Code smell: Arrow antipattern
def process_user(user):
    if user:
        if user.is_active:
            if user.has_permission:
                execute_task()
\`\`\`

### Refactoring: Guard Clauses (Early Exit)
Invert conditions to exit immediately, keeping the happy path completely unindented:

\`\`\`python
# Refactored: Clean, flat, readable
def process_user(user):
    if not user:
        return
    if not user.is_active:
        return
    if not user.has_permission:
        return
        
    execute_task()
\`\`\``,
          code_snippet: `# Refactoring duplicated tax calculation logic into an extracted function
raw_orders = [
    {"id": "ord_1", "state": "CA", "amount": 100},
    {"id": "ord_2", "state": "NY", "amount": 200},
    {"id": "ord_3", "state": "TX", "amount": 150}
]

STATE_TAX_RATES = {"CA": 0.0825, "NY": 0.08875, "TX": 0.0625}

# Extracted pure helper function
def calculate_order_tax(amount: float, state: str) -> float:
    rate = STATE_TAX_RATES.get(state, 0.05)
    return round(amount * rate, 2)

for ord in raw_orders:
    tax = calculate_order_tax(ord["amount"], ord["state"])
    total = ord["amount"] + tax
    print(f"Order {ord['id']} ({ord['state']}): Base \${ord['amount']} + Tax \${tax} = \${total}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates extracting duplicated calculation logic into a focused helper function calculate_order_tax.',
          expected_output: `Order ord_1 (CA): Base \$100 + Tax \$8.25 = \$108.25
Order ord_2 (NY): Base \$200 + Tax \$17.75 = \$217.75
Order ord_3 (TX): Base \$150 + Tax \$9.38 = \$159.38`,
          quiz: {
            id: 'quiz-refactoring-smells',
            title: 'Knowledge Check: Code Refactoring',
            questions: [
              {
                id: 'q-rs-1',
                question_text: 'How do Guard Clauses improve code readability?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They automatically compile code into C.' },
                  { id: 'opt_2', text: 'They handle edge cases and invalid states with early returns, flattening deep nested indentation.' },
                  { id: 'opt_3', text: 'They prevent all syntax errors.' },
                  { id: 'opt_4', text: 'They encrypt the function body.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Guard clauses exit early when preconditions fail, keeping the main happy-path logic flat and unindented.'
              }
            ]
          },
          key_takeaways: [
            'Invert conditions and use guard clauses to eliminate deep indentation.',
            'Extract repeated expressions into well-named helper functions (DRY).',
            'Functions should do one thing, do it well, and do it only.'
          ],
          revision_prompts: [
            'What is the Cyclomatic Complexity metric and how does refactoring reduce it?',
            'What are the risks of refactoring code without automated tests in place?'
          ]
        },

        // Lesson 9
        {
          id: 'les-maintainable-clean-python',
          slug: 'maintainable-python-clean-code',
          title: 'Writing Maintainable Intermediate Python',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Annotate code with type hints (PEP 484), write expressive docstrings, and apply PEP 8 style standards.',
          learning_objectives: [
            'Use modern Python type annotations (Union, Optional, List, Dict, | operator)',
            'Format multi-line Google-style or Sphinx docstrings with Args and Returns',
            'Adhere to PEP 8 naming conventions and style guidelines'
          ],
          content_markdown: `### Modern Python Type Hinting (Python 3.10+)

Type hints clarify intent, enable IDE autocomplete, and catch bugs with static analyzers like \`mypy\`:

\`\`\`python
# Modern union syntax (Python 3.10+)
def get_user_age(user_id: int) -> int | None:
    ...

# Complex collection types
def summarize_grades(grades: dict[str, list[float]]) -> float:
    ...
\`\`\`

### Comprehensive Docstrings
A well-structured docstring explains *why* the function exists, its parameters, return values, and possible exceptions:

\`\`\`python
def calculate_discount(price: float, discount_pct: float) -> float:
    """Calculates discounted item price.

    Args:
        price: The original item price in dollars.
        discount_pct: The discount percentage between 0.0 and 1.0.

    Returns:
        The final discounted price rounded to 2 decimal places.

    Raises:
        ValueError: If discount_pct is outside [0.0, 1.0].
    """
\`\`\``,
          code_snippet: `from typing import Optional, List

def filter_scores(scores: List[float], threshold: Optional[float] = None) -> List[float]:
    """Filters a list of scores exceeding a cutoff threshold.

    Args:
        scores: Sequence of numeric scores.
        threshold: Minimum qualifying score. Defaults to 50.0 if None.

    Returns:
        A new list containing scores strictly greater than the threshold.
    """
    cutoff = threshold if threshold is not None else 50.0
    return [s for s in scores if s > cutoff]

raw_grades = [45.5, 78.0, 92.5, 49.0, 88.0]
passing = filter_scores(raw_grades, threshold=75.0)

print("Documented function name:", filter_scores.__name__)
print("Type annotations:        ", filter_scores.__annotations__)
print("Passing scores above 75: ", passing)`,
          code_language: 'python',
          code_explanation: 'Shows modern type annotations and structured docstrings with runtime introspection via __annotations__.',
          expected_output: `Documented function name: filter_scores
Type annotations:         {'scores': typing.List[float], 'threshold': typing.Optional[float], 'return': typing.List[float]}
Passing scores above 75:  [78.0, 92.5, 88.0]`,
          quiz: {
            id: 'quiz-clean-python',
            title: 'Knowledge Check: Type Hints & Style',
            questions: [
              {
                id: 'q-cp-1',
                question_text: 'Does Python enforce type annotations at runtime by default?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Yes, passing the wrong type immediately raises a TypeError at runtime.' },
                  { id: 'opt_2', text: 'No, type hints are purely advisory metadata used by static type checkers, IDEs, and documentation generators.' },
                  { id: 'opt_3', text: 'Only if running in Python 2.' },
                  { id: 'opt_4', text: 'Type hints are deleted during compilation.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Python remains dynamically typed. Type hints do not alter runtime behavior unless explicit validation libraries (like Pydantic) are used.'
              }
            ]
          },
          key_takeaways: [
            'Type hints document function contracts and catch bugs in static analysis.',
            'Write structured docstrings detailing parameters, return types, and exceptions.',
            'Follow PEP 8 naming conventions: snake_case for functions, PascalCase for classes.'
          ],
          revision_prompts: [
            'How does mypy verify type annotations in CI/CD pipelines?',
            'What is the difference between typing.Any and object?'
          ]
        },

        // Lesson 10
        {
          id: 'les-testing-modular-architectures',
          slug: 'testing-modular-architectures',
          title: 'Testing Modular Architectures with Dependency Injection',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 10,
          summary: 'Combine unit testing with decoupled architecture using dependency injection to test business services without real databases.',
          learning_objectives: [
            'Apply constructor dependency injection to inject mock dependencies',
            'Test business service logic independently of real database repositories',
            'Verify interactions across architectural boundaries'
          ],
          content_markdown: `### Dependency Injection Enables Testing

If a service instantiates its own dependencies internally:
\`\`\`python
# Tightly coupled: Impossible to unit test in isolation!
class OrderService:
    def __init__(self):
        self.db = PostgreSQLDatabase("production.internal")  # Hardcoded!
\`\`\`

Instead, use **Dependency Injection (DI)** by passing dependencies into \`__init__\`:
\`\`\`python
# Testable: Injects any repository implementation!
class OrderService:
    def __init__(self, repository):
        self.repository = repository
\`\`\`
In production, pass the real database repository. In unit tests, pass a fast in-memory mock repository!`,
          code_snippet: `import unittest
from unittest.mock import Mock

# Domain Service
class NotificationService:
    def __init__(self, email_gateway, logger):
        self.email_gateway = email_gateway
        self.logger = logger

    def alert_admin(self, message):
        formatted = f"[URGENT] {message}"
        self.logger.info(f"Dispatching alert: {formatted}")
        return self.email_gateway.send("admin@revoraa.dev", formatted)

# Unit test verifying service in complete isolation
class TestNotificationService(unittest.TestCase):
    def test_alert_admin_dispatches_properly(self):
        # 1. Create mock dependencies
        mock_gateway = Mock()
        mock_gateway.send.return_value = True
        mock_logger = Mock()

        # 2. Inject mocks into service
        service = NotificationService(email_gateway=mock_gateway, logger=mock_logger)

        # 3. Execute method
        status = service.alert_admin("Server disk threshold reached")

        # 4. Verify mock calls
        self.assertTrue(status)
        mock_gateway.send.assert_called_once_with(
            "admin@revoraa.dev", 
            "[URGENT] Server disk threshold reached"
        )
        mock_logger.info.assert_called_once()

# Run test
suite = unittest.TestLoader().loadTestsFromTestCase(TestNotificationService)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"DI Unit Test passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates dependency injection in NotificationService, allowing unit tests to inject mocks and verify behavior without real email gateways.',
          expected_output: `.
----------------------------------------------------------------------
Ran 1 test in 0.00...s

OK
DI Unit Test passed: True`,
          quiz: {
            id: 'quiz-testing-modular',
            title: 'Knowledge Check: Testing Modular Design',
            questions: [
              {
                id: 'q-tm-1',
                question_text: 'What is Dependency Injection?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'A technique where dependencies are passed into an object rather than created inside it.' },
                  { id: 'opt_2', text: 'A computer virus targeting Python.' },
                  { id: 'opt_3', text: 'A method for injecting SQL statements.' },
                  { id: 'opt_4', text: 'Installing packages with pip.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Dependency Injection passes collaborators into a class (e.g. through __init__), allowing easy substitution with mocks during testing.'
              }
            ]
          },
          key_takeaways: [
            'Constructor dependency injection makes classes easily testable.',
            'Mock out external boundaries (gateways, databases, loggers) during unit testing.',
            'Test business rules independently of persistence infrastructure.'
          ],
          revision_prompts: [
            'How does Dependency Inversion (the "D" in SOLID) relate to Dependency Injection?',
            'What are the tradeoffs of using a Dependency Injection framework vs manual constructor injection in Python?'
          ]
        }
      ]
    }
  ]
};
