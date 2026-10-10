/**
 * Revoraa Coding Practice, Challenges & Guided Projects Dataset
 * 
 * Provides curriculum-aligned challenges (Cooked or Cracked, Bug Hunt, Boss Fight, etc.)
 * and step-by-step guided projects with milestone criteria, starter code, test assertions,
 * and natural English, Hinglish, and Hindi translations.
 */
import { LEVEL_3_CHALLENGES } from './curriculum/level3Challenges.js';
import { LEVEL_3_PROJECTS } from './curriculum/level3Projects.js';
import { LEVEL_4_CHALLENGES } from './curriculum/level4Challenges.js';
import { LEVEL_4_PROJECTS } from './curriculum/level4Projects.js';
import { LEVEL_5_CHALLENGES } from './curriculum/level5Challenges.js';
import { LEVEL_5_PROJECTS } from './curriculum/level5Projects.js';

const BASE_CHALLENGES = [
  {
    id: 'chal-01-identity',
    slug: 'cooked-or-cracked-identity',
    path_slug: 'python-development',
    module_slug: 'python-fundamentals',
    title: 'Cooked or Cracked: Object Identity vs Equality',
    challenge_type: 'cooked_or_cracked',
    difficulty: 'beginner',
    xp_reward: 35,
    tagline: 'Slice Copying vs Reference Assignment',
    instructions: {
      en: 'Inspect the code snippet below. Determine whether each comparison evaluates to True or False. Run the code to verify your mental model, then submit your diagnosis.',
      'hi-Latn': 'Neeche diye gaye code ko dhyaan se dekhein. Predict karein ki har print statement True dega ya False. Run karke check karein aur answer submit karein.',
      hi: 'नीचे दिए गए कोड का निरीक्षण करें। निर्धारित करें कि प्रत्येक तुलना True या False देती है। अपने मॉडल को सत्यापित करने के लिए कोड चलाएं।'
    },
    starter_code: `# Cooked or Cracked: What prints here?
a = [10, 20, 30]
b = a[:]       # Slice copy
c = a          # Direct assignment

print(f"1. a == b: {a == b}")
print(f"2. a is b: {a is b}")
print(f"3. a is c: {a is c}")`,
    expected_output: `1. a == b: True
2. a is b: False
3. a is c: True`,
    hints: {
      en: [
        'Hint 1: a[:] creates a brand new shallow copy on the heap with identical elements.',
        'Hint 2: Assignment (c = a) copies the pointer, meaning both names point to the exact same memory id.'
      ],
      'hi-Latn': [
        'Hint 1: a[:] heap par ek naya list object create karta hai jisme elements same hote hain.',
        'Hint 2: c = a sirf memory pointer copy karta hai, isliye a aur c ka id() exact same hota hai.'
      ],
      hi: [
        'संकेत 1: a[:] हीप पर समान तत्वों के साथ एक नई सूची बनाता है।',
        'संकेत 2: c = a पॉइंटर को कॉपी करता है, जिससे a और c एक ही ऑब्जेक्ट को इंगित करते हैं।'
      ]
    },
    solution_explanation: {
      en: '`a == b` is True because the values match. `a is b` is False because slicing allocates a new heap list (`id(a) != id(b)`). `a is c` is True because `c` points to the exact same list.',
      'hi-Latn': '`a == b` True hai kyunki dono lists ki values barabar hain. `a is b` False hai kyunki slice nayi list banata hai. `a is c` True hai kyunki dono same memory address share karte hain.',
      hi: '`a == b` सत्य है क्योंकि मान समान हैं। `a is b` असत्य है क्योंकि स्लाइसिंग नई सूची बनाती है। `a is c` सत्य है क्योंकि दोनों एक ही ऑब्जेक्ट को इंगित करते हैं।'
    }
  },

  {
    id: 'chal-02-bug-hunt',
    slug: 'bug-hunt-infinite-loop',
    path_slug: 'python-development',
    module_slug: 'control-flow',
    title: 'Bug Hunt: The Frozen Loop Counter',
    challenge_type: 'bug_hunt',
    difficulty: 'beginner',
    xp_reward: 40,
    tagline: 'Smash the Infinite Loop',
    instructions: {
      en: 'The function `sum_even_numbers(limit)` is supposed to sum all positive even integers up to `limit`. However, it currently freezes in an infinite loop! Fix the bug so the function terminates and returns the correct sum.',
      'hi-Latn': '`sum_even_numbers(limit)` function ko 2 se lekar limit tak ke saare even numbers ka sum nikalna hai. Lekin isme ek bug hai jisse ye infinite loop mein phans jata hai! Bug ko dhoondh kar fix karein.',
      hi: 'फ़ंक्शन `sum_even_numbers(limit)` को धनात्मक सम पूर्णांकों का योग करना है। वर्तमान में यह अनंत लूप में अटक जाता है! बग को ढूंढें और ठीक करें।'
    },
    starter_code: `# Fix the infinite loop defect below
def sum_even_numbers(limit):
    total = 0
    current = 2
    while current <= limit:
        total += current
        # BUG: The loop counter never advances!
        
    return total

# Example test: 2 + 4 + 6 = 12
print(sum_even_numbers(6))`,
    test_harness: `
assert sum_even_numbers(6) == 12, f"Expected 12, got {sum_even_numbers(6)}"
assert sum_even_numbers(10) == 30, f"Expected 30, got {sum_even_numbers(10)}"
assert sum_even_numbers(2) == 2, f"Expected 2, got {sum_even_numbers(2)}"
print("ALL TESTS PASSED: Bug successfully squashed!")`,
    hints: {
      en: ['Add `current += 2` inside the while loop body so `current` advances toward `limit` on every cycle.'],
      'hi-Latn': ['While loop ke andar `current += 2` likhein taaki loop har iteration par aage badhe aur terminate ho sake.'],
      hi: ['लूप बॉडी के अंदर `current += 2` जोड़ें ताकि यह प्रत्येक चक्र पर आगे बढ़ सके।']
    },
    solution_explanation: {
      en: 'Without `current += 2`, the loop condition `current <= limit` stayed True forever, causing a classic infinite loop. Advancing the loop invariant ensures safe termination.',
      'hi-Latn': '`current += 2` ke bina `current <= limit` hamesha True rehta tha, jisse program freeze ho jata tha. Counter badhane se loop sahi time par rukta hai.',
      hi: 'काउंटर आगे न बढ़ने के कारण स्थिति हमेशा सत्य रहती थी। लूप इनवेरिएंट को आगे बढ़ाना आवश्यक था।'
    }
  },

  {
    id: 'chal-03-mutable-default',
    slug: 'internet-is-wrong-default-arg',
    path_slug: 'python-development',
    module_slug: 'functions',
    title: 'Internet Is Wrong: The Shared Default List',
    challenge_type: 'internet_is_wrong',
    difficulty: 'beginner',
    xp_reward: 45,
    tagline: 'Debunking the Mutable Parameter Myth',
    instructions: {
      en: 'A popular blog claims that `def add_log(msg, log_list=[]):` creates a fresh empty list on every function call. Prove the internet wrong and refactor the function to use the idiomatic `log_list=None` guard.',
      'hi-Latn': 'Ek online tutorial claim karta hai ki `log_list=[]` har call par fresh list banata hai. Ye galat hai! Is function ko `log_list=None` guard pattern se refactor karein taaki calls ek dusre ka data share na karein.',
      hi: 'एक ऑनलाइन ब्लॉग का दावा है कि `log_list=[]` प्रत्येक कॉल पर नई सूची बनाता है। इस फ़ंक्शन को `log_list=None` पैटर्न के साथ रिफैक्टर करें।'
    },
    starter_code: `# Fix the shared mutable default argument trap
def add_log(msg, log_list=[]):
    log_list.append(msg)
    return log_list

# Notice how state leaks across calls!
print("Call 1:", add_log("Auth success"))
print("Call 2:", add_log("DB connected"))`,
    test_harness: `
l1 = add_log("Req 1")
l2 = add_log("Req 2")
assert l1 == ["Req 1"], f"First call should only have ['Req 1'], got {l1}"
assert l2 == ["Req 2"], f"Second call should only have ['Req 2'], got {l2}"
assert l1 is not l2, "Each call must allocate an isolated list object!"
print("ALL TESTS PASSED: Function properly isolated!")`,
    hints: {
      en: ['Change the default to `log_list=None`, then check `if log_list is None: log_list = []` inside the function.'],
      'hi-Latn': ['Parameter default ko `log_list=None` karein aur body ke start mein `if log_list is None: log_list = []` likhein.'],
      hi: ['डिफ़ॉल्ट को `log_list=None` में बदलें और अंदर नई सूची बनाएं।']
    },
    solution_explanation: {
      en: 'Default argument expressions in Python are evaluated once at function definition time, not on each call. Setting the default to None and instantiating inside the body guarantees isolation.',
      'hi-Latn': 'Python mein default arguments function define hote waqt sirf ek baar bante hain. None default use karne se har call ke liye nayi list allocate hoti hai.',
      hi: 'पायथन में डिफ़ॉल्ट तर्क फ़ंक्शन परिभाषा के समय केवल एक बार मूल्यांकित होते हैं। None गार्ड आवश्यक है।'
    }
  },

  {
    id: 'chal-04-boss-fight',
    slug: 'boss-fight-word-frequency',
    path_slug: 'python-development',
    module_slug: 'basic-data-structures',
    title: 'Boss Fight: The Clean Frequency Engine',
    challenge_type: 'boss_fight',
    difficulty: 'beginner',
    xp_reward: 50,
    tagline: 'Combine Lists, Strings, and Dictionaries',
    instructions: {
      en: 'Defeat the Boss! Implement `build_word_frequency(words)`. It must take a list of raw words, strip whitespace from each word, convert to lowercase, ignore empty strings, and return a dictionary mapping each word to its frequency count.',
      'hi-Latn': 'Boss Fight! `build_word_frequency(words)` function implement karein. Har word ka whitespace strip karein, lowercase mein convert karein, empty strings ko ignore karein, aur word counts ka dictionary return karein.',
      hi: 'बॉस फाइट! `build_word_frequency(words)` फ़ंक्शन लागू करें। प्रत्येक शब्द से रिक्त स्थान हटाएं, लोअरकेस करें, रिक्त स्ट्रिंग्स को अनदेखा करें और फ़्रीक्वेंसी डिक्शनरी लौटाएं।'
    },
    starter_code: `def build_word_frequency(words):
    # Task: Clean words and return frequency dictionary
    freq = {}
    for raw in words:
        cleaned = raw.strip().lower()
        if not cleaned:
            continue
        freq[cleaned] = freq.get(cleaned, 0) + 1
    return freq

# Example test
sample = ["Python", " python ", "Go", "PYTHON", "", "rust"]
print(build_word_frequency(sample))`,
    test_harness: `
res = build_word_frequency(["Apple", " apple ", "BANANA", "", "apple"])
assert res.get("apple") == 3, f"Expected 'apple': 3, got {res.get('apple')}"
assert res.get("banana") == 1, f"Expected 'banana': 1, got {res.get('banana')}"
assert "" not in res, "Empty strings must be filtered out!"
print("ALL TESTS PASSED: Boss Defeated! ⚔️")`,
    hints: {
      en: ['Use `word.strip().lower()` for cleaning, and `freq.get(word, 0) + 1` for counting.'],
      'hi-Latn': ['Cleaning ke liye `.strip().lower()` use karein aur counting ke liye dictionary ka `.get(word, 0) + 1` method use karein.'],
      hi: ['सफाई के लिए `.strip().lower()` और गणना के लिए `.get(word, 0) + 1` का उपयोग करें।']
    },
    solution_explanation: {
      en: 'Combines string normalization (`.strip().lower()`) with dictionary hash lookups (`.get()`) to produce an O(n) frequency map.',
      'hi-Latn': 'String cleaning aur dictionary hash table lookup combine karke O(n) time mein clean frequency map banta hai.',
      hi: 'स्ट्रिंग सफाई और डिक्शनरी हैश टेबल को जोड़कर O(n) समय में आवृत्ति मानचित्र तैयार होता है।'
    }
  }
];

