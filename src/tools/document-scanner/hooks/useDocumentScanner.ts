// Orchestration: file intake, worker jobs, thumbnails, crop actions, export.
// All decisions live in state.ts (reducer) and core/ (pixels); this hook only wires them to async work.

import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import { MAX_FILE_BYTES, MAX_PAGES, PROXY_SIDE, QUALITY, THUMB_SIDE } from '../config.ts';
import { decodeToRaster } from '../engine/decode.ts';
import { downloadBlob, exportAll, exportOne } from '../engine/exportPages.ts';
import { createScannerClient } from '../engine/workerClient.ts';
import type { ScannerClient } from '../engine/workerClient.ts';
import { failedFilesMessage, pageLimitMessage, t } from '../messages.ts';
import { activePage, createPage, initialState, reducer, showCropHint } from '../state.ts';
import type { Corners, FilterId, Point, ScanPage } from '../types.ts';
import { useActiveRender } from './useActiveRender.ts';

const thumbKey = (p: ScanPage): string =>
  `${p.corners.map((c) => `${c.x.toFixed(4)},${c.y.toFixed(4)}`).join('|')}/${p.rotation}/${p.filter}`;

const looksLikeImage = (f: File): boolean => f.type === '' || f.type.startsWith('image/');

export function useDocumentScanner() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [tick, setTick] = useState(0);

  const clientRef = useRef<ScannerClient | null>(null);
  if (!clientRef.current) clientRef.current = createScannerClient();
  const client = clientRef.current;

  const stateRef = useRef(state);
  stateRef.current = state;
  const alive = useRef(new Set<string>());
  const nextId = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const thumbDone = useRef(new Map<string, string>());
  const thumbBusy = useRef(new Map<string, string>());

  useEffect(() => () => clientRef.current?.dispose(), []);

  const active = activePage(state);
  const { preview, tiles } = useActiveRender(client, active, state.mode);

  // ---- intake -------------------------------------------------------------

  async function processPage(page: ScanPage): Promise<boolean> {
    try {
      const proxy = await decodeToRaster(page.file, PROXY_SIDE);
      if (!alive.current.has(page.id)) return true;
      await client.register(page.id, proxy);
      if (!alive.current.has(page.id)) {
        client.unregister(page.id);
        return true;
      }
      // Best effort: analyze never rejects for a bad scene, it falls back to the full frame.
      const { corners, detection } = await client.analyze(page.id);
      if (!alive.current.has(page.id)) {
        client.unregister(page.id);
        return true;
      }
      dispatch({ type: 'ready', id: page.id, proxy, corners, detection });
      return true;
    } catch {
      alive.current.delete(page.id);
      client.unregister(page.id);
      dispatch({ type: 'drop', id: page.id });
      return false;
    }
  }

  function addFiles(files: File[]): void {
    const room = MAX_PAGES - stateRef.current.pages.length;
    const accepted: File[] = [];
    let rejected = 0;
    let overLimit = false;
    for (const f of files) {
      if (!looksLikeImage(f) || f.size > MAX_FILE_BYTES) rejected++;
      else if (accepted.length >= room) overLimit = true;
      else accepted.push(f);
    }

    const pages = accepted.map((f) => createPage(`page-${nextId.current++}`, f));
    for (const p of pages) alive.current.add(p.id);
    if (pages.length) dispatch({ type: 'add', pages });

    const report = (failed: number) => {
      const parts: string[] = [];
      if (failed > 0) parts.push(failedFilesMessage(failed));
      if (overLimit) parts.push(pageLimitMessage(MAX_PAGES));
      setNotice(parts.length ? parts.join('. ') : null);
    };
    if (!pages.length) {
      report(rejected);
      return;
    }
    // One file at a time keeps memory flat; batches from separate drops queue up.
    queue.current = queue.current.then(async () => {
      let failed = rejected;
      for (const p of pages) if (!(await processPage(p))) failed++;
      report(failed);
    });
  }

  function remove(id: string): void {
    if (stateRef.current.mode === 'crop') return;
    alive.current.delete(id);
    thumbDone.current.delete(id);
    thumbBusy.current.delete(id);
    client.unregister(id);
    dispatch({ type: 'remove', id });
  }

  // ---- thumbnails: re-render whenever a page's corners, rotation or filter change ----

  useEffect(() => {
    for (const p of state.pages) {
      if (p.status !== 'ready') continue;
      const key = thumbKey(p);
      if (thumbDone.current.get(p.id) === key || thumbBusy.current.get(p.id) === key) continue;
      thumbBusy.current.set(p.id, key);
      client
        .render(p.id, p.corners, p.rotation, p.filter, THUMB_SIDE)
        .then((thumb) => {
          if (thumbBusy.current.get(p.id) === key) thumbBusy.current.delete(p.id);
          const latest = stateRef.current.pages.find((x) => x.id === p.id);
          if (!latest || !alive.current.has(p.id)) return;
          if (thumbKey(latest) === key) {
            thumbDone.current.set(p.id, key);
            dispatch({ type: 'setThumb', id: p.id, thumb });
          } else {
            setTick((n) => n + 1); // changed while rendering; go again
          }
        })
        .catch(() => {
          if (thumbBusy.current.get(p.id) === key) thumbBusy.current.delete(p.id);
        });
    }
  }, [client, state.pages, tick]);

  // ---- crop ---------------------------------------------------------------

  async function redetect(): Promise<void> {
    const page = activePage(stateRef.current);
    if (!page || stateRef.current.mode !== 'crop' || detecting) return;
    setDetecting(true);
    try {
      const { corners } = await client.analyze(page.id);
      dispatch({ type: 'setDraft', corners });
    } catch {
      // keep the current draft; the user can still drag
    } finally {
      setDetecting(false);
    }
  }

  // ---- export -------------------------------------------------------------

  async function download(all: boolean): Promise<void> {
    const { pages } = stateRef.current;
    const page = activePage(stateRef.current);
    if (busy || !page) return;
    setBusy(true);
    try {
      const file = all
        ? await exportAll(client, pages.filter((p) => p.status === 'ready'))
        : await exportOne(client, page, pages.indexOf(page));
      downloadBlob(file);
    } catch {
      setNotice(t.exportFailed);
    } finally {
      setBusy(false);
    }
  }

  const allReady = state.pages.length > 0 && state.pages.every((p) => p.status === 'ready');

  return {
    state,
    active,
    preview,
    tiles,
    notice,
    busy,
    detecting,
    hint: showCropHint(active, QUALITY.hint),
    canExport: !!active && active.status === 'ready' && state.mode === 'view' && !busy,
    canExportAll: allReady && state.mode === 'view' && !busy && state.pages.length > 1,
    actions: {
      addFiles,
      remove,
      select: (id: string) => dispatch({ type: 'select', id }),
      rotate: (dir: 1 | -1) => dispatch({ type: 'rotate', dir }),
      setFilter: (filter: FilterId) => dispatch({ type: 'setFilter', filter }),
      applyFilterAll: () => dispatch({ type: 'applyFilterAll' }),
      startCrop: () => dispatch({ type: 'startCrop' }),
      moveCorner: (index: number, point: Point) => dispatch({ type: 'moveCorner', index, point }),
      setDraft: (corners: Corners) => dispatch({ type: 'setDraft', corners }),
      confirmCrop: () => dispatch({ type: 'confirmCrop' }),
      cancelCrop: () => dispatch({ type: 'cancelCrop' }),
      dismissHint: () => active && dispatch({ type: 'dismissHint', id: active.id }),
      redetect,
      downloadCurrent: () => download(false),
      downloadAll: () => download(true),
      dismissNotice: () => setNotice(null),
    },
  };
}
