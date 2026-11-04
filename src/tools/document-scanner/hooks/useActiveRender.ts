// Renders for the active page only: the large preview and the four filter tiles.
// Results carry the page id and render key, so a stale or other-page result is never shown.

import { useEffect, useState } from 'preact/hooks';
import { PREVIEW_SIDE, TILE_SIDE } from '../config.ts';
import type { ScannerClient } from '../engine/workerClient.ts';
import type { Corners, FilterId, Mode, Raster, ScanPage } from '../types.ts';

const cornersKey = (c: Corners): string => c.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`).join('|');

export function useActiveRender(client: ScannerClient, page: ScanPage | null, mode: Mode) {
  const [preview, setPreview] = useState<{ id: string; raster: Raster } | null>(null);
  const [tiles, setTiles] = useState<{ id: string; map: Record<FilterId, Raster> } | null>(null);

  const ready = !!page && page.status === 'ready' && mode === 'view';
  const id = page?.id ?? '';
  const geometry = page ? `${cornersKey(page.corners)}/${page.rotation}` : '';
  const filter = page?.filter ?? 'auto';

  useEffect(() => {
    if (!ready || !page) return;
    let cancelled = false;
    client
      .render(page.id, page.corners, page.rotation, page.filter, PREVIEW_SIDE)
      .then((raster) => {
        if (!cancelled) setPreview({ id: page.id, raster });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [client, ready, id, geometry, filter]);

  // Tiles do not depend on the selected filter, so choosing one does not recompute them.
  useEffect(() => {
    if (!ready || !page) return;
    let cancelled = false;
    client
      .variants(page.id, page.corners, page.rotation, TILE_SIDE)
      .then((map) => {
        if (!cancelled) setTiles({ id: page.id, map });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [client, ready, id, geometry]);

  return {
    preview: preview && preview.id === id ? preview.raster : null,
    tiles: tiles && tiles.id === id ? tiles.map : null,
  };
}
