Excellent choice. Since you want to build this as a real startup, the PRD should read like a document from Notion, Linear, or Stripe rather than a college project.

I recommend **Version 1.0** focused on the MVP. It should describe the product you're actually going to build today, not every future idea.

# Product Requirements Document (PRD)

## Project Information

| Field         | Value                         |
| ------------- | ----------------------------- |
| Product Name  | InterviewOS *(Working Name)*  |
| Version       | 1.0                           |
| Product Type  | SaaS Web Application          |
| Platform      | Web                           |
| Status        | MVP                           |
| Prepared By   | TechNova                      |
| Document Type | Product Requirements Document |

---

# Executive Summary

InterviewOS is a personal interview preparation platform that combines DSA tracking, spaced repetition, analytics, interview readiness scoring, and long-term learning into one intelligent workspace.

Unlike traditional DSA trackers that simply record solved problems, InterviewOS continuously analyzes a user's progress and tells them exactly what they should study next.

The platform automatically imports problem metadata from LeetCode, schedules revisions using spaced repetition, identifies weak topics, tracks recurring mistakes, measures interview readiness, and visualizes progress through interactive dashboards.

The long-term vision is to become a personal operating system for software engineering interview preparation.

---

# Vision

Become the most intelligent interview preparation platform that helps software engineers maximize their chances of cracking product-based company interviews.

---

# Mission

Help developers learn efficiently instead of solving problems randomly.

Every study session should have a purpose.

---

# Problem Statement

Current interview preparation suffers from several problems.

Most students

* solve problems once
* forget them after a few weeks
* don't know what to revise
* repeat the same mistakes
* cannot identify weak topics
* prepare without a structured roadmap
* rely on memory instead of measurable progress

Existing DSA trackers only store solved problems.

They rarely answer questions like

* What should I revise today?
* Which topics am I forgetting?
* Am I improving?
* Am I interview ready?
* Which company should I target?

---

# Solution

InterviewOS acts as a personal interview operating system.

Instead of simply recording solved questions, it continuously manages the user's preparation.

The system automatically

* imports LeetCode problem information
* schedules revisions
* tracks confidence
* measures retention
* analyzes mistakes
* detects weak topics
* estimates interview readiness
* generates personalized study recommendations

---

# Core Value Proposition

One platform that manages your complete interview preparation.

Instead of remembering everything yourself,

InterviewOS remembers everything for you.

---

# Product Philosophy

The product should never behave like a notebook.

It should behave like a personal mentor.

Every screen should answer

> What should the user do next?

instead of

> What information does the user have?

---

# Target Audience

Primary Users

* Computer Science Students
* Software Engineering Students
* Placement Preparation Students
* Product-based Company Aspirants
* LeetCode Users
* Competitive Programmers

Secondary Users

* Working Professionals
* Coding Bootcamp Students
* Mentors
* Universities

---

# User Personas

### Persona 1

Name

Umer

Goal

Crack product-based companies.

Problems

* forgets solved questions
* inconsistent revision
* weak analytics

Needs

* daily roadmap
* revision reminders
* interview readiness

---

### Persona 2

Name

Ankit

Experience

2 Years

Goal

Switch companies.

Needs

* fast revision
* company preparation
* progress tracking

---

### Persona 3

Name

Priya

College Student

Goal

Campus placements

Needs

* structured learning
* confidence tracking
* easy progress monitoring

---

# Product Goals

Build an interview preparation platform that users rely on every day.

Users should never wonder

"What should I study today?"

---

# Success Metrics

Daily Active Users

Weekly Active Users

Problems Added

Problems Revised

Revision Completion Rate

Average Session Time

Retention Rate

Interview Readiness Improvement

Average Daily Study Time

User Satisfaction

---

# MVP Scope

Included

✅ Authentication

✅ Dashboard

✅ Add Problems

✅ Hybrid LeetCode Integration

✅ Automatic Metadata

✅ Problem Library

✅ Spaced Repetition

✅ Revision Scheduler

✅ Analytics

✅ Heatmap

✅ Pattern Tracking

✅ Mistake Tracking

✅ Interview Readiness

✅ Company Readiness

✅ Roadmap

✅ Settings

---

Excluded

❌ AI Coach

❌ Resume Review

❌ Code Review

❌ LLM Integration

❌ Mobile App

❌ Team Collaboration

❌ Competitive Coding

❌ System Design

These belong to Version 2.

---

# Hybrid LeetCode Integration

The platform follows a hybrid architecture.

When the user enters

* LeetCode URL
* Problem Number

InterviewOS

Step 1

Checks Supabase

↓

If problem exists

↓

Load instantly

Else

↓

Fetch metadata from LeetCode GraphQL

↓

Store permanently in Supabase

↓

Display automatically

The user only enters

* Solve Time
* Notes
* Mistakes
* Difficulty experienced
* Confidence

Everything else is automatic.

---

# Core Modules

Dashboard

Today's Tasks

Problem Library

Revision System

Patterns

Mistakes

Analytics

Interview Readiness

Roadmap

Achievements

Settings

---

# Revision Philosophy

InterviewOS follows spaced repetition.

Schedule

Day 1

↓

Day 2

↓

Day 4

↓

Day 7

↓

Day 14

↓

Day 30

↓

Day 60

↓

Day 90

↓

Day 180

If the user fails a revision

Restart

↓

Tomorrow

---

# Dashboard Experience

Instead of statistics,

the dashboard provides actions.

Example

Good Morning

Today's Goal

Solve

2 Problems

Revise

5 Problems

Estimated Time

58 Minutes

Current Streak

42 Days

Interview Readiness

82%

Weakest Topic

Graphs

Start Today's Session

---

# Key Features

* Automatic LeetCode Import
* Smart Revision
* GitHub Heatmap
* Progress Tracking
* Pattern Analytics
* Mistake Analytics
* Confidence Tracking
* Interview Readiness
* Company Readiness
* Daily Roadmap
* Achievement System
* Study Statistics

---

# Technical Stack (MVP)

Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* TanStack Query
* React Hook Form
* Zod
* Recharts

Backend

* Supabase (Database + Auth + Storage + RLS)
* No custom backend in MVP

Deployment

* Vercel
* Supabase

---

# Future Roadmap

### Version 2

* AI Coach
* Personalized Study Plans
* AI Mistake Analysis
* Resume Analysis
* Company Interview Preparation
* Contest Tracker
* AI Interview Readiness
* LLM Chat Assistant

### Version 3

* Mobile Apps
* Community
* Team Features
* Mentor Dashboard
* Mock Interviews
* System Design Tracker
* Behavioral Interview Prep

---

# Product Principles

* Build for long-term learning, not one-time tracking.
* Minimize manual data entry through automation.
* Show users what to do next, not just what they have done.
* Prioritize consistency over volume.
* Use measurable analytics to improve interview preparation.
* Keep the experience fast, clean, and distraction-free.
* Ensure every feature contributes directly to interview readiness.

---

