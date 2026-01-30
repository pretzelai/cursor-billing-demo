"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  fileName: string;
  showCompletion: boolean;
  onShowCompletion: (show: boolean) => void;
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
}`;

export default function CodeEditor({
  fileName,
  showCompletion,
  onShowCompletion,
}: CodeEditorProps) {
  const [code, setCode] = useState(sampleCode);
  const [cursorPosition, setCursorPosition] = useState({
    lineNumber: 0,
    column: 0,
  });
  const [completionSuggestion, setCompletionSuggestion] = useState("");
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [isLoadingCompletion, setIsLoadingCompletion] = useState(false);
  const editorRef = useRef<any>(null);
  const completionSuggestionRef = useRef("");
  const showCompletionRef = useRef(false);
  const isLoadingCompletionRef = useRef(false);
  const completionErrorRef = useRef<string | null>(null);

  const fetchCompletion = async () => {
    setIsLoadingCompletion(true);
    isLoadingCompletionRef.current = true;
    setCompletionError(null);
    completionErrorRef.current = null;

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          cursorPosition,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 || response.status === 429) {
          setCompletionError(data.message);
          completionErrorRef.current = data.message;
          onShowCompletion(true);
          showCompletionRef.current = true;
          setTimeout(() => {
            onShowCompletion(false);
            showCompletionRef.current = false;
          }, 5000);
          return;
        }
        throw new Error(data.message || "Failed to get completion");
      }

      setCompletionSuggestion(data.completion);
      completionSuggestionRef.current = data.completion;
      onShowCompletion(true);
      showCompletionRef.current = true;
      setTimeout(() => {
        onShowCompletion(false);
        showCompletionRef.current = false;
      }, 3000);
    } catch (error: any) {
      console.error("Completion error:", error);
      setCompletionError(error.message || "Failed to get completion");
      completionErrorRef.current = error.message || "Failed to get completion";
    } finally {
      setIsLoadingCompletion(false);
      isLoadingCompletionRef.current = false;
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Register Tab key command for completions
    editor.addCommand(monaco.KeyCode.Tab, () => {
      // If completion is shown, accept it
      if (
        showCompletionRef.current &&
        completionSuggestionRef.current &&
        !isLoadingCompletionRef.current &&
        !completionErrorRef.current
      ) {
        const position = editor.getPosition();

        // Insert the completion at cursor position
        const range = new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column,
        );

        editor.executeEdits("insert-completion", [
          {
            range,
            text: completionSuggestionRef.current,
          },
        ]);

        // Move cursor to end of inserted text
        const newPosition = {
          lineNumber: position.lineNumber,
          column: position.column + completionSuggestionRef.current.length,
        };
        editor.setPosition(newPosition);

        // Hide completion popup
        onShowCompletion(false);
        showCompletionRef.current = false;
        setCompletionSuggestion("");
        completionSuggestionRef.current = "";
      } else {
        // Otherwise, trigger a new completion
        fetchCompletion();
      }
    });

    // Register Ctrl/Cmd + Space for triggering completions
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      fetchCompletion();
    });
  };

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
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />

        {/* Tab completion popup */}
        {showCompletion && (
          <div
            className="absolute bg-[#2d2d30] rounded shadow-lg p-3 z-50 max-w-md"
            style={{
              top: `${cursorPosition.lineNumber * 19}px`,
              left: "50%",
              transform: "translateX(-50%)",
              border: completionError
                ? "1px solid #f87171"
                : "1px solid #3b82f6",
            }}
          >
            {completionError ? (
              <>
                <div className="text-xs text-red-400 mb-1">
                  ⚠️ {completionError}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <a
                    href="https://cursor.stripe.doctor/pricing"
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    Upgrade your plan
                  </a>
                </div>
              </>
            ) : isLoadingCompletion ? (
              <div className="text-xs text-gray-400">Loading completion...</div>
            ) : (
              <>
                <div className="text-xs text-gray-400 mb-1">AI Suggestion:</div>
                <pre className="text-sm text-green-400 font-mono whitespace-pre">
                  {completionSuggestion}
                </pre>
                <div className="text-xs text-gray-500 mt-2">
                  Press <kbd className="px-1 bg-gray-700 rounded">Tab</kbd> to
                  accept
                </div>
              </>
            )}
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
          <span>
            Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
          </span>
        </div>
      </div>
    </div>
  );
}
