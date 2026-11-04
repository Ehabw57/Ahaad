// Promise API over the worker. Falls back to running the same handler on the
// main thread when Web Workers are unavailable or fail to start.

import type { AnalyzeResult } from '../core/pipeline.ts';
import type { Corners, FilterId, Raster, Rotation } from '../types.ts';
import { createHandler } from './handler.ts';
import type { Request, Response, Result } from './handler.ts';

export type ScannerClient = {
  register(pageId: string, raster: Raster): Promise<void>;
  unregister(pageId: string): void;
  analyze(pageId: string): Promise<AnalyzeResult>;
  render(pageId: string, corners: Corners, rotation: Rotation, filter: FilterId, maxSide: number): Promise<Raster>;
  variants(pageId: string, corners: Corners, rotation: Rotation, side: number): Promise<Record<FilterId, Raster>>;
  /** Takes ownership of `raster`'s buffer (it is transferred, not copied). */
  exportRender(raster: Raster, corners: Corners, rotation: Rotation, filter: FilterId, maxSide: number): Promise<Raster>;
  dispose(): void;
};

type Draft<T> = T extends unknown ? Omit<T, 'id'> : never;
type Pending = { resolve: (r: Result) => void; reject: (e: Error) => void; req: Request; transferred: boolean };

/** Safe to call during server rendering: nothing touches `Worker` until the first request. */
export function createScannerClient(): ScannerClient {
  let worker: Worker | null = null;
  let local: ReturnType<typeof createHandler> | null = null;
  let nextId = 1;
  const pending = new Map<number, Pending>();
  const registered = new Map<string, Raster>();

  function settle(res: Response): void {
    const p = pending.get(res.id);
    if (!p) return;
    pending.delete(res.id);
    if (res.ok) p.resolve(res.result);
    else p.reject(new Error(res.error));
  }

  function runLocal(req: Request): void {
    setTimeout(() => settle(local!(req).response), 0);
  }

  function useLocal(): void {
    worker?.terminate();
    worker = null;
    local = createHandler();
    for (const [pageId, raster] of registered) local({ id: 0, type: 'register', pageId, raster });
    for (const [id, p] of [...pending]) {
      if (p.transferred) {
        pending.delete(id);
        p.reject(new Error('worker failed'));
      } else {
        runLocal(p.req);
      }
    }
  }

  function ensure(): void {
    if (worker || local) return;
    if (typeof Worker !== 'undefined') {
      try {
        const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
        w.onmessage = (e: MessageEvent<Response>) => settle(e.data);
        w.onerror = useLocal;
        w.onmessageerror = useLocal;
        worker = w;
        return;
      } catch {
        // fall through to the main thread
      }
    }
    local = createHandler();
  }

  function send<T extends Result>(draft: Draft<Request>, transfer: Transferable[] = []): Promise<T> {
    ensure();
    const req = { ...draft, id: nextId++ } as Request;
    return new Promise<T>((resolve, reject) => {
      pending.set(req.id, { resolve: resolve as (r: Result) => void, reject, req, transferred: transfer.length > 0 });
      if (worker) worker.postMessage(req, transfer);
      else runLocal(req);
    });
  }

  return {
    async register(pageId, raster) {
      registered.set(pageId, raster);
      await send({ type: 'register', pageId, raster });
    },
    unregister(pageId) {
      registered.delete(pageId);
      send({ type: 'unregister', pageId }).catch(() => {});
    },
    analyze: (pageId) => send<AnalyzeResult>({ type: 'analyze', pageId }),
    render: (pageId, corners, rotation, filter, maxSide) =>
      send<Raster>({ type: 'render', pageId, corners, rotation, filter, maxSide }),
    variants: (pageId, corners, rotation, side) =>
      send<Record<FilterId, Raster>>({ type: 'variants', pageId, corners, rotation, side }),
    exportRender: (raster, corners, rotation, filter, maxSide) =>
      send<Raster>({ type: 'export', raster, corners, rotation, filter, maxSide }, [raster.data.buffer as ArrayBuffer]),
    dispose() {
      worker?.terminate();
      worker = null;
      local = null;
      for (const p of pending.values()) p.reject(new Error('disposed'));
      pending.clear();
      registered.clear();
    },
  };
}
