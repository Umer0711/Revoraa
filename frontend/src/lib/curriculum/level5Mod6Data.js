// Module 6: Docker and Deployment Fundamentals (12 Lessons)
// Covers deployment lifecycles, dev/prod parity, PID 1 signal propagation, Dockerfiles,
// multi-stage builds, runtime config, port binding, volumes, container logging, secrets, and rollbacks.

export const LEVEL_5_MOD_6_LESSONS = [
  {
    id: 'l5-m6-l1',
    slug: 'what-deployment-means',
    module_slug: 'docker-deployment-fundamentals',
    title: 'What Deployment Means in Production',
    description: 'Understand the transition from local Python development to ephemeral production targets, immutable infrastructure, and the Cattle vs Pets paradigm.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Define the fundamental meaning of software deployment in modern cloud engineering.
2. Differentiate between "Pets" (manually patched legacy servers) and "Cattle" (disposable, immutable container instances).
3. Trace the software lifecycle: Source Code -> Artifact Build -> Release -> Ephemeral Runtime Instance.
4. Understand how immutable infrastructure prevents "configuration drift" across distributed clusters.

---

### The Evolution of Deployment: From Manual SSH to Immutable Containers

In early software development, "deploying" meant copying scripts via FTP or \`scp\` to a remote server, manually installing packages with \`sudo apt install\`, and restarting a system service. 

This model treats servers as **Pets**:
- Servers are individually named, handcrafted, and lovingly maintained over years.
- When a server gets "sick", engineers spend hours debugging subtle configuration differences, OS library updates, or stale file permissions.
- Inevitably, **configuration drift** occurs: server A runs OpenSSL 1.1.1u, while server B runs OpenSSL 3.0.2, causing intermittent production failures.

Modern cloud engineering treats instances as **Cattle**:
- Servers and containers are identical, numbered, disposable units (e.g., \`worker-7f89c\`, \`worker-7f89d\`).
- If an instance becomes unresponsive or crashes, the orchestrator terminates it without investigation and spawns a fresh, identical instance from a frozen **image artifact**.
- No engineer ever runs \`ssh\` to modify configuration on a live instance. Any bug fix or configuration change produces a new immutable image tag that rolls out progressively.

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │             The Immutable Release Pipeline             │
   └────────────────────────────────────────────────────────┘

    [ Source Code ]  ──(git commit)──>  Commit SHA (e.g. 7f89a2b)
           │
           ▼
    [ Build Stage ]  ──(pip wheel / docker build)──> Immutable Image: app:7f89a2b
           │
           ▼
    [ Release Gate]  ──(inject validated env vars)──> Release Version v2.4.0
           │
           ▼
    [ Run Runtime ]  ──(orchestrator spin up)──> 3x Ephemeral Containers (Cattle)
\`\`\`

---

### Key Tenets of Production Deployment

1. **Artifact Immutability**:
   Once an image or wheel is built and signed in CI, its binary contents never change. The exact same image artifact tested in staging is deployed to production.
2. **Stateless Processes**:
   Container instances are strictly ephemeral. Any local disk storage created during a container's execution will vanish when the container restarts. All durable state must reside in external datastores (PostgreSQL, Redis, S3).
3. **Environment Separation**:
   Code and configuration are strictly decoupled. Staging and production run the identical code artifact, differentiated only by runtime environment variables.

---

### Deterministic Simulation: Deployment Artifact vs Runtime Evaluator

The interactive exercise below demonstrates a deterministic validator evaluating whether a proposed deployment artifact adheres to immutable, stateless production principles.
`,
    interactive_code: `class DeploymentValidator:
    """Evaluates whether an application architecture complies with cloud-native deployment rules."""
    
    @staticmethod
    def audit_architecture(config: dict) -> dict:
        violations = []
        recommendations = []
        
        # Check 1: In-process local disk state
        if config.get("stores_uploads_on_local_disk"):
            violations.append("Violation: Uploads stored on ephemeral container disk. Lost on restart!")
            recommendations.append("Fix: Stream file uploads to S3/GCS object storage bucket.")
            
        # Check 2: Hardcoded environment configs inside image
        if config.get("hardcoded_db_url_in_image"):
            violations.append("Violation: Database credentials baked into container image artifact.")
            recommendations.append("Fix: Inject DATABASE_URL at runtime via secure environment variables.")
            
        # Check 3: Process immutability (in-place patching)
        if config.get("runs_git_pull_in_production"):
            violations.append("Violation: 'git pull' executed on live server (Pet pattern).")
            recommendations.append("Fix: Build immutable Docker image tagged with Git SHA.")
            
        is_cloud_native = len(violations) == 0
        return {
            "is_cloud_native": is_cloud_native,
            "violations": violations,
            "recommendations": recommendations,
            "deployment_model": "Cattle (Immutable)" if is_cloud_native else "Pets (Fragile Drift)"
        }

# Test with a legacy server config
legacy_setup = {
    "stores_uploads_on_local_disk": True,
    "hardcoded_db_url_in_image": True,
    "runs_git_pull_in_production": True,
}

report = DeploymentValidator.audit_architecture(legacy_setup)
print(f"Deployment Model: {report['deployment_model']}")
for v in report["violations"]:
    print(f" - {v}")
`,
    quiz: {
      id: 'quiz-l5-m6-l1',
      title: 'Deployment Principles Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'In the "Cattle vs Pets" DevOps analogy, what characterizes a "Cattle" deployment model?',
          options: [
            { id: 'opt_1', text: 'Servers are uniquely configured, manually patched via SSH, and treated as irreplaceable.' },
            { id: 'opt_2', text: 'Instances are identical, ephemeral, and automatically replaced from an immutable image if they fail.' },
            { id: 'opt_3', text: 'Application source code is pulled directly from GitHub onto production VMs during every request.' },
            { id: 'opt_4', text: 'Persistent state and user database tables are stored directly inside the container root filesystem.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'In the Cattle paradigm, server instances are disposable, identical, and immutable. When a node fails or needs an update, it is terminated and replaced automatically by an orchestrator using an immutable container image.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l2',
    slug: 'dev-vs-prod-environments',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Development vs Production Environments and Parity',
    description: 'Master Factor 10 of the Twelve-Factor App: Dev/Prod Parity. Mitigate drift between local developer machines and cloud production engines.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand Factor 10 of the Twelve-Factor App methodology: **Dev/Prod Parity**.
2. Identify the three dimensions of environment divergence: Time gap, Personnel gap, and Tools gap.
3. Eliminate differences between local backing services (e.g., SQLite vs PostgreSQL) and cloud runtimes.
4. Safely handle environment-specific behaviors without branching business logic on \`if ENV == "prod"\`.

---

### The Three Gaps of Environment Drift

Historical development suffered from severe friction between what worked on a laptop and what broke in production:

| Dimension | Legacy Practice | Modern 12-Factor Practice |
| :--- | :--- | :--- |
| **Time Gap** | Code spent weeks or months waiting for ops deployment. | Continuous Delivery: commits deploy within hours or minutes. |
| **Personnel Gap** | Developers wrote code; system admins deployed it. | Developers own deployment and observability (DevOps ownership). |
| **Tools Gap** | Dev used macOS + SQLite; Prod used Linux + PostgreSQL cluster. | Dev uses Linux containers + identical PostgreSQL container version. |

---

### The "SQLite in Dev, PostgreSQL in Prod" Anti-Pattern

A ubiquitous beginner trap in Python frameworks (like Django or SQLAlchemy) is:
\`\`\`python
# DANGEROUS ANTI-PATTERN
if os.getenv("ENV") == "development":
    engine = create_engine("sqlite:///dev.db")
else:
    engine = create_engine("postgresql+psycopg2://user:pass@db:5432/prod")
\`\`\`

Why this causes catastrophic production outages:
1. **Concurrency and Locking**: SQLite serializes writes with file-level database locking. High-concurrency race conditions and deadlocks never trigger in local testing, but instantly deadlock PostgreSQL under 500 requests/second.
2. **Type Coercion**: SQLite is dynamically typed (you can insert string \`"hello"\` into an \`INTEGER\` column without an error). PostgreSQL will abort the transaction with a strict \`DataError\`.
3. **Dialect Extensions**: JSONB operations, array columns, and \`DISTINCT ON\` clauses behave differently or fail entirely across SQLite and Postgres.

**The Solution**: Run identical Docker containers locally (e.g. \`postgres:16-alpine\`) via local container composition so local development executes against the exact database engine and version used in production.

---

### Safe Configuration Divergence: Feature Flags vs Logic Branching

Never scatter \`if ENV == "production": ...\` across your service domain logic. Instead, abstract environmental divergence into typed settings:

\`\`\`python
# GOOD: Inject behavior via configuration settings, not environment name checks
class Settings(BaseModel):
    DATABASE_URL: str
    DEBUG_SQL_ECHO: bool = False
    EMAIL_BACKEND: Literal["console", "ses"] = "ses"
    ENABLE_RATE_LIMITER: bool = True
\`\`\`
`,
    interactive_code: `from dataclasses import dataclass

@dataclass(frozen=True)
class AppConfig:
    db_engine: str
    db_version: str
    cache_engine: str
    enable_profiler: bool

def audit_dev_prod_parity(dev: AppConfig, prod: AppConfig) -> list[str]:
    """Finds dangerous divergence between local development and production environments."""
    drift_warnings = []
    
    if dev.db_engine != prod.db_engine:
        drift_warnings.append(
            f"CRITICAL DRIFT: Dev uses '{dev.db_engine}' while Prod uses '{prod.db_engine}'. "
            "Dialects, locking semantics, and transactions will behave differently!"
        )
        
    if dev.db_engine == prod.db_engine and dev.db_version != prod.db_version:
        drift_warnings.append(
            f"VERSION DRIFT: Dev uses {dev.db_engine} v{dev.db_version}, "
            f"Prod uses v{prod.db_version}."
        )
        
    if dev.cache_engine != prod.cache_engine:
        drift_warnings.append(
            f"CACHE DRIFT: Dev uses '{dev.cache_engine}' (in-memory) while Prod uses '{prod.cache_engine}'. "
            "Multi-worker cache sharing cannot be verified locally."
        )
        
    return drift_warnings

dev_env = AppConfig("sqlite", "3.40", "memory_dict", True)
prod_env = AppConfig("postgresql", "16.2", "redis", False)

warnings = audit_dev_prod_parity(dev_env, prod_env)
print("Dev/Prod Parity Audit Results:")
for w in warnings:
    print(f"[!] {w}")
`,
    quiz: {
      id: 'quiz-l5-m6-l2',
      title: 'Dev/Prod Parity Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why is using SQLite locally in development and PostgreSQL in production considered a dangerous anti-pattern?',
          options: [
            { id: 'opt_1', text: 'SQLite uses more memory than PostgreSQL for small applications.' },
            { id: 'opt_2', text: 'SQLite and PostgreSQL have different locking semantics, type constraints, and SQL dialects, hiding critical bugs until production.' },
            { id: 'opt_3', text: 'Python cannot install both sqlite3 and psycopg2 in the same virtual environment.' },
            { id: 'opt_4', text: 'PostgreSQL does not support transactions in web applications.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'SQLite has dynamic column typing and file-level write locking, whereas PostgreSQL has strict schema enforcement and row-level locking. Using different engines guarantees that SQL dialect bugs and concurrency deadlocks will only appear in production.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l3',
    slug: 'application-startup-shutdown',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Application Startup and Graceful Shutdown Lifecycle',
    description: 'Master the PID 1 UNIX signal lifecycle in containerized environments. Handle SIGTERM gracefully to drain in-flight requests without dropped connections.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand the lifecycle of a containerized Linux process and the special role of PID 1.
2. Differentiate between UNIX termination signals: \`SIGINT\` (Ctrl+C), \`SIGTERM\` (Graceful Termination), and \`SIGKILL\` (Forced Abort).
3. Implement signal handlers in Python to stop accepting new requests and drain active work within the timeout grace period.
4. Avoid the "shell form" pitfall in Dockerfiles that breaks signal forwarding to Python.

---

### The Anatomy of a Container Shutdown

When an orchestrator (Kubernetes, AWS ECS, Docker Compose) replaces a container during a deployment or auto-scaling event, it follows a strict two-stage process:

1. **Graceful Notice (\`SIGTERM\`)**:
   The orchestrator sends \`SIGTERM\` (Signal 15) to Process ID 1 inside the container.
   - The application stops binding or listening for new incoming connections.
   - The health check status flips to \`503 Service Unavailable\` so upstream load balancers deregister the instance.
   - In-flight database transactions and HTTP requests finish processing.
   - Database connection pools and background thread pools close cleanly.
2. **Hard Termination (\`SIGKILL\`)**:
   The orchestrator starts a countdown (typically 30 seconds, known as the \`terminationGracePeriodSeconds\`). If the container process has not exited when the grace period expires, the kernel issues \`SIGKILL\` (Signal 9).
   - \`SIGKILL\` cannot be caught, handled, or ignored.
   - The process is immediately obliterated, truncating in-flight network sockets and corrupting uncommitted file writes.

\`\`\`
   Orchestrator                    Container (PID 1: Python)             Load Balancer
        │                                      │                               │
        │─── [SIGTERM] ───────────────────────>│                               │
        │                                      │─── HealthCheck: Unhealthy ───>│ (Stops Routing New Req)
        │                                      │                               │
        │                                      ├─── Draining active HTTP reqs  │
        │                                      ├─── Committing open DB txs     │
        │                                      └─── Closing connection pool    │
        │                                      │                               │
        │<── Process Exits Cleanly (Code 0) ───│                               │
        │                                                                      │
        │ (If 30s grace period expires)                                        │
        └─── [SIGKILL] ───────────────────────> ❌ Process Killed Forcibly      │
\`\`\`

---

### The Dockerfile "Shell Form" Pitfall

How you declare your container startup command (\`CMD\` or \`ENTRYPOINT\`) determines whether Python receives \`SIGTERM\`:

\`\`\`dockerfile
# ❌ WRONG: Shell Form
# Docker runs: /bin/sh -c "python app.py"
# /bin/sh becomes PID 1. Standard Linux shells DO NOT forward SIGTERM to child processes!
CMD python app.py

# ✅ CORRECT: Exec Form (JSON Array)
# Docker runs: python app.py directly as PID 1.
# Python intercepts SIGTERM and executes your cleanup handlers!
CMD ["python", "app.py"]
\`\`\`

---

### Implementing Graceful Shutdown in Python
`,
    interactive_code: `import signal
import sys
import time

class GracefulWorker:
    def __init__(self):
        self.is_running = True
        self.active_jobs = 0
        
    def handle_sigterm(self, signum, frame):
        print(f"\\n[SIGNAL] Received signal {signum} (SIGTERM). Initiating graceful draining...")
        self.is_running = False
        
    def run_worker_loop(self, simulated_iterations=3):
        # Register signal handlers
        signal.signal(signal.SIGTERM, self.handle_sigterm)
        signal.signal(signal.SIGINT, self.handle_sigterm)
        
        print("[INIT] Worker started. Ready to process work units.")
        for i in range(simulated_iterations):
            if not self.is_running:
                break
            self.active_jobs += 1
            print(f"[WORK] Processing batch {i + 1} (in-flight: {self.active_jobs})")
            time.sleep(0.01) # Simulated work
            self.active_jobs -= 1
            
            # Simulate receiving SIGTERM after 2 batches
            if i == 1:
                # Trigger handler explicitly for deterministic simulation
                self.handle_sigterm(signal.SIGTERM, None)
                
        print(f"[CLEANUP] Draining complete. In-flight jobs remaining: {self.active_jobs}")
        print("[EXIT] Process exiting with status 0.")

worker = GracefulWorker()
worker.run_worker_loop()
`,
    quiz: {
      id: 'quiz-l5-m6-l3',
      title: 'Startup and Shutdown Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should the exec form `CMD ["python", "app.py"]` be used in a Dockerfile instead of `CMD python app.py`?',
          options: [
            { id: 'opt_1', text: 'The exec form runs faster because Python skips bytecode compilation.' },
            { id: 'opt_2', text: 'The shell form spawns /bin/sh as PID 1, which typically fails to forward SIGTERM signals to the child Python process.' },
            { id: 'opt_3', text: 'The shell form is not supported on Linux systems.' },
            { id: 'opt_4', text: 'The exec form automatically runs the application as root.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'When using the shell form, the command runs inside `/bin/sh -c`, making `/bin/sh` PID 1. Shells do not automatically propagate UNIX signals like SIGTERM to child processes, preventing Python from running graceful cleanup handlers before SIGKILL triggers.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l4',
    slug: 'docker-container-fundamentals',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Docker and Container Fundamentals',
    description: 'Demystify containers from the ground up: Linux namespaces, cgroups, layered root filesystems, and how container isolation differs from virtual machines.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand what a container actually is: an isolated process on a shared Linux kernel.
2. Contrast Virtual Machines (Hypervisors, guest operating systems) with Containers (Process-level isolation).
3. Identify the core Linux kernel primitives powering containers: **Namespaces**, **Control Groups (cgroups)**, and **chroot/pivot_root**.
4. Learn how container filesystem layering prevents data duplication across running services.

---

### What is a Container? (Virtual Machine vs Container)

A container is **not** a lightweight Virtual Machine. It does not run a guest kernel, virtual BIOS, or virtualized hardware drivers. A container is simply a standard Linux process isolated by the host kernel:

\`\`\`
  ┌─────────────────────────┐          ┌─────────────────────────┐
  │   Virtual Machine       │          │   Docker Container      │
  ├─────────────────────────┤          ├─────────────────────────┤
  │ App Code & Python Deps  │          │ App Code & Python Deps  │
  ├─────────────────────────┤          ├─────────────────────────┤
  │ Full Guest OS (Ubuntu)  │          │ Rootfs (Debian / Alpine)│
  ├─────────────────────────┤          ├─────────────────────────┤
  │ Virtual Hardware / BIOS │          │ Linux Kernel (Shared)   │
  ├─────────────────────────┤          │  [Namespaces + Cgroups] │
  │ Hypervisor (KVM/VMware) │          ├─────────────────────────┤
  ├─────────────────────────┤          │ Host OS & Hardware      │
  │ Host OS & Hardware      │          └─────────────────────────┘
  └─────────────────────────┘
\`\`\`

---

### The Three Linux Primitives Behind Containers

1. **Namespaces (Isolation - "What the process can see")**:
   - \`pid\`: The container process believes it is PID 1, even if its host PID is 48219.
   - \`net\`: Gives the container its own virtual network interface (\`eth0\`), IP address, and port space.
   - \`mnt\`: Mounts an isolated filesystem tree so the container cannot browse the host's \`/etc\` or \`/home\`.
   - \`user\`: Maps container UID 0 (root inside container) to an unprivileged non-root UID on the host for defense-in-depth.
2. **Control Groups / cgroups (Resource Limits - "How much the process can use")**:
   - Caps CPU utilization (e.g. max 2 CPU cores).
   - Enforces memory thresholds (e.g. 512MB RAM). When a Python process exceeds its cgroup memory limit, the Linux kernel OOM Killer immediately terminates it with **Exit Code 137**.
3. **Layered Union Filesystems (OverlayFS)**:
   - Base images (e.g. \`python:3.12-slim\`) are read-only layers shared among all containers on the host.
   - Each running container adds a tiny, thin read-write layer on top, consuming almost zero additional disk space upon boot.
`,
    interactive_code: `class ContainerSandboxModel:
    """Simulates how Linux namespaces and cgroups govern a Python container process."""
    
    def __init__(self, host_pid: int, ram_limit_mb: int):
        self.host_pid = host_pid
        self.container_pid = 1  # Process sees itself as PID 1 via PID namespace
        self.ram_limit_mb = ram_limit_mb
        self.current_ram_mb = 45
        
    def allocate_memory(self, additional_mb: int) -> dict:
        self.current_ram_mb += additional_mb
        if self.current_ram_mb > self.ram_limit_mb:
            # Kernel OOM killer fires
            return {
                "status": "OOM_KILLED",
                "exit_code": 137,
                "reason": f"Allocated {self.current_ram_mb}MB exceeded cgroup limit of {self.ram_limit_mb}MB"
            }
        return {
            "status": "RUNNING",
            "current_ram_mb": self.current_ram_mb,
            "headroom_mb": self.ram_limit_mb - self.current_ram_mb
        }

sandbox = ContainerSandboxModel(host_pid=39412, ram_limit_mb=256)
print(f"Process View: Host PID={sandbox.host_pid} -> Container PID={sandbox.container_pid}")

# Normal operation
res1 = sandbox.allocate_memory(100)
print(f"Step 1: {res1['status']} (RAM used: {res1['current_ram_mb']}MB, Headroom: {res1['headroom_mb']}MB)")

# Memory spike exceeding cgroup limit
res2 = sandbox.allocate_memory(200)
print(f"Step 2: {res2['status']} -> Exit Code {res2['exit_code']} ({res2['reason']})")
`,
    quiz: {
      id: 'quiz-l5-m6-l4',
      title: 'Container Fundamentals Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What Linux kernel mechanism is responsible for restricting how much CPU and RAM a container can consume?',
          options: [
            { id: 'opt_1', text: 'Namespaces (net, pid, mnt)' },
            { id: 'opt_2', text: 'Control Groups (cgroups)' },
            { id: 'opt_3', text: 'Virtual Machine Hypervisors' },
            { id: 'opt_4', text: 'The OverlayFS driver' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Namespaces control what a process can see (network, PIDs, filesystem mounts), whereas Control Groups (cgroups) control resource limits (allocations of CPU cores, memory limits, and I/O bandwidth).'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l5',
    slug: 'writing-suitable-dockerfile',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Writing a Production-Ready Python Dockerfile',
    description: 'Construct hardened, production-grade Dockerfiles using official slim base images, non-root users, explicit working directories, and correct instruction ordering.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Construct a secure, minimal, production-grade Dockerfile for Python services.
2. Select the optimal base image: Understand why \`python:3.12-slim\` is preferred over alpine or bloated full images.
3. Enforce the Principle of Least Privilege by running applications under an unprivileged non-root user.
4. Structure Dockerfile instructions to leverage Docker layer caching effectively.

---

### Choosing the Right Base Image

| Base Image | Typical Size | Compatibility | Recommendation |
| :--- | :--- | :--- | :--- |
| \`python:3.12\` | ~1.0 GB | Full (gcc, build tools, man pages) | ❌ Bloated. Huge attack surface. |
| \`python:3.12-alpine\`| ~50 MB | Uses \`musl\` libc instead of \`glibc\` | ⚠️ Risky for Python. Wheels compiled for \`manylinux\` often fail or trigger slow C-extension source builds. |
| \`python:3.12-slim\` | ~130 MB | Debian-based with \`glibc\`, no extra build tools | ✅ **Gold standard for Python production.** Fast builds, tiny size, universal wheel compatibility. |

---

### The Anatomy of a Secure Production Dockerfile

\`\`\`dockerfile
# 1. Base image: Debian slim with modern Python
FROM python:3.12-slim

# 2. Python runtime optimization flags:
# - PYTHONDONTWRITEBYTECODE: Prevents writing .pyc files inside container
# - PYTHONUNBUFFERED: Flushes stdout/stderr immediately (essential for docker logs)
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

# 3. Create a dedicated non-root user and group
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

# 4. Set isolated working directory
WORKDIR /app

# 5. Dependency caching layer: Copy requirements FIRST!
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \\
    pip install --no-cache-dir -r requirements.txt

# 6. Copy application code AFTER installing dependencies
COPY src/ /app/src/

# 7. Grant ownership to unprivileged user
RUN chown -R appuser:appgroup /app

# 8. Switch to non-root user
USER appuser

# 9. Expose documentation port
EXPOSE 8000

# 10. Exec form startup command
CMD ["python", "-m", "src.main"]
\`\`\`

---

### Why Non-Root (\`USER appuser\`) is Mandatory

By default, Docker runs all instructions as UID 0 (\`root\`).
If an attacker discovers a Remote Code Execution (RCE) vulnerability in a dependency (e.g. an unsanitized image parser), running as root allows the attacker to compromise host devices, modify system binaries, or access mounted sensitive files. Running as an unprivileged user strictly bounds the attacker's blast radius.
`,
    interactive_code: `class DockerfileLinter:
    """Analyzes a Dockerfile string for production security and caching best practices."""
    
    @staticmethod
    def lint(dockerfile_text: str) -> dict:
        findings = []
        lines = [line.strip() for line in dockerfile_text.splitlines() if line.strip() and not line.strip().startswith("#")]
        
        # Check base image
        from_lines = [l for l in lines if l.startswith("FROM")]
        if from_lines and "alpine" in from_lines[0].lower():
            findings.append("Warning: Alpine base image detected. Ensure pre-compiled manylinux wheels exist to avoid slow compilation.")
        elif from_lines and not ("slim" in from_lines[0].lower() or "distroless" in from_lines[0].lower()):
            findings.append("Warning: Full base image used. Prefer 'python:3.12-slim' to reduce image footprint and CVE vulnerabilities.")
            
        # Check for non-root user
        user_lines = [l for l in lines if l.startswith("USER")]
        if not user_lines or any("root" in l for l in user_lines):
            findings.append("SECURITY RISK: No non-root USER instruction found. Container runs as root (UID 0)!")
            
        # Check for PYTHONUNBUFFERED
        env_lines = " ".join([l for l in lines if l.startswith("ENV")])
        if "PYTHONUNBUFFERED" not in env_lines:
            findings.append("Operational: PYTHONUNBUFFERED is not set. Logs may be delayed in container stdout buffers.")
            
        # Check CMD format
        cmd_lines = [l for l in lines if l.startswith("CMD")]
        if cmd_lines and not cmd_lines[-1].strip().startswith('CMD ["'):
            findings.append("Warning: CMD uses shell form. Prefer exec form JSON array: CMD [\\"python\\", ...]")
            
        return {
            "passed": len([f for f in findings if "SECURITY" in f]) == 0,
            "issues": findings
        }

sample_insecure_dockerfile = """
FROM python:3.12
WORKDIR /code
COPY . /code
RUN pip install -r requirements.txt
CMD python app.py
"""

report = DockerfileLinter.lint(sample_insecure_dockerfile)
print(f"Dockerfile Passed: {report['passed']}")
for issue in report["issues"]:
    print(f" - {issue}")
`,
    quiz: {
      id: 'quiz-l5-m6-l5',
      title: 'Dockerfile Practices Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should `requirements.txt` be copied and installed before copying the rest of the application source code in a Dockerfile?',
          options: [
            { id: 'opt_1', text: 'Docker will fail with a syntax error if requirements.txt is copied second.' },
            { id: 'opt_2', text: 'To leverage Docker layer caching: pip packages are only re-installed when requirements.txt changes, speeding up subsequent builds.' },
            { id: 'opt_3', text: 'Application code cannot be read by pip until requirements are compiled.' },
            { id: 'opt_4', text: 'To ensure the non-root user has write access to the source code files.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Docker executes builds layer-by-layer and caches unchanged layers. Copying `requirements.txt` first ensures the expensive `pip install` layer is cached and reused across routine code changes.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l6',
    slug: 'image-layers-build-optimization',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Image Layers and Multi-Stage Build Optimization',
    description: 'Harness multi-stage Docker builds and .dockerignore to produce minimal, hardened final artifacts stripped of compilers, headers, and build tools.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand Docker layer caching rules and how to minimize layer invalidation.
2. Build multi-stage Docker builds to separate compilation tools (\`gcc\`, \`build-essential\`) from the final runtime image.
3. Configure \`.dockerignore\` to prevent copying virtual environments, Git history, and secrets into the build context.
4. Minimize final image size and reduce Common Vulnerabilities and Exposures (CVEs) in production images.

---

### The Build Context and \`.dockerignore\`

When you run \`docker build -t myapp .\`, the Docker CLI tar-archives the entire directory and sends it to the Docker daemon.

Without a \`.dockerignore\` file, you waste network bandwidth and risk baking sensitive files into image layers:
\`\`\`
# .dockerignore
.git/
.venv/
venv/
__pycache__/
*.pyc
.env
.env.*
tests/
.coverage
htmlcov/
README.md
docs/
\`\`\`

---

### Multi-Stage Builds: Builder vs Runtime Stages

When Python projects require packages with native C extensions (e.g. \`cryptography\`, \`psycopg2\`, \`numpy\`), compiling them often requires \`gcc\`, \`g++\`, and Linux kernel headers (\`build-essential\`, \`libpq-dev\`).

If you install these compilers in a single-stage image:
- Your image balloons from 130MB to 750MB+.
- Production containers now contain a working C compiler, making it significantly easier for an attacker who breaches the container to compile local privilege escalation exploits!

**Multi-stage builds solve this completely**:
\`\`\`dockerfile
# ----------------------------------------------------
# Stage 1: Builder Stage (Contains compilers & wheels)
# ----------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    libpq-dev && \\
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Build standalone wheels in a wheels cache directory
RUN pip wheel --no-cache-dir --wheel-dir /build/wheels -r requirements.txt


# ----------------------------------------------------
# Stage 2: Final Runtime Stage (Zero compilers, pure minimal runtime)
# ----------------------------------------------------
FROM python:3.12-slim AS runner

WORKDIR /app

# Only install runtime shared libraries (NO build-essential/gcc!)
RUN apt-get update && apt-get install -y --no-install-recommends \\
    libpq5 && \\
    rm -rf /var/lib/apt/lists/*

# Copy pre-compiled wheels from the builder stage
COPY --from=builder /build/wheels /wheels
COPY --from=builder /build/requirements.txt .

# Install directly from local pre-compiled wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt && \\
    rm -rf /wheels

# Copy application code
COPY src/ /app/src/

USER 10001
CMD ["python", "-m", "src.main"]
\`\`\`
`,
    interactive_code: `def simulate_layer_cache_impact(changes: list[str]) -> None:
    """Demonstrates which Docker layers rebuild based on which files changed."""
    
    stages = [
        ("Layer 1: FROM python:3.12-slim", "base_image"),
        ("Layer 2: COPY requirements.txt", "requirements.txt"),
        ("Layer 3: RUN pip install ...", "requirements.txt"),
        ("Layer 4: COPY src/ .", "source_code"),
        ("Layer 5: CMD ['python', 'main.py']", "config"),
    ]
    
    print("--- Build Simulation ---")
    cache_invalidated = False
    
    for layer_name, trigger in stages:
        if trigger in changes or cache_invalidated:
            cache_invalidated = True
            status = "REBUILDING (Cache Miss)"
        else:
            status = "CACHED (Instant)"
            
        print(f"{layer_name:<38} -> {status}")

print("Scenario A: Changing only Python code in src/app.py:")
simulate_layer_cache_impact(["source_code"])

print("\\nScenario B: Changing dependencies in requirements.txt:")
simulate_layer_cache_impact(["requirements.txt", "source_code"])
`,
    quiz: {
      id: 'quiz-l5-m6-l6',
      title: 'Multi-Stage Builds Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary security benefit of using a multi-stage Docker build for a Python service?',
          options: [
            { id: 'opt_1', text: 'It prevents the Python interpreter from reading environment variables.' },
            { id: 'opt_2', text: 'It keeps C compilers (gcc) and development header packages out of the final runtime container.' },
            { id: 'opt_3', text: 'It automatically encrypts Python source files inside the container.' },
            { id: 'opt_4', text: 'It forces Python to execute in multi-threaded mode.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Multi-stage builds compile native dependencies inside a temporary builder stage. The final runtime container copies only the built artifacts, ensuring compilers like `gcc` and development headers are omitted, drastically reducing the security attack surface.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l7',
    slug: 'env-vars-runtime-configuration',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Environment Variables and Runtime Configuration',
    description: 'Inject dynamic runtime configuration safely into Docker containers without baking sensitive credentials or environment-specific data into images.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Differentiate build-time configuration (\`ARG\`) from runtime configuration (\`ENV\`).
2. Pass dynamic settings into containers via \`docker run -e\`, \`--env-file\`, and container orchestration manifests.
3. Understand why committing \`.env\` files into container images is a severe security violation.
4. Establish clean startup validation so missing environment variables trigger fast, clear container crashes.

---

### Build Time (\`ARG\`) vs Runtime (\`ENV\`)

| Mechanism | Scope | Example Use Case | Risk / Note |
| :--- | :--- | :--- | :--- |
| \`ARG\` | Only available during \`docker build\`. Disappears in final image. | \`ARG PYTHON_VERSION=3.12\` | Values are visible in \`docker history\`. Never pass secrets via \`ARG\`. |
| \`ENV\` | Baked into the image metadata; persists in all running containers. | \`ENV PORT=8080\` | Publicly visible in \`docker inspect\`. Do not put database passwords in \`ENV\` instructions! |
| **Runtime Injection** | Provided when the container is started (\`docker run -e\` or K8s secret). | \`docker run -e DB_PASS=... \` | The standard cloud practice: code image remains identical; config changes per environment. |

---

### The Anti-Pattern: Baking \`.env\` Files into Images

\`\`\`dockerfile
# ❌ CATASTROPHIC ANTI-PATTERN
COPY .env /app/.env
\`\`\`
Why this fails:
1. Anyone with read access to the Docker image (registry, developer laptop, cloud provider) has your production API keys and database credentials.
2. The image can now only run in that single environment, breaking the core principle of immutable artifacts.

---

### Clean Runtime Configuration Extraction

In production, Python code should read strictly from the container's environment variables, using fail-fast validation:

\`\`\`python
import os
from pydantic import BaseModel, Field

class ContainerRuntimeConfig(BaseModel):
    PORT: int = Field(default=8000)
    ENVIRONMENT: str
    DATABASE_URL: str

    @classmethod
    def load_from_env(cls) -> "ContainerRuntimeConfig":
        return cls(
            PORT=int(os.environ.get("PORT", 8000)),
            ENVIRONMENT=os.environ["ENVIRONMENT"],
            DATABASE_URL=os.environ["DATABASE_URL"]
        )
\`\`\`
`,
    interactive_code: `import os

class MockContainerRuntime:
    """Simulates passing environment variables to a container process at boot time."""
    
    @staticmethod
    def boot_container(injected_env: dict) -> dict:
        required_keys = ["APP_ENV", "DATABASE_URL"]
        missing = [key for key in required_keys if key not in injected_env]
        
        if missing:
            return {
                "success": False,
                "exit_code": 1,
                "error": f"Startup Error: Missing required environment variables: {missing}"
            }
            
        port = int(injected_env.get("PORT", 8000))
        return {
            "success": True,
            "exit_code": 0,
            "message": f"Server booted cleanly on port {port} in '{injected_env['APP_ENV']}' mode."
        }

# Scenario 1: Missing DATABASE_URL
result_fail = MockContainerRuntime.boot_container({"APP_ENV": "production"})
print(f"Fail Run: {result_fail['error']}")

# Scenario 2: Valid runtime injection
result_ok = MockContainerRuntime.boot_container({
    "APP_ENV": "production",
    "DATABASE_URL": "postgresql://user:secret@db-cluster.internal:5432/app",
    "PORT": 9000
})
print(f"Success Run: {result_ok['message']}")
`,
    quiz: {
      id: 'quiz-l5-m6-l7',
      title: 'Runtime Configuration Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why should sensitive production credentials NEVER be set using the Dockerfile instruction `ENV DB_PASSWORD=mysecret`?',
          options: [
            { id: 'opt_1', text: 'Docker will encrypt the password and Python cannot decrypt it.' },
            { id: 'opt_2', text: 'Dockerfile ENV values are baked into image metadata and visible to anyone who inspects the image or layer history.' },
            { id: 'opt_3', text: 'Environment variables cannot exceed 8 characters in Docker containers.' },
            { id: 'opt_4', text: 'Linux kernel cgroups prevent processes from reading variables defined in ENV.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Values set with `ENV` inside a Dockerfile are permanently stored in the image manifest. Anyone with access to the Docker image can run `docker inspect` or `docker history` to view plaintext credentials.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l8',
    slug: 'ports-networking-service-communication',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Ports, Networking, and Service Communication',
    description: 'Master container networking models, port binding (-p vs EXPOSE), internal DNS service discovery, and the classic "127.0.0.1 localhost trap".',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand the difference between the documentation instruction \`EXPOSE\` and actual port publishing (\`-p host:container\`).
2. Solve the "localhost trap": understand why binding to \`127.0.0.1\` inside a container prevents outside traffic from reaching Python.
3. Understand user-defined container bridge networks and internal DNS service discovery.
4. Diagnose communication failures between web servers and background dependencies.

---

### The Classic "127.0.0.1" Localhost Trap

When running a Python web server (Uvicorn, Gunicorn, Flask) on a developer laptop, binding to localhost is standard:
\`\`\`bash
uvicorn main:app --host 127.0.0.1 --port 8000
\`\`\`

**In a container, this causes an immediate connection failure!**
- Inside a container network namespace, \`127.0.0.1\` represents the container's *own* internal loopback interface.
- Incoming packets arriving from the host bridge or external load balancer arrive on \`eth0\`.
- Because the server is listening strictly on the loopback adapter, the kernel drops the packet with \`Connection Refused\`.

**The Rule**: Inside containers, Python servers must bind to all network interfaces: **\`0.0.0.0\`** (or \`::\` for IPv6):
\`\`\`bash
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`

---

### \`EXPOSE\` vs \`-p host_port:container_port\`

\`\`\`dockerfile
# Inside Dockerfile:
EXPOSE 8000
\`\`\`
- \`EXPOSE\` is purely **metadata documentation** for human engineers and container tools. It does **not** open ports or make the application reachable on the host machine!

\`\`\`bash
# When running the container:
docker run -p 8080:8000 myapp
\`\`\`
- \`-p 8080:8000\` creates host iptables/nftables forwarding rules, routing traffic hitting port 8080 on the host machine to port 8000 inside the container's network namespace.

---

### Container Bridge Networks & DNS Discovery

In multi-container setups (e.g. Python app + PostgreSQL + Redis):
- Containers connected to the same user-defined network resolve each other by **container name** via embedded DNS.
- Your Python connection string is \`postgresql://user:pass@postgres_db:5432/app\`, where \`postgres_db\` is resolved automatically to the target container's virtual IP.
`,
    interactive_code: `class ContainerNetworkSimulator:
    """Demonstrates network binding and port mapping resolution."""
    
    @staticmethod
    def route_incoming_packet(host_port: int, bind_host: str, target_port: int) -> dict:
        # Check host binding
        if bind_host == "127.0.0.1":
            return {
                "success": False,
                "error": "CONNECTION_REFUSED: Server inside container bound to '127.0.0.1' (loopback only). Packets from host eth0 rejected!"
            }
        elif bind_host == "0.0.0.0":
            return {
                "success": True,
                "message": f"SUCCESS: Packet on host port {host_port} successfully forwarded to container port {target_port} listening on 0.0.0.0."
            }
        else:
            return {"success": False, "error": f"Unknown bind address {bind_host}"}

# Attempting to route to a server listening on localhost
res_fail = ContainerNetworkSimulator.route_incoming_packet(8080, "127.0.0.1", 8000)
print(f"Test 1 (127.0.0.1): {res_fail['error']}")

# Correct production binding
res_ok = ContainerNetworkSimulator.route_incoming_packet(8080, "0.0.0.0", 8000)
print(f"Test 2 (0.0.0.0):   {res_ok['message']}")
`,
    quiz: {
      id: 'quiz-l5-m6-l8',
      title: 'Container Networking Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why does a Python web server inside a Docker container fail to receive external traffic if it binds to host 127.0.0.1?',
          options: [
            { id: 'opt_1', text: 'Port 8000 is reserved exclusively for root users.' },
            { id: 'opt_2', text: '127.0.0.1 is the container loopback interface, which ignores traffic routed to the container virtual eth0 interface.' },
            { id: 'opt_3', text: 'Docker containers do not support IPv4 networking.' },
            { id: 'opt_4', text: 'The Linux kernel prohibits Python from binding to loopback addresses.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'In a container network namespace, 127.0.0.1 points only to the isolated loopback interface. Incoming traffic forwarded from the host arrives on the virtual ethernet interface (eth0). The server must bind to 0.0.0.0 to listen on all interfaces.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l9',
    slug: 'persistent-storage-considerations',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Persistent Storage Considerations and Stateless Containers',
    description: 'Design stateless container workloads. Understand volumes, bind mounts, ephemeral container layers, and how to store durable state in cloud services.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand the lifecycle of container storage: Ephemeral writable layer vs Persistent Volumes.
2. Design strictly stateless application containers in alignment with cloud-native principles.
3. Compare Docker Volumes (managed by Docker engine) with Bind Mounts (host path mappings).
4. Identify when local disk storage is appropriate (temporary scratch caches) and when it causes data loss.

---

### The Ephemeral Storage Lifecycle

Every running container has a thin read-write layer on top of its immutable image layers.
- If your Python code writes a file with \`open("/app/data/report.pdf", "w")\`, that file is written to the ephemeral writable layer.
- **When the container is stopped and removed (\`docker rm\`) or rescheduled by an orchestrator, that layer is wiped out immediately.**
- Any state stored on that filesystem is lost permanently.

\`\`\`
   ┌──────────────────────────────────────────────┐
   │             Container Filesystem             │
   ├──────────────────────────────────────────────┤
   │ [Thin Read/Write Layer]  <-- Ephemeral!      │
   │   (Any unmounted file writes vanish on kill) │
   ├──────────────────────────────────────────────┤
   │ [Read-Only Image Layers]                     │
   │   - Python 3.12-slim base                    │
   │   - Application code & wheels                │
   └──────────────────────────────────────────────┘
\`\`\`

---

### Storage Options Compared

| Storage Type | Managed By | Use Case | Production Recommendation |
| :--- | :--- | :--- | :--- |
| **Ephemeral Layer** | Container runtime | Temporary scratch files (e.g. \`/tmp/temp_parse_12.json\`). | ✅ Safe for throwaway temporary data only. |
| **Named Volumes** | Docker engine (\`/var/lib/docker/volumes\`) | Local databases, persistent cache stores. | ⚠️ Good for single-node VMs; not portable across distributed clusters. |
| **Bind Mounts** | Host OS directory | Local dev hot-reloading (\`-v $(pwd)/src:/app/src\`). | ❌ Never use in production: couples container to specific host file paths. |
| **Cloud Object Store** | S3 / GCS / Azure Blob | User uploads, invoices, generated reports, models. | ✅ **Cloud-native standard for all durable file state.** |

---

### Golden Rule for Cloud-Native Python Services

> **Treat the local container filesystem as read-only scratch space.** 
> All durable application state must be stored in external managed databases or object storage.
`,
    interactive_code: `class StorageLifecycleAudit:
    """Audits file storage patterns in Python applications for ephemeral container safety."""
    
    @staticmethod
    def evaluate_write_path(file_path: str, is_object_storage: bool) -> dict:
        if is_object_storage:
            return {
                "durable": True,
                "classification": "Object Storage (S3/GCS)",
                "note": "Safe: Durable across container terminations, scaling, and cluster migration."
            }
        
        if file_path.startswith("/tmp") or file_path.startswith("/var/tmp"):
            return {
                "durable": False,
                "classification": "Ephemeral Scratch Space",
                "note": "Acceptable for temporary scratch computation only. Deleted on container stop."
            }
            
        return {
            "durable": False,
            "classification": "DANGEROUS: Ephemeral Container Layer",
            "note": "CRITICAL RISK: Files written to application root directory will vanish on container restart!"
        }

paths_to_test = [
    ("/app/uploads/avatar.jpg", False),
    ("/tmp/thumbnail_cache.tmp", False),
    ("s3://production-bucket/invoices/inv_901.pdf", True),
]

for path, is_s3 in paths_to_test:
    res = StorageLifecycleAudit.evaluate_write_path(path, is_s3)
    print(f"Path: {path}")
    print(f" -> Classification: {res['classification']}")
    print(f" -> Note: {res['note']}\\n")
`,
    quiz: {
      id: 'quiz-l5-m6-l9',
      title: 'Storage Considerations Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'What happens to user profile pictures saved directly to `/app/media/` inside a container when the container restarts during a routine deployment?',
          options: [
            { id: 'opt_1', text: 'Docker moves the images to the host desktop folder automatically.' },
            { id: 'opt_2', text: 'The files are permanently deleted because the container writable layer is ephemeral and destroyed.' },
            { id: 'opt_3', text: 'The files are converted into Docker image layers for the next deployment.' },
            { id: 'opt_4', text: 'The files are automatically uploaded to the cloud provider default S3 bucket.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Standard container root filesystems are ephemeral. When a container instance is terminated or replaced during a deployment, its writable layer is discarded and all un-mounted local files are permanently lost.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l10',
    slug: 'deployment-logs-troubleshooting',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Deployment Logs and Container Troubleshooting',
    description: 'Diagnose failing containers using exit codes, STDOUT/STDERR streaming, PYTHONUNBUFFERED, and systematic debugging of crash loops.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand how container log drivers capture output from \`STDOUT\` and \`STDERR\`.
2. Configure Python's standard output buffering with \`PYTHONUNBUFFERED=1\` to avoid delayed log output.
3. Master standard Linux container exit codes (0, 1, 137, 139, 143) to quickly pinpoint root causes.
4. Troubleshoot and resolve container crash-loop backoffs systematically.

---

### The Standard Exit Code Rosetta Stone

When a container stops unexpectedly, its exit code provides immediate diagnosis:

| Exit Code | Meaning | Root Cause in Python Applications |
| :--- | :--- | :--- |
| **0** | Clean Exit | Process finished its work normally (or worker exited prematurely because no event loop blocked). |
| **1** | General Error | Uncaught Python exception, syntax error, missing import, or failed config validation. |
| **137** | \`128 + 9\` (\`SIGKILL\`) | **OOMKilled**: Container exceeded cgroup memory limit, or orchestrator killed process after grace period. |
| **139** | \`128 + 11\` (\`SIGSEGV\`) | Segmentation fault in compiled C-extension (e.g. Cython, PyTorch, bad native library). |
| **143** | \`128 + 15\` (\`SIGTERM\`) | Container was terminated gracefully by the orchestrator (normal deployment stop). |

---

### Python Output Buffering in Containers

By default, the C-runtime buffer streams to terminal pipes when stdout is not an interactive TTY.
In containers, Python buffers \`print()\` and logging statements in memory:
- If your container crashes during startup, the buffered log lines may never be flushed to the host.
- Engineers run \`docker logs\` and see a blank screen, unable to diagnose the failure!

**Solution**: Always set \`ENV PYTHONUNBUFFERED=1\` in your Dockerfile or execute with \`python -u\`.
This forces Python to flush every log line to \`STDOUT\` / \`STDERR\` immediately.

---

### Structured JSON Logging for Log Aggregators

In cloud environments (Datadog, AWS CloudWatch, Google Cloud Logging), multi-line tracebacks scattered across standard logs get split into individual uncorrelated entries. Outputting single-line JSON logs preserves full stack traces cleanly:

\`\`\`json
{"timestamp": "2026-10-10T12:00:00Z", "level": "ERROR", "message": "DB connection timeout", "traceback": "..."}
\`\`\`
`,
    interactive_code: `class ContainerExitCodeTriage:
    """Triages container terminations based on exit codes and log diagnostics."""
    
    DIAGNOSTICS = {
        0: ("Clean Exit", "Process completed or terminated voluntarily without error."),
        1: ("Application Crash", "Uncaught Python exception or failed startup validation. Check stack trace."),
        137: ("OOMKilled (SIGKILL)", "Process killed by Linux kernel Out-Of-Memory killer. Increase cgroup RAM limit or optimize memory footprint."),
        139: ("Segmentation Fault (SIGSEGV)", "Memory corruption in compiled native C extension library."),
        143: ("Graceful Termination (SIGTERM)", "Orchestrator stopped container normally during a deployment or scale-down.")
    }
    
    @classmethod
    def diagnose(cls, exit_code: int) -> dict:
        title, details = cls.DIAGNOSTICS.get(exit_code, ("Unknown Exit Code", "Unrecognized termination code."))
        return {
            "exit_code": exit_code,
            "category": title,
            "remediation": details
        }

test_codes = [0, 1, 137, 143]
for code in test_codes:
    res = ContainerExitCodeTriage.diagnose(code)
    print(f"Exit Code {res['exit_code']:<3} -> [{res['category']}]")
    print(f"  Remediation: {res['remediation']}")
`,
    quiz: {
      id: 'quiz-l5-m6-l10',
      title: 'Troubleshooting Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'If a Python container exits abruptly with Exit Code 137, what is the most likely root cause?',
          options: [
            { id: 'opt_1', text: 'A syntax error in requirements.txt.' },
            { id: 'opt_2', text: 'The Linux kernel OOM Killer terminated the container for exceeding its cgroup memory limit (Signal 9).' },
            { id: 'opt_3', text: 'The server received a valid SIGINT from the keyboard.' },
            { id: 'opt_4', text: 'A database query returned an empty result set.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'Exit code 137 corresponds to 128 + 9 (SIGKILL). In container environments, this almost always signifies that the process exceeded its memory allocation and was terminated by the Linux Out-Of-Memory (OOM) killer.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l11',
    slug: 'secrets-production-configuration',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Docker Build Secrets and Production Configuration Protection',
    description: 'Safely handle private dependencies during Docker builds using BuildKit secrets without leaking credentials into image layer metadata.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand how private package registries (private PyPI, GitHub packages) require build-time secrets.
2. Recognize why passing credentials via \`ARG\` or \`ENV\` creates permanent security vulnerabilities in image metadata.
3. Use Docker BuildKit secret mounts (\`--mount=type=secret\`) to access tokens during builds without leaving traces in final layers.
4. Compare runtime secrets mounting mechanisms in production orchestrators.

---

### The Private Dependency Dilemma

In corporate environments, enterprise Python applications frequently depend on proprietary internal packages:
\`\`\`
pip install --index-url https://token:\${GITHUB_TOKEN}@github.com/company/internal-pkg.git
\`\`\`

If you run this in a Dockerfile with an \`ARG\`:
\`\`\`dockerfile
# ❌ DANGEROUS SECURITY FLAW
ARG GITHUB_TOKEN
RUN pip install https://\${GITHUB_TOKEN}@github.com/company/internal-pkg.git
\`\`\`
- The token is permanently recorded in the layer history!
- Anyone who pulls the image can run \`docker history --no-trunc myimage\` and extract the secret token in plain text.

---

### The Solution: Docker BuildKit Secret Mounts

Docker BuildKit allows mounting a secret temporarily into a specific \`RUN\` instruction without writing it to any image layer:

\`\`\`dockerfile
# Syntax directive enables modern BuildKit features
# syntax=docker/dockerfile:1.4

FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .

# Mount the secret at /run/secrets/github_token ONLY during this command!
RUN --mount=type=secret,id=github_token \\
    TOKEN=$(cat /run/secrets/github_token) && \\
    pip install --no-cache-dir --index-url https://oauth2:\${TOKEN}@packages.corp.internal/simple/ -r requirements.txt
\`\`\`

To build the image safely:
\`\`\`bash
# The token is read from your local environment or file and never written into the image
DOCKER_BUILDKIT=1 docker build --secret id=github_token,env=GITHUB_TOKEN -t myapp:latest .
\`\`\`
`,
    interactive_code: `class SecretLeakScanner:
    """Scans Docker build commands and Dockerfiles for accidental token persistence."""
    
    @staticmethod
    def audit_build_step(step_type: str, command: str) -> dict:
        sensitive_patterns = ["token", "secret", "password", "api_key"]
        command_lower = command.lower()
        
        has_sensitive_word = any(pattern in command_lower for pattern in sensitive_patterns)
        
        if step_type in ("ARG", "ENV") and has_sensitive_word:
            return {
                "safe": False,
                "severity": "CRITICAL",
                "finding": f"Exposed secret in {step_type}! Visible in 'docker history' and image metadata."
            }
            
        if "--mount=type=secret" in command:
            return {
                "safe": True,
                "severity": "SAFE",
                "finding": "BuildKit secret mount used. Secret is mounted in temporary memory and omitted from image layers."
            }
            
        return {"safe": True, "severity": "CLEAN", "finding": "No secret exposure detected."}

print(SecretLeakScanner.audit_build_step("ARG", "ARG GITHUB_TOKEN=ghp_928172938172938")["finding"])
print(SecretLeakScanner.audit_build_step("RUN", "RUN --mount=type=secret,id=pip_conf pip install -r reqs.txt")["finding"])
`,
    quiz: {
      id: 'quiz-l5-m6-l11',
      title: 'Build Secrets Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'Why does using `RUN --mount=type=secret,id=my_secret` protect sensitive credentials better than `ARG MY_SECRET` during Docker builds?',
          options: [
            { id: 'opt_1', text: 'BuildKit encrypts the entire container root filesystem with AES-256.' },
            { id: 'opt_2', text: 'The secret is mounted into a temporary RAM-backed virtual filesystem for the single command and never recorded in image layers.' },
            { id: 'opt_3', text: 'It automatically rotates the secret with the cloud provider after each build.' },
            { id: 'opt_4', text: 'BuildKit prevents Python from accessing network sockets.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'BuildKit secret mounts make credentials available only in memory during that specific `RUN` step. The secret is never written to disk or recorded in the image layer metadata, keeping it completely absent from `docker history`.'
        }
      ]
    }
  },
  {
    id: 'l5-m6-l12',
    slug: 'rollbacks-deployment-safety',
    module_slug: 'docker-deployment-fundamentals',
    title: 'Rollbacks and Deployment Safety Strategies',
    description: 'Implement zero-downtime rolling updates, blue-green deployments, canary releases, and backward-compatible database migrations for risk-free rollbacks.',
    xp_reward: 20,
    estimated_minutes: 20,
    content: `
### Learning Objectives
1. Understand zero-downtime deployment patterns: **Rolling Updates**, **Blue-Green Deployments**, and **Canary Releases**.
2. Learn why instant application rollbacks fail if database migrations break backward compatibility.
3. Master the **Expand-Contract (Parallel Run) migration pattern** to ensure zero-downtime schema evolution.
4. Formulate an automated rollback decision framework driven by real-time error rates and latency metrics.

---

### Zero-Downtime Deployment Strategies

\`\`\`
  1. Rolling Update:
     Old: [V1] [V1] [V1]  -->  [V1] [V1] [V2]  -->  [V1] [V2] [V2]  -->  [V2] [V2] [V2]
     (Gradually replaces instances; requires both versions to run simultaneously)

  2. Blue-Green Deployment:
     Blue Cluster:  [V1] [V1] [V1] <── (100% Traffic via Router)
     Green Cluster: [V2] [V2] [V2] (Warmed up, verified, then router flips 100% traffic instantly)

  3. Canary Release:
     Router sends 95% traffic to [V1] and 5% traffic to [V2].
     If V2 error rate remains < 0.01%, traffic scales to 25% -> 50% -> 100%.
\`\`\`

---

### The Rollback Trap: Destructive Database Migrations

Imagine you want to rename a column in production:
\`\`\`sql
-- ❌ DISASTROUS IMMEDIATE RENAME
ALTER TABLE users RENAME COLUMN phone TO mobile_number;
\`\`\`
1. You deploy the database migration.
2. During the rolling update, 50% of your servers are still running **Version 1** of your Python code, which executes queries using \`SELECT phone FROM users\`.
3. Version 1 instances immediately fail with \`UndefinedColumnError\` for thousands of active users!
4. If Version 2 also encounters a critical bug and you click **"Rollback"**, Version 1 cannot run because the column has been renamed!

---

### The Solution: Expand-Contract Pattern

Safe production schema evolution always occurs across multiple independent releases:

1. **Phase 1 (Expand)**: Add the new column (\`mobile_number\`) as nullable. Write dual-write code in Python that writes to both \`phone\` and \`mobile_number\`.
2. **Phase 2 (Backfill)**: Run a background migration to copy existing \`phone\` values to \`mobile_number\`.
3. **Phase 3 (Switch)**: Deploy code that reads and writes strictly to \`mobile_number\`. (Rollback is completely safe because \`phone\` still exists).
4. **Phase 4 (Contract)**: In a subsequent release weeks later, safely drop the old \`phone\` column.
`,
    interactive_code: `class DeploymentCanaryEvaluator:
    """Simulates an automated canary deployment gate evaluating error rates."""
    
    @staticmethod
    def evaluate_canary_health(canary_requests: int, error_count: int, max_error_rate: float = 0.01) -> dict:
        if canary_requests == 0:
            return {"action": "HOLD", "reason": "Awaiting canary traffic..."}
            
        error_rate = error_count / canary_requests
        if error_rate > max_error_rate:
            return {
                "action": "AUTOMATED_ROLLBACK",
                "error_rate": f"{error_rate:.2%}",
                "reason": f"Canary error rate {error_rate:.2%} exceeded maximum allowed threshold {max_error_rate:.2%}. Rolling back to stable Blue release."
            }
        else:
            return {
                "action": "PROMOTE",
                "error_rate": f"{error_rate:.2%}",
                "reason": "Canary metrics healthy. Proceeding with full 100% traffic cutover."
            }

# Scenario 1: Unhealthy canary with 3% error rate
unhealthy_run = DeploymentCanaryEvaluator.evaluate_canary_health(1000, 32)
print(f"Canary 1: [{unhealthy_run['action']}] - {unhealthy_run['reason']}")

# Scenario 2: Healthy canary with 0.1% error rate
healthy_run = DeploymentCanaryEvaluator.evaluate_canary_health(1000, 1)
print(f"Canary 2: [{healthy_run['action']}] - {healthy_run['reason']}")
`,
    quiz: {
      id: 'quiz-l5-m6-l12',
      title: 'Deployment Safety Knowledge Check',
      questions: [
        {
          id: 'q1',
          question: 'When performing a rolling update or preparing for rapid rollbacks, how should database schema changes be designed?',
          options: [
            { id: 'opt_1', text: 'Columns should be renamed immediately during peak traffic hours.' },
            { id: 'opt_2', text: 'Using the Expand-Contract pattern so database schemas remain backward-compatible with both new and old code versions.' },
            { id: 'opt_3', text: 'Database migrations should only be applied after all servers are deleted.' },
            { id: 'opt_4', text: 'Foreign key constraints must be permanently removed from production databases.' }
          ],
          correct_option_ids: ['opt_2'],
          explanation: 'The Expand-Contract pattern guarantees backward compatibility. New columns and structures are added without removing old ones immediately, ensuring older code instances continue running safely during rolling updates and instant rollbacks.'
        }
      ]
    }
  }
];
