import { cookies } from 'next/headers'

/**
 * Mock authentication utility
 * In a real app, this would integrate with Clerk, Auth0, etc.
 */

export interface User {
  id: string
  email: string
  name: string
}

/**
 * Mock function to check if user is logged in
 * Returns user object if logged in, null otherwise
 */
export async function getCurrentUser(): Promise<User | null> {
  // In a real app, you'd check session/JWT token here
  // For demo purposes, we'll simulate a logged-in user

  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value

  // If no cookie, simulate a default logged-in user
  if (!mockUserId) {
    return {
      id: 'demo_user_123',
      email: 'demo@example.com',
      name: 'Demo User'
    }
  }

  return {
    id: mockUserId,
    email: `${mockUserId}@example.com`,
    name: 'Demo User'
  }
}

/**
 * Check if user is authenticated
 * Throws error if not authenticated (for API route protection)
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
