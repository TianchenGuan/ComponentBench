'use client';

/**
 * T08: Link insertion inside off-center announcement drawer
 *
 * Mantine Drawer (right, off-center) with "Announcement (Markdown)" editor.
 * Background: dashboard card and notifications list as clutter.
 * Initial: "Read the documentation for details." (plain text).
 * Task: Make only the word `documentation` a link to `https://example.com/docs`.
 * Success: Content matches target, "Save announcement" clicked, drawer closes.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Drawer, Button } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = 'Read the documentation for details.';
const TARGET = 'Read the [documentation](https://example.com/docs) for details.';

export default function T08({ onSuccess }: TaskComponentProps) {
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

  const handleSave = () => { setCommitted(draft); setOpen(false); };
  const handleOpen = () => { setDraft(committed); setOpen(true); };

  return (
    <div style={{ display: 'flex', gap: 20, width: 800, padding: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Dashboard</h4>
          <p style={{ margin: 0, fontSize: 13, color: '#999' }}>Welcome back. 3 pending items.</p>
        </div>
        <div style={{ padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 14, color: '#666' }}>Notifications</h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#666' }}>
            <li>Deployment succeeded</li>
            <li>New comment on PR #42</li>
            <li>Scheduled maintenance tonight</li>
          </ul>
        </div>
        <Button onClick={handleOpen}>Edit announcement</Button>
      </div>

      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title="Announcement"
        position="right"
        size="lg"
        padding="md"
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
          Announcement (Markdown)
        </div>
        <MDEditor
          value={draft}
          onChange={(val) => setDraft(val || '')}
          preview="live"
          height={200}
          data-color-mode="light"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="default" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save announcement</Button>
        </div>
      </Drawer>
    </div>
  );
}
