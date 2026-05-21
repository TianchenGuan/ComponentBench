'use client';

/**
 * T15: Bottom drawer checklist localized wording edit
 *
 * Dark bottom AntD Drawer slides up over a status dashboard when "Edit ops checklist"
 * is clicked. Fixed-height editor "Ops checklist (Markdown)" with internal scroll;
 * the checklist section starts partially offscreen.
 * Task: Change `- [ ] Draft rollback steps` → `- [ ] Review rollback steps`.
 * Do not change the checkbox state or any other line.
 * Success: Content matches target, "Apply checklist" clicked, drawer closes.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Drawer, Button, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# Ops checklist

## Checklist
- [ ] Draft rollback steps
- [ ] Notify support
- [ ] Check alerts`;

const TARGET = `# Ops checklist

## Checklist
- [ ] Review rollback steps
- [ ] Notify support
- [ ] Check alerts`;

export default function T15({ onSuccess }: TaskComponentProps) {
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
    <div style={{ width: 800, background: '#1a1a1a', borderRadius: 8, border: '1px solid #444', padding: 20, color: '#e0e0e0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Status Dashboard</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Tag color="green">API: healthy</Tag>
        <Tag color="orange">Worker: degraded</Tag>
        <Tag color="blue">DB: normal</Tag>
      </div>
      <div style={{ padding: 12, background: '#252525', borderRadius: 6, marginBottom: 16, fontSize: 13 }}>
        <div>Active deployments: 2</div>
        <div>Pending rollbacks: 1</div>
        <div>Last incident: 4h ago</div>
      </div>
      <Button onClick={handleOpen}>Edit ops checklist</Button>

      <Drawer
        title="Ops checklist"
        placement="bottom"
        height={340}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Apply checklist</Button>
          </div>
        }
        styles={{
          body: { background: '#1a1a1a' },
          header: { background: '#1a1a1a', color: '#fff', borderBottom: '1px solid #444' },
          footer: { background: '#1a1a1a', borderTop: '1px solid #444' },
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#e0e0e0' }}>
          Ops checklist (Markdown)
        </div>
        <div data-color-mode="dark">
          <MDEditor
            value={draft}
            onChange={(val) => setDraft(val || '')}
            preview="edit"
            height={150}
          />
        </div>
      </Drawer>
    </div>
  );
}
