# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

**Lint code:**

```bash
npm run lint
```

**Format code:**

```bash
npm run format
```

**Check formatting:**

```bash
npm run format:check
```

## Architecture Overview

This is a React 19 + TypeScript playground project using Vite as the build tool. The codebase serves as an experimental environment for testing React patterns and integrations.

**Project Structure:**

- `src/main.tsx` - Application entry point with providers (Apollo, MUI Theme, Router)
- `src/components/` - Reusable components including custom toast system
- `src/hooks/` - Custom hooks (useIntersectionObserver, usePolling, useToast)
- `src/pages/` - Route-based page components organized by feature
