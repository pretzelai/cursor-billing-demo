# Cursor-Style Billing Demo App

A demo application that mimics the Cursor text editor interface to showcase stripe-no-webhooks billing integration capabilities.

## Features

- **Three-panel layout** mimicking Cursor editor:
  - Left: File explorer with e-commerce product catalog files
  - Center: Monaco code editor with syntax highlighting
  - Right: AI chat assistant for coding help

- **Interactive demos with stripe-no-webhooks billing gates**:
  - **Tab completion** (press `Tab` or `Cmd/Ctrl + Space`) - Gated by feature entitlement
  - **AI chat** responses - Gated by usage limits

- **Backend architecture**:
  - Mock authentication system
  - stripe-no-webhooks integration for billing checks
  - API routes with proper authorization

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up stripe-no-webhooks env vars:

```bash
npx stripe-no-webhooks init
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Tab Completion Demo

- Click in the editor
- Press `Tab` or `Cmd/Ctrl + Space` to see a code completion suggestion
- The suggestion popup will auto-hide after 3 seconds

### AI Chat Demo

Ask the AI assistant coding questions:

- "How do I add search filters?"
- "Show me error handling"
- "How can I optimize performance?"
- "Help me with TypeScript types"

The AI will respond with relevant code examples. **Gated by stripe-no-webhooks usage limits.**

## Tech Stack

### Frontend

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - VS Code editor component
- **Lucide React** - Icons

### Backend

- **Next.js API Routes** - Serverless functions
- **stripe-no-webhooks** - Billing and usage tracking
- **Mock Auth System** - Simulates user authentication

## Architecture

### How Billing Gates Work

1. **Frontend** - User triggers action (tab completion or AI chat)
2. **Backend API** - Receives request from frontend
3. **Auth Check** - Verifies user is logged in (`lib/auth.ts`)
4. **stripe-no-webhooks Credits Check** - `billing.credits.hasCredits` checks:
   - Does user's plan include this feature?
   - Does user have remaining credits/quota?
5. **Gate Decision**:
   - ✅ **Allowed** - Execute logic → track usage with `billing.credits.consume` → return result
   - ❌ **Blocked** - Return 402 error with upgrade message
6. **Frontend** - Displays result or shows upgrade prompt

### Key Files

#### Frontend Components

- `app/page.tsx` - Main layout with three panels
- `components/FileExplorer.tsx` - Left sidebar file tree
- `components/CodeEditor.tsx` - Code editor (calls `/api/completion`)
- `components/ChatPanel.tsx` - AI chat (calls `/api/chat`)

#### Backend

- `lib/auth.ts` - Mock authentication system
- `lib/billing.ts` - stripe-no-webhooks client
- `app/api/completion/route.ts` - Tab completion API
- `app/api/chat/route.ts` - AI chat API
