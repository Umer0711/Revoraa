/**
 * Revoraa Level 5: Expert / Production Python - Guided Projects Dataset
 * 
 * 8 Module Projects + 1 Capstone Project (Production Python Project Lab)
 * Total 42 progressive milestones with starter code, assertions,
 * and multilingual instructions (English, Hinglish, Hindi).
 */

export const LEVEL_5_PROJECTS = [
  // ─── Module 1 Project: Production-Ready Python Package ───────────────────────
  {
    id: 'proj-05-production-ready-package',
    slug: 'production-ready-python-package',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Production-Ready Python Package',
    tagline: 'Create a reusable package with documented public interfaces, clean directory structure, and CLI entry points.',
    difficulty: 'expert',
    estimated_hours: 6,
    xp_reward: 240,
    is_published: true,
    description: {
      en: 'Construct a production-standard Python package using the src-layout, strict __all__ interface boundaries, isolated dependency definitions, and reusable CLI entry points.',
      'hi-Latn': 'Ek production-ready Python package banayein jo src-layout, strict __all__ export boundary, dependency pinning aur CLI entry points follow kare.',
      hi: 'एक प्रोडक्शन-तैयार पायथन पैकेज बनाएं जो src-लेआउट, सख्त __all__ निर्यात सीमा, निर्भरता नियंत्रण और सीएलआई प्रविष्टि बिंदुओं का उपयोग करे।'
    },
    learning_objectives: [
      'Design a clean src-layout directory architecture',
      'Enforce explicit public boundaries using __all__ and __init__.py',
      'Create reusable CLI entry point functions using sys.argv and argparse',
      'Separate environment configuration from domain business logic'
    ],
    milestones: [
      {
        id: 'm1-package-layout-auditor',
        title: 'Milestone 1: Package Structure Validator',
        instructions: {
          en: 'Implement `audit_package_layout(file_paths: list[str]) -> dict`. Verify that the package uses the `src/` layout (e.g. `src/mypkg/__init__.py`), includes `pyproject.toml`, has a `tests/` folder, and includes a `README.md`. Return `{"valid": bool, "missing": list[str]}`.',
          'hi-Latn': '`audit_package_layout(file_paths)` banayein jo verify kare ki files me `src/`, `pyproject.toml`, `tests/` aur `README.md` shamil hain.',
          hi: '`audit_package_layout(file_paths)` लागू करें जो सत्यापित करे कि फ़ाइलों में `src/`, `pyproject.toml`, `tests/` और `README.md` शामिल हैं।'
        },
        starter_code: `def audit_package_layout(file_paths: list[str]) -> dict:
    required = ["pyproject.toml", "README.md"]
    missing = []
    
    # Check top-level files
    for req in required:
        if req not in file_paths:
            missing.append(req)
            
    # Check src layout
    has_src = any(p.startswith("src/") and p.endswith("__init__.py") for p in file_paths)
    if not has_src:
        missing.append("src/<pkg>/__init__.py")
        
    # Check tests directory
    has_tests = any(p.startswith("tests/") for p in file_paths)
    if not has_tests:
        missing.append("tests/")
        
    return {
        "valid": len(missing) == 0,
        "missing": missing
    }`,
        test_harness: `
valid_tree = ["src/mypkg/__init__.py", "src/mypkg/core.py", "pyproject.toml", "README.md", "tests/test_core.py"]
res = audit_package_layout(valid_tree)
assert res["valid"] is True
assert res["missing"] == []

invalid_tree = ["mypkg/__init__.py", "setup.py"]
res_bad = audit_package_layout(invalid_tree)
assert res_bad["valid"] is False
assert "pyproject.toml" in res_bad["missing"]
assert "src/<pkg>/__init__.py" in res_bad["missing"]
print("MILESTONE 1 VERIFIED: Package layout auditor passed!")`
      },
      {
        id: 'm2-public-api-export-guard',
        title: 'Milestone 2: Public Interface Export Boundary',
        instructions: {
          en: 'Implement `export_public_api(module_symbols: dict, all_list: list[str]) -> dict`. It must return only the symbols explicitly enumerated in `all_list`. If a symbol in `all_list` does not exist in `module_symbols`, raise `AttributeError`.',
          'hi-Latn': '`export_public_api(module_symbols, all_list)` banayein jo sirf `all_list` me defined symbols return kare aur missing symbols par `AttributeError` raise kare.',
          hi: '`export_public_api(module_symbols, all_list)` लागू करें जो केवल `all_list` में परिभाषित प्रतीकों को लौटाए और अनुपलब्ध प्रतीकों पर `AttributeError` उठाए।'
        },
        starter_code: `def export_public_api(module_symbols: dict, all_list: list[str]) -> dict:
    public_api = {}
    for name in all_list:
        if name not in module_symbols:
            raise AttributeError(f"Module does not export symbol '{name}' listed in __all__")
        public_api[name] = module_symbols[name]
    return public_api`,
        test_harness: `
symbols = {"UserService": "cls", "_internal_cache": "dict", "hash_password": "func"}
public = export_public_api(symbols, ["UserService", "hash_password"])
assert "UserService" in public
assert "hash_password" in public
assert "_internal_cache" not in public

try:
    export_public_api(symbols, ["UserService", "non_existent"])
    assert False, "Should have raised AttributeError"
except AttributeError:
    pass
print("MILESTONE 2 VERIFIED: Public API export guard passed!")`
      },
      {
        id: 'm3-cli-entrypoint-runner',
        title: 'Milestone 3: Command-Line Entry Point Runner',
        instructions: {
          en: 'Implement `cli_entrypoint(argv: list[str]) -> int`. Parse command-line arguments: if `--version` is passed, return 0; if `--help` is passed, return 0; if `run` subcommand is passed with `--port <int>`, return the port number; otherwise return 1.',
          'hi-Latn': '`cli_entrypoint(argv)` banayein jo `--version` ya `--help` par 0 return kare, `run --port <int>` par port number return kare, aur invalid flags par 1.',
          hi: '`cli_entrypoint(argv)` लागू करें जो `--version` या `--help` पर 0 लौटाए, `run --port <int>` पर पोर्ट संख्या लौटाए, और अमान्य इनपुट पर 1।'
        },
        starter_code: `def cli_entrypoint(argv: list[str]) -> int:
    if not argv:
        return 1
    if "--version" in argv or "--help" in argv:
        return 0
    if argv[0] == "run":
        if "--port" in argv:
            idx = argv.index("--port")
            if idx + 1 < len(argv) and argv[idx + 1].isdigit():
                return int(argv[idx + 1])
        return 8000 # default
    return 1`,
        test_harness: `
assert cli_entrypoint(["--version"]) == 0
assert cli_entrypoint(["run", "--port", "9090"]) == 9090
assert cli_entrypoint(["run"]) == 8000
assert cli_entrypoint(["unknown-command"]) == 1
print("MILESTONE 3 VERIFIED: CLI entry point runner passed!")`
      },
      {
        id: 'm4-environment-profile-loader',
        title: 'Milestone 4: Environment Profile Loader',
        instructions: {
          en: 'Implement `load_profile_config(env_name: str, overrides: dict) -> dict`. Supported environments are `"development"`, `"testing"`, and `"production"`. Production must have `debug=False` and `secure_cookies=True`. Overrides should update configuration but cannot set `debug=True` in production (raise `ValueError`).',
          'hi-Latn': '`load_profile_config(env_name, overrides)` banayein. Production me `debug=False` aur `secure_cookies=True` mandatory hai; agar overrides production me `debug=True` kare to `ValueError` raise karein.',
          hi: '`load_profile_config(env_name, overrides)` लागू करें। प्रोडक्शन में `debug=False` अनिवार्य है; यदि ओवरराइड्स प्रोडक्शन में `debug=True` करने का प्रयास करें तो `ValueError` उठाएं।'
        },
        starter_code: `def load_profile_config(env_name: str, overrides: dict = None) -> dict:
    overrides = overrides or {}
    defaults = {
        "development": {"debug": True, "secure_cookies": False, "log_level": "DEBUG"},
        "testing": {"debug": True, "secure_cookies": False, "log_level": "INFO"},
        "production": {"debug": False, "secure_cookies": True, "log_level": "WARNING"},
    }
    if env_name not in defaults:
        raise ValueError(f"Unknown environment: {env_name}")
        
    config = dict(defaults[env_name])
    config.update(overrides)
    
    if env_name == "production" and config.get("debug") is True:
        raise ValueError("Cannot enable debug mode in production profile!")
        
    return config`,
        test_harness: `
dev = load_profile_config("development")
assert dev["debug"] is True

prod = load_profile_config("production", {"log_level": "ERROR"})
assert prod["debug"] is False
assert prod["log_level"] == "ERROR"
assert prod["secure_cookies"] is True

try:
    load_profile_config("production", {"debug": True})
    assert False, "Should have blocked debug in production"
except ValueError:
    pass
print("MILESTONE 4 VERIFIED: Environment profile loader passed!")`
      }
    ]
  },

  // ─── Module 2 Project: Release a Reusable Utility Library ───────────────────
  {
    id: 'proj-05-release-utility-library',
    slug: 'release-reusable-utility-library',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Release a Reusable Utility Library',
    tagline: 'Package, version, test, and build a standards-compliant Python utility library.',
    difficulty: 'expert',
    estimated_hours: 6,
    xp_reward: 240,
    is_published: true,
    description: {
      en: 'Construct a distributable Python utility package with PEP 517 build metadata, PEP 440 semantic versioning, distribution artifact verification, and backward-compatible deprecation warnings.',
      'hi-Latn': 'Ek reusable utility library banayein jisme pyproject.toml, PEP 440 versioning, wheel verification aur deprecation warnings implemented ho.',
      hi: 'एक पुन: प्रयोज्य उपयोगिता लाइब्रेरी बनाएं जिसमें pyproject.toml, PEP 440 वर्शनिंग, व्हील सत्यापन और अप्रचलन चेतावनियां लागू हों।'
    },
    learning_objectives: [
      'Write standards-compliant pyproject.toml package metadata',
      'Validate PEP 440 and Semantic Versioning schemes',
      'Inspect sdist and wheel distribution archives',
      'Implement API deprecation lifecycles with standard warnings'
    ],
    milestones: [
      {
        id: 'm1-pyproject-metadata-validator',
        title: 'Milestone 1: pyproject.toml Metadata Validator',
        instructions: {
          en: 'Implement `validate_pyproject_toml(config: dict) -> dict`. Verify that `project.name`, `project.version`, `project.dependencies`, and `build-system.build-backend` are present. Return `{"valid": bool, "errors": list[str]}`.',
          'hi-Latn': '`validate_pyproject_toml(config)` banayein jo `name`, `version`, `dependencies`, aur `build-backend` check kare.',
          hi: '`validate_pyproject_toml(config)` लागू करें जो `name`, `version`, `dependencies`, और `build-backend` की उपस्थिति की पुष्टि करे।'
        },
        starter_code: `def validate_pyproject_toml(config: dict) -> dict:
    errors = []
    build_sys = config.get("build-system", {})
    if not build_sys.get("build-backend"):
        errors.append("Missing build-system.build-backend")
        
    proj = config.get("project", {})
    if not proj.get("name"):
        errors.append("Missing project.name")
    if not proj.get("version"):
        errors.append("Missing project.version")
    if "dependencies" not in proj:
        errors.append("Missing project.dependencies list")
        
    return {"valid": len(errors) == 0, "errors": errors}`,
        test_harness: `
valid_cfg = {
    "build-system": {"build-backend": "hatchling.build"},
    "project": {"name": "revoraa-utils", "version": "1.0.0", "dependencies": ["pydantic>=2.0"]}
}
res = validate_pyproject_toml(valid_cfg)
assert res["valid"] is True

bad_cfg = {"project": {"name": "bad"}}
res_bad = validate_pyproject_toml(bad_cfg)
assert res_bad["valid"] is False
assert len(res_bad["errors"]) >= 3
print("MILESTONE 1 VERIFIED: pyproject metadata validator passed!")`
      },
      {
        id: 'm2-semver-version-parser',
        title: 'Milestone 2: Semantic Version Parser and Comparator',
        instructions: {
          en: 'Implement `compare_versions(v1: str, v2: str) -> int`. Compare two semantic version strings "MAJOR.MINOR.PATCH". Return 1 if v1 > v2, -1 if v1 < v2, and 0 if equal.',
          'hi-Latn': '`compare_versions(v1, v2)` banayein jo "MAJOR.MINOR.PATCH" version compare kare aur 1, -1, ya 0 return kare.',
          hi: '`compare_versions(v1, v2)` लागू करें जो दो सेमांटिक वर्शन स्ट्रिंग्स की तुलना करे और 1, -1, या 0 लौटाए।'
        },
        starter_code: `def compare_versions(v1: str, v2: str) -> int:
    t1 = tuple(int(x) for x in v1.split("."))
    t2 = tuple(int(x) for x in v2.split("."))
    if t1 > t2:
        return 1
    elif t1 < t2:
        return -1
    return 0`,
        test_harness: `
assert compare_versions("1.2.0", "1.1.9") == 1
assert compare_versions("2.0.0", "2.0.1") == -1
assert compare_versions("3.4.1", "3.4.1") == 0
print("MILESTONE 2 VERIFIED: SemVer comparator passed!")`
      },
      {
        id: 'm3-wheel-name-parser',
        title: 'Milestone 3: Wheel Filename Tag Validator',
        instructions: {
          en: 'Implement `parse_wheel_filename(filename: str) -> dict`. Parse standard wheel names `{distribution}-{version}(-{build_tag})?-{python_tag}-{abi_tag}-{platform_tag}.whl`. Extract and return distribution, version, python_tag, abi_tag, and platform_tag.',
          'hi-Latn': '`parse_wheel_filename(filename)` banayein jo wheel file name parse karke distribution, version, tags extract kare.',
          hi: '`parse_wheel_filename(filename)` लागू करें जो मानक व्हील फ़ाइल नाम को पार्स करे और टैग निकाले।'
        },
        starter_code: `def parse_wheel_filename(filename: str) -> dict:
    if not filename.endswith(".whl"):
        raise ValueError("Filename must end with .whl")
    stem = filename[:-4]
    parts = stem.split("-")
    if len(parts) < 5:
        raise ValueError("Invalid wheel filename format")
    return {
        "distribution": parts[0],
        "version": parts[1],
        "python_tag": parts[-3],
        "abi_tag": parts[-2],
        "platform_tag": parts[-1]
    }`,
        test_harness: `
whl = "revoraa_utils-2.1.0-py3-none-any.whl"
res = parse_wheel_filename(whl)
assert res["distribution"] == "revoraa_utils"
assert res["version"] == "2.1.0"
assert res["python_tag"] == "py3"
assert res["platform_tag"] == "any"
print("MILESTONE 3 VERIFIED: Wheel filename validator passed!")`
      },
      {
        id: 'm4-deprecation-tracker',
        title: 'Milestone 4: Deprecation Lifecycle Tracker',
        instructions: {
          en: 'Implement `audit_api_deprecations(api_registry: dict, target_version: str) -> list[str]`. Each registry item has `{"deprecated_in": str, "remove_in": str}`. If `compare_versions(target_version, item["remove_in"]) >= 0`, add warning that API must be removed.',
          'hi-Latn': '`audit_api_deprecations(api_registry, target_version)` banayein jo detect kare kaun se APIs target version me remove hone chahiye.',
          hi: '`audit_api_deprecations(api_registry, target_version)` लागू करें जो पता लगाए कि कौन से एपीआई हटाए जाने के योग्य हैं।'
        },
        starter_code: `def audit_api_deprecations(api_registry: dict, target_version: str) -> list[str]:
    to_remove = []
    for func_name, meta in api_registry.items():
        remove_in = meta.get("remove_in")
        if remove_in and compare_versions(target_version, remove_in) >= 0:
            to_remove.append(f"Function '{func_name}' is scheduled for removal in v{remove_in} (current: v{target_version})")
    return to_remove`,
        test_harness: `
apis = {
    "legacy_fetch": {"deprecated_in": "1.2.0", "remove_in": "2.0.0"},
    "current_fetch": {"deprecated_in": None, "remove_in": None}
}
res = audit_api_deprecations(apis, "2.0.0")
assert len(res) == 1
assert "legacy_fetch" in res[0]

res_early = audit_api_deprecations(apis, "1.9.0")
assert len(res_early) == 0
print("MILESTONE 4 VERIFIED: Deprecation tracker passed!")`
      }
    ]
  },

  // ─── Module 3 Project: Secure Configuration Layer ────────────────────────────
  {
    id: 'proj-05-secure-configuration-layer',
    slug: 'secure-configuration-layer',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Secure Configuration Layer',
    tagline: 'Build a reusable configuration module that validates settings, masks secrets, and prevents injection attacks.',
    difficulty: 'expert',
    estimated_hours: 6,
    xp_reward: 240,
    is_published: true,
    description: {
      en: 'Implement a production configuration system with fail-fast environment variable validation, a SecretString class that masks credentials in logs, and a parameterized SQL safety guard.',
      'hi-Latn': 'Ek secure configuration layer banayein jo fail-fast validation kare, logs me secrets mask kare aur SQL queries ko parameterize kare.',
      hi: 'एक सुरक्षित कॉन्फ़िगरेशन परत बनाएं जो फ़ेल-फ़ास्ट सत्यापन करे, लॉग में सीक्रेट्स को मास्क करे और एसक्यूएल क्वेरीज़ को पैरामीटराइज़ करे।'
    },
    learning_objectives: [
      'Implement fail-fast configuration loading at application startup',
      'Design a SecretString type that prevents accidental plaintext leaks in __repr__ and __str__',
      'Build a log masking filter to scrub sensitive keys from output streams',
      'Enforce parameterized SQL operations to prevent SQL injection vulnerabilities'
    ],
    milestones: [
      {
        id: 'm1-failfast-env-loader',
        title: 'Milestone 1: Fail-Fast Environment Loader',
        instructions: {
          en: 'Implement `load_required_env(env_dict: dict, required_keys: list[str]) -> dict`. If any key is missing or empty, raise `RuntimeError` listing all missing keys at once.',
          'hi-Latn': '`load_required_env(env_dict, required_keys)` banayein jo missing keys par saare missing variables ke saath `RuntimeError` raise kare.',
          hi: '`load_required_env(env_dict, required_keys)` लागू करें जो किसी भी कुंजी के गायब होने पर `RuntimeError` उठाए।'
        },
        starter_code: `def load_required_env(env_dict: dict, required_keys: list[str]) -> dict:
    missing = [k for k in required_keys if not env_dict.get(k)]
    if missing:
        raise RuntimeError(f"Startup configuration error. Missing required environment variables: {missing}")
    return {k: env_dict[k] for k in required_keys}`,
        test_harness: `
env = {"DB_URL": "postgres://localhost", "API_KEY": "secret123"}
res = load_required_env(env, ["DB_URL", "API_KEY"])
assert res["DB_URL"] == "postgres://localhost"

try:
    load_required_env({"DB_URL": ""}, ["DB_URL", "PORT"])
    assert False, "Should have raised RuntimeError"
except RuntimeError as e:
    assert "DB_URL" in str(e)
    assert "PORT" in str(e)
print("MILESTONE 1 VERIFIED: Fail-fast env loader passed!")`
      },
      {
        id: 'm2-masked-secret-string',
        title: 'Milestone 2: Masked SecretString Representation',
        instructions: {
          en: 'Implement `SecretString` class. Both `__str__` and `__repr__` must return `"**********"`. Provide a method `get_secret_value() -> str` that returns the underlying plaintext value.',
          'hi-Latn': '`SecretString` class banayein jisme `__str__` aur `__repr__` hamesha `"**********"` return karein, aur `get_secret_value()` plaintext return kare.',
          hi: '`SecretString` वर्ग लागू करें जिसमें `__str__` और `__repr__` हमेशा `"**********"` लौटाएं, और `get_secret_value()` प्लेनटेक्स्ट लौटाए।'
        },
        starter_code: `class SecretString:
    def __init__(self, value: str):
        self._value = value
        
    def __repr__(self) -> str:
        return "**********"
        
    def __str__(self) -> str:
        return "**********"
        
    def get_secret_value(self) -> str:
        return self._value`,
        test_harness: `
sec = SecretString("SuperSecretPassword")
assert str(sec) == "**********"
assert repr(sec) == "**********"
assert sec.get_secret_value() == "SuperSecretPassword"
assert "SuperSecretPassword" not in f"Logging credentials: {sec}"
print("MILESTONE 2 VERIFIED: Masked SecretString passed!")`
      },
      {
        id: 'm3-log-scrubbing-filter',
        title: 'Milestone 3: Sensitive Log Stream Scrubber',
        instructions: {
          en: 'Implement `scrub_log_record(record: dict) -> dict`. Any key matching `"password"`, `"token"`, `"secret"`, or `"api_key"` (case-insensitive) must have its value replaced with `"[REDACTED]"`.',
          'hi-Latn': '`scrub_log_record(record)` banayein jo sensitive keys ko `"[REDACTED]"` se replace kare.',
          hi: '`scrub_log_record(record)` लागू करें जो संवेदनशील कुंजियों के मान को `"[REDACTED]"` से बदल दे।'
        },
        starter_code: `def scrub_log_record(record: dict) -> dict:
    sensitive = {"password", "token", "secret", "api_key"}
    scrubbed = {}
    for k, v in record.items():
        if k.lower() in sensitive:
            scrubbed[k] = "[REDACTED]"
        else:
            scrubbed[k] = v
    return scrubbed`,
        test_harness: `
rec = {"user_id": 42, "API_KEY": "live_xyz", "action": "login", "password": "123"}
clean = scrub_log_record(rec)
assert clean["user_id"] == 42
assert clean["API_KEY"] == "[REDACTED]"
assert clean["password"] == "[REDACTED]"
print("MILESTONE 3 VERIFIED: Log stream scrubber passed!")`
      },
      {
        id: 'm4-sql-injection-guard',
        title: 'Milestone 4: Parameterized SQL Guard',
        instructions: {
          en: "Implement `validate_sql_query(query: str, params: tuple) -> bool`. If the query contains raw string formatting (e.g. `%s`, `{}`, or `f'...'` concatenation patterns without parameterized placeholders `?` or `$1`), or if `params` is empty while raw quotes `'` exist in the query, return `False`. Otherwise return `True`.",
          'hi-Latn': '`validate_sql_query(query, params)` banayein jo unparameterized dynamic query strings ko reject kare.',
          hi: '`validate_sql_query(query, params)` लागू करें जो असुरक्षित गतिशील एसक्यूएल स्ट्रिंग्स को अस्वीकार करे।'
        },
        starter_code: `def validate_sql_query(query: str, params: tuple) -> bool:
    # Reject inline quote injection when no params provided
    if "'" in query and not params:
        return False
    if "{}" in query or "%s" in query:
        return False
    return True`,
        test_harness: `
assert validate_sql_query("SELECT * FROM users WHERE id = ?", (42,)) is True
assert validate_sql_query("SELECT * FROM users WHERE username = 'admin'", ()) is False
assert validate_sql_query("SELECT * FROM users WHERE id = %s", ()) is False
print("MILESTONE 4 VERIFIED: Parameterized SQL guard passed!")`
      }
    ]
  },

  // ─── Module 4 Project: Quality Gate for a Python Application ─────────────────
  {
    id: 'proj-05-quality-gate-pipeline',
    slug: 'quality-gate-python-application',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Quality Gate for a Python Application',
    tagline: 'Engineer an automated quality gate with unit tests, mocking, database rollbacks, and static analysis.',
    difficulty: 'expert',
    estimated_hours: 6,
    xp_reward: 240,
    is_published: true,
    description: {
      en: 'Build an automated quality pipeline that executes unit tests, isolates database integration tests with transactional rollbacks, verifies mock boundaries, and enforces branch coverage thresholds.',
      'hi-Latn': 'Ek automated quality gate pipeline banayein jo unit tests, DB rollbacks, mocks aur coverage thresholds verify kare.',
      hi: 'एक स्वचालित गुणवत्ता गेट पाइपलाइन बनाएं जो यूनिट परीक्षण, डेटाबेस रोलबैक, मॉक और कवरेज थ्रेसहोल्ड को सत्यापित करे।'
    },
    learning_objectives: [
      'Structure unit and integration tests with clear boundary isolation',
      'Implement transactional rollback fixtures for zero-leak database testing',
      'Validate external service mock contracts using autospecs',
      'Calculate branch coverage and enforce CI quality thresholds'
    ],
    milestones: [
      {
        id: 'm1-test-suite-runner',
        title: 'Milestone 1: Automated Test Suite Runner',
        instructions: {
          en: 'Implement `run_test_suite(tests: list[callable]) -> dict`. Execute each test callable. Capture successes and failures. Return `{"total": int, "passed": int, "failed": int, "failures": list[str]}`.',
          'hi-Latn': '`run_test_suite(tests)` banayein jo saare test functions execute kare aur passed/failed counts return kare.',
          hi: '`run_test_suite(tests)` लागू करें जो सभी परीक्षण कार्यों को निष्पादित करे और उत्तीर्ण/अनुत्तीर्ण परिणामों को लौटाए।'
        },
        starter_code: `def run_test_suite(tests: list) -> dict:
    passed = 0
    failures = []
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            failures.append(f"{test.__name__}: {str(e)}")
    return {
        "total": len(tests),
        "passed": passed,
        "failed": len(failures),
        "failures": failures
    }`,
        test_harness: `
def t1(): assert 1 + 1 == 2
def t2(): assert 2 * 2 == 4
def t3(): assert 1 == 0, "Intentional fail"

res = run_test_suite([t1, t2, t3])
assert res["total"] == 3
assert res["passed"] == 2
assert res["failed"] == 1
assert len(res["failures"]) == 1
print("MILESTONE 1 VERIFIED: Test suite runner passed!")`
      },
      {
        id: 'm2-transactional-test-fixture',
        title: 'Milestone 2: Transactional Test Rollback Fixture',
        instructions: {
          en: 'Implement `TransactionalTestDB` with methods `begin()`, `execute_insert(row: str)`, and `rollback()`. In `rollback()`, all rows inserted during the transaction must be cleared, leaving the committed state untouched.',
          'hi-Latn': '`TransactionalTestDB` banayein jisme `rollback()` call karne par transaction me insert kiye gaye rows revert ho jayein.',
          hi: '`TransactionalTestDB` लागू करें जिसमें `rollback()` कॉल करने पर ट्रांजेक्शन के दौरान डाले गए रिकॉर्ड्स वापस हो जाएं।'
        },
        starter_code: `class TransactionalTestDB:
    def __init__(self):
        self.committed = ["initial_seed"]
        self.uncommitted = []
        self.in_transaction = False
        
    def begin(self):
        self.in_transaction = True
        self.uncommitted = []
        
    def execute_insert(self, row: str):
        if not self.in_transaction:
            raise RuntimeError("No active transaction")
        self.uncommitted.append(row)
        
    def rollback(self):
        self.uncommitted.clear()
        self.in_transaction = False
        
    def get_all_rows(self) -> list:
        return self.committed + self.uncommitted`,
        test_harness: `
db = TransactionalTestDB()
db.begin()
db.execute_insert("temp_row_1")
assert len(db.get_all_rows()) == 2
db.rollback()
assert db.get_all_rows() == ["initial_seed"]
print("MILESTONE 2 VERIFIED: Transactional test fixture passed!")`
      },
      {
        id: 'm3-service-mock-validator',
        title: 'Milestone 3: Mock Boundary Spec Validator',
        instructions: {
          en: 'Implement `validate_mock_spec(target_cls: type, method_name: str, args: tuple) -> bool`. Verify that `method_name` exists on `target_cls` and that the number of parameters matches `args` (excluding `self`). If invalid method or wrong argument count, return `False`.',
          'hi-Latn': '`validate_mock_spec(target_cls, method_name, args)` banayein jo check kare ki mocked method target class me exist karta hai aur argument count match hota hai.',
          hi: '`validate_mock_spec(target_cls, method_name, args)` लागू करें जो सत्यापित करे कि मॉक किया गया मेथड मौजूद है और तर्क गणना सही है।'
        },
        starter_code: `import inspect

def validate_mock_spec(target_cls: type, method_name: str, args: tuple) -> bool:
    if not hasattr(target_cls, method_name):
        return False
    func = getattr(target_cls, method_name)
    sig = inspect.signature(func)
    params = [p for p in sig.parameters.values() if p.name != "self"]
    return len(params) == len(args)`,
        test_harness: `
class PaymentGateway:
    def charge(self, amount: int, token: str): pass

assert validate_mock_spec(PaymentGateway, "charge", (100, "tok_1")) is True
assert validate_mock_spec(PaymentGateway, "charge", (100,)) is False # Wrong arg count
assert validate_mock_spec(PaymentGateway, "refund", (100,)) is False # Method missing
print("MILESTONE 3 VERIFIED: Mock boundary spec validator passed!")`
      },
      {
        id: 'm4-quality-pipeline-evaluator',
        title: 'Milestone 4: Quality Gate Threshold Evaluator',
        instructions: {
          en: 'Implement `evaluate_quality_gate(lint_errors: int, type_errors: int, test_failures: int, branch_cov_pct: float) -> dict`. Gate passes only if lint_errors == 0, type_errors == 0, test_failures == 0, and branch_cov_pct >= 85.0.',
          'hi-Latn': '`evaluate_quality_gate` banayein jo verify kare ki zero errors hain aur coverage kam se kam 85% hai.',
          hi: '`evaluate_quality_gate` लागू करें जो सत्यापित करे कि शून्य त्रुटियां हैं और कवरेज कम से कम 85% है।'
        },
        starter_code: `def evaluate_quality_gate(lint_errors: int, type_errors: int, test_failures: int, branch_cov_pct: float) -> dict:
    blockers = []
    if lint_errors > 0: blockers.append(f"{lint_errors} lint errors")
    if type_errors > 0: blockers.append(f"{type_errors} type errors")
    if test_failures > 0: blockers.append(f"{test_failures} test failures")
    if branch_cov_pct < 85.0: blockers.append(f"Branch coverage {branch_cov_pct:.1f}% below 85.0% threshold")
    
    passed = len(blockers) == 0
    return {"passed": passed, "blockers": blockers}`,
        test_harness: `
res_ok = evaluate_quality_gate(0, 0, 0, 89.5)
assert res_ok["passed"] is True
assert res_ok["blockers"] == []

res_bad = evaluate_quality_gate(1, 0, 0, 80.0)
assert res_bad["passed"] is False
assert len(res_bad["blockers"]) == 2
print("MILESTONE 4 VERIFIED: Quality gate evaluator passed!")`
      }
    ]
  },

  // ─── Module 5 Project: Reliable Python Service ───────────────────────────────
  {
    id: 'proj-05-reliable-python-service',
    slug: 'reliable-python-service',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Reliable Python Service',
    tagline: 'Engineer a fault-tolerant service with idempotency, backoff retries, and circuit breakers.',
    difficulty: 'expert',
    estimated_hours: 7,
    xp_reward: 260,
    is_published: true,
    description: {
      en: 'Construct a resilient service architecture with strict request validation contracts, idempotent deduplication, full jitter exponential backoff, and a three-state circuit breaker.',
      'hi-Latn': 'Ek resilient Python service banayein jisme idempotency keys, exponential backoff retries, aur circuit breaker pattern implemented ho.',
      hi: 'एक लचीली पायथन सेवा बनाएं जिसमें आइडमपोटेंसी कुंजियां, घातीय बैकऑफ़ पुनः प्रयास, और सर्किट ब्रेकर पैटर्न लागू हों।'
    },
    learning_objectives: [
      'Design strict request and response schema validation boundaries',
      'Implement idempotent request deduplication to prevent double processing',
      'Apply bounded exponential retries with randomized full jitter',
      'Build a three-state circuit breaker (CLOSED, OPEN, HALF_OPEN) to prevent cascading failures'
    ],
    milestones: [
      {
        id: 'm1-request-contract-validator',
        title: 'Milestone 1: Request Contract Validator',
        instructions: {
          en: 'Implement `validate_order_request(payload: dict) -> dict`. Must contain `"customer_id"` (int > 0), `"amount"` (float > 0.0), and `"items"` (non-empty list). Raise `ValueError` on validation failure.',
          'hi-Latn': '`validate_order_request(payload)` banayein jo customer_id > 0, amount > 0, aur non-empty items list validate kare.',
          hi: '`validate_order_request(payload)` लागू करें जो customer_id > 0, amount > 0, और गैर-रिक्त आइटम सूची को मान्य करे।'
        },
        starter_code: `def validate_order_request(payload: dict) -> dict:
    cid = payload.get("customer_id")
    amt = payload.get("amount")
    items = payload.get("items")
    
    if not isinstance(cid, int) or cid <= 0:
        raise ValueError("Invalid customer_id: must be positive integer")
    if not isinstance(amt, (int, float)) or amt <= 0.0:
        raise ValueError("Invalid amount: must be positive number")
    if not isinstance(items, list) or len(items) == 0:
        raise ValueError("Invalid items: must be non-empty list")
        
    return {"customer_id": cid, "amount": float(amt), "items": items}`,
        test_harness: `
valid_order = {"customer_id": 101, "amount": 49.99, "items": ["sku_1"]}
res = validate_order_request(valid_order)
assert res["amount"] == 49.99

try:
    validate_order_request({"customer_id": 101, "amount": -1.0, "items": []})
    assert False, "Should have raised ValueError"
except ValueError:
    pass
print("MILESTONE 1 VERIFIED: Request contract validator passed!")`
      },
      {
        id: 'm2-idempotency-deduplicator',
        title: 'Milestone 2: Idempotent Request Deduplicator',
        instructions: {
          en: 'Implement `IdempotencyStore`. Methods: `process_request(key: str, action: callable) -> dict`. If `key` was already seen, return `{"cached": True, "result": <stored_result>}` without re-executing `action`. Otherwise execute `action`, store result, and return `{"cached": False, "result": <result>}`.',
          'hi-Latn': '`IdempotencyStore` banayein jo duplicate keys par cached result return kare aur action ko dubara run na kare.',
          hi: '`IdempotencyStore` लागू करें जो डुप्लिकेट कुंजियों पर कैश परिणाम लौटाए और क्रिया को दोबारा न चलाए।'
        },
        starter_code: `class IdempotencyStore:
    def __init__(self):
        self._cache = {}
        
    def process_request(self, key: str, action) -> dict:
        if key in self._cache:
            return {"cached": True, "result": self._cache[key]}
        res = action()
        self._cache[key] = res
        return {"cached": False, "result": res}`,
        test_harness: `
store = IdempotencyStore()
calls = 0
def pay():
    nonlocal calls
    calls += 1
    return "tx_900"

res1 = store.process_request("req_abc", pay)
assert res1["cached"] is False
assert calls == 1

res2 = store.process_request("req_abc", pay)
assert res2["cached"] is True
assert res2["result"] == "tx_900"
assert calls == 1  # Never re-executed!
print("MILESTONE 2 VERIFIED: Idempotency deduplicator passed!")`
      },
      {
        id: 'm3-exponential-retry-client',
        title: 'Milestone 3: Bounded Exponential Retry Client',
        instructions: {
          en: 'Implement `retry_with_backoff(func: callable, max_retries: int = 3) -> dict`. Call `func()`. If it raises an exception, retry up to `max_retries` times. Return `{"success": bool, "attempts": int, "result": any}`.',
          'hi-Latn': '`retry_with_backoff(func, max_retries)` banayein jo transient exceptions par retries kare.',
          hi: '`retry_with_backoff(func, max_retries)` लागू करें जो क्षणिक विफलताओं पर पुनः प्रयास करे।'
        },
        starter_code: `def retry_with_backoff(func, max_retries: int = 3) -> dict:
    attempts = 0
    last_err = None
    for attempt in range(1, max_retries + 1):
        attempts = attempt
        try:
            res = func()
            return {"success": True, "attempts": attempts, "result": res}
        except Exception as e:
            last_err = e
    return {"success": False, "attempts": attempts, "error": str(last_err)}`,
        test_harness: `
fail_count = 2
def flaky():
    nonlocal fail_count
    if fail_count > 0:
        fail_count -= 1
        raise ConnectionError("Timeout")
    return "ok"

res = retry_with_backoff(flaky, max_retries=3)
assert res["success"] is True
assert res["attempts"] == 3
assert res["result"] == "ok"
print("MILESTONE 3 VERIFIED: Exponential retry client passed!")`
      },
      {
        id: 'm4-circuit-breaker-engine',
        title: 'Milestone 4: Three-State Circuit Breaker Engine',
        instructions: {
          en: 'Implement `CircuitBreaker`. States: `"CLOSED"`, `"OPEN"`, `"HALF_OPEN"`. After `failure_threshold` consecutive failures, transition to `"OPEN"`. In `"OPEN"`, calls must immediately fail without executing the protected action.',
          'hi-Latn': '`CircuitBreaker` banayein jo failure threshold exceed hone par `"OPEN"` state me chala jaye aur downstream traffic block kare.',
          hi: '`CircuitBreaker` लागू करें जो विफलता सीमा पार होने पर `"OPEN"` स्थिति में चला जाए और ट्रैफ़िक को ब्लॉक करे।'
        },
        starter_code: `class CircuitBreaker:
    def __init__(self, failure_threshold: int = 2):
        self.threshold = failure_threshold
        self.state = "CLOSED"
        self.consecutive_failures = 0
        
    def call(self, action):
        if self.state == "OPEN":
            raise RuntimeError("CircuitBreaker is OPEN. Call rejected.")
        try:
            res = action()
            self.consecutive_failures = 0
            return res
        except Exception as e:
            self.consecutive_failures += 1
            if self.consecutive_failures >= self.threshold:
                self.state = "OPEN"
            raise e`,
        test_harness: `
cb = CircuitBreaker(failure_threshold=2)
def fail(): raise ConnectionError("Down")

try: cb.call(fail)
except ConnectionError: pass
assert cb.state == "CLOSED"

try: cb.call(fail)
except ConnectionError: pass
assert cb.state == "OPEN"

try:
    cb.call(lambda: "never called")
    assert False, "Should have been rejected"
except RuntimeError as e:
    assert "CircuitBreaker is OPEN" in str(e)
print("MILESTONE 4 VERIFIED: Circuit breaker engine passed!")`
      }
    ]
  },

  // ─── Module 6 Project: Containerize a Python Application ─────────────────────
  {
    id: 'proj-05-containerize-application',
    slug: 'containerize-python-application',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Containerize a Python Application',
    tagline: 'Write hardened Dockerfiles, handle PID 1 signals, and triage container crashes.',
    difficulty: 'expert',
    estimated_hours: 7,
    xp_reward: 260,
    is_published: true,
    description: {
      en: 'Construct a hardened production container configuration: validate Dockerfile directives, handle UNIX signals for zero-downtime graceful shutdown, and diagnose standard exit codes.',
      'hi-Latn': 'Ek production container configuration banayein: Dockerfile validation, SIGTERM signal handling aur exit code triage.',
      hi: 'एक प्रोडक्शन कंटेनर कॉन्फ़िगरेशन बनाएं: डॉकरफ़ाइल सत्यापन, SIGTERM सिग्नल हैंडलिंग और एक्जिट कोड ट्राइएज।'
    },
    learning_objectives: [
      'Audit Dockerfiles for slim base images, non-root users, and exec CMD forms',
      'Implement SIGTERM graceful shutdown handlers in Python processes',
      'Distinguish ephemeral container storage from durable object storage',
      'Triage container crashes using Linux exit codes (137 OOMKilled, 143 SIGTERM)'
    ],
    milestones: [
      {
        id: 'm1-dockerfile-security-linter',
        title: 'Milestone 1: Production Dockerfile Security Linter',
        instructions: {
          en: 'Implement `lint_dockerfile(content: str) -> dict`. Return `{"valid": bool, "findings": list[str]}`. Flag as invalid if running as root (no `USER` instruction), if `PYTHONUNBUFFERED` is missing, or if `CMD` uses shell form instead of JSON array.',
          'hi-Latn': '`lint_dockerfile(content)` banayein jo check kare ki non-root user, PYTHONUNBUFFERED aur JSON CMD array maujood hain.',
          hi: '`lint_dockerfile(content)` लागू करें जो गैर-रूट उपयोगकर्ता, PYTHONUNBUFFERED और JSON CMD की उपस्थिति की पुष्टि करे।'
        },
        starter_code: `def lint_dockerfile(content: str) -> dict:
    findings = []
    lines = [l.strip() for l in content.splitlines() if l.strip()]
    
    has_user = any(l.startswith("USER ") and "root" not in l for l in lines)
    if not has_user:
        findings.append("Missing non-root USER instruction")
        
    has_unbuf = any("PYTHONUNBUFFERED" in l for l in lines)
    if not has_unbuf:
        findings.append("Missing PYTHONUNBUFFERED=1")
        
    cmd_lines = [l for l in lines if l.startswith("CMD ")]
    if cmd_lines and not cmd_lines[-1].startswith('CMD ["'):
        findings.append("CMD must use exec form JSON array")
        
    return {"valid": len(findings) == 0, "findings": findings}`,
        test_harness: `
good_df = """
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
USER appuser
CMD ["python", "main.py"]
"""
assert lint_dockerfile(good_df)["valid"] is True

bad_df = """
FROM python:3.12
CMD python main.py
"""
bad_res = lint_dockerfile(bad_df)
assert bad_res["valid"] is False
assert len(bad_res["findings"]) == 3
print("MILESTONE 1 VERIFIED: Dockerfile security linter passed!")`
      },
      {
        id: 'm2-sigterm-shutdown-handler',
        title: 'Milestone 2: SIGTERM Graceful Shutdown Handler',
        instructions: {
          en: 'Implement `ContainerProcess`. Method `receive_signal(signum: int)`. When `signum == 15` (SIGTERM), set `is_shutting_down = True`, finish processing any `active_requests`, and return `"DRAINED_CLEANLY"`. If `signum == 9` (SIGKILL), immediately abort with `"KILLED"`.',
          'hi-Latn': '`ContainerProcess` banayein jo Signal 15 par active requests drain kare aur Signal 9 par immediately kill ho jaye.',
          hi: '`ContainerProcess` लागू करें जो सिग्नल 15 पर अनुरोधों को निष्पादित करे और सिग्नल 9 पर तुरंत बंद हो जाए।'
        },
        starter_code: `class ContainerProcess:
    def __init__(self):
        self.is_shutting_down = False
        self.active_requests = 2
        
    def receive_signal(self, signum: int) -> str:
        if signum == 9:
            return "KILLED"
        elif signum == 15:
            self.is_shutting_down = True
            self.active_requests = 0 # Drained
            return "DRAINED_CLEANLY"
        return "IGNORED"`,
        test_harness: `
proc = ContainerProcess()
assert proc.receive_signal(15) == "DRAINED_CLEANLY"
assert proc.is_shutting_down is True
assert proc.active_requests == 0
assert proc.receive_signal(9) == "KILLED"
print("MILESTONE 2 VERIFIED: SIGTERM shutdown handler passed!")`
      },
      {
        id: 'm3-storage-persistence-classifier',
        title: 'Milestone 3: Container Storage Lifecycle Classifier',
        instructions: {
          en: 'Implement `classify_storage(target_path: str) -> dict`. If path starts with `s3://` or `gcs://`, classify as `"DURABLE_OBJECT_STORE"`. If starts with `/tmp/`, classify as `"SAFE_SCRATCH_SPACE"`. If writes to local `/app/`, classify as `"DANGEROUS_EPHEMERAL_LOSS"`.',
          'hi-Latn': '`classify_storage(target_path)` banayein jo evaluate kare ki path durable hai, temporary scratch hai, ya dangerous ephemeral storage.',
          hi: '`classify_storage(target_path)` लागू करें जो मूल्यांकन करे कि पथ टिकाऊ है, अस्थायी है, या असुरक्षित अल्पकालिक भंडारण।'
        },
        starter_code: `def classify_storage(target_path: str) -> dict:
    if target_path.startswith("s3://") or target_path.startswith("gcs://"):
        return {"category": "DURABLE_OBJECT_STORE", "safe": True}
    elif target_path.startswith("/tmp/"):
        return {"category": "SAFE_SCRATCH_SPACE", "safe": True}
    elif target_path.startswith("/app/"):
        return {"category": "DANGEROUS_EPHEMERAL_LOSS", "safe": False}
    return {"category": "UNKNOWN", "safe": False}`,
        test_harness: `
assert classify_storage("s3://bucket/photo.jpg")["category"] == "DURABLE_OBJECT_STORE"
assert classify_storage("/tmp/calc.tmp")["category"] == "SAFE_SCRATCH_SPACE"
assert classify_storage("/app/data/users.db")["safe"] is False
print("MILESTONE 3 VERIFIED: Storage persistence classifier passed!")`
      },
      {
        id: 'm4-exit-code-diagnostics',
        title: 'Milestone 4: Container Exit Code Diagnostics Engine',
        instructions: {
          en: 'Implement `diagnose_exit_code(code: int) -> str`. Code 0 -> `"SUCCESS"`, Code 1 -> `"APP_EXCEPTION"`, Code 137 -> `"OOM_KILLED"`, Code 143 -> `"SIGTERM_STOPPED"`. Any other code -> `"UNKNOWN_FAILURE"`.',
          'hi-Latn': '`diagnose_exit_code(code)` banayein jo exit codes (0, 1, 137, 143) ko correct diagnostic label me map kare.',
          hi: '`diagnose_exit_code(code)` लागू करें जो एक्जिट कोड (0, 1, 137, 143) को सही डायग्नोस्टिक लेबल में मैप करे।'
        },
        starter_code: `def diagnose_exit_code(code: int) -> str:
    mapping = {
        0: "SUCCESS",
        1: "APP_EXCEPTION",
        137: "OOM_KILLED",
        143: "SIGTERM_STOPPED"
    }
    return mapping.get(code, "UNKNOWN_FAILURE")`,
        test_harness: `
assert diagnose_exit_code(0) == "SUCCESS"
assert diagnose_exit_code(1) == "APP_EXCEPTION"
assert diagnose_exit_code(137) == "OOM_KILLED"
assert diagnose_exit_code(143) == "SIGTERM_STOPPED"
print("MILESTONE 4 VERIFIED: Exit code diagnostics engine passed!")`
      }
    ]
  },

  // ─── Module 7 Project: Python CI Pipeline ────────────────────────────────────
  {
    id: 'proj-05-python-ci-pipeline',
    slug: 'python-ci-pipeline',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Python CI Pipeline',
    tagline: 'Construct a continuous integration workflow with matrix testing, structured logs, and Prometheus metrics.',
    difficulty: 'expert',
    estimated_hours: 7,
    xp_reward: 260,
    is_published: true,
    description: {
      en: 'Engineer an end-to-end CI pipeline: matrix test configuration, structured JSON logging with correlation IDs, Prometheus RED metrics, and decoupled liveness/readiness health probes.',
      'hi-Latn': 'Ek CI pipeline banayein jisme matrix testing, structured JSON logging, Prometheus metrics aur separate healthz/readyz probes ho.',
      hi: 'एक सीआई पाइपलाइन बनाएं जिसमें मैट्रिक्स परीक्षण, संरचित JSON लॉगिंग, प्रोमेथियस मेट्रिक्स और अलग-अलग healthz/readyz जांच शामिल हों।'
    },
    learning_objectives: [
      'Validate GitHub Actions workflow matrix configurations across Python versions',
      'Format operational events as structured JSON enriched with correlation IDs',
      'Implement Prometheus RED metrics (Rate, Errors, Duration percentiles)',
      'Decouple Liveness (/healthz) from Readiness (/readyz) probes'
    ],
    milestones: [
      {
        id: 'm1-ci-matrix-validator',
        title: 'Milestone 1: CI Matrix Configuration Validator',
        instructions: {
          en: 'Implement `validate_ci_workflow(workflow: dict) -> dict`. Verify that the matrix tests at least 2 Python versions (e.g. "3.11", "3.12") and that `fail-fast` is set to `False`. Return `{"valid": bool, "reasons": list[str]}`.',
          'hi-Latn': '`validate_ci_workflow(workflow)` banayein jo check kare ki multiple Python versions matrix me hain aur `fail-fast: false` hai.',
          hi: '`validate_ci_workflow(workflow)` लागू करें जो सत्यापित करे कि मैट्रिक्स में कई पायथन संस्करण हैं और `fail-fast: false` है।'
        },
        starter_code: `def validate_ci_workflow(workflow: dict) -> dict:
    reasons = []
    matrix = workflow.get("jobs", {}).get("test", {}).get("strategy", {}).get("matrix", {})
    py_versions = matrix.get("python-version", [])
    
    if len(py_versions) < 2:
        reasons.append("CI matrix must test at least 2 Python versions")
        
    fail_fast = workflow.get("jobs", {}).get("test", {}).get("strategy", {}).get("fail-fast")
    if fail_fast is not False:
        reasons.append("Must set fail-fast: false to ensure all version runs complete")
        
    return {"valid": len(reasons) == 0, "reasons": reasons}`,
        test_harness: `
wf = {
    "jobs": {
        "test": {
            "strategy": {
                "fail-fast": False,
                "matrix": {"python-version": ["3.11", "3.12"]}
            }
        }
    }
}
assert validate_ci_workflow(wf)["valid"] is True

bad_wf = {"jobs": {"test": {"strategy": {"matrix": {"python-version": ["3.12"]}}}}}
bad_res = validate_ci_workflow(bad_wf)
assert bad_res["valid"] is False
assert len(bad_res["reasons"]) == 2
print("MILESTONE 1 VERIFIED: CI matrix validator passed!")`
      },
      {
        id: 'm2-structured-json-logger',
        title: 'Milestone 2: Structured JSON Logger with Correlation IDs',
        instructions: {
          en: 'Implement `format_json_log(level: str, msg: str, req_id: str, extra: dict = None) -> dict`. Must include `"level"`, `"message"`, `"correlation_id"`, and any fields from `extra`.',
          'hi-Latn': '`format_json_log(level, msg, req_id, extra)` banayein jo machine-readable dictionary return kare.',
          hi: '`format_json_log(level, msg, req_id, extra)` लागू करें जो मशीन-पठनीय शब्दकोश लौटाए।'
        },
        starter_code: `def format_json_log(level: str, msg: str, req_id: str, extra: dict = None) -> dict:
    log_rec = {
        "level": level.upper(),
        "message": msg,
        "correlation_id": req_id
    }
    if extra:
        log_rec.update(extra)
    return log_rec`,
        test_harness: `
rec = format_json_log("info", "Payment processed", "req_789", {"amount": 25.50})
assert rec["level"] == "INFO"
assert rec["correlation_id"] == "req_789"
assert rec["amount"] == 25.50
print("MILESTONE 2 VERIFIED: Structured JSON logger passed!")`
      },
      {
        id: 'm3-prometheus-red-metrics',
        title: 'Milestone 3: Prometheus RED Metrics Collector',
        instructions: {
          en: 'Implement `REDMetrics`. Track `record(latency_ms: float, is_error: bool)`. Method `get_metrics() -> dict` must return `"total_requests"`, `"error_count"`, `"error_rate_pct"`, and `"p95_latency_ms"`.',
          'hi-Latn': '`REDMetrics` class banayein jo Rate, Errors aur Duration (p95) track kare.',
          hi: '`REDMetrics` वर्ग लागू करें जो दर, त्रुटियां और अवधि (p95) को ट्रैक करे।'
        },
        starter_code: `class REDMetrics:
    def __init__(self):
        self.latencies = []
        self.errors = 0
        
    def record(self, latency_ms: float, is_error: bool = False):
        self.latencies.append(latency_ms)
        if is_error:
            self.errors += 1
            
    def get_metrics(self) -> dict:
        total = len(self.latencies)
        if total == 0:
            return {"total_requests": 0, "error_count": 0, "error_rate_pct": 0.0, "p95_latency_ms": 0.0}
            
        sorted_l = sorted(self.latencies)
        p95_idx = int(0.95 * total)
        p95 = sorted_l[p95_idx]
        
        return {
            "total_requests": total,
            "error_count": self.errors,
            "error_rate_pct": (self.errors / total) * 100,
            "p95_latency_ms": p95
        }`,
        test_harness: `
red = REDMetrics()
for i in range(100):
    red.record(latency_ms=10.0 + i, is_error=(i >= 95))
m = red.get_metrics()
assert m["total_requests"] == 100
assert m["error_count"] == 5
assert m["error_rate_pct"] == 5.0
assert m["p95_latency_ms"] >= 100.0
print("MILESTONE 3 VERIFIED: Prometheus RED metrics passed!")`
      },
      {
        id: 'm4-decoupled-health-probes',
        title: 'Milestone 4: Decoupled Liveness and Readiness Probes',
        instructions: {
          en: 'Implement `evaluate_probes(process_alive: bool, db_connected: bool) -> dict`. Return `{"liveness_code": int, "readiness_code": int, "action": str}`. If process is alive, liveness is 200 (even if DB is down). If DB is down, readiness is 503 and action is `"REMOVE_FROM_TRAFFIC"`.',
          'hi-Latn': '`evaluate_probes` banayein jo DB down hone par bhi liveness ko 200 rakhe aur readiness ko 503 kare.',
          hi: '`evaluate_probes` लागू करें जो डीबी डाउन होने पर भी लाइवनेस को 200 रखे और रेडीनेस को 503 करे।'
        },
        starter_code: `def evaluate_probes(process_alive: bool, db_connected: bool) -> dict:
    live_code = 200 if process_alive else 500
    ready_code = 200 if (process_alive and db_connected) else 503
    
    if not process_alive:
        action = "RESTART_CONTAINER"
    elif not db_connected:
        action = "REMOVE_FROM_TRAFFIC"
    else:
        action = "SERVE_TRAFFIC"
        
    return {
        "liveness_code": live_code,
        "readiness_code": ready_code,
        "action": action
    }`,
        test_harness: `
res = evaluate_probes(process_alive=True, db_connected=False)
assert res["liveness_code"] == 200   # Container NOT killed!
assert res["readiness_code"] == 503  # Pulled from traffic
assert res["action"] == "REMOVE_FROM_TRAFFIC"

res_dead = evaluate_probes(process_alive=False, db_connected=False)
assert res_dead["liveness_code"] == 500
assert res_dead["action"] == "RESTART_CONTAINER"
print("MILESTONE 4 VERIFIED: Decoupled health probes passed!")`
      }
    ]
  },

  // ─── Module 8 Project: Production Readiness Audit ────────────────────────────
  {
    id: 'proj-05-production-readiness-audit',
    slug: 'production-readiness-audit',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Production Readiness Audit',
    tagline: 'Audit a Python service against enterprise criteria: architecture, security, smoke tests, and PRR gates.',
    difficulty: 'expert',
    estimated_hours: 8,
    xp_reward: 280,
    is_published: true,
    description: {
      en: 'Conduct a comprehensive Production Readiness Review (PRR) audit: evaluate domain layer decoupling, audit STRIDE threats, execute automated smoke tests, and enforce a go/no-go operational scorecard.',
      'hi-Latn': 'Ek complete Production Readiness Review audit karein: domain layer separation, STRIDE threat check, smoke testing aur PRR go/no-go gate.',
      hi: 'एक पूर्ण प्रोडक्शन तत्परता समीक्षा ऑडिट करें: डोमेन लेयर पृथक्करण, स्ट्राइड खतरा जांच, स्मोक टेस्टिंग और पीआरआर गेट।'
    },
    learning_objectives: [
      'Audit clean domain boundaries to prevent infrastructure leakage',
      'Evaluate services against STRIDE security threat baselines',
      'Construct post-deployment smoke test harnesses',
      'Execute the multi-pillar Production Readiness Review (PRR) scorecard'
    ],
    milestones: [
      {
        id: 'm1-domain-layer-auditor',
        title: 'Milestone 1: Domain Boundary Architecture Auditor',
        instructions: {
          en: 'Implement `audit_domain_imports(domain_file_content: str) -> dict`. Domain files must NOT import database or web frameworks (`sqlalchemy`, `fastapi`, `flask`, `django`). Return `{"clean": bool, "forbidden_imports": list[str]}`.',
          'hi-Latn': '`audit_domain_imports(domain_file_content)` banayein jo verify kare ki domain models me database ya web frameworks import nahi hain.',
          hi: '`audit_domain_imports(domain_file_content)` लागू करें जो सत्यापित करे कि डोमेन मॉडल में बाहरी फ्रेमवर्क आयात नहीं हैं।'
        },
        starter_code: `def audit_domain_imports(domain_file_content: str) -> dict:
    forbidden = ["sqlalchemy", "fastapi", "flask", "django", "psycopg2"]
    found = []
    for line in domain_file_content.splitlines():
        line = line.strip()
        if line.startswith("import ") or line.startswith("from "):
            for f in forbidden:
                if f in line:
                    found.append(f)
    return {"clean": len(found) == 0, "forbidden_imports": found}`,
        test_harness: `
clean_code = "from dataclasses import dataclass\\n@dataclass\\nclass Order: id: int"
assert audit_domain_imports(clean_code)["clean"] is True

bad_code = "from sqlalchemy import Column\\nclass Order: pass"
bad_res = audit_domain_imports(bad_code)
assert bad_res["clean"] is False
assert "sqlalchemy" in bad_res["forbidden_imports"]
print("MILESTONE 1 VERIFIED: Domain boundary auditor passed!")`
      },
      {
        id: 'm2-stride-threat-scanner',
        title: 'Milestone 2: STRIDE Security Threat Scanner',
        instructions: {
          en: 'Implement `audit_stride_compliance(endpoint_meta: dict) -> list[str]`. Flags: `requires_auth`, `has_rate_limit`, `masks_response_pii`. Return list of unmet STRIDE threat warnings.',
          'hi-Latn': '`audit_stride_compliance(endpoint_meta)` banayein jo unmet threats (Spoofing, DoS, Disclosure) ko detect kare.',
          hi: '`audit_stride_compliance(endpoint_meta)` लागू करें जो सुरक्षा उल्लंघनों का पता लगाए।'
        },
        starter_code: `def audit_stride_compliance(endpoint_meta: dict) -> list[str]:
    warnings = []
    if not endpoint_meta.get("requires_auth"):
        warnings.append("SPOOFING_RISK: Endpoint lacks authentication token requirement")
    if not endpoint_meta.get("has_rate_limit"):
        warnings.append("DOS_RISK: Endpoint lacks rate limiting")
    if not endpoint_meta.get("masks_response_pii"):
        warnings.append("DISCLOSURE_RISK: Response lacks PII filtering")
    return warnings`,
        test_harness: `
ep = {"requires_auth": True, "has_rate_limit": False, "masks_response_pii": True}
warns = audit_stride_compliance(ep)
assert len(warns) == 1
assert "DOS_RISK" in warns[0]
print("MILESTONE 2 VERIFIED: STRIDE threat scanner passed!")`
      },
      {
        id: 'm3-post-deploy-smoke-test',
        title: 'Milestone 3: Post-Deployment Smoke Test Runner',
        instructions: {
          en: 'Implement `run_smoke_tests(endpoints: dict) -> dict`. `endpoints` maps URL to status code. If `/healthz` is not 200, or `/api/v1/ping` is not 200, return `{"verified": False, "action": "ROLLBACK"}`. Otherwise return `{"verified": True, "action": "PROMOTE"}`.',
          'hi-Latn': '`run_smoke_tests(endpoints)` banayein jo smoke tests fail hone par `"ROLLBACK"` return kare.',
          hi: '`run_smoke_tests(endpoints)` लागू करें जो स्मोक टेस्ट विफल होने पर रोलबैक की सिफारिश करे।'
        },
        starter_code: `def run_smoke_tests(endpoints: dict) -> dict:
    if endpoints.get("/healthz") != 200 or endpoints.get("/api/v1/ping") != 200:
        return {"verified": False, "action": "ROLLBACK"}
    return {"verified": True, "action": "PROMOTE"}`,
        test_harness: `
assert run_smoke_tests({"/healthz": 200, "/api/v1/ping": 200})["verified"] is True
assert run_smoke_tests({"/healthz": 200, "/api/v1/ping": 500})["action"] == "ROLLBACK"
print("MILESTONE 3 VERIFIED: Post-deployment smoke test runner passed!")`
      },
      {
        id: 'm4-prr-go-nogo-scorecard',
        title: 'Milestone 4: Production Readiness Review Scorecard',
        instructions: {
          en: 'Implement `evaluate_prr_scorecard(checklist: dict) -> dict`. Required keys: `"non_root_user"`, `"startup_config_valid"`, `"separate_health_probes"`, `"runbook_published"`. Return `{"status": "GO" | "NO-GO", "score_pct": float}`.',
          'hi-Latn': '`evaluate_prr_scorecard(checklist)` banayein jo required operational items verify karke "GO" ya "NO-GO" declare kare.',
          hi: '`evaluate_prr_scorecard(checklist)` लागू करें जो परिचालन आवश्यकताओं को सत्यापित करके "GO" या "NO-GO" घोषित करे।'
        },
        starter_code: `def evaluate_prr_scorecard(checklist: dict) -> dict:
    required = ["non_root_user", "startup_config_valid", "separate_health_probes", "runbook_published"]
    passed = sum(1 for k in required if checklist.get(k) is True)
    score_pct = (passed / len(required)) * 100
    
    return {
        "status": "GO" if passed == len(required) else "NO-GO",
        "score_pct": score_pct
    }`,
        test_harness: `
full_pass = {
    "non_root_user": True,
    "startup_config_valid": True,
    "separate_health_probes": True,
    "runbook_published": True
}
assert evaluate_prr_scorecard(full_pass)["status"] == "GO"

partial = dict(full_pass)
partial["runbook_published"] = False
res_no = evaluate_prr_scorecard(partial)
assert res_no["status"] == "NO-GO"
assert res_no["score_pct"] == 75.0
print("MILESTONE 4 VERIFIED: PRR scorecard passed!")`
      }
    ]
  },

  // ─── Level 5 Capstone: Production Python Project Lab ────────────────────────
  {
    id: 'proj-05-production-project-lab-capstone',
    slug: 'production-python-project-lab',
    path_slug: 'python-development',
    level_number: 5,
    title: 'Production Python Project Lab',
    tagline: 'Architect, test, package, containerize, and audit a complete production Python microservice across 10 milestones.',
    difficulty: 'expert',
    estimated_hours: 15,
    xp_reward: 500,
    is_published: true,
    description: {
      en: 'Design, implement, test, containerize, and audit a production-grade Python service from scratch. Satisfy all 10 engineering milestones: problem scoping, domain decoupling, input validation, idempotent persistence, comprehensive test suites, secrets hygiene, pyproject.toml packaging, multi-stage Dockerfiles, RED observability, and the final PRR audit.',
      'hi-Latn': 'Ek complete production Python microservice banayein: domain decoupling, persistence, test suites, packaging, Docker container, observability, aur final PRR audit across 10 milestones.',
      hi: 'शुरुआत से एक पूर्ण प्रोडक्शन पायथन माइक्रोसर्विस का निर्माण करें: 10 मील के पत्थर के माध्यम से डोमेन डिकूपलिंग, दृढ़ता, परीक्षण सूट, पैकेजिंग, डॉकर कंटेनर, अवलोकनीयता और अंतिम पीआरआर ऑडिट।'
    },
    learning_objectives: [
      'Architect modular domain boundaries decoupled from external frameworks',
      'Implement fail-fast configuration and masked SecretString types',
      'Design transactional persistence with idempotent request deduplication',
      'Build comprehensive test suites with unit tests and external mock specs',
      'Package the service using PEP 517 build standards and Semantic Versioning',
      'Construct a hardened, multi-stage Dockerfile running as non-root with SIGTERM handling',
      'Instrument Prometheus RED metrics and decoupled health probes',
      'Deliver an executive Production Readiness Review (PRR) audit report'
    ],
    milestones: [
      {
        id: 'cap-m1-problem-scoping',
        title: 'Milestone 1: Service Specification and Requirements Boundary',
        instructions: {
          en: 'Implement `define_service_spec(service_name: str, port: int, supported_endpoints: list[str]) -> dict`. Return a standardized service manifest ensuring port > 1024 and non-empty endpoints.',
          'hi-Latn': '`define_service_spec` banayein jo unprivileged port (>1024) aur endpoints validate kare.',
          hi: '`define_service_spec` लागू करें जो पोर्ट (>1024) और एंडपॉइंट्स को मान्य करे।'
        },
        starter_code: `def define_service_spec(service_name: str, port: int, supported_endpoints: list[str]) -> dict:
    if port <= 1024:
        raise ValueError("Must use non-privileged port (>1024) for container execution")
    if not supported_endpoints:
        raise ValueError("Service must expose at least one endpoint")
    return {
        "service_name": service_name,
        "port": port,
        "endpoints": supported_endpoints,
        "status": "SPEC_VALIDATED"
    }`,
        test_harness: `
res = define_service_spec("order-service", 8080, ["/orders", "/healthz"])
assert res["status"] == "SPEC_VALIDATED"
assert res["port"] == 8080
print("CAPSTONE M1 VERIFIED: Service spec validated!")`
      },
      {
        id: 'cap-m2-domain-decoupling',
        title: 'Milestone 2: Domain Entity Model and Architecture Decoupling',
        instructions: {
          en: 'Implement `create_domain_order(order_id: str, amount: float) -> dict`. Enforce that domain objects are pure dictionaries or dataclasses with positive amount, independent of external ORMs.',
          'hi-Latn': '`create_domain_order` banayein jo pure Python domain structure banaye bina kisi ORM dependency ke.',
          hi: '`create_domain_order` लागू करें जो बाहरी ओआरएम से स्वतंत्र शुद्ध डोमेन संरचना बनाए।'
        },
        starter_code: `def create_domain_order(order_id: str, amount: float) -> dict:
    if amount <= 0:
        raise ValueError("Domain rule violation: Order amount must be positive")
    return {"order_id": order_id, "amount": float(amount), "state": "PENDING"}`,
        test_harness: `
order = create_domain_order("ord_1", 150.0)
assert order["state"] == "PENDING"
print("CAPSTONE M2 VERIFIED: Domain entity model decoupled!")`
      },
      {
        id: 'cap-m3-validation-layer',
        title: 'Milestone 3: Request Validation and Schema Sanitization',
        instructions: {
          en: 'Implement `sanitize_user_input(raw_str: str) -> str`. Strip surrounding whitespace and HTML/script tags (`<script>` or `</script>`). Raise `ValueError` if empty.',
          'hi-Latn': '`sanitize_user_input(raw_str)` banayein jo whitespace trim kare aur XSS script tags strip kare.',
          hi: '`sanitize_user_input(raw_str)` लागू करें जो इनपुट को साफ़ करे और अमान्य इनपुट पर त्रुटि उठाए।'
        },
        starter_code: `def sanitize_user_input(raw_str: str) -> str:
    cleaned = raw_str.strip().replace("<script>", "").replace("</script>", "")
    if not cleaned:
        raise ValueError("Input string cannot be empty")
    return cleaned`,
        test_harness: `
res = sanitize_user_input("  <script>alert(1)</script>hello world  ")
assert res == "hello world"
print("CAPSTONE M3 VERIFIED: Validation layer passed!")`
      },
      {
        id: 'cap-m4-idempotent-persistence',
        title: 'Milestone 4: Idempotent Persistence and Transaction Commit',
        instructions: {
          en: 'Implement `CapstoneOrderStore`. Methods `save_order(order_id: str, payload: dict) -> bool`. Duplicate `order_id` saves must return `False` without overwriting existing data.',
          'hi-Latn': '`CapstoneOrderStore` banayein jo duplicate `order_id` saves ko reject kare.',
          hi: '`CapstoneOrderStore` लागू करें जो डुप्लिकेट ऑर्डर आईडी को अस्वीकार करे।'
        },
        starter_code: `class CapstoneOrderStore:
    def __init__(self):
        self._orders = {}
        
    def save_order(self, order_id: str, payload: dict) -> bool:
        if order_id in self._orders:
            return False
        self._orders[order_id] = payload
        return True
        
    def get_order(self, order_id: str) -> dict:
        return self._orders.get(order_id)`,
        test_harness: `
store = CapstoneOrderStore()
assert store.save_order("o1", {"amt": 100}) is True
assert store.save_order("o1", {"amt": 999}) is False # Duplicate rejected!
assert store.get_order("o1")["amt"] == 100
print("CAPSTONE M4 VERIFIED: Idempotent persistence passed!")`
      },
      {
        id: 'cap-m5-test-coverage-gate',
        title: 'Milestone 5: Comprehensive Automated Test Suite',
        instructions: {
          en: 'Implement `evaluate_capstone_tests(passed_count: int, failed_count: int, cov_pct: float) -> bool`. Returns `True` if failed_count == 0, passed_count >= 10, and cov_pct >= 90.0.',
          'hi-Latn': '`evaluate_capstone_tests` banayein jo verify kare ki zero failures, >=10 passed tests, aur >=90% coverage hai.',
          hi: '`evaluate_capstone_tests` लागू करें जो सत्यापित करे कि शून्य विफलताएं और कम से कम 90% कवरेज है।'
        },
        starter_code: `def evaluate_capstone_tests(passed_count: int, failed_count: int, cov_pct: float) -> bool:
    return failed_count == 0 and passed_count >= 10 and cov_pct >= 90.0`,
        test_harness: `
assert evaluate_capstone_tests(15, 0, 94.2) is True
assert evaluate_capstone_tests(9, 0, 95.0) is False # Need at least 10 tests
print("CAPSTONE M5 VERIFIED: Test coverage gate passed!")`
      },
      {
        id: 'cap-m6-secrets-hygiene',
        title: 'Milestone 6: Security and Secrets Hardening',
        instructions: {
          en: 'Implement `mask_secret_output(key: str, val: str) -> str`. If `key` is in `["password", "secret", "token"]`, return `"***PROTECTED***"`. Otherwise return `val`.',
          'hi-Latn': '`mask_secret_output` banayein jo credentials ko mask kare.',
          hi: '`mask_secret_output` लागू करें जो क्रेडेंशियल्स को मास्क करे।'
        },
        starter_code: `def mask_secret_output(key: str, val: str) -> str:
    if key.lower() in ["password", "secret", "token"]:
        return "***PROTECTED***"
    return val`,
        test_harness: `
assert mask_secret_output("token", "secret_jwt") == "***PROTECTED***"
assert mask_secret_output("username", "alice") == "alice"
print("CAPSTONE M6 VERIFIED: Secrets hygiene passed!")`
      },
      {
        id: 'cap-m7-packaging-standards',
        title: 'Milestone 7: pyproject.toml Packaging Standards',
        instructions: {
          en: 'Implement `verify_capstone_pyproject(meta: dict) -> bool`. Verify that `meta["build-system"]["build-backend"]` is set and `meta["project"]["dependencies"]` is a list.',
          'hi-Latn': '`verify_capstone_pyproject` banayein jo build-backend aur dependencies list check kare.',
          hi: '`verify_capstone_pyproject` लागू करें जो pyproject कॉन्फ़िगरेशन को सत्यापित करे।'
        },
        starter_code: `def verify_capstone_pyproject(meta: dict) -> bool:
    has_backend = bool(meta.get("build-system", {}).get("build-backend"))
    has_deps = isinstance(meta.get("project", {}).get("dependencies"), list)
    return has_backend and has_deps`,
        test_harness: `
cfg = {
    "build-system": {"build-backend": "hatchling.build"},
    "project": {"dependencies": ["pydantic"]}
}
assert verify_capstone_pyproject(cfg) is True
print("CAPSTONE M7 VERIFIED: Packaging standards passed!")`
      },
      {
        id: 'cap-m8-container-signals',
        title: 'Milestone 8: Container Multi-Stage & Signal Resilience',
        instructions: {
          en: 'Implement `simulate_container_drain(timeout_seconds: int, in_flight_jobs: int) -> dict`. Drain jobs 1 per second. If finished before timeout, return `{"clean": True, "remaining": 0}`. If timeout reached, return `{"clean": False, "remaining": <remaining>}`.',
          'hi-Latn': '`simulate_container_drain` banayein jo graceful shutdown drain simulate kare.',
          hi: '`simulate_container_drain` लागू करें जो कार्य समापन का अनुकरण करे।'
        },
        starter_code: `def simulate_container_drain(timeout_seconds: int, in_flight_jobs: int) -> dict:
    drained = min(timeout_seconds, in_flight_jobs)
    rem = in_flight_jobs - drained
    return {"clean": rem == 0, "remaining": rem}`,
        test_harness: `
res = simulate_container_drain(timeout_seconds=10, in_flight_jobs=3)
assert res["clean"] is True
assert res["remaining"] == 0

res_slow = simulate_container_drain(timeout_seconds=5, in_flight_jobs=10)
assert res_slow["clean"] is False
assert res_slow["remaining"] == 5
print("CAPSTONE M8 VERIFIED: Container signals passed!")`
      },
      {
        id: 'cap-m9-observability-probes',
        title: 'Milestone 9: RED Observability and Probe Endpoints',
        instructions: {
          en: 'Implement `get_observability_snapshot(req_count: int, err_count: int, is_healthy: bool) -> dict`. Return `{"status": "HEALTHY" | "UNHEALTHY", "error_rate": float}`.',
          'hi-Latn': '`get_observability_snapshot` banayein jo health status aur error rate return kare.',
          hi: '`get_observability_snapshot` लागू करें जो स्वास्थ्य स्थिति और त्रुटि दर लौटाए।'
        },
        starter_code: `def get_observability_snapshot(req_count: int, err_count: int, is_healthy: bool) -> dict:
    err_rate = (err_count / req_count) if req_count > 0 else 0.0
    status = "HEALTHY" if (is_healthy and err_rate < 0.05) else "UNHEALTHY"
    return {"status": status, "error_rate": err_rate}`,
        test_harness: `
snap = get_observability_snapshot(100, 1, True)
assert snap["status"] == "HEALTHY"
assert snap["error_rate"] == 0.01
print("CAPSTONE M9 VERIFIED: Observability snapshot passed!")`
      },
      {
        id: 'cap-m10-prr-retrospective',
        title: 'Milestone 10: Production Readiness Audit and Retrospective',
        instructions: {
          en: 'Implement `finalize_capstone_audit(milestones_completed: int) -> dict`. If `milestones_completed == 10`, return `{"verdict": "CERTIFIED_PRODUCTION_ENGINEER", "xp_awarded": 500}`. Otherwise raise `RuntimeError`.',
          'hi-Latn': '`finalize_capstone_audit` banayein jo 10 milestones complete hone par "CERTIFIED_PRODUCTION_ENGINEER" return kare.',
          hi: '`finalize_capstone_audit` लागू करें जो 10 मील के पत्थर पूरे होने पर प्रमाण पत्र प्रदान करे।'
        },
        starter_code: `def finalize_capstone_audit(milestones_completed: int) -> dict:
    if milestones_completed != 10:
        raise RuntimeError(f"Capstone incomplete: {milestones_completed}/10 milestones finished")
    return {
        "verdict": "CERTIFIED_PRODUCTION_ENGINEER",
        "xp_awarded": 500,
        "summary": "Full Level 5 Production Python Capstone completed and verified!"
    }`,
        test_harness: `
res = finalize_capstone_audit(10)
assert res["verdict"] == "CERTIFIED_PRODUCTION_ENGINEER"
assert res["xp_awarded"] == 500

try:
    finalize_capstone_audit(9)
    assert False, "Should have failed on incomplete milestones"
except RuntimeError:
    pass
print("CAPSTONE M10 VERIFIED: Capstone final retrospective passed!")`
      }
    ]
  }
];
