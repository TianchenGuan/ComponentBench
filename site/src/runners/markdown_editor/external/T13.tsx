'use client';

/**
 * markdown_editor-external-T13: Insert a markdown link in a dashboard card
 *
 * Layout: dashboard — a two-column page with multiple cards (clutter medium).
 * Non-target cards (distractors):
 *   - "Traffic" chart placeholder
 *   - "Recent activity" list
 *   - "Status" KPI tiles
 * Target component: one Markdown editor in a card titled "Announcement".
 * Configuration:
 *   - Standard toolbar visible; live preview below the editor.
 *   - Editor is large enough that all text is visible without scrolling.
 * Initial state: editor contains a short placeholder line ("Write an announcement…"), but the value is empty.
 * Feedback: preview renders links as clickable styled text; no Save button.
 *
 * Success: Editor markdown value equals:
 *   Read the [documentation](https://example.com/docs) for details.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const TARGET_TEXT = 'Read the [documentation](https://example.com/docs) for details.';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('');
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: 900 }}>
      {/* Left column: Distractors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Traffic card */}
        <div
          style={{
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Traffic</h4>
          <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Chart placeholder
          </div>
        </div>

        {/* Recent activity */}
        <div
          style={{
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Recent activity</h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#666' }}>
            <li>User signed up</li>
            <li>Order completed</li>
            <li>Comment added</li>
          </ul>
        </div>

        {/* Status KPIs */}
        <div
          style={{
            padding: 16,
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            display: 'flex',
            gap: 16,
          }}
        >
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>1,234</div>
            <div style={{ fontSize: 12, color: '#999' }}>Users</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>567</div>
            <div style={{ fontSize: 12, color: '#999' }}>Orders</div>
          </div>
        </div>
      </div>

      {/* Right column: Announcement editor (TARGET) */}
      <div
        style={{
          padding: 16,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
        data-testid="md-editor-announcement"
      >
        <h4 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#666' }}>Announcement</h4>
        <MDEditor
          value={value}
          onChange={(val) => setValue(val || '')}
          preview="live"
          height={200}
          textareaProps={{ placeholder: 'Write an announcement…' }}
          data-color-mode="light"
        />
      </div>
    </div>
  );
}
