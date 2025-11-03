'use client'

import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  fileName: string
  showCompletion: boolean
  onShowCompletion: (show: boolean) => void
}

const sampleCode = `import { db } from '@/lib/database'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
}

// Get all products with pagination
async function getProducts(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit

  const products = await db.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  )

  return products.rows
}

// Get product by ID
async function getProductById(id: string): Promise<Product | null> {
  const result = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  )

  return result.rows[0] || null
}

// Search products by name or category
async function searchProducts(query: string) {
  const products = await db.query(
    'SELECT * FROM products WHERE name ILIKE $1 OR category ILIKE $1',
    [\`%\${query}%\`]
  )

  return products.rows
}

// Create new product
async function createProduct(product: Omit<Product, 'id'>) {
  const result = await db.query(
    'INSERT INTO products (name, description, price, category, stock, imageUrl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [product.name, product.description, product.price, product.category, product.stock, product.imageUrl]
  )

  return result.rows[0]
}

// Update product stock
async function updateStock(id: string, quantity: number) {
  const result = await db.query(
    'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
    [quantity, id]
  )

  return result.rows[0]
}

// Get products by category
async function getProductsByCategory(category: string) {
  const products = await db.query(
    'SELECT * FROM products WHERE category = $1 ORDER BY name',
    [category]
  )

  return products.rows
}

export {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateStock,
  getProductsByCategory
}`

const completionSuggestion = `  const products = await getProductsByCategory('electronics')
  console.log('Found products:', products.length)`

export default function CodeEditor({ fileName, showCompletion, onShowCompletion }: CodeEditorProps) {
  const [code, setCode] = useState(sampleCode)
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 0, column: 0 })
  const editorRef = useRef<any>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab key for completion
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        onShowCompletion(true)

        // Hide after 3 seconds
        setTimeout(() => onShowCompletion(false), 3000)
      }

      // Ctrl/Cmd + Space for completion
      if (e.key === ' ' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        onShowCompletion(true)

        setTimeout(() => onShowCompletion(false), 3000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onShowCompletion])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      })
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d30] border-b border-border-color">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e] rounded">
          <span className="text-sm">{fileName}</span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />

        {/* Tab completion popup */}
        {showCompletion && (
          <div
            className="absolute bg-[#2d2d30] border border-blue-500 rounded shadow-lg p-2 z-50"
            style={{
              top: `${cursorPosition.lineNumber * 19}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-xs text-gray-400 mb-1">Lumen AI Suggestion:</div>
            <pre className="text-sm text-green-400 font-mono whitespace-pre">
              {completionSuggestion}
            </pre>
            <div className="text-xs text-gray-500 mt-2">
              Press <kbd className="px-1 bg-gray-700 rounded">Tab</kbd> to accept
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#007acc] text-xs">
        <div className="flex gap-4">
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex gap-4">
          <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
          <span>Powered by Lumen</span>
        </div>
      </div>
    </div>
  )
}
