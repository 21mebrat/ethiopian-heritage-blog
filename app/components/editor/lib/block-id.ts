export function createBlockId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
