For your product, the DDD should not be a simple table list. It should be designed for **Supabase**, **Row Level Security (RLS)**, future AI features, and scalability.

I would also **avoid designing everything around LeetCode**. Instead, make the database generic so later you can support **Codeforces, CodeChef, HackerRank, AtCoder**, etc., without changing the schema.

---

# Database Design Document (DDD)

## Project Information

| Field        | Value                 |
| ------------ | --------------------- |
| Product      | InterviewOS           |
| Version      | 1.0                   |
| Database     | PostgreSQL (Supabase) |
| Architecture | Multi-Tenant SaaS     |
| Status       | Production Ready      |
| Prepared By  | TechNova              |

---

# 1. Purpose

This document defines the complete database architecture for InterviewOS.

The database is designed to:

* support multiple coding platforms
* track long-term learning
* schedule revisions
* power analytics
* calculate interview readiness
* support AI features in future versions
* scale to millions of solved problems

---

# 2. Database Principles

The schema follows these principles:

* Normalize shared data
* Avoid duplicate problem metadata
* Separate platform data from user progress
* Multi-user ready
* AI-ready
* Analytics-first
* RLS compatible
* Future-proof

---

# 3. High Level ER Diagram

```text
Users
   │
   ▼
Profiles
   │
   ├──────────────┐
   ▼              ▼
SolvedProblems   Roadmaps
   │              │
   ▼              ▼
RevisionHistory  CompanyReadiness
   │
   ▼
Mistakes
   │
   ▼
Analytics

Problems
   │
   ▼
ProblemTags

Companies
   │
   ▼
ProblemCompanies
```

---

# 4. Main Tables

## users

Handled by Supabase Auth.

Stores authentication only.

---

## profiles

Stores user information.

| Column           | Type                |
| ---------------- | ------------------- |
| id               | UUID PK             |
| auth_id          | UUID FK(auth.users) |
| username         | TEXT UNIQUE         |
| full_name        | TEXT                |
| avatar_url       | TEXT                |
| bio              | TEXT                |
| timezone         | TEXT                |
| experience_level | TEXT                |
| target_company   | TEXT                |
| created_at       | TIMESTAMP           |
| updated_at       | TIMESTAMP           |

---

## coding_platforms

Allows future expansion.

| Column  | Type    |
| ------- | ------- |
| id      | UUID PK |
| name    | TEXT    |
| slug    | TEXT    |
| website | TEXT    |

Example

```
LeetCode

Codeforces

CodeChef

AtCoder

HackerRank
```

---

## problems

Master problem table.

Only one record exists per coding problem.

| Column              | Type      |
| ------------------- | --------- |
| id                  | UUID PK   |
| platform_id         | UUID FK   |
| external_problem_id | TEXT      |
| title               | TEXT      |
| slug                | TEXT      |
| difficulty          | TEXT      |
| acceptance_rate     | NUMERIC   |
| is_paid             | BOOLEAN   |
| url                 | TEXT      |
| created_at          | TIMESTAMP |

---

## problem_tags

Many-to-many relationship.

| Column     | Type    |
| ---------- | ------- |
| id         | UUID PK |
| problem_id | UUID FK |
| tag        | TEXT    |

Example

```
Array

Graphs

DP

Heap

Trie
```

---

## companies

Stores company names.

| Column | Type    |
| ------ | ------- |
| id     | UUID PK |
| name   | TEXT    |

---

## problem_companies

Many-to-many mapping.

| Column     | Type    |
| ---------- | ------- |
| id         | UUID PK |
| company_id | UUID FK |
| problem_id | UUID FK |
| frequency  | INTEGER |

---

# 5. User Progress

## solved_problems

The most important table.

One row per user/problem.

| Column             | Type      |
| ------------------ | --------- |
| id                 | UUID PK   |
| user_id            | UUID FK   |
| problem_id         | UUID FK   |
| solve_time_minutes | INTEGER   |
| solved_using       | TEXT      |
| confidence         | INTEGER   |
| first_solved_at    | TIMESTAMP |
| last_revised_at    | TIMESTAMP |
| next_revision      | DATE      |
| revision_stage     | INTEGER   |
| status             | TEXT      |
| notes              | TEXT      |
| created_at         | TIMESTAMP |

Status

```
Solved

Revising

Mastered
```

Solved Using

```
Myself

Hint

Editorial
```

---

# 6. Revision History

## revision_history

Every revision attempt.

| Column            | Type    |
| ----------------- | ------- |
| id                | UUID PK |
| solved_problem_id | UUID FK |
| revision_number   | INTEGER |
| revision_date     | DATE    |
| result            | TEXT    |
| solve_time        | INTEGER |
| confidence        | INTEGER |

Result

```
Solved Easily

Needed Hint

Couldn't Solve
```

---

# 7. Mistakes

## mistakes

Tracks repeated mistakes.

