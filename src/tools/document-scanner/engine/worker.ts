// Web Worker entry. All logic lives in handler.ts.

import { createHandler } from './handler.ts';
import type { Request } from './handler.ts';

const handle = createHandler();
const scope = self as unknown as { postMessage(message: unknown, transfer: Transferable[]): void; onmessage: ((e: MessageEvent<Request>) => void) | null };

scope.onmessage = (e) => {
  const { response, transfer } = handle(e.data);
  scope.postMessage(response, transfer);
};
