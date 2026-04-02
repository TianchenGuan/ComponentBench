'use client';

/**
 * T09: Internal note live-mode append with sibling mode preserved
 *
 * Settings panel with two side-by-side editors: "Public note" and "Internal note".
 * Each has Edit / Live / Preview mode toggles. Both start in Edit mode.
 * Task: Switch "Internal note" to Live mode, append `- [ ] Notify QA`.
 * Keep "Public note" in Edit mode and its content unchanged.
 * Success: Internal note matches target in Live mode, Public note unchanged + Edit, "Save notes" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps, EditorMode } from '../../types';
import { markdownMatches } from '../../types';

const INIT_PUBLIC = 'Public rollout note.';
const INIT_INTERNAL = `## Internal
- [ ] Update docs`;

const TARGET_INTERNAL = `## Internal
- [ ] Update docs
- [ ] Notify QA`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [publicNote, setPublicNote] = useState(INIT_PUBLIC);
  const [publicMode, setPublicMode] = useState<EditorMode>('edit');
  const [internalNote, setInternalNote] = useState(INIT_INTERNAL);
  const [internalMode, setInternalMode] = useState<EditorMode>('edit');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      internalMode === 'live' &&
      publicMode === 'edit' &&
      markdownMatches(internalNote, TARGET_INTERNAL) &&
      markdownMatches(publicNote, INIT_PUBLIC)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, internalMode, publicMode, internalNote, publicNote, onSuccess]);

  const renderModeToggle = (current: EditorMode, setCurrent: (m: EditorMode) => void) => (
    <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
      {(['edit', 'live', 'preview'] as EditorMode[]).map((m) => (
        <button
          key={m}
          onClick={() => { setSaved(false); setCurrent(m); }}
          style={{
            padding: '3px 10px',
            background: current === m ? '#1677ff' : '#f0f0f0',
            color: current === m ? '#fff' : '#666',
            border: current === m ? '1px solid #1677ff' : '1px solid #d9d9d9',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            textTransform: 'capitalize',
          }}
          aria-pressed={current === m}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  );

  const toPreviewProp = (m: EditorMode) =>
    m === 'edit' ? 'edit' : m === 'preview' ? 'preview' : 'live';

  return (
    <div style={{ width: 800, padding: 20, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Notes settings</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <span style={{ padding: '4px 10px', background: '#f0f5ff', borderRadius: 12, fontSize: 12, color: '#1677ff' }}>2 active</span>
        <span style={{ padding: '4px 10px', background: '#fff7e6', borderRadius: 12, fontSize: 12, color: '#fa8c16' }}>1 draft</span>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Public note</div>
          {renderModeToggle(publicMode, setPublicMode)}
          <MDEditor
            value={publicNote}
            onChange={(val) => { setSaved(false); setPublicNote(val || ''); }}
            preview={toPreviewProp(publicMode)}
            height={160}
            data-color-mode="light"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Internal note</div>
          {renderModeToggle(internalMode, setInternalMode)}
          <MDEditor
            value={internalNote}
            onChange={(val) => { setSaved(false); setInternalNote(val || ''); }}
            preview={toPreviewProp(internalMode)}
            height={160}
            data-color-mode="light"
          />
        </div>
      </div>

      <button
        onClick={() => setSaved(true)}
        style={{ marginTop: 16, padding: '8px 20px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
      >
        Save notes
      </button>
    </div>
  );
}
