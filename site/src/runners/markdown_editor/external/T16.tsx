'use client';

/**
 * markdown_editor-external-T16: Scroll to a TODO line and fix it
 *
 * Layout: isolated_card anchored near the bottom-left of the viewport.
 * Component: one Markdown editor labeled "Sprint notes".
 * Configuration:
 *   - The editor has a fixed height (about 10 visible lines); the textarea scrolls internally.
 *   - Standard toolbar is visible; live preview is shown below but is not required.
 * Initial state: the editor is prefilled with a multi-section markdown document.
 * The "Release date" field is off-screen initially and requires scrolling.
 *
 * Success: Editor markdown value equals the target (TODO changed to DONE) after normalization.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../types';
import { markdownMatches } from '../types';

const INITIAL_CONTENT = `# Sprint 5 Notes

This document is intentionally long enough to require scrolling inside the editor.

## Summary
- Completed the API wiring
- Fixed flaky tests
- Reviewed analytics events

## Details
The team focused on stability work and documentation.

## Action items
1. Follow up with design
2. Update onboarding checklist
3. Prepare demo script

## Checklist
- [ ] TODO: add screenshots
- [ ] Confirm links
- [ ] Run spellcheck`;

const TARGET_CONTENT = `# Sprint 5 Notes

This document is intentionally long enough to require scrolling inside the editor.

## Summary
- Completed the API wiring
- Fixed flaky tests
- Reviewed analytics events

## Details
The team focused on stability work and documentation.

## Action items
1. Follow up with design
2. Update onboarding checklist
3. Prepare demo script

## Checklist
- [ ] DONE: add screenshots
- [ ] Confirm links
- [ ] Run spellcheck`;

export default function T16({ onSuccess }: TaskComponentProps) {
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
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        width: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      data-testid="md-editor-sprint-notes"
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Sprint notes</h3>
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
