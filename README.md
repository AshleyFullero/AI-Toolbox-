<div align="center">

# AI Toolbox

**A production-ready, full-stack AI platform built with Next.js 14 App Router.**  
Chat with GPT-4o-mini, summarise documents, generate images with Stable Diffusion XL, and manage your account - all from a single, polished dashboard.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5-purple?logo=auth0&logoColor=white)](https://authjs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Testing](#testing)
- [Branch Strategy](#branch-strategy)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AI Toolbox is a multi-tool AI platform designed as a showcase of modern, production-grade Next.js development patterns. It integrates multiple AI providers behind a unified, authenticated dashboard — demonstrating real-world patterns for streaming responses, image generation pipelines, database-backed sessions, and subscription management.

**Built to be:**
- **Secure** — All AI routes are authenticated server-side; middleware guards every dashboard path at the Edge
- **Production-ready** — Standalone Docker build, PostgreSQL-backed sessions, Stripe-ready subscription model
- **Maintainable** — Strict TypeScript, Zod request validation at every API boundary, co-located route handlers
- **Responsive** — Mobile-first layout with a sticky navbar, dark/light theme, and fluid component design

---

## Features

| Feature | Description |
|---|---|
| **AI Chat** | Streaming conversations with `gpt-4o-mini` via the Vercel AI SDK. Supports full message history within a session. |
| **AI Summarisation** | Condense any text (up to 10,000 chars) into bullet points, prose paragraphs, or a TL;DR — user's choice. |
| **Image Generation** | Text-to-image via Stable Diffusion XL on Replicate. Configurable resolution & inference steps. Saves history per user. |
| **Authentication** | Email/password credentials + Google and GitHub OAuth, all via NextAuth.js v5 with a Prisma database adapter. |
| **User Profiles** | Avatar, display name, and account management. |
| **Subscription Tiers** | Stripe integration scaffold with `FREE`, `PRO`, and `ENTERPRISE` plan enums; auto-provisioned on sign-up. |
| **Theme Switching** | System-aware dark/light mode with manual toggle, persisted via cookie using `next-themes`. |
| **Route Protection** | Edge middleware detects session cookies — no heavy imports, no latency. Server components re-validate with `auth()`. |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org) App Router | 14.2 |
| **Language** | [TypeScript](https://typescriptlang.org) (strict mode) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | 3.x |
| **ORM** | [Prisma](https://prisma.io) | 5.x |
| **Database** | PostgreSQL | 14+ |
| **Auth** | [NextAuth.js](https://authjs.dev) v5 beta | 5.0.0-beta |
| **AI — Text** | [OpenAI](https://openai.com) `gpt-4o-mini` via [Vercel AI SDK](https://sdk.vercel.ai) | 4.x |
| **AI — Image** | [Replicate](https://replicate.com) (Stable Diffusion XL) | 1.x |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) | 5.x |
| **Validation** | [Zod](https://zod.dev) + [react-hook-form](https://react-hook-form.com) | 3.x / 7.x |
| **Payments** | [Stripe](https://stripe.com) | 17.x |
| **Testing** | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com) | 2.x |

---

## Architecture

```
Browser
  │
  ├─▶ Edge Middleware (25.8 kB)
  │     └─ Cookie-based session detection → redirect or allow
  │
  └─▶ Next.js App Router (Node.js)
        ├─ Server Components  →  auth() session check  →  PostgreSQL (Prisma)
        ├─ Client Components  →  React Query / useChat / form hooks
        └─ API Routes (Node.js runtime)
              ├─ /api/chat       →  OpenAI (streaming SSE)
              ├─ /api/summarise  →  OpenAI (JSON response)
              ├─ /api/image      →  Replicate SDXL  →  Prisma (save history)
              └─ /api/auth       →  NextAuth.js v5 handler
```

### Key Design Decisions

- **Node.js runtime on all API routes** — `bcryptjs`, `@prisma/client`, and `openai` are Node.js-only. Each route file explicitly sets `export const runtime = 'nodejs'`.
- **Lightweight Edge middleware** — Avoids importing `auth()` (which pulls in `bcryptjs`) to remain Edge-compatible. Cookie presence is used as a fast, stateless gate.
- **Database sessions** — NextAuth configured with `strategy: 'database'` for durable sessions stored in PostgreSQL, compatible with multi-region deployments.
- **Auto-subscription provisioning** — The NextAuth `createUser` event automatically creates a `FREE` subscription record for every new user.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **PostgreSQL** 14 or later (local or hosted, e.g. [Railway](https://railway.app), [Neon](https://neon.tech))
- API keys for OpenAI and Replicate (see [Environment Variables](#environment-variables))

### 1. Clone the repository

```bash
git clone https://github.com/AshleyFullero/AI-Toolbox-.git
cd AI-Toolbox-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in all required values. See the [Environment Variables](#environment-variables) table below.

### 4. Set up the database

```bash
# Development — push schema directly (no migration history)
npm run db:push

# Production — run tracked migrations
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Register an account to access the dashboard.

### Docker (Local Development)

Spin up both the app and a PostgreSQL instance together:

```bash
docker-compose up -d
```

| Service | URL |
|---|---|
| App | `http://localhost:3000` |
| Prisma Studio | `http://localhost:5555` (run `npm run db:studio`) |

---

## Environment Variables

Copy `.env.example` to `.env` and populate the following values:

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/ai_toolbox` |
| `NEXTAUTH_SECRET` | Random secret for session encryption. Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of your deployment, e.g. `http://localhost:3000` |
| `OPENAI_API_KEY` | OpenAI API key (starts with `sk-`) |
| `REPLICATE_API_TOKEN` | Replicate API token (starts with `r8_`) |
| `NEXT_PUBLIC_APP_URL` | Public URL used in Open Graph metadata |

### Optional

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for the frontend |
| `NEXT_PUBLIC_APP_NAME` | Display name of the app (default: `AI Toolbox`) |

---

## Database Schema

Managed via Prisma with a PostgreSQL backend. Key models:

| Model | Purpose |
|---|---|
| `User` | Core identity. Supports credentials (hashed password) and OAuth. Includes `USER` / `ADMIN` role enum. |
| `Account` | OAuth provider account links (NextAuth PrismaAdapter). |
| `Session` | Database-persisted sessions (NextAuth). |
| `VerificationToken` | Email verification tokens (NextAuth). |
| `ChatHistory` | Named chat session container, linked to a user. |
| `ChatMessage` | Individual message within a chat history (`user` / `assistant` / `system`). |
| `ImageGeneration` | Stores prompt, output URL, dimensions, and model for every generated image. |
| `Subscription` | Per-user plan (`FREE` / `PRO` / `ENTERPRISE`) and Stripe billing metadata. |

```bash
# View and edit data in a browser UI
npm run db:studio
```

---

## API Reference

All routes are under `/api/`. POST requests accept and return `application/json` unless specified.  
All routes require an active session — unauthenticated requests receive `401 Unauthorized`.

---

### `POST /api/chat`

Stream a response from `gpt-4o-mini`.

**Request**
```json
{
  "messages": [
    { "role": "user", "content": "Explain quantum entanglement simply." }
  ]
}
```

**Response** — Server-Sent Events (text/event-stream), compatible with the Vercel AI SDK `useChat` hook.

---

### `POST /api/summarise`

Summarise a block of text in one of three styles.

**Request**
```json
{
  "text": "Your long-form text here... (10–10,000 characters)",
  "style": "bullet" | "paragraph" | "tldr"
}
```

**Response**
```json
{
  "summary": "• Key insight one\n• Key insight two\n..."
}
```

| Style | Output |
|---|---|
| `bullet` | 3–7 markdown bullet points |
| `paragraph` | 2–3 prose paragraphs |
| `tldr` | 1–2 sentence ultra-concise summary |

---

### `POST /api/image`

Generate an image with Stable Diffusion XL on Replicate.

**Request**
```json
{
  "prompt": "A futuristic cityscape at night, neon lights, cinematic",
  "width": 1024,
  "height": 1024,
  "num_inference_steps": 30,
  "negative_prompt": "blurry, watermark"
}
```

**Response**
```json
{
  "imageUrl": "https://replicate.delivery/...",
  "prompt": "A futuristic cityscape..."
}
```

> Generation is also saved to the user's history in the database.

---

### `GET /api/image`

Retrieve the authenticated user's image generation history (last 20, newest first).

**Response**
```json
{
  "generations": [
    {
      "id": "...",
      "prompt": "...",
      "imageUrl": "https://replicate.delivery/...",
      "width": 1024,
      "height": 1024,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `GET|POST /api/auth/[...nextauth]`

NextAuth.js catch-all handler. Key endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/auth/session` | Returns the current session |
| `POST` | `/api/auth/signin` | Initiates sign-in |
| `POST` | `/api/auth/signout` | Signs out the current user |
| `GET` | `/api/auth/providers` | Lists configured providers |
| `GET` | `/api/auth/csrf` | Returns the CSRF token |

---

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add all [environment variables](#environment-variables) in **Project Settings → Environment Variables**.
4. Deploy. Vercel auto-detects Next.js and uses the `standalone` output.

> **Note:** Set `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://your-app.vercel.app`).

### Database — Railway or Neon

**Railway:**
```bash
# After creating a PostgreSQL service on Railway:
npm run db:migrate  # Run against your production DATABASE_URL
```

**Neon (serverless PostgreSQL):**  
Create a project at [neon.tech](https://neon.tech), copy the connection string, and set it as `DATABASE_URL`.

### Docker (Self-hosted)

```bash
# Build the standalone image
docker build -t ai-toolbox .

# Run with PostgreSQL via docker-compose
docker-compose up -d
```

The `Dockerfile` uses the Next.js `standalone` output mode for a minimal production image.

---

## Testing

```bash
# Run all tests in watch mode
npm test

# Run all tests once (CI mode)
npm run test:run

# Open the Vitest browser UI
npm run test:ui
```

Tests use **Vitest 2** with **React Testing Library** and a `jsdom` environment.

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code |
| `develop` | Integration branch — merge feature branches here first |
| `feature/ai-chat` | Streaming chat and summarisation UI |
| `feature/ai-image` | Image generation UI and history |
| `feature/auth` | Authentication flows and user profiles |
| `feature/dashboard` | Dashboard layout and navigation |

### Naming Convention

```
feature/<short-description>
fix/<issue-number>-<short-description>
chore/<task-description>
docs/<what-you-documented>
```

---

## Contributing

1. **Fork** the repository.
2. **Create** a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes following the [Conventional Commits](https://www.conventionalcommits.org) format:
   ```bash
   git commit -m "feat(chat): add message history persistence"
   git commit -m "fix(auth): resolve session expiry race condition"
   ```
4. **Push** to your fork and open a **Pull Request** against `develop`.
5. Ensure all CI checks pass (lint, type-check, tests) before requesting review.

### Pull Request Template

```markdown
## Summary
<!-- What does this PR do and why? -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactor / chore
- [ ] Documentation

## Testing
<!-- Describe how you tested your changes -->

## Checklist
- [ ] Code follows the project style guidelines
- [ ] Tests added or updated where applicable
- [ ] All existing tests pass (`npm run test:run`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Documentation updated where needed
```

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using [Next.js](https://nextjs.org), [Prisma](https://prisma.io), and [OpenAI](https://openai.com)

</div>
