import { isFeatureEntitled as lumenIsFeatureEntitled, sendEvent as lumenSendEvent } from '@getlumen/server'

export async function isFeatureEntitled(userId: string, feature: string): Promise<boolean> {
  try {
    const entitled = await lumenIsFeatureEntitled({
      feature,
      userId
    })
    return entitled
  } catch (error) {
    console.error('[Lumen] Error checking feature entitlement:', error)
    return false
  }
}

export async function sendEvent(userId: string, eventName: string): Promise<void> {
  try {
    await lumenSendEvent({
      name: eventName,
      userId
    })
  } catch (error) {
    console.error('[Lumen] Error sending event:', error)
  }
}
