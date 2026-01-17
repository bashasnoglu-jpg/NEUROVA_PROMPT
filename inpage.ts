import { InpageMessageSchema } from '@neurova/shared-types';

// This code would be injected into the DApp's context.

function send(method: string, params?: any) {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();

    window.addEventListener('message', function handler(event) {
      if (event.data?.target === "NEUROVA::DAPP" && event.data?.payload?.id === id) {
        window.removeEventListener('message', handler);
        if (event.data.payload.error) {
          reject(new Error(event.data.payload.error));
        } else {
          resolve(event.data.payload.result);
        }
      }
    });

    window.postMessage({
      target: "NEUROVA::INPAGE",
      payload: { id, method, params }
    }, window.origin);
  });
}

// window.neurova = { connect: () => send('connect'), ... }