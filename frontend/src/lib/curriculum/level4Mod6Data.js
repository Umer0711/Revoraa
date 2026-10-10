/**
 * Revoraa Level 4: Advanced Python - Module 6: Design Patterns and Application Architecture
 * 
 * 12 comprehensive lessons covering separation of concerns, dependency injection,
 * composition over inheritance, Strategy, Factory, Adapter, Observer/Event-driven,
 * Repository pattern, 12-factor configuration, error boundaries, avoiding premature abstraction,
 * and evolutionary refactoring.
 */

export const MODULE_6_DESIGN_PATTERNS_ARCHITECTURE = {
  id: 'mod-py-patterns-architecture',
  slug: 'design-patterns-and-application-architecture',
  level_number: 4,
  title: 'Design Patterns and Application Architecture',
  description: 'Master separation of concerns, dependency injection, composition, Strategy, Factory, Observer, Repository boundaries, and pragmatic software architecture.',
  estimated_hours: 10,
  sort_order: 6,
  is_published: true,
  topics: [
    {
      id: 'top-architecture-patterns',
      slug: 'patterns-and-clean-boundaries',
      title: 'Architectural Patterns, Loose Coupling & Clean Boundaries',
      summary: 'Explore dependency injection, composition vs inheritance, behavioral design patterns, repository persistence boundaries, and pragmatic refactoring.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-l4-separation-of-concerns-architecture',
          slug: 'separation-of-concerns',
          title: 'Separation of Concerns: Architecting Multi-Tier Python Applications',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 1,
          summary: 'Deconstruct monolithic scripts into distinct layers: Domain, Business Logic, Data Access, and API Presentation.',
          learning_objectives: [
            'Separate distinct application responsibilities into isolated, cohesive layers',
            'Enforce unidirectional dependency flow (Presentation -> Service -> Repository -> Domain)',
            'Prevent business rules from leaking into database queries or web route handlers'
          ],
          content_markdown: `### The Pitfall of the "God Script"

In novice projects, a single function or file frequently handles everything:
\`\`\`
HTTP Request ──► Parse JSON ──► Business Validation ──► SQL Query ──► Send Email
\`\`\`
When business rules, SQL syntax, and external API requests are entangled:
- Writing automated unit tests without a live database or email server is impossible.
- Changing database vendors or web frameworks breaks business logic.

### Clean Layered Architecture
1. **Domain Layer**: Core data models and business invariants (no external dependencies).
2. **Repository Layer**: Encapsulates database storage and queries behind clean interfaces.
3. **Service Layer**: Orchestrates business workflows and domain rules.
4. **Presentation Layer**: Translates HTTP, CLI, or GraphQL inputs into service calls.`,
          code_snippet: `from dataclasses import dataclass

# 1. Domain Layer: Pure entity
@dataclass(frozen=True)
class UserRegistration:
    email: str
    age: int

# 2. Service Layer: Pure business rule validation
class RegistrationService:
    @staticmethod
    def validate_eligibility(reg: UserRegistration) -> bool:
        if "@" not in reg.email or reg.age < 18:
            return False
        return True

# 3. Presentation Layer: Handles input/output
def register_endpoint_handler(raw_data: dict) -> dict:
    entity = UserRegistration(email=raw_data.get("email", ""), age=raw_data.get("age", 0))
    if not RegistrationService.validate_eligibility(entity):
        return {"status": 400, "error": "Ineligible user registration"}
    return {"status": 201, "message": f"Welcome {entity.email}"}

print(register_endpoint_handler({"email": "alex@revoraa.com", "age": 22}))
print(register_endpoint_handler({"email": "minor@example.com", "age": 16}))`,
          code_language: 'python',
          code_explanation: 'Business rules (age >= 18) are isolated in RegistrationService, independent of HTTP dictionaries or storage mechanisms.',
          expected_output: `{'status': 201, 'message': 'Welcome alex@revoraa.com'}
{'status': 400, 'error': 'Ineligible user registration'}`,
          quiz: {
            id: 'quiz-l4-soc',
            title: 'Separation of Concerns Check',
            questions: [
              {
                id: 'q-l4-sc-1',
                question_text: 'Why should SQL queries NOT be written directly inside web endpoint handler functions (e.g. FastAPI / Flask routes)?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Python disallows SQL inside functions.' },
                  { id: 'opt_2', text: 'It tightly couples presentation logic to storage implementations, making testing without a database impossible and violating separation of concerns.' },
                  { id: 'opt_3', text: 'Because SQL queries can only be run from the command line.' },
                  { id: 'opt_4', text: 'To reduce the size of the git repository.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Separating data access behind repository interfaces allows business logic to be tested in isolation and keeps controllers focused strictly on HTTP protocol handling.'
              }
            ]
          },
          key_takeaways: [
            'Divide codebases into distinct, cohesive layers with clear responsibilities.',
            'Keep domain logic independent of frameworks, databases, and third-party APIs.',
            'Unidirectional dependencies make applications modular and testable.'
          ],
          revision_prompts: [
            'What is the difference between Hexagonal Architecture (Ports and Adapters) and traditional 3-tier architecture?',
            'What is an anemic domain model and why is it considered an architectural anti-pattern?'
          ]
        },

        // Lesson 2
        {
          id: 'les-l4-dependency-injection-fundamentals',
          slug: 'dependency-injection-fundamentals',
          title: 'Dependency Injection Fundamentals: Eliminating Hardcoded Coupling',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 2,
          summary: 'Pass collaborators explicitly into constructors (__init__) rather than instantiating hardcoded singletons or global clients.',
          learning_objectives: [
            'Recognize the rigid coupling caused by instantiating dependencies directly inside classes',
            'Implement constructor-based Dependency Injection (DI)',
            'Enable seamless mock and stub substitution in unit test suites'
          ],
          content_markdown: `### The Problem with Hardcoded Instantiation

When a class instantiates its own dependencies internally:
\`\`\`python
class PaymentProcessor:
    def __init__(self):
        # Tightly coupled to a real, live Stripe API client!
        self.client = LiveStripeClient(api_key="sk_live_123")
\`\`\`
Every test that runs will attempt to make real credit card charges or fail without network access.

### Constructor Dependency Injection (DI)

Instead of creating collaborators internally, **inject them** via the constructor:
\`\`\`python
class PaymentProcessor:
    def __init__(self, client: PaymentClient):
        self.client = client # Injected!
\`\`\`
- In production, inject \`LiveStripeClient\`.
- In unit tests, inject \`MockPaymentClient\` that records charges in memory.
- No third-party DI framework is required—pure Python constructor parameters are idiomatic and clean.`,
          code_snippet: `from typing import Protocol

class NotificationSender(Protocol):
    def send(self, recipient: str, text: str) -> bool: ...

# Production implementation
class LiveEmailSender:
    def send(self, recipient: str, text: str) -> bool:
        print(f"[LIVE EMAIL] Sending '{text}' to {recipient} via SMTP server...")
        return True

# Test mock implementation
class MockNotificationSender:
    def __init__(self):
        self.sent_messages = []
    def send(self, recipient: str, text: str) -> bool:
        self.sent_messages.append((recipient, text))
        return True

# Service depends strictly on the injected sender!
class AlertManager:
    def __init__(self, sender: NotificationSender):
        self.sender = sender # Dependency Injected

    def notify_critical_event(self, user: str, event: str):
        return self.sender.send(user, f"CRITICAL: {event}")

# In unit tests: zero network calls, 100% deterministic!
mock_sender = MockNotificationSender()
manager = AlertManager(mock_sender)
manager.notify_critical_event("sysadmin@revoraa.com", "Disk 95% full")

print("Captured in test mock:", mock_sender.sent_messages)`,
          code_language: 'python',
          code_explanation: 'Injecting the NotificationSender allows AlertManager to be tested instantly without network dependencies or monkey patching.',
          expected_output: `Captured in test mock: [('sysadmin@revoraa.com', 'CRITICAL: Disk 95% full')]`,
          quiz: {
            id: 'quiz-l4-di-basics',
            title: 'Dependency Injection Check',
            questions: [
              {
                id: 'q-l4-di-1',
                question_text: 'What is the primary benefit of passing collaborators via constructor arguments (Dependency Injection)?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It speeds up Python compilation.' },
                  { id: 'opt_2', text: 'It decouples classes from concrete implementations, making them easy to test with test doubles and reconfigure without modifying code.' },
                  { id: 'opt_3', text: 'It automatically disables garbage collection.' },
                  { id: 'opt_4', text: 'It creates a global singleton.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Dependency Injection decouples business services from concrete external resources, allowing tests to inject fast, deterministic mocks.'
              }
            ]
          },
          key_takeaways: [
            'Do not instantiate concrete external dependencies directly inside classes.',
            'Inject collaborators through constructor parameters (__init__).',
            'Constructor injection makes unit testing deterministic and eliminating monkey-patching.'
          ],
          revision_prompts: [
            'What is the difference between Constructor Injection and Method Injection?',
            'When does a project grow large enough to warrant a dependency injection container (e.g. dependency-injector)?'
          ]
        },

        // Lesson 3
        {
          id: 'les-l4-composition-vs-inheritance',
          slug: 'composition-versus-inheritance',
          title: 'Composition Versus Inheritance: Favoring Flexibility Over Rigid Hierarchies',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 3,
          summary: 'Examine the fragile base class problem, deep inheritance hierarchies, and composing behaviors using has-a relationships.',
          learning_objectives: [
            'Understand the Fragile Base Class problem in deep inheritance trees',
            'Contrast "is-a" relationships (Inheritance) with "has-a" relationships (Composition)',
            'Compose reusable behaviors by delegating tasks to dedicated helper components'
          ],
          content_markdown: `### The Fragile Base Class Trap

Novice OOP often creates deep, rigid inheritance hierarchies:
\`\`\`
Entity ──► DatabaseRecord ──► AuditableRecord ──► VersionedRecord ──► User
\`\`\`
- Changing a method in \`DatabaseRecord\` unintentionally breaks \`User\`.
- Subclasses inherit methods they don't need or shouldn't expose.
- Multiple inheritance creates diamond dependency confusion.

### "Favor Object Composition over Class Inheritance"

Instead of inheriting behavior (**is-a**), compose objects by holding references to collaborators (**has-a**):
- A \`Report\` **has a** \`Formatter\`.
- A \`UserService\` **has a** \`Repository\` and **has an** \`Authenticator\`.
- Behaviors can be swapped dynamically at runtime without subclassing.`,
          code_snippet: `class JsonFormatter:
    def format(self, title: str, body: str) -> str:
        return f'{{"title": "{title}", "body": "{body}"}}'

class PlainTextFormatter:
    def format(self, title: str, body: str) -> str:
        return f"=== {title} ===\\n{body}"

# Document COMPOSES a formatter rather than subclassing it!
class Document:
    def __init__(self, title: str, body: str, formatter):
        self.title = title
        self.body = body
        self.formatter = formatter # Composed behavior

    def render(self) -> str:
        return self.formatter.format(self.title, self.body)

doc = Document("System Report", "All microservices healthy", JsonFormatter())
print("Rendered JSON:      ", doc.render())

# Dynamically swap behavior at runtime!
doc.formatter = PlainTextFormatter()
print("Rendered Plain Text:\\n" + doc.render())`,
          code_language: 'python',
          code_explanation: 'Document composes a formatter object. Changing or swapping formatting behavior requires no subclasses and zero modification to Document.',
          expected_output: `Rendered JSON:       {"title": "System Report", "body": "All microservices healthy"}
Rendered Plain Text:
=== System Report ===
All microservices healthy`,
          quiz: {
            id: 'quiz-l4-comp-vs-inh',
            title: 'Composition vs Inheritance Check',
            questions: [
              {
                id: 'q-l4-ci-1',
                question_text: 'Why is object composition generally favored over deep class inheritance hierarchies?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Because Python disallows inheritance.' },
                  { id: 'opt_2', text: 'It creates looser coupling, avoids fragile base class bugs, and allows behaviors to be swapped dynamically at runtime.' },
                  { id: 'opt_3', text: 'Because composition runs in C.' },
                  { id: 'opt_4', text: 'Because inheritance takes more RAM.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Composition delegates tasks to independent collaborators, avoiding the tight coupling and unexpected side effects of deep inheritance trees.'
              }
            ]
          },
          key_takeaways: [
            'Favor "has-a" composition over "is-a" inheritance.',
            'Deep inheritance trees create brittle codebases where base class changes cascade unexpectedly.',
            'Composition allows swapping behaviors dynamically at runtime.'
          ],
          revision_prompts: [
            'When is inheritance genuinely appropriate in Python (e.g. custom exceptions)?',
            'How do mixin classes relate to composition and inheritance?'
          ]
        },

        // Lesson 4
        {
          id: 'les-l4-strategy-pattern-pythonic',
          slug: 'strategy-pattern',
          title: 'The Strategy Pattern: Replacing Conditional Sprawls with Interchangeable Algorithms',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 4,
          summary: 'Replace long if/elif chains with the Strategy Pattern using first-class functions and Protocol interfaces.',
          learning_objectives: [
            'Identify conditional complexity smells (if type == "A": ... elif type == "B": ...)',
            'Encapsulate interchangeable algorithms into independent Strategy objects or functions',
            'Execute strategies dynamically through a unified execution interface'
          ],
          content_markdown: `### The Conditional Sprawl Smell

When pricing rules, discount calculators, or serialization formats are buried in 20-branch \`if/elif\` statements:
- Every time marketing adds a new discount type, you must modify a massive, fragile function.
- Violates the **Open/Closed Principle** (open for extension, closed for modification).

### The Pythonic Strategy Pattern
Because functions in Python are first-class objects, a Strategy can be as simple as **a dictionary of callable functions** or a class implementing a common \`Protocol\`.`,
          code_snippet: `from typing import Callable

# Strategies defined as pure first-class functions
def flat_discount(amount: float) -> float:
    return max(0.0, amount - 10.0)

def vip_discount(amount: float) -> float:
    return amount * 0.80 # 20% off

def zero_discount(amount: float) -> float:
    return amount

# Strategy Registry
DISCOUNT_STRATEGIES: dict[str, Callable[[float], float]] = {
    "flat": flat_discount,
    "vip": vip_discount,
    "none": zero_discount
}

def calculate_checkout_price(subtotal: float, tier: str) -> float:
    # Lookup and execute strategy dynamically
    strategy = DISCOUNT_STRATEGIES.get(tier, zero_discount)
    return round(strategy(subtotal), 2)

print("Standard: $100 -> $", calculate_checkout_price(100.0, "none"))
print("Flat:     $100 -> $", calculate_checkout_price(100.0, "flat"))
print("VIP:      $100 -> $", calculate_checkout_price(100.0, "vip"))`,
          code_language: 'python',
          code_explanation: 'Adding a new discount strategy requires adding one pure function to the registry without touching the calculate_checkout_price logic.',
          expected_output: `Standard: $100 -> $ 100.0
Flat:     $100 -> $ 90.0
VIP:      $100 -> $ 80.0`,
          quiz: {
            id: 'quiz-l4-strategy',
            title: 'Strategy Pattern Check',
            questions: [
              {
                id: 'q-l4-sp-1',
                question_text: 'What major design principle does the Strategy Pattern uphold when replacing large if/elif branching logic?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The Open/Closed Principle (new strategies can be added without modifying existing execution functions).' },
                  { id: 'opt_2', text: 'The Single Thread Principle.' },
                  { id: 'opt_3', text: 'The Global Memory Principle.' },
                  { id: 'opt_4', text: 'The Dynamic Typing Principle.' }
                ],
                correct_option_ids: ['opt_1'],
                explanation: 'The Open/Closed Principle states that software entities should be open for extension (adding new strategies) but closed for modification (leaving core logic intact).'
              }
            ]
          },
          key_takeaways: [
            'The Strategy Pattern encapsulates algorithms into interchangeable units.',
            'In Python, strategies can be implemented cleanly with first-class functions or Protocols.',
            'Eliminates nested conditional branching and upholds the Open/Closed Principle.'
          ],
          revision_prompts: [
            'How can you use Python 3.10 match/case statements alongside the Strategy Pattern?',
            'When does a function-based strategy outshine a class-based strategy?'
          ]
        },

        // Lesson 5
        {
          id: 'les-l4-factory-pattern-registries',
          slug: 'factory-pattern-and-registries',
          title: 'The Factory Pattern and Plugin Registries: Decoupling Object Creation',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 5,
          summary: 'Decouple client code from concrete class instantiation using Factory methods and dynamic decorator-based registries.',
          learning_objectives: [
            'Centralize complex object instantiation logic inside Factory methods',
            'Build dynamic, extensible plugin registries using decorator-based registration',
            'Instantiate appropriate subclasses dynamically based on configuration keys'
          ],
          content_markdown: `### The Purpose of Factories

Client code should not need to know the exact concrete class or construction parameters required to create an object:
- Creating a cloud storage client might require setting up credentials, endpoints, retry policies, and timeouts.
- A **Factory** centralizes this creation logic in one place.

### The Decorator Plugin Registry Pattern
Instead of a hardcoded \`if/elif\` factory, modern architectures use a **registry dictionary** populated automatically with a registration decorator:

\`\`\`python
@register_exporter("csv")
class CsvExporter: ...
\`\`\``,
          code_snippet: `from typing import Protocol, Type

class DataExporter(Protocol):
    def export(self, data: list[dict]) -> str: ...

# Registry dictionary
EXPORTER_REGISTRY: dict[str, Type[DataExporter]] = {}

def register_exporter(format_name: str):
    """Decorator registering an exporter class."""
    def decorator(cls: Type[DataExporter]):
        EXPORTER_REGISTRY[format_name] = cls
        return cls
    return decorator

@register_exporter("csv")
class CsvExporter:
    def export(self, data: list[dict]) -> str:
        headers = ",".join(data[0].keys())
        rows = [",".join(str(v) for v in row.values()) for row in data]
        return f"{headers}\\n" + "\\n".join(rows)

@register_exporter("json")
class JsonExporter:
    def export(self, data: list[dict]) -> str:
        import json
        return json.dumps(data)

def exporter_factory(format_name: str) -> DataExporter:
    cls = EXPORTER_REGISTRY.get(format_name.lower())
    if not cls:
        raise ValueError(f"Unsupported format '{format_name}'. Available: {list(EXPORTER_REGISTRY.keys())}")
    return cls()

sample = [{"id": 1, "score": 95}, {"id": 2, "score": 88}]
csv_inst = exporter_factory("csv")
print("Factory output:\\n" + csv_inst.export(sample))`,
          code_language: 'python',
          code_explanation: 'The registry allows new exporters to register themselves dynamically via decorators without altering the factory function.',
          expected_output: `Factory output:
id,score
1,95
2,88`,
          quiz: {
            id: 'quiz-l4-factory',
            title: 'Factory Pattern Check',
            questions: [
              {
                id: 'q-l4-fp-1',
                question_text: 'Why is the decorator-based plugin registry pattern superior to a hardcoded factory with if/elif blocks?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It runs in compiled C speed.' },
                  { id: 'opt_2', text: 'New plugins can be added in separate modules simply by using the decorator, with zero modifications to the core factory.' },
                  { id: 'opt_3', text: 'It prevents using memory.' },
                  { id: 'opt_4', text: 'It disables typing checks.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A registry dictionary populated via decorators enables true extensibility. New classes register themselves automatically when imported.'
              }
            ]
          },
          key_takeaways: [
            'Factories encapsulate complex instantiation and configuration logic.',
            'Use decorator-driven registries to allow clean plugin expansion without editing core factories.',
            'Combine factories with Protocol interfaces for end-to-end loose coupling.'
          ],
          revision_prompts: [
            'How does importlib allow dynamic module loading in a factory at runtime?',
            'What is the difference between a Simple Factory, a Factory Method, and an Abstract Factory?'
          ]
        },

        // Lesson 6
        {
          id: 'les-l4-adapter-pattern-interfaces',
          slug: 'adapter-pattern',
          title: 'The Adapter Pattern: Harmonizing Incompatible Third-Party Interfaces',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 6,
          summary: 'Bridge incompatible third-party interfaces to internal domain contracts using object wrappers.',
          learning_objectives: [
            'Understand how the Adapter Pattern wraps foreign interfaces to conform to expected contracts',
            'Protect core application architecture from third-party vendor lock-in',
            'Translate foreign method signatures and exception types cleanly'
          ],
          content_markdown: `### The Vendor Lock-In Trap

Suppose your application integrates with a third-party SMS vendor:
- Their SDK uses methods like \`send_sms_message_v2(dest_phone, msg_payload)\`.
- If you call this method in 50 places across your codebase, migrating to a cheaper vendor in 6 months requires touching 50 files.

### The Adapter Pattern
Create an **Adapter** class that implements your internal \`SmsClient\` protocol and translates calls to the external vendor's SDK:
- Your application only ever talks to your internal interface.
- Switching vendors requires writing **one new adapter class**.`,
          code_snippet: `from typing import Protocol

# Internal Application Contract
class MessageService(Protocol):
    def send_notification(self, target: str, message: str) -> bool: ...

# Incompatible External Third-Party Library
class LegacyVendorSDK:
    def transmit_wire_packet(self, dest: str, body: str) -> dict:
        # Foreign method signature and return format
        print(f"[VENDOR WIRE] Transmitting payload to {dest}...")
        return {"status_code": 200, "ack": True}

# Adapter bridging LegacyVendorSDK to MessageService protocol
class VendorMessageAdapter:
    def __init__(self, vendor_sdk: LegacyVendorSDK):
        self._vendor = vendor_sdk

    def send_notification(self, target: str, message: str) -> bool:
        # Translates method name and return type
        res = self._vendor.transmit_wire_packet(target, message)
        return res.get("status_code") == 200

# Client code consumes the clean internal interface!
adapter: MessageService = VendorMessageAdapter(LegacyVendorSDK())
success = adapter.send_notification("+15550199", "Your verification code is 482910")
print("Adapter call successful:", success)`,
          code_language: 'python',
          code_explanation: 'VendorMessageAdapter wraps LegacyVendorSDK, translating foreign method names and response dictionaries into the clean internal interface.',
          expected_output: `[VENDOR WIRE] Transmitting payload to +15550199...
Adapter call successful: True`,
          quiz: {
            id: 'quiz-l4-adapter',
            title: 'Adapter Pattern Check',
            questions: [
              {
                id: 'q-l4-ap-1',
                question_text: 'What is the primary role of an Adapter in software architecture?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To convert synchronous code into asynchronous code.' },
                  { id: 'opt_2', text: 'To convert the interface of an existing class into another interface that callers expect, enabling incompatible classes to collaborate.' },
                  { id: 'opt_3', text: 'To increase network bandwidth.' },
                  { id: 'opt_4', text: 'To delete unused variables.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'An Adapter acts as a translator between two incompatible interfaces, shielding the core system from external API quirks and vendor churn.'
              }
            ]
          },
          key_takeaways: [
            'Adapters wrap foreign or legacy APIs to match expected internal domain contracts.',
            'Shields core business logic from third-party vendor SDK churn and breaking changes.',
            'Translates method signatures, data shapes, and vendor-specific exceptions.'
          ],
          revision_prompts: [
            'What is the difference between an Object Adapter (composition) and a Class Adapter (multiple inheritance)?',
            'How does the Facade pattern differ from the Adapter pattern?'
          ]
        },

        // Lesson 7
        {
          id: 'les-l4-observer-event-driven-design',
          slug: 'observer-and-event-driven-design',
          title: 'The Observer Pattern and Event-Driven Design: Decoupled Publish/Subscribe',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 7,
          summary: 'Build loosely-coupled event dispatchers and pub/sub notification brokers where publishers broadcast events without knowing consumers.',
          learning_objectives: [
            'Implement an in-memory EventDispatcher supporting event subscription and emission',
            'Decouple side effects (auditing, emails, metrics) from primary business transactions',
            'Handle listener errors gracefully without failing primary events'
          ],
          content_markdown: `### Decoupling Side Effects with Events

When a user signs up:
1. We must insert the user into the database.
2. We also want to: send a welcome email, generate an audit log, emit analytics metrics, and provision a trial license.

If all 4 side effects are written inside \`create_user()\`:
- An error in the analytics service crashes the user registration.
- The registration method grows into an unmaintainable monolith.

### The Observer (Pub/Sub) Pattern
1. Primary method creates user and publishes \`UserCreatedEvent\`.
2. Independent listeners (Emailer, Auditor, Analytics) subscribe to the event.
3. Publishers and subscribers know nothing about each other!`,
          code_snippet: `from typing import Callable, Any
from dataclasses import dataclass

@dataclass(frozen=True)
class UserCreatedEvent:
    user_id: int
    email: str

class EventBus:
    def __init__(self):
        self._subscribers: dict[type, list[Callable[[Any], None]]] = {}

    def subscribe(self, event_type: type, handler: Callable[[Any], None]):
        self._subscribers.setdefault(event_type, []).append(handler)

    def publish(self, event: Any):
        for handler in self._subscribers.get(type(event), []):
            try:
                handler(event)
            except Exception as e:
                print(f"[EVENT BUS ERROR] Handler failed: {e}")

bus = EventBus()

# Independent Subscribers
bus.subscribe(UserCreatedEvent, lambda e: print(f" -> [AUDIT LOG] Recorded creation of user {e.user_id}"))
bus.subscribe(UserCreatedEvent, lambda e: print(f" -> [EMAIL] Dispatched welcome email to {e.email}"))

# Publisher triggers event
print("Publishing UserCreatedEvent:")
bus.publish(UserCreatedEvent(user_id=101, email="alex@revoraa.com"))`,
          code_language: 'python',
          code_explanation: 'EventBus allows multiple subscribers to react to UserCreatedEvent independently without coupling the publisher to subscriber logic.',
          expected_output: `Publishing UserCreatedEvent:
 -> [AUDIT LOG] Recorded creation of user 101
 -> [EMAIL] Dispatched welcome email to alex@revoraa.com`,
          quiz: {
            id: 'quiz-l4-observer',
            title: 'Observer Pattern Check',
            questions: [
              {
                id: 'q-l4-ob-1',
                question_text: 'What is the architectural advantage of using an EventBus for secondary side effects like analytics and audit logging?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It encrypts database tables.' },
                  { id: 'opt_2', text: 'The core business operation can complete successfully without knowing about or being blocked by secondary listeners.' },
                  { id: 'opt_3', text: 'It converts the application into microservices.' },
                  { id: 'opt_4', text: 'It disables Python garbage collection.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Event-driven pub/sub isolates core business transactions from secondary side effects, preventing peripheral failures from breaking core operations.'
              }
            ]
          },
          key_takeaways: [
            'The Observer pattern decouples event publishers from event subscribers.',
            'Publishers emit strongly-typed event objects without knowing who is listening.',
            'Isolates side effects (emails, metrics, auditing) from core transaction logic.'
          ],
          revision_prompts: [
            'What is the difference between an in-memory event bus and an external message broker (RabbitMQ / Kafka)?',
            'How do asynchronous event dispatchers handle slow subscribers?'
          ]
        },

        // Lesson 8
        {
          id: 'les-l4-repository-pattern-boundaries',
          slug: 'repository-pattern-and-data-access-boundaries',
          title: 'The Repository Pattern: Isolating Persistence from Domain Rules',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 8,
          summary: 'Encapsulate SQL queries, ORM entities, and storage mechanics behind domain repository interfaces.',
          learning_objectives: [
            'Isolate domain entities from database ORM models or raw SQL queries',
            'Define repository contracts using Protocol or ABC',
            'Enable switching between SQLite, PostgreSQL, and in-memory test mocks without touching domain services'
          ],
          content_markdown: `### The Repository Boundary

A **Repository** mediates between the domain layer and data mapping layers:
- Exposes a collection-like interface for domain entities (\`add\`, \`get\`, \`list\`, \`remove\`).
- Hides whether data lives in PostgreSQL, SQLite, Redis, or an in-memory dictionary.
- Business services interact **only** with repository interfaces, never raw SQL connections!`,
          code_snippet: `from typing import Protocol
from dataclasses import dataclass

@dataclass
class Product:
    sku: str
    price: float
    stock: int

class ProductRepository(Protocol):
    def get_by_sku(self, sku: str) -> Product | None: ...
    def update_stock(self, sku: str, new_stock: int) -> None: ...

# In-Memory implementation used for unit testing
class InMemoryProductRepo:
    def __init__(self):
        self._data: dict[str, Product] = {}

    def get_by_sku(self, sku: str) -> Product | None:
        return self._data.get(sku)

    def update_stock(self, sku: str, new_stock: int) -> None:
        if sku in self._data:
            self._data[sku].stock = new_stock

# Domain service logic depends only on the contract
class InventoryService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def purchase_item(self, sku: str, quantity: int) -> bool:
        item = self.repo.get_by_sku(sku)
        if not item or item.stock < quantity:
            return False
        self.repo.update_stock(sku, item.stock - quantity)
        return True

repo = InMemoryProductRepo()
repo._data["LAPTOP_01"] = Product("LAPTOP_01", 1200.0, stock=5)

svc = InventoryService(repo)
success = svc.purchase_item("LAPTOP_01", 2)
print("Purchase successful:", success)
print("Updated stock:", repo.get_by_sku("LAPTOP_01").stock)`,
          code_language: 'python',
          code_explanation: 'InventoryService requires zero SQL or ORM knowledge. It coordinates business logic using the clean ProductRepository contract.',
          expected_output: `Purchase successful: True
Updated stock: 3`,
          quiz: {
            id: 'quiz-l4-repo-pattern',
            title: 'Repository Pattern Check',
            questions: [
              {
                id: 'q-l4-rp-1',
                question_text: 'What is the primary role of the Repository Pattern in clean architecture?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To automatically generate HTML templates.' },
                  { id: 'opt_2', text: 'To encapsulate data access and query logic behind a collection-like interface, isolating domain logic from storage details.' },
                  { id: 'opt_3', text: 'To manage git branches.' },
                  { id: 'opt_4', text: 'To run Docker containers.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Repositories mediate between domain models and persistence technologies, preventing SQL queries and ORM models from polluting business rules.'
              }
            ]
          },
          key_takeaways: [
            'Repositories present storage as an in-memory collection of domain entities.',
            'Encapsulates SQL queries, connections, and ORM mechanics.',
            'Allows swapping storage backends or mocking databases with zero business logic changes.'
          ],
          revision_prompts: [
            'What is the difference between the Repository pattern and the Active Record pattern?',
            'How does the Unit of Work pattern coordinate transactions across multiple repositories?'
          ]
        },

        // Lesson 9
        {
          id: 'les-l4-configuration-environment-separation',
          slug: 'configuration-and-environment-separation',
          title: 'Configuration and Environment Separation: The 12-Factor App in Python',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 9,
          summary: 'Separate configuration from code using environment variables, typed settings dataclasses, and fallback hierarchies.',
          learning_objectives: [
            'Enforce Factor III of The Twelve-Factor App (Store config in the environment)',
            'Avoid hardcoding credentials, hostnames, or secrets in code or git commits',
            'Build typed configuration loaders with default fallbacks and validation'
          ],
          content_markdown: `### Factor III of The Twelve-Factor App: Config

**Config varies across deploys (staging, production, local dev); code does not**:
- **Never Hardcode Secrets**: Storing API keys or database passwords in source code causes catastrophic security leaks when pushed to git.
- **Environment Variables**: The universal standard for injecting configuration into containers and serverless environments.

### Typed Settings Dataclasses
Instead of scattering \`os.environ.get("PORT")\` across 30 files, load and validate all configuration once at startup into an immutable dataclass:`,
          code_snippet: `import os
from dataclasses import dataclass

@dataclass(frozen=True)
class AppConfig:
    environment: str
    port: int
    db_timeout_seconds: float
    debug_mode: bool

    @classmethod
    def from_env(cls) -> "AppConfig":
        return cls(
            environment=os.environ.get("APP_ENV", "development"),
            port=int(os.environ.get("APP_PORT", "8000")),
            db_timeout_seconds=float(os.environ.get("DB_TIMEOUT", "5.0")),
            debug_mode=os.environ.get("DEBUG", "false").lower() in ("true", "1")
        )

# Load configuration at startup
config = AppConfig.from_env()
print(f"Loaded config: env={config.environment}, port={config.port}, timeout={config.db_timeout_seconds}s")`,
          code_language: 'python',
          code_explanation: 'AppConfig centralizes environment variable parsing and type casting into a single validated immutable configuration object.',
          expected_output: `Loaded config: env=development, port=8000, timeout=5.0s`,
          quiz: {
            id: 'quiz-l4-twelve-factor',
            title: 'Configuration Architecture Check',
            questions: [
              {
                id: 'q-l4-cf-1',
                question_text: 'According to 12-Factor App principles, where should database credentials and environment-specific settings be stored?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Hardcoded in Python source code files.' },
                  { id: 'opt_2', text: 'In environment variables injected into the execution container.' },
                  { id: 'opt_3', text: 'Committed to public GitHub repositories in plaintext.' },
                  { id: 'opt_4', text: 'In a global variable inside main.py.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: '12-Factor App design mandates that configuration which varies between deployment stages (dev, staging, prod) must be injected via environment variables.'
              }
            ]
          },
          key_takeaways: [
            'Never commit credentials, secrets, or environment-specific URLs to version control.',
            'Inject configuration via environment variables.',
            'Centralize and validate configuration in a typed settings dataclass at application startup.'
          ],
          revision_prompts: [
            'How does pydantic-settings streamline environment variable parsing and validation?',
            'What is the security risk of printing the entire os.environ dictionary to logs?'
          ]
        },

        // Lesson 10
        {
          id: 'les-l4-error-boundaries-service-interfaces',
          slug: 'error-boundaries-and-service-interfaces',
          title: 'Error Boundaries and Service Interfaces: Clean Exception Hierarchies',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 10,
          summary: 'Build domain-specific exception hierarchies and error translation boundaries to prevent leaky abstraction failures.',
          learning_objectives: [
            'Design clean, inheritance-based domain exception hierarchies',
            'Translate low-level driver exceptions (e.g., sqlite3.OperationalError) into high-level domain errors',
            'Prevent internal database or library errors from leaking to external API clients'
          ],
          content_markdown: `### Leaky Exceptions Anti-Pattern

If your database repository throws \`psycopg2.OperationalError: server closed connection\`, and your HTTP API directly returns that raw exception:
- Your presentation layer is now tightly coupled to PostgreSQL internals.
- Internal database details and connection strings leak to external users.
- A future migration to DynamoDB breaks API error handling contracts.

### Exception Translation Boundaries
Repositories and adapters should catch low-level infrastructure exceptions and re-raise **domain-specific exceptions**:

\`\`\`
sqlite3.IntegrityError ──► [Repository Boundary] ──► raise DuplicateEntityError()
\`\`\``,
          code_snippet: `class DomainError(Exception):
    """Base exception for all domain errors."""

class EntityNotFoundError(DomainError):
    """Raised when an entity does not exist."""

class DuplicateEntityError(DomainError):
    """Raised when a unique constraint is violated."""

class MockDatabaseAdapter:
    def execute_query(self, query: str):
        # Simulates low-level driver error
        raise ConnectionRefusedError("Socket /var/run/db.sock: Connection refused")

class UserRepository:
    def __init__(self, db: MockDatabaseAdapter):
        self.db = db

    def get_user(self, user_id: int):
        try:
            return self.db.execute_query(f"SELECT * FROM users WHERE id = {user_id}")
        except ConnectionRefusedError as err:
            # Catch low-level infrastructure error and translate to domain exception
            raise DomainError("Database storage temporarily unavailable") from err

try:
    repo = UserRepository(MockDatabaseAdapter())
    repo.get_user(42)
except DomainError as e:
    print(f"Caught clean domain error: {e}")
    print(f"Original cause preserved: {type(e.__cause__).__name__}")`,
          code_language: 'python',
          code_explanation: 'The repository boundary catches the driver ConnectionRefusedError and translates it to a clean DomainError, preserving the original cause via from err.',
          expected_output: `Caught clean domain error: Database storage temporarily unavailable
Original cause preserved: ConnectionRefusedError`,
          quiz: {
            id: 'quiz-l4-error-boundaries',
            title: 'Error Boundaries Check',
            questions: [
              {
                id: 'q-l4-eb-1',
                question_text: 'What is the purpose of translating low-level driver exceptions into custom domain exceptions at repository boundaries?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To hide errors so they cannot be fixed.' },
                  { id: 'opt_2', text: 'To prevent infrastructure details from leaking into business logic and keep exception contracts stable regardless of storage vendor.' },
                  { id: 'opt_3', text: 'Because Python requires all exceptions to have the word Domain in their name.' },
                  { id: 'opt_4', text: 'To make code execute faster.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Exception translation isolates callers from third-party driver implementation details, preserving clean abstractions and stable error handling.'
              }
            ]
          },
          key_takeaways: [
            'Create a domain exception hierarchy inheriting from a shared project base exception.',
            'Translate low-level driver and network exceptions into domain exceptions at module boundaries.',
            'Use raise NewException() from err to preserve the original exception context.'
          ],
          revision_prompts: [
            'What is the difference between raise ... from err and naked raise ... in Python exception chaining?',
            'How does __cause__ and __context__ differ on a Python exception object?'
          ]
        },

        // Lesson 11
        {
          id: 'les-l4-avoiding-unnecessary-abstractions',
          slug: 'avoiding-unnecessary-abstractions',
          title: 'Avoiding Unnecessary Abstractions: Fighting Over-Engineering and Premature Generalization',
          lesson_type: 'reading',
          estimated_minutes: 12,
          xp_reward: 35,
          is_published: true,
          sort_order: 11,
          summary: 'Balance clean architecture with YAGNI (You Aren\'t Gonna Need It) and the Rule of Three.',
          learning_objectives: [
            'Recognize premature abstraction and over-engineering smells',
            'Apply the Rule of Three: Write it once, write it twice, abstract on the third repetition',
            'Keep simple applications simple rather than forcing enterprise architectural patterns'
          ],
          content_markdown: `### The Enterprise Architecture Trap in Python

A trap common among intermediate engineers learning patterns:
- Creating an \`AbstractFactoryProviderInterface\`, a \`BaseRepositoryCoordinator\`, and 10 layers of indirection for a simple script that reads a CSV and prints 3 lines.
- **YAGNI (You Aren't Gonna Need It)**: Do not build flexible plugin architectures for features that have not been requested and may never exist.

### The Rule of Three
1. **First time**: Just write the concrete code cleanly.
2. **Second time**: Duplicate it or slightly adapt it with minimal ceremony.
3. **Third time**: Now that you have three concrete examples of the pattern, extract a clean abstraction. Abstracting before you have three examples almost always yields the wrong abstraction!`,
          code_snippet: `def demonstrate_pragmatic_design():
    # Anti-Pattern: Over-engineered abstraction for simple multiplication
    # class AbstractMultiplierFactory(Protocol): ...
    
    # Pragmatic Python: Clear, direct, zero ceremony
    def calculate_discount(price: float, rate: float = 0.10) -> float:
        return price * (1.0 - rate)

    print("Pragmatic discount calculation:", calculate_discount(100.0))
    print("Rule: Solve the actual problem directly before introducing architectural indirection.")

demonstrate_pragmatic_design()`,
          code_language: 'python',
          code_explanation: 'Emphasizes pragmatic simplicity over unnecessary architectural layers for straightforward requirements.',
          expected_output: `Pragmatic discount calculation: 90.0
Rule: Solve the actual problem directly before introducing architectural indirection.`,
          quiz: {
            id: 'quiz-l4-yagni',
            title: 'Pragmatic Architecture Check',
            questions: [
              {
                id: 'q-l4-yg-1',
                question_text: 'What does the "Rule of Three" advise regarding when to extract an abstraction?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Abstract code before writing the first line.' },
                  { id: 'opt_2', text: 'Wait until you have three real, concrete occurrences of duplicate behavior before introducing an abstraction, avoiding speculative generalization.' },
                  { id: 'opt_3', text: 'Never write more than three functions per file.' },
                  { id: 'opt_4', text: 'Every class must have three subclasses.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Abstracting too early leads to the wrong abstraction. Waiting for three concrete instances ensures the abstraction matches actual observed needs.'
              }
            ]
          },
          key_takeaways: [
            'Do not introduce design patterns speculatively before they are needed (YAGNI).',
            'Follow the Rule of Three: duplicate before creating premature abstractions.',
            'Simplicity and readability are core Pythonic architectural virtues.'
          ],
          revision_prompts: [
            'What did Sandi Metz mean by "duplication is far cheaper than the wrong abstraction"?',
            'How can you tell when an abstraction is helping vs getting in the way?'
          ]
        },

        // Lesson 12
        {
          id: 'les-l4-refactoring-maintainable-architecture',
          slug: 'refactoring-toward-maintainable-architecture',
          title: 'Refactoring Toward Maintainable Architecture: Evolutionary Design Workflows',
          lesson_type: 'reading',
          estimated_minutes: 15,
          xp_reward: 40,
          is_published: true,
          sort_order: 12,
          summary: 'Execute safe, step-by-step architectural refactorings guided by automated test suites and the Strangler Fig pattern.',
          learning_objectives: [
            'Refactor legacy monolithic functions incrementally under the safety of characterization tests',
            'Apply the Strangler Fig pattern to replace legacy subsystems gradually',
            'Maintain continuous verification with zero service downtime during architectural shifts'
          ],
          content_markdown: `### Safe Refactoring Workflows

Refactoring is **changing the internal structure of software without altering its external behavior**:

1. **Step 1: Characterization Tests**: Before modifying code, write automated tests locking down existing input/output behavior (golden master tests).
2. **Step 2: Small, Atomic Commits**: Extract small functions, introduce parameter objects, and rename methods one step at a time. Run tests after every single change.
3. **Step 3: The Strangler Fig Pattern**: When migrating a subsystem (e.g. replacing an old billing engine with a new service), route new traffic incrementally to the new service while legacy traffic drains, rather than risking a dangerous "big bang" rewrite.`,
          code_snippet: `def legacy_monolith(payload: dict) -> dict:
    """Simulated legacy monolithic logic."""
    if "user" not in payload:
        return {"error": "Missing user"}
    total = sum(payload.get("items", []))
    tax = total * 0.08
    return {"user": payload["user"], "total": total + tax}

# Step 1: Extract helper without breaking contract
def calculate_tax(subtotal: float) -> float:
    return subtotal * 0.08

# Step 2: Refactored modular version
def refactored_order_service(payload: dict) -> dict:
    if "user" not in payload:
        return {"error": "Missing user"}
    total = sum(payload.get("items", []))
    return {"user": payload["user"], "total": total + calculate_tax(total)}

# Step 3: Verify behavioral parity
test_payload = {"user": "alex", "items": [100.0, 50.0]}
assert legacy_monolith(test_payload) == refactored_order_service(test_payload)
print("Behavioral parity verified: Refactored architecture passes all tests!")`,
          code_language: 'python',
          code_explanation: 'Demonstrates incremental refactoring verified by asserting exact parity between the legacy monolith and the modularized service.',
          expected_output: `Behavioral parity verified: Refactored architecture passes all tests!`,
          quiz: {
            id: 'quiz-l4-refactoring',
            title: 'Refactoring Workflows Check',
            questions: [
              {
                id: 'q-l4-rf-1',
                question_text: 'What is the mandatory prerequisite before beginning an architectural refactor of a legacy codebase?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Deleting the existing git repository.' },
                  { id: 'opt_2', text: 'Having a comprehensive automated test suite verifying current observable behavior.' },
                  { id: 'opt_3', text: 'Rewriting everything from scratch in a new language.' },
                  { id: 'opt_4', text: 'Turning off all error logging.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'You cannot safely refactor without automated tests proving that changes improve internal structure without breaking external behavior.'
              }
            ]
          },
          key_takeaways: [
            'Refactoring improves internal code architecture without modifying observable behavior.',
            'Never refactor without a safety net of automated regression tests.',
            'Use the Strangler Fig pattern to replace legacy systems incrementally rather than big-bang rewrites.'
          ],
          revision_prompts: [
            'What is the difference between a refactoring and a feature addition?',
            'How do code smells (e.g. Long Method, Feature Envy) signal specific refactoring recipes?'
          ]
        }
      ]
    }
  ]
};
