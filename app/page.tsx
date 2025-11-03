'use client'

import { useState } from 'react'
import FileExplorer from '@/components/FileExplorer'
import CodeEditor from '@/components/CodeEditor'
import ChatPanel from '@/components/ChatPanel'

export default function Home() {
  const [selectedFile, setSelectedFile] = useState('products.ts')
  const [showCompletion, setShowCompletion] = useState(false)

  return (
    <main className="flex h-screen bg-editor-bg text-white">
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
    </main>
  )
}
