'use client';

/**
 * markdown_editor-external-T22: Linkify a phrase to the support URL
 *
 * Layout: isolated_card centered.
 * Component: one Markdown editor labeled "Support message".
 * Configuration:
 *   - Toolbar includes a "Link" control. Clicking it opens a small in-editor popover dialog with two fields:
 *       • Link text
 *       • URL
 *     and an "Insert link" button.
 *   - Editor is in Edit mode with a preview panel below.
 * Initial state: editor contains plain text:
 *   "For help, visit the support portal."
 *   The phrase "support portal" is NOT a link initially.
 * Distractors: none.
 * Feedback:
 *   - After inserting, preview renders "support portal" as a hyperlink.
 *   - If the popover is open, it sits above the editor and must be dismissed/used.
 *
 * Success: Editor markdown value equals:
 *   For help, visit the [support portal](https://example.com/support).
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const INITIAL_CONTENT = 'For help, visit the support portal.';
const TARGET_TEXT = 'For help, visit the [support portal](https://example.com/support).';

export default function T22({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (markdownMatches(value, TARGET_TEXT)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div
      style={{
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-support-message"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Support message</h3>
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || '')}
        preview="live"
        height={250}
        data-color-mode="light"
      />
    </div>
  );
}
