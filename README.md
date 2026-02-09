# CanvasX

AI-powered mobile UI/UX design tool that generates beautiful, production-ready mobile app screens from text prompts in minutes.

![CanvasX Demo](./public/demo.png)

## ✨ Features

- 🤖 **AI-Powered Generation** - Describe your app, get pixel-perfect screens
- 🎨 **Multiple Themes** - Ocean Breeze, Netflix Dark, Acid Lime, Neo Brutalism, and more
- 📱 **Mobile-First** - Optimized for iOS and Android mockups
- 🔄 **Real-time Updates** - Watch your designs generate live
- 💾 **Project Management** - Save and iterate on your designs
- 📸 **Export Screenshots** - Download high-quality PNG exports
- 🌓 **Dark Mode** - Full light/dark theme support

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm/pnpm/yarn
- PostgreSQL 14+
- API keys (see Environment Setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/canvasx.git
   cd canvasx
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Environment Setup

### Required API Keys

#### 1. Google OAuth (Authentication)

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Copy Client ID and Client Secret to `.env`

#### 2. OpenRouter (AI Generation)

- Sign up at [OpenRouter](https://openrouter.ai/)
- Generate API key from dashboard
- Add to `.env` as `OPENROUTER_API_KEY`

#### 3. Unsplash (Image Search)

- Create account at [Unsplash Developers](https://unsplash.com/developers)
- Create new application
- Copy Access Key to `.env`

#### 4. Generate Auth Secret

```bash
openssl rand -base64 32
```

Add output to `.env` as `AUTH_SECRET`

## 📦 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **AI**: OpenRouter (Gemini 3 Pro)
- **Real-time**: Inngest
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: React Query + Context API
- **Screenshot**: Puppeteer

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
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   ├── openrouter.ts    # AI client
│   ├── prompts.ts       # AI prompts
│   └── themes.ts        # Theme definitions
├── inngest/
│   └── functions/       # Background job workers
├── prisma/
│   └── schema.prisma    # Database schema
└── types/               # TypeScript types
```

## 📖 Usage Guide

### Creating Your First Project

1. **Enter a prompt** describing your app:

   ```
   "Fitness tracking app with daily step counter, heart rate monitor,
    and sleep tracking. Use a modern, energetic design."
   ```

2. **Wait for AI generation** (30-60 seconds)
   - Analysis phase: AI plans the screens
   - Generation phase: AI creates each screen
   - Real-time updates show progress

3. **Review your screens**
   - Zoom and pan around the canvas
   - Click screens to view HTML source
   - Select different themes

4. **Export**
   - Download screenshots (PNG)
   - Copy HTML for each screen
   - Use in your design presentations

### Adding More Screens

On any project page:

1. Enter additional prompt (e.g., "Add a profile settings screen")
2. New screens will be added to existing project
3. Theme remains consistent

## 🎨 Available Themes

- **Ocean Breeze** - Fresh, blue professional
- **Netflix Dark** - Bold red on dark
- **Acid Lime** - Neon cyberpunk
- **Neo Brutalism** - Raw, stark design
- **Midnight** - Deep purple elegance
- **Sunset** - Warm orange/pink
- And more...

## 🔑 Key Features Explained

### AI Generation Flow

```
User Prompt → Analysis (Plan screens) → Generation (Create HTML) → Save to DB
                  ↓                           ↓                        ↓
            Real-time event              Real-time event         Display on canvas
```

### Canvas System

- **Device Frames**: iPhone-style mockup containers
- **Zoom & Pan**: Smooth navigation (react-zoom-pan-pinch)
- **Theme Injection**: CSS variables applied dynamically
- **Screenshot**: Server-side Puppeteer rendering

### Real-time Updates

- Powered by Inngest real-time
- WebSocket-like experience
- Status: running → analyzing → generating → completed
- Progressive loading (skeleton frames show immediately)

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Database Setup**
   - Use Vercel Postgres, Supabase, or Railway
   - Update `DATABASE_URL` in Vercel environment
   - Run migrations: `npx prisma migrate deploy`

4. **Update OAuth Callbacks**
   - Add production URL to Google OAuth authorized redirects
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

### Environment Variables for Production

All `.env` variables must be added to Vercel:

- ✅ `DATABASE_URL`
- ✅ `AUTH_SECRET`
- ✅ `AUTH_GOOGLE_ID`
- ✅ `AUTH_GOOGLE_SECRET`
- ✅ `OPENROUTER_API_KEY`
- ✅ `UNSPLASH_ACCESS_KEY`
- ✅ `NODE_ENV=production`

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file
