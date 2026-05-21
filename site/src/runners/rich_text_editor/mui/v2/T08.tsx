'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import { FormatBold, FormatItalic, FormatClear } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const hcTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000', paper: '#111' },
    text: { primary: '#fff' },
    primary: { main: '#ffeb3b' },
  },
});

const proseMirrorStyles = `
  .ProseMirror { min-height: 40px; padding: 6px 10px; outline: none; color: #fff; }
  .ProseMirror:focus { outline: 2px solid #ffeb3b; border-radius: 4px; }
`;

interface EditorInstance {
  label: string;
  initialHtml: string;
}

const EDITORS: EditorInstance[] = [
  { label: 'Public summary', initialHtml: '<p>No breaking changes.</p>' },
  { label: 'Partner summary', initialHtml: '<p><strong>Beta</strong> is <em>available</em> now.</p>' },
  { label: 'Rollback note', initialHtml: '<p>Draft the rollback memo.</p>' },
  { label: 'Internal escalation', initialHtml: '<p>Notify the on-call manager.</p>' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);
  const editorRefs = useRef<Record<string, any>>({});

  return (
    <ThemeProvider theme={hcTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 550 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Partner communications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Clear all formatting from "Partner summary" only.
          </Typography>

          {EDITORS.map(({ label, initialHtml }) => (
            <EditorPanel
              key={label}
              label={label}
              initialHtml={initialHtml}
              onMount={(e) => { editorRefs.current[label] = e; }}
            />
          ))}

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              setSaved(true);
              checkSuccess();
            }}
          >
            Save panel
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );

  function checkSuccess() {
    if (successFired.current) return;

    const refs = editorRefs.current;
    const partner = refs['Partner summary'];
    const pub = refs['Public summary'];
    const rollback = refs['Rollback note'];
    const internal = refs['Internal escalation'];

    if (!partner || !pub || !rollback || !internal) return;

    if (!textsMatch(partner.getText(), 'Beta is available now.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(pub.getText(), 'No breaking changes.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(rollback.getText(), 'Draft the rollback memo.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(internal.getText(), 'Notify the on-call manager.', { normalize: true, ignoreTrailingNewline: true })) return;

    const partnerHtml = partner.getHTML().replace(/<\/?p[^>]*>/g, '');
    if (/<(strong|em|u|s|mark|code|a)\b/.test(partnerHtml)) return;

    successFired.current = true;
    onSuccess();
  }
}

function EditorPanel({ label, initialHtml, onMount }: {
  label: string;
  initialHtml: string;
  onMount: (editor: any) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialHtml,
  });

  useEffect(() => {
    if (editor) onMount(editor);
  }, [editor, onMount]);

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
      <Box sx={{ border: '1px solid #444', borderRadius: 1 }}>
        {editor && (
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #444' }}>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
              <FormatBold sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
              <FormatItalic sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear formatting">
              <FormatClear sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
