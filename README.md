# AI Toolbox 🤖

> A production-ready web platform featuring a comprehensive suite of AI utilities: interactive chat, text summarization, image generation, and intelligent code explanation, accessible via a streamlined, responsive dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🗣️ **AI Chat** – Streaming chat powered by GPT-4o-mini with conversation history
- 📝 **AI Summarisation** – Paste any text and get a concise, structured summary
- 🖼️ **Image Generation** – Text-to-image via Stable Diffusion (Replicate API)
- 💻 **Code Explanation** – Paste code and get a plain-English breakdown
- 🔐 **Authentication** – Email/password + Google/GitHub OAuth via NextAuth.js
- 🌗 **Dark/Light Theme** – System-aware with manual toggle, persisted in a cookie
- 💳 **Subscription Tiers** – Stripe integration skeleton for premium features
- 🛡️ **Route Protection** – Middleware-level auth guard for all dashboard routes

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Prisma 5 (PostgreSQL) |
| Auth | NextAuth.js v5 |
| AI (text) | OpenAI `gpt-4o-mini` via Vercel AI SDK |
| AI (image) | Replicate (Stable Diffusion) |
| Data Fetching | TanStack React Query |
| Validation | Zod + react-hook-form |
| Payments | Stripe (skeleton) |
| Testing | Vitest + React Testing Library |

---

## 📋 Prerequisites

- **Node.js** 18 or later
- **PostgreSQL** 14 or later (local or hosted)
- **API keys** (see Environment Variables table below)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_ORG/ai-toolbox.git
cd ai-toolbox
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in all required values (see table below).

### 4. Set up the database

```bash
# Push schema to database (development)
npm run db:push

# Or run migrations (production)
npm run db:migrate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker (Local Development)

Start a PostgreSQL instance and the app together:

```bash
docker-compose up -d
```

The app will be available at `http://localhost:3000`.  
Prisma Studio at `http://localhost:5555` (run `npm run db:studio`).

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for session encryption. Generate: `openssl rand -base64 32` | ✅ |
| `NEXTAUTH_URL` | Canonical URL of your app (e.g. `http://localhost:3000`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID | ⚠️ Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth app client secret | ⚠️ Optional |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | ⚠️ Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret | ⚠️ Optional |
| `OPENAI_API_KEY` | OpenAI API key (starts with `sk-`) | ✅ |
| `REPLICATE_API_TOKEN` | Replicate API token (starts with `r8_`) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ⚠️ Optional |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | ⚠️ Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ⚠️ Optional |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Display name of the app | ⚠️ Optional |

---

## 📡 API Reference

All API routes are under `/api/`. POST requests expect JSON bodies unless noted.

### `POST /api/chat`

Stream a chat response from GPT-4o-mini.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ]
}
```

**Response:** Server-Sent Events (text stream). Compatible with the Vercel AI SDK `useChat` hook.

---

### `POST /api/summarise`

Summarise a block of text.

**Request Body:**
```json
{
  "text": "Long text to summarise...",
  "style": "bullet" | "paragraph" | "tldr"
}
```

**Response:**
```json
{
  "summary": "• Key point one\n• Key point two\n..."
}
```

---

### `POST /api/image`

Generate an image using Stable Diffusion on Replicate.

**Request Body:**
```json
{
  "prompt": "A futuristic cityscape at night, neon lights, cyberpunk style",
  "width": 768,
  "height": 768,
  "num_inference_steps": 30
}
```

**Response:**
```json
{
  "imageUrl": "https://replicate.delivery/...",
  "prompt": "A futuristic cityscape..."
}
```

---

### `GET/POST /api/auth/[...nextauth]`

NextAuth.js handler. Supports:
- `GET /api/auth/session` – current session
- `POST /api/auth/signin` – sign in
- `POST /api/auth/signout` – sign out
- `GET /api/auth/providers` – available providers

---

## 🏭 Deployment

### Vercel (Recommended for App)

1. Push your repo to GitHub/GitLab/Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Add all environment variables in **Settings → Environment Variables**.
4. Deploy — Vercel handles the rest.

### Railway (Recommended for Database)

1. Create a new project on [Railway](https://railway.app).
2. Add a **PostgreSQL** service.
3. Copy the `DATABASE_URL` from Railway to your Vercel env vars.
4. Run `npm run db:migrate` against your production database.

### Docker (Self-hosted)

```bash
# Build the image
docker build -t ai-toolbox .

# Run with docker-compose (includes PostgreSQL)
docker-compose -f docker-compose.yml up -d
```

---

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests once (CI)
npm run test:run

# Open Vitest UI
npm run test:ui
```

---

## 🌿 Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code |
| `develop` | Integration branch – merge features here first |
| `feature/ai-chat` | Streaming chat and summarisation UI |
| `feature/ai-image` | Image generation UI |
| `feature/auth` | Authentication and user profiles |
| `feature/dashboard` | Main dashboard layout and navigation |

### Branch Naming Convention

```
feature/<short-description>
fix/<issue-number>-<short-description>
chore/<task-description>
docs/<what-you-documented>
```

---

## 🤝 Contributing

1. **Fork** the repository.
2. **Create** a feature branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "feat(chat): add message history persistence"
   ```
4. **Push** to your fork and open a **Pull Request** against `develop`.
5. Ensure all CI checks pass before requesting review.

### PR Template

```markdown
## What does this PR do?
<!-- Brief description -->

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
<!-- How was this tested? -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have added tests where applicable
- [ ] All existing tests pass
- [ ] I have updated documentation where needed
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
