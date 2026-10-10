// Module 2: Packaging and Distribution (12 Lessons)
// Comprehensive PyPA standards, sdist, wheels, PEP 440 versioning, editable installs, package indexes, supply chain security

export const MODULE_2_PACKAGING_DISTRIBUTION = {
  id: 'mod-l5-2',
  slug: 'packaging-and-distribution',
  title: 'Packaging and Distribution',
  tagline: 'Build, version, inspect, and distribute standards-compliant Python packages and wheels.',
  description: 'Master modern build systems (hatchling, flit, setuptools), source distributions vs pre-built wheels, PEP 440 versioning, editable installs, supply-chain security, and release deprecation lifecycles.',
  level_number: 5,
  sort_order: 2,
  is_published: true,
  topics: [
    {
      id: 'top-l5-2-1',
      slug: 'build-systems-artifacts',
      title: 'Build Systems, Wheels & Source Distributions',
      summary: 'Explore how build frontends (build, pip) interact with build backends, and understand the difference between sdists and wheels.',
      sort_order: 1,
      lessons: [
        {
          id: 'les-l5-2-1',
          slug: 'what-python-packaging-solves',
          title: 'What Python Packaging Solves',
          summary: 'Understand the historical evolution of Python packaging and the modern PyPA standards ecosystem.',
          estimated_minutes: 20,
          xp_reward: 40,
          learning_objectives: [
            'Analyze why shipping raw code directories fails across heterogeneous operating systems',
            'Understand how packages bundle metadata, dependencies, and code assets',
            'Contrast source code repositories with distributable release artifacts'
          ],
          content_markdown: `### The Challenge of Distributing Python Software

Sharing a Python project is not as simple as zipping up a folder:
- Which Python version is required?
- What third-party libraries must be downloaded first?
- Where are non-Python data files (icons, schemas, configs) located?
- What command should the user type in the terminal?

**Packaging solves distribution**: It wraps your source code, assets, and dependency requirements into a self-describing, cryptographic, standardized archive that any tool (\`pip\`, \`uv\`, \`conda\`) can install deterministically.`,
          code_snippet: `# Simulating package manifest inspection
def inspect_package_manifest(manifest: dict) -> list:
    issues = []
    required_keys = ["name", "version", "dependencies"]
    for k in required_keys:
        if k not in manifest:
            issues.append(f"Missing required metadata key: '{k}'")
    return issues

sample_manifest = {
    "name": "revoraa-sdk",
    "version": "1.0.0",
    "dependencies": ["httpx>=0.25"]
}

problems = inspect_package_manifest(sample_manifest)
print(f"Manifest validation errors: {problems if problems else 'None! Valid manifest.'}")`,
          code_language: 'python',
          code_explanation: 'Validates that a package specification declares all fundamental distribution metadata required by packaging tools.',
          expected_output: `Manifest validation errors: None! Valid manifest.`,
          quiz: {
            id: 'quiz-l5-2-1',
            title: 'Packaging Purpose Check',
            questions: [
              {
                id: 'q-l5-2-1-1',
                question: 'What is the primary difference between a source code git repository and a distributed Python package?',
                options: [
                  { id: 'opt_1', text: 'A git repository contains development history, tests, and scratch files; a package is a standardized, self-describing build artifact containing only production code and dependency metadata.' },
                  { id: 'opt_2', text: 'A git repository can only hold Python 2 code.' },
                  { id: 'opt_3', text: 'Packages cannot contain documentation or README files.' },
                  { id: 'opt_4', text: 'Packages only run on Linux.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A package artifact is built specifically for consumption: it strips developer scratch files, packages metadata, compiles bytecode, and includes exact dependencies.'
              }
            ]
          },
          key_takeaways: [
            'Packaging transforms raw repositories into installable, self-describing distribution artifacts.',
            'Standardized packaging allows pip to resolve dependencies and install libraries across platforms.',
            'Modern standards (PEP 517/518/621) govern modern Python packaging.'
          ],
          revision_prompts: [
            'Why is emailing a zip file of a project folder considered anti-pattern for software delivery?'
          ]
        },
        {
          id: 'les-l5-2-2',
          slug: 'pyproject-toml-fundamentals',
          title: 'pyproject.toml Fundamentals and Specifications',
          summary: 'Deep dive into the standardized pyproject.toml format under PEP 518 and PEP 621.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Inspect the anatomy of pyproject.toml tables',
            'Configure [build-system], [project], and tool configuration tables',
            'Understand how pyproject.toml replaced setup.cfg and setup.py'
          ],
          content_markdown: `### Standard Tables in \`pyproject.toml\`

A modern \`pyproject.toml\` organizes your entire project through standard tables:

1. **\`[build-system]\`**: Defines how to build wheels (e.g. \`hatchling\`, \`setuptools\`, \`flit_core\`).
2. **\`[project]\`**: Standard PEP 621 metadata (name, version, license, dependencies, scripts).
3. **\`[tool.*]\`**: Configurations for development tools (e.g. \`[tool.pytest.ini_options]\`, \`[tool.ruff]\`, \`[tool.mypy]\`).

\`\`\`toml
[tool.pytest.ini_options]
minversion = "7.0"
addopts = "-ra -q --strict-markers"
testpaths = ["tests"]

[tool.mypy]
strict = true
warn_unused_configs = true
\`\`\`

By unifying all tool configs into one file, your repository stays clean and uncluttered.`,
          code_snippet: `# Simulating tool configuration extraction from pyproject.toml
SAMPLE_TOML_DATA = {
    "tool": {
        "pytest": {"minversion": "7.0", "strict_markers": True},
        "mypy": {"strict": True}
    }
}

pytest_cfg = SAMPLE_TOML_DATA.get("tool", {}).get("pytest", {})
print("Loaded Pytest Config from pyproject:")
for k, v in pytest_cfg.items():
    print(f"  {k} = {v}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how tools read their unified configuration directly from the [tool.*] tables inside pyproject.toml.',
          expected_output: `Loaded Pytest Config from pyproject:
  minversion = 7.0
  strict_markers = True`,
          quiz: {
            id: 'quiz-l5-2-2',
            title: 'pyproject Tables Check',
            questions: [
              {
                id: 'q-l5-2-2-1',
                question: 'Where should tool configurations (such as settings for pytest, ruff, or mypy) be placed according to modern Python standards?',
                options: [
                  { id: 'opt_1', text: 'Inside dedicated [tool.<toolname>] tables in pyproject.toml.' },
                  { id: 'opt_2', text: 'Directly in the operating system registry.' },
                  { id: 'opt_3', text: 'At the end of every Python source file.' },
                  { id: 'opt_4', text: 'Inside binary .exe files.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'PEP 518 standardized the [tool.*] namespace in pyproject.toml, allowing tools to store configurations in a single centralized file.'
              }
            ]
          },
          key_takeaways: [
            'pyproject.toml consolidates package metadata and developer tool configurations.',
            'The [build-system] table specifies the build engine needed to produce distribution archives.',
            '[tool.*] tables eliminate clutter from standalone config files like setup.cfg or pytest.ini.'
          ],
          revision_prompts: [
            'What happens if a tool table has a typo (e.g. [tool.pytestt])?'
          ]
        },
        {
          id: 'les-l5-2-3',
          slug: 'build-systems-and-package-metadata',
          title: 'Build Systems: Frontends vs Backends',
          summary: 'Understand the PEP 517 separation between build frontends (build, pip) and build backends (hatchling, flit, setuptools).',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Differentiate between build frontends and build backends',
            'Compare popular backends: Hatchling, Flit, Setuptools, and PDM-backend',
            'Understand how pip invokes the build backend in an isolated temporary venv'
          ],
          content_markdown: `### Build Frontends vs Build Backends (PEP 517)

Before PEP 517, \`pip\` hardcoded calls to \`setup.py\`. Today, build operations are cleanly separated:

- **Build Frontend** (\`pip\`, \`build\`, \`uv\`):
  - User-facing tool.
  - Creates a temporary isolated environment.
  - Installs the build requirements specified in \`[build-system] requires\`.
  - Calls standard backend hook functions.
- **Build Backend** (\`hatchling\`, \`flit_core\`, \`setuptools\`):
  - Library that actually compiles code and packages files into \`.tar.gz\` and \`.whl\`.
  - Implements standard hook: \`build_wheel()\` and \`build_sdist()\`.

\`\`\`
User CLI: python -m build
   │ (Frontend)
   ├── Creates isolated build environment
   ├── Installs build backend: hatchling
   └── Calls backend hook: hatchling.build_wheel()
         │ (Backend)
         └── Generates: dist/my_package-1.0.0-py3-none-any.whl
\`\`\``,
          code_snippet: `# Simulating the frontend/backend hook invocation flow
class MockBuildBackend:
    @staticmethod
    def build_wheel(dist_dir: str, metadata: dict) -> str:
        filename = f"{metadata['name']}-{metadata['version']}-py3-none-any.whl"
        return f"{dist_dir}/{filename}"

def frontend_build_runner(backend, meta: dict) -> str:
    # Frontend prepares dist directory and calls hook
    return backend.build_wheel("dist", meta)

artifact = frontend_build_runner(MockBuildBackend, {"name": "revoraa_core", "version": "2.0.0"})
print(f"Generated Build Artifact: {artifact}")`,
          code_language: 'python',
          code_explanation: 'Simulates the PEP 517 hook architecture, showing how a frontend coordinates with a backend to produce standard distribution artifacts.',
          expected_output: `Generated Build Artifact: dist/revoraa_core-2.0.0-py3-none-any.whl`,
          quiz: {
            id: 'quiz-l5-2-3',
            title: 'Frontend vs Backend Check',
            questions: [
              {
                id: 'q-l5-2-3-1',
                question: 'Which of the following is a build FRONTEND under PEP 517?',
                options: [
                  { id: 'opt_1', text: 'python -m build (or pip)' },
                  { id: 'opt_2', text: 'hatchling' },
                  { id: 'opt_3', text: 'flit_core' },
                  { id: 'opt_4', text: 'setuptools.build_meta' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: '`build` and `pip` are build frontends. `hatchling`, `flit_core`, and `setuptools` are build backends that actually package the files.'
              }
            ]
          },
          key_takeaways: [
            'Build frontends orchestrate the build process and environment isolation.',
            'Build backends package the actual files and create wheels and sdists.',
            'PEP 517 allows developers to choose any modern build backend without breaking pip.'
          ],
          revision_prompts: [
            'Why is Hatchling popular for modern pure-Python applications compared to legacy setuptools?'
          ]
        },
        {
          id: 'les-l5-2-4',
          slug: 'package-dependencies-and-optional-dependencies',
          title: 'Package Dependencies and Optional Extras',
          summary: 'Define core runtime requirements, optional extras, and environment markers in pyproject.toml.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Declare core dependencies vs optional extras (extras_require)',
            'Use PEP 508 environment markers (e.g. sys_platform, python_version)',
            'Structure optional feature sets like docs, tests, and cloud drivers'
          ],
          content_markdown: `### Environment Markers (PEP 508)

What if your package requires \`colorama\` only on Windows, or \`importlib-metadata\` only on Python < 3.10?
Use **environment markers**:

\`\`\`toml
[project]
dependencies = [
    "pydantic>=2.0",
    "colorama>=0.4; sys_platform == 'win32'",
    "exceptiongroup>=1.0; python_version < '3.11'"
]

[project.optional-dependencies]
postgres = ["asyncpg>=0.29.0"]
redis = ["redis>=5.0.0"]
all = [
    "revoraa[postgres,redis]"
]
\`\`\`

When a user runs \`pip install "revoraa[postgres]"\`, \`pip\` installs the core package plus \`asyncpg\`, keeping the default install lightweight!`,
          code_snippet: `# Simulating environment marker evaluation
import sys

def should_install_dependency(marker: str) -> bool:
    if marker == "python_version < '3.11'":
        return sys.version_info < (3, 11)
    if marker == "sys_platform == 'win32'":
        return sys.platform == "win32"
    return True

print(f"Current Python: {sys.version.split()[0]} on {sys.platform}")
print(f"Would install py310 backport: {should_install_dependency(\"python_version < '3.11'\")}")
print(f"Would install Windows helper: {should_install_dependency(\"sys_platform == 'win32'\")}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how pip evaluates PEP 508 environment markers against the host system runtime to conditionally install platform-specific dependencies.',
          expected_output: `Current Python: 3.12.0 on darwin
Would install py310 backport: False
Would install Windows helper: False`,
          quiz: {
            id: 'quiz-l5-2-4',
            title: 'Optional Extras Check',
            questions: [
              {
                id: 'q-l5-2-4-1',
                question: 'How does a user install an optional dependency set named "postgres" defined under [project.optional-dependencies] in pyproject.toml?',
                options: [
                  { id: 'opt_1', text: 'pip install "my_package[postgres]"' },
                  { id: 'opt_2', text: 'pip install my_package --with-postgres' },
                  { id: 'opt_3', text: 'pip install postgres.my_package' },
                  { id: 'opt_4', text: 'python -m postgres install' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Square brackets are the standard PEP 508 syntax for installing optional extras: pip install "package_name[extra_name]".'
              }
            ]
          },
          key_takeaways: [
            'Use [project.optional-dependencies] to keep default installations lightweight.',
            'Use environment markers (sys_platform, python_version) to avoid installing unnecessary backports.',
            'Quote package names with brackets in shell commands (e.g. "package[extra]") to prevent shell globbing.'
          ],
          revision_prompts: [
            'Why can running pip install package[dev] fail in zsh without quotes?'
          ]
        },
        {
          id: 'les-l5-2-5',
          slug: 'versioning-and-release-conventions',
          title: 'Versioning Conventions: Semantic Versioning and PEP 440',
          summary: 'Adopt Semantic Versioning (SemVer) and understand Python-specific version schemes under PEP 440.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand Semantic Versioning: MAJOR.MINOR.PATCH',
            'Learn PEP 440 Python versioning rules: pre-releases, dev releases, and post-releases',
            'Avoid breaking changes in minor and patch releases'
          ],
          content_markdown: `### Semantic Versioning (SemVer 2.0.0)

\`\`\`
MAJOR . MINOR . PATCH
  2   .   1   .   4
\`\`\`

1. **MAJOR (2.0.0)**: Incompatible API breaking changes.
2. **MINOR (2.1.0)**: New backwards-compatible features.
3. **PATCH (2.1.1)**: Backwards-compatible bug fixes and security patches.

### Python's PEP 440 Standard

Python has its own version specification (PEP 440) compatible with SemVer but with formal support for release stages:
- **Alpha**: \`1.0.0a1\`
- **Beta**: \`1.0.0b2\`
- **Release Candidate**: \`1.0.0rc1\`
- **Final Release**: \`1.0.0\`
- **Post Release**: \`1.0.0.post1\` (e.g. documentation update without code change)
- **Development Release**: \`1.0.0.dev1\``,
          code_snippet: `# Parsing and comparing semantic versions
def parse_version(v_str: str) -> tuple:
    parts = v_str.split(".")
    return tuple(int(p) for p in parts[:3])

def is_backwards_compatible(current_v: str, new_v: str) -> bool:
    curr_maj, curr_min, _ = parse_version(current_v)
    new_maj, new_min, _ = parse_version(new_v)
    # Major version bump means breaking changes!
    if new_maj > curr_maj:
        return False
    return True

print(f"Is 1.1.0 compatible with 1.0.0? {is_backwards_compatible('1.0.0', '1.1.0')}")
print(f"Is 2.0.0 compatible with 1.5.0? {is_backwards_compatible('1.5.0', '2.0.0')}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates how semantic version checking determines whether an upgrade is backwards-compatible based on major version numbers.',
          expected_output: `Is 1.1.0 compatible with 1.0.0? True
Is 2.0.0 compatible with 1.5.0? False`,
          quiz: {
            id: 'quiz-l5-2-5',
            title: 'SemVer & PEP 440 Check',
            questions: [
              {
                id: 'q-l5-2-5-1',
                question: 'If you refactor a public function signature by removing a parameter that callers rely on, which component of the version number MUST be bumped according to SemVer?',
                options: [
                  { id: 'opt_1', text: 'MAJOR version (e.g. 1.4.2 -> 2.0.0)' },
                  { id: 'opt_2', text: 'PATCH version (e.g. 1.4.2 -> 1.4.3)' },
                  { id: 'opt_3', text: 'MINOR version (e.g. 1.4.2 -> 1.5.0)' },
                  { id: 'opt_4', text: 'None; version numbers are arbitrary.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Any breaking, backwards-incompatible public API modification requires incrementing the MAJOR version number to signal risk to downstream consumers.'
              }
            ]
          },
          key_takeaways: [
            'SemVer uses MAJOR.MINOR.PATCH to signal compatibility expectations.',
            'PEP 440 defines Python-specific version strings including alpha, beta, and rc pre-releases.',
            'Never release breaking changes in minor or patch versions.'
          ],
          revision_prompts: [
            'Why do downstream dependencies pin ranges like ~=1.4 (compatible release operator)?'
          ]
        },
        {
          id: 'les-l5-2-6',
          slug: 'building-distributions',
          title: 'Building Distributions: Source (sdist) and Wheels (whl)',
          summary: 'Build production distribution archives using python -m build and inspect wheel metadata internals.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Differentiate between an sdist (.tar.gz) and a wheel (.whl)',
            'Understand wheel filename conventions (PEP 427)',
            'Execute python -m build to generate distribution artifacts in dist/'
          ],
          content_markdown: `### sdist vs Wheel: Why Wheels Won

When you run \`python -m build\`, it generates two files in \`dist/\`:

1. **Source Distribution (\`sdist\`, \`.tar.gz\`):**
   - Contains your raw source files and packaging metadata.
   - Requires compilation / parsing during client installation.
2. **Wheel (\`built distribution\`, \`.whl\`):**
   - Pre-built, pre-processed zip archive.
   - Simply unpacked into the user's \`site-packages\` directory—**zero build time**!
   - Pure Python packages use \`py3-none-any.whl\`.

\`\`\`
Wheel Filename Format (PEP 427):
{distribution}-{version}(-{build tag})?-{python tag}-{abi tag}-{platform tag}.whl

Example:
revoraa_sdk-1.0.0-py3-none-any.whl
├── revoraa_sdk/          # Installed Python code
└── revoraa_sdk-1.0.0.dist-info/ # Metadata, license, entry points
\`\`\``,
          code_snippet: `# Parsing a standard PEP 427 wheel filename
import re

def parse_wheel_filename(filename: str) -> dict:
    pattern = r"^([^-]+)-([^-]+)-([^-]+)-([^-]+)-([^-]+)\.whl$"
    m = re.match(pattern, filename)
    if not m:
        return {"error": "Invalid wheel filename format"}
    return {
        "package": m.group(1),
        "version": m.group(2),
        "python_tag": m.group(3),
        "abi_tag": m.group(4),
        "platform_tag": m.group(5),
        "is_pure_python": m.group(3) == "py3" and m.group(5) == "any"
    }

parsed = parse_wheel_filename("revoraa_service-1.2.0-py3-none-any.whl")
print("Wheel Filename Breakdown:")
for k, v in parsed.items():
    print(f"  {k}: {v}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates parsing the standard PEP 427 wheel filename convention, verifying that the package is a pure-Python platform-independent wheel.',
          expected_output: `Wheel Filename Breakdown:
  package: revoraa_service
  version: 1.2.0
  python_tag: py3
  abi_tag: none
  platform_tag: any
  is_pure_python: True`,
          quiz: {
            id: 'quiz-l5-2-6',
            title: 'Wheel Architecture Check',
            questions: [
              {
                id: 'q-l5-2-6-1',
                question: 'Why are wheels (.whl) dramatically faster to install than source distributions (.tar.gz)?',
                options: [
                  { id: 'opt_1', text: 'Wheels are pre-built ZIP archives that pip directly unpacks into site-packages without running a build process.' },
                  { id: 'opt_2', text: 'Wheels bypass operating system file permission checks.' },
                  { id: 'opt_3', text: 'Wheels do not contain any Python bytecode.' },
                  { id: 'opt_4', text: 'Wheels can only be installed over high-speed optical fiber.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'A wheel is ready to use: pip simply extracts it into site-packages and registers the metadata, avoiding any compilation or setup execution during installation.'
              }
            ]
          },
          key_takeaways: [
            'python -m build generates both an sdist (.tar.gz) and a wheel (.whl).',
            'Wheels are pre-built archives that install instantaneously without running build hooks.',
            'Pure Python packages produce a py3-none-any.whl wheel artifact.'
          ],
          revision_prompts: [
            'Why does PyPI strongly recommend uploading BOTH an sdist and a wheel for every release?'
          ]
        }
      ]
    },
    {
      id: 'top-l5-2-2',
      slug: 'install-and-supply-chain',
      title: 'Installation, Editable Mode & Supply-Chain Security',
      summary: 'Master local installations, editable installs, package indexing, supply chain vulnerability defenses, and release checklists.',
      sort_order: 2,
      lessons: [
        {
          id: 'les-l5-2-7',
          slug: 'installing-a-package-locally',
          title: 'Installing a Package Locally',
          summary: 'Install built distributions in clean isolated virtual environments using pip install dist/*.whl.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Test installations locally from dist/ artifacts before publishing',
            'Verify installation into a pristine test virtual environment',
            'Ensure packaged data files and console scripts are accessible'
          ],
          content_markdown: `### The "Test Before You Publish" Rule

Never publish a package to a registry without testing its wheel in a fresh environment!

Testing workflow:
\`\`\`bash
# 1. Build the distribution:
python -m build

# 2. Create a clean sandbox environment:
python -m venv /tmp/test-env
source /tmp/test-env/bin/activate

# 3. Install the built wheel:
pip install dist/my_package-1.0.0-py3-none-any.whl

# 4. Verify imports and CLI command from an outside directory:
cd /tmp
python -c "import my_package; print(my_package.__version__)"
my-cli --help
\`\`\`

If this test fails, you caught a missing asset or broken import before users did!`,
          code_snippet: `# Simulating post-installation smoke test verification
def run_post_install_smoke_test(package_obj) -> dict:
    checks = {
        "has_version": hasattr(package_obj, "__version__"),
        "has_public_api": hasattr(package_obj, "run"),
        "callable_works": False
    }
    if checks["has_public_api"]:
        checks["callable_works"] = package_obj.run() == "OK"
    return checks

# Mock installed package:
class MockInstalledPackage:
    __version__ = "1.0.0"
    @staticmethod
    def run(): return "OK"

results = run_post_install_smoke_test(MockInstalledPackage)
print(f"Smoke Test Results: {results}")
print(f"All smoke checks passed: {all(results.values())}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates programmatic smoke testing to verify that a package installation provides expected version attributes and functional entry points.',
          expected_output: `Smoke Test Results: {'has_version': True, 'has_public_api': True, 'callable_works': True}
All smoke checks passed: True`,
          quiz: {
            id: 'quiz-l5-2-7',
            title: 'Local Install Testing Check',
            questions: [
              {
                id: 'q-l5-2-7-1',
                question: 'Why must you change your working directory (e.g. cd /tmp) before testing a newly installed package with python -c "import my_package"?',
                options: [
                  { id: 'opt_1', text: 'To ensure Python imports the installed wheel from site-packages rather than the local source code folder in your current directory.' },
                  { id: 'opt_2', text: 'To prevent the hard drive from running out of space.' },
                  { id: 'opt_3', text: 'Because pip deletes the repository if you test from the same folder.' },
                  { id: 'opt_4', text: 'It is a requirement of the Python license.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'If you test from your project root, Python might import from the local folder, masking packaging bugs such as missing files or incomplete dependencies.'
              }
            ]
          },
          key_takeaways: [
            'Always test installation of the built wheel file in a separate, isolated environment.',
            'Change working directory away from project root when running verification tests.',
            'Verify both library imports and CLI commands.'
          ],
          revision_prompts: [
            'What is a smoke test in release management?'
          ]
        },
        {
          id: 'les-l5-2-8',
          slug: 'editable-installations',
          title: 'Editable Installations and How .pth Files Work',
          summary: 'Understand pip install -e . and how PEP 660 hooks link live source code into site-packages.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand editable mode (pip install -e .)',
            'Explain path configuration (.pth) files and PEP 660 build_editable hooks',
            'Recognize when an editable install must be re-run (e.g. new entry points)'
          ],
          content_markdown: `### How Does \`pip install -e .\` Work?

During active development, building and reinstalling a wheel every time you change a line of code is painful.
**Editable mode (\`-e\`)** links your live source directory directly into the virtual environment:

\`\`\`
.venv/lib/python3.12/site-packages/
  └── _my_package.pth (or editable finder hook)
        └── points directly to: /Users/dev/my_project/src
\`\`\`

When you edit \`src/my_package/core.py\`, your changes are **immediately live** in the environment!

**Caution**: If you modify \`[project.scripts]\` or add new non-Python assets in \`pyproject.toml\`, you must re-run \`pip install -e .\` for the build backend to regenerate the entry points.`,
          code_snippet: `# Demonstrating how a .pth path configuration file works
import sys

def simulate_pth_file_resolution(site_packages_dir: str, pth_content: str) -> list:
    mock_sys_path = [site_packages_dir]
    # Python reads .pth files in site-packages and appends paths to sys.path
    for line in pth_content.splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            mock_sys_path.append(line)
    return mock_sys_path

pth_text = """
# Editable install reference
/Users/dev/revoraa_repo/src
"""

resolved_paths = simulate_pth_file_resolution("/venv/lib/site-packages", pth_text)
print("Simulated sys.path after .pth evaluation:")
for p in resolved_paths:
    print(f"  -> {p}")`,
          code_language: 'python',
          code_explanation: 'Illustrates how Python reads .pth files located in site-packages and automatically adds the referenced source directories to sys.path.',
          expected_output: `Simulated sys.path after .pth evaluation:
  -> /venv/lib/site-packages
  -> /Users/dev/revoraa_repo/src`,
          quiz: {
            id: 'quiz-l5-2-8',
            title: 'Editable Mode Check',
            questions: [
              {
                id: 'q-l5-2-8-1',
                question: 'When using an editable install (pip install -e .), which of the following changes requires re-running the install command?',
                options: [
                  { id: 'opt_1', text: 'Adding a new CLI entry point in pyproject.toml [project.scripts].' },
                  { id: 'opt_2', text: 'Editing a function inside an existing Python file in src/.' },
                  { id: 'opt_3', text: 'Adding a comment to an existing function.' },
                  { id: 'opt_4', text: 'Fixing a typo in a string literal.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Code changes are live immediately, but metadata changes (like creating new console script entry points or changing dependencies) require re-running the editable install.'
              }
            ]
          },
          key_takeaways: [
            'pip install -e . links your live source tree into site-packages.',
            'Under PEP 660, build backends generate dynamic editable finders or .pth links.',
            'Re-run editable installation whenever you modify pyproject.toml metadata or entry points.'
          ],
          revision_prompts: [
            'Why should you never use editable installs in production Docker containers?'
          ]
        },
        {
          id: 'les-l5-2-9',
          slug: 'publishing-concepts-and-package-indexes',
          title: 'Publishing Concepts and Package Indexes',
          summary: 'Understand PyPI, TestPyPI, API tokens, twine/hatch publish, and secure credential handling.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand PyPI (Python Package Index) architecture and TestPyPI',
            'Use scoped API tokens and Trusted Publishers (OIDC) instead of passwords',
            'Explain why published version numbers are immutable on PyPI'
          ],
          content_markdown: `### PyPI Architecture and Immutability

**PyPI (pypi.org)** is the official package index for Python.

Key security principles when publishing:
1. **Never use account passwords**: Use scoped API tokens (\`pypi-...\`) or GitHub Actions OIDC (Trusted Publishing).
2. **Version Immutability**: Once \`my_package-1.0.0.tar.gz\` is published to PyPI, **it can never be overwritten or updated**. If you find a bug 5 minutes after release, you must release \`1.0.1\`!
3. **Test on TestPyPI first**: \`test.pypi.org\` is an isolated sandbox environment where you can test package uploads without polluting production index namespaces.`,
          code_snippet: `# Simulating PyPI upload token format validation
import re

def validate_pypi_token(token: str) -> bool:
    # PyPI API tokens begin with pypi- prefix
    return bool(re.match(r"^pypi-[A-Za-z0-9_-]{30,}$", token))

print(f"Is standard token valid: {validate_pypi_token('pypi-AgEIcHlwaS5vcmcCJDEyMzQ1Njc4LTkwYWItY2RlZg')}")
print(f"Is raw password rejected: {validate_pypi_token('my_super_secret_password_123')}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates verification of modern scoped PyPI API token formats, enforcing that account passwords are never used for publishing.',
          expected_output: `Is standard token valid: True
Is raw password rejected: False`,
          quiz: {
            id: 'quiz-l5-2-9',
            title: 'PyPI Publishing Check',
            questions: [
              {
                id: 'q-l5-2-9-1',
                question: 'What happens if you accidentally publish a broken wheel as v1.2.0 to PyPI and try to re-upload a fixed v1.2.0 file?',
                options: [
                  { id: 'opt_1', text: 'PyPI rejects the upload because release filenames and version artifacts are permanently immutable.' },
                  { id: 'opt_2', text: 'PyPI automatically overwrites the old file.' },
                  { id: 'opt_3', text: 'PyPI rolls back the version number to 1.1.9.' },
                  { id: 'opt_4', text: 'PyPI renames the package.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'PyPI enforces immutability to prevent supply-chain attacks and build breaking. Once a version artifact is uploaded, it cannot be replaced; you must bump to 1.2.1.'
              }
            ]
          },
          key_takeaways: [
            'PyPI artifacts are strictly immutable: never reuse a version number.',
            'Publish with scoped API tokens or OIDC Trusted Publishing, never raw passwords.',
            'Use TestPyPI to verify release pipelines before touching production.'
          ],
          revision_prompts: [
            'What is OIDC Trusted Publishing in GitHub Actions and PyPI?'
          ]
        },
        {
          id: 'les-l5-2-10',
          slug: 'dependency-conflicts-and-supply-chain-awareness',
          title: 'Dependency Conflicts and Supply-Chain Awareness',
          summary: 'Protect applications against typosquatting, dependency confusion, malicious setup scripts, and unpinned transitive risks.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Understand typosquatting and dependency confusion attacks',
            'Use pip hash-checking mode (--require-hashes)',
            'Scan dependencies using vulnerability tools (pip-audit, osv-scanner)'
          ],
          content_markdown: `### Supply-Chain Threats in Python

When you run \`pip install\`, you are executing code written by strangers with full user privileges on your machine!

### Common Attack Vectors:
1. **Typosquatting**:
   - Attackers register packages with names similar to popular ones (e.g. \`reqeusts\` instead of \`requests\`, \`color-ama\` instead of \`colorama\`).
2. **Dependency Confusion**:
   - If an internal company package is named \`corp-auth\`, an attacker publishes \`corp-auth\` on public PyPI with version \`99.9.9\`. Poorly configured pip installs the public malware!
3. **Hash-Checking Mode**:
   - By locking exact sha256 hashes in \`requirements.txt\`, pip verifies that the downloaded byte archive matches the known cryptographic signature:
   \`\`\`
   httpx==0.27.0 --hash=sha256:7b8d...
   \`\`\``,
          code_snippet: `# Simulating detection of suspicious typosquatting names
import difflib

POPULAR_PACKAGES = ["requests", "urllib3", "pydantic", "pytest", "numpy"]

def check_package_safety(target_name: str) -> dict:
    target = target_name.lower().strip()
    if target in POPULAR_PACKAGES:
        return {"status": "LEGITIMATE", "warning": None}
    
    # Check for near matches (typosquatting)
    close_matches = difflib.get_close_matches(target, POPULAR_PACKAGES, cutoff=0.75)
    if close_matches:
        return {
            "status": "SUSPICIOUS",
            "warning": f"Possible typosquatting! Did you mean '{close_matches[0]}' instead of '{target}'?"
        }
    return {"status": "UNKNOWN", "warning": None}

print(check_package_safety("requests"))
print(check_package_safety("reqeusts"))`,
          code_language: 'python',
          code_explanation: 'Demonstrates algorithmic similarity matching to detect suspicious package names that resemble established industry libraries.',
          expected_output: `{'status': 'LEGITIMATE', 'warning': None}
{'status': 'SUSPICIOUS', 'warning': "Possible typosquatting! Did you mean 'requests' instead of 'reqeusts'?"}`,
          quiz: {
            id: 'quiz-l5-2-10',
            title: 'Supply Chain Security Check',
            questions: [
              {
                id: 'q-l5-2-10-1',
                question: 'What is typosquatting in package management ecosystems?',
                options: [
                  { id: 'opt_1', text: 'Registering malicious packages with names intentionally similar to popular libraries to trick developers into installing malware.' },
                  { id: 'opt_2', text: 'Typing too quickly in the terminal.' },
                  { id: 'opt_3', text: 'A tool that automatically formats Python code.' },
                  { id: 'opt_4', text: 'Writing variable names in camelCase.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Typosquatting takes advantage of common developer typographical errors (e.g. "reqeusts") to deliver malicious code.'
              }
            ]
          },
          key_takeaways: [
            'Audit package names carefully before running pip install.',
            'Use hash-checking mode (--require-hashes) in production build pipelines.',
            'Run automated security scanners like pip-audit in CI to catch CVEs in dependencies.'
          ],
          revision_prompts: [
            'How does pip-audit detect known vulnerabilities in installed dependencies?'
          ]
        },
        {
          id: 'les-l5-2-11',
          slug: 'release-checklists',
          title: 'The Production Release Checklist',
          summary: 'Establish an immutable, repeatable release checklist before tagging and deploying Python versions.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Follow a structured pre-release verification checklist',
            'Maintain CHANGELOG.md using Keep a Changelog standards',
            'Automate release tagging and git commit hygiene'
          ],
          content_markdown: `### The Pre-Release Checklist

Never release under pressure without following a checklist:

1. **Test Suite**: 100% passing tests on all supported Python versions (3.10, 3.11, 3.12).
2. **Quality Gates**: Ruff linting and Mypy strict type checks pass with 0 errors.
3. **Changelog**: \`CHANGELOG.md\` updated with Added, Changed, Fixed, and Removed sections.
4. **Clean Git State**: Working directory is clean with no uncommitted changes.
5. **Fresh Build**: \`rm -rf dist/ && python -m build\` succeeds cleanly.
6. **Smoke Test**: Wheel successfully installs and passes smoke verification in a clean venv.
7. **Git Tag**: Commit tagged with annotated git tag (\`git tag -a v1.2.0 -m "Release v1.2.0"\`).`,
          code_snippet: `# Verifying release checklist items programmatically
def evaluate_release_readiness(checklist: dict) -> dict:
    pending = [k for k, done in checklist.items() if not done]
    return {
        "ready_to_publish": len(pending) == 0,
        "pending_items": pending
    }

my_checklist = {
    "tests_passing": True,
    "changelog_updated": True,
    "clean_git_tree": True,
    "smoke_test_verified": True,
    "secrets_checked": True
}

report = evaluate_release_readiness(my_checklist)
print(f"Is Release Approved: {report['ready_to_publish']}")
print(f"Pending Blockers: {report['pending_items']}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates a formal pre-release checklist evaluation function to ensure no deployment steps are bypassed.',
          expected_output: `Is Release Approved: True
Pending Blockers: []`,
          quiz: {
            id: 'quiz-l5-2-11',
            title: 'Release Checklist Check',
            questions: [
              {
                id: 'q-l5-2-11-1',
                question: 'Why should the dist/ directory be deleted (rm -rf dist/) before running python -m build for a new release?',
                options: [
                  { id: 'opt_1', text: 'To ensure old artifacts from previous releases do not get accidentally uploaded to the registry alongside the new version.' },
                  { id: 'opt_2', text: 'Because python -m build crashes if dist/ already exists.' },
                  { id: 'opt_3', text: 'To clear your operating system DNS cache.' },
                  { id: 'opt_4', text: 'Because Python requires empty hard drive sectors.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'If old wheels remain in dist/, upload tools like twine might re-upload stale artifacts or fail due to PyPI immutability conflicts.'
              }
            ]
          },
          key_takeaways: [
            'Follow a strict pre-release checklist to avoid panicked production rollbacks.',
            'Keep CHANGELOG.md updated according to Keep a Changelog conventions.',
            'Always clear the dist/ folder before generating fresh release builds.'
          ],
          revision_prompts: [
            'Why are annotated git tags (git tag -a) preferred over lightweight tags for releases?'
          ]
        },
        {
          id: 'les-l5-2-12',
          slug: 'maintaining-backward-compatibility',
          title: 'Maintaining Backward Compatibility and Deprecations',
          summary: 'Evolve APIs gracefully using warnings.warn(DeprecationWarning), transitional shims, and multi-version deprecation cycles.',
          estimated_minutes: 25,
          xp_reward: 40,
          learning_objectives: [
            'Emit standard warnings using warnings.warn and DeprecationWarning',
            'Design backwards-compatible parameter transitions (*, old_arg=None)',
            'Plan a 2-minor-release deprecation cycle before removing APIs'
          ],
          content_markdown: `### The Art of Graceful Deprecation

Never delete or abruptly alter a public function in production software without a warning period.

### The 3-Stage Deprecation Lifecycle:

1. **Release N.X.0 (Announce)**:
   - Introduce the new API.
   - Decorate the old API to emit a \`DeprecationWarning\`.
   - Point users to the replacement function in docstrings.
2. **Release N.(X+1).0 (Sustain)**:
   - Deprecated API continues working.
   - Documentation highlights impending removal.
3. **Release (N+1).0.0 (Remove)**:
   - The old function is safely deleted in the next MAJOR version bump.

\`\`\`python
import warnings

def old_calculate(x, y):
    warnings.warn(
        "old_calculate() is deprecated and will be removed in v2.0. Use compute() instead.",
        category=DeprecationWarning,
        stacklevel=2 # Attributes warning to the caller's line of code!
    )
    return compute(x, y)
\`\`\``,
          code_snippet: `import warnings

def compute(x: int, y: int) -> int:
    return x + y

def legacy_add(a: int, b: int) -> int:
    warnings.warn(
        "legacy_add() is deprecated; use compute() instead.",
        category=DeprecationWarning,
        stacklevel=2
    )
    return compute(a, b)

with warnings.catch_warnings(record=True) as captured:
    warnings.simplefilter("always")
    res = legacy_add(5, 10)
    print(f"Result computed: {res}")
    print(f"Warnings captured: {len(captured)}")
    print(f"Warning message: {captured[0].message}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates emitting a standard Python DeprecationWarning with stacklevel=2 to cleanly alert callers to an impending API change.',
          expected_output: `Result computed: 15
Warnings captured: 1
Warning message: legacy_add() is deprecated; use compute() instead.`,
          quiz: {
            id: 'quiz-l5-2-12',
            title: 'Deprecation Best Practices Check',
            questions: [
              {
                id: 'q-l5-2-12-1',
                question: 'Why is setting stacklevel=2 important when emitting warnings with warnings.warn() inside a deprecated function?',
                options: [
                  { id: 'opt_1', text: 'It points the warning to the caller line that invoked the deprecated function, rather than the line inside the library where warnings.warn() is called.' },
                  { id: 'opt_2', text: 'It suppresses the warning from being printed in the terminal.' },
                  { id: 'opt_3', text: 'It increases the execution priority of the warning.' },
                  { id: 'opt_4', text: 'It raises a RuntimeError immediately.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'Without stacklevel=2, the warning points to the internal library file. With stacklevel=2, Python points the developer directly to their own line of code that invoked the deprecated API.'
              }
            ]
          },
          key_takeaways: [
            'Never remove public APIs without a multi-release deprecation warning period.',
            'Use warnings.warn(..., category=DeprecationWarning, stacklevel=2) to identify caller sites.',
            'Only remove deprecated APIs on MAJOR semantic version boundaries.'
          ],
          revision_prompts: [
            'Why does Python hide DeprecationWarnings from end-users by default in production?'
          ]
        }
      ]
    }
  ]
};