const BASE_PROJECTS = [
  {
    id: 'proj-01-cli-task',
    slug: 'cli-task-manager',
    path_slug: 'python-development',
    level_number: 1,
    title: 'Command-Line Task Manager',
    tagline: 'Build an interactive CRUD task engine in Python',
    difficulty: 'beginner',
    estimated_hours: 4,
    xp_reward: 150,
    is_published: true,
    description: {
      en: 'Synthesize everything from Level 1! Build a complete in-memory Task Management system supporting task creation, listing, status filtering, completion toggling, and interactive command execution.',
      'hi-Latn': 'Level 1 ke saare concepts ko combine karke ek functional CLI Task Manager banayein! Isme task create karna, filter karna, complete mark karna aur user commands handle karna seekhenge.',
      hi: 'लेवल 1 की सभी अवधारणाओं को मिलाकर एक पूर्ण CLI टास्क मैनेजर बनाएं। कार्यों को जोड़ना, फ़िल्टर करना और कमांड हैंडल करना सीखें।'
    },
    learning_objectives: [
      'Model structured entities using dictionaries and lists',
      'Implement modular CRUD helper functions',
      'Handle invalid inputs safely with guard clauses',
      'Construct a command interpreter for interactive REPL execution'
    ],
    milestones: [
      {
        id: 'm1-task-creation',
        title: 'Milestone 1: Task Schema & Addition',
        instructions: {
          en: 'Implement `create_task(id, title, priority="normal")` returning a dictionary with keys `id`, `title`, `priority`, and `done: False`. Then implement `add_task(tasks_list, task)`.',
          'hi-Latn': '`create_task(id, title, priority="normal")` function banayein jo `id`, `title`, `priority`, aur `done: False` dictionary return kare. Phir `add_task(tasks_list, task)` implement karein.',
          hi: '`create_task` लागू करें जो कार्य डिक्शनरी लौटाए और `add_task` जो सूची में जोड़े।'
        },
        starter_code: `def create_task(task_id, title, priority="normal"):
    return {
        "id": task_id,
        "title": title.strip(),
        "priority": priority,
        "done": False
    }

def add_task(tasks_list, task):
    tasks_list.append(task)
    return len(tasks_list)

tasks = []
t1 = create_task(1, "Study Python loops", "high")
add_task(tasks, t1)
print("Tasks count:", len(tasks))`,
        test_harness: `
t = create_task(101, "Test Task", "high")
assert t["id"] == 101 and t["done"] is False and t["priority"] == "high"
my_list = []
cnt = add_task(my_list, t)
assert cnt == 1 and len(my_list) == 1
print("MILESTONE 1 VERIFIED: Task creation & addition passed!")`
      },
      {
        id: 'm2-list-filter',
        title: 'Milestone 2: Listing & Filtering',
        instructions: {
          en: 'Implement `filter_tasks(tasks, status="all")` supporting status filters: `"all"`, `"completed"`, or `"pending"`.',
          'hi-Latn': '`filter_tasks(tasks, status="all")` implement karein jo status ke mutabik list filter kare: "all", "completed", ya "pending".',
          hi: 'कार्यों को उनकी स्थिति (all, completed, pending) के अनुसार फ़िल्टर करने के लिए `filter_tasks` लागू करें।'
        },
        starter_code: `def filter_tasks(tasks, status="all"):
    if status == "completed":
        return [t for t in tasks if t["done"] is True]
    elif status == "pending":
        return [t for t in tasks if t["done"] is False]
    return tasks[:]

tasks = [
    {"id": 1, "title": "Buy milk", "done": True},
    {"id": 2, "title": "Write unit tests", "done": False}
]
print("Pending tasks:", filter_tasks(tasks, "pending"))`,
        test_harness: `
sample = [{"id": 1, "done": True}, {"id": 2, "done": False}]
assert len(filter_tasks(sample, "completed")) == 1
assert len(filter_tasks(sample, "pending")) == 1
assert len(filter_tasks(sample, "all")) == 2
print("MILESTONE 2 VERIFIED: Task filtering passed!")`
      },
      {
        id: 'm3-complete-delete',
        title: 'Milestone 3: Complete & Delete Handlers',
        instructions: {
          en: 'Implement `mark_complete(tasks, task_id)` and `delete_task(tasks, task_id)`. Return True if found and modified, False otherwise.',
          'hi-Latn': '`mark_complete(tasks, task_id)` aur `delete_task(tasks, task_id)` banayein. Agar task mil jaye aur update ho jaye toh True return karein, warna False.',
          hi: 'कार्य को पूरा चिह्नित करने और हटाने के लिए फ़ंक्शन लागू करें।'
        },
        starter_code: `def mark_complete(tasks, task_id):
    for t in tasks:
        if t["id"] == task_id:
            t["done"] = True
            return True
    return False

def delete_task(tasks, task_id):
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            tasks.pop(i)
            return True
    return False

tasks = [{"id": 1, "title": "Setup Git", "done": False}]
mark_complete(tasks, 1)
print("Updated task:", tasks[0])`,
        test_harness: `
items = [{"id": 1, "done": False}, {"id": 2, "done": False}]
assert mark_complete(items, 1) is True
assert items[0]["done"] is True
assert mark_complete(items, 999) is False
assert delete_task(items, 2) is True
assert len(items) == 1
print("MILESTONE 3 VERIFIED: Update and delete logic verified!")`
      },
      {
        id: 'm4-interactive-loop',
        title: 'Milestone 4: Command Dispatcher',
        instructions: {
          en: 'Implement `dispatch_command(cmd_string, tasks)` parsing actions like `"add Clean room"`, `"done 1"`, `"list"`, and `"count"`.',
          'hi-Latn': '`dispatch_command(cmd_string, tasks)` implement karein jo user string parse karke sahi helper ko call kare aur status return kare.',
          hi: 'उपयोगकर्ता कमांड को पार्स और निष्पादित करने के लिए `dispatch_command` लागू करें।'
        },
        starter_code: `def dispatch_command(cmd, tasks):
    parts = cmd.strip().split(maxsplit=1)
    if not parts:
        return "Empty command"
    action = parts[0].lower()
    arg = parts[1] if len(parts) > 1 else ""

    if action == "add":
        new_id = len(tasks) + 1
        tasks.append({"id": new_id, "title": arg, "done": False})
        return f"Task {new_id} added"
    elif action == "count":
        return f"Total: {len(tasks)}"
    return f"Unknown action: {action}"

tasks = []
print(dispatch_command("add Practice functions", tasks))
print(dispatch_command("count", tasks))`,
        test_harness: `
t_list = []
res = dispatch_command("add Write docs", t_list)
assert len(t_list) == 1 and t_list[0]["title"] == "Write docs"
assert dispatch_command("count", t_list) == "Total: 1"
print("MILESTONE 4 VERIFIED: Full Project Completed! 🚀")`
      }
    ]
  },

  {
    id: 'proj-02-oop-notes',
    slug: 'oop-contact-manager',
    path_slug: 'python-development',
    level_number: 2,
    title: 'Object-Oriented Contact & Notes System',
    tagline: 'Design an extensible class hierarchy with custom exceptions and tests',
    difficulty: 'foundation',
    estimated_hours: 5,
    xp_reward: 200,
    is_published: true,
    description: {
      en: 'Synthesize Level 2! Build an Object-Oriented Contact and Note Book system featuring domain models, inheritance, custom exceptions, validation, and automated unit tests.',
      'hi-Latn': 'Level 2 OOP, exceptions aur testing ko combine karke ek robust Contact Management System banayein!',
      hi: 'लेवल 2 की अवधारणाओं (OOP, अपवाद, परीक्षण) को मिलाकर एक ऑब्जेक्ट-ओरिएंटेड संपर्क प्रबंधन प्रणाली बनाएं।'
    },
    learning_objectives: [
      'Design clean classes with attributes, methods, and dunder repr',
      'Create custom domain exceptions inheriting from Exception',
      'Manage entity collections with collision detection',
      'Write comprehensive unit tests with unittest.TestCase'
    ],
    milestones: [
      {
        id: 'm1-contact-class',
        title: 'Milestone 1: The Contact Model',
        instructions: {
          en: 'Create a `Contact` class with `name`, `email`, and `phone` attributes, and a string representation `__repr__`.',
          'hi-Latn': '`Contact` class banayein jisme `name`, `email`, `phone` attributes aur `__repr__` method ho.',
          hi: '`Contact` क्लास बनाएं जिसमें `name`, `email` और `phone` एट्रिब्यूट हों।'
        },
        starter_code: `class Contact:
    def __init__(self, name, email, phone):
        self.name = name.strip()
        self.email = email.strip()
        self.phone = phone.strip()

    def __repr__(self):
        return f"Contact(name='{self.name}', email='{self.email}')"

c = Contact("Grace Hopper", "grace@navy.mil", "555-0199")
print(c)`,
        test_harness: `
c = Contact("Ada Lovelace", "ada@calc.org", "123")
assert c.name == "Ada Lovelace" and c.email == "ada@calc.org"
assert "Ada Lovelace" in repr(c)
print("MILESTONE 1 VERIFIED: Contact model working!")`
      },
      {
        id: 'm2-custom-exceptions',
        title: 'Milestone 2: Custom Domain Exceptions',
        instructions: {
          en: 'Define `ContactNotFoundError(Exception)` and `DuplicateContactError(Exception)`.',
          'hi-Latn': '`ContactNotFoundError(Exception)` aur `DuplicateContactError(Exception)` custom classes define karein.',
          hi: 'कस्टम अपवाद `ContactNotFoundError` और `DuplicateContactError` बनाएं।'
        },
        starter_code: `class ContactNotFoundError(Exception):
    pass

class DuplicateContactError(Exception):
    pass

print("Exceptions defined successfully.")`,
        test_harness: `
assert issubclass(ContactNotFoundError, Exception)
assert issubclass(DuplicateContactError, Exception)
print("MILESTONE 2 VERIFIED: Custom exceptions ready!")`
      },
      {
        id: 'm3-addressbook-class',
        title: 'Milestone 3: AddressBook Container',
        instructions: {
          en: 'Create `AddressBook` with `add(contact)` (raising `DuplicateContactError` if email exists) and `find(email)` (raising `ContactNotFoundError` if absent).',
          'hi-Latn': '`AddressBook` class banayein jo contacts store kare aur duplicates ya missing contacts par custom exceptions raise kare.',
          hi: '`AddressBook` क्लास बनाएं जो संपर्क जोड़े और खोजे।'
        },
        starter_code: `class ContactNotFoundError(Exception): pass
class DuplicateContactError(Exception): pass

class AddressBook:
    def __init__(self):
        self._contacts = {}

    def add(self, contact):
        if contact.email in self._contacts:
            raise DuplicateContactError(f"Email {contact.email} already exists")
        self._contacts[contact.email] = contact

    def find(self, email):
        if email not in self._contacts:
            raise ContactNotFoundError(f"No contact found for {email}")
        return self._contacts[email]

book = AddressBook()
print("AddressBook initialized.")`,
        test_harness: `
book = AddressBook()
class MockC: email = "test@example.com"
book.add(MockC())
try:
    book.add(MockC())
    assert False, "Should have raised DuplicateContactError"
except DuplicateContactError:
    pass
assert book.find("test@example.com").email == "test@example.com"
print("MILESTONE 3 VERIFIED: AddressBook container verified!")`
      },
      {
        id: 'm4-unit-tests',
        title: 'Milestone 4: Automated Test Suite',
        instructions: {
          en: 'Write `TestAddressBook(unittest.TestCase)` testing addition and error handling with `self.assertRaises`.',
          'hi-Latn': '`unittest.TestCase` inherit karke automated test suite likhein jo addition aur exceptions verify kare.',
          hi: '`unittest` का उपयोग करके स्वचालित टेस्ट सूट लिखें।'
        },
        starter_code: `import unittest

class TestAddressBook(unittest.TestCase):
    def test_sample(self):
        self.assertEqual(1 + 1, 2)

suite = unittest.TestLoader().loadTestsFromTestCase(TestAddressBook)
runner = unittest.TextTestRunner(verbosity=1)
runner.run(suite)`,
        test_harness: `
import unittest
class T(unittest.TestCase):
    def test_pass(self): self.assertTrue(True)
s = unittest.TestLoader().loadTestsFromTestCase(T)
res = unittest.TextTestRunner().run(s)
assert res.wasSuccessful()
print("MILESTONE 4 VERIFIED: Project 2 Successfully Completed! 🎓")`
      }
    ]
  }
];

export const ALL_CHALLENGES = [...BASE_CHALLENGES, ...LEVEL_3_CHALLENGES, ...LEVEL_4_CHALLENGES, ...LEVEL_5_CHALLENGES];
export const ALL_PROJECTS = [...BASE_PROJECTS, ...LEVEL_3_PROJECTS, ...LEVEL_4_PROJECTS, ...LEVEL_5_PROJECTS];

export const CHALLENGES_DATA = ALL_CHALLENGES;
export const PROJECTS_DATA = ALL_PROJECTS;


