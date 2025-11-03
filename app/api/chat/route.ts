import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { isFeatureEntitled, sendEvent } from "@/lib/lumen";

/**
 * API Route: AI Chat
 *
 * This endpoint handles AI chat messages
 * Gated by Lumen:
 * 1. User authentication
 * 2. Feature entitlement check (includes plan access + usage limits)
 * 3. Usage tracking after consumption
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check if user is authenticated
    const user = await requireAuth();

    // 2. Check if user has access to AI chat feature
    // This checks both plan access AND usage limits (credits remaining)
    const hasAccess = await isFeatureEntitled(user.id, "ai-messages");

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "feature_not_available",
          message:
            "Upgrade to access AI chat or you have reached your usage limit",
          upgradeUrl: "http://localhost:3000/pricing",
        },
        { status: 402 } // Payment Required
      );
    }

    // 3. Get request body
    const body = await request.json();
    const { message, conversationHistory } = body;

    // 4. Generate AI response (in real app, this would call OpenAI/Anthropic)
    const aiResponse = generateAIResponse(message, conversationHistory);

    // 5. Track the usage event AFTER successful response generation
    // Lumen will record this consumption for billing and quota tracking
    await sendEvent(user.id, "ai-messages");

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "unauthorized", message: "Please log in" },
        { status: 401 }
      );
    }

    console.error("[API] Chat error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Mock AI response generator
 * In a real app, this would call an AI model with the conversation context
 */
function generateAIResponse(userMessage: string, history?: any[]): string {
  const lowerMessage = userMessage.toLowerCase();

  // Same demo responses as before, but now generated server-side
  const demoResponses = [
    {
      trigger: ["search", "filter", "query"],
      response: `To add search functionality with multiple filters, you can extend the query:

\`\`\`typescript
async function searchProducts(query: string, filters?: {
  category?: string
  minPrice?: number
  maxPrice?: number
}) {
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params: any[] = []

  if (query) {
    params.push(\`%\${query}%\`)
    sql += \` AND name ILIKE $\${params.length}\`
  }

  if (filters?.category) {
    params.push(filters.category)
    sql += \` AND category = $\${params.length}\`
  }

  if (filters?.minPrice) {
    params.push(filters.minPrice)
    sql += \` AND price >= $\${params.length}\`
  }

  const products = await db.query(sql, params)
  return products.rows
}
\`\`\``,
    },
    {
      trigger: ["error", "handling", "try", "catch"],
      response: `Good practice to add error handling to your database queries:

\`\`\`typescript
async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    )

    if (!result.rows[0]) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('Failed to fetch product')
  }
}
\`\`\`

Always validate input and handle edge cases!`,
    },
    {
      trigger: ["optimize", "performance", "slow", "faster"],
      response: `Here are some ways to optimize your product queries:

\`\`\`typescript
// 1. Add indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

// 2. Use connection pooling
import { Pool } from 'pg'
const pool = new Pool({ max: 20 })

// 3. Cache frequently accessed data
const cache = new Map<string, Product>()

async function getProductById(id: string) {
  if (cache.has(id)) {
    return cache.get(id)
  }

  const product = await db.query(/* ... */)
  cache.set(id, product)
  return product
}
\`\`\``,
    },
    {
      trigger: ["type", "typescript", "interface"],
      response: `You can extend the Product interface for better type safety:

\`\`\`typescript
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

// For API responses
type ProductDTO = Omit<Product, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

// For creating products
type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
\`\`\``,
    },
    {
      trigger: ["test", "testing", "jest"],
      response: `Here's how to test your product functions:

\`\`\`typescript
import { describe, it, expect, beforeEach } from '@jest/globals'
import { getProductById, createProduct } from './products'

describe('Product Functions', () => {
  beforeEach(async () => {
    await db.query('TRUNCATE products')
  })

  it('should create and retrieve a product', async () => {
    const newProduct = await createProduct({
      name: 'Test Product',
      price: 99.99,
      category: 'test',
      stock: 10,
      description: 'A test product',
      imageUrl: 'https://example.com/image.jpg'
    })

    expect(newProduct.id).toBeDefined()

    const retrieved = await getProductById(newProduct.id)
    expect(retrieved?.name).toBe('Test Product')
  })
})
\`\`\``,
    },
    {
      trigger: ["validation", "validate", "check"],
      response: `Add validation to ensure data integrity:

\`\`\`typescript
function validateProduct(product: CreateProductInput): string[] {
  const errors: string[] = []

  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required')
  }

  if (product.price <= 0) {
    errors.push('Price must be greater than 0')
  }

  if (product.stock < 0) {
    errors.push('Stock cannot be negative')
  }

  if (!product.imageUrl.startsWith('http')) {
    errors.push('Invalid image URL')
  }

  return errors
}

async function createProduct(product: CreateProductInput) {
  const errors = validateProduct(product)
  if (errors.length > 0) {
    throw new Error(\`Validation failed: \${errors.join(', ')}\`)
  }

  // ... rest of the function
}
\`\`\``,
    },
  ];

  for (const demo of demoResponses) {
    if (demo.trigger.some((trigger) => lowerMessage.includes(trigger))) {
      return demo.response;
    }
  }

  return `I'm your AI coding assistant! I can help you with:

• Writing and optimizing database queries
• Adding search and filter functionality
• Error handling and validation
• TypeScript types and interfaces
• Performance optimization
• Testing strategies

Try asking me something about the product catalog code!`;
}
