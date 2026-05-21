'use client';

/**
 * T03: Modal bio — localized sentence replacement
 *
 * MUI Dialog with "Bio (Markdown)" editor. Profile card background with "Edit bio" button.
 * Initial: "# About me\nI enjoy puzzles.\n- Writes docs\n- Reviews PRs"
 * Task: Replace "I enjoy puzzles." with "I enjoy interface benchmarks." — leave rest intact.
 * Success: Content matches target, "Save changes" clicked, dialog closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MuiButton from '@mui/material/Button';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INITIAL = `# About me
I enjoy puzzles.
- Writes docs
- Reviews PRs`;

const TARGET = `# About me
I enjoy interface benchmarks.
- Writes docs
- Reviews PRs`;

export default function T03({ onSuccess }: TaskComponentProps) {
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
    <div
      style={{
        width: 480,
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Profile</h3>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Bio</div>
      <div
        style={{
          padding: 12,
          background: '#fafafa',
          borderRadius: 4,
          minHeight: 60,
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          color: committed ? '#333' : '#999',
          marginBottom: 16,
        }}
      >
        {committed || '(empty)'}
      </div>
      <MuiButton variant="contained" size="small" onClick={handleOpen}>
        Edit bio
      </MuiButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit bio</DialogTitle>
        <DialogContent>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, marginTop: 8 }}>
            Bio (Markdown)
          </div>
          <MDEditor
            value={draft}
            onChange={(val) => setDraft(val || '')}
            preview="live"
            height={200}
            data-color-mode="light"
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)}>Cancel</MuiButton>
          <MuiButton variant="contained" onClick={handleSave}>Save changes</MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
