# Cursor-Style Billing Demo App

A demo application that mimics the Cursor text editor interface to showcase Lumen's billing integration capabilities.

## Features

- **Three-panel layout** mimicking Cursor editor:
  - Left: File explorer with e-commerce product catalog files
  - Center: Monaco code editor with syntax highlighting
  - Right: AI chat assistant for coding help

- **Interactive demos with Lumen billing gates**:
  - **Tab completion** (press `Tab` or `Cmd/Ctrl + Space`) - Gated by feature entitlement
  - **AI chat** responses - Gated by usage limits

- **Backend architecture**:
  - Mock authentication system
  - Lumen SDK integration for billing checks
  - API routes with proper authorization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Add your Lumen API key to .env
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

The AI will respond with relevant code examples. **Gated by Lumen usage limits.**

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - VS Code editor component
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Lumen SDK** - Billing and usage tracking
- **Mock Auth System** - Simulates user authentication

## Architecture

### How Billing Gates Work

1. **Frontend** - User triggers action (tab completion or AI chat)
2. **Backend API** - Receives request from frontend
3. **Auth Check** - Verifies user is logged in (`lib/auth.ts`)
4. **Lumen Check** - Checks feature entitlement or usage limits (`lib/lumen.ts`)
5. **Gate Decision**:
   - ✅ **Allowed** - Returns completion/response + tracks usage
   - ❌ **Blocked** - Returns error with upgrade message (402/429 status)
6. **Frontend** - Displays result or shows upgrade prompt

### Key Files

#### Frontend Components
- `app/page.tsx` - Main layout with three panels
- `components/FileExplorer.tsx` - Left sidebar file tree
- `components/CodeEditor.tsx` - Code editor (calls `/api/completion`)
- `components/ChatPanel.tsx` - AI chat (calls `/api/chat`)

#### Backend
- `lib/auth.ts` - Mock authentication system
- `lib/lumen.ts` - Lumen SDK client
- `app/api/completion/route.ts` - Tab completion API (gated by Lumen)
- `app/api/chat/route.ts` - AI chat API (gated by Lumen)

## Lumen Integration Points

### Feature Entitlement Check
```typescript
const hasAccess = await lumen.isFeatureEntitled(userId, 'ai_completions')
```

### Usage Limit Check
```typescript
const usage = await lumen.getUsage(userId)
if (usage.ai_messages >= usage.ai_messages_limit) {
  // Block and show upgrade message
}
```

### Usage Tracking
```typescript
await lumen.sendEvent({
  userId,
  eventName: 'ai_completion',
  value: 1
})
```

## Customization

You can easily customize:
- **Mock user data** in `lib/auth.ts`
- **Lumen billing rules** in `lib/lumen.ts` (limits, plans, features)
- **File structure** in `components/FileExplorer.tsx`
- **Sample code** in `components/CodeEditor.tsx`
- **AI responses** in `app/api/chat/route.ts`
