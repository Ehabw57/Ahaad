// Request handler shared by the Web Worker and the main-thread fallback.
// Pure compute over RGBA buffers: no DOM, so it also runs under Node in tests.

import type { Corners, FilterId, Raster, Rotation } from '../types.ts';
import { analyze, renderPage, renderVariants } from '../core/pipeline.ts';
import type { AnalyzeResult } from '../core/pipeline.ts';

export type Request =
  | { id: number; type: 'register'; pageId: string; raster: Raster }
  | { id: number; type: 'unregister'; pageId: string }
  | { id: number; type: 'analyze'; pageId: string }
  | { id: number; type: 'render'; pageId: string; corners: Corners; rotation: Rotation; filter: FilterId; maxSide: number }
  | { id: number; type: 'variants'; pageId: string; corners: Corners; rotation: Rotation; side: number }
  | { id: number; type: 'export'; raster: Raster; corners: Corners; rotation: Rotation; filter: FilterId; maxSide: number };

export type Result = null | AnalyzeResult | Raster | Record<FilterId, Raster>;

export type Response = { id: number; ok: true; result: Result } | { id: number; ok: false; error: string };

type Handled = { response: Response; transfer: ArrayBuffer[] };

const isRaster = (r: unknown): r is Raster => !!r && typeof r === 'object' && 'data' in r && 'width' in r;

function buffersOf(result: Result): ArrayBuffer[] {
  if (!result) return [];
  if (isRaster(result)) return [result.data.buffer as ArrayBuffer];
  if ('corners' in result) return [];
  return Object.values(result).map((r) => r.data.buffer as ArrayBuffer);
}

export function createHandler(): (req: Request) => Handled {
  const proxies = new Map<string, Raster>();

  const need = (pageId: string): Raster => {
    const p = proxies.get(pageId);
    if (!p) throw new Error(`unknown page ${pageId}`);
    return p;
  };

  return (req) => {
    try {
      let result: Result = null;
      switch (req.type) {
        case 'register':
          proxies.set(req.pageId, req.raster);
          break;
        case 'unregister':
          proxies.delete(req.pageId);
          break;
        case 'analyze':
          result = analyze(need(req.pageId));
          break;
        case 'render':
          result = renderPage(need(req.pageId), req.corners, req.rotation, req.filter, req.maxSide);
          break;
        case 'variants':
          result = renderVariants(need(req.pageId), req.corners, req.rotation, req.side);
          break;
        case 'export':
          result = renderPage(req.raster, req.corners, req.rotation, req.filter, req.maxSide);
          break;
      }
      return { response: { id: req.id, ok: true, result }, transfer: buffersOf(result) };
    } catch (e) {
      return { response: { id: req.id, ok: false, error: e instanceof Error ? e.message : String(e) }, transfer: [] };
    }
  };
}
