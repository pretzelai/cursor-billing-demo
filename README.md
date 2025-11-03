# Cursor-Style Billing Demo App

A demo application that mimics the Cursor text editor interface to showcase Lumen's billing integration capabilities.

## Features

- **Three-panel layout** mimicking Cursor editor:
  - Left: File explorer with e-commerce product catalog files
  - Center: Monaco code editor with syntax highlighting
  - Right: AI chat assistant for Lumen billing queries

- **Interactive demos**:
  - Tab completion (press `Tab` or `Cmd/Ctrl + Space`)
  - AI chat responses about Lumen billing features

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### Tab Completion Demo
- Click in the editor
- Press `Tab` or `Cmd/Ctrl + Space` to see a code completion suggestion
- The suggestion popup will auto-hide after 3 seconds

### AI Chat Demo
Ask the AI assistant about Lumen billing features:
- "How do I check subscription status?"
- "Show me usage tracking"
- "How do I implement feature entitlements?"
- "Tell me about customer data"

The AI will respond with relevant code examples and explanations.

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - VS Code editor component
- **Lucide React** - Icons

## Demo Purpose

This app demonstrates how Lumen's billing SDK can be integrated into a SaaS application. The fake codebase shows an e-commerce product catalog, while the AI assistant helps with billing implementation using Lumen's SDK.

## Key Files

- `app/page.tsx` - Main layout with three panels
- `components/FileExplorer.tsx` - Left sidebar file tree
- `components/CodeEditor.tsx` - Center code editor with tab completion
- `components/ChatPanel.tsx` - Right sidebar AI chat interface

## Customization

You can easily customize:
- File structure in `FileExplorer.tsx`
- Sample code in `CodeEditor.tsx`
- AI responses in `ChatPanel.tsx`
