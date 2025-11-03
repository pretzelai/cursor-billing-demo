'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const demoResponses = [
  {
    trigger: ['billing', 'subscription', 'payment'],
    response: `Here's how to implement subscription checking with Lumen:

\`\`\`typescript
async function checkSubscription(userId: string) {
  const subscription = await lumen.getSubscriptionStatus(userId)

  if (!subscription.active) {
    return { error: 'No active subscription' }
  }

  return subscription
}
\`\`\`

This checks if a user has an active subscription. You can use this middleware to protect premium features.`,
  },
  {
    trigger: ['usage', 'track', 'event'],
    response: `To track usage events with Lumen, use the sendEvent method:

\`\`\`typescript
await lumen.sendEvent({
  userId: 'user_123',
  eventName: 'api_call',
  value: 1,
  timestamp: new Date().toISOString(),
})
\`\`\`

This is perfect for metered billing. Lumen will automatically aggregate these events and calculate charges based on your pricing model.`,
  },
  {
    trigger: ['feature', 'entitlement', 'access'],
    response: `Check feature entitlements using:

\`\`\`typescript
const hasAccess = await lumen.isFeatureEntitled(
  userId,
  'advanced_analytics'
)

if (!hasAccess) {
  throw new Error('Upgrade to access this feature')
}
\`\`\`

You can also get all features at once:
\`\`\`typescript
const features = await lumen.getFeatures(userId)
\`\`\``,
  },
  {
    trigger: ['customer', 'user', 'data'],
    response: `Fetch comprehensive customer data:

\`\`\`typescript
const customerData = await lumen.getCustomerOverview(userId)

// Returns: {
//   userId: string
//   email: string
//   subscription: { plan: string, status: string }
//   usage: { current: number, limit: number }
//   features: string[]
// }
\`\`\`

This gives you everything you need for a customer dashboard.`,
  },
  {
    trigger: ['enroll', 'signup', 'new user'],
    response: `Enroll new users when they sign up:

\`\`\`typescript
await lumen.enrollUser({
  email: user.email,
  userId: user.id,
  metadata: {
    source: 'web_signup',
    plan: 'free'
  }
})
\`\`\`

Lumen will automatically start tracking their usage and managing their subscription lifecycle.`,
  },
]

function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  for (const demo of demoResponses) {
    if (demo.trigger.some((trigger) => lowerMessage.includes(trigger))) {
      return demo.response
    }
  }

  return `I can help you with Lumen billing integration! Try asking about:

• Subscription checking
• Usage tracking and metered billing
• Feature entitlements
• Customer data management
• User enrollment

Lumen makes it easy to implement complex pricing models without the hassle of building billing infrastructure from scratch.`
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your Lumen billing assistant. Ask me anything about implementing billing with Lumen.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(input)
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-color">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-sm font-semibold">Lumen AI Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2d2d30] text-gray-100'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#2d2d30] rounded-lg p-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border-color">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Lumen billing..."
            className="flex-1 bg-[#2d2d30] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Press Enter to send, Tab for code completion
        </div>
      </div>
    </div>
  )
}
