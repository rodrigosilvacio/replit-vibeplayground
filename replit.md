# Vibe Playground

## Overview

Vibe Playground is a collaborative, interactive web application where users can create, drag, and arrange colorful "vibe cards" on a shared canvas. Each vibe card contains a message, emoji, and color, and can be freely positioned anywhere on the screen. The app features a playful, modern aesthetic with real-time updates so users can see each other's vibes appear on the canvas.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state with 2-second polling for real-time updates
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for drag-and-drop interactions and card animations
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared code)

### Backend Architecture
- **Framework**: Express 5 running on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development**: Hot module reloading via Vite middleware in development mode

### Data Layer
- **Database**: PostgreSQL with connection pooling via `pg` Pool
- **Schema Location**: `shared/schema.ts` contains Drizzle table definitions
- **Migrations**: Managed via `drizzle-kit push` command
- **Validation**: Zod schemas generated from Drizzle schemas using `drizzle-zod`

### Project Structure
```
client/           # React frontend application
  src/
    components/   # React components including shadcn/ui
      Navigation.tsx  # Fixed navigation bar component
    hooks/        # Custom React hooks
    pages/        # Route page components
      Playground.tsx  # Main interactive canvas (/)
      Gallery.tsx     # Grid view of all vibes (/gallery)
      About.tsx       # About page with features (/about)
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Code shared between frontend and backend
  schema.ts       # Drizzle database schema
  routes.ts       # API route definitions with Zod validation
```

### Key Design Patterns
- **Shared Types**: Database schemas and API contracts are defined once in `shared/` and used by both frontend and backend
- **Storage Interface**: `IStorage` interface abstracts database operations for potential future flexibility
- **Component Library**: shadcn/ui provides accessible, customizable UI primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### UI/UX Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- **Framer Motion**: Animation and drag-and-drop functionality
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Development server and build tool
- **esbuild**: Production server bundling
- **TypeScript**: Type checking across the entire codebase