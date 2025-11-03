import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { lumen } from '@/lib/lumen'

/**
 * API Route: Tab Completion
 *
 * This endpoint handles AI-powered tab completions
 * Gated by:
 * 1. User authentication
 * 2. Lumen feature entitlement check
 * 3. Lumen usage limits
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check if user is authenticated
    const user = await requireAuth()

    // 2. Check if user has access to AI completions feature
    const hasAccess = await lumen.isFeatureEntitled(user.id, 'ai_completions')

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'feature_not_available',
          message: 'Upgrade to Pro to access AI completions',
          upgradeUrl: 'https://getlumen.dev/pricing'
        },
        { status: 402 } // Payment Required
      )
    }

    // 3. Check usage limits
    const usage = await lumen.getUsage(user.id)

    if (usage.ai_completions >= usage.ai_completions_limit) {
      return NextResponse.json(
        {
          error: 'usage_limit_reached',
          message: `You've reached your limit of ${usage.ai_completions_limit} completions this month`,
          current: usage.ai_completions,
          limit: usage.ai_completions_limit,
          upgradeUrl: 'https://getlumen.dev/pricing'
        },
        { status: 429 } // Too Many Requests
      )
    }

    // 4. Track the usage event
    await lumen.sendEvent({
      userId: user.id,
      eventName: 'ai_completion',
      value: 1,
      timestamp: new Date().toISOString()
    })

    // 5. Get request body (context for completion)
    const body = await request.json()
    const { code, cursorPosition } = body

    // 6. Generate completion (in real app, this would call OpenAI/Anthropic)
    const completion = generateCompletion(code, cursorPosition)

    return NextResponse.json({
      success: true,
      completion,
      usage: {
        current: usage.ai_completions + 1,
        limit: usage.ai_completions_limit,
        remaining: usage.ai_completions_limit - usage.ai_completions - 1
      }
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
