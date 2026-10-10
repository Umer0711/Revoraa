/**
 * Revoraa Level 3: Intermediate Python - Module 8: Intermediate Testing and Debugging
 * 
 * 10 comprehensive lessons covering unit testing mastery, subTest table-driven tests,
 * edge cases, fixtures, mocking with patch, exception assertions, regression workflows,
 * systematic debugging, testable architectures, and the Level 3 Capstone Assessment.
 */

export const MODULE_8_TESTING_AND_DEBUGGING = {
  id: 'mod-py-testing-debugging',
  slug: 'intermediate-python-testing-debugging',
  level_number: 3,
  title: 'Intermediate Python Testing and Debugging',
  description: 'Master robust automated testing with unittest, table-driven subtests, mocking boundaries, regression workflows, and systematic debugging.',
  estimated_hours: 6,
  sort_order: 8,
  is_published: true,
  topics: [
    {
      id: 'top-testing-debugging-mastery',
      slug: 'testing-and-debugging-practices',
      title: 'Automated Testing & Systematic Debugging',
      summary: 'Explore unit testing, subTests, mocking, regression testing, and the Level 3 Capstone Assessment.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-unit-testing-review',
          slug: 'unit-testing-review',
          title: 'Unit Testing Fundamentals Review and AAA Pattern',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Review standard library unittest, the Arrange-Act-Assert pattern, and automated test discovery mechanics.',
          learning_objectives: [
            'Structure test methods following the Arrange-Act-Assert (AAA) pattern',
            'Understand test runner discovery based on test_ prefixes',
            'Select appropriate assertion methods (assertEqual, assertTrue, assertIn)'
          ],
          content_markdown: `### The Arrange-Act-Assert (AAA) Pattern

Clean unit tests follow three clear steps:
1. **Arrange**: Set up test fixtures, initialize objects, and configure test inputs.
2. **Act**: Invoke the target function or method under test.
3. **Assert**: Verify that the returned output or side effect matches the expected result.

\`\`\`python
import unittest

class TestCalculator(unittest.TestCase):
    def test_multiply_positive_numbers(self):
        # Arrange
        a, b = 6, 7
        # Act
        result = a * b
        # Assert
        self.assertEqual(result, 42)
\`\`\`

### Test Discovery Rules
- Test files must be named \`test_*.py\` or \`*_test.py\`.
- Test classes must inherit from **\`unittest.TestCase\`**.
- Test methods must start with the **\`test_\`** prefix.`,
          code_snippet: `import unittest

def calculate_net_pay(gross_pay: float, deductions: float) -> float:
    if gross_pay < 0 or deductions < 0:
        raise ValueError("Pay and deductions must be non-negative")
    return round(gross_pay - deductions, 2)

class TestPayroll(unittest.TestCase):
    def test_standard_net_pay(self):
        # Arrange
        gross = 5000.0
        deductions = 1250.50
        # Act
        net = calculate_net_pay(gross, deductions)
        # Assert
        self.assertEqual(net, 3749.50)

# Run test directly
suite = unittest.TestLoader().loadTestsFromTestCase(TestPayroll)
runner = unittest.TextTestRunner(verbosity=1)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates writing a clean unit test adhering to the Arrange-Act-Assert structure using standard library unittest.',
          expected_output: `.
----------------------------------------------------------------------
Ran 1 test in 0.00...s

OK
Tests run: 1, Failures: 0`,
          quiz: {
            id: 'quiz-unit-test-review',
            title: 'Knowledge Check: Unit Testing Review',
            questions: [
              {
                id: 'q-ut-1',
                question_text: 'Why must test methods in a unittest.TestCase begin with the prefix "test_"?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To allow Python to execute them in C.' },
                  { id: 'opt_2', text: 'The unittest TestLoader discovers and runs test methods by scanning for the test_ prefix.' },
                  { id: 'opt_3', text: 'It is optional and has no effect.' },
                  { id: 'opt_4', text: 'To encrypt test outputs.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'unittest uses the test_ prefix to automatically identify which methods are runnable tests versus helper methods.'
              }
            ]
          },
          key_takeaways: [
            'Follow the Arrange-Act-Assert pattern for clear, readable tests.',
            'Name test methods test_<feature>_<expected_behavior>.',
            'Keep tests isolated: each test method should be completely independent.'
          ],
          revision_prompts: [
            'What is the difference between assertEqual and assertIs in unittest?',
            'How can you run test discovery from the command line with python -m unittest?'
          ]
        },

        // Lesson 2
        {
          id: 'les-boundary-table-inputs',
          slug: 'testing-boundary-and-table-inputs',
          title: 'Testing Functions with Table-Driven SubTests',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Test dozens of parameter combinations cleanly using table-driven test data and with self.subTest(): blocks.',
          learning_objectives: [
            'Understand why looping assertions inside a single test is an antipattern without subTest',
            'Construct table-driven test cases with input-output tuples',
            'Use with self.subTest(): to ensure remaining test cases run even if one case fails'
          ],
          content_markdown: `### The Problem with Loop Assertions

If you loop over test inputs and use \`self.assertEqual()\`:
\`\`\`python
# Antipattern: If case 1 fails, the test exits immediately!
# Cases 2, 3, 4, and 5 never run!
for inp, expected in test_cases:
    self.assertEqual(fn(inp), expected)
\`\`\`

### The Solution: \`with self.subTest():\`
Python's \`self.subTest()\` runs each iteration as an **independent subtest**. If case 2 fails, Python records the failure and **continues running cases 3, 4, and 5**:

\`\`\`python
for inp, expected in test_cases:
    with self.subTest(inp=inp, expected=expected):
        self.assertEqual(fn(inp), expected)
\`\`\``,
          code_snippet: `import unittest

def parse_rating(score_str: str) -> int:
    """Parses a rating string into an integer between 1 and 5."""
    score = int(score_str.strip())
    if not (1 <= score <= 5):
        raise ValueError("Score out of bounds")
    return score

class TestRatingParser(unittest.TestCase):
    def test_valid_ratings_table(self):
        # Table of test inputs and expected outputs
        cases = [
            ("1", 1),
            (" 3 ", 3),
            ("5", 5),
            ("4", 4)
        ]
        
        for input_text, expected in cases:
            with self.subTest(input_text=input_text):
                self.assertEqual(parse_rating(input_text), expected)

suite = unittest.TestLoader().loadTestsFromTestCase(TestRatingParser)
runner = unittest.TextTestRunner(verbosity=1)
result = runner.run(suite)
print(f"Table-driven test suite passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates table-driven testing with with self.subTest(): to test multiple inputs with isolated failure reporting.',
          expected_output: `.
----------------------------------------------------------------------
Ran 1 test in 0.00...s

OK
Table-driven test suite passed: True`,
          quiz: {
            id: 'quiz-subtest-table',
            title: 'Knowledge Check: SubTests',
            questions: [
              {
                id: 'q-st-1',
                question_text: 'What is the main advantage of using with self.subTest(): in table-driven unit tests?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It speeds up Python compilation.' },
                  { id: 'opt_2', text: 'If one test case in the loop fails, the remaining cases continue to run and report their results.' },
                  { id: 'opt_3', text: 'It converts the test into a generator.' },
                  { id: 'opt_4', text: 'It creates a new database connection.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'self.subTest isolates each iteration, allowing test runners to report multiple failures in a table instead of stopping at the first failure.'
              }
            ]
          },
          key_takeaways: [
            'Table-driven tests verify multiple input-output pairs efficiently.',
            'Always wrap table loops in with self.subTest() blocks.',
            'SubTests report which specific iteration failed with its parameters.'
          ],
          revision_prompts: [
            'What keyword parameters can you pass to self.subTest() for descriptive diagnostics?',
            'How does pytest.mark.parametrize compare with unittest subTest?'
          ]
        },

        // Lesson 3
        {
          id: 'les-edge-cases-boundaries',
          slug: 'edge-cases-and-boundary-conditions',
          title: 'Edge Cases and Boundary Conditions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Hunt down bugs at boundary limits: off-by-one errors, empty collections, zero values, None inputs, and extreme scales.',
          learning_objectives: [
            'Identify common boundary hazards: 0, negative numbers, empty lists, None values',
            'Test off-by-one boundaries (< vs <=, index limits)',
            'Write defensive tests verifying robust behavior against invalid types'
          ],
          content_markdown: `### Where Bugs Actually Hide

90% of software defects do not occur on standard "happy path" data. They occur at the **boundaries**:

1. **Empty / Null Boundaries**: \`None\`, empty strings \`""\`, empty lists \`[]\`, empty dictionaries \`{}\`.
2. **Numeric Boundaries**: \`0\`, \`-1\`, maximum integers, floating-point precision (\`0.1 + 0.2\`).
3. **Sequence Boundaries**: Single-element lists, index \`0\`, index \`len(items) - 1\`, index \`len(items)\` (IndexError!).
4. **Off-by-One Errors**: Using \`<\` when \`<=\` was required, or miscalculating slicing offsets.`,
          code_snippet: `import unittest

def binary_search(arr, target):
    """Finds index of target in sorted array, or returns -1."""
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

class TestBinarySearchBoundaries(unittest.TestCase):
    def test_empty_array(self):
        self.assertEqual(binary_search([], 42), -1)

    def test_single_element_found_and_not_found(self):
        self.assertEqual(binary_search([10], 10), 0)
        self.assertEqual(binary_search([10], 99), -1)

    def test_target_at_extreme_boundaries(self):
        arr = [10, 20, 30, 40, 50]
        # Target at very first index (0)
        self.assertEqual(binary_search(arr, 10), 0)
        # Target at very last index (4)
        self.assertEqual(binary_search(arr, 50), 4)

suite = unittest.TestLoader().loadTestsFromTestCase(TestBinarySearchBoundaries)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"Boundary tests passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Tests binary search against key boundary conditions: empty array, single element, first element, and last element.',
          expected_output: `.
----------------------------------------------------------------------
Ran 3 tests in 0.00...s

OK
Boundary tests passed: True`,
          quiz: {
            id: 'quiz-edge-cases',
            title: 'Knowledge Check: Edge Cases',
            questions: [
              {
                id: 'q-ec-1',
                question_text: 'Which of the following is considered a boundary condition when testing a list-filtering function?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'A list containing 5 typical strings.' },
                  { id: 'opt_2', text: 'An empty list [] and a list where all items fail the filter.' },
                  { id: 'opt_3', text: 'Running the test on a Wednesday.' },
                  { id: 'opt_4', text: 'Printing the list.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Boundary testing evaluates edge cases where collections are empty or where all/no items match the filter condition.'
              }
            ]
          },
          key_takeaways: [
            'Always test 0, empty collections, and single-item inputs.',
            'Verify both ends of sorted ranges (first and last indices).',
            'Boundary testing prevents off-by-one errors from reaching production.'
          ],
          revision_prompts: [
            'How can floating-point comparison issues (e.g. 0.1 + 0.2 != 0.3) be tested with math.isclose() or assertAlmostEqual?',
            'What is property-based testing (e.g. with Hypothesis)?'
          ]
        },

        // Lesson 4
        {
          id: 'les-fixtures-setup-teardown',
          slug: 'fixtures-setup-teardown',
          title: 'Test Fixtures: setUp and tearDown Life Cycles',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Manage test state lifecycles with setUp(), tearDown(), setUpClass(), and tearDownClass() for clean resource allocation.',
          learning_objectives: [
            'Understand the execution lifecycle of setUp() and tearDown() per test method',
            'Use setUpClass() and tearDownClass() for expensive one-time initializations',
            'Guarantee test isolation by cleaning up files and database handles'
          ],
          content_markdown: `### The Test Lifecycle

To ensure tests remain isolated:
- **\`setUp()\`**: Executed **before each test method**. Use it to create fresh objects and temporary fixtures.
- **\`tearDown()\`**: Executed **after each test method**, even if the test failed or raised an exception! Use it to close file handles and clear buffers.
- **\`setUpClass()\` / \`tearDownClass()\`**: Class methods executed **once** before and after the entire test case class. Useful for heavy fixtures (like starting an embedded test server).

\`\`\`
setUpClass()
  setUp() ──► test_method_1() ──► tearDown()
  setUp() ──► test_method_2() ──► tearDown()
tearDownClass()
\`\`\``,
          code_snippet: `import unittest

class UserSession:
    def __init__(self):
        self.active_tokens = set()

    def login(self, token):
        self.active_tokens.add(token)

    def logout(self, token):
        self.active_tokens.discard(token)

class TestUserSessionLifecycle(unittest.TestCase):
    def setUp(self):
        # Fresh instance before EACH test method
        self.session = UserSession()

    def tearDown(self):
        # Cleanup
        self.session.active_tokens.clear()

    def test_login_adds_token(self):
        self.session.login("tok_abc")
        self.assertIn("tok_abc", self.session.active_tokens)

    def test_isolation_from_previous_test(self):
        # Proves that tok_abc from previous test does NOT exist here!
        self.assertEqual(len(self.session.active_tokens), 0)

suite = unittest.TestLoader().loadTestsFromTestCase(TestUserSessionLifecycle)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"Lifecycle tests passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates setUp creating a fresh UserSession instance before each test method, guaranteeing complete isolation between tests.',
          expected_output: `..
----------------------------------------------------------------------
Ran 2 tests in 0.00...s

OK
Lifecycle tests passed: True`,
          quiz: {
            id: 'quiz-fixtures-lifecycle',
            title: 'Knowledge Check: Test Fixtures',
            questions: [
              {
                id: 'q-fl-1',
                question_text: 'When is tearDown() executed during a test case run in unittest?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Only when the test passes.' },
                  { id: 'opt_2', text: 'After every test method, regardless of whether the test passed, failed, or raised an exception.' },
                  { id: 'opt_3', text: 'Once at the very beginning of the test suite.' },
                  { id: 'opt_4', text: 'Only when manually called.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'tearDown() is guaranteed to run after every test method, ensuring clean teardown of resources even if an assertion failed.'
              }
            ]
          },
          key_takeaways: [
            'setUp() initializes fresh state before every test method.',
            'tearDown() guarantees cleanup even when tests fail.',
            'Use setUpClass() with @classmethod for expensive one-time setup.'
          ],
          revision_prompts: [
            'Why should test methods never depend on the execution order of other test methods?',
            'What is the difference between addCleanup() and tearDown()?'
          ]
        },

        // Lesson 5
        {
          id: 'les-mocking-unittest-mock',
          slug: 'mocking-dependencies-with-unittest-mock',
          title: 'Mocking Dependencies with unittest.mock and patch',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Isolate units under test using Mock, MagicMock, and @patch to simulate external dependencies and assert interactions.',
          learning_objectives: [
            'Create Mock and MagicMock objects with custom return_value and side_effect',
            'Use @patch decorators and context managers to mock modules and functions',
            'Verify call arguments using assert_called_once_with()'
          ],
          content_markdown: `### The Mocking Philosophy

When testing a component:
- **Mock what you don't own** (external APIs, third-party services, system clocks).
- **Don't mock what you are testing** (the unit under test must be real code).

### \`return_value\` vs \`side_effect\`
- **\`mock.return_value = "data"\`**: Every invocation returns \`"data"\`.
- **\`mock.side_effect = Exception("fail")\`**: Invocation raises the specified exception!
- **\`mock.side_effect = [1, 2, 3]\`**: Consecutive calls return \`1\`, then \`2\`, then \`3\`.`,
          code_snippet: `from unittest.mock import Mock, patch
import unittest

def notify_user_sms(sender_fn, phone, message):
    if not phone.startswith("+"):
        raise ValueError("Invalid phone format")
    return sender_fn(phone, message)

class TestNotificationMock(unittest.TestCase):
    def test_sms_dispatched_with_proper_args(self):
        # Create mock callable
        mock_sender = Mock(return_value={"status": "SENT", "id": 101})

        # Act
        result = notify_user_sms(mock_sender, "+919876543210", "Your OTP is 4829")

        # Assert result and mock interactions
        self.assertEqual(result["status"], "SENT")
        mock_sender.assert_called_once_with("+919876543210", "Your OTP is 4829")

    def test_mock_side_effect_exception(self):
        # Configure mock to simulate gateway timeout
        mock_failing_sender = Mock(side_effect=TimeoutError("SMS gateway unreachable"))
        
        with self.assertRaises(TimeoutError):
            notify_user_sms(mock_failing_sender, "+1234567890", "Test alert")

suite = unittest.TestLoader().loadTestsFromTestCase(TestNotificationMock)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"Mocking tests passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates using Mock with return_value, verifying arguments with assert_called_once_with, and simulating network failures using side_effect.',
          expected_output: `..
----------------------------------------------------------------------
Ran 2 tests in 0.00...s

OK
Mocking tests passed: True`,
          quiz: {
            id: 'quiz-mocking-dependencies',
            title: 'Knowledge Check: Mocking',
            questions: [
              {
                id: 'q-md-1',
                question_text: 'How can you configure a Mock object to raise an exception when called?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'mock.raise_error = Exception()' },
                  { id: 'opt_2', text: 'mock.side_effect = Exception()' },
                  { id: 'opt_3', text: 'mock.return_value = Exception()' },
                  { id: 'opt_4', text: 'mock.fail = True' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Assigning an exception instance or class to mock.side_effect causes the mock to raise that exception upon invocation.'
              }
            ]
          },
          key_takeaways: [
            'Use Mock to simulate external boundaries and dependencies.',
            'Use return_value for static replies and side_effect for exceptions or dynamic sequences.',
            'assert_called_once_with verifies interaction contracts.'
          ],
          revision_prompts: [
            'What is the difference between Mock and MagicMock?',
            'Where should you patch an object: where it is defined or where it is used?'
          ]
        },

        // Lesson 6
        {
          id: 'les-testing-exceptions-assertraises',
          slug: 'testing-exceptions-with-assertraises',
          title: 'Testing Exceptions and Error Conditions',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Verify expected error behavior and exception message strings using with self.assertRaises() and assertRaisesRegex().',
          learning_objectives: [
            'Use with self.assertRaises(ExpectedException): context manager',
            'Verify exception message contents using self.assertRaisesRegex()',
            'Prevent false-positive tests where expected errors are never raised'
          ],
          content_markdown: `### Testing the "Unhappy Path"

A complete test suite tests that functions fail correctly when given invalid data:

\`\`\`python
# Testing that ValueError is raised
with self.assertRaises(ValueError):
    calculate_square_root(-4)
\`\`\`

If \`calculate_square_root(-4)\` completes normally without raising \`ValueError\`, \`assertRaises\` **fails the test**!

### Verifying Error Messages with Regex
To ensure the error message explains *why* the failure occurred:

\`\`\`python
# Verifies exception type AND message substring
with self.assertRaisesRegex(ValueError, "Negative numbers not permitted"):
    calculate_square_root(-4)
\`\`\``,
          code_snippet: `import unittest

def parse_percentage(val_str: str) -> float:
    try:
        val = float(val_str.replace("%", "").strip())
    except ValueError:
        raise ValueError(f"Cannot parse '{val_str}' into a numeric percentage")

    if not (0.0 <= val <= 100.0):
        raise ValueError(f"Percentage {val} out of bounds: must be between 0 and 100")
    return val / 100.0

class TestExceptionAssertions(unittest.TestCase):
    def test_non_numeric_string_raises_value_error(self):
        with self.assertRaisesRegex(ValueError, "Cannot parse 'abc'"):
            parse_percentage("abc")

    def test_out_of_bounds_raises_value_error(self):
        with self.assertRaisesRegex(ValueError, "out of bounds"):
            parse_percentage("150%")

suite = unittest.TestLoader().loadTestsFromTestCase(TestExceptionAssertions)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"Exception tests passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates using with self.assertRaisesRegex to test that invalid inputs raise the correct exception type with descriptive error text.',
          expected_output: `..
----------------------------------------------------------------------
Ran 2 tests in 0.00...s

OK
Exception tests passed: True`,
          quiz: {
            id: 'quiz-testing-exceptions',
            title: 'Knowledge Check: Testing Exceptions',
            questions: [
              {
                id: 'q-te-1',
                question_text: 'What happens if code inside a "with self.assertRaises(TypeError):" block finishes without raising any exception?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The test passes.' },
                  { id: 'opt_2', text: 'The test fails because the expected exception was not raised.' },
                  { id: 'opt_3', text: 'Python terminates the script.' },
                  { id: 'opt_4', text: 'It retries the block 3 times.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'assertRaises requires the wrapped block to raise the specified exception; if no exception is raised, an AssertionError is triggered.'
              }
            ]
          },
          key_takeaways: [
            'Test both happy paths and error conditions.',
            'Use with self.assertRaises() to assert that functions fail predictably.',
            'Use assertRaisesRegex() to verify informative error messaging.'
          ],
          revision_prompts: [
            'Why is a bare try/except block an antipattern when testing for exceptions in unittest?',
            'How can you inspect attributes on the caught exception object using assertRaises as cm?'
          ]
        },

        // Lesson 7
        {
          id: 'les-regression-testing-practices',
          slug: 'regression-testing-practices',
          title: 'Regression Testing Practices: The TDD Bug-Fix Workflow',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Eliminate recurring software bugs forever using the TDD regression workflow: Reproduce with a failing test -> Apply fix -> Verify pass.',
          learning_objectives: [
            'Understand what a regression defect is and why bugs tend to resurface',
            'Follow the 3-step bug-fix workflow: Reproduce -> Fix -> Prove',
            'Build automated regression test suites that guard against future code drift'
          ],
          content_markdown: `### What Is a Regression?

A **regression** is a software bug where a feature that previously functioned correctly stops working after a new commit or refactor.

### The Professional Bug-Fix Workflow
When a bug is reported:
1. **Never jump straight to modifying application code.**
2. **Step 1 (Reproduce)**: Write a unit test that recreates the bug scenario. Run it. **It must fail.** This proves the defect exists.
3. **Step 2 (Fix)**: Apply the minimal, cleanest code change to resolve the defect.
4. **Step 3 (Verify)**: Run the unit test again. **It must pass.**
5. **Step 4 (Commit)**: Commit the test alongside the bug fix. The test remains in your test suite forever, guaranteeing that exact bug can **never happen again undetected**!`,
          code_snippet: `# Simulating the regression bug-fix workflow
import unittest

# 1. Flawed implementation (Bug: fails to strip whitespace before email lookup)
def normalize_email(email_str: str) -> str:
    # Buggy version: return email_str.lower()  (forgot .strip()!)
    # Fixed version:
    return email_str.strip().lower()

class TestEmailRegression(unittest.TestCase):
    def test_regression_bug_402_email_whitespace(self):
        """Regression test for Bug #402: Spaces around email caused duplicate users."""
        raw_input = "  Aarav@Revoraa.dev   "
        expected = "aarav@revoraa.dev"
        self.assertEqual(normalize_email(raw_input), expected)

suite = unittest.TestLoader().loadTestsFromTestCase(TestEmailRegression)
result = unittest.TextTestRunner(verbosity=1).run(suite)
print(f"Regression verification passed: {result.wasSuccessful()}")`,
          code_language: 'python',
          code_explanation: 'Illustrates writing a dedicated regression test reproducing Bug #402 (whitespace trimming) and verifying that the fix prevents future recurrence.',
          expected_output: `.
----------------------------------------------------------------------
Ran 1 test in 0.00...s

OK
Regression verification passed: True`,
          quiz: {
            id: 'quiz-regression-testing',
            title: 'Knowledge Check: Regression Testing',
            questions: [
              {
                id: 'q-rt-1',
                question_text: 'What is the very first step a developer should take when fixing a reported software bug?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Delete the entire module.' },
                  { id: 'opt_2', text: 'Write a failing unit test that reproduces the bug scenario.' },
                  { id: 'opt_3', text: 'Deploy directly to production.' },
                  { id: 'opt_4', text: 'Disable unit testing in CI.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Writing a failing test first proves the defect exists and provides an automated verification harness once the fix is applied.'
              }
            ]
          },
          key_takeaways: [
            'A regression is when an old defect re-appears after code changes.',
            'Always write a failing test reproducing the bug before touching application code.',
            'Keep regression tests permanently in your test suite to protect against future regressions.'
          ],
          revision_prompts: [
            'How do CI/CD pipelines run regression test suites automatically on every pull request?',
            'What is the difference between smoke testing, sanity testing, and regression testing?'
          ]
        },

        // Lesson 8
        {
          id: 'les-systematic-debugging',
          slug: 'systematic-debugging-techniques',
          title: 'Systematic Debugging: Scientific Method and Stack Tracing',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Debug failures scientifically using hypotheses and evidence, read complex tracebacks bottom-up, and inspect frames with traceback.',
          learning_objectives: [
            'Apply the 4-stage Scientific Debugging method: Observe -> Hypothesize -> Experiment -> Conclude',
            'Read Python tracebacks from bottom to top to identify root causes',
            'Extract frame variables and call hierarchies using the traceback module'
          ],
          content_markdown: `### The Scientific Method of Debugging

Do not guess randomly or change lines of code hoping the error goes away. Follow the **Scientific Method**:
1. **Observe**: Record the exact error, input, and stack trace.
2. **Form Hypothesis**: "The error occurs because \`user_id\` is \`None\` when parsing session tokens."
3. **Experiment**: Add an assertion or test verifying the hypothesis.
4. **Conclude**: If the hypothesis is verified, apply the fix. If disproven, form a new hypothesis based on the new evidence!

### How to Read a Python Traceback
Always read Python tracebacks from **bottom to top**:
- **The very last line**: Tells you the exact exception type and error message (e.g. \`KeyError: 'role'\`).
- **The second to last block**: The exact line in your code that triggered the failure.
- **The top blocks**: The call stack chain that led to that line.`,
          code_snippet: `import traceback

def stage_c(val):
    if val is None:
        raise ValueError("Null value rejected at stage C")
    return val * 2

def stage_b(data):
    return stage_c(data.get("score"))

def stage_a():
    try:
        stage_b({"name": "Pooja"}) # score is missing (None)
    except Exception as err:
        print(f"Caught top-level exception: {type(err).__name__}: {err}")
        print("\\nFormatted stack trace extraction (last 2 frames):")
        formatted = traceback.format_exc().strip().splitlines()
        for line in formatted[-3:]:
            print(" ", line)

stage_a()`,
          code_language: 'python',
          code_explanation: 'Demonstrates reading and extracting stack trace frames programmatically using the traceback module to locate root cause exceptions.',
          expected_output: `Caught top-level exception: ValueError: Null value rejected at stage C

Formatted stack trace extraction (last 2 frames):
    stage_b({"name": "Pooja"}) # score is missing (None)
    raise ValueError("Null value rejected at stage C")
  ValueError: Null value rejected at stage C`,
          quiz: {
            id: 'quiz-systematic-debugging',
            title: 'Knowledge Check: Debugging Techniques',
            questions: [
              {
                id: 'q-sd-1',
                question_text: 'When reading a standard Python traceback in the terminal, where is the actual exception type and error message located?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'At the very top of the output.' },
                  { id: 'opt_2', text: 'At the very bottom (the last line).' },
                  { id: 'opt_3', text: 'In the middle.' },
                  { id: 'opt_4', text: 'In a separate log file.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Python prints tracebacks chronologically; the very bottom line displays the final unhandled exception type and description.'
              }
            ]
          },
          key_takeaways: [
            'Debug methodically: Observe, Hypothesize, Experiment, Conclude.',
            'Read Python tracebacks from bottom to top.',
            'Use the traceback module to inspect frames and log error contexts.'
          ],
          revision_prompts: [
            'How do you drop into an interactive breakpoint in Python 3.7+ using breakpoint()?',
            'What is the difference between pdb commands: n (next), s (step), and c (continue)?'
          ]
        },

        // Lesson 9
        {
          id: 'les-designing-for-testability',
          slug: 'designing-for-testability',
          title: 'Designing for Testability: The SOLID Fundamentals',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Write inherently testable Python code by favoring pure functions, avoiding global state, and injecting dependencies.',
          learning_objectives: [
            'Identify code structures that resist automated testing',
            'Refactor tight coupling into loose coupling using interfaces and protocols',
            'Eliminate hidden global state dependencies'
          ],
          content_markdown: `### What Makes Code Hard to Test?

1. **Hidden Global State**: Functions that read or mutate global variables.
2. **Hardcoded Dependencies**: Classes that instantiate databases or HTTP connections inside \`__init__\`.
3. **Mixing Concerns**: A single function that fetches HTTP data, parses JSON, calculates discounts, and writes to SQLite.
4. **Side Effects in Constructors**: Doing heavy network I/O inside \`__init__()\`.

### Principles of Testable Design
- **Single Responsibility Principle (SRP)**: Each class or function does one thing.
- **Dependency Inversion**: High-level modules depend on abstractions, not concrete implementations.
- **Favor Pure Functions**: Functions that compute outputs strictly from inputs can be tested with 1-line assertions!`,
          code_snippet: `# Refactoring untestable code into testable design
# Hard to test: Tightly coupled to system time
# Easy to test: Accepts timestamp as parameter (or default)
from datetime import datetime

def is_discount_active(current_time: datetime, promo_start: datetime, promo_end: datetime) -> bool:
    """Pure, deterministic function: completely testable without mocking clocks!"""
    return promo_start <= current_time <= promo_end

t_start = datetime(2026, 10, 1)
t_end   = datetime(2026, 10, 31)

# Test 1: During promotion
test_time_during = datetime(2026, 10, 15)
print("Is active on Oct 15? ", is_discount_active(test_time_during, t_start, t_end))

# Test 2: After promotion
test_time_after = datetime(2026, 11, 5)
print("Is active on Nov 5?  ", is_discount_active(test_time_after, t_start, t_end))`,
          code_language: 'python',
          code_explanation: 'Refactors a time-dependent function by accepting current_time as a parameter, making it completely deterministic and testable without clock mocking.',
          expected_output: `Is active on Oct 15?  True
Is active on Nov 5?   False`,
          quiz: {
            id: 'quiz-designing-testability',
            title: 'Knowledge Check: Testable Design',
            questions: [
              {
                id: 'q-dt-1',
                question_text: 'Why does passing external dependencies as parameters make code more testable?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It speeds up Python execution by 20%.' },
                  { id: 'opt_2', text: 'It allows test suites to supply mocks or in-memory fixtures without monkey-patching.' },
                  { id: 'opt_3', text: 'It converts the class into a C struct.' },
                  { id: 'opt_4', text: 'It eliminates the need for unit tests.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Dependency injection makes collaborators explicit, enabling tests to substitute lightweight mocks or test fixtures easily.'
              }
            ]
          },
          key_takeaways: [
            'Testable code is modular, decoupled, and explicit.',
            'Favor pure functions whenever possible.',
            'Avoid hardcoded external services and global state.'
          ],
          revision_prompts: [
            'What is monkey patching and why is dependency injection cleaner?',
            'How do Python typing.Protocol objects enable structural subtyping for testing?'
          ]
        },

        // Lesson 10
        {
          id: 'les-level-3-capstone-assessment',
          slug: 'level-3-capstone-assessment',
          title: 'Level 3 Capstone: Intermediate Python Synthesis',
          lesson_type: 'reading',
          estimated_minutes: 20,
          xp_reward: 100,
          is_published: true,
          sort_order: 10,
          summary: 'Synthesize all Level 3 concepts across collections, iterators, decorators, comprehensions, SQLite, and automated testing.',
          learning_objectives: [
            'Synthesize multi-tier intermediate Python patterns into an integrated application',
            'Connect decorators, generator streams, database repositories, and unit tests',
            'Complete the comprehensive Level 3 intermediate mastery assessment'
          ],
          content_markdown: `### Congratulations on Reaching the Level 3 Capstone!

Across Level 3, you have advanced from language syntax to writing production-quality intermediate Python:

1. **Module 1**: Advanced Collections, Sets, Tuples, Big-O Complexity.
2. **Module 2**: Iterators, Generator Functions, Streaming Pipelines, \`yield from\`.
3. **Module 3**: First-Class Functions, Closures, Custom Parameterized Decorators, \`functools.wraps\`.
4. **Module 4**: Comprehensions, Functional Primitives (\`any\`, \`all\`, \`map\`, \`filter\`), Pure Transformations.
5. **Module 5**: HTTP, REST APIs, JSON Serialization, Timeouts, API Clients, Mocking.
6. **Module 6**: Relational Databases, SQLite, Parameterized SQL, Transactions, Repositories.
7. **Module 7**: Modular Design, DAG Architectures, Logging, Clean Code Refactoring.
8. **Module 8**: Automated Testing, Table SubTests, Mocking, Regression TDD, Systematic Debugging.

Below is an integrated system showcasing these patterns working in harmony.`,
          code_snippet: `from functools import wraps
from typing import Iterator, Dict, Any
import sqlite3

# 1. Custom Decorator
def track_execution(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print(f"[AUDIT] Calling '{fn.__name__}'")
        return fn(*args, **kwargs)
    return wrapper

# 2. Database Integration & Repository
class StudentRepository:
    def __init__(self, conn):
        self.conn = conn
        self.conn.row_factory = sqlite3.Row

    @track_execution
    def save_student(self, name: str, score: float):
        with self.conn:
            self.conn.execute(
                "INSERT INTO students (name, score) VALUES (?, ?)", 
                (name, score)
            )

    def stream_honor_roll(self, min_score: float = 85.0) -> Iterator[Dict[str, Any]]:
        cur = self.conn.execute(
            "SELECT name, score FROM students WHERE score >= ? ORDER BY score DESC",
            (min_score,)
        )
        for row in cur:
            yield {"name": row["name"], "score": row["score"]}

# 3. Execution Demonstration
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, score REAL)")

repo = StudentRepository(conn)
repo.save_student("Aarav", 92.5)
repo.save_student("Diya", 78.0)
repo.save_student("Kabir", 88.0)

print("\\nStreaming Honor Roll (>= 85.0):")
for student in repo.stream_honor_roll(85.0):
    print(f"  Scholar: {student['name']} ({student['score']})")

conn.close()`,
          code_language: 'python',
          code_explanation: 'Capstone demonstration uniting custom decorators with @wraps, SQLite persistence with transactions, type hints, and streaming generator methods.',
          expected_output: `[AUDIT] Calling 'save_student'
[AUDIT] Calling 'save_student'
[AUDIT] Calling 'save_student'

Streaming Honor Roll (>= 85.0):
  Scholar: Aarav (92.5)
  Scholar: Kabir (88.0)`,
          quiz: {
            id: 'quiz-level-3-capstone',
            title: 'Level 3 Intermediate Python Capstone Assessment',
            questions: [
              {
                id: 'q-cap-1',
                question_text: 'Why does a generator expression consume dramatically less memory than a list comprehension when processing 10 million items?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It compresses items using LZMA.' },
                  { id: 'opt_2', text: 'It generates values lazily on demand one item at a time rather than building the entire list in memory up front.' },
                  { id: 'opt_3', text: 'It runs in a separate thread.' },
                  { id: 'opt_4', text: 'Generators store numbers as 8-bit integers.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Lazy evaluation computes values as requested, keeping memory consumption constant regardless of total stream size.'
              },
              {
                id: 'q-cap-2',
                question_text: 'What is the consequence of failing to use @functools.wraps on a decorator wrapper function?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The wrapped function will fail to execute.' },
                  { id: 'opt_2', text: 'The decorated function loses its original __name__, __doc__, and introspection metadata, masking them with "wrapper".' },
                  { id: 'opt_3', text: 'Python throws a SyntaxError during import.' },
                  { id: 'opt_4', text: 'The return value is automatically converted to None.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: '@functools.wraps copies the original function name, docstring, and module attributes onto the wrapper function.'
              },
              {
                id: 'q-cap-3',
                question_text: 'Why are parameterized queries (? or :named) mandatory when executing SQL statements with user input?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They are required by Python PEP 8 style guide.' },
                  { id: 'opt_2', text: 'They prevent SQL injection by ensuring input is treated as literal parameter data rather than executable SQL syntax.' },
                  { id: 'opt_3', text: 'SQLite does not support string formatting.' },
                  { id: 'opt_4', text: 'They automatically encrypt all database columns.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Parameterized queries compile the SQL command structure first, guaranteeing that user input can never inject malicious SQL clauses.'
              },
              {
                id: 'q-cap-4',
                question_text: 'How should unit tests verify code that depends on external third-party HTTP APIs?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'By making live requests to production endpoints.' },
                  { id: 'opt_2', text: 'By using unittest.mock to simulate responses, ensuring tests are deterministic, fast, and offline.' },
                  { id: 'opt_3', text: 'By disabling unit testing for network components.' },
                  { id: 'opt_4', text: 'By sleeping for 5 seconds between requests.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Mocking isolates unit tests from external internet conditions, rate limits, and network flakiness.'
              },
              {
                id: 'q-cap-5',
                question_text: 'What architectural pattern separates domain entity models from raw SQL database commands?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The Singleton pattern.' },
                  { id: 'opt_2', text: 'The Repository / DAO pattern.' },
                  { id: 'opt_3', text: 'The Factory Method pattern.' },
                  { id: 'opt_4', text: 'The Observer pattern.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The Repository pattern encapsulates data access logic and queries, leaving business services agnostic of SQL details.'
              }
            ]
          },
          key_takeaways: [
            'Level 3 empowers you to build scalable, memory-efficient, and maintainable Python systems.',
            'Combine generators, decorators, and modular design for clean architecture.',
            'Automated unit testing, mocking, and parameterized SQL ensure production stability.'
          ],
          revision_prompts: [
            'Review all 8 Level 3 module projects and ensure all acceptance criteria are met.',
            'Explain how you would design an enterprise microservice incorporating these intermediate Python patterns.'
          ]
        }
      ]
    }
  ]
};
