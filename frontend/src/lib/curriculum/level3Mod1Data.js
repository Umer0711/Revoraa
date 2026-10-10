/**
 * Revoraa Level 3: Intermediate Python - Module 1: Advanced Data Structures
 * 
 * 8 comprehensive lessons covering collections, nested structures, custom sorting,
 * stacks/queues, and Big-O computational complexity.
 */

export const MODULE_1_ADVANCED_DATA_STRUCTURES = {
  id: 'mod-py-adv-datastruct',
  slug: 'advanced-data-structures',
  level_number: 3,
  title: 'Advanced Data Structures',
  description: 'Deep dive into Python collections, nested records, custom key sorting, stacks, queues, and Big-O complexity.',
  estimated_hours: 6,
  sort_order: 1,
  is_published: true,
  topics: [
    {
      id: 'top-adv-collections',
      slug: 'collections-and-complexity',
      title: 'Python Collections & Algorithmic Performance',
      summary: 'Master lists, dicts, sets, custom sorting, and time/space complexity tradeoffs.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-revisiting-core-collections',
          slug: 'revisiting-core-collections',
          title: 'Revisiting Lists, Tuples, Sets, and Dictionaries',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Analyze the underlying memory layout, mutability rules, and hashability requirements of Python core collections.',
          learning_objectives: [
            'Differentiate contiguous memory allocations in lists from fixed-size tuples',
            'Understand hash table bucket lookups and hashability constraints in sets and dicts',
            'Inspect heap memory consumption using sys.getsizeof()'
          ],
          content_markdown: `### The Memory Architecture of Core Collections

In Python, not all collections are stored equally in memory:

1. **Lists (\`list\`)**: Dynamic arrays storing pointers to objects on the heap. Python over-allocates memory so \`append()\` runs in amortized $O(1)$ time. However, inserting at index 0 requires shifting all pointers ($O(N)$).
2. **Tuples (\`tuple\`)**: Immutable sequences. Because their size never changes, CPython allocates exactly the required memory with no spare capacity, making them more memory-efficient and slightly faster to instantiate.
3. **Dictionaries (\`dict\`) & Sets (\`set\`)**: Hash tables. Python uses open addressing with perturbation probing. Elements are hashed with \`hash()\`. For a key to be valid, it **must be hashable** (immutable throughout its lifetime).

\`\`\`
Collection   Mutability   Hashable?   Average Access Time
List         Mutable      No          O(1) by index
Tuple        Immutable    Yes*        O(1) by index
Dictionary   Mutable      No          O(1) by key
Set          Mutable      No          O(1) membership check
\`\`\`
*\*A tuple is hashable only if all of its contained items are also hashable.*

### Common Misconception
- **Myth**: Tuples are just read-only lists.
- **Reality**: Tuples are designed for heterogeneous record structures (like a database row \`(id, name, email)\`), whereas lists are designed for homogeneous collections of dynamic size.`,
          code_snippet: `import sys

# Comparing memory allocation between dynamic lists and immutable tuples
sample_data = [10, 20, 30, 40, 50]
list_obj = list(sample_data)
tuple_obj = tuple(sample_data)

print(f"List memory size:  {sys.getsizeof(list_obj)} bytes")
print(f"Tuple memory size: {sys.getsizeof(tuple_obj)} bytes")

# Demonstrate hashability constraint
try:
    bad_dict = { [1, 2]: "invalid key" }
except TypeError as err:
    print(f"Hashability check caught: {err}")

# Valid tuple as dict key
good_dict = { (1, 2): "valid coordinate" }
print(f"Tuple key access: {good_dict[(1, 2)]}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates memory footprint differences between lists and tuples using sys.getsizeof(), and illustrates why mutable lists raise TypeError: unhashable type when used as dictionary keys.',
          expected_output: `List memory size:  104 bytes
Tuple memory size: 80 bytes
Hashability check caught: unhashable type: 'list'
Tuple key access: valid coordinate`,
          quiz: {
            id: 'quiz-revisiting-core-collections',
            title: 'Knowledge Check: Core Collection Internals',
            questions: [
              {
                id: 'q-coll-1',
                question_text: 'Why can a list NOT be used as a key in a Python dictionary?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Lists are stored in contiguous memory.' },
                  { id: 'opt_2', text: 'Lists are mutable and do not implement a stable __hash__ method.' },
                  { id: 'opt_3', text: 'Dictionaries only accept string keys.' },
                  { id: 'opt_4', text: 'Python dictionaries use binary search trees rather than hash tables.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Dictionary keys must be hashable. Because lists can be modified in-place, their hash value would change, corrupting the hash table lookup.'
              },
              {
                id: 'q-coll-2',
                question_text: 'When is a tuple NOT hashable in Python?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'When it contains more than 10 elements.' },
                  { id: 'opt_2', text: 'When it contains any mutable element (such as a list).' },
                  { id: 'opt_3', text: 'Tuples are always hashable regardless of contents.' },
                  { id: 'opt_4', text: 'When instantiated using tuple() rather than literal parentheses.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A tuple computes its hash recursively from its items. If any nested element is unhashable (like a list), the tuple itself is unhashable.'
              }
            ]
          },
          key_takeaways: [
            'Lists over-allocate memory to achieve amortized O(1) appends.',
            'Tuples are compact, immutable, and hashable if their elements are hashable.',
            'Dictionaries and sets provide O(1) average lookups using hash tables.'
          ],
          revision_prompts: [
            'What happens under the hood when a hash collision occurs in a Python dictionary?',
            'Why is inserting at the beginning of a list an O(N) operation?'
          ]
        },

        // Lesson 2
        {
          id: 'les-nested-collections-structures',
          slug: 'nested-collections-and-structures',
          title: 'Nested Collections and Complex Data Structures',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Structure complex data models using nested dictionaries, lists, and tuples, avoiding shallow copy mutation traps.',
          learning_objectives: [
            'Design nested schemas for real-world hierarchical entities',
            'Differentiate shallow copies (copy.copy()) from deep copies (copy.deepcopy())',
            'Traverse and mutate deeply nested tree-like data structures safely'
          ],
          content_markdown: `### Hierarchical Data Modeling

In intermediate Python, real-world data rarely arrives as flat lists. You frequently interact with nested structures such as JSON payloads, database trees, and configuration trees:

\`\`\`python
student = {
    "id": 101,
    "name": "Aarav Sharma",
    "grades": {
        "math": [88, 92, 95],
        "physics": [78, 85, 90]
    },
    "attendance": {"present": 42, "absent": 3}
}
\`\`\`

### The Shallow Copy Trap

When you copy a container using slicing (\`data[:]\`) or \`data.copy()\`, Python only copies the **outermost container**. The inner nested objects remain references to the original heap locations!

\`\`\`python
import copy

original = {"scores": [10, 20]}
shallow = original.copy()
shallow["scores"].append(99)
# original["scores"] now ALSO contains 99!

deep = copy.deepcopy(original)
deep["scores"].append(100)
# original["scores"] is unaffected!
\`\`\``,
          code_snippet: `import copy

# Nested student profile
student = {
    "name": "Priya",
    "scores": {"midterm": 85, "final": 90},
    "courses": ["Python", "DSA"]
}

# 1. Shallow copy demonstration
shallow_clone = student.copy()
shallow_clone["courses"].append("Databases")

# 2. Deep copy demonstration
deep_clone = copy.deepcopy(student)
deep_clone["scores"]["final"] = 98

print("Original courses:", student["courses"])
print("Original final score:", student["scores"]["final"])
print("Deep clone final score:", deep_clone["scores"]["final"])`,
          code_language: 'python',
          code_explanation: 'Shows how shallow copying copies references to inner mutable lists (affecting the original), whereas copy.deepcopy() duplicates all nested objects recursively.',
          expected_output: `Original courses: ['Python', 'DSA', 'Databases']
Original final score: 90
Deep clone final score: 98`,
          quiz: {
            id: 'quiz-nested-collections',
            title: 'Knowledge Check: Nested Data and Copying',
            questions: [
              {
                id: 'q-nest-1',
                question_text: 'What happens if you modify a nested list inside a shallow copy created with dict.copy()?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The modification is isolated to the copy.' },
                  { id: 'opt_2', text: 'The original dictionary also reflects the change because both share the same inner list reference.' },
                  { id: 'opt_3', text: 'Python raises a CopyMutationError.' },
                  { id: 'opt_4', text: 'The original dictionary becomes None.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Shallow copies duplicate only the outer mapping; values that point to heap objects share the exact same pointers.'
              }
            ]
          },
          key_takeaways: [
            'Nested structures model hierarchical real-world data effectively.',
            'Shallow copies share inner references; use copy.deepcopy() when deep isolation is needed.',
            'Access nested values safely using chained .get() or guard clauses.'
          ],
          revision_prompts: [
            'When is copy.deepcopy() computationally expensive?',
            'How can you safely access a key 3 levels deep without raising KeyError?'
          ]
        },

        // Lesson 3
        {
          id: 'les-dictionary-methods-patterns',
          slug: 'dictionary-methods-and-patterns',
          title: 'Dictionary Methods and Practical Patterns',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Master dict.get(), setdefault(), collections.defaultdict, Counter, and Python 3.9+ dictionary merge operators.',
          learning_objectives: [
            'Use dict.get() and setdefault() to eliminate manual key-existence checks',
            'Leverage collections.defaultdict and collections.Counter for groupings and tallies',
            'Apply dictionary union (|) and in-place update (|=) operators'
          ],
          content_markdown: `### Modern Dictionary Idioms

Python dictionaries are central to Python programming. Instead of writing verbose boilerplate:

\`\`\`python
# Anti-pattern: Verbose check
if key not in counts:
    counts[key] = 0
counts[key] += 1
\`\`\`

Idiomatic Python offers specialized patterns:

1. **\`dict.get(key, default)\`**: Returns \`default\` without inserting into the dictionary.
2. **\`dict.setdefault(key, default)\`**: Inserts \`key: default\` if missing, then returns the value.
3. **\`collections.defaultdict(callable)\`**: Automatically initializes missing keys using the factory function (e.g. \`list\`, \`int\`, \`set\`).
4. **\`collections.Counter\`**: High-performance multiset for tallying elements.
5. **Merge Operators (Python 3.9+)**: \`merged = dict_a | dict_b\` combines dictionaries, where \`dict_b\` values overwrite collisions.`,
          code_snippet: `from collections import defaultdict, Counter

# 1. Grouping records with defaultdict
records = [
    ("engineering", "Alice"),
    ("design", "Bob"),
    ("engineering", "Charlie"),
    ("marketing", "Diana")
]

dept_members = defaultdict(list)
for dept, name in records:
    dept_members[dept].append(name)

print("Engineering team:", dept_members["engineering"])

# 2. Fast frequency tally with Counter
text = "apple banana apple cherry apple banana"
counts = Counter(text.split())
print("Top 2 fruits:", counts.most_common(2))

# 3. Modern merge operators (|)
default_config = {"theme": "dark", "timeout": 30, "debug": False}
user_config = {"debug": True, "api_key": "sec_123"}
final_config = default_config | user_config
print("Final config timeout:", final_config["timeout"])
print("Final config debug:", final_config["debug"])`,
          code_language: 'python',
          code_explanation: 'Illustrates grouping items with defaultdict(list), frequency tallying with Counter, and combining configuration dictionaries using the | operator.',
          expected_output: `Engineering team: ['Alice', 'Charlie']
Top 2 fruits: [('apple', 3), ('banana', 2)]
Final config timeout: 30
Final config debug: True`,
          quiz: {
            id: 'quiz-dict-patterns',
            title: 'Knowledge Check: Dictionary Methods',
            questions: [
              {
                id: 'q-dp-1',
                question_text: 'What happens when you access a non-existent key in a collections.defaultdict(list)?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It raises a KeyError.' },
                  { id: 'opt_2', text: 'It returns None.' },
                  { id: 'opt_3', text: 'It automatically invokes list(), inserts the key with an empty list [], and returns it.' },
                  { id: 'opt_4', text: 'It converts the dictionary into a tuple.' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'defaultdict calls its default_factory whenever a missing key is accessed, automatically populating the entry.'
              }
            ]
          },
          key_takeaways: [
            'defaultdict eliminates defensive key presence checks.',
            'Counter provides convenient frequency analysis and .most_common() sorting.',
            'Python 3.9+ supports dict_a | dict_b for clean dictionary merging.'
          ],
          revision_prompts: [
            'What is the difference between dict.get(k, []) and dict.setdefault(k, [])?',
            'How does Counter subtraction differ from standard dictionary manipulation?'
          ]
        },

        // Lesson 4
        {
          id: 'les-set-operations-optimization',
          slug: 'set-operations-and-optimization',
          title: 'Set Operations and Membership Optimization',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Accelerate search lookups from O(N) to O(1) and compute mathematical set unions, intersections, and symmetric differences.',
          learning_objectives: [
            'Perform set union (|), intersection (&), difference (-), and symmetric difference (^)',
            'Understand how set hashing enables O(1) average lookup times over O(N) list searches',
            'Preserve order while deduplicating sequences using dict.fromkeys()'
          ],
          content_markdown: `### Set Algebra in Python

Sets are unordered collections of unique, hashable objects. They support expressive mathematical operators:

- **Union (\`A | B\`)**: Elements in either $A$ or $B$.
- **Intersection (\`A & B\`)**: Elements present in both $A$ and $B$.
- **Difference (\`A - B\`)**: Elements in $A$ that are not in $B$.
- **Symmetric Difference (\`A ^ B\`)**: Elements in $A$ or $B$, but NOT both.

### Algorithmic Optimization

Checking \`x in my_list\` requires scanning items one by one ($O(N)$ linear search). In contrast, checking \`x in my_set\` calculates \`hash(x)\` and probes the bucket directly ($O(1)$ constant time).

When checking 100,000 items, converting a lookup collection to a \`set\` reduces query time from several minutes to mere milliseconds.

### Order-Preserving Deduplication
Converting a list to a \`set\` (\`list(set(items))\`) discards original element ordering. To preserve order while removing duplicates:

\`\`\`python
# Fast, idiomatic, order-preserving deduplication (Python 3.7+)
unique_ordered = list(dict.fromkeys(items))
\`\`\``,
          code_snippet: `# 1. Mathematical Set Operations
team_frontend = {"Alice", "Bob", "Charlie", "David"}
team_backend  = {"Charlie", "David", "Eve", "Frank"}

print("Full-stack engineers (Intersection):", sorted(team_frontend & team_backend))
print("Frontend-only (Difference):          ", sorted(team_frontend - team_backend))
print("Specialists only (Symmetric Diff):   ", sorted(team_frontend ^ team_backend))

# 2. Order-preserving deduplication
raw_ids = [102, 105, 102, 101, 105, 108, 101]
deduped_ordered = list(dict.fromkeys(raw_ids))
print("Order-preserved deduplication:       ", deduped_ordered)`,
          code_language: 'python',
          code_explanation: 'Demonstrates set intersection, difference, and symmetric difference operators, and shows how dict.fromkeys() removes duplicates while preserving original sequence order.',
          expected_output: `Full-stack engineers (Intersection): ['Charlie', 'David']
Frontend-only (Difference):           ['Alice', 'Bob']
Specialists only (Symmetric Diff):    ['Alice', 'Bob', 'Eve', 'Frank']
Order-preserved deduplication:        [102, 105, 101, 108]`,
          quiz: {
            id: 'quiz-set-operations',
            title: 'Knowledge Check: Set Operations and Complexity',
            questions: [
              {
                id: 'q-set-1',
                question_text: 'What is the average time complexity of checking membership (item in collection) in a Python set?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'O(N)' },
                  { id: 'opt_2', text: 'O(log N)' },
                  { id: 'opt_3', text: 'O(1)' },
                  { id: 'opt_4', text: 'O(N^2)' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'Python sets use hash tables with bucket indexing, delivering O(1) average lookup time.'
              }
            ]
          },
          key_takeaways: [
            'Set lookups are O(1) average time compared to O(N) list scans.',
            'Set operators (&, |, -, ^) express set-algebra operations cleanly.',
            'Use list(dict.fromkeys(seq)) to remove duplicates while preserving ordering.'
          ],
          revision_prompts: [
            'When can a set lookup degrade to O(N) worst-case time?',
            'What is the difference between set.remove() and set.discard()?'
          ]
        },

        // Lesson 5
        {
          id: 'les-sorting-custom-keys',
          slug: 'sorting-with-custom-keys',
          title: 'Sorting with Custom Keys and Multi-Criteria Ranking',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Master list.sort() vs sorted(), Timsort stability, lambda key functions, operator.itemgetter, and multi-field tuple sorting.',
          learning_objectives: [
            'Differentiate in-place list.sort() from the built-in sorted() function',
            'Write custom key extraction functions using lambda and operator.itemgetter',
            'Implement multi-criteria sorting using tuple keys (e.g., primary ascending, secondary descending)'
          ],
          content_markdown: `### Sorting Mechanics: Timsort

Python uses **Timsort**, an adaptive, stable sorting algorithm combining Merge Sort and Insertion Sort:
- **Time Complexity**: $O(N \\log N)$ worst/average case; $O(N)$ best case on partially sorted data.
- **Stability**: Equal keys preserve their original relative order.

### \`list.sort()\` vs \`sorted()\`

- \`my_list.sort(key=..., reverse=...)\`: Mutates the list **in-place** and returns \`None\`.
- \`sorted(iterable, key=..., reverse=...)\`: Returns a **brand new list**, leaving the input untouched.

### Multi-Criteria Sorting with Tuples

Python compares tuples lexicographically: element by element. To sort by grade descending, then name ascending:

\`\`\`python
# Notice -score negates numbers for descending order while keeping ascending string sorting
students.sort(key=lambda s: (-s["score"], s["name"]))
\`\`\``,
          code_snippet: `from operator import itemgetter

students = [
    {"name": "Zaid",  "grade": 10, "score": 92},
    {"name": "Amina", "grade": 11, "score": 95},
    {"name": "Bilal", "grade": 10, "score": 88},
    {"name": "Chetan", "grade": 10, "score": 92}
]

# 1. Single-key sort with itemgetter
by_grade = sorted(students, key=itemgetter("grade"))
print("Sorted by grade:")
for s in by_grade:
    print(f"  {s['name']} (Grade {s['grade']})")

# 2. Multi-criteria sort: Grade ascending, Score descending (-score), Name ascending
students.sort(key=lambda s: (s["grade"], -s["score"], s["name"]))
print("\\nMulti-criteria sort (Grade asc, Score desc, Name asc):")
for s in students:
    print(f"  {s['name']}: Grade {s['grade']}, Score {s['score']}")`,
          code_language: 'python',
          code_explanation: 'Shows itemgetter for clean dictionary key sorting and tuple return values in lambda functions for multi-criteria sorting with negative numbers for descending rank.',
          expected_output: `Sorted by grade:
  Zaid (Grade 10)
  Bilal (Grade 10)
  Chetan (Grade 10)
  Amina (Grade 11)

Multi-criteria sort (Grade asc, Score desc, Name asc):
  Chetan: Grade 10, Score 92
  Zaid: Grade 10, Score 92
  Bilal: Grade 10, Score 88
  Amina: Grade 11, Score 95`,
          quiz: {
            id: 'quiz-sorting-custom-keys',
            title: 'Knowledge Check: Custom Sorting',
            questions: [
              {
                id: 'q-sort-1',
                question_text: 'What is returned when you call my_list.sort()?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'A newly sorted list.' },
                  { id: 'opt_2', text: 'None (it sorts in-place).' },
                  { id: 'opt_3', text: 'The length of the list.' },
                  { id: 'opt_4', text: 'A generator yielding sorted items.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'list.sort() mutates the list in-place and returns None to prevent confusion with creating a new copy.'
              }
            ]
          },
          key_takeaways: [
            'sorted() returns a new list; list.sort() mutates in-place.',
            'Timsort is stable and runs in O(N log N) worst-case time.',
            'Tuples in key functions enable clean multi-level sorting.'
          ],
          revision_prompts: [
            'How can you sort a list of strings by length first, then alphabetically?',
            'Why does Timsort take O(N) time on already sorted data?'
          ]
        },

        // Lesson 6
        {
          id: 'les-stacks-and-queues',
          slug: 'stacks-and-queues',
          title: 'Stacks and Queues Using Python Collections',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Implement LIFO stacks using lists and high-performance FIFO queues using collections.deque with O(1) operations.',
          learning_objectives: [
            'Implement a LIFO (Last-In-First-Out) stack using list.append() and list.pop()',
            'Understand why list.pop(0) is an O(N) anti-pattern for FIFO queues',
            'Leverage collections.deque for O(1) appends and pops from both ends'
          ],
          content_markdown: `### LIFO Stacks vs FIFO Queues

- **Stack (LIFO)**: The last element added is the first one removed. Common uses: undo history, syntax parsing, depth-first search (DFS).
- **Queue (FIFO)**: The first element added is the first one removed. Common uses: task processing, print buffers, breadth-first search (BFS).

### The \`list.pop(0)\` Performance Trap

A standard Python list handles \`append()\` and \`pop()\` at the right end in $O(1)$ time. However, removing from the left end with \`list.pop(0)\` forces Python to **shift every remaining element left by one slot**, running in $O(N)$ time.

For queues, always use **\`collections.deque\`** (double-ended queue), which is implemented as a doubly-linked list of memory blocks delivering guaranteed **$O(1)$** operations on both ends:
- \`deque.append(val)\`: Push right ($O(1)$)
- \`deque.popleft()\`: Pop left ($O(1)$)`,
          code_snippet: `from collections import deque

# 1. Stack (LIFO) for bracket validation
def is_balanced(expression):
    stack = []
    matching = {")": "(", "}": "{", "]": "["}
    
    for char in expression:
        if char in matching.values():
            stack.append(char)
        elif char in matching:
            if not stack or stack.pop() != matching[char]:
                return False
    return len(stack) == 0

print("Is '({[]})' balanced?", is_balanced("({[]})"))
print("Is '({[}])' balanced?", is_balanced("({[}])"))

# 2. Queue (FIFO) with deque
task_queue = deque()
task_queue.append("Send Welcome Email")
task_queue.append("Generate Invoice")
task_queue.append("Notify Slack")

print("\\nProcessing Queue:")
while task_queue:
    current = task_queue.popleft()
    print(f"  Processed: {current}")`,
          code_language: 'python',
          code_explanation: 'Implements a balanced parenthesis validator using a list as a LIFO stack, and shows a FIFO task processing queue using collections.deque with O(1) popleft().',
          expected_output: `Is '({[]})' balanced? True
Is '({[}])' balanced? False

Processing Queue:
  Processed: Send Welcome Email
  Processed: Generate Invoice
  Processed: Notify Slack`,
          quiz: {
            id: 'quiz-stacks-queues',
            title: 'Knowledge Check: Stacks and Queues',
            questions: [
              {
                id: 'q-sq-1',
                question_text: 'Why should you use collections.deque instead of list for a FIFO queue?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Lists cannot store more than 1000 items.' },
                  { id: 'opt_2', text: 'list.pop(0) is O(N) because all elements must shift, while deque.popleft() is O(1).' },
                  { id: 'opt_3', text: 'deque supports only string elements.' },
                  { id: 'opt_4', text: 'Lists do not support the append method.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Removing the first element of a list requires shifting N-1 elements in memory, whereas deque uses linked blocks with O(1) pointer updates.'
              }
            ]
          },
          key_takeaways: [
            'Lists work well as LIFO stacks with append() and pop().',
            'Never use list.pop(0) for high-volume queues; use collections.deque.',
            'deque provides O(1) insertions and deletions from both ends.'
          ],
          revision_prompts: [
            'How can you enforce a maximum capacity on a queue using deque(maxlen=K)?',
            'What happens when you append to a full deque with a specified maxlen?'
          ]
        },

        // Lesson 7
        {
          id: 'les-choosing-right-data-structure',
          slug: 'choosing-the-right-data-structure',
          title: 'Choosing the Right Data Structure',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Select the optimal collection for your algorithmic requirements based on access patterns, ordering, uniqueness, and memory constraints.',
          learning_objectives: [
            'Match access requirements (by index, by key, by value) to optimal structures',
            'Evaluate tradeoffs between memory overhead and query performance',
            'Refactor sub-optimal collection patterns into idiomatic Python'
          ],
          content_markdown: `### Collection Decision Matrix

Choosing the wrong collection leads to slow, memory-heavy code. Use this decision tree:

1. **Do elements need to be unique?**
   - Yes: Use \`set\` (or \`dict\` if associating with values).
2. **Do you need key-value associations?**
   - Yes: Use \`dict\` (or \`defaultdict\` for groupings).
3. **Is sequence order important?**
   - Fast random access by index: Use \`list\`.
   - Fixed heterogeneous record: Use \`tuple\` or \`namedtuple\` / \`dataclass\`.
   - Fast insertions/removals at both ends: Use \`collections.deque\`.
4. **Do you need priority ordering?**
   - Frequent extraction of minimum/maximum element: Use \`heapq\`.

\`\`\`
Operation           List      Tuple     Set       Dict      Deque
Index Lookup        O(1)      O(1)      N/A       N/A       O(N)*
Key/Item Lookup     O(N)      O(N)      O(1)      O(1)      O(N)
Append Right        O(1)      N/A       O(1)      O(1)      O(1)
Insert/Pop Left     O(N)      N/A       N/A       N/A       O(1)
\`\`\``,
          code_snippet: `# Refactoring an inefficient lookup into an optimized set search
user_ids_list = [f"usr_{i}" for i in range(1000)]
banned_ids_list = ["usr_42", "usr_99", "usr_500"]

# Sub-optimal: Checking membership in list repeatedly is O(M * N)
# Optimal: Convert banned IDs to a set once for O(1) lookups
banned_ids_set = set(banned_ids_list)

active_users = [u for u in user_ids_list if u not in banned_ids_set]
print(f"Total active users: {len(active_users)}")
print(f"Is usr_42 active?   {'usr_42' in active_users}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates replacing linear list searches with constant-time set lookups for filtering large collections.',
          expected_output: `Total active users: 997
Is usr_42 active?   False`,
          quiz: {
            id: 'quiz-choosing-data-structure',
            title: 'Knowledge Check: Choosing Data Structures',
            questions: [
              {
                id: 'q-cds-1',
                question_text: 'Which data structure is most appropriate when you must continuously pop the task with the lowest priority value?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'A standard list sorted after every insertion.' },
                  { id: 'opt_2', text: 'A binary heap (heapq module).' },
                  { id: 'opt_3', text: 'A set.' },
                  { id: 'opt_4', text: 'A deque.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The heapq module implements a binary min-heap, allowing O(log N) insertion and O(log N) extraction of the smallest item.'
              }
            ]
          },
          key_takeaways: [
            'Pick sets for uniqueness and fast membership testing.',
            'Pick dicts for key-value relationships and rapid lookups.',
            'Pick deque when building high-throughput FIFO queues.'
          ],
          revision_prompts: [
            'When is a dictionary preferable to a set of tuples?',
            'What are the memory implications of creating millions of small dictionaries vs tuples?'
          ]
        },

        // Lesson 8
        {
          id: 'les-time-complexity-big-o',
          slug: 'time-complexity-and-big-o',
          title: 'Time Complexity Fundamentals: Big O Intuition',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Understand Big-O notation, analyze loops, and evaluate time and space complexity of intermediate Python algorithms.',
          learning_objectives: [
            'Understand Big O asymptotic bounds: O(1), O(log N), O(N), O(N log N), O(N^2)',
            'Identify hidden time complexity costs in common Python built-ins',
            'Analyze space complexity tradeoffs when caching and indexing'
          ],
          content_markdown: `### The Big-O Hierarchy

Big-O measures how execution time or memory scales as input size $N$ grows:

- **$O(1)$ Constant Time**: Accessing a list index, hashing a set element.
- **$O(\\log N)$ Logarithmic**: Binary search, heap push/pop.
- **$O(N)$ Linear**: Scanning an unsorted list, \`sum()\`, \`max()\`, string concatenation with \`+\`.
- **$O(N \\log N)$ Linearithmic**: Sorting (\`sorted()\`, \`list.sort()\`).
- **$O(N^2)$ Quadratic**: Nested loops comparing every pair of elements.

### Hidden Complexity Traps in Python
1. **\`item in my_list\`**: $O(N)$ scan. Inside a loop over $N$ items, this becomes $O(N^2)$!
2. **\`string_a += string_b\` in a loop**: Re-allocates strings each step ($O(N^2)$). Always use \`"".join(parts)\` ($O(N)$).
3. **\`list.pop(0)\`**: $O(N)$ shift. Use \`deque.popleft()\` ($O(1)$).`,
          code_snippet: `# Demonstrating O(N^2) vs O(N) duplicate detection
def has_duplicates_quadratic(items):
    # O(N^2): For every item, scans the rest of the list
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicates_linear(items):
    # O(N): Single pass utilizing an O(1) set
    seen = set()
    for x in items:
        if x in seen:
            return True
        seen.add(x)
    return False

data = [1, 2, 3, 4, 5, 3]
print("Quadratic check result:", has_duplicates_quadratic(data))
print("Linear check result:   ", has_duplicates_linear(data))`,
          code_language: 'python',
          code_explanation: 'Compares an O(N^2) nested loop duplicate check with an O(N) linear pass using a hash set.',
          expected_output: `Quadratic check result: True
Linear check result:    True`,
          quiz: {
            id: 'quiz-time-complexity',
            title: 'Knowledge Check: Big O Notation',
            questions: [
              {
                id: 'q-bigo-1',
                question_text: 'If you check "item in my_list" inside a loop that runs N times, what is the total time complexity?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'O(N)' },
                  { id: 'opt_2', text: 'O(N log N)' },
                  { id: 'opt_3', text: 'O(N^2)' },
                  { id: 'opt_4', text: 'O(1)' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'The outer loop runs N times. Each "in list" check takes O(N) time. N * O(N) = O(N^2).'
              }
            ]
          },
          key_takeaways: [
            'Big O describes scalability, not raw execution clock seconds.',
            'Beware of hidden O(N) operations inside loops that produce O(N^2) slowdowns.',
            'Trading memory (space complexity) for hash tables frequently reduces time complexity from O(N^2) to O(N).'
          ],
          revision_prompts: [
            'What is the time complexity of sorting a list of N strings of length K?',
            'Explain the space-time tradeoff of memoization.'
          ]
        }
      ]
    }
  ]
};
