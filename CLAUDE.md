# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered web platform called "AI 启航" (AI Voyage) built with React, TypeScript, and Vite. The platform serves as a one-stop AI anti-anxiety solution for workplace professionals, featuring a cyberpunk-inspired dark mode design with glowing effects and glass morphism elements.

## Core Architecture

The application follows a modular React architecture with:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast development
- **Styling**: Tailwind CSS with custom dark theme and cyberpunk aesthetics
- **State Management**: Zustand for global state
- **Routing**: React Router DOM
- **Backend Integration**: Supabase for data persistence
- **AI Integration**: LongCat model API for intelligent Q&A features

## Key Features

1. **AI Tools Square** - Showcase of internal and external AI tools with categorized browsing
2. **Smart Q&A Assistant** - Natural language问答 using LongCat model (API Key: ak_2rU2Ai02G5b04d594p8Vp6Ip5RA0s)
3. **Best Practices Hub** - AI application scenarios and reusable templates
4. **AI Learning Center** - Progressive learning content from basics to advanced
5. **Rewards Square** - Employee需求悬赏 platform with AI expert matching

## Development Commands

```bash
# Start development server (default port 5173)
npm run dev

# Build for production
npm run build

# Type check without emitting
npm run check

# Lint code
npm run lint

# Preview production build
npm run preview

# Expose local server for external access (port 5173)
npm run tunnel

# Update best practices data from external sources
npm run update-practices
```

## Environment Configuration

Required environment variables in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_LONG_CAT_API_KEY` - LongCat AI model API key

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication modals
│   └── layout/         # Layout components (Header, Layout)
├── pages/              # Route-based page components
│   ├── BestPractices/  # AI best practices showcase
│   ├── Tools/          # AI tools directory
│   ├── Learning/       # Educational content
│   ├── QA/             # Intelligent assistant
│   └── Rewards/        #需求悬赏 platform
├── lib/                # Core utilities and services
│   ├── supabase.ts     # Database client
│   └── utils.ts        # Helper functions
├── store/              # Global state management
│   └── useAuthStore.ts # Authentication state
└── data/               # Static data and configurations
    └── bestPractices.ts # Best practices dataset
```

## CI/CD and Automation

- **Daily Update Workflow**: Automatically updates best practices content via GitHub Actions
- **Deployment**: Configured for Vercel deployment with custom domain support
- **Build Process**: TypeScript compilation followed by Vite optimization

## Key Technologies

- **UI Library**: React with TypeScript
- **Component Library**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **HTTP Client**: Built-in fetch API
- **Form Handling**: Custom form management
- **Notifications**: Custom notification system

## API Integration

- **LongCat AI Model**: Primary AI问答 engine
- **Supabase**: Backend-as-a-Service for data persistence
- **External APIs**: Various AI tool integrations

## Testing Strategy

Currently no formal test suite. For new features:
- Manual testing during development
- Browser testing for UI components
- API endpoint validation

## Performance Considerations

- Code splitting via React Router
- Lazy loading of page components
- Optimized build with Vite
- Source maps hidden in production
- Efficient state management with Zustand