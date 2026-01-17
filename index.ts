import { InpageMessageSchema } from '@neurova/shared-types';
import { trustStore } from '@neurova/security';

// This is the core logic in the service worker.

chrome.runtime.onMessage.addListener((rawMessage, sender, sendResponse) => {
  // Checklist Item 3.1: Origin Binding - Ensure the sender has an origin.
  const origin = sender.origin;
  if (!origin) {
    // This should not happen for messages from web pages.
    // We reject the request immediately.
    sendResponse({ id: rawMessage?.payload?.id, error: "Security Error: Sender has no origin." });
    return false; // Do not keep the channel open.
  }

  // Checklist Item 3.1: Schema Validation - Ensure the message structure is correct.
  const validation = InpageMessageSchema.safeParse(rawMessage);
  if (!validation.success) {
    sendResponse({ id: rawMessage?.payload?.id, error: `Security Error: Invalid message schema. ${validation.error.message}` });
    return false;
  }
  const { id, method, params } = validation.data.payload;

  // Checklist Item 3.2: Trust Store - Check if the origin is trusted.
  if (!trustStore.isTrusted(origin)) {
    // In a real implementation, this would trigger a popup to ask the user for connection permission.
    // For this starter repo, we simply reject requests from untrusted origins.
    sendResponse({ id, error: `Security Error: Origin '${origin}' is not trusted.` });
    return false;
  }

  console.log(`[Background] Received trusted call for method '${method}' from ${origin}`);

  // --- ROUTING TO CORE LOGIC (Placeholder) ---
  // Here, you would route the request to the appropriate handler in @neurova/wallet-core
  // e.g., const result = await walletCore.handle(method, params);
  // This would involve showing popups for signing, etc.

  // For the starter repo, we'll just acknowledge the successful validation.
  const result = `Successfully processed method '${method}' for origin '${origin}'.`;

  sendResponse({ id, result });
  return true; // Indicates async response
});