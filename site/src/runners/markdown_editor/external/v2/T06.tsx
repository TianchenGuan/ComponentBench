'use client';

/**
 * T06: Nested-scroll metadata edit with explicit save
 *
 * Nested scroll layout: page has its own outer scroll, editor has internal scroll.
 * "Product copy" editor contains a long multi-section document. The `## Metadata` section
 * with `Release date: TBD` is offscreen due to the fixed editor height (~220px).
 * Success: Change `Release date: TBD` → `Release date: 2026-06-15`, click "Save copy".
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# Product Page Copy

## Overview
This draft describes the key features and limitations of the product.

## Highlights
- Fast setup
- Works offline
- Includes export tools

## Details
The copy below is for internal review. Please do not publish until approved.

### Limitations
- No mobile support yet
- Limited theme customization

## Metadata
Owner: Marketing
Release date: TBD
Channel: Web`;

const TARGET = `# Product Page Copy

## Overview
This draft describes the key features and limitations of the product.

## Highlights
- Fast setup
- Works offline
- Includes export tools

## Details
The copy below is for internal review. Please do not publish until approved.

### Limitations
- No mobile support yet
- Limited theme customization

## Metadata
Owner: Marketing
Release date: 2026-06-15
Channel: Web`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && markdownMatches(value, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 20, width: 900 }}>
      <div style={{ width: 180, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Overview', 'Highlights', 'Metadata'].map((s) => (
            <span key={s} style={{ padding: '4px 10px', background: '#f0f0f0', borderRadius: 12, fontSize: 12, color: '#666' }}>
              {s}
            </span>
          ))}
        </div>
        <div style={{ padding: 12, background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Release status</div>
          <div style={{ fontSize: 13, color: '#333' }}>Draft — not published</div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          maxHeight: 420,
          overflow: 'auto',
          padding: 16,
          background: '#fff',
          borderRadius: 8,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Product copy</div>
        <MDEditor
          value={value}
          onChange={(val) => { setSaved(false); setValue(val || ''); }}
          preview="edit"
          height={220}
          data-color-mode="light"
        />
        <button
          onClick={() => setSaved(true)}
          style={{
            marginTop: 12,
            padding: '8px 20px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          Save copy
        </button>
      </div>
    </div>
  );
}
