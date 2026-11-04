import { useEffect } from 'preact/hooks';
import StatusMessage from '../../components/ui/StatusMessage.tsx';
import CropActions from './components/CropActions.tsx';
import EditToolbar from './components/EditToolbar.tsx';
import FilterBar from './components/FilterBar.tsx';
import PagesPanel from './components/PagesPanel.tsx';
import PreviewStage from './components/PreviewStage.tsx';
import ScannerDropzone from './components/ScannerDropzone.tsx';
import { useDocumentScanner } from './hooks/useDocumentScanner.ts';
import { t } from './messages.ts';

export default function DocumentScanner() {
  const s = useDocumentScanner();
  const { state, active, actions } = s;
  const cropping = state.mode === 'crop';
  const index = active ? state.pages.indexOf(active) : 0;

  useEffect(() => {
    if (!cropping) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && actions.cancelCrop();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cropping]);

  return (
    <div class="flex flex-col gap-4">
      {s.notice && (
        <StatusMessage tone="error" onDismiss={actions.dismissNotice} dismissLabel={t.dismiss}>
          {s.notice}
        </StatusMessage>
      )}

      {state.pages.length === 0 ? (
        <ScannerDropzone onFiles={actions.addFiles} />
      ) : (
        <div class="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
          <div class="order-2 min-h-0 lg:order-1">
            <PagesPanel
              pages={state.pages}
              activeId={state.activeId}
              locked={cropping}
              busy={s.busy}
              canExport={s.canExport}
              canExportAll={s.canExportAll}
              onSelect={actions.select}
              onRemove={actions.remove}
              onAddFiles={actions.addFiles}
              onDownloadCurrent={actions.downloadCurrent}
              onDownloadAll={actions.downloadAll}
            />
          </div>

          <section class="order-1 flex min-w-0 flex-col gap-3 rounded-md border border-border bg-surface p-3 lg:order-2">
            <EditToolbar
              disabled={cropping || !active || active.status !== 'ready'}
              showHint={s.hint}
              onRotate={actions.rotate}
              onCrop={actions.startCrop}
              onDismissHint={actions.dismissHint}
            />
            <PreviewStage
              page={active}
              index={index}
              mode={state.mode}
              preview={s.preview}
              draft={state.draft}
              onMoveCorner={actions.moveCorner}
            />
            {cropping ? (
              <CropActions
                detecting={s.detecting}
                onConfirm={actions.confirmCrop}
                onRedetect={actions.redetect}
                onCancel={actions.cancelCrop}
              />
            ) : (
              <FilterBar
                tiles={s.tiles}
                value={active?.filter ?? 'auto'}
                canApplyAll={state.pages.length > 1}
                onSelect={actions.setFilter}
                onApplyAll={actions.applyFilterAll}
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
