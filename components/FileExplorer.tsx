'use client'

import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react'
import { useState } from 'react'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

const fileStructure: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'products.ts', type: 'file' },
      { name: 'categories.ts', type: 'file' },
      { name: 'inventory.ts', type: 'file' },
      { name: 'orders.ts', type: 'file' },
      { name: 'cart.ts', type: 'file' },
    ],
  },
  {
    name: 'lib',
    type: 'folder',
    children: [
      { name: 'database.ts', type: 'file' },
      { name: 'types.ts', type: 'file' },
      { name: 'utils.ts', type: 'file' },
    ],
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'README.md', type: 'file' },
]

interface FileExplorerProps {
  selectedFile: string
  onSelectFile: (file: string) => void
}

function FileTreeItem({
  node,
  selectedFile,
  onSelectFile,
  level = 0,
}: {
  node: FileNode
  selectedFile: string
  onSelectFile: (file: string) => void
  level?: number
}) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen)
    } else {
      onSelectFile(node.name)
    }
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-700/50 ${
          selectedFile === node.name ? 'bg-gray-700' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Folder className="w-4 h-4 text-blue-400" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 text-gray-400" />
          </>
        )}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={index}
              node={child}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FileExplorer({ selectedFile, onSelectFile }: FileExplorerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border-color">
        <h2 className="text-sm font-semibold text-gray-300">EXPLORER</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {fileStructure.map((node, index) => (
            <FileTreeItem
              key={index}
              node={node}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
