// Module 7: CI/CD, Monitoring, and Operations (12 Lessons)
// Covers trunk-based CI, CD deployment vs delivery, matrix test pipelines, artifact signing,
// OIDC secrets, structured JSON logging, Prometheus metrics, healthz vs readyz, Sentry, Dependabot, and runbooks.

export const LEVEL_5_MOD_7_LESSONS = [
  {
    id: 'l5-m7-l1',
    slug: 'continuous-integration-fundamentals',
    module_slug: 'cicd-monitoring-operations',
    title: 'Continuous Integration Fundamentals',
    description: 'Master the principles of Continuous Integration: trunk-based development, automated pull request gating, fast feedback loops, and merge queues.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Define Continuous Integration (CI) and why it replaced long-lived, divergent feature branches.
2. Understand trunk-based development and the perils of "Merge Hell".
3. Implement automated CI validation gates: syntax, linting, formatting, type checking, and unit testing.
4. Establish fast feedback loops (sub-5-minute CI runs) to maintain developer productivity.

---

### What Continuous Integration Actually Means

Continuous Integration is not merely "running GitHub Actions". It is an engineering discipline:
- **Frequent Small Merges**: Developers integrate their code into the mainline branch (\`main\` or \`trunk\`) multiple times a day rather than hoarding work on private branches for weeks.
- **Automated Verification**: Every single commit or pull request triggers an automated build and test pipeline that proves the changes do not break existing software.
- **Immediate Reversion on Failure**: If the trunk branch breaks, fixing or reverting it takes top priority before any new feature work proceeds.

\`\`\`
   Developer Branch                Automated CI Gate (GitHub Actions)               Mainline Trunk
          │                                        │                                       │
   [ git push ] ─────────────────────────> [ 1. Checkout Code ]                            │
                                           [ 2. Lint & Format (Ruff) ]                     │
                                           [ 3. Typecheck (Mypy) ]                         │
                                           [ 4. Run Unit Tests (Pytest) ]                  │
                                           [ 5. Build Wheel Artifact ]                     │
                                                   │                                       │
                                        (If All Steps Pass: 🟢)                            │
                                                   └─────────────────────────────> [ Merged into Main ]
\`\`\`

---

### The Cost of Long-Lived Branches ("Merge Hell")

When multiple engineers work on disconnected branches for weeks:
- Semantic conflicts multiply (Branch A renames a function signature; Branch B calls the old signature in 40 new places).
- Git's line-by-line diff tool cannot detect semantic bugs.
- Trunk-based CI keeps branches tiny (1–2 days max), eliminating merge conflicts and ensuring rapid integration.
`,
    interactive_code: `class ContinuousIntegrationGate:
    """Evaluates whether a pull request passes all automated CI verification checks."""
    
    @staticmethod
    def run_pipeline(lint_ok: bool, type_ok: bool, test_ok: bool, coverage_pct: float) -> dict:
        stages = [
            ("Linting (Ruff)", lint_ok),
            ("Type Checking (Mypy)", type_ok),
            ("Unit Tests (Pytest)", test_ok),
            ("Coverage Threshold (>= 80%)", coverage_pct >= 80.0),
        ]
        
        failed_stages = [name for name, passed in stages if not passed]
        can_merge = len(failed_stages) == 0
        
        return {
            "can_merge": can_merge,
            "status": "APPROVED_FOR_MERGE" if can_merge else "GATE_FAILED_BLOCKING_MERGE",
            "failed_stages": failed_stages,
            "message": "All CI verification gates passed!" if can_merge else f"CI failed on: {', '.join(failed_stages)}"
        }

# PR with failing type checks
pr_1 = ContinuousIntegrationGate.run_pipeline(lint_ok=True, type_ok=False, test_ok=True, coverage_pct=88.5)
print(f"PR #1 Status: {pr_1['status']} -> {pr_1['message']}")

# PR with green checks
pr_2 = ContinuousIntegrationGate.run_pipeline(lint_ok=True, type_ok=True, test_ok=True, coverage_pct=84.0)
print(f"PR #2 Status: {pr_2['status']} -> {pr_2['message']}")
`,
    quiz: {
      id: 'quiz-l5-m7-l1',
      title: 'CI Fundamentals Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary objective of Continuous Integration in a modern software engineering team?',
          options: [
            { id: 'opt_1', text: 'To allow developers to work on private branches for months without coordinating.' },
            { id: 'opt_2', text: 'To automatically integrate and verify code changes frequently, catching bugs and conflicts early.' },
            { id: 'opt_3', text: 'To eliminate the need for writing unit tests.' },
            { id: 'opt_4', text: 'To publish Python packages directly to PyPI on every local save.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Continuous Integration ensures code is merged into the mainline trunk frequently and verified by automated builds and test suites, preventing massive semantic merge conflicts and detecting regressions immediately.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l2',
    slug: 'cd-delivery-vs-deployment',
    module_slug: 'cicd-monitoring-operations',
    title: 'Continuous Delivery vs Continuous Deployment',
    description: 'Distinguish Continuous Delivery (manual release gate to production) from Continuous Deployment (automated end-to-end promotion to live users).',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Clearly differentiate **Continuous Delivery** from **Continuous Deployment**.
2. Understand automated promotion paths: Staging -> Acceptance Testing -> Production.
3. Formulate manual approval gates and compliance requirements for high-stakes enterprise applications.
4. Implement automated rollback triggers if post-deployment smoke tests detect elevated error rates.

---

### The Fundamental Distinction

| Practice | Trigger to Staging | Trigger to Production | Ideal For |
| :--- | :--- | :--- | :--- |
| **Continuous Delivery (CDel)** | Automated on merge to \`main\` | **Manual approval button** (one-click release) | Regulated industries, financial services, enterprise contracts requiring release notes. |
| **Continuous Deployment (CDep)** | Automated on merge to \`main\` | **100% Automated** without human intervention | SaaS platforms, consumer tech, highly mature automated test & observability cultures. |

\`\`\`
   [ Commit to Main ]
          │
          ▼
   [ CI Pipeline Passes ]
          │
          ▼
   [ Deploy to Staging ] ───> [ Automated Smoke Tests Pass ]
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │                                                                   │
    Continuous Delivery                                             Continuous Deployment
         │                                                                   │
    [ Manual Approval Click ]                                       [ Fully Automated ]
         │                                                                   │
         ▼                                                                   ▼
    [ Deploy to Production ]                                        [ Deploy to Production ]
\`\`\`

---

### Prerequisites for Continuous Deployment

You cannot safely adopt Continuous Deployment until you have:
1. Comprehensive automated test coverage (Unit, Integration, E2E).
2. Automated canary releases or blue-green cutovers.
3. Real-time metric observability (APM, error rate thresholds).
4. Automated rollback logic that reverses bad releases in seconds without human paging.
`,
    interactive_code: `class ReleasePipelineModel:
    """Simulates Continuous Delivery vs Continuous Deployment promotion logic."""
    
    def __init__(self, mode: str):
        self.mode = mode  # "delivery" or "deployment"
        
    def evaluate_promotion(self, staging_smoke_tests_passed: bool, human_approved: bool) -> dict:
        if not staging_smoke_tests_passed:
            return {"promoted": False, "reason": "Blocked: Staging automated smoke tests failed."}
            
        if self.mode == "delivery":
            if not human_approved:
                return {"promoted": False, "reason": "Awaiting release manager one-click approval (Continuous Delivery gate)."}
            return {"promoted": True, "reason": "Human approval granted. Deploying to production."}
            
        elif self.mode == "deployment":
            return {"promoted": True, "reason": "All automated gates passed. Deploying automatically to production (Continuous Deployment)."}
            
        return {"promoted": False, "reason": "Unknown mode"}

delivery_pipeline = ReleasePipelineModel(mode="delivery")
deployment_pipeline = ReleasePipelineModel(mode="deployment")

print("Delivery mode without manual click:", delivery_pipeline.evaluate_promotion(True, False)["reason"])
print("Deployment mode automated rollout:  ", deployment_pipeline.evaluate_promotion(True, False)["reason"])
`,
    quiz: {
      id: 'quiz-l5-m7-l2',
      title: 'CD Models Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the key difference between Continuous Delivery and Continuous Deployment?',
          options: [
            { id: 'opt_1', text: 'Continuous Delivery requires Docker, while Continuous Deployment does not.' },
            { id: 'opt_2', text: 'Continuous Delivery requires a human decision/button to trigger production deployment; Continuous Deployment deploys to production automatically without human intervention.' },
            { id: 'opt_3', text: 'Continuous Deployment only runs unit tests once per week.' },
            { id: 'opt_4', text: 'Continuous Delivery is only used for open-source Python libraries.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'In Continuous Delivery, every commit to trunk is kept in a production-ready state, but the deployment to production is triggered manually by a team member. In Continuous Deployment, the release to production is fully automated once all automated tests pass.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l3',
    slug: 'automated-test-pipelines',
    module_slug: 'cicd-monitoring-operations',
    title: 'Automated Test Pipelines and Test Matrix Strategies',
    description: 'Construct GitHub Actions workflow matrices to validate Python packages across multiple Python versions (3.11, 3.12, 3.13) and operating systems.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Construct GitHub Actions test workflows using the matrix strategy.
2. Test libraries across supported Python versions (\`3.11\`, \`3.12\`, \`3.13\`) and operating systems (\`ubuntu-latest\`, \`macos-latest\`, \`windows-latest\`).
3. Parallelize test execution and export standard JUnit XML test reports.
4. Configure \`fail-fast: false\` to observe all test runs even if one matrix leg encounters an error.

---

### The GitHub Actions Test Matrix

When building reusable Python packages or microservices, you must ensure broad compatibility:

\`\`\`yaml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest]
        python-version: ["3.11", "3.12", "3.13"]

    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      - name: Set up Python \${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: "pip"

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -e ".[dev]"

      - name: Run Pytest with Coverage
        run: |
          pytest --cov=src --junitxml=reports/junit-\${{ matrix.python-version }}.xml
\`\`\`

---

### Key Matrix Directives Explained

- **\`cache: "pip"\`**: Automatically caches \`~/.cache/pip\` based on lockfiles, shaving minutes off CI runtimes.
- **\`fail-fast: false\`**: By default, if Python 3.11 fails, GitHub Actions cancels the 3.12 and 3.13 jobs immediately. Setting \`fail-fast: false\` lets all jobs run, giving engineers the complete picture of version-specific issues.
`,
    interactive_code: `class MatrixJobScheduler:
    """Simulates how a CI matrix expands into individual parallel execution jobs."""
    
    @staticmethod
    def generate_matrix(python_versions: list[str], operating_systems: list[str]) -> list[str]:
        jobs = []
        for os_name in operating_systems:
            for py in python_versions:
                jobs.append(f"Job: [OS={os_name:<13} | Python={py}]")
        return jobs

versions = ["3.11", "3.12", "3.13"]
os_list = ["ubuntu-latest", "macos-latest"]

all_jobs = MatrixJobScheduler.generate_matrix(versions, os_list)
print(f"Generated {len(all_jobs)} Parallel Matrix Jobs:")
for job in all_jobs:
    print(f" - {job}")
`,
    quiz: {
      id: 'quiz-l5-m7-l3',
      title: 'CI Test Matrix Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the effect of setting `fail-fast: false` in a GitHub Actions matrix strategy?',
          options: [
            { id: 'opt_1', text: 'It ignores test failures and merges the pull request anyway.' },
            { id: 'opt_2', text: 'It allows other matrix jobs to complete even if one job fails, giving full visibility into failures across all OS/Python versions.' },
            { id: 'opt_3', text: 'It skips pip cache downloading.' },
            { id: 'opt_4', text: 'It forces tests to run in single-threaded mode.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'By default, GitHub Actions cancels all remaining in-flight matrix jobs as soon as one fails. Setting `fail-fast: false` ensures all version combinations finish, showing whether an issue is isolated to Python 3.13 or affects all environments.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l4',
    slug: 'build-release-stages',
    module_slug: 'cicd-monitoring-operations',
    title: 'Build and Release Stages: Artifacts and Immutability',
    description: 'Structure pipelines with distinct Build and Release stages. Produce signed, immutable distribution wheels and container images with verifiable Git provenance.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Separate the **Build Stage** (compiling wheels/images) from the **Release Stage** (deploying artifacts).
2. Generate immutable release tags tied directly to Git commit SHAs.
3. Understand Software Bill of Materials (SBOM) and container provenance signing (Sigstore / Cosign).
4. Archive build artifacts in CI to enable deterministic redeployments.

---

### The Build Once, Deploy Many Paradigm

A critical rule of enterprise continuous delivery is:
> **Never rebuild the artifact for different deployment targets.**

\`\`\`
  [ Commit: a1b2c3d ]
          │
          ▼
    [ Build Job ] ──(compiles wheel / builds docker image)──> Artifact: myapp:a1b2c3d
          │
          ├─────────────────────────┬─────────────────────────┐
          ▼                         ▼                         ▼
  [ Staging Release ]       [ UAT Release ]          [ Production Release ]
  (Runs myapp:a1b2c3d       (Runs myapp:a1b2c3d      (Runs myapp:a1b2c3d
   with Staging ENV)         with UAT ENV)            with Prod ENV)
\`\`\`

Why rebuilding per environment is dangerous:
- If you build an image for Staging at 10:00 AM and rebuild for Production at 3:00 PM, an upstream dependency might release a minor patch in the interim, producing a subtly different image in production that was never tested in staging!

---

### Release Tagging Conventions

- **Git Commit SHA Tags**: Every artifact is tagged with \`myapp:\${GITHUB_SHA::7}\` (e.g. \`myapp:a1b2c3d\`). This provides a 100% auditable link to the exact source commit.
- **Semantic Release Tags**: Production releases also carry \`myapp:v2.4.1\`.
- **The \`:latest\` Anti-Pattern**: Never deploy \`:latest\` in production. It is a mutable pointer that breaks rollback determinism.
`,
    interactive_code: `class ArtifactReleaseModel:
    """Demonstrates artifact provenance and immutability tracking across deployment tiers."""
    
    def __init__(self, commit_sha: str, version: str):
        self.commit_sha = commit_sha
        self.version = version
        self.immutable_digest = f"sha256:{hash(commit_sha + version) & 0xffffffffffff:012x}"
        self.image_tag = f"myapp:{version}-{commit_sha[:7]}"
        
    def deploy_to_tier(self, tier_name: str, env_vars: dict) -> dict:
        return {
            "tier": tier_name,
            "image_tag": self.image_tag,
            "digest": self.immutable_digest,
            "database_target": env_vars.get("DATABASE_HOST"),
            "status": f"Deployed verified artifact {self.image_tag} to {tier_name} successfully."
        }

artifact = ArtifactReleaseModel(commit_sha="a1b2c3d4e5f6", version="v2.4.0")
print(f"Built Immutable Artifact: {artifact.image_tag}")
print(f"Cryptographic Digest:    {artifact.digest}\\n")

staging_deploy = artifact.deploy_to_tier("Staging", {"DATABASE_HOST": "staging-db.internal"})
print(staging_deploy["status"])

prod_deploy = artifact.deploy_to_tier("Production", {"DATABASE_HOST": "prod-db-cluster.internal"})
print(prod_deploy["status"])
`,
    quiz: {
      id: 'quiz-l5-m7-l4',
      title: 'Build and Release Stages Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should you deploy the exact same container image artifact to both Staging and Production instead of rebuilding the image for Production?',
          options: [
            { id: 'opt_1', text: 'Docker will charge double for images built twice.' },
            { id: 'opt_2', text: 'Rebuilding introduces the risk of subtle dependency changes or compiler variations, meaning production runs untested code.' },
            { id: 'opt_3', text: 'Python packages cannot be installed more than once per day.' },
            { id: 'opt_4', text: 'Operating systems prohibit tagging images with Git commit hashes.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Building once and promoting the identical artifact guarantees that the exact binary that passed staging tests is what executes in production, eliminating dependency drift between environments.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l5',
    slug: 'environment-specific-deployment',
    module_slug: 'cicd-monitoring-operations',
    title: 'Environment-Specific Deployment and Ephemeral Preview Environments',
    description: 'Architect multi-tier promotion pipelines (Dev, Staging, Production) and spin up automated ephemeral preview environments for pull requests.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Design multi-tier deployment environments: Development, Staging, and Production.
2. Implement **Ephemeral Preview Environments** for pull requests to enable automated integration testing and stakeholder reviews.
3. Isolate environment secrets and network boundaries.
4. Clean up ephemeral preview resources automatically upon pull request closure to prevent cloud billing leaks.

---

### The Evolution of Deployment Environments

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │             Standard Multi-Tier Pipeline               │
   └────────────────────────────────────────────────────────┘

    [ Local Dev ]  ──> Docker Compose with local mocks
           │
           ▼
    [ PR Preview]  ──> Ephemeral Container spun up per Pull Request (e.g. pr-142.app.internal)
           │           Destroyed automatically when PR closes!
           ▼
    [ Staging ]    ──> Mirrors Production topology; pre-release validation
           │
           ▼
    [ Production ] ──> Live customer traffic with high-availability clustering
\`\`\`

---

### Ephemeral Environments in Action

When a developer opens a pull request:
1. CI builds the container image \`myapp:pr-142\`.
2. A lightweight Kubernetes namespace or serverless container is spun up at \`https://pr-142.preview.revoraa.dev\`.
3. QA engineers and product managers test the live feature against an isolated, throwaway database.
4. When the PR is merged or closed, a webhook cleans up all containers and database schemas automatically.
`,
    interactive_code: `class EnvironmentManager:
    """Simulates lifecycle management of ephemeral PR environments."""
    
    def __init__(self):
        self.active_environments = {}
        
    def create_preview_environment(self, pr_number: int, commit_sha: str) -> str:
        env_url = f"https://pr-{pr_number}.preview.internal"
        self.active_environments[pr_number] = {
            "url": env_url,
            "commit": commit_sha,
            "status": "HEALTHY"
        }
        return env_url
        
    def teardown_preview_environment(self, pr_number: int) -> bool:
        if pr_number in self.active_environments:
            del self.active_environments[pr_number]
            return True
        return False

mgr = EnvironmentManager()
url = mgr.create_preview_environment(pr_number=88, commit_sha="7f8a9b1")
print(f"Ephemeral PR environment provisioned: {url}")
print(f"Active environments: {list(mgr.active_environments.keys())}")

mgr.teardown_preview_environment(pr_number=88)
print(f"PR #88 merged/closed. Active environments remaining: {list(mgr.active_environments.keys())}")
`,
    quiz: {
      id: 'quiz-l5-m7-l5',
      title: 'Deployment Environments Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary benefit of deploying Ephemeral Preview Environments for Pull Requests?',
          options: [
            { id: 'opt_1', text: 'It completely replaces the need for local code editors.' },
            { id: 'opt_2', text: 'It allows end-to-end testing of features in an isolated live environment before code is merged into the mainline trunk.' },
            { id: 'opt_3', text: 'It removes the need to store data in external databases.' },
            { id: 'opt_4', text: 'It increases GitHub storage limits.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Ephemeral preview environments spin up realistic, isolated instances of the application per PR, enabling developers, QA testers, and product managers to verify changes before they land on trunk.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l6',
    slug: 'secret-management-ci',
    module_slug: 'cicd-monitoring-operations',
    title: 'Secret Management in CI and OIDC Identity Federation',
    description: 'Eliminate long-lived cloud credentials in CI pipelines using OpenID Connect (OIDC) identity federation and protect secrets from fork pull requests.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand the security risks of long-lived cloud credentials (e.g., permanent \`AWS_ACCESS_KEY_ID\`) stored in CI.
2. Implement passwordless authentication using **OpenID Connect (OIDC)** identity tokens.
3. Prevent secret exfiltration from untrusted pull requests originating from repository forks.
4. Configure CI secret masking and audit logs for sensitive parameter injection.

---

### The Risk of Long-Lived Cloud Credentials

In legacy CI workflows, teams created an IAM User in AWS or GCP, generated an access key and secret key, and pasted them into GitHub Repository Secrets:
- Keys were often over-privileged (\`AdministratorAccess\`).
- Keys were never rotated.
- If an attacker compromised an npm/pip build dependency or exploited an injection vulnerability in a CI script, the permanent keys were exfiltrated, leading to catastrophic cloud account breaches.

---

### The Modern Standard: OIDC Identity Federation

With OpenID Connect (OIDC), your CI workflow requests a short-lived cryptographic JWT token directly from GitHub:
1. GitHub Actions issues a signed JWT token containing claims (\`sub: repo:org/repo:ref:refs/heads/main\`).
2. The CI job presents this token to AWS Security Token Service (STS) or Google Cloud Workload Identity.
3. The cloud provider validates GitHub's cryptographic signature and issues **temporary credentials valid for 15 minutes**.
4. Zero static passwords or keys exist in your repository!

\`\`\`yaml
# GitHub Actions with OIDC
permissions:
  id-token: write # Mandatory for requesting OIDC token
  contents: read

steps:
  - name: Configure AWS Credentials with OIDC
    uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789012:role/GitHubDeployRole
      aws-region: us-east-1
      # No static access keys required!
\`\`\`
`,
    interactive_code: `class OIDCFederationSimulator:
    """Simulates how GitHub Actions exchanges an OIDC token for short-lived cloud credentials."""
    
    @staticmethod
    def exchange_token(repo: str, branch: str) -> dict:
        # Validate repository trust boundary
        if repo != "org/production-app" or branch != "refs/heads/main":
            return {
                "authenticated": False,
                "error": "OIDC Trust Policy Rejected: Only commits on 'main' branch are authorized to assume deploy role."
            }
            
        return {
            "authenticated": True,
            "session_token": "sts_temp_token_8a9b7c",
            "expires_in_minutes": 15,
            "message": "Temporary 15-minute STS credentials issued cleanly via OIDC. Zero static secrets stored!"
        }

# Untrusted PR from feature branch
untrusted = OIDCFederationSimulator.exchange_token("org/production-app", "refs/heads/feature-x")
print(f"Untrusted Branch Attempt: {untrusted['error']}")

# Authorized commit on main
authorized = OIDCFederationSimulator.exchange_token("org/production-app", "refs/heads/main")
print(f"Main Branch Attempt:     {authorized['message']}")
`,
    quiz: {
      id: 'quiz-l5-m7-l6',
      title: 'CI Secret Management Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary security advantage of using OpenID Connect (OIDC) over long-lived IAM access keys in CI pipelines?',
          options: [
            { id: 'opt_1', text: 'OIDC runs builds twice as fast.' },
            { id: 'opt_2', text: 'OIDC issues temporary, short-lived credentials dynamically, eliminating the need to store static, long-lived cloud keys in CI secrets.' },
            { id: 'opt_3', text: 'OIDC encrypts the entire Git history of the project.' },
            { id: 'opt_4', text: 'OIDC replaces the need for Docker base images.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'OIDC establishes cryptographic trust between GitHub and cloud providers, granting temporary credentials valid for minutes. This eliminates static, un-rotated access keys that could otherwise be compromised.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l7',
    slug: 'application-logging',
    module_slug: 'cicd-monitoring-operations',
    title: 'Structured Application Logging and Correlation IDs',
    description: 'Implement structured JSON logging with correlation IDs, contextual metadata, and high-performance log handlers for enterprise distributed tracing.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Transition from human-oriented unstructured strings to machine-parsable **Structured JSON Logging**.
2. Propagate **Correlation IDs (Request IDs)** across asynchronous boundaries and microservice hops.
3. Understand standard log levels (\`DEBUG\`, \`INFO\`, \`WARNING\`, \`ERROR\`, \`CRITICAL\`) and their operational meanings.
4. Prevent multi-line traceback splintering in centralized log aggregation platforms.

---

### The Problem with Unstructured Logs

\`\`\`
# Unstructured human-formatted log:
2026-10-10 14:21:05 [INFO] User 4821 processed checkout for $49.00
\`\`\`
To query this in Datadog or Elasticsearch:
- You must write complex, brittle regular expressions to parse \`User (?P<user_id>\\d+)\`.
- If an engineer changes the message wording to "Checkout completed for user 4821", all monitoring alerts and dashboards instantly break!

---

### Structured JSON Logging: The Cloud Standard

\`\`\`json
{
  "timestamp": "2026-10-10T14:21:05.182Z",
  "level": "INFO",
  "logger": "app.services.checkout",
  "message": "Checkout order processed",
  "request_id": "req-7f89a2b",
  "user_id": 4821,
  "amount_usd": 49.00,
  "duration_ms": 142.5
}
\`\`\`
Every field is an indexable attribute. You can instantly filter: \`@amount_usd > 100 AND @duration_ms > 500\`.

---

### The Power of Correlation IDs

In a distributed system, a single user request might touch:
1. API Gateway
2. Python Web Service
3. Background Worker Queue
4. Payment Processor

By attaching a unique \`X-Request-ID\` (Correlation ID) upon ingress and logging it on every operation, engineers can paste that single UUID into a log aggregator and view the complete, chronological trace across all services.
`,
    interactive_code: `import json
import uuid
import datetime

class StructuredLogger:
    """Produces machine-readable JSON logs enriched with correlation IDs."""
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        
    def log(self, level: str, message: str, request_id: str, **kwargs) -> str:
        record = {
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": level.upper(),
            "service": self.service_name,
            "request_id": request_id,
            "message": message,
            **kwargs
        }
        return json.dumps(record)

logger = StructuredLogger(service_name="payment-service")
req_id = str(uuid.uuid4())[:8]

# Log operational event
json_output = logger.log(
    level="INFO",
    message="Charging customer payment card",
    request_id=req_id,
    customer_id="cust_982",
    amount_cents=4900,
    gateway="stripe"
)

print("Emitted Log Event:")
print(json_output)
`,
    quiz: {
      id: 'quiz-l5-m7-l7',
      title: 'Application Logging Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the purpose of attaching a Correlation ID (Request ID) to every log record in a Python application?',
          options: [
            { id: 'opt_1', text: 'To encrypt log lines before saving them to disk.' },
            { id: 'opt_2', text: 'To trace a single user request across multiple asynchronous tasks, functions, and services in centralized log viewers.' },
            { id: 'opt_3', text: 'To bypass Python logging formatters.' },
            { id: 'opt_4', text: 'To automatically delete logs older than 7 days.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'A Correlation ID provides a unique trace identifier for an entire request lifecycle. When errors occur, querying by the Correlation ID retrieves all associated log entries across workers and microservices in exact chronological order.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l8',
    slug: 'metrics-observability-fundamentals',
    module_slug: 'cicd-monitoring-operations',
    title: 'Metrics and Observability Fundamentals: RED Method and Prometheus',
    description: 'Implement service metrics using Prometheus primitives: Counters, Gauges, and Histograms. Apply the RED method (Rate, Errors, Duration) for service health.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Contrast the **Three Pillars of Observability**: Logs, Metrics, and Traces.
2. Master the **RED Method** for request-driven services: **Rate**, **Errors**, and **Duration**.
3. Implement the primary Prometheus metric types in Python: **Counter**, **Gauge**, and **Histogram**.
4. Configure standard metric scraping endpoints (\`/metrics\`).

---

### The Three Pillars of Observability

| Pillar | Characteristics | Best Used For |
| :--- | :--- | :--- |
| **Metrics** | Numeric values aggregated over time intervals (e.g. 500 req/sec, 42MB RAM). | **Real-time alerting & dashboards.** Cheap to store; instant computation. |
| **Logs** | Discrete event records with rich text and metadata. | **Root-cause investigation.** Diagnosing why a specific transaction failed. |
| **Traces** | End-to-end request timing waterfall graphs showing latency per function/call. | **Latency debugging.** Finding bottlenecks in distributed systems. |

---

### The RED Method for Web Services

For any web API or service, alert on:
1. **Rate**: The number of requests your service handles per second.
2. **Errors**: The number of requests that fail (e.g. HTTP 5xx responses).
3. **Duration**: The latency distribution (p50, p95, p99) of requests.

---

### Prometheus Metric Types

- **Counter**: A monotonically increasing number (only goes up, resets to 0 on restart). Example: \`http_requests_total\`.
- **Gauge**: A numerical value that can go up and down. Example: \`active_db_connections\`, \`memory_usage_bytes\`.
- **Histogram**: Samples observations into configurable buckets to calculate percentiles (p95, p99). Example: \`http_request_duration_seconds\`.
`,
    interactive_code: `class MockPrometheusMetrics:
    """Demonstrates Prometheus metric types: Counter, Gauge, and Histogram."""
    
    def __init__(self):
        self.request_counter = 0
        self.active_gauge = 0
        self.duration_samples = []
        
    def record_request(self, duration_ms: float, is_error: bool = False):
        self.request_counter += 1
        self.duration_samples.append(duration_ms)
        
    def get_summary(self) -> dict:
        sorted_durations = sorted(self.duration_samples)
        n = len(sorted_durations)
        p95_idx = int(0.95 * n)
        p95 = sorted_durations[p95_idx] if n > 0 else 0
        
        return {
            "total_requests": self.request_counter,
            "avg_latency_ms": sum(self.duration_samples) / n if n > 0 else 0,
            "p95_latency_ms": p95,
        }

metrics = MockPrometheusMetrics()
# Simulate 100 requests
for i in range(100):
    metrics.record_request(duration_ms=10.0 + (i * 0.8))

summary = metrics.get_summary()
print("Prometheus RED Metrics Summary:")
print(f"Total Requests (Counter): {summary['total_requests']}")
print(f"Average Latency:           {summary['avg_latency_ms']:.1f}ms")
print(f"95th Percentile (p95):     {summary['p95_latency_ms']:.1f}ms")
`,
    quiz: {
      id: 'quiz-l5-m7-l8',
      title: 'Metrics Observability Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What are the three core signals tracked in the RED method for web service observability?',
          options: [
            { id: 'opt_1', text: 'Requests, Exceptions, Deployments' },
            { id: 'opt_2', text: 'Rate, Errors, Duration' },
            { id: 'opt_3', text: 'RAM, Ethernet, Disk' },
            { id: 'opt_4', text: 'Reliability, Efficiency, Durability' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The RED method focuses on Rate (throughput in requests/sec), Errors (number of failed requests/sec), and Duration (latency distribution of requests).'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l9',
    slug: 'health-checks-readiness-probes',
    module_slug: 'cicd-monitoring-operations',
    title: 'Health Checks and Readiness Probes: Liveness vs Readiness',
    description: 'Differentiate between liveness probes (/healthz) and readiness probes (/readyz). Prevent dropped traffic during database failovers and container cold starts.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Differentiate **Liveness Probes** (\`/healthz\`) from **Readiness Probes** (\`/readyz\`).
2. Understand what happens when each probe fails in container orchestrators.
3. Avoid the catastrophic "Cascading Restart Storm" anti-pattern in liveness probes.
4. Implement graceful readiness checks that verify database and cache connectivity before accepting traffic.

---

### The Fundamental Difference

| Probe | URL Convention | Question it Answers | Action Taken on Failure |
| :--- | :--- | :--- | :--- |
| **Liveness** | \`/healthz\` / \`/live\` | "Is the Python process still alive and not deadlocked?" | **Kills the container** and restarts it. |
| **Readiness** | \`/readyz\` / \`/ready\` | "Is the service ready to handle incoming user traffic right now?" | **Removes container from load balancer routing pool** (does NOT kill it). |

---

### The Catastrophic "Liveness Ping Database" Anti-Pattern

\`\`\`python
# ❌ DANGEROUS DISASTER PATTERN
@app.get("/healthz") # Liveness Probe
async def liveness_check(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1")) # Pings database!
    return {"status": "ok"}
\`\`\`

**Why this destroys production clusters**:
1. Your database experiences a temporary latency spike or connection pool saturation.
2. The liveness probe times out across all 20 running Python web containers.
3. The orchestrator concludes all 20 containers are dead and **kills all 20 containers simultaneously**!
4. All 20 new containers boot up at the exact same moment and flood the already-struggling database with hundreds of new connection handshakes!
5. This creates an unrecoverable **cascading outage**.

**The Rule**:
- **Liveness probe (\`/healthz\`)**: Must be lightweight and test *only* internal process health (event loop responsiveness, no deadlock). **Never check downstream databases in liveness probes!**
- **Readiness probe (\`/readyz\`)**: Checks downstream dependencies (PostgreSQL, Redis). If the DB is down, the readiness probe fails, pulling the instance out of traffic routing *without restarting the process*.
`,
    interactive_code: `class HealthProbeEngine:
    """Demonstrates separate Liveness and Readiness probe evaluations."""
    
    def __init__(self, is_event_loop_stuck: bool, is_database_connected: bool):
        self.is_event_loop_stuck = is_event_loop_stuck
        self.is_database_connected = is_database_connected
        
    def check_liveness(self) -> dict:
        # Liveness: Checks only internal process state!
        if self.is_event_loop_stuck:
            return {"status_code": 500, "action": "KILL_AND_RESTART", "reason": "Process deadlocked"}
        return {"status_code": 200, "action": "MAINTAIN_RUNNING", "status": "ALIVE"}
        
    def check_readiness(self) -> dict:
        # Readiness: Checks if ready to serve traffic
        if not self.is_database_connected:
            return {"status_code": 503, "action": "REMOVE_FROM_LOAD_BALANCER", "reason": "Database unreachable"}
        return {"status_code": 200, "action": "ROUTE_TRAFFIC", "status": "READY"}

# Scenario: Database outage, but Python process is running normally
probe = HealthProbeEngine(is_event_loop_stuck=False, is_database_connected=False)
live_res = probe.check_liveness()
ready_res = probe.check_readiness()

print(f"Liveness Check:  [{live_res['status_code']}] -> {live_res['action']}")
print(f"Readiness Check: [{ready_res['status_code']}] -> {ready_res['action']} ({ready_res['reason']})")
`,
    quiz: {
      id: 'quiz-l5-m7-l9',
      title: 'Health Checks Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should downstream database connectivity be checked in the Readiness probe (/readyz) rather than the Liveness probe (/healthz)?',
          options: [
            { id: 'opt_1', text: 'Readiness probes execute over UDP, which is faster.' },
            { id: 'opt_2', text: 'If a database has a temporary outage, a failing liveness probe causes the orchestrator to forcibly restart all containers, triggering a cascading restart storm.' },
            { id: 'opt_3', text: 'Liveness probes are only supported in Python 2.' },
            { id: 'opt_4', text: 'The Linux kernel forbids SQL queries inside HTTP handlers.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Liveness probe failures trigger container restarts. If database connectivity is checked in liveness, a database blip will cause all containers in the cluster to restart simultaneously, overwhelming the database upon boot and creating a cascading outage.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l10',
    slug: 'error-reporting-incident-diagnosis',
    module_slug: 'cicd-monitoring-operations',
    title: 'Error Reporting and Incident Diagnosis: Sentry Integration',
    description: 'Integrate real-time crash reporting with Sentry. Capture contextual breadcrumbs, stack traces, release tags, and scrub sensitive PII from reports.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Integrate automated error tracking platforms (e.g., Sentry) into Python web services and background workers.
2. Group exceptions intelligently by stack trace signatures.
3. Capture contextual **breadcrumbs** (HTTP requests, DB queries, UI clicks) preceding an error.
4. Sanitize and scrub Personally Identifiable Information (PII) before errors leave the application boundary.

---

### Sentry Integration in Python

\`\`\`python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.environ["SENTRY_DSN"],
    environment=os.environ.get("ENVIRONMENT", "production"),
    release=os.environ.get("GIT_COMMIT_SHA", "v2.4.0"),
    # Capture 10% of transactions for performance tracing
    traces_sample_rate=0.1,
    # Automatically scrub PII
    send_default_pii=False,
)
\`\`\`

---

### The Power of Breadcrumbs

When a user triggers an uncaught \`IndexError\`, the stack trace shows where the crash occurred. But it does not explain *why* the data was in an invalid state.

**Breadcrumbs** record the chronological sequence of events leading up to the crash:
1. \`[14:02:10] HTTP GET /api/v1/orders/8192 [200 OK]\`
2. \`[14:02:11] DB Query: SELECT * FROM inventory WHERE item_id=902 [Found 0 rows]\`
3. \`[14:02:12] User clicked [Submit Payment]\`
4. \`[14:02:12] CRASH: IndexError: list index out of range\`

Engineers can immediately reproduce the exact user flow without guessing.
`,
    interactive_code: `class MockSentryScrubber:
    """Demonstrates scrubbing sensitive PII and authentication tokens from error reports."""
    
    SENSITIVE_KEYS = {"password", "token", "ssn", "credit_card", "authorization"}
    
    @classmethod
    def scrub_event(cls, event: dict) -> dict:
        sanitized = {}
        for k, v in event.items():
            if k.lower() in cls.SENSITIVE_KEYS:
                sanitized[k] = "[FILTERED_PII]"
            elif isinstance(v, dict):
                sanitized[k] = cls.scrub_event(v)
            else:
                sanitized[k] = v
        return sanitized

raw_error_payload = {
    "exception": "KeyError: 'user_profile'",
    "user_id": 9821,
    "email": "user@example.com",
    "authorization": "Bearer eyJhbGciOiJIUzI1Ni...",
    "password": "SuperSecretPassword123!"
}

scrubbed = MockSentryScrubber.scrub_event(raw_error_payload)
print("Sanitized Sentry Error Payload:")
for k, v in scrubbed.items():
    print(f"  {k:<14}: {v}")
`,
    quiz: {
      id: 'quiz-l5-m7-l10',
      title: 'Incident Diagnosis Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'In modern error-reporting tools like Sentry, what is the purpose of "breadcrumbs"?',
          options: [
            { id: 'opt_1', text: 'To delete old database records automatically.' },
            { id: 'opt_2', text: 'To record the trail of operations, queries, and HTTP requests that occurred immediately prior to an exception.' },
            { id: 'opt_3', text: 'To encrypt network packets across public subnets.' },
            { id: 'opt_4', text: 'To measure CPU clock speed during test runs.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Breadcrumbs provide a timeline of user actions, database queries, and system events leading up to a crash, making it straightforward to diagnose what caused the application to enter a faulty state.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l11',
    slug: 'dependency-update-workflows',
    module_slug: 'cicd-monitoring-operations',
    title: 'Automated Dependency Update Workflows: Dependabot and Renovate',
    description: 'Automate dependency maintenance using Dependabot and Renovate. Safely merge automated security updates using automated PR qualification tests.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Configure automated dependency management tools (**Dependabot**, **Renovate**).
2. Automate security alerts and patch pull requests for CVE vulnerabilities.
3. Configure grouping strategies to prevent PR noise and notification fatigue.
4. Implement automated merge gates for patch updates with passing test suites.

---

### The Dependabot Configuration: \`.github/dependabot.yml\`

\`\`\`yaml
version: 2
updates:
  # Python dependencies in pyproject.toml / requirements.txt
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        patterns:
          - "pytest*"
          - "ruff*"
          - "mypy*"

  # GitHub Actions workflows
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
\`\`\`

---

### Handling Dependency Update Noise

Without grouping rules:
- Updating 20 dependencies produces 20 individual pull requests.
- CI runs 20 parallel matrix builds, running up compute bills.
- Engineers experience review fatigue and start ignoring dependency PRs altogether.

**Best Practice**:
- Group development tools (\`ruff\`, \`mypy\`, \`pytest\`) into a single batch PR.
- Keep production dependencies isolated so regression testing can be evaluated independently.
`,
    interactive_code: `class DependencyUpdateTriage:
    """Evaluates automated dependency pull requests for risk level."""
    
    @staticmethod
    def evaluate_update(pkg: str, old_v: str, new_v: str, is_security_cve: bool) -> dict:
        old_parts = [int(x) for x in old_v.split(".")]
        new_parts = [int(x) for x in new_v.split(".")]
        
        is_major = new_parts[0] > old_parts[0]
        is_minor = new_parts[1] > old_parts[1]
        
        if is_security_cve:
            priority = "URGENT (CVE Patch)"
            action = "Fast-track merge after CI passes."
        elif is_major:
            priority = "HIGH_RISK (Breaking Change)"
            action = "Manual architectural review required for API breaking changes."
        elif is_minor:
            priority = "MEDIUM (Feature Release)"
            action = "Automated test suite review."
        else:
            priority = "LOW (Bug Fix Patch)"
            action = "Candidate for automated merge if tests green."
            
        return {"pkg": pkg, "priority": priority, "action": action}

print(DependencyUpdateTriage.evaluate_update("pydantic", "1.10.8", "2.0.0", False))
print(DependencyUpdateTriage.evaluate_update("cryptography", "41.0.1", "41.0.2", True))
`,
    quiz: {
      id: 'quiz-l5-m7-l11',
      title: 'Dependency Updates Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should development dependencies (like ruff, mypy, pytest) be grouped in Dependabot/Renovate configurations?',
          options: [
            { id: 'opt_1', text: 'To avoid generating dozens of individual PRs and reduce developer notification fatigue.' },
            { id: 'opt_2', text: 'Because pip cannot install tools individually.' },
            { id: 'opt_3', text: 'To prevent Python from compiling bytecode.' },
            { id: 'opt_4', text: 'GitHub Actions only supports one PR per month.' }
          ],
          correct_option_ids: ['opt_1'],
          explanation: 'Grouping non-critical dev dependencies bundles updates into a single PR, reducing pull request noise and conserving CI runner minutes.'
        }
      ]
    }
  },
  {
    id: 'l5-m7-l12',
    slug: 'operational-runbooks-maintenance',
    module_slug: 'cicd-monitoring-operations',
    title: 'Operational Runbooks, Incident Response, and Blameless Postmortems',
    description: 'Write effective operational runbooks, organize on-call incident response, and conduct blameless postmortems with actionable Root Cause Analysis (RCA).',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Author clear, actionable **Operational Runbooks** for production triage.
2. Structure incident severity classifications (SEV-1 Critical Outage to SEV-3 Minor Bug).
3. Foster a **Blameless Engineering Culture** focused on systemic resilience.
4. Conduct Root Cause Analysis (RCA) and generate preventive action items.

---

### The Structure of a High-Quality Runbook

When an engineer is paged at 3:00 AM, they should not have to guess how to diagnose or mitigate an issue.
Every alert must link directly to a runbook with:
1. **Alert Summary**: What triggered the page (e.g. \`HighDatabaseConnectionCount\`).
2. **Impact**: What users are experiencing (e.g. API latency > 5s, HTTP 504 errors).
3. **Immediate Mitigation**: Quick steps to stop the bleeding (e.g. scaling up read replicas, recycling worker pool).
4. **Diagnostic Commands**: Specific queries or logs to inspect.
5. **Escalation Path**: Who to contact if mitigation fails after 15 minutes.

---

### The Blameless Postmortem Culture

In high-performing engineering organizations (Etsy, Google, Netflix), incidents are viewed as learning opportunities:
- **Never blame individuals**: Asking "Who made this mistake?" encourages engineers to hide bugs and avoid touching legacy code.
- **Inspect systemic causes**: Ask "Why did our CI pipeline allow this syntax error to merge? Why did our staging environment lack this load profile? Why did our canary deployment not catch this regression automatically?"
`,
    interactive_code: `class IncidentPostmortemGenerator:
    """Generates a blameless postmortem template with actionable preventative measures."""
    
    @staticmethod
    def generate_report(incident_title: str, duration_minutes: int, root_cause: str, systemic_fixes: list[str]) -> str:
        report = [
            f"=== BLAMELESS POSTMORTEM: {incident_title.upper()} ===",
            f"Duration: {duration_minutes} minutes",
            f"Root Cause Analysis (Systemic): {root_cause}",
            "\\nAction Items (Prevent Recurrence):"
        ]
        for idx, fix in enumerate(systemic_fixes, 1):
            report.append(f"  {idx}. {fix}")
        return "\\n".join(report)

fixes = [
    "Add connection pool saturation alert at 80% capacity in Datadog.",
    "Implement circuit breaker pattern in payment service to fail fast on DB drop.",
    "Introduce automated load testing step in weekly release pipeline."
]

postmortem = IncidentPostmortemGenerator.generate_report(
    incident_title="Database Connection Pool Exhaustion Outage",
    duration_minutes=24,
    root_cause="Sudden 10x traffic spike from marketing campaign saturated 100 max connections.",
    systemic_fixes=fixes
)
print(postmortem)
`,
    quiz: {
      id: 'quiz-l5-m7-l12',
      title: 'Runbooks and Operations Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the core philosophy of a "Blameless Postmortem"?',
          options: [
            { id: 'opt_1', text: 'To identify and reprimand the engineer who committed the breaking code.' },
            { id: 'opt_2', text: 'To focus on systemic vulnerabilities, process gaps, and missing automated safeguards rather than assigning individual fault.' },
            { id: 'opt_3', text: 'To delete all incident logs so stakeholders do not worry.' },
            { id: 'opt_4', text: 'To cancel all future code deployments.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Blameless postmortems operate on the premise that human error is inevitable in complex systems. By analyzing systemic and tooling weaknesses, teams build safeguards that prevent entire classes of future failures.'
        }
      ]
    }
  }
];
