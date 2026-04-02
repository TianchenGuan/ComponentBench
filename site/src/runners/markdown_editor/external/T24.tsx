'use client';

/**
 * markdown_editor-external-T24: Scroll to Metadata and set a release date
 *
 * Layout: isolated_card centered.
 * Spacing: compact (denser typography).
 * Component: one Markdown editor labeled "Product copy".
 * Configuration:
 *   - Fixed-height editor with internal scrolling; only ~8–10 lines are visible at once.
 *   - Toolbar present; preview hidden (edit-only) to emphasize source editing.
 * Initial state: editor is prefilled with a multi-section document. The "Release date" field is off-screen initially and requires scrolling within the editor.
 *
 * Success: Editor markdown value equals the target (Release date changed to 2026-06-15) after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const INITIAL_CONTENT = `# Product Page Copy

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

const TARGET_CONTENT = `# Product Page Copy

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

export default function T24({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_CONTENT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div
      style={{
        padding: 16,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        lineHeight: 1.4,
      }}
      data-testid="md-editor-product-copy"
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Product copy</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="edit"
        height={200}
        data-color-mode="light"
      />
    </div>
  );
}
