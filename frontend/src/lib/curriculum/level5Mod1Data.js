// Module 1: Professional Python Project Structure (10 Lessons)
// Comprehensive production package layout, __init__.py boundaries, src layout, venv, dependency locking, CLI entry points, config separation

export const MODULE_1_PROJECT_STRUCTURE = {
  id: 'mod-l5-1',
  slug: 'professional-python-project-structure',
  title: 'Professional Python Project Structure',
  tagline: 'Transform fragile single-file scripts into modular, reproducible, production-grade Python applications.',
  description: 'Master the src-layout architecture, strict package import boundaries, isolated virtual environments, reproducible dependency pinning, command-line entry points, and 12-factor configuration.',
  level_number: 5,
  sort_order: 1,
  is_published: true,
  topics: [
    {
      id: 'top-l5-1-1',
      slug: 'project-architecture-and-layout',
      title: 'Package Architecture, Layout & Virtual Environments',
      summary: 'Learn why the src-layout prevents accidental imports, how Python resolves sys.path, and how to isolate dependencies reproducibly.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l5-1-1',
          slug: 'from-scripts-to-maintainable-applications',
          title: 'From Scripts to Maintainable Applications',
          summary: 'Understand the architectural shift from ad-hoc script files to structured, testable, and maintainable software packages.',
          estimated_minutes: 20,
          xp_reward: 40,
          learning_objectives: [
            'Analyze why single-file scripts collapse under production complexity',
            'Contrast script execution with modular application design',
            'Adopt separation of concerns across domain, storage, and interfaces'
          ],
          content_markdown: `### The Limits of the Single-File Script

Every developer begins Python by creating a \`script.py\` file. Initially, it does everything: queries an API, parses JSON, connects to a database, and prints output.

As features grow:
- Database connection logic becomes entangled with business rules.
- Automated testing becomes nearly impossible without executing live network calls.
- Importing one helper function triggers global script side effects.

\`\`\`
Fragile Script:
script.py (Global variables + DB queries + Business Logic + Prints)
  └── Crashes on import! Untestable in isolation.

Professional Application:
src/revoraa_service/
├── core/         # Pure domain models and business invariants
├── adapters/     # DB queries, HTTP clients, filesystem access
└── cli/          # Entry point arguments and user presentation
\`\`\`

A professional application separates:
1. **Domain Logic**: Pure, deterministic Python logic independent of external drivers.
2. **Adapters**: Concrete implementations for databases, cloud APIs, and network protocols.
3. **Configuration**: Environment-driven settings injected at startup.`,
          code_snippet: `# Comparing script vs modular domain function
def calculate_invoice_total(line_items: list, tax_rate: float = 0.08) -> float:
    """Pure domain function with zero side-effects or external dependencies."""
    if tax_rate < 0:
        raise ValueError("Tax rate cannot be negative")
    subtotal = sum(item["quantity"] * item["unit_price"] for item in line_items)
    return round(subtotal * (1.0 + tax_rate), 2)

items = [
    {"desc": "Cloud compute unit", "quantity": 3, "unit_price": 45.0},
    {"desc": "Storage tier (TB)", "quantity": 2, "unit_price": 20.0}
]

total = calculate_invoice_total(items, tax_rate=0.08)
print(f"Calculated Invoice Total: \${total}")`,
          code_language: 'python',
          code_explanation: 'By separating pure calculation logic from database IO and printing, this domain function can be tested in microseconds without network access.',
          expected_output: `Calculated Invoice Total: \$189.0`,
          quiz: {
            id: 'quiz-l5-1-1',
            title: 'Script vs Application Check',
            questions: [
              {
                id: 'q-l5-1-1-1',
                question: 'Why is placing database queries, business calculations, and terminal prints in a single global script file dangerous in production?',
                options: [
                  { id: 'opt_1', text: 'It creates tight coupling, preventing unit testing without live databases and causing global side-effects when imported.' },
                  { id: 'opt_2', text: 'Python interpreters refuse to execute files larger than 100 lines.' },
                  { id: 'opt_3', text: 'It disables the Global Interpreter Lock.' },
                  { id: 'opt_4', text: 'It causes syntax errors on Linux operating systems.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Global script logic executes immediately upon import, meaning tests cannot import helper functions without triggering full script side-effects.'
              }
            ]
          },
          key_takeaways: [
            'Single-file scripts couple side-effects with business logic, making automated testing brittle.',
            'Production architecture isolates pure domain logic from infrastructure adapters.',
            'Never execute un-guarded side-effects at the top level of an importable module.'
          ],
          revision_prompts: [
            'What happens when a test runner imports a Python file that executes code outside of if __name__ == "__main__":?'
          ]
        },
        {
          id: 'les-l5-1-2',
          slug: 'organizing-packages-and-modules',
          title: 'Organizing Packages and Modules: The src Layout',
          summary: 'Adopt the industry-standard src layout to prevent import shadowing and ensure tests run against installed distributions.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Contrast the flat layout with the modern src layout',
            'Understand how the current working directory affects sys.path',
            'Structure a scalable Python repository according to PyPA best practices'
          ],
          content_markdown: `### The Problem with Flat Layouts

Many beginners place their package directory right in the repository root:
\`\`\`
my_project/          <-- Root folder
├── my_package/     <-- Package folder
│   └── __init__.py
└── tests/
    └── test_core.py
\`\`\`

**The Trap**: When running \`pytest\` from \`my_project/\`, Python automatically adds the current working directory to the beginning of \`sys.path\`. Tests import \`my_package\` from the local folder, **even if your packaging metadata, C extensions, or editable install are broken**!

### The Modern Standard: The \`src\` Layout

\`\`\`
my_project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── core.py
│       └── py.typed
├── tests/
│   ├── conftest.py
│   └── test_core.py
├── pyproject.toml
└── README.md
\`\`\`

With the \`src\` layout:
1. \`import my_package\` **fails** in tests unless the package was legitimately installed (e.g. \`pip install -e .\`).
2. Packaging errors and missing files are caught immediately during testing.
3. Clean separation between repository root configurations and actual distributable code.`,
          code_snippet: `import sys
import os

# Simulating how Python inspects module search locations
def inspect_package_locations(package_name: str) -> dict:
    return {
        "cwd": os.getcwd(),
        "first_search_path": sys.path[0] if sys.path else None,
        "is_src_in_paths": any("src" in p for p in sys.path),
        "total_paths": len(sys.path)
    }

info = inspect_package_locations("revoraa")
print("Search Path Overview:")
for k, v in info.items():
    print(f"  {k}: {v}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how sys.path governs where the Python import system locates packages, proving why directory layout directly controls import resolution.',
          expected_output: `Search Path Overview:
  cwd: /Users/umershaikh/Desktop/OS/frontend
  first_search_path: 
  is_src_in_paths: False
  total_paths: 1`,
          quiz: {
            id: 'quiz-l5-1-2',
            title: 'src Layout Check',
            questions: [
              {
                id: 'q-l5-1-2-1',
                question: 'What is the primary advantage of the src layout (src/my_package/) over a flat layout (my_package/ in repo root)?',
                options: [
                  { id: 'opt_1', text: 'It prevents the current working directory from accidentally satisfying imports, ensuring tests only pass if the package is properly installed.' },
                  { id: 'opt_2', text: 'It allows Python files to compile into binary machine code.' },
                  { id: 'opt_3', text: 'It doubles the execution speed of bytecode.' },
                  { id: 'opt_4', text: 'It is required by the Windows operating system.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'In a flat layout, tests import local source files directly due to cwd being on sys.path, hiding packaging bugs. The src layout forces tests to exercise the installed package artifact.'
              }
            ]
          },
          key_takeaways: [
            'The src layout (src/<package_name>/) prevents false-positive test passes.',
            'Keep development tooling configs (pyproject.toml, .gitignore, tests/) outside of src/.',
            'A clean directory structure clarifies the boundary between project root and distributable code.'
          ],
          revision_prompts: [
            'Why might a test pass locally in a flat layout but fail when run in a container or CI pipeline?'
          ]
        },
        {
          id: 'les-l5-1-3',
          slug: 'python-import-behavior-and-package-boundaries',
          title: 'Python Import Behavior and Package Boundaries',
          summary: 'Master __all__, relative vs absolute imports, and prevent circular dependency cycles in production packages.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Control public API exposure using __all__ in __init__.py',
            'Contrast absolute imports with explicit relative imports',
            'Detect and dismantle circular import dependency loops'
          ],
          content_markdown: `### The Role of \`__init__.py\` and \`__all__\`

A directory becomes a regular package when it contains an \`__init__.py\` file. This file controls the **public API surface** of your package.

\`\`\`python
# src/revoraa/__init__.py
from revoraa.core import Worker, Pipeline
from revoraa.config import Settings

__version__ = "1.0.0"
__all__ = ["Worker", "Pipeline", "Settings", "__version__"]
\`\`\`

Benefits of explicit \`__all__\`:
1. Users can \`from revoraa import Worker\` instead of navigating deep internal submodules.
2. Static analyzers and IDEs know exactly which symbols are intended for public consumption.
3. Private helpers starting with an underscore remain hidden.

### Absolute vs Relative Imports

- **Absolute Import** (Preferred for clarity): \`from revoraa.core import Worker\`
- **Relative Import** (Allowed strictly within package internals): \`from .models import Item\`
- **Circular Imports**: Occur when Module A imports Module B at the top level, and Module B imports Module A. Solve circular imports by refactoring shared interfaces or dependencies into a third module.`,
          code_snippet: `# Simulating public API boundary enforcement with __all__
class _InternalDatabaseEngine:
    def execute_raw(self): return "RAW_SQL"

class PublicService:
    def __init__(self):
        self._engine = _InternalDatabaseEngine()

    def get_status(self) -> str:
        return "SERVICE_HEALTHY"

__all__ = ["PublicService"]

# Export verification:
public_symbols = [s for s in __all__ if not s.startswith("_")]
print(f"Public API Symbols: {public_symbols}")
print(f"Is internal engine hidden from __all__? {'_InternalDatabaseEngine' not in __all__}")`,
          code_language: 'python',
          code_explanation: 'The code enforces an architectural boundary: internal implementation classes remain encapsulated while PublicService is safely published through __all__.',
          expected_output: `Public API Symbols: ['PublicService']
Is internal engine hidden from __all__? True`,
          quiz: {
            id: 'quiz-l5-1-3',
            title: 'Import Boundaries Check',
            questions: [
              {
                id: 'q-l5-1-3-1',
                question: 'What is the most architectural way to resolve a circular import between module_a and module_b?',
                options: [
                  { id: 'opt_1', text: 'Extract shared models or abstractions into a common module (e.g. models.py or interfaces.py) that both import from.' },
                  { id: 'opt_2', text: 'Place time.sleep(1) before the import statement.' },
                  { id: 'opt_3', text: 'Rename the files so they start with numbers.' },
                  { id: 'opt_4', text: 'Convert all Python files into single-line lambdas.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Extracting shared types, protocols, or models into a third module breaks the dependency loop cleanly without resorting to hacky deferred in-function imports.'
              }
            ]
          },
          key_takeaways: [
            'Use __init__.py and __all__ to define a curated, stable public API.',
            'Prefer absolute imports for readability and unambiguous traceability.',
            'Break circular imports by extracting shared contracts into a separate submodule.'
          ],
          revision_prompts: [
            'Why are in-function local imports considered a code smell when used to patch circular imports?'
          ]
        },
        {
          id: 'les-l5-1-4',
          slug: 'virtual-environments-and-dependency-isolation',
          title: 'Virtual Environments and Dependency Isolation',
          summary: 'Understand how venvs work under the hood, how pyvenv.cfg redirects interpreters, and how to avoid system Python pollution.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand how venv creates isolated site-packages directories',
            'Inspect pyvenv.cfg and PATH activation mechanics',
            'Explain PEP 668 and why installing packages into system Python is prohibited'
          ],
          content_markdown: `### Why Global Python Installs Break

If two projects share the system Python:
- Project A requires \`pydantic==1.10.8\`.
- Project B requires \`pydantic==2.6.0\`.
Updating Project B breaks Project A globally, potentially also breaking OS tools that depend on system Python!

### How a Virtual Environment Actually Works

A virtual environment is **not a container or virtual machine**. It is simply:
1. A directory containing a lightweight copy or symlink to the Python binary.
2. A \`pyvenv.cfg\` configuration file specifying the home interpreter.
3. An isolated \`site-packages/\` directory where \`pip\` installs libraries.

\`\`\`
.venv/
├── bin/ (or Scripts/ on Windows)
│   ├── python -> /usr/local/bin/python3
│   └── activate
├── pyvenv.cfg
└── lib/python3.12/site-packages/  <-- All project dependencies live here!
\`\`\`

When you run \`source .venv/bin/activate\`, the script simply prepends \`.venv/bin\` to your shell's \`PATH\` environment variable!`,
          code_snippet: `# Inspecting virtual environment detection in Python
import sys
import os

def check_venv_status() -> dict:
    # base_prefix differs from prefix when running inside a virtualenv
    is_in_venv = sys.prefix != sys.base_prefix
    return {
        "active_prefix": sys.prefix,
        "base_interpreter": sys.base_prefix,
        "is_virtual_env": is_in_venv,
        "site_packages_path": [p for p in sys.path if "site-packages" in p]
    }

status = check_venv_status()
print(f"Is running in VirtualEnv: {status['is_virtual_env']}")
print(f"Active Python Prefix: {status['active_prefix']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates Python standard library inspection of sys.prefix vs sys.base_prefix, which is how tools and frameworks detect whether an isolated environment is active.',
          expected_output: `Is running in VirtualEnv: False
Active Python Prefix: /`,
          quiz: {
            id: 'quiz-l5-1-4',
            title: 'Virtual Environment Check',
            questions: [
              {
                id: 'q-l5-1-4-1',
                question: 'What does activating a virtual environment via `source .venv/bin/activate` fundamentally do in your shell?',
                options: [
                  { id: 'opt_1', text: 'It prepends the virtual environment bin/ directory to the shell PATH environment variable.' },
                  { id: 'opt_2', text: 'It compiles the operating system kernel with Python modules.' },
                  { id: 'opt_3', text: 'It downloads the complete CPython source code from python.org.' },
                  { id: 'opt_4', text: 'It encrypts all files in the current working directory.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Activation is simply a shell convenience script that puts .venv/bin at the front of PATH so typing "python" or "pip" invokes the virtual environment copies.'
              }
            ]
          },
          key_takeaways: [
            'Virtual environments isolate dependencies per-project without virtualization overhead.',
            'Python determines its site-packages directory from sys.prefix relative to the interpreter binary.',
            'Always commit a .gitignore that ignores the .venv/ directory.'
          ],
          revision_prompts: [
            'Why should you NEVER commit the .venv directory to git?'
          ]
        },
        {
          id: 'les-l5-1-5',
          slug: 'dependency-pinning-and-reproducible-environments',
          title: 'Dependency Pinning and Reproducible Environments',
          summary: 'Contrast abstract vs concrete dependencies, understand lockfiles (pip-tools, Poetry, uv), and achieve deterministic builds.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Distinguish between direct dependencies and transitive sub-dependencies',
            'Contrast loose version ranges (pyproject.toml) with exact pinned hashes (lockfiles)',
            'Prevent unexpected upstream dependency breakage in CI/CD pipelines'
          ],
          content_markdown: `### The "It Worked Yesterday" Trap

Imagine your project declares:
\`\`\`
requests>=2.28.0
\`\`\`
Six months later, \`requests\` or one of its transitive dependencies (\`urllib3\`, \`certifi\`, \`idna\`) releases a breaking change or deprecates a function. A fresh deploy crashes in production because you installed whatever version was newest!

### Abstract vs Concrete Dependencies

1. **Abstract Dependencies** (\`pyproject.toml\`):
   - For libraries and reusable packages.
   - States compatibility ranges: \`dependencies = ["httpx>=0.25.0,<1.0.0"]\`.
2. **Concrete Dependencies** (Lockfiles / \`requirements.lock\`):
   - For deployed applications and production services.
   - States exact versions and cryptographic hashes:
     \`\`\`
     httpx==0.27.0 --hash=sha256:7b8d...
     httpcore==1.0.4 --hash=sha256:3a1c...
     certifi==2024.2.2 --hash=sha256:9f4e...
     \`\`\`

Modern tools like \`uv\`, \`poetry\`, and \`pip-tools\` generate deterministic lockfiles ensuring that every developer and CI runner installs the **exact same byte-for-byte dependencies**.`,
          code_snippet: `# Simulating a dependency version resolver check
def validate_dependency_spec(package: str, requested_range: str, locked_version: str) -> bool:
    # Basic semantic version range check
    import re
    m = re.match(r">=(\d+\.\d+),<(\d+\.\d+)", requested_range)
    if not m:
        return True
    min_v, max_v = float(m.group(1)), float(m.group(2))
    locked_num = float(".".join(locked_version.split(".")[:2]))
    return min_v <= locked_num < max_v

is_valid = validate_dependency_spec("httpx", ">=0.25,<1.0", "0.27.0")
is_breaking = validate_dependency_spec("httpx", ">=0.25,<1.0", "1.2.0")

print(f"Locked 0.27.0 satisfies range: {is_valid}")
print(f"Hypothetical 1.2.0 satisfies range: {is_breaking}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how dependency resolvers verify that locked package versions satisfy the abstract semantic compatibility constraints declared by the application.',
          expected_output: `Locked 0.27.0 satisfies range: True
Hypothetical 1.2.0 satisfies range: False`,
          quiz: {
            id: 'quiz-l5-1-5',
            title: 'Dependency Pinning Check',
            questions: [
              {
                id: 'q-l5-1-5-1',
                question: 'Why should a deployed production application always deploy from a locked dependency file with pinned versions rather than loose ranges (e.g. requests>=2.0)?',
                options: [
                  { id: 'opt_1', text: 'To guarantee that transitive dependency updates cannot silently introduce breaking changes or security defects in production.' },
                  { id: 'opt_2', text: 'Because Python refuses to run without pinned versions.' },
                  { id: 'opt_3', text: 'To reduce the file size of the Python source files.' },
                  { id: 'opt_4', text: 'Because pip cannot download packages with comparison operators.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A lockfile freezes the entire transitive dependency tree, guaranteeing identical reproducible behavior across local workstations, staging, and production.'
              }
            ]
          },
          key_takeaways: [
            'Abstract dependencies define broad compatibility in pyproject.toml.',
            'Applications require concrete lockfiles with exact pinned versions and sha256 hashes.',
            'Never rely on floating dependency ranges in automated CI/CD deployments.'
          ],
          revision_prompts: [
            'What is a transitive dependency and how can it break your build even if your direct dependencies are pinned?'
          ]
        }
      ]
    },
    {
      id: 'top-l5-1-2',
      slug: 'packaging-cli-and-config',
      title: 'Packaging Metadata, CLI Entry Points & Settings',
      summary: 'Define project metadata in pyproject.toml, build command-line entry points, and separate environment configuration.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l5-1-6',
          slug: 'project-metadata-and-packaging-fundamentals',
          title: 'Project Metadata and Packaging Fundamentals',
          summary: 'Declare standards-compliant package metadata using PEP 621 in pyproject.toml.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand PEP 518 and PEP 621 pyproject.toml specification',
            'Declare name, version, authors, license, and python requires',
            'Configure build-system tables (hatchling, flit, setuptools)'
          ],
          content_markdown: `### The Modern \`pyproject.toml\` (PEP 621)

Historically, Python packaging relied on \`setup.py\` executing arbitrary Python code. In modern Python, the declarative **\`pyproject.toml\`** file is the universal single source of truth:

\`\`\`toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "revoraa-telemetry"
version = "1.0.0"
description = "Production telemetry processing engine"
readme = "README.md"
requires-python = ">=3.10"
license = { text = "MIT" }
authors = [
    { name = "Umer Shaikh", email = "umer@revoraa.dev" }
]
dependencies = [
    "pydantic>=2.5.0",
    "httpx>=0.25.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "mypy>=1.8.0",
    "ruff>=0.2.0"
]
\`\`\`

Declaring \`optional-dependencies\` allows users to install production dependencies with \`pip install .\`, while developers install \`pip install .[dev]\`.`,
          code_snippet: `# Parsing and validating standard TOML project metadata
import json

SAMPLE_METADATA = """
{
    "project": {
        "name": "revoraa-engine",
        "version": "1.0.0",
        "requires_python": ">=3.10",
        "dependencies": ["pydantic>=2.0", "httpx>=0.25"]
    }
}
"""

data = json.loads(SAMPLE_METADATA)
project = data["project"]

print(f"Package: {project['name']} v{project['version']}")
print(f"Python constraint: {project['requires_python']}")
print(f"Direct dependencies ({len(project['dependencies'])}): {', '.join(project['dependencies'])}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates declarative package metadata inspection, verifying that key fields like name, version, and dependencies are cleanly structured.',
          expected_output: `Package: revoraa-engine v1.0.0
Python constraint: >=3.10
Direct dependencies (2): pydantic>=2.0, httpx>=0.25`,
          quiz: {
            id: 'quiz-l5-1-6',
            title: 'pyproject.toml Check',
            questions: [
              {
                id: 'q-l5-1-6-1',
                question: 'Why did the Python community replace setup.py with declarative pyproject.toml (PEP 518/621)?',
                options: [
                  { id: 'opt_1', text: 'To eliminate arbitrary code execution during build time, standardize metadata across all build tools, and provide safe declarative configuration.' },
                  { id: 'opt_2', text: 'Because setup.py was unable to install packages on Linux.' },
                  { id: 'opt_3', text: 'To force all Python code to be rewritten in Rust.' },
                  { id: 'opt_4', text: 'Because setup.py could not support more than 2 dependencies.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'setup.py executed arbitrary code just to read metadata, creating security vulnerabilities and tool incompatibility. pyproject.toml is safe, declarative, and tool-agnostic.'
              }
            ]
          },
          key_takeaways: [
            'pyproject.toml is the universal, declarative metadata standard for Python projects.',
            '[build-system] defines the build backend without executing arbitrary code.',
            '[project.optional-dependencies] defines dev and test dependency sets cleanly.'
          ],
          revision_prompts: [
            'What is the role of the [build-system] table in pyproject.toml?'
          ]
        },
        {
          id: 'les-l5-1-7',
          slug: 'entry-points-and-command-line-interfaces',
          title: 'Entry Points and Command-Line Interfaces',
          summary: 'Create production CLI entry points using project.scripts and parse arguments cleanly with argparse.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Configure [project.scripts] in pyproject.toml for executable CLI generation',
            'Implement command-line argument parsing with argparse',
            'Handle exit codes and unhandled CLI exceptions gracefully'
          ],
          content_markdown: `### Generating Executables with \`[project.scripts]\`

When you install a tool like \`black\` or \`pytest\`, you can run it directly in your terminal: \`pytest\`.
How does Python create these terminal commands?

Through **console script entry points** in \`pyproject.toml\`:
\`\`\`toml
[project.scripts]
revoraa = "revoraa.cli:main"
\`\`\`

When \`pip install .\` runs, the installer automatically generates an OS-specific executable script in \`.venv/bin/revoraa\` that imports \`revoraa.cli\` and invokes \`main()\`.

### Professional CLI Patterns with \`argparse\`

\`\`\`python
import argparse
import sys

def main(argv=None) -> int:
    parser = argparse.ArgumentParser(prog="revoraa", description="Revoraa Ops Utility")
    parser.add_argument("--env", default="production", choices=["staging", "production"])
    parser.add_argument("-v", "--verbose", action="store_true")
    
    args = parser.parse_args(argv)
    try:
        # Execute logic...
        return 0  # Success exit code
    except Exception as err:
        sys.stderr.write(f"Error: {err}\\n")
        return 1  # Standard POSIX failure code
\`\`\``,
          code_snippet: `import argparse

def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="revoraa-admin", description="Administration CLI")
    parser.add_argument("--port", type=int, default=8080, help="Listen port")
    parser.add_argument("--workers", type=int, default=4, help="Worker count")
    return parser

parser = create_parser()
args = parser.parse_args(["--port", "9000", "--workers", "8"])

print(f"Parsed CLI Port: {args.port} (Type: {type(args.port).__name__})")
print(f"Parsed Workers: {args.workers}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates automated type conversion and argument validation using the built-in argparse module.',
          expected_output: `Parsed CLI Port: 9000 (Type: int)
Parsed Workers: 8`,
          quiz: {
            id: 'quiz-l5-1-7',
            title: 'CLI Entry Point Check',
            questions: [
              {
                id: 'q-l5-1-7-1',
                question: 'What does the entry point specification `revoraa = "revoraa.cli:main"` in pyproject.toml tell pip to do?',
                options: [
                  { id: 'opt_1', text: 'Generate an executable binary/script named "revoraa" in the environment bin/ folder that calls the main() function in revoraa.cli.' },
                  { id: 'opt_2', text: 'Rename the file cli.py to revoraa.py on the filesystem.' },
                  { id: 'opt_3', text: 'Run the main() function once during installation.' },
                  { id: 'opt_4', text: 'Delete all other entry points in the virtual environment.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Pip creates an executable wrapper script in the virtual environment bin/ directory that imports the specified module and calls the target function.'
              }
            ]
          },
          key_takeaways: [
            '[project.scripts] maps terminal commands directly to Python callable entry points.',
            'Accept an optional argv parameter in CLI functions to allow easy unit testing.',
            'Always return integer exit codes (0 for success, non-zero for failure).'
          ],
          revision_prompts: [
            'Why is returning sys.exit(0) inside helper functions considered bad practice compared to returning an exit code from main()?'
          ]
        },
        {
          id: 'les-l5-1-8',
          slug: 'configuration-management',
          title: 'Configuration Management: 12-Factor Principles',
          summary: 'Separate code from config by reading settings from environment variables and validating types at startup.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Apply The Twelve-Factor App config guideline (Factor III: Config in the environment)',
            'Read and parse environment variables safely with defaults and type casting',
            'Fail fast on missing required production configuration'
          ],
          content_markdown: `### The Golden Rule of Configuration

**Never store configuration constants or credentials in source code.**

The Twelve-Factor App methodology states:
*An application's config is everything that is likely to vary between deploys (staging, production, developer workstations).*

\`\`\`
Source Code (Git):
  Same across all environments! Never contains passwords or URLs.

Environment Variables (.env / OS):
  DATABASE_URL=postgres://...
  PORT=8080
  LOG_LEVEL=INFO
\`\`\`

### Safe Environment Variable Parsing

\`os.environ\` always returns strings. If you need an integer or boolean:
\`\`\`python
# DANGEROUS:
debug = bool(os.getenv("DEBUG", False))
# "False" is a non-empty string, so bool("False") is True! BUG!

# SAFE:
debug = os.getenv("DEBUG", "false").lower() in ("true", "1", "yes")
\`\`\``,
          code_snippet: `import os

class AppConfig:
    def __init__(self, env: dict):
        self.app_name = env.get("APP_NAME", "revoraa-core")
        self.port = int(env.get("PORT", "8000"))
        self.debug = env.get("DEBUG", "false").lower() in ("true", "1")
        
        # Validate required secret
        self.secret_key = env.get("SECRET_KEY")
        if not self.secret_key:
            raise ValueError("Fatal: SECRET_KEY environment variable is required!")

# Simulated OS environment:
fake_env = {
    "APP_NAME": "telemetry-prod",
    "PORT": "9090",
    "DEBUG": "False",
    "SECRET_KEY": "super_secret_production_key"
}

cfg = AppConfig(fake_env)
print(f"Loaded Config: {cfg.app_name} on port {cfg.port}")
print(f"Debug Mode: {cfg.debug} (Properly parsed as boolean False)")`,
          code_language: 'python',
          code_explanation: 'Demonstrates robust parsing of strings, integers, booleans, and fail-fast validation for mandatory environment variables.',
          expected_output: `Loaded Config: telemetry-prod on port 9090
Debug Mode: False (Properly parsed as boolean False)`,
          quiz: {
            id: 'quiz-l5-1-8',
            title: 'Config Management Check',
            questions: [
              {
                id: 'q-l5-1-8-1',
                question: 'What is the bug with writing `debug = bool(os.getenv("DEBUG", False))` when DEBUG="False" in the environment?',
                options: [
                  { id: 'opt_1', text: 'In Python, bool("False") evaluates to True because non-empty strings are truthy.' },
                  { id: 'opt_2', text: 'os.getenv() does not support default values.' },
                  { id: 'opt_3', text: 'Python raises a TypeError when casting strings to booleans.' },
                  { id: 'opt_4', text: 'The environment variable is deleted upon access.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Any non-empty string in Python evaluates to True under bool(). Therefore bool("False") is True! Environment variable booleans must be checked against string tokens like "true" or "1".'
              }
            ]
          },
          key_takeaways: [
            'Store application configuration in the environment, not in source code.',
            'Handle type coercion carefully: bool("False") evaluates to True.',
            'Fail fast at startup if critical configuration or secret variables are missing.'
          ],
          revision_prompts: [
            'Why should .env files containing production credentials never be committed to git?'
          ]
        },
        {
          id: 'les-l5-1-9',
          slug: 'environment-specific-settings',
          title: 'Environment-Specific Settings and Profiles',
          summary: 'Manage development, testing, and production profiles cleanly using structured configuration classes.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Implement environment profile switching (dev, test, prod)',
            'Prevent development mock settings from leaking into production',
            'Enforce immutable configuration models in running applications'
          ],
          content_markdown: `### Managing Multiple Environments

Applications run in at least three environments:
1. **Development**: Verbose debug logging, local database, relaxed security.
2. **Testing**: In-memory storage, mock third-party credentials, deterministic clocks.
3. **Production**: Strict TLS, connection pooling, minimal logging, secret vaults.

### The Profile Pattern

Use a base configuration class with specialized environment profiles:
\`\`\`python
class BaseSettings:
    ENVIRONMENT: str = "base"
    TIMEOUT_SECONDS: float = 30.0

class DevelopmentSettings(BaseSettings):
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///dev.db"

class ProductionSettings(BaseSettings):
    DEBUG: bool = False
    # In production, must be explicitly provided:
    DATABASE_URL: str
\`\`\`

The active settings object is loaded once at application bootstrap and passed via dependency injection.`,
          code_snippet: `class BaseConfig:
    def __init__(self, env_name: str):
        self.env_name = env_name

class DevConfig(BaseConfig):
    timeout = 60.0
    enable_profiling = True

class ProdConfig(BaseConfig):
    timeout = 10.0
    enable_profiling = False

def load_environment_profile(env: str) -> BaseConfig:
    if env.lower() == "production":
        return ProdConfig("production")
    return DevConfig("development")

active_cfg = load_environment_profile("production")
print(f"Active Environment: {active_cfg.env_name}")
print(f"Enforced Timeout: {active_cfg.timeout}s")
print(f"Profiling Enabled: {active_cfg.enable_profiling}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates profile-based configuration selection, ensuring production policies like strict timeouts are automatically enforced.',
          expected_output: `Active Environment: production
Enforced Timeout: 10.0s
Profiling Enabled: False`,
          quiz: {
            id: 'quiz-l5-1-9',
            title: 'Profile Pattern Check',
            questions: [
              {
                id: 'q-l5-1-9-1',
                question: 'What is the risk of using default fallback values for production credentials in a base configuration class?',
                options: [
                  { id: 'opt_1', text: 'If a production environment variable is omitted by accident, the application might silently connect to a development database or mock credentials in production.' },
                  { id: 'opt_2', text: 'It slows down Python bytecode compilation.' },
                  { id: 'opt_3', text: 'Base classes cannot have default values in Python.' },
                  { id: 'opt_4', text: 'It causes git merge conflicts.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Production settings should never fall back to development defaults. If a production credential or database URL is missing, the application must immediately raise an error and abort startup.'
              }
            ]
          },
          key_takeaways: [
            'Separate dev, test, and prod profiles while keeping code identical.',
            'Production settings must never silently fall back to insecure local defaults.',
            'Inject the loaded configuration object into services during initialization.'
          ],
          revision_prompts: [
            'How can dataclasses or Pydantic Settings make configuration classes immutable at runtime?'
          ]
        },
        {
          id: 'les-l5-1-10',
          slug: 'documentation-and-project-conventions',
          title: 'Documentation, Type Markers and Project Conventions',
          summary: 'Document production projects with READMEs, py.typed PEP 561 markers, and standard CONTRIBUTING guidelines.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Include the py.typed marker (PEP 561) to support external type checkers',
            'Structure a production README with architecture, setup, and run instructions',
            'Enforce consistent docstring formatting (Google/Sphinx style)'
          ],
          content_markdown: `### The \`py.typed\` File (PEP 561)

If you write a package with type annotations, other projects importing your package **will not see your types by default**!
Mypy ignores type annotations inside third-party packages unless the package includes an empty marker file named **\`py.typed\`** inside its package root:

\`\`\`
src/my_package/
├── __init__.py
├── core.py
└── py.typed  <-- Essential! Signals that this package supports type checking.
\`\`\`

### Essential Project Files

1. **\`README.md\`**:
   - What the project does.
   - Quickstart / Installation steps.
   - Example usage code.
2. **\`pyproject.toml\`**: All build, tool, and package metadata.
3. **\`LICENSE\`**: Explicit open-source or proprietary licensing terms.
4. **\`CONTRIBUTING.md\`**: Setup instructions for new engineers, test running commands, and PR guidelines.`,
          code_snippet: `# Verifying the presence of the PEP 561 py.typed marker in a package
def verify_package_typing_support(package_files: list) -> dict:
    has_init = any(f.endswith("__init__.py") for f in package_files)
    has_py_typed = any(f.endswith("py.typed") for f in package_files)
    return {
        "valid_package": has_init,
        "supports_type_checking": has_py_typed,
        "pep_561_compliant": has_init and has_py_typed
    }

files = [
    "src/revoraa/__init__.py",
    "src/revoraa/core.py",
    "src/revoraa/py.typed"
]

res = verify_package_typing_support(files)
print(f"Is valid package: {res['valid_package']}")
print(f"PEP 561 py.typed marker present: {res['supports_type_checking']}")`,
          code_language: 'python',
          code_explanation: 'Checks for the py.typed marker file, which is required under PEP 561 for Mypy and Pyright to recognize exported type hints.',
          expected_output: `Is valid package: True
PEP 561 py.typed marker present: True`,
          quiz: {
            id: 'quiz-l5-1-10',
            title: 'PEP 561 py.typed Check',
            questions: [
              {
                id: 'q-l5-1-10-1',
                question: 'What is the purpose of placing an empty "py.typed" file in a Python package root?',
                options: [
                  { id: 'opt_1', text: 'It signals to type checkers (like Mypy and Pyright) that the package provides inline type annotations according to PEP 561.' },
                  { id: 'opt_2', text: 'It makes Python run as a statically typed compiled language.' },
                  { id: 'opt_3', text: 'It converts docstrings into HTML.' },
                  { id: 'opt_4', text: 'It is a license file required by GitHub.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Under PEP 561, type checkers ignore annotations in installed packages unless a py.typed file is included in the package directory.'
              }
            ]
          },
          key_takeaways: [
            'Always include an empty py.typed file so external users can type-check against your package.',
            'A comprehensive README provides setup, architecture overview, and run commands.',
            'Adhere to standard PEP guidelines to ensure seamless interoperability across Python tools.'
          ],
          revision_prompts: [
            'What happens if an external library has full type hints but forgets to include py.typed?'
          ]
        }
      ]
    }
  ]
};
