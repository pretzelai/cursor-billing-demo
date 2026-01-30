// Simple event system for credit updates

const CREDIT_CONSUMED_EVENT = "credits-consumed";

export function emitCreditsConsumed() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CREDIT_CONSUMED_EVENT));
  }
}

export function onCreditsConsumed(callback: () => void): () => void {
  if (typeof window !== "undefined") {
    window.addEventListener(CREDIT_CONSUMED_EVENT, callback);
    return () => window.removeEventListener(CREDIT_CONSUMED_EVENT, callback);
  }
  return () => {};
}
