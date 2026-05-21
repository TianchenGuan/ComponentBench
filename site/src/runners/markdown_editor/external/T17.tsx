'use client';

/**
 * markdown_editor-external-T17: Preview mode on the correct instance
 *
 * Layout: settings_panel — a settings page with a left-side navigation list and right-side panel.
 * Clutter (low): a few toggles and dropdowns above the editors (not required).
 * Components (instances): two Markdown editors in the right panel:
 *   - "Public note" (shown first)
 *   - "Internal note" (shown second)  ← TARGET
 * Configuration:
 *   - Each editor has an identical mode toggle group (Edit / Live / Preview).
 *   - Both start in Edit mode.
 *   - Preview panels are hidden unless Live/Preview modes are enabled.
 * Initial state:
 *   - Public note contains: "Visible to all users."
 *   - Internal note contains: "Visible to staff only."
 * Feedback: switching modes immediately changes whether the textarea is editable for that instance.
 *
 * Success: Internal note editor mode equals 'preview' AND Public note remains in 'edit' mode.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps, EditorMode } from '../types';

export default function T17({ onSuccess }: TaskComponentProps) {
  const [publicNote, setPublicNote] = useState<string>('Visible to all users.');
  const [internalNote, setInternalNote] = useState<string>('Visible to staff only.');
  const [publicMode, setPublicMode] = useState<EditorMode>('edit');
  const [internalMode, setInternalMode] = useState<EditorMode>('edit');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    // Success: Internal note is preview, Public note remains edit
    if (internalMode === 'preview' && publicMode === 'edit') {
      successFired.current = true;
      onSuccess();
    }
  }, [publicMode, internalMode, onSuccess]);

  const renderModeToggle = (mode: EditorMode, setMode: (m: EditorMode) => void, testIdPrefix: string) => (
    <div style={{ marginBottom: 8, display: 'flex', gap: 4 }}>
      {(['edit', 'live', 'preview'] as EditorMode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            padding: '4px 12px',
            background: mode === m ? '#1677ff' : '#f5f5f5',
            color: mode === m ? '#fff' : '#333',
            border: mode === m ? '1px solid #1677ff' : '1px solid #d9d9d9',
            borderRadius: 3,
            cursor: 'pointer',
            fontSize: 12,
            textTransform: 'capitalize',
          }}
          aria-pressed={mode === m}
          data-testid={`${testIdPrefix}-mode-${m}`}
        >
          {m === 'live' ? 'Live' : m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 20, width: 800 }}>
      {/* Left: Settings nav (distractor) */}
      <div
        style={{
          width: 180,
          padding: 16,
          background: '#fafafa',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Settings</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 13 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>General</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee', color: '#1677ff' }}>Notes</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>Privacy</li>
          <li style={{ padding: '8px 0' }}>Advanced</li>
        </ul>
      </div>

      {/* Right: Editors panel */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            padding: 20,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Notes Settings</h3>

          {/* Distractor toggles */}
          <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" /> Enable notifications
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" /> Auto-save
            </label>
          </div>

          {/* Public note editor */}
          <div style={{ marginBottom: 20 }} data-testid="md-editor-public-note">
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Public note</h4>
            {renderModeToggle(publicMode, setPublicMode, 'public')}
            <MDEditor
              value={publicNote}
              onChange={(val) => setPublicNote(val || '')}
              preview={publicMode === 'edit' ? 'edit' : publicMode === 'preview' ? 'preview' : 'live'}
              height={120}
              data-color-mode="light"
            />
          </div>

          {/* Internal note editor (TARGET) */}
          <div data-testid="md-editor-internal-note">
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Internal note</h4>
            {renderModeToggle(internalMode, setInternalMode, 'internal')}
            <MDEditor
              value={internalNote}
              onChange={(val) => setInternalNote(val || '')}
              preview={internalMode === 'edit' ? 'edit' : internalMode === 'preview' ? 'preview' : 'live'}
              height={120}
              data-color-mode="light"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
