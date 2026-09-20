🔐 Revoraa Security & Access Architecture Document (SAD)

Version: 1.0
Status: Pre-Production

1. Purpose

The purpose of this document is to establish the security architecture for Revoraa across:

Web
Mobile
Backend
Database
Authentication
APIs
Infrastructure

The goal is to ensure:

User data isolation
Zero data leakage
Secure authentication
Secure API access
Secure deployments
Compliance with modern SaaS security practices
2. Security Principles

Revoraa follows these principles:

Least Privilege Access
Zero Trust
Defense in Depth
Secure by Default
Fail Securely
Principle of Data Isolation
3. User Roles
Guest

Permissions

View Landing Page
Register
Login

Cannot

Access dashboard
Access API
Read user data
Authenticated User

Permissions

Own Dashboard
Own Problems
Own Analytics
Own Revision
Own Atlas
Own Interview Progress
Own Coins
Own Achievements

Cannot

Access another user's data
Access admin APIs
Modify system tables
Admin

Permissions

Admin Dashboard
User Management
Analytics
Monitoring
Audit Logs

Cannot

View sensitive credentials
Read passwords
Access OAuth tokens
4. Authentication

Supported

Email
Google OAuth
GitHub OAuth

Authentication handled only by

Supabase Auth

Never build custom authentication.

5. Authorization

Authorization is enforced at three levels

Level 1

Frontend Route Protection

Protected routes

/dashboard

/profile

/interview

/atlas

/revision

/settings

Unauthenticated users

↓

Redirect to Login

Level 2

API Authorization

Every request

↓

Validate JWT

↓

Extract auth.uid()

↓

Execute

Never trust frontend user IDs.

Level 3

Database Authorization

Every table protected using

Row Level Security

6. Row Level Security

Mandatory

Tables

profiles

solved_problems

revision_schedule

analytics

user_stats

coin_transactions

user_pattern_progress

user_topic_progress

roadmap_progress

notifications

device_sessions

Policy

auth.uid() = user_id

No exceptions.

7. User Isolation

Every query must automatically filter by

auth.uid()

Never

SELECT *

FROM solved_problems

Instead

WHERE user_id = auth.uid()

This prevents

data leakage
enumeration
cross-user access
8. API Security

Every API

↓

JWT Validation

↓

Permission Check

↓

Execute

↓

Audit Log

9. RPC Security

RPCs

Must never trust frontend.

Instead

Validate

auth.uid()

inside PostgreSQL.

10. Secrets Management

Never expose

Service Role
Database Password
Razorpay Secret
GitHub Secret
Google Secret
Resend Secret

Store only

Supabase Secrets

GitHub Secrets

Environment Variables

11. Mobile Security

Mobile stores only

Supabase URL

Anon Key

Never store

Service Role

Private Keys

Database Password

12. Token Management

Use

Supabase Session

Automatic Refresh

Secure Storage

React Native

↓

Expo SecureStore

Never AsyncStorage

13. Password Policy

Minimum

8 characters

Encourage

uppercase
lowercase
numbers
symbols

Passwords never stored manually.

Handled by Supabase.

14. OAuth Security

Google

GitHub

Redirect URI validation

Allowed domains only

No wildcard callbacks.

15. Edge Functions

Every function

Validate

JWT

↓

Permission

↓

Execute

↓

Log

16. SQL Injection Protection

Only

Parameterized Queries

RPCs

Supabase Query Builder

Never

String concatenation

17. XSS Protection

Sanitize

Notes

Titles

Comments

User input

Render text safely.

18. CSRF

Handled by

Supabase Auth

HTTPS

Secure Cookies

19. Rate Limiting

Authentication

5 attempts

↓

Cooldown

API

100 requests

↓

Minute

Admin APIs

Stricter limits

20. Device Sessions

Track

Device Name
Platform
Login Time
Last Active

Allow

Logout Other Devices

21. Secure Storage

React Native

Use

Expo SecureStore

Store

Access Token
Refresh Token

Never

User Password

22. Encryption

HTTPS only

TLS 1.3

Database

Encrypted

Storage

Encrypted

23. Logging

Never log

Passwords

Tokens

Secrets

JWT

Private Keys

Only

Errors

Warnings

Audit Events

24. Monitoring

Sentry

Crash Reports

PostHog

Analytics

Supabase Logs

Database

GitHub Actions

Deployment
25. Audit Logs

Track

Login

Logout

OAuth

Delete Problem

Update Profile

Admin Actions

Subscription Changes (future)

26. Git Security

Never push

.env

.env.local

.env.production

supabase/.env

service-role

private keys

Google JSON

Apple certificates
27. Git Ignore
.env*

node_modules

.expo

android/app/build

ios/build

dist

coverage

*.keystore

*.jks

GoogleService-Info.plist

google-services.json
28. Branch Strategy

main

↓

production

develop

↓

staging

feature/*

↓

individual features

29. Deployment

GitHub

↓

CI

↓

Tests

↓

Type Check

↓

Build

↓

Deploy

↓

Health Check

↓

Production

30. Backup Strategy

Daily

Database Backup

Storage Backup

Point-in-Time Recovery

Enabled

31. Disaster Recovery

If deployment fails

↓

Rollback

↓

Previous Version

↓

Restore

Target

< 10 minutes

32. Security Testing

Before every release

Run

ESLint
TypeScript
npm audit
Secret scan
Dependency scan
RLS verification
Authentication tests
Authorization tests
API penetration checks
33. Compliance

Target

GDPR-ready
OWASP Top 10 alignment
Secure credential management
Principle of Least Privilege
34. Future Security Roadmap

Future versions may add:

Two-Factor Authentication (2FA)
Biometric login (Face ID / Touch ID)
Passkeys (WebAuthn)
Device trust scoring
Admin IP allow-list
Session anomaly detection
API abuse detection
End-to-end encrypted personal notes
35. Security Checklist

Before every production release, verify:

✅ All RLS policies enabled
✅ No hardcoded secrets
✅ .env files excluded from Git
✅ JWT validation on every protected endpoint
✅ User data isolated by auth.uid()
✅ RPCs enforce server-side authorization
✅ Edge Functions validate tokens
✅ OAuth redirect URLs are restricted
✅ Expo SecureStore used for mobile tokens
✅ HTTPS enforced everywhere
✅ Monitoring (Sentry/PostHog) active
✅ Automated backups configured
✅ CI/CD includes security checks
✅ No critical vulnerabilities from dependency audit
✅ No sensitive information in logs