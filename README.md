# CanvasX

AI-powered mobile UI/UX design tool that generates beautiful, production-ready mobile app screens from text prompts in minutes. Built with Next.js 16, Google Gemini AI, and real-time streaming.

![CanvasX Demo](./public/demo.png)

## 🎯 Why CanvasX?

**Transform ideas into designs instantly**

- ⚡ **Fast**: Generate complete mobile UI screens in 30-90 seconds
- 🎨 **Professional**: Production-ready HTML/CSS with modern design patterns
- 🔄 **Iterative**: Add more screens or refine existing ones with simple prompts
- 🎭 **Themeable**: 8+ built-in themes, instant style switching
- 📱 **Mobile-Optimized**: iPhone frames with accurate dimensions
- 💰 **Cost-Effective**: Free tier AI (Google Gemini) with generous limits

## ✨ Features

- 🤖 **AI-Powered Generation** - Describe your app, get pixel-perfect screens powered by Google Gemini
- 🎨 **Multiple Themes** - Ocean Breeze, Netflix Dark, Acid Lime, Neo Brutalism, and more
- 📱 **Mobile-First** - Optimized for iOS and Android mockups
- 🔄 **Real-time Updates** - Watch your designs generate live with Inngest streaming
- 💾 **Project Management** - Save and iterate on your designs
- 📸 **Export Screenshots** - Download high-quality PNG exports via Puppeteer
- 🌓 **Dark Mode** - Full light/dark theme support
- 🔐 **Secure Authentication** - NextAuth with Google OAuth & credentials provider

## 🚀 Quick Start

### Prerequisites

- Bun install
- API keys (see Environment Setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rushikesh5035/CanvasX.git
   cd canvasx
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```bash
   # Database (Neon / PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost:5432/canvasx"

   # Environment
   NODE_ENV="development"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"

   # Authentication (NextAuth + Google OAuth)
   AUTH_SECRET="your-auth-secret-here"
   AUTH_GOOGLE_ID="your-google-oauth-client-id"
   AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

   # AI Generation (Google Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

   # Image Search (Unsplash)
   UNSPLASH_ACCESS_KEY="your-unsplash-access-key"

   # Redis (Upstash - Caching & Rate Limiting)
   UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"

   # Background Jobs (Inngest)
   INNGEST_SIGNING_KEY="your-inngest-signing-key"
   INNGEST_EVENT_KEY="your-inngest-event-key"

   # Payment Gateway (Polar.sh)
   POLAR_ACCESS_TOKEN="your-polar-access-token"
   POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"
   POLAR_SERVER="sandbox"  # "sandbox" for testing, "production" for live

   # Polar Product IDs (server-side)
   POLAR_PRO_PRODUCT_ID="your-polar-pro-product-id"
   POLAR_UNLIMITED_PRODUCT_ID="your-polar-unlimited-product-id"

   # Polar Product IDs (client-side - must match above)
   NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID="your-polar-pro-product-id"
   NEXT_PUBLIC_POLAR_UNLIMITED_PRODUCT_ID="your-polar-unlimited-product-id"
   ```

4. **Set up database**

   ```bash
   # Generate Prisma client
   bunx prisma generate

   # Push schema to database (development)
   bunx prisma db push
   ```

5. **Run development server**

   ```bash
   bun dev
   ```

6. **Run Inngest Dev Server** (in a separate terminal)

   ```bash
   npx --ignore-scripts=false inngest-cli@latest dev
   ```

   This starts the local Inngest server for background job processing.

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **AI/LLM**: Google Gemini models
- **Real-time**: Inngest
- **Caching**: Redis
- **Rate Limiting**: Upstash Ratelimit
- **Styling**: TailwindCSS
- **State Management**: TanStack Query + Context API

## 🏗️ Project Structure

```
canvasx/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (routes)/        # Main app routes
│   ├── api/             # API endpoints
│   └── action/          # Server actions
├── components/
│   ├── canvas/          # Canvas rendering components
│   ├── common/          # Shared components
│   ├── project/         # Project-specific components
│   └── ui/              # Radix UI components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Database client
│   ├── gemini.ts            # Google Gemini AI client
│   ├── redis.ts             # Redis caching functions
│   ├── rate-limit.ts        # Rate limiting configuration
│   ├── handle-rate-limit.ts # Rate limit error handlers
│   ├── prompts.ts           # AI prompt engineering
│   ├── themes.ts            # Theme definitions
│   └── env-check.ts         # Environment validation
├── inngest/
│   └── functions/       # Background job workers
├── prisma/
│   └── schema.prisma    # Database schema
└── types/               # TypeScript types
```
