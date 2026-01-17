/**
 * A simple in-memory store for trusted origins.
 * In a production environment, this would use chrome.storage.local for persistence.
 */
const TRUSTED_SITES = new Set<string>([
  // Pre-approve the local development server for a smoother DX.
  "http://localhost:3000"
]);

export const trustStore = {
  /**
   * Checks if a given origin is in the trusted set.
   * Checklist Item: 3.2
   */
  isTrusted: (origin: string): boolean => {
    return TRUSTED_SITES.has(origin);
  },

  // In a real implementation, methods for adding/removing/updating permissions would go here.
};