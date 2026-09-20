Revoraa Mobile App - Frontend Specification Document (FSD)

Version: 1.0
Platform: iOS + Android
Framework: React Native + Expo
Design Language: Revoraa Design System
Status: Product Specification

1. Overview

The Revoraa mobile application is not a copy of the web dashboard.

It is a mobile-first experience designed around speed, focus, daily consistency, and interview preparation.

The app should feel premium, modern, smooth, and intuitive while maintaining the Revoraa brand identity.

Core principles:

Mobile-first
One-handed usability
Minimal cognitive load
Fast navigation
Beautiful animations
Black + Gold design language
Consistent spacing
Native interactions
2. Design Language
Theme

Dark Premium

Primary Background

#070707

Secondary Background

#111111

Card Background

#181818

Border

rgba(255,255,255,0.06)

Primary Accent

#F5A623

Secondary Gold

#FFB938

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Text Primary

#FFFFFF

Text Secondary

#A1A1AA
3. Typography

Headings

SF Pro Display

Bold

Body

SF Pro Text

Medium

Buttons

SemiBold

Numbers

Bold

Statistics

Extra Bold

4. Corner Radius

Cards

24px

Buttons

18px

Input

16px

Bottom Sheet

32px

Badges

999px
5. Shadows

Soft Shadow

Blur

Medium

Opacity

10%

Glow

Gold glow only on active items.

Never excessive neon.

6. Navigation

Bottom Navigation

Home

Problems

Revision

Atlas

Profile

Maximum

5 Tabs

No sidebar.

7. Screen Flow
Splash

↓

Onboarding

↓

Login

↓

Dashboard

↓

Bottom Navigation
8. Splash Screen

Large Revoraa logo

Animated gold ring

Loading progress

Soft gradient

Duration

2 seconds

9. Onboarding

Three screens

Screen 1

Track DSA Progress

Screen 2

Master Interview Preparation

Screen 3

Build Consistency

Large illustrations

Glass card

Large CTA

Skip button

10. Authentication

Email

Google

GitHub

Apple (iOS)

Animated login card

Native keyboard behavior

11. Dashboard

Inspired by premium productivity apps.

Contains

Morning greeting

Daily streak

XP progress

Coins

Today's goal

Quick actions

Recent activity

Today's revision

Interview readiness

Layout

Header

↓

Stats Cards

↓

Today's Revision

↓

Quick Actions

↓

Progress

↓

Recent Problems
12. Cards

Rounded

Glassmorphism

Soft gradients

Gold highlights

Animated hover

Press scale

0.97
13. Buttons

Primary

Gold

Secondary

Dark Glass

Danger

Red

Floating

Circular

14. Dashboard Widgets

Daily XP

Revision Due

Problems Solved

Current Streak

Interview Progress

Weak Topics

Upcoming Reviews

Weekly Activity

15. Problem Library

Large search

Filters

Difficulty chips

Platform chips

Company chips

Swipe actions

Long press

Bottom sheet

16. Add Problem

Multi-step flow

Screen 1

Problem Details

↓

Screen 2

Topic

↓

Pattern

↓

Difficulty

↓

Notes

↓

Save

Never long forms.

17. Today's Revision

Timeline layout

Due cards

Confidence buttons

Easy swipe

Mark completed

Animated success

18. DSA Atlas

Accordion UI

Topic cards

Pattern cards

Progress rings

Mastery badges

Search

No tree visualization.

Mobile optimized.

19. Interview Readiness

Most important screen.

Structure

Header

↓

Overall Progress

↓

Company Cards

↓

Topic Accordion

↓

Questions

↓

Resources

Company Card

Logo

Company Name

Questions

Solved

Progress

Difficulty

Estimated Time

Tap

↓

Company Page

20. Company Page

Header

Company logo

Question count

Progress

Difficulty stats

Accordion

Arrays

↓

Patterns

↓

Questions

Question Row

Checkbox

Problem

Difficulty

Companies

LeetCode

