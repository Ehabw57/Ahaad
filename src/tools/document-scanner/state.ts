// Pure reducer for the scanner. No DOM, no async; the hook feeds it results.

import { DEFAULT_FILTER, FRAME_MARGIN } from './config.ts';
import { clampDrag, fullFrame } from './core/geometry.ts';
import type { Corners, Detection, FilterId, Point, Raster, Rotation, ScanPage, ScannerState } from './types.ts';

export const initialState: ScannerState = { pages: [], activeId: null, mode: 'view', draft: null };

export type Action =
  | { type: 'add'; pages: ScanPage[] }
  | { type: 'ready'; id: string; proxy: Raster; corners: Corners; detection: Detection }
  | { type: 'drop'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'select'; id: string }
  | { type: 'rotate'; dir: 1 | -1 }
  | { type: 'setFilter'; filter: FilterId }
  | { type: 'applyFilterAll' }
  | { type: 'setThumb'; id: string; thumb: Raster }
  | { type: 'dismissHint'; id: string }
  | { type: 'startCrop' }
  | { type: 'moveCorner'; index: number; point: Point }
  | { type: 'setDraft'; corners: Corners }
  | { type: 'confirmCrop' }
  | { type: 'cancelCrop' };

export function createPage(id: string, file: File): ScanPage {
  return {
    id,
    file,
    proxy: null,
    corners: fullFrame(FRAME_MARGIN),
    detection: { found: false, quality: 0 },
    manual: false,
    hintDismissed: false,
    rotation: 0,
    filter: DEFAULT_FILTER,
    thumb: null,
    status: 'processing',
  };
}

const patch = (s: ScannerState, id: string, p: Partial<ScanPage>): ScannerState => ({
  ...s,
  pages: s.pages.map((pg) => (pg.id === id ? { ...pg, ...p } : pg)),
});

export const activePage = (s: ScannerState): ScanPage | null => s.pages.find((p) => p.id === s.activeId) ?? null;

/** Bring a page's rotation to the next quarter turn. */
const turn = (r: Rotation, dir: 1 | -1): Rotation => (((r + dir * 90) % 360) + 360) % 360 as Rotation;

export function reducer(s: ScannerState, a: Action): ScannerState {
  const crop = s.mode === 'crop';
  const active = activePage(s);

  switch (a.type) {
    case 'add':
      return { ...s, pages: [...s.pages, ...a.pages], activeId: s.activeId ?? a.pages[0]?.id ?? null };

    case 'ready':
      return patch(s, a.id, { proxy: a.proxy, corners: a.corners, detection: a.detection, status: 'ready' });

    case 'drop':
    case 'remove': {
      if (a.type === 'remove' && crop) return s;
      const i = s.pages.findIndex((p) => p.id === a.id);
      if (i < 0) return s;
      const pages = s.pages.filter((p) => p.id !== a.id);
      let activeId = s.activeId;
      if (s.activeId === a.id) activeId = (pages[i] ?? pages[i - 1])?.id ?? null;
      const wasActiveInCrop = crop && s.activeId === a.id;
      return { ...s, pages, activeId, mode: wasActiveInCrop ? 'view' : s.mode, draft: wasActiveInCrop ? null : s.draft };
    }

    case 'select':
      return crop || !s.pages.some((p) => p.id === a.id) ? s : { ...s, activeId: a.id };

    case 'rotate':
      return !active || crop ? s : patch(s, active.id, { rotation: turn(active.rotation, a.dir) });

    case 'setFilter':
      return !active || crop ? s : patch(s, active.id, { filter: a.filter });

    case 'applyFilterAll':
      return !active || crop ? s : { ...s, pages: s.pages.map((p) => ({ ...p, filter: active.filter })) };

    case 'setThumb':
      return patch(s, a.id, { thumb: a.thumb });

    case 'dismissHint':
      return patch(s, a.id, { hintDismissed: true });

    case 'startCrop':
      if (!active || crop || active.status !== 'ready') return s;
      return { ...patch(s, active.id, { hintDismissed: true }), mode: 'crop', draft: active.corners };

    case 'moveCorner':
      return crop && s.draft ? { ...s, draft: clampDrag(s.draft, a.index, a.point) } : s;

    case 'setDraft':
      return crop ? { ...s, draft: a.corners } : s;

    case 'confirmCrop':
      if (!crop || !s.draft || !active) return s;
      return { ...patch(s, active.id, { corners: s.draft, manual: true }), mode: 'view', draft: null };

    case 'cancelCrop':
      return crop ? { ...s, mode: 'view', draft: null } : s;
  }
}

/** The crop button hint: detection was unsure and the user has not looked yet. */
export const showCropHint = (page: ScanPage | null, hintThreshold: number): boolean =>
  !!page && page.status === 'ready' && !page.manual && !page.hintDismissed && page.detection.quality < hintThreshold;
