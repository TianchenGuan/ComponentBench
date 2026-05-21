'use client';

/**
 * T07: Public quote exact formatting with sibling preserved
 *
 * Dark settings panel with unrelated toggles/selects above and two editors:
 * "Public quote" (plain prose initially) and "Internal note" (must stay unchanged).
 * Target for Public quote: a multi-line blockquote with an italic attribution.
 * Success: Public quote matches target, Internal note unchanged, "Apply quotes" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT_PUBLIC = 'Enter your public quote here.';
const INIT_INTERNAL = 'Do not share before approval.';

const TARGET_PUBLIC = `> The only way out is through.
>
> *— Robert Frost*`;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [publicQuote, setPublicQuote] = useState(INIT_PUBLIC);
  const [internalNote, setInternalNote] = useState(INIT_INTERNAL);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      markdownMatches(publicQuote, TARGET_PUBLIC) &&
      markdownMatches(internalNote, INIT_INTERNAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, publicQuote, internalNote, onSuccess]);

  return (
    <div style={{ width: 700, background: '#1f1f1f', borderRadius: 8, border: '1px solid #444', padding: 20, color: '#e0e0e0' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Settings</h3>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" defaultChecked /> Enable notifications
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <input type="checkbox" /> Auto-publish
        </label>
        <select style={{ padding: '4px 8px', background: '#333', color: '#ddd', border: '1px solid #555', borderRadius: 4, fontSize: 13 }}>
          <option>English</option>
          <option>Spanish</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Public quote</div>
        <div data-color-mode="dark">
          <MDEditor
            value={publicQuote}
            onChange={(val) => { setSaved(false); setPublicQuote(val || ''); }}
            preview="live"
            height={140}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Internal note</div>
        <div data-color-mode="dark">
          <MDEditor
            value={internalNote}
            onChange={(val) => { setSaved(false); setInternalNote(val || ''); }}
            preview="live"
            height={120}
          />
        </div>
      </div>

      <button
        onClick={() => setSaved(true)}
        style={{ padding: '8px 20px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
      >
        Apply quotes
      </button>
    </div>
  );
}
