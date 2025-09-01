# PathFinder

Curated learning resources with email/password auth, roles (user/admin), MongoDB, hybrid search (DB + Gemini), usage tracking, and an admin dashboard.

## Setup

1. Copy `.env.example` to `.env.local` and set:
	- MONGODB_URI, optional MONGODB_DB
	- SESSION_SECRET
	- Optional: GEMINI_API_KEY for AI answers
2. Install dependencies, then run the dev server.

## Scripts

- npm run dev – start dev server
- npm run build – build
- npm start – prod server
- npm run typecheck – TS check

## Features

- Signup/login, logout, profile update
- Roles with admin-only APIs and pages
- Resource repository with tags/categories
- AI-enhanced search and suggestions
- Query logging and charts
- Admin tools: manage users
