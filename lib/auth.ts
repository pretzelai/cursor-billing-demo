import { cookies } from 'next/headers'

export interface User {
  id: string
  email: string
  name: string
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const mockUserId = cookieStore.get('mock_user_id')?.value

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

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
