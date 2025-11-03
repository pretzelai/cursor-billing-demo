import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { isFeatureEntitled, sendEvent } from '@/lib/lumen'

/**
 * API Route: Tab Completion
 *
 * This endpoint handles AI-powered tab completions
 * Gated by Lumen:
 * 1. User authentication
 * 2. Feature entitlement check (includes plan access + usage limits)
 * 3. Usage tracking after consumption
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check if user is authenticated
    const user = await requireAuth()

    // 2. Check if user has access to AI completions feature
    // This checks both plan access AND usage limits (credits remaining)
    const hasAccess = await isFeatureEntitled(user.id, 'ai-completions')

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'feature_not_available',
          message: 'Upgrade to access AI completions or you have reached your usage limit',
          upgradeUrl: 'https://getlumen.dev/pricing'
        },
        { status: 402 } // Payment Required
      )
    }

    // 3. Get request body (context for completion)
    const body = await request.json()
    const { code, cursorPosition } = body

    // 4. Generate completion (in real app, this would call OpenAI/Anthropic)
    const completion = generateCompletion(code, cursorPosition)

    // 5. Track the usage event AFTER successful completion
    // Lumen will record this consumption for billing and quota tracking
    await sendEvent(user.id, 'ai-completions')

    return NextResponse.json({
      success: true,
      completion
    })

  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Please log in' },
        { status: 401 }
      )
    }

    console.error('[API] Completion error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'Something went wrong' },
      { status: 500 }
    )
  }
}

/**
 * Mock completion generator
 * In a real app, this would call an AI model
 */
function generateCompletion(code: string, cursorPosition: any): string {
  // For demo, return a static completion
  return `  const products = await getProductsByCategory('electronics')
  console.log('Found products:', products.length)`
}
