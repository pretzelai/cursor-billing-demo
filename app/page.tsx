'use client'

import { useState } from 'react'
import FileExplorer from '@/components/FileExplorer'
import CodeEditor from '@/components/CodeEditor'
import ChatPanel from '@/components/ChatPanel'
import SubscriptionButton from '@/components/SubscriptionButton'
import CreditUsage from '@/components/CreditUsage'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState('products.ts')
  const [showCompletion, setShowCompletion] = useState(false)

  return (
    <main className="flex flex-col h-screen bg-editor-bg text-white">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-sidebar-bg border-b border-border-color">
        <div className="text-sm text-gray-400">Cursor Demo</div>
        <div className="flex items-center gap-6">
          <CreditUsage />
          <SubscriptionButton />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* File Explorer - Left Panel */}
        <div className="w-64 bg-sidebar-bg border-r border-border-color">
          <FileExplorer selectedFile={selectedFile} onSelectFile={setSelectedFile} />
        </div>

        {/* Code Editor - Center Panel */}
        <div className="flex-1 flex flex-col">
          <CodeEditor
            fileName={selectedFile}
            showCompletion={showCompletion}
            onShowCompletion={setShowCompletion}
          />
        </div>

        {/* AI Chat - Right Panel */}
        <div className="w-96 bg-sidebar-bg border-l border-border-color">
          <ChatPanel />
        </div>
      </div>
    </main>
  )
}