| Column            | Type    |
| ----------------- | ------- |
| id                | UUID PK |
| solved_problem_id | UUID FK |
| category          | TEXT    |
| description       | TEXT    |

Examples

```
Boundary Error

Wrong Pointer

Overflow

Recursion

Binary Search

Off By One

DP Transition

Greedy Logic
```

---

# 8. Study Sessions

## study_sessions

Tracks daily work.

| Column        | Type    |
| ------------- | ------- |
| id            | UUID PK |
| user_id       | UUID FK |
| date          | DATE    |
| solved_count  | INTEGER |
| revised_count | INTEGER |
| total_minutes | INTEGER |

---

# 9. Achievements

## achievements

| Column      | Type    |
| ----------- | ------- |
| id          | UUID PK |
| title       | TEXT    |
| description | TEXT    |
| badge_icon  | TEXT    |

---

## user_achievements

| Column         | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| achievement_id | UUID FK   |
| user_id        | UUID FK   |
| unlocked_at    | TIMESTAMP |

---

# 10. Interview Readiness

## interview_readiness

| Column          | Type      |
| --------------- | --------- |
| id              | UUID PK   |
| user_id         | UUID FK   |
| company         | TEXT      |
| readiness_score | NUMERIC   |
| updated_at      | TIMESTAMP |

Example

```
Amazon

82%
```

---

# 11. Roadmaps

## roadmaps

Stores personalized study plans.

| Column         | Type    |
| -------------- | ------- |
| id             | UUID PK |
| user_id        | UUID FK |
| topic          | TEXT    |
| priority       | INTEGER |
| estimated_days | INTEGER |

---

# 12. Daily Analytics

## analytics_daily

| Column     | Type    |
| ---------- | ------- |
| id         | UUID PK |
| user_id    | UUID FK |
| date       | DATE    |
| solved     | INTEGER |
| revised    | INTEGER |
| accuracy   | NUMERIC |
| avg_time   | NUMERIC |
| confidence | NUMERIC |

---

# 13. Notifications

## notifications

| Column     | Type      |
| ---------- | --------- |
| id         | UUID PK   |
| user_id    | UUID FK   |
| title      | TEXT      |
| body       | TEXT      |
| type       | TEXT      |
| is_read    | BOOLEAN   |
| created_at | TIMESTAMP |

---

# 14. Settings

## user_settings

| Column             | Type    |
| ------------------ | ------- |
| id                 | UUID PK |
| user_id            | UUID FK |
| reminder_enabled   | BOOLEAN |
| reminder_time      | TIME    |
| theme              | TEXT    |
| revision_algorithm | TEXT    |

---

# 15. Relationships

```text
Auth User
      │
      ▼
 Profiles
      │
      ├────────────┬──────────────┐
      ▼            ▼              ▼
SolvedProblems  Analytics   Notifications
      │
      ▼
RevisionHistory
      │
      ▼
Mistakes

Problems
      │
      ├─────────────┐
      ▼             ▼
Tags          Companies
```

---

# 16. Index Strategy

Indexes should be created on:

```
user_id

problem_id

next_revision

difficulty

company

tag

created_at

slug

platform_id

external_problem_id
```

---

# 17. Row Level Security (RLS)

Enable RLS on all user-owned tables.

Policy:

```sql
user_id = auth.uid()
```

Only the owner can:

* View
* Insert
* Update
* Delete

their personal data.

Global tables like `problems`, `problem_tags`, `companies`, and `coding_platforms` should be read-only for authenticated users and managed through administrative processes.

---

# 18. Soft Delete

Instead of deleting records:

```sql
deleted_at TIMESTAMP
```

can be added to user-generated tables such as `solved_problems`, `revision_history`, and `notifications` if you need recovery. For immutable history tables, you may choose not to support deletion at all.

---

# 19. Future Tables (Version 2)

* ai_feedback
* ai_study_plans
* contest_history
* contest_submissions
* resume_reviews
* mock_interviews
* system_design_progress
* company_interview_logs
* user_goals
* ai_chat_history

---

# 20. Hybrid LeetCode Sync

```text
User enters Problem ID / URL
            │
            ▼
     Check Problems Table
            │
     ┌──────┴──────┐
     │             │
  Exists        Not Found
     │             │
     │      Fetch from LeetCode GraphQL
     │             │
     │       Save into Problems Table
     └─────────────┘
            │
            ▼
   Create solved_problems Record
            │
            ▼
 Schedule First Revision
```

---

## Why this schema is strong

This design separates **reference data** (problems, tags, companies) from **user-specific learning data** (solved problems, revisions, mistakes, analytics). It is efficient, scalable, and flexible enough to support additional coding platforms, AI features, and advanced analytics without major schema changes. It also aligns well with Supabase's authentication model and Row Level Security, making it a solid foundation for a production-ready SaaS application.
