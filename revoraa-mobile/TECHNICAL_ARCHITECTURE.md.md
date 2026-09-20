📱 Revoraa Mobile
Technical Architecture Document (TAD)

Version: 1.0
Status: Pre-Development
Platform: iOS + Android (React Native)

1. Objective

The objective is to build a production-grade React Native application for Revoraa that reuses the existing web backend while providing a native mobile experience.

The mobile app must not duplicate backend logic.

The web application remains untouched.

The mobile application consumes the same APIs, RPCs, Edge Functions and database.

2. High Level Architecture
                        Revoraa

             ┌────────────────────────┐
             │   React Website (Vite) │
             └───────────┬────────────┘
                         │
                         │
             ┌───────────▼────────────┐
             │     Supabase Backend    │
             │                         │
             │ Authentication          │
             │ PostgreSQL             │
             │ Edge Functions         │
             │ Storage                │
             │ RPC                    │
             └───────────▲────────────┘
                         │
                         │
          ┌──────────────┴──────────────┐
          │                             │
          │ React Native Mobile (Expo)  │
          └─────────────────────────────┘

One backend.

Two clients.

Single source of truth.

3. Repository Structure
Revoraa/

├── web/
│
├── mobile/
│   ├── app/
│   ├── src/
│   ├── assets/
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/
│
└── shared/

The web folder is read-only.

The mobile folder is completely independent.

4. Mobile Folder Structure
mobile/

src/

    app/

    navigation/

    screens/

        auth/

        dashboard/

        atlas/

        revision/

        interview/

        profile/

        settings/

    components/

        buttons/

        cards/

        charts/

        dialogs/

        inputs/

        progress/

        skeleton/

    hooks/

    services/

        auth/

        profile/

        problems/

        analytics/

        interview/

        atlas/

    store/

    lib/

        supabase/

        api/

    types/

    constants/

    theme/

    animations/

    utils/

    assets/

    icons/

    fonts/

    images/

    notifications/
5. Technology Stack
Framework

React Native

Expo SDK

TypeScript

Navigation

React Navigation

Native Stack

Bottom Tabs

State Management

Zustand

Only for:

Auth
Theme
User
Preferences
Server State

TanStack Query

Responsible for

caching
refetching
optimistic updates
pagination
Backend

Supabase

Reuse existing project

Authentication

Supabase Auth

Google

GitHub

Email

Database

Existing PostgreSQL

No schema duplication.

Charts

Victory Native

or

React Native Skia Charts

Animations

Reanimated 3

Gesture Handler

Moti

Icons

Lucide React Native

Storage

MMKV

For

theme

preferences

cache

Notifications

Expo Notifications

Deep Linking

Expo Router

6. Design System

Every screen follows

Background

↓

Header

↓

Scrollable Content

↓

Floating CTA

↓

Bottom Navigation

Spacing

4

8

12

16

20

24

32

48

Radius

8

12

16

20

24
7. Theme

Dark

Background

#090909

Card

#161616

Surface

#202020

Primary

#F59E0B

Success

#22C55E

Warning

#FACC15

Danger

#EF4444

Text

White

Secondary

Gray
8. Authentication Flow
Splash

↓

Check Session

↓

Logged In?

↓

Yes

Dashboard

↓

No

Onboarding

↓

Login

↓

Dashboard
9. Navigation
Bottom Navigation

Home

Atlas

Revision

Interview

Profile

No drawer.

No hamburger menu.

10. Service Layer

Each feature owns its own service.

authService

profileService

problemService

atlasService

analyticsService

interviewService

revisionService

achievementService

notificationService

Never call Supabase directly from screens.

11. Component Architecture

Every screen uses

UI

↓

Hook

↓

Service

↓

Supabase

Example

DashboardScreen

↓

useDashboard()

↓

dashboardService()

↓

RPC

↓

Database
12. API Layer
services/

problemService.ts

atlasService.ts

analyticsService.ts

profileService.ts

Each service

validation
error handling
retry
logging
13. Error Handling

Centralized.

API Error

↓

Error Handler

↓

Toast

↓

Retry

Never crash.

14. Offline Strategy

Cache

Atlas

Interview

Profile

Settings

Pending sync queue

Automatic sync.

15. Push Notifications

Daily Revision

Streak Reminder

XP

Achievements

Interview Goal

16. Security

Never expose

Service Role

Secrets

Private Keys

Only

Supabase URL

Anon Key

Everything sensitive remains in Edge Functions.

17. Performance

Lazy Loading

Memoization

FlatList

FlashList

Image Caching

Skeleton Loading

Background Refresh

No unnecessary renders.

18. Shared Business Logic

Do NOT rewrite

Revision Algorithm

XP

Achievements

Coins

Roadmap

Pattern Detection

Interview Tracking

Atlas Progress

Everything reuses backend RPCs.

19. Data Flow
User

↓

Screen

↓

Hook

↓

Service

↓

RPC

↓

Database

↓

Response

↓

React Query Cache

↓

UI
20. Screen Architecture

Example

Dashboard

Widgets

↓

Continue Learning

↓

Today's Revision

↓

Atlas Progress

↓

Interview Readiness

↓

XP

↓

Coins

↓

Achievements
21. Development Phases
Phase 1
Project setup
Theme
Navigation
Authentication
Phase 2
Dashboard
Profile
Settings
Phase 3
Problem Library
Revision
Phase 4
DSA Atlas
Phase 5
Interview Readiness
Phase 6
Analytics
Achievements
Phase 7
Notifications
Offline
Polish
22. CI/CD

GitHub

↓

GitHub Actions

↓

Lint

↓

Type Check

↓

Tests

↓

Expo Build

↓

EAS Build

↓

TestFlight

↓

Play Console Internal Testing

23. Monitoring
Sentry
PostHog
Expo Updates
Crash Reports
Performance Monitoring
24. Coding Standards
TypeScript strict mode
ESLint
Prettier
Feature-based architecture
No business logic inside UI components
Reusable components only
Strong typing for API responses
Shared theme tokens across all screens
25. Future Expansion

The architecture should support future additions without restructuring:

AI Interview Coach
Mock Interviews
Coding Contests
Community
Real-time Study Groups
Widgets (iOS/Android)
Apple Watch / Wear OS reminders
Desktop app (Electron or Tauri)
Final Architecture Principles
One Backend, Multiple Clients — Web and Mobile share the same Supabase project, RPCs, and business logic.
Mobile-First UX — Native interactions, gestures, animations, and responsive layouts rather than a port of the website.
Feature-Based Architecture — Every feature owns its screens, services, hooks, and state.
Thin UI, Fat Backend — Business rules remain in RPCs and Edge Functions, not duplicated in the app.
Offline-Ready — Frequently used content is cached with automatic background synchronization.
Scalable & Maintainable — New features can be added without rewriting existing modules.
Production Ready — Strong typing, centralized error handling, monitoring, testing, and CI/CD from day one.