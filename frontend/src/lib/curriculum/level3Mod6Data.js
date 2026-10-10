/**
 * Revoraa Level 3: Intermediate Python - Module 6: Database Integration
 * 
 * 10 comprehensive lessons covering relational databases, sqlite3, CRUD queries,
 * SQL injection prevention, transactions, context managers, DAO/Repository architecture,
 * and isolated in-memory unit testing.
 */

export const MODULE_6_DATABASE_INTEGRATION = {
  id: 'mod-py-db-integration',
  slug: 'database-integration',
  level_number: 3,
  title: 'Database Integration',
  description: 'Connect Python to relational databases, execute safe parameterized SQL queries, manage ACID transactions, and design clean repository architectures.',
  estimated_hours: 6,
  sort_order: 6,
  is_published: true,
  topics: [
    {
      id: 'top-sqlite-persistence',
      slug: 'sqlite-and-sql-persistence',
      title: 'Relational Persistence & SQLite Integration',
      summary: 'Explore SQL fundamentals, safe queries, transactions, and repository design.',
      sort_order: 1,
      lessons: [
        // Lesson 1
        {
          id: 'les-why-databases',
          slug: 'why-applications-use-databases',
          title: 'Why Applications Use Databases',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 1,
          summary: 'Examine the limitations of flat files and in-memory dicts, exploring durability, concurrent transactions, and indexing.',
          learning_objectives: [
            'Identify race conditions and corruption risks in plain file persistence',
            'Understand ACID guarantees (Atomicity, Consistency, Isolation, Durability)',
            'Recognize when an embedded relational database is the right tool'
          ],
          content_markdown: `### Beyond Flat Files and In-Memory Dictionaries

When learning Python, storing data in \`dict\` or JSON files works initially. But in real applications:

1. **Memory Volatility**: If the process crashes or restarts, all in-memory data vanishes.
2. **Concurrent Write Corruption**: If two users save data simultaneously to \`data.json\`, one overwrites the other, corrupting the file.
3. **No Indexing**: Finding a user by email in a 10GB JSON file requires parsing all 10GB into memory ($O(N)$).
4. **Lack of Transactions**: If a crash occurs midway through updating two records, the system is left in an inconsistent half-saved state.

### The ACID Guarantee
Relational databases solve these challenges through ACID properties:
- **Atomicity**: An operation succeeds completely or fails with zero changes (all or nothing).
- **Consistency**: Data always adheres to schema rules, foreign keys, and constraints.
- **Isolation**: Concurrent operations do not interfere with each other.
- **Durability**: Once committed, data survives power failures and system crashes.`,
          code_snippet: `# Comparing in-memory vulnerability vs durable transaction concepts
import sqlite3

# Demonstrate instant SQLite in-memory database creation
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

cursor.execute("CREATE TABLE system_status (id INTEGER PRIMARY KEY, status TEXT)")
cursor.execute("INSERT INTO system_status (status) VALUES ('ONLINE')")
conn.commit()

cursor.execute("SELECT status FROM system_status WHERE id = 1")
status_row = cursor.fetchone()
print(f"Verified database status: {status_row[0]}")
conn.close()`,
          code_language: 'python',
          code_explanation: 'Demonstrates creating an in-memory SQLite relational database, executing a table creation DDL, inserting a record, and querying with transactional commit.',
          expected_output: `Verified database status: ONLINE`,
          quiz: {
            id: 'quiz-why-databases',
            title: 'Knowledge Check: Database Fundamentals',
            questions: [
              {
                id: 'q-wd-1',
                question_text: 'What does the "A" in the ACID database guarantee stand for?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Asynchronous' },
                  { id: 'opt_2', text: 'Atomicity (all operations in a transaction succeed, or all are rolled back)' },
                  { id: 'opt_3', text: 'Automatic' },
                  { id: 'opt_4', text: 'Authentication' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Atomicity guarantees that all statements in a transaction are executed as a single indivisible unit; if any part fails, the entire transaction is rolled back.'
              }
            ]
          },
          key_takeaways: [
            'Databases prevent data corruption from concurrent file writes.',
            'ACID properties guarantee reliability during system failures.',
            'Indexes provide rapid O(log N) lookups on millions of records.'
          ],
          revision_prompts: [
            'What is a write-ahead log (WAL) in SQLite?',
            'How does an embedded database like SQLite differ from a client-server database like PostgreSQL?'
          ]
        },

        // Lesson 2
        {
          id: 'les-relational-fundamentals-sql',
          slug: 'relational-fundamentals-sql-review',
          title: 'Relational Database Fundamentals and SQL Review',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 2,
          summary: 'Review tables, primary keys, foreign keys, and core SQL commands: CREATE, INSERT, SELECT, UPDATE, DELETE.',
          learning_objectives: [
            'Design normalized relational schemas with primary and foreign keys',
            'Write core DDL (CREATE TABLE) and DML (INSERT, SELECT, UPDATE, DELETE)',
            'Enforce data integrity with NOT NULL, UNIQUE, and CHECK constraints'
          ],
          content_markdown: `### Relational Terminology

- **Table**: A structured collection of data organized into rows and columns.
- **Column (Field)**: An attribute with a strict data type (INTEGER, TEXT, REAL, BLOB).
- **Row (Record)**: A single entity instance.
- **Primary Key (PK)**: A column that uniquely identifies every row.
- **Foreign Key (FK)**: A column referencing the primary key of another table, creating a relational link.

### The 4 Core DML Operations
\`\`\`sql
-- 1. Create
INSERT INTO users (name, email) VALUES ('Aarav', 'aarav@example.com');

-- 2. Read
SELECT id, name FROM users WHERE email = 'aarav@example.com';

-- 3. Update
UPDATE users SET name = 'Aarav Sharma' WHERE id = 1;

-- 4. Delete
DELETE FROM users WHERE id = 1;
\`\`\``,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# DDL: Creating parent and child relational tables
cur.execute("""
CREATE TABLE authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
""")

cur.execute("""
CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY(author_id) REFERENCES authors(id)
);
""")

# DML: Inserting relational records
cur.execute("INSERT INTO authors (name) VALUES ('Rabindranath Tagore')")
author_id = cur.lastrowid

cur.execute("INSERT INTO books (title, author_id) VALUES ('Gitanjali', ?)", (author_id,))
conn.commit()

# Query with relational JOIN
cur.execute("""
SELECT b.title, a.name 
FROM books b 
JOIN authors a ON b.author_id = a.id
""")
book, author = cur.fetchone()
print(f"Book: '{book}' by {author}")
conn.close()`,
          code_language: 'python',
          code_explanation: 'Creates relational authors and books tables with foreign key constraints, inserts records, and queries using an inner JOIN.',
          expected_output: `Book: 'Gitanjali' by Rabindranath Tagore`,
          quiz: {
            id: 'quiz-sql-review',
            title: 'Knowledge Check: SQL Review',
            questions: [
              {
                id: 'q-sr-1',
                question_text: 'What is the purpose of a FOREIGN KEY constraint in a relational database?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'To encrypt text fields in foreign languages.' },
                  { id: 'opt_2', text: 'To enforce referential integrity between columns in two different tables.' },
                  { id: 'opt_3', text: 'To allow remote servers to connect without passwords.' },
                  { id: 'opt_4', text: 'To automatically delete the database on exit.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'A foreign key ensures that a value in a child table must match an existing primary key value in the parent table, preventing orphaned records.'
              }
            ]
          },
          key_takeaways: [
            'Primary keys uniquely identify rows.',
            'Foreign keys enforce referential integrity between tables.',
            'JOIN queries combine rows from multiple tables based on related columns.'
          ],
          revision_prompts: [
            'What is the difference between an INNER JOIN and a LEFT JOIN?',
            'What does ON DELETE CASCADE do in a foreign key definition?'
          ]
        },

        // Lesson 3
        {
          id: 'les-connecting-python-sqlite',
          slug: 'connecting-python-sqlite',
          title: 'Connecting Python to SQLite and Row Factories',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 3,
          summary: 'Connect to SQLite databases using Python\'s sqlite3 standard library, create cursors, and configure sqlite3.Row for dictionary access.',
          learning_objectives: [
            'Establish connections using sqlite3.connect() to disk or in-memory (":memory:")',
            'Understand the role of the database cursor',
            'Configure conn.row_factory = sqlite3.Row to access columns by name'
          ],
          content_markdown: `### Standard Library \`sqlite3\`

Python includes SQLite out of the box. No external drivers or installations are required!

\`\`\`python
import sqlite3

# Connect to a file on disk (creates file if not present)
conn = sqlite3.connect("app_data.db")

# Or connect to an isolated in-memory database (great for testing!)
conn = sqlite3.connect(":memory:")
\`\`\`

### Cursors and \`sqlite3.Row\`
By default, queries return raw tuples (\`(1, 'Alice', 95)\`), forcing you to memorize column index positions.

Setting **\`conn.row_factory = sqlite3.Row\`** allows access by column name just like a dictionary:

\`\`\`python
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("SELECT name, email FROM users")
row = cur.fetchone()
print(row["name"], row["email"])  # Clean and expressive!
\`\`\``,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
# Configure dictionary-like column access
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("CREATE TABLE products (id INTEGER PRIMARY KEY, title TEXT, price REAL)")
cur.execute("INSERT INTO products (title, price) VALUES ('Mechanical Keyboard', 89.99)")
conn.commit()

cur.execute("SELECT id, title, price FROM products WHERE id = 1")
row = cur.fetchone()

# Access by column name
print(f"Product Name:  {row['title']}")
print(f"Product Price: \${row['price']:.2f}")

# Can still be accessed by index
print(f"Index 0 (ID):  {row[0]}")
conn.close()`,
          code_language: 'python',
          code_explanation: 'Demonstrates configuring sqlite3.Row to enable both named column access and numeric index access on returned database rows.',
          expected_output: `Product Name:  Mechanical Keyboard
Product Price: \$89.99
Index 0 (ID):  1`,
          quiz: {
            id: 'quiz-connecting-sqlite',
            title: 'Knowledge Check: SQLite Connections',
            questions: [
              {
                id: 'q-cs-1',
                question_text: 'What is the benefit of setting conn.row_factory = sqlite3.Row?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It speeds up queries by 10x.' },
                  { id: 'opt_2', text: 'It allows accessing query result columns by name (row["title"]) as well as by index.' },
                  { id: 'opt_3', text: 'It converts SQLite into PostgreSQL.' },
                  { id: 'opt_4', text: 'It prevents all database errors.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'sqlite3.Row wraps query results in a mapping interface, enabling case-insensitive column name access.'
              }
            ]
          },
          key_takeaways: [
            'sqlite3 is built into Python\'s standard library.',
            '":memory:" creates fast, isolated databases ideal for testing.',
            'conn.row_factory = sqlite3.Row eliminates brittle index lookups.'
          ],
          revision_prompts: [
            'What happens to an in-memory SQLite database when conn.close() is called?',
            'What is the difference between a Connection object and a Cursor object?'
          ]
        },

        // Lesson 4
        {
          id: 'les-creating-tables-inserting',
          slug: 'creating-tables-inserting-records',
          title: 'Creating Tables and Batch Inserting Records',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 4,
          summary: 'Execute schema DDL statements, insert records with cursor.execute(), perform high-speed batch inserts with executemany(), and retrieve lastrowid.',
          learning_objectives: [
            'Execute multi-line DDL schema statements',
            'Insert individual rows and retrieve generated auto-increment IDs via cursor.lastrowid',
            'Execute high-performance bulk insertions using cursor.executemany()'
          ],
          content_markdown: `### Single Insert vs Bulk Insert

Inserting 10,000 records one by one using a loop of \`cursor.execute()\` calls is slow because each call incurs Python-to-C overhead.

Python provides **\`cursor.executemany()\`**:
- Prepares the SQL statement once.
- Iterates over a sequence of parameter tuples in native C.
- Executes orders of magnitude faster!

\`\`\`python
# Fast batch insert
records = [("Alice", 25), ("Bob", 30), ("Charlie", 28)]
cursor.executemany("INSERT INTO users (name, age) VALUES (?, ?)", records)
\`\`\``,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

# Create table with AUTOINCREMENT
cur.execute("""
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary INTEGER NOT NULL
)
""")

# 1. Single insertion and lastrowid retrieval
cur.execute(
    "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)",
    ("Ananya Roy", "Engineering", 95000)
)
print("Single inserted employee ID:", cur.lastrowid)

# 2. Batch insertion with executemany
batch_data = [
    ("Vikram Singh", "Sales", 65000),
    ("Sneha Patel", "Engineering", 102000),
    ("Arjun Verma", "Marketing", 70000)
]
cur.executemany(
    "INSERT INTO employees (name, department, salary) VALUES (?, ?, ?)",
    batch_data
)
conn.commit()

# Verify total count
cur.execute("SELECT COUNT(*) FROM employees")
total_count = cur.fetchone()[0]
print("Total employees in database:", total_count)
conn.close()`,
          code_language: 'python',
          code_explanation: 'Demonstrates retrieving auto-generated primary keys with cur.lastrowid and performing bulk insertions using cur.executemany().',
          expected_output: `Single inserted employee ID: 1
Total employees in database: 4`,
          quiz: {
            id: 'quiz-creating-inserting',
            title: 'Knowledge Check: Inserts and executemany',
            questions: [
              {
                id: 'q-ci-1',
                question_text: 'What cursor attribute provides the generated auto-increment ID of the most recently inserted row?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'cursor.primary_key' },
                  { id: 'opt_2', text: 'cursor.lastrowid' },
                  { id: 'opt_3', text: 'cursor.generated_id' },
                  { id: 'opt_4', text: 'cursor.rowcount' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'cursor.lastrowid returns the rowid (or auto-increment primary key) of the last row inserted on that cursor.'
              }
            ]
          },
          key_takeaways: [
            'Use cursor.lastrowid to capture generated IDs for parent-child relationships.',
            'Use cursor.executemany() for high-speed bulk insertions.',
            'Always call conn.commit() to persist changes to disk.'
          ],
          revision_prompts: [
            'What is the difference between cursor.rowcount and len(results)?',
            'Why does failing to call conn.commit() discard changes on disk databases?'
          ]
        },

        // Lesson 5
        {
          id: 'les-querying-updating-records',
          slug: 'querying-and-updating-records',
          title: 'Querying and Updating Records',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 5,
          summary: 'Fetch records with fetchone, fetchall, and fetchmany, aggregate results, and execute targeted UPDATE and DELETE queries.',
          learning_objectives: [
            'Differentiate fetchone(), fetchall(), and fetchmany(size) memory usage',
            'Filter queries using WHERE, ORDER BY, and aggregate functions (AVG, COUNT)',
            'Execute atomic UPDATE and DELETE operations with rowcount verification'
          ],
          content_markdown: `### Fetching Query Results

- **\`cursor.fetchone()\`**: Retrieves the next single row as a tuple or \`None\` if no rows remain. Ideal for unique primary key lookups.
- **\`cursor.fetchmany(size)\`**: Retrieves a list of up to \`size\` rows. Useful for chunked batch processing without loading everything into memory.
- **\`cursor.fetchall()\`**: Retrieves all remaining rows as a list. Suitable for small or medium datasets.

### Verifying Mutations with \`rowcount\`
When executing \`UPDATE\` or \`DELETE\`, inspect **\`cursor.rowcount\`** to verify how many rows were actually matched and modified:

\`\`\`python
cursor.execute("UPDATE users SET active = 0 WHERE id = ?", (user_id,))
if cursor.rowcount == 0:
    print("Warning: User ID did not match any record!")
\`\`\``,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("CREATE TABLE inventory (id INTEGER PRIMARY KEY, sku TEXT, quantity INTEGER, price REAL)")
cur.executemany("INSERT INTO inventory (sku, quantity, price) VALUES (?, ?, ?)", [
    ("WIDGET-A", 15, 12.50),
    ("WIDGET-B", 4,  24.00),
    ("WIDGET-C", 50, 4.00),
    ("WIDGET-D", 2,  99.00)
])
conn.commit()

# 1. Updating with rowcount verification
cur.execute("UPDATE inventory SET quantity = quantity + 10 WHERE sku = ?", ("WIDGET-B",))
print(f"Updated {cur.rowcount} row(s)")

# 2. Aggregation query
cur.execute("SELECT AVG(price) as avg_price, SUM(quantity) as total_items FROM inventory")
summary = cur.fetchone()
print(f"Average Price: \${summary['avg_price']:.2f}")
print(f"Total Stock:   {summary['total_items']} items")

# 3. Filtering and ordering
cur.execute("SELECT sku, quantity FROM inventory WHERE quantity < 20 ORDER BY quantity ASC")
print("Low stock alerts:")
for row in cur.fetchall():
    print(f"  {row['sku']}: only {row['quantity']} left")

conn.close()`,
          code_language: 'python',
          code_explanation: 'Demonstrates updating inventory, verifying affected row counts with cur.rowcount, performing SQL aggregations, and ordering filtered records.',
          expected_output: `Updated 1 row(s)
Average Price: \$34.88
Total Stock:   81 items
Low stock alerts:
  WIDGET-D: only 2 left
  WIDGET-B: only 14 left
  WIDGET-A: only 15 left`,
          quiz: {
            id: 'quiz-querying-updating',
            title: 'Knowledge Check: Querying and Updating',
            questions: [
              {
                id: 'q-qu-1',
                question_text: 'What does cursor.fetchone() return when no matching rows remain in the query result set?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Empty tuple ()' },
                  { id: 'opt_2', text: 'None' },
                  { id: 'opt_3', text: 'Raises StopIteration' },
                  { id: 'opt_4', text: 'Raises KeyError' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'cursor.fetchone() returns None when the query yields no rows or all rows have been consumed.'
              }
            ]
          },
          key_takeaways: [
            'fetchone() returns None when exhausted.',
            'cursor.rowcount reports how many rows an UPDATE or DELETE statement affected.',
            'SQL aggregate functions (AVG, SUM, COUNT) run at high speed in C inside the database engine.'
          ],
          revision_prompts: [
            'Why is fetchall() dangerous on a table containing 10 million rows?',
            'What happens if an UPDATE statement omits the WHERE clause?'
          ]
        },

        // Lesson 6
        {
          id: 'les-parameterized-queries-security',
          slug: 'parameterized-queries-security',
          title: 'Parameterized Queries and SQL Injection Prevention',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 6,
          summary: 'Understand the mechanics of SQL injection vulnerabilities and neutralize attacks using parameterized query placeholders.',
          learning_objectives: [
            'Recognize vulnerable SQL string formatting anti-patterns',
            'Understand how malicious input alters SQL Abstract Syntax Trees',
            'Always use parameterized ? and :named placeholders'
          ],
          content_markdown: `### The #1 Database Vulnerability: SQL Injection

SQL injection occurs when untrusted user input is concatenated directly into an SQL command string:

\`\`\`python
# DANGEROUS CATASTROPHIC ANTI-PATTERN:
user_input = "admin' OR '1'='1"
query = f"SELECT * FROM users WHERE username = '{user_input}'"
# Executes: SELECT * FROM users WHERE username = 'admin' OR '1'='1'
# Authenticates attacker as admin without password!
\`\`\`

Another common payload: \`"'; DROP TABLE users; --"\`.

### The Solution: Parameterized Queries
**Never use f-strings, \`%s\`, or \`.format()\` to construct SQL statements.**

Pass parameters as a separate tuple or dictionary to \`execute()\`. The database engine compiles the SQL command **before** inserting values as literal data, making injection mathematically impossible:

\`\`\`python
# SECURE AND SAFE:
cur.execute("SELECT * FROM users WHERE username = ?", (user_input,))
\`\`\``,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("CREATE TABLE accounts (id INTEGER PRIMARY KEY, username TEXT, is_admin INTEGER)")
cur.execute("INSERT INTO accounts (username, is_admin) VALUES ('admin', 1)")
cur.execute("INSERT INTO accounts (username, is_admin) VALUES ('guest', 0)")
conn.commit()

# Attacker submits malicious SQL injection payload
malicious_payload = "guest' OR '1'='1"

# 1. Parameterized query completely neutralizes the attack!
cur.execute("SELECT * FROM accounts WHERE username = ?", (malicious_payload,))
result = cur.fetchone()

print("Did malicious payload bypass authentication?", result is not None)
print("Result with safe parameterized query:      ", result)

# 2. Legitimate lookup
cur.execute("SELECT * FROM accounts WHERE username = ?", ("admin",))
valid_admin = cur.fetchone()
print("Legitimate query found admin:               ", valid_admin["username"])

conn.close()`,
          code_language: 'python',
          code_explanation: 'Demonstrates how parameterized queries treat malicious SQL injection strings as literal text, safely preventing unauthorized access.',
          expected_output: `Did malicious payload bypass authentication? False
Result with safe parameterized query:       None
Legitimate query found admin:                admin`,
          quiz: {
            id: 'quiz-sql-injection',
            title: 'Knowledge Check: SQL Injection',
            questions: [
              {
                id: 'q-si-1',
                question_text: 'Why do parameterized queries prevent SQL injection attacks?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'They strip all punctuation from strings.' },
                  { id: 'opt_2', text: 'The SQL statement is compiled into an execution tree before parameters are bound as pure literal data.' },
                  { id: 'opt_3', text: 'They encrypt the database table.' },
                  { id: 'opt_4', text: 'They only run on Tuesdays.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'By compiling the SQL query structure first, parameters can never alter the syntax or add new clauses like OR 1=1.'
              }
            ]
          },
          key_takeaways: [
            'Never concatenate or f-string user input into SQL statements.',
            'Always use ? placeholders with tuples, or :name with dicts.',
            'Parameterized queries guarantee data is treated as values, never executable code.'
          ],
          revision_prompts: [
            'Can table names or column names be parameterized with ? placeholders in SQLite?',
            'What is the consequence of passing a single string instead of a 1-tuple (e.g. ("val") vs ("val",))?'
          ]
        },

        // Lesson 7
        {
          id: 'les-transactions-and-rollback',
          slug: 'transactions-and-rollback',
          title: 'Transactions and Atomic Rollback',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 7,
          summary: 'Enforce all-or-nothing atomicity using conn.commit() and conn.rollback() during multi-step database mutations.',
          learning_objectives: [
            'Understand database transaction boundaries in Python sqlite3',
            'Commit successful transactions with conn.commit()',
            'Roll back incomplete transactions with conn.rollback() upon exceptions'
          ],
          content_markdown: `### The Problem: Partial Failures

Imagine transferring \$100 from Account A to Account B:
1. Deduct \$100 from Account A.
2. System crashes or Account B is invalid!
3. If step 1 persisted, \$100 vanished from Account A without reaching Account B!

### The Solution: Atomic Transactions

A transaction groups multiple SQL statements into a single atomic block:
- **\`conn.commit()\`**: Permanently saves all changes made since the transaction started.
- **\`conn.rollback()\`**: Discards all pending changes, reverting the database to the exact state before the transaction began.`,
          code_snippet: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance REAL)")
cur.execute("INSERT INTO accounts (id, name, balance) VALUES (1, 'Alice', 500.0)")
cur.execute("INSERT INTO accounts (id, name, balance) VALUES (2, 'Bob', 200.0)")
conn.commit()

def transfer_funds(from_id, to_id, amount):
    try:
        # Step 1: Deduct from sender
        cur.execute("UPDATE accounts SET balance = balance - ? WHERE id = ?", (amount, from_id))
        
        # Simulate business rule check or sudden error
        if amount > 1000:
            raise ValueError("Exceeds maximum allowable single-transaction limit!")
            
        # Step 2: Credit to recipient
        cur.execute("UPDATE accounts SET balance = balance + ? WHERE id = ?", (amount, to_id))
        
        # Commit both operations atomically
        conn.commit()
        return True, "Transfer completed successfully"
    except Exception as err:
        # Atomic rollback reverts step 1 completely!
        conn.rollback()
        return False, f"Transfer rolled back: {err}"

# Attempt invalid transfer
success, msg = transfer_funds(from_id=1, to_id=2, amount=1500.0)
print("Transfer status:", msg)

# Verify balances were completely protected
cur.execute("SELECT name, balance FROM accounts")
for acc in cur.fetchall():
    print(f"  {acc['name']} balance: \${acc['balance']:.2f}")

conn.close()`,
          code_language: 'python',
          code_explanation: 'Simulates a financial transfer failure where conn.rollback() guarantees that deducted funds are fully restored upon exception.',
          expected_output: `Transfer status: Transfer rolled back: Exceeds maximum allowable single-transaction limit!
  Alice balance: \$500.00
  Bob balance: \$200.00`,
          quiz: {
            id: 'quiz-transactions-rollback',
            title: 'Knowledge Check: Transactions',
            questions: [
              {
                id: 'q-tr-1',
                question_text: 'What does conn.rollback() do when an error occurs during a transaction?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'Deletes the database file from the disk.' },
                  { id: 'opt_2', text: 'Discards all pending uncommitted changes, returning the database to its previous valid state.' },
                  { id: 'opt_3', text: 'Restarts the Python script.' },
                  { id: 'opt_4', text: 'Sends an email to the administrator.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'rollback() cancels all pending DML operations in the active transaction, preserving database consistency.'
              }
            ]
          },
          key_takeaways: [
            'Multi-step database updates must be wrapped in transactions.',
            'Call conn.commit() only after all steps succeed.',
            'Call conn.rollback() in except blocks to revert partial modifications.'
          ],
          revision_prompts: [
            'When does SQLite automatically begin a transaction?',
            'What is the difference between autocommit mode and manual transaction management?'
          ]
        },

        // Lesson 8
        {
          id: 'les-sqlite-context-managers',
          slug: 'sqlite-context-managers-cleanup',
          title: 'Context Managers and Resource Cleanup in SQLite',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 8,
          summary: 'Use with conn: for automatic commits/rollbacks and contextlib.closing for guaranteed database connection teardown.',
          learning_objectives: [
            'Use the connection as a context manager (with conn:) for automated commit and rollback',
            'Understand that with conn: does NOT close the connection',
            'Use contextlib.closing to ensure connection sockets and file handles close cleanly'
          ],
          content_markdown: `### The \`with conn:\` Transaction Context Manager

In Python \`sqlite3\`, the connection object can be used directly as a context manager:

\`\`\`python
with conn:
    # Everything inside this block runs in a transaction!
    conn.execute("INSERT INTO logs (msg) VALUES ('Task A')")
    conn.execute("INSERT INTO logs (msg) VALUES ('Task B')")
    # If the block exits normally, conn.commit() is called automatically!
    # If an exception is raised, conn.rollback() is called automatically!
\`\`\`

### Important Gotcha
\`with conn:\` **manages the transaction, NOT the connection itself**. The connection remains open! To ensure the database file is closed when finished, use \`contextlib.closing\`:

\`\`\`python
from contextlib import closing

with closing(sqlite3.connect("data.db")) as conn:
    with conn:
        conn.execute(...)
\`\`\``,
          code_snippet: `from contextlib import closing
import sqlite3

# Idiomatic SQLite resource and transaction management
with closing(sqlite3.connect(":memory:")) as conn:
    conn.row_factory = sqlite3.Row
    
    # Setup schema
    conn.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, content TEXT)")
    
    # Transaction 1: Successful commit via context manager
    with conn:
        conn.execute("INSERT INTO notes (content) VALUES ('Review Decorators')")
        conn.execute("INSERT INTO notes (content) VALUES ('Practice SQL')")
        
    # Transaction 2: Handled failure with automatic rollback
    try:
        with conn:
            conn.execute("INSERT INTO notes (content) VALUES ('Corrupt entry')")
            raise RuntimeError("Simulation failure midway")
    except RuntimeError:
        print("Caught runtime error: Transaction rolled back automatically!")
        
    # Verify notes table contents
    cur = conn.execute("SELECT content FROM notes")
    saved_notes = [r["content"] for r in cur.fetchall()]
    print("Persisted notes:", saved_notes)`,
          code_language: 'python',
          code_explanation: 'Shows with conn managing transactions with automatic commit on success and rollback on failure, wrapped in contextlib.closing for resource cleanup.',
          expected_output: `Caught runtime error: Transaction rolled back automatically!
Persisted notes: ['Review Decorators', 'Practice SQL']`,
          quiz: {
            id: 'quiz-sqlite-context-managers',
            title: 'Knowledge Check: Context Managers',
            questions: [
              {
                id: 'q-cm-1',
                question_text: 'What happens when an exception is raised inside a "with conn:" block in Python sqlite3?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'The changes are committed anyway.' },
                  { id: 'opt_2', text: 'The connection is deleted.' },
                  { id: 'opt_3', text: 'conn.rollback() is automatically called to discard the block\'s changes, and the exception re-raises.' },
                  { id: 'opt_4', text: 'The database file is deleted.' }
                ],
                correct_option_ids: ['opt_3'],
                explanation: 'with conn: handles transactions automatically: committing on normal block exit, and rolling back if an exception escapes.'
              }
            ]
          },
          key_takeaways: [
            'with conn: automatically commits on success and rolls back on exception.',
            'with conn: does NOT close the database connection.',
            'Use contextlib.closing to guarantee connection handle closure.'
          ],
          revision_prompts: [
            'Why is resource cleanup critical for file-based SQLite databases on Windows?',
            'How can you write a custom generator-based context manager using @contextlib.contextmanager?'
          ]
        },

        // Lesson 9
        {
          id: 'les-dao-repository-pattern',
          slug: 'dao-repository-pattern',
          title: 'Separating Database Access with the Repository Pattern',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 9,
          summary: 'Decouple raw SQL queries from business logic by encapsulating persistence into clean Repository and DAO classes.',
          learning_objectives: [
            'Understand why scattering raw SQL statements across application code is an anti-pattern',
            'Build a Repository class translating between database rows and domain dataclasses',
            'Decouple application business rules from the underlying database engine'
          ],
          content_markdown: `### The Problem: SQL Everywhere

If every route, controller, and function writes its own raw \`SELECT * FROM users\`, changing a column name requires updating 50 files.

### The Repository / DAO Pattern
The **Repository Pattern** mediates between the domain and data mapping layers:
1. **Domain Models**: Pure Python objects or \`dataclasses\` (e.g. \`User\`, \`Expense\`) containing zero SQL.
2. **Repository Class**: Holds all SQL queries. Exposes clean methods like \`add()\`, \`get_by_id()\`, \`list_all()\`.
3. **Application Code**: Interacts strictly with the Repository, completely unaware of SQL syntax.`,
          code_snippet: `from dataclasses import dataclass
from typing import Optional, List
import sqlite3

# 1. Pure Domain Entity (No SQL dependencies)
@dataclass
class Expense:
    id: Optional[int]
    category: str
    amount: float
    description: str

# 2. Repository Layer (Encapsulates all SQL persistence)
class ExpenseRepository:
    def __init__(self, conn):
        self.conn = conn
        self.conn.row_factory = sqlite3.Row

    def add(self, expense: Expense) -> Expense:
        with self.conn:
            cur = self.conn.execute(
                "INSERT INTO expenses (category, amount, description) VALUES (?, ?, ?)",
                (expense.category, expense.amount, expense.description)
            )
            expense.id = cur.lastrowid
            return expense

    def get_by_category(self, category: str) -> List[Expense]:
        cur = self.conn.execute(
            "SELECT id, category, amount, description FROM expenses WHERE category = ?",
            (category,)
        )
        return [
            Expense(id=row["id"], category=row["category"], amount=row["amount"], description=row["description"])
            for row in cur.fetchall()
        ]

# 3. Application Usage
conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE expenses (id INTEGER PRIMARY KEY, category TEXT, amount REAL, description TEXT)")

repo = ExpenseRepository(conn)
e1 = repo.add(Expense(id=None, category="Food", amount=24.50, description="Lunch"))
e2 = repo.add(Expense(id=None, category="Food", amount=15.00, description="Coffee"))

food_expenses = repo.get_by_category("Food")
print(f"Retrieved {len(food_expenses)} expenses:")
for e in food_expenses:
    print(f"  [ID {e.id}] {e.description}: \${e.amount:.2f}")

conn.close()`,
          code_language: 'python',
          code_explanation: 'Implements the Repository pattern separating a pure Expense dataclass from the SQL ExpenseRepository persistence layer.',
          expected_output: `Retrieved 2 expenses:
  [ID 1] Lunch: \$24.50
  [ID 2] Coffee: \$15.00`,
          quiz: {
            id: 'quiz-repository-pattern',
            title: 'Knowledge Check: Repository Pattern',
            questions: [
              {
                id: 'q-rp-1',
                question_text: 'What is the main architectural benefit of the Repository Pattern?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It converts SQLite to NoSQL.' },
                  { id: 'opt_2', text: 'It isolates SQL queries from business logic, making code modular and easily testable.' },
                  { id: 'opt_3', text: 'It compresses data on disk.' },
                  { id: 'opt_4', text: 'It makes all queries asynchronous.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'The repository pattern creates a clean boundary: business code deals with domain objects, while the repository encapsulates persistence mechanics.'
              }
            ]
          },
          key_takeaways: [
            'Keep domain models free of SQL queries.',
            'Repositories encapsulate persistence, queries, and row mapping.',
            'Decoupling persistence makes switching storage or mocking simple.'
          ],
          revision_prompts: [
            'How does the Repository Pattern support unit testing?',
            'What is the difference between the Active Record pattern and the Data Mapper / Repository pattern?'
          ]
        },

        // Lesson 10
        {
          id: 'les-testing-db-in-memory',
          slug: 'testing-database-functions-in-memory',
          title: 'Testing Database-Backed Functions with In-Memory Databases',
          lesson_type: 'reading',
          estimated_minutes: 10,
          xp_reward: 30,
          is_published: true,
          sort_order: 10,
          summary: 'Write fast, isolated unit tests for database repositories using temporary in-memory SQLite fixtures.',
          learning_objectives: [
            'Configure test suites using isolated sqlite3.connect(":memory:") fixtures',
            'Create fresh schema in setUp() and teardown connections in tearDown()',
            'Verify repository CRUD behavior and constraint enforcement without disk leftovers'
          ],
          content_markdown: `### The Testing Challenge: Dirty Database State

If unit tests share a disk-based database:
- Test 1 inserts User A.
- Test 2 expects 0 users, but fails because User A already exists!
- Tests become order-dependent and flaky.

### The Solution: \`":memory:"\` in \`setUp()\` and \`tearDown()\`

In \`unittest.TestCase\`:
1. **\`setUp()\`**: Create a brand new connection with \`sqlite3.connect(":memory:")\` and run table creation DDL.
2. **Test Methods**: Run queries against the private, isolated database.
3. **\`tearDown()\`**: Close the connection. The entire database is completely discarded from RAM! Every test starts with a 100% clean slate.`,
          code_snippet: `import unittest
import sqlite3

class TestDatabaseRepository(unittest.TestCase):
    def setUp(self):
        # Create fresh in-memory database for EACH test method
        self.conn = sqlite3.connect(":memory:")
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE)")

    def tearDown(self):
        # Discard database completely
        self.conn.close()

    def test_insert_user_success(self):
        self.conn.execute("INSERT INTO users (email) VALUES ('dev@revoraa.dev')")
        cur = self.conn.execute("SELECT email FROM users WHERE id = 1")
        row = cur.fetchone()
        self.assertEqual(row["email"], "dev@revoraa.dev")

    def test_unique_constraint_enforced(self):
        self.conn.execute("INSERT INTO users (email) VALUES ('dup@revoraa.dev')")
        # Ensure duplicate email raises IntegrityError
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("INSERT INTO users (email) VALUES ('dup@revoraa.dev')")

# Run test suite
suite = unittest.TestLoader().loadTestsFromTestCase(TestDatabaseRepository)
runner = unittest.TextTestRunner(verbosity=1)
result = runner.run(suite)
print(f"Tests run: {result.testsRun}, Errors: {len(result.errors)}, Failures: {len(result.failures)}")`,
          code_language: 'python',
          code_explanation: 'Demonstrates writing isolated unit tests using in-memory SQLite databases in unittest setUp and tearDown methods.',
          expected_output: `..
----------------------------------------------------------------------
Ran 2 tests in 0.00...s

OK
Tests run: 2, Errors: 0, Failures: 0`,
          quiz: {
            id: 'quiz-testing-databases',
            title: 'Knowledge Check: Testing Databases',
            questions: [
              {
                id: 'q-td-1',
                question_text: 'Why is using an in-memory SQLite database in setUp() ideal for unit testing?',
                question_type: 'single_choice',
                options: [
                  { id: 'opt_1', text: 'It tests remote network connections.' },
                  { id: 'opt_2', text: 'Each test runs against an isolated, lightning-fast database with zero leftover state from previous tests.' },
                  { id: 'opt_3', text: 'It prevents using unittest assertions.' },
                  { id: 'opt_4', text: 'It saves results to disk automatically.' }
                ],
                correct_option_ids: ['opt_2'],
                explanation: 'Creating a fresh in-memory database in setUp() guarantees complete test isolation, preventing state pollution between tests.'
              }
            ]
          },
          key_takeaways: [
            'Use ":memory:" SQLite connections in setUp() for fast, isolated tests.',
            'Test integrity constraints (e.g. UNIQUE, NOT NULL, CHECK) explicitly.',
            'Close connections in tearDown() to release resources.'
          ],
          revision_prompts: [
            'How can database migrations be tested using in-memory databases?',
            'What are the limitations of testing with SQLite if production uses PostgreSQL or MySQL?'
          ]
        }
      ]
    }
  ]
};
