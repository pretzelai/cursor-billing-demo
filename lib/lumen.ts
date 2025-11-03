/**
 * Lumen SDK Integration
 * Using @getlumen/server for backend feature gates and usage tracking
 */

import { isFeatureEntitled as lumenIsFeatureEntitled, sendEvent as lumenSendEvent } from '@getlumen/server'

/**
 * Check if user has access to a specific feature
 * This calls Lumen's API to verify entitlement based on the user's plan
 */
export async function isFeatureEntitled(userId: string, feature: string): Promise<boolean> {
  try {
    const entitled = await lumenIsFeatureEntitled({
      feature,
      userId
    })

    console.log(`[Lumen] Feature entitlement check - userId: ${userId}, feature: ${feature}, entitled: ${entitled}`)
    return entitled
  } catch (error) {
    console.error('[Lumen] Error checking feature entitlement:', error)
    // Fail open for demo - in production, you might want to fail closed
    return false
  }
}

/**
 * Track usage event for metered features
 * This records consumption so Lumen can track usage and enforce limits
 */
export async function sendEvent(userId: string, eventName: string): Promise<void> {
  try {
    await lumenSendEvent({
      name: eventName,
      userId
    })

    console.log(`[Lumen] Event tracked - userId: ${userId}, event: ${eventName}`)
  } catch (error) {
    console.error('[Lumen] Error sending event:', error)
    // Don't throw - we don't want to block the user if tracking fails
  }
}
