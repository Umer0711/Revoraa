// Module 8: Production Readiness and Final Assessment (12 Lessons)
// Covers architecture review, resilience patterns, security audits, performance profiling,
// test completeness, ADR documentation, deployment verification, DR/backups, PRR checklists,
// capstone prep, and the comprehensive Level 5 Final Assessment.

export const LEVEL_5_MOD_8_LESSONS = [
  {
    id: 'l5-m8-l1',
    slug: 'reviewing-project-architecture',
    module_slug: 'production-readiness-final-assessment',
    title: 'Reviewing Project Architecture and Domain Boundaries',
    description: 'Audit software architectures for high cohesion, loose coupling, clean dependency direction, and robust domain boundary separation.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Audit existing Python codebases for structural cohesion and coupling.
2. Apply the **Dependency Inversion Principle** to decouple high-level domain policies from low-level infrastructure.
3. Identify cyclic dependency hazards between packages.
4. Establish clean architectural boundaries using interfaces and abstract protocols.

---

### Clean Architecture Principles in Python

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │                   Domain Core (Entities)               │
   │       (Zero external dependencies, pure business logic)│
   ├────────────────────────────────────────────────────────┤
   │               Application Use Cases / Services         │
   │       (Coordinates domain actions, defines interfaces) │
   ├────────────────────────────────────────────────────────┤
   │                 Infrastructure Adapters                │
   │       (PostgreSQL, Redis, HTTP Clients, S3 storage)    │
   └────────────────────────────────────────────────────────┘
\`\`\`

- **The Golden Rule**: Dependencies point **inward**.
- Your business rules must never import SQLAlchemy, FastAPI, or boto3. 
- Infrastructure modules import domain interfaces, never the reverse.
`,
    interactive_code: `class ArchitectureDependencyAuditor:
    """Audits module import dependencies to prevent cyclic coupling and domain contamination."""
    
    @staticmethod
    def audit_layers(layer_from: str, layer_to: str) -> dict:
        layer_hierarchy = {"domain": 1, "use_cases": 2, "infrastructure": 3}
        
        from_rank = layer_hierarchy.get(layer_from, 0)
        to_rank = layer_hierarchy.get(layer_to, 0)
        
        if from_rank < to_rank:
            return {
                "valid": False,
                "violation": f"Architecture Violation: Inner layer '{layer_from}' imports outer layer '{layer_to}'!",
                "fix": "Invert dependency using Python Protocols or Abstract Base Classes."
            }
        return {"valid": True, "message": f"Valid dependency flow: {layer_from} -> {layer_to}"}

print(ArchitectureDependencyAuditor.audit_layers("domain", "infrastructure")["violation"])
print(ArchitectureDependencyAuditor.audit_layers("infrastructure", "domain")["message"])
`,
    quiz: {
      id: 'quiz-l5-m8-l1',
      title: 'Architecture Review Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'According to Clean Architecture principles, what direction should dependencies point?',
          options: [
            { id: 'opt_1', text: 'Inward: outer infrastructure layers depend on inner business domain entities, never the reverse.' },
            { id: 'opt_2', text: 'Outward: domain models should import SQL databases and HTTP web routers directly.' },
            { id: 'opt_3', text: 'Circular: all files should import each other.' },
            { id: 'opt_4', text: 'Horizontally between sibling microservices only.' }
          ],
          correct_option_ids: ['opt_1'],
          explanation: 'In clean architecture, domain entities remain pure and isolated from external frameworks or database engines. Infrastructure layers depend on domain contracts, ensuring business logic can be tested and evolved independently.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l2',
    slug: 'reliability-graceful-failure',
    module_slug: 'production-readiness-final-assessment',
    title: 'Reliability and Graceful Degradation Under Load',
    description: 'Design resilient systems that degrade gracefully under peak load using bulkheads, circuit breakers, backpressure, and defensive fallbacks.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Implement the **Bulkhead Pattern** to prevent failures in one subsystem from taking down the entire service.
2. Apply **Circuit Breakers** and **Graceful Degradation** during downstream outages.
3. Manage system **Backpressure** to avoid resource exhaustion under sudden traffic spikes.
4. Provide fallback behaviors that preserve core customer journeys.

---

### The Bulkhead Pattern

In shipbuilding, a ship's hull is divided into watertight compartments (bulkheads). If one compartment floods, the ship remains afloat.

In Python microservices:
- Separate thread/connection pools for critical and non-critical operations.
- If an analytics export or reporting job stalls, it consumes only its allocated bulkhead pool, leaving the core checkout and payment workers fully responsive.
`,
    interactive_code: `class BulkheadService:
    """Demonstrates resource isolation using separate worker capacity pools."""
    
    def __init__(self, critical_capacity: int, non_critical_capacity: int):
        self.critical_pool = critical_capacity
        self.non_critical_pool = non_critical_capacity
        
    def execute(self, is_critical: bool) -> dict:
        if is_critical:
            if self.critical_pool > 0:
                self.critical_pool -= 1
                return {"success": True, "pool": "CRITICAL", "message": "Transaction processed cleanly."}
            return {"success": False, "pool": "CRITICAL", "message": "Critical pool saturated."}
        else:
            if self.non_critical_pool > 0:
                self.non_critical_pool -= 1
                return {"success": True, "pool": "NON_CRITICAL", "message": "Batch report queued."}
            return {"success": False, "pool": "NON_CRITICAL", "message": "Non-critical pool saturated. Backpressure applied."}

bulkhead = BulkheadService(critical_capacity=10, non_critical_capacity=1)
print("Non-critical 1:", bulkhead.execute(is_critical=False)["message"])
print("Non-critical 2:", bulkhead.execute(is_critical=False)["message"])
print("Critical order:", bulkhead.execute(is_critical=True)["message"])
`,
    quiz: {
      id: 'quiz-l5-m8-l2',
      title: 'Reliability Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary benefit of the Bulkhead pattern in distributed systems?',
          options: [
            { id: 'opt_1', text: 'It speeds up Python string manipulation.' },
            { id: 'opt_2', text: 'It isolates failure domains so that an overloaded or failing component cannot exhaust resources needed by critical paths.' },
            { id: 'opt_3', text: 'It eliminates the need for database backups.' },
            { id: 'opt_4', text: 'It compresses HTTP payloads automatically.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The Bulkhead pattern partitions resources into isolated pools. If a non-critical feature becomes overwhelmed, its exhaustion does not starve the thread pools or connections needed for critical user operations.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l3',
    slug: 'security-dependency-review',
    module_slug: 'production-readiness-final-assessment',
    title: 'Security and Dependency Threat Modeling',
    description: 'Conduct pre-production security audits: STRIDE threat modeling, dependency vulnerability scanning with pip-audit, and secret exposure sweeps.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Apply the **STRIDE** framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
2. Automate dependency vulnerability audits in CI using \`pip-audit\`.
3. Detect hardcoded secrets using static analysis tools (\`detect-secrets\`, \`trufflehog\`).
4. Harden HTTP response headers (HSTS, CSP, X-Frame-Options) and cookie configurations.

---

### The STRIDE Threat Model in Python Services

| Threat | Description | Python Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Impersonating another user or system. | Cryptographically signed JWTs, TLS mutual authentication. |
| **Tampering** | Modifying data in transit or database. | HMAC signatures, strict Pydantic input schemas, immutable audit logs. |
| **Repudiation** | Denying an action took place. | Append-only event logs containing Correlation IDs and verified user IDs. |
| **Information Disclosure**| Exposing sensitive data. | Pydantic response filtering, log masking, masking passwords in tracebacks. |
| **Denial of Service** | Exhausting memory, connections, or CPU. | Rate limiting, connection pool bounds, request payload size limits. |
| **Elevation of Privilege**| Standard user gaining admin access. | Strict Role-Based Access Control (RBAC) enforced on every endpoint. |
`,
    interactive_code: `class ThreatModelReview:
    """Evaluates an endpoint configuration against standard security baseline rules."""
    
    @staticmethod
    def audit_endpoint(has_auth: bool, has_rate_limit: bool, has_response_filtering: bool) -> list[str]:
        findings = []
        if not has_auth:
            findings.append("CRITICAL: Missing authentication! Vulnerable to Spoofing and Privilege Elevation.")
        if not has_rate_limit:
            findings.append("HIGH: Missing rate limiting! Vulnerable to Denial of Service (DoS).")
        if not has_response_filtering:
            findings.append("MEDIUM: Missing response filtering! Risk of Information Disclosure.")
        return findings

issues = ThreatModelReview.audit_endpoint(has_auth=True, has_rate_limit=False, has_response_filtering=True)
print("Security Audit Findings:")
for issue in issues:
    print(f" [!] {issue}")
`,
    quiz: {
      id: 'quiz-l5-m8-l3',
      title: 'Security Audit Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'In the STRIDE threat modeling framework, which risk is mitigated by enforcing request rate limiting and payload size limits?',
          options: [
            { id: 'opt_1', text: 'Repudiation' },
            { id: 'opt_2', text: 'Denial of Service (DoS)' },
            { id: 'opt_3', text: 'Spoofing' },
            { id: 'opt_4', text: 'Elevation of Privilege' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Denial of Service threats occur when malicious actors flood services with oversized payloads or high-frequency requests to consume all CPU and memory. Rate limiting and size bounds protect system availability.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l4',
    slug: 'performance-resource-review',
    module_slug: 'production-readiness-final-assessment',
    title: 'Performance and Resource Review: Profiling and Optimization',
    description: 'Profile Python services with cProfile and tracemalloc. Detect N+1 database queries, identify memory leaks, and understand CPU vs I/O scaling.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Profile CPU bottlenecks using Python standard library \`cProfile\` and \`pstats\`.
2. Detect memory leaks and excessive allocations using \`tracemalloc\`.
3. Eliminate the ubiquitous **N+1 Database Query** anti-pattern with eager loading.
4. Distinguish CPU-bound tasks (multiprocessing) from I/O-bound tasks (asyncio / thread pools).

---

### Profiling with \`cProfile\` and \`tracemalloc\`

Never optimize without profiling data:
\`\`\`python
import cProfile
import pstats

profiler = cProfile.Profile()
profiler.enable()

# Call business logic
process_orders(orders)

profiler.disable()
stats = pstats.Stats(profiler).sort_stats("cumulative")
stats.print_stats(10) # Print top 10 bottlenecks
\`\`\`
`,
    interactive_code: `import tracemalloc

def simulate_memory_allocation():
    tracemalloc.start()
    
    # Allocate a large list
    large_list = [f"item_{i}" for i in range(10000)]
    
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    return {
        "current_kb": current / 1024,
        "peak_kb": peak / 1024
    }

mem_stats = simulate_memory_allocation()
print(f"Current Memory: {mem_stats['current_kb']:.2f} KB")
print(f"Peak Memory:    {mem_stats['peak_kb']:.2f} KB")
`,
    quiz: {
      id: 'quiz-l5-m8-l4',
      title: 'Performance Review Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What standard library module is used in Python to trace memory block allocations and debug memory growth?',
          options: [
            { id: 'opt_1', text: 'sys.settrace' },
            { id: 'opt_2', text: 'tracemalloc' },
            { id: 'opt_3', text: 'hashlib' },
            { id: 'opt_4', text: 'threading' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The `tracemalloc` standard library module tracks memory allocations by Python processes, providing snapshots, peak usage metrics, and allocation tracebacks.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l5',
    slug: 'test-completeness-regression-protection',
    module_slug: 'production-readiness-final-assessment',
    title: 'Test Completeness, Mutation Testing, and Flaky Test Eradication',
    description: 'Move beyond vanity coverage metrics. Apply mutation testing concepts, boundary value analysis, and systematic eradication of flaky tests.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand why 100% line coverage can still miss critical production bugs.
2. Introduce **Mutation Testing** (mutmut) to verify the assertions in your test suite.
3. Design tests around Boundary Value Analysis (BVA) and Equivalence Partitioning.
4. Systematically isolate and quarantine flaky tests.

---

### Why Mutation Testing Matters

A test suite can achieve 100% line coverage while asserting almost nothing:
\`\`\`python
# Function:
def calculate_tax(amount: float) -> float:
    return amount * 0.20

# Bad test with 100% line coverage:
def test_tax():
    calculate_tax(100) # Passes, but no assert statement!
\`\`\`

**Mutation testing** automatically alters your source code:
- Changes \`*\` to \`/\`.
- Changes \`<\` to \`<=\`.
- Replaces \`return True\` with \`return False\`.

If your test suite still passes when your code has been mutated, the mutant **survives** and your test suite has failed!
`,
    interactive_code: `class MutationScoreCalculator:
    """Simulates a mutation test runner evaluating test suite efficacy."""
    
    @staticmethod
    def calculate_score(mutants_killed: int, mutants_survived: int) -> dict:
        total = mutants_killed + mutants_survived
        score = (mutants_killed / total) * 100 if total > 0 else 0.0
        
        return {
            "total_mutants": total,
            "killed": mutants_killed,
            "survived": mutants_survived,
            "mutation_score_pct": score,
            "verdict": "STRONG_TESTS" if score >= 85.0 else "WEAK_ASSERTIONS"
        }

res = MutationScoreCalculator.calculate_score(mutants_killed=45, mutants_survived=5)
print(f"Mutation Score: {res['mutation_score_pct']:.1f}% -> {res['verdict']}")
`,
    quiz: {
      id: 'quiz-l5-m8-l5',
      title: 'Test Completeness Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What does a "survived mutant" indicate in mutation testing?',
          options: [
            { id: 'opt_1', text: 'The Python virtual environment was corrupted.' },
            { id: 'opt_2', text: 'A synthetic bug was injected into the code, but the test suite still passed, proving the tests fail to catch that bug.' },
            { id: 'opt_3', text: 'The tests ran in under 1 millisecond.' },
            { id: 'opt_4', text: 'The coverage report exceeded 100%.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'In mutation testing, if code is mutated (e.g., `<` changed to `>`) and the test suite still passes, the mutant survived. This proves the test suite lacks rigorous assertions to catch that behavior.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l6',
    slug: 'documentation-reproducibility',
    module_slug: 'production-readiness-final-assessment',
    title: 'Documentation and Reproducibility: ADRs and Onboarding',
    description: 'Document production architectures with Architecture Decision Records (ADRs), comprehensive runbooks, and ten-minute onboarding READMEs.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Author **Architecture Decision Records (ADRs)** to preserve decision context for future engineers.
2. Construct the **Ten-Minute Onboarding README** that gets a new engineer running tests locally in minutes.
3. Keep technical documentation synchronized with code changes in pull requests.
4. Create clear troubleshooting runbooks for operational incidents.

---

### Anatomy of an Architecture Decision Record (ADR)

Whenever an engineering team makes a significant architectural choice (e.g. adopting FastAPI over Django, or PostgreSQL over MongoDB), document it:
1. **Title**: \`0003-use-postgresql-for-account-ledger.md\`
2. **Status**: Proposed / Accepted / Deprecated / Superseded
3. **Context**: What business or technical challenge drove this decision?
4. **Decision**: What did we choose to do?
5. **Consequences**: What trade-offs do we accept? (e.g. higher ops complexity, strict schema migrations).
`,
    interactive_code: `def generate_adr_template(number: int, title: str, context: str, decision: str, trade_offs: str) -> str:
    return f"""# ADR {number:04d}: {title}

## Status
Accepted

## Context
{context}

## Decision
{decision}

## Consequences
{trade_offs}
"""

adr = generate_adr_template(
    number=1,
    title="Adopt Pydantic V2 for Configuration Validation",
    context="Configuration drift and silent type coercion were causing runtime errors in staging.",
    decision="Enforce strict Pydantic BaseModel schemas on all environment variable loading at startup.",
    trade_offs="Fast-fails startup immediately if invalid env vars are provided; requires explicit type annotations."
)
print(adr)
`,
    quiz: {
      id: 'quiz-l5-m8-l6',
      title: 'Documentation Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of writing Architecture Decision Records (ADRs)?',
          options: [
            { id: 'opt_1', text: 'To generate API documentation automatically from docstrings.' },
            { id: 'opt_2', text: 'To record significant architectural decisions along with their context, rationale, and consequences for future maintainers.' },
            { id: 'opt_3', text: 'To replace automated unit tests.' },
            { id: 'opt_4', text: 'To store production database passwords securely.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'ADRs capture the "why" behind major engineering choices, ensuring that team members months or years later understand the historical context and trade-offs that motivated an architecture.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l7',
    slug: 'deployment-verification',
    module_slug: 'production-readiness-final-assessment',
    title: 'Deployment Verification: Post-Deploy Smoke Testing and Synthetics',
    description: 'Verify production deployments using automated smoke test suites, synthetic transactions, and post-deployment health probes.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Implement automated **Smoke Test Suites** that execute immediately after a deployment.
2. Use **Synthetic Transactions** to continuously verify critical customer journeys in production.
3. Integrate post-deployment health checks into CI/CD release pipelines.
4. Trigger automated rollbacks if post-deploy smoke tests fail.

---

### The Role of Smoke Testing

A deployment pipeline cannot assume success merely because a container started without crashing:
- The database connection string might point to the wrong VPC.
- An environment variable might be misconfigured.
- An upstream authentication service might be unreachable.

A post-deployment smoke test suite runs targeted queries against the live staging or canary endpoint to prove basic functionality before full traffic cutover.
`,
    interactive_code: `class SmokeTestRunner:
    """Executes a series of post-deployment smoke checks against a target endpoint."""
    
    @staticmethod
    def run_smoke_suite(health_status: int, db_ping_ms: float, auth_ok: bool) -> dict:
        results = [
            ("Liveness Probe (/healthz)", health_status == 200),
            ("Database Connectivity (< 50ms)", db_ping_ms < 50.0),
            ("Synthetic Auth Token Check", auth_ok)
        ]
        
        all_passed = all(status for _, status in results)
        return {
            "deployment_verified": all_passed,
            "checks": results,
            "action": "PROMOTE_RELEASE" if all_passed else "TRIGGER_AUTOMATED_ROLLBACK"
        }

report = SmokeTestRunner.run_smoke_suite(health_status=200, db_ping_ms=12.4, auth_ok=True)
print(f"Deployment Verified: {report['deployment_verified']} -> Action: {report['action']}")
for name, passed in report["checks"]:
    print(f" - {name}: {'PASS' if passed else 'FAIL'}")
`,
    quiz: {
      id: 'quiz-l5-m8-l7',
      title: 'Deployment Verification Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary function of an automated post-deployment smoke test?',
          options: [
            { id: 'opt_1', text: 'To rewrite Git commit messages.' },
            { id: 'opt_2', text: 'To verify that the freshly deployed service can connect to dependencies and perform critical core operations before full user traffic is served.' },
            { id: 'opt_3', text: 'To compile Python code to C++.' },
            { id: 'opt_4', text: 'To generate mock data for development.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Post-deployment smoke tests validate the deployed application in its live environment, verifying external network access, database connections, and basic routing before fully committing to the release.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l8',
    slug: 'backup-recovery-fundamentals',
    module_slug: 'production-readiness-final-assessment',
    title: 'Backup and Disaster Recovery Fundamentals',
    description: 'Design disaster recovery protocols. Understand RPO and RTO, Point-in-Time Recovery (PITR), and the fundamental rule of regularly testing database restores.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Define **Recovery Point Objective (RPO)** and **Recovery Time Objective (RTO)**.
2. Implement **Point-in-Time Recovery (PITR)** using Write-Ahead Logging (WAL).
3. Recognize why an untested backup is not a backup.
4. Establish disaster recovery runbooks for catastrophic database corruption.

---

### RPO vs RTO

- **RPO (Recovery Point Objective)**: How much data loss can your business tolerate? (e.g., RPO = 5 minutes means you can lose at most 5 minutes of transactions).
- **RTO (Recovery Time Objective)**: How long can the system remain offline during an outage? (e.g., RTO = 30 minutes means the database must be restored and serving traffic within half an hour).

\`\`\`
   Last Backup (12:00)                  Disaster (12:05)            System Restored (12:35)
         │                                    │                               │
         ├────────────── RPO ─────────────────┤                               │
         │         (5 min data loss)          │                               │
         │                                    ├────────────── RTO ────────────┤
         │                                    │       (30 min downtime)       │
\`\`\`
`,
    interactive_code: `class DisasterRecoveryEvaluator:
    """Evaluates disaster recovery SLAs against business objectives."""
    
    @staticmethod
    def evaluate_sla(measured_data_loss_min: int, max_rpo_min: int, restore_duration_min: int, max_rto_min: int) -> dict:
        rpo_met = measured_data_loss_min <= max_rpo_min
        rto_met = restore_duration_min <= max_rto_min
        
        return {
            "rpo_met": rpo_met,
            "rto_met": rto_met,
            "compliance": "PASSED" if (rpo_met and rto_met) else "FAILED_SLA",
            "summary": f"Data loss: {measured_data_loss_min}m (Target: <={max_rpo_min}m) | Downtime: {restore_duration_min}m (Target: <={max_rto_min}m)"
        }

eval_result = DisasterRecoveryEvaluator.evaluate_sla(
    measured_data_loss_min=3,
    max_rpo_min=5,
    restore_duration_min=18,
    max_rto_min=30
)
print(f"Disaster Recovery SLA: {eval_result['compliance']}")
print(eval_result["summary"])
`,
    quiz: {
      id: 'quiz-l5-m8-l8',
      title: 'Disaster Recovery Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the difference between Recovery Point Objective (RPO) and Recovery Time Objective (RTO)?',
          options: [
            { id: 'opt_1', text: 'RPO measures downtime, while RTO measures data loss.' },
            { id: 'opt_2', text: 'RPO defines the maximum tolerable data loss measured in time, while RTO defines the maximum tolerable duration the system can be offline.' },
            { id: 'opt_3', text: 'RPO applies to frontend apps; RTO applies to backend databases.' },
            { id: 'opt_4', text: 'They are identical concepts with different acronyms.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'RPO answers "how much data can we afford to lose?" (measured from the moment of disaster back to the latest usable backup), while RTO answers "how quickly must we restore the system?"'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l9',
    slug: 'maintenance-versioning',
    module_slug: 'production-readiness-final-assessment',
    title: 'Software Maintenance and Semantic Versioning Lifecycles',
    description: 'Manage production software lifecycles with strict Semantic Versioning (SemVer), API deprecation timelines, and Long-Term Support (LTS) policies.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Apply **Semantic Versioning (MAJOR.MINOR.PATCH)** consistently across libraries and APIs.
2. Implement standardized deprecation cycles using \`warnings.warn(..., DeprecationWarning)\`.
3. Support Long-Term Support (LTS) maintenance branches without blocking active development.
4. Establish clear sunset policies for deprecated public APIs.

---

### The Three-Phase Deprecation Pattern

Never delete or break a public API without advance notice:
1. **Phase 1 (Announce & Warn)**: Emit a \`DeprecationWarning\` when the old method is called. Document the replacement in release notes.
2. **Phase 2 (Default Disabled)**: Maintain the method for at least one full minor/major version cycle.
3. **Phase 3 (Removal)**: Remove the deprecated method only in the next **MAJOR** version bump.
`,
    interactive_code: `import warnings

def deprecated(replacement_func_name: str):
    """Decorator to mark legacy functions with standard Python DeprecationWarnings."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            warnings.warn(
                f"{func.__name__}() is deprecated and will be removed in v3.0.0. Use {replacement_func_name}() instead.",
                category=DeprecationWarning,
                stacklevel=2
            )
            return func(*args, **kwargs)
        return wrapper
    return decorator

@deprecated("get_user_by_uuid")
def get_user_by_id(user_id: int) -> dict:
    return {"id": user_id, "name": "Alice"}

# Call the legacy function
with warnings.catch_warnings(record=True) as captured:
    warnings.simplefilter("always")
    res = get_user_by_id(42)
    print("Function result:", res)
    if captured:
        print("Warning caught:", captured[0].message)
`,
    quiz: {
      id: 'quiz-l5-m8-l9',
      title: 'Versioning and Maintenance Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Under Semantic Versioning (SemVer), which version segment MUST be incremented when an API removes a previously deprecated function?',
          options: [
            { id: 'opt_1', text: 'PATCH version' },
            { id: 'opt_2', text: 'MINOR version' },
            { id: 'opt_3', text: 'MAJOR version' },
            { id: 'opt_4', text: 'BUILD metadata' }
          ],
          correct_option_ids: ['opt_3'],
          explanation: 'Removing a function or breaking backward compatibility requires incrementing the MAJOR version number (e.g. from 2.4.1 to 3.0.0).'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l10',
    slug: 'production-readiness-review',
    module_slug: 'production-readiness-final-assessment',
    title: 'The Production Readiness Review (PRR) Gate',
    description: 'Execute the comprehensive Production Readiness Review (PRR) audit: architecture, security, observability, disaster recovery, and capacity planning.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand the purpose of a **Production Readiness Review (PRR)** before initial live launch.
2. Evaluate applications against the 6 Pillars of Production Engineering:
   - Architecture & Modularity
   - Configuration & Secrets
   - Testing & Quality Gates
   - Observability & Metrics
   - Deployment & Rollback Safety
   - Disaster Recovery & Runbooks
3. Conduct an objective Go/No-Go operational launch assessment.

---

### The PRR Scorecard

Before any service receives real customer traffic, the engineering team conducts a PRR audit:

| Category | Verification Criteria | Status |
| :--- | :--- | :--- |
| **Packaging & CI** | Automated test matrix passes; immutable image built; non-root user. | Required |
| **Secrets & Config**| Zero credentials in Git or image layers; 12-factor env vars with startup validation. | Required |
| **Reliability** | Connection pools bounded; circuit breakers active; graceful SIGTERM draining. | Required |
| **Observability** | Structured JSON logs; Prometheus metrics (/metrics); separate /healthz and /readyz probes. | Required |
| **Disaster Recovery**| Verified restore procedure; RPO/RTO documented; operational runbook published. | Required |
`,
    interactive_code: `class ProductionReadinessReview:
    """Evaluates readiness checklist across all production engineering pillars."""
    
    CHECKLIST = {
        "non_root_user": "Container runs as unprivileged non-root user",
        "startup_validation": "Configuration schema validated at boot",
        "graceful_shutdown": "Handles SIGTERM cleanly within grace period",
        "separate_probes": "Liveness and Readiness probes decoupled",
        "structured_logs": "Structured JSON logging with correlation IDs",
        "runbook_documented": "Operational runbook authored for on-call triage"
    }
    
    @classmethod
    def evaluate(cls, completed_items: set[str]) -> dict:
        missing = [desc for key, desc in cls.CHECKLIST.items() if key not in completed_items]
        is_ready = len(missing) == 0
        
        return {
            "go_no_go": "GO (Ready for Production)" if is_ready else "NO-GO (Launch Blocked)",
            "score_pct": ((len(cls.CHECKLIST) - len(missing)) / len(cls.CHECKLIST)) * 100,
            "missing_blockers": missing
        }

passed = {"non_root_user", "startup_validation", "graceful_shutdown", "separate_probes", "structured_logs", "runbook_documented"}
audit = ProductionReadinessReview.evaluate(passed)

print(f"PRR Decision: {audit['go_no_go']} ({audit['score_pct']:.0f}% Compliance)")
`,
    quiz: {
      id: 'quiz-l5-m8-l10',
      title: 'PRR Gate Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the core purpose of a Production Readiness Review (PRR)?',
          options: [
            { id: 'opt_1', text: 'To ensure developers write code without any comments.' },
            { id: 'opt_2', text: 'To systematically verify that a service satisfies operational, security, reliability, and observability standards before serving live traffic.' },
            { id: 'opt_3', text: 'To calculate the monetary value of software licenses.' },
            { id: 'opt_4', text: 'To replace the Git version control system.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'A Production Readiness Review evaluates all non-functional requirements—security, observability, failure recovery, deployment safety, and documentation—ensuring a service can be operated reliably by on-call engineers.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l11',
    slug: 'final-assessment-preparation',
    module_slug: 'production-readiness-final-assessment',
    title: 'Final Assessment Preparation: Synthesis and Roadmap Review',
    description: 'Review and synthesize the complete production engineering curriculum across packaging, security, testing, databases, Docker, CI/CD, and operations.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Synthesize concepts across all 8 modules of Level 5: Expert / Production Python.
2. Review the end-to-end delivery lifecycle from package layout to live production monitoring.
3. Prepare for the Level 5 Comprehensive Final Assessment and the Production Python Project Lab capstone.
4. Establish professional engineering instincts for real-world software delivery.

---

### Key Synthesis Points

1. **Architecture & Packaging (Modules 1 & 2)**:
   - Use standard \`src/\` layout to prevent accidental uninstalled package imports.
   - Configure \`pyproject.toml\` with PEP 517 build backends and strict SemVer versioning.
2. **Security & Configuration (Module 3)**:
   - Treat configuration as dynamic 12-factor environment variables.
   - Validate settings at boot using Pydantic; never bake secrets into code or images.
3. **Testing & Reliability (Modules 4 & 5)**:
   - Follow the test pyramid: fast unit tests, isolated integration tests with rollbacks.
   - Protect APIs with bounded timeouts, idempotency keys, and circuit breakers.
4. **Containers, CI/CD & Operations (Modules 6, 7 & 8)**:
   - Multi-stage Docker builds running as non-root users with \`PYTHONUNBUFFERED=1\`.
   - Trunk-based CI with matrix pipelines and temporary OIDC cloud credentials.
   - Structured JSON logging, RED metrics, decoupled \`/healthz\` vs \`/readyz\` probes, and tested disaster recovery plans.
`,
    interactive_code: `def print_production_roadmap():
    modules = [
        "M1: Professional Python Project Structure",
        "M2: Packaging and Distribution",
        "M3: Configuration, Security, and Secrets",
        "M4: Production Testing and Quality Assurance",
        "M5: APIs, Databases, and Production Reliability",
        "M6: Docker and Deployment Fundamentals",
        "M7: CI/CD, Monitoring, and Operations",
        "M8: Production Readiness and Final Assessment"
    ]
    print("Level 5 Mastery Roadmap:")
    for idx, mod in enumerate(modules, 1):
        print(f" [✓] {mod}")
    print("\\nReady for the Comprehensive Final Assessment!")

print_production_roadmap()
`,
    quiz: {
      id: 'quiz-l5-m8-l11',
      title: 'Assessment Prep Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Which sequence correctly represents the production lifecycle of a modern Python service?',
          options: [
            { id: 'opt_1', text: 'Deploy directly to VM -> Write tests -> Setup Git repo -> Add logging' },
            { id: 'opt_2', text: 'Modular src layout -> Validated config & tests -> Multi-stage container -> CI test matrix -> Immutable release deployment -> Observability & PRR' },
            { id: 'opt_3', text: 'Write single script -> Run as root -> Manually restart on crash' },
            { id: 'opt_4', text: 'Build wheel -> Publish to public PyPI -> Add password in plaintext' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The modern cloud-native lifecycle proceeds methodically from clean modular packaging and validated configuration to comprehensive automated testing, multi-stage containerization, CI promotion, immutable release deployment, and rigorous operational observability.'
        }
      ]
    }
  },
  {
    id: 'l5-m8-l12',
    slug: 'capstone-evaluation-retrospective',
    module_slug: 'production-readiness-final-assessment',
    title: 'Level 5 Final Assessment and Capstone Evaluation',
    description: 'Demonstrate mastery of production Python engineering across packaging, security, testing, containers, CI/CD, and operations in this comprehensive evaluation.',
    xp_reward: 150,
    estimated_minutes: 40,
    content: `
### Learning Objectives
1. Complete the comprehensive Level 5 Final Assessment covering all 8 production modules.
2. Apply systems thinking to packaging, security, database reliability, and container operations.
3. Review criteria for the final capstone project: **Production Python Project Lab**.
4. Earn 150 XP and demonstrate readiness for real-world production engineering roles.

---

### The Final Assessment

This final evaluation tests your synthesis across all production disciplines:
- **Question 1**: Project layout and import safety.
- **Question 2**: Configuration security and secret masking.
- **Question 3**: Test architecture and flaky test prevention.
- **Question 4**: Container lifecycle and signal handling.
- **Question 5**: Cloud-native observability and health probes.

Answer all questions accurately to unlock your final level completion.
`,
    interactive_code: `class CapstoneReadinessAudit:
    """Verifies that all criteria for the Production Python Project Lab capstone are met."""
    
    MILESTONES = [
        "1. Problem Definition & Scope",
        "2. Architecture & Domain Design",
        "3. Core Service Implementation",
        "4. Persistence & Validation Layer",
        "5. Automated Test Suite (Unit & Integration)",
        "6. Security & Secret Hardening",
        "7. Packaging with pyproject.toml",
        "8. Multi-Stage Dockerfile & CI Pipeline",
        "9. Observability & Health Probes",
        "10. Final PRR Audit & Retrospective"
    ]
    
    @classmethod
    def display_milestones(cls):
        print("=== PRODUCTION PYTHON PROJECT LAB MILESTONES ===")
        for m in cls.MILESTONES:
            print(f" [ ] {m}")
        print("\\nAll 10 milestones must be satisfied for capstone completion.")

CapstoneReadinessAudit.display_milestones()
`,
    quiz: {
      id: 'quiz-l5-m8-l12',
      title: 'Level 5 Comprehensive Final Assessment',
      questions: [
        {
          id: 'q1',
          question: 'Why is the `src/` directory layout preferred over putting package modules directly in the repository root directory?',
          options: [
            { id: 'opt_1', text: 'Python cannot compile bytecode if packages are in the repository root.' },
            { id: 'opt_2', text: 'It prevents tests from accidentally importing uninstalled local source code instead of the properly installed package distribution.' },
            { id: 'opt_3', text: 'Git will not track folders named anything other than src.' },
            { id: 'opt_4', text: 'It allows using Python 2 and Python 3 simultaneously.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'When modules reside in the root directory, running pytest imports local files directly from the working directory. The `src/` layout forces tools to import the package only after it has been properly installed via pip, guaranteeing packaging metadata and C-extensions are tested accurately.'
        },
        {
          id: 'q2',
          question: 'What is the most secure and maintainable method for managing production API keys and database credentials in a Python service?',
          options: [
            { id: 'opt_1', text: 'Hardcoding them in `settings.py` and adding the file to `.gitignore`.' },
            { id: 'opt_2', text: 'Injecting them dynamically at runtime via environment variables or secret vaults, validated at startup into masked SecretString types.' },
            { id: 'opt_3', text: 'Storing them as default values inside Dockerfile `ENV` directives.' },
            { id: 'opt_4', text: 'Checking plaintext `.env` files into private GitHub repositories.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Production secrets must never be baked into images or repository files. Injecting them at runtime via environment variables or secret stores and validating them with startup schemas using masked types guarantees fast failure on misconfiguration without leaking credentials in logs or images.'
        },
        {
          id: 'q3',
          question: 'What is the role of database transaction rollbacks in automated integration testing?',
          options: [
            { id: 'opt_1', text: 'To delete the PostgreSQL server after each test run.' },
            { id: 'opt_2', text: 'To execute tests inside a transaction that is rolled back during teardown, leaving the database completely clean without dropping tables.' },
            { id: 'opt_3', text: 'To convert relational database tables into JSON documents.' },
            { id: 'opt_4', text: 'To speed up network round-trips to external third-party APIs.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Running each integration test inside a database transaction and executing `connection.rollback()` in the pytest fixture teardown ensures total test isolation and clean state without the massive performance overhead of recreating database tables.'
        },
        {
          id: 'q4',
          question: 'Why must containerized Python services use the exec form `CMD ["python", "app.py"]` rather than the shell form `CMD python app.py`?',
          options: [
            { id: 'opt_1', text: 'The shell form makes Python run 10 times slower.' },
            { id: 'opt_2', text: 'The shell form runs `/bin/sh` as PID 1, which typically swallows `SIGTERM` signals and prevents Python from running graceful shutdown handlers.' },
            { id: 'opt_3', text: 'The exec form is required for Python virtual environments to work.' },
            { id: 'opt_4', text: 'The Linux kernel drops network packets unless JSON arrays are used.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The shell form spawns a shell process as PID 1. Standard shells do not forward `SIGTERM` to child processes, causing the orchestrator to wait until the grace period expires before forcibly destroying the container with `SIGKILL`.'
        },
        {
          id: 'q5',
          question: 'What occurs during a database blip if a web service checks database connectivity inside its Liveness probe (`/healthz`)?',
          options: [
            { id: 'opt_1', text: 'The database automatically repairs itself.' },
            { id: 'opt_2', text: 'The orchestrator restarts every container simultaneously, creating a cascading restart storm that floods the database with new connections upon boot.' },
            { id: 'opt_3', text: 'The load balancer converts HTTP requests to WebSocket connections.' },
            { id: 'opt_4', text: 'Pytest reruns all unit tests in production.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Liveness probe failures trigger container restarts. Checking database connectivity in `/healthz` means any database latency blip causes every container in the cluster to restart at once, overwhelming the database and turning a minor blip into a catastrophic cluster-wide outage.'
        }
      ]
    }
  }
];