GFG

Bookmark

Mark Solved

21. Analytics

Charts

Weekly XP

Heatmap

Topics

Solve Time

Accuracy

Progress Rings

22. Achievements

Grid layout

Locked

Unlocked

Animated badge

Gold glow

23. Profile

Avatar

XP

Coins

Current Level

Statistics

Logout

Edit Profile

24. Settings

Account

Notifications

Theme

Language

Privacy

About

Support

No subscription section.

25. Notifications

Native cards

Grouped

Unread badge

Swipe delete

26. Search Experience

Global search

Animated search

Instant suggestions

Recent searches

Voice search (future)

27. Bottom Sheets

Use everywhere

Instead of full screens

Examples

Problem details

Revision result

Filters

Bookmarks

Settings

28. Gestures

Swipe

Long Press

Pull to Refresh

Drag Bottom Sheet

Haptic Feedback

29. Loading States

Skeleton cards

Animated shimmer

Never blank pages.

30. Empty States

Illustration

Helpful message

CTA

No boring text.

31. Error States

Friendly message

Retry

Offline indicator

32. Offline Mode

Cached dashboard

Cached revision

Cached solved problems

Queue actions

Auto sync

33. Animations

Library

Reanimated

Moti

Micro animations

Page transitions

Shared element

Progress animations

Button scale

Card fade

Accordion expand

60 FPS target

34. Responsive Rules

Support

iPhone SE

iPhone 16

iPhone Pro Max

Pixel

Samsung

Nothing

OnePlus

Tablets

Landscape

35. Accessibility

Dynamic font

Screen reader

Touch target

48dp minimum

High contrast

36. Performance Targets

Cold Start

<2 sec

Navigation

<200ms

Animations

60 FPS

Image Lazy Loading

Pagination

Virtual Lists

37. Icon System

Lucide Icons

Filled active

Outline inactive

Gold active

Gray inactive

38. Components Library

Reusable components only:

PrimaryButton
SecondaryButton
GlassCard
StatCard
ProgressRing
CompanyCard
TopicAccordion
QuestionRow
SearchBar
DifficultyBadge
XPCard
CoinCard
RevisionCard
EmptyState
SkeletonLoader
BottomSheet
ProfileHeader
FloatingActionButton
39. Design Inspirations

The mobile experience should blend the strengths of several premium design styles rather than copying any single app.

Use inspiration from:

Linear → spacing, typography, minimal UI
Notion Calendar → clean navigation and calendar interactions
Duolingo → streaks, progress motivation, achievement feedback
GitHub Mobile → information hierarchy and readability
Headspace → calming animations and onboarding flow
Arc Browser Mobile → fluid transitions and gesture-first interactions
Apple Human Interface Guidelines → native feel on iOS
Material Design 3 → native Android behavior where appropriate

The app should retain the existing Revoraa identity:

Premium black background
Warm gold accent
Glassmorphism cards
Soft shadows
Rounded corners
Smooth micro-interactions
Clean typography
Minimal visual clutter

Avoid gradients that overpower the content, oversized cards, excessive glow effects, or dashboard designs copied directly from web layouts.

40. Frontend Quality Checklist

Before release, every screen must satisfy:

✅ Uses shared design system components only
✅ Pixel-perfect spacing based on an 8-point grid
✅ Responsive across all supported screen sizes
✅ 60 FPS animations with no dropped frames
✅ No horizontal scrolling
✅ No overflow or clipped content
✅ Proper safe-area handling (Dynamic Island, notches, Android cutouts)
✅ Dark theme consistency throughout the app
✅ Gold accent used consistently for primary actions
✅ Accessible touch targets (minimum 48dp)
✅ Skeleton loaders for all network-bound content
✅ Empty and error states for every API-driven screen
✅ Offline support with graceful sync behavior
✅ Zero React Native warnings
✅ Zero console errors
✅ TypeScript strict mode passes without errors
✅ Reusable, scalable component architecture
✅ Production-ready performance and polish