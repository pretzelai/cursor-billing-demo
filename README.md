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
4. **Lumen Entitlement Check** - `isFeatureEntitled()` checks:
   - Does user's plan include this feature?
   - Does user have remaining credits/quota?
5. **Gate Decision**:
   - ✅ **Allowed** - Execute logic → track usage with `sendEvent()` → return result
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
- `lib/lumen.ts` - Lumen SDK client
- `app/api/completion/route.ts` - Tab completion API (gated by Lumen)
- `app/api/chat/route.ts` - AI chat API (gated by Lumen)

## Lumen Integration Points

This demo uses the official `@getlumen/server` package to implement feature gates following the [Lumen quickstart guide](https://docs.getlumen.dev/getting-started/quickstart).

### Feature Entitlement Check
Checks if user has access to a feature (includes both plan access AND remaining credits):

```typescript
import { isFeatureEntitled } from '@getlumen/server'

const hasAccess = await isFeatureEntitled({
  feature: 'ai-completions',
  userId: user.id
})

if (!hasAccess) {
  // User either doesn't have this feature in their plan
  // OR they've exceeded their usage limit
  return error('Upgrade or out of credits')
}
```

### Usage Tracking
After successful feature consumption, record the event:

```typescript
import { sendEvent } from '@getlumen/server'

// Only call this AFTER the feature is actually used
await sendEvent({
  name: 'ai-completions',
  userId: user.id
})
```

### Implementation Pattern

```typescript
// 1. Check auth
const user = await requireAuth()

// 2. Check entitlement (plan + usage)
if (await isFeatureEntitled({ feature: 'ai-completions', userId: user.id })) {

  // 3. Execute feature logic
  const result = await generateCompletion()

  // 4. Track usage
  await sendEvent({ name: 'ai-completions', userId: user.id })

  return result
}
```

## Customization

You can easily customize:
- **Mock user data** in `lib/auth.ts`
- **Feature names** - Change `'ai-completions'` and `'ai-messages'` to match your Lumen dashboard
- **File structure** in `components/FileExplorer.tsx`
- **Sample code** in `components/CodeEditor.tsx`
- **AI responses** in `app/api/chat/route.ts`

## Setting Up Lumen

1. Sign up at [getlumen.dev](https://getlumen.dev)
2. Create your features in the Lumen dashboard (e.g., `ai-completions`, `ai-messages`)
3. Set up your pricing model and plans
4. Get your API key and add it to `.env`:
   ```
   LUMEN_API_KEY=lumen_sk_your_key_here
   ```
5. The app will automatically gate features based on your Lumen configuration!
