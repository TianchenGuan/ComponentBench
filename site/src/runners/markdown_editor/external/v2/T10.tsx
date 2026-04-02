'use client';

/**
 * T10: Insert fenced code block in deployment-note modal
 *
 * AntD Modal with "Deployment note (Markdown)" editor. Background: deployment summary
 * card and command history list. Initial source has `## Commands` followed by a paragraph.
 * Task: Insert a ` ```bash / npm run build / ``` ` fenced code block directly under
 * `## Commands` and above the existing paragraph. Then click "Save note".
 * Success: Content matches target, "Save note" clicked, modal closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Modal, Button, Card } from 'antd';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# Deploy

## Commands
Run the build before packaging.

## Checks
- Smoke test
- Rollback plan ready`;

const TARGET = `# Deploy

## Commands
\`\`\`bash
npm run build
\`\`\`
Run the build before packaging.

## Checks
- Smoke test
- Rollback plan ready`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(INITIAL);
  const [committed, setCommitted] = useState(INITIAL);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!open && markdownMatches(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, open, onSuccess]);

  const handleOpen = () => { setDraft(committed); setOpen(true); };
  const handleSave = () => { setCommitted(draft); setOpen(false); };

  return (
    <div style={{ display: 'flex', gap: 20, width: 800, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card size="small" title="Deployment summary">
          <p style={{ margin: 0, fontSize: 13, color: '#666' }}>Latest deploy: v2.4.1 to staging.</p>
          <p style={{ margin: 0, fontSize: 13, color: '#666' }}>Status: pending smoke tests.</p>
        </Card>
        <Card size="small" title="Command history">
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#666' }}>
            <li><code>npm test</code> — passed</li>
            <li><code>npm run lint</code> — passed</li>
            <li><code>docker build .</code> — success</li>
          </ul>
        </Card>
        <Button type="primary" onClick={handleOpen}>Edit deployment note</Button>
      </div>

      <Modal
        title="Edit deployment note"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSave}>Save note</Button>,
        ]}
        width={560}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Deployment note (Markdown)
        </div>
        <MDEditor
          value={draft}
          onChange={(val) => setDraft(val || '')}
          preview="live"
          height={250}
          data-color-mode="light"
        />
      </Modal>
    </div>
  );
}
