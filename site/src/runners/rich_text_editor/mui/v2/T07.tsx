'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Chip, Switch, FormControlLabel,
  ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import { FormatItalic, Code, Highlight as HighlightIcon } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 60px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 4px; }
  .ProseMirror mark { background-color: #fff176; color: #000; padding: 1px 2px; border-radius: 2px; }
  .ProseMirror code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
`;

const TARGET_TEXT = 'Please review the Q1 plan today.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Highlight, CodeExtension],
    content: `<p>${TARGET_TEXT}</p>`,
  });

  const doCheck = useRef(() => {});
  doCheck.current = () => {
    if (!editor || successFired.current || !savedRef.current) return;

    const plain = editor.getText();
    if (!textsMatch(plain, TARGET_TEXT, { normalize: true, ignoreTrailingNewline: true })) return;

    const json = editor.getJSON();
    const content = json.content || [];
    if (content.length !== 1 || content[0].type !== 'paragraph') return;

    const nodes = content[0].content || [];
    const spans: { text: string; marks: string[] }[] = nodes.map((n: any) => ({
      text: n.text || '',
      marks: (n.marks || []).map((m: any) => m.type),
    }));

    let hasHighlightQ1 = false;
    let hasCodePlan = false;
    let hasItalicToday = false;
    let extraMarks = false;

    for (const span of spans) {
      const t = span.text;
      const hasHighlight = span.marks.includes('highlight');
      const hasCode = span.marks.includes('code');
      const hasItalic = span.marks.includes('italic');

      if (t.includes('Q1') && hasHighlight) hasHighlightQ1 = true;
      if (t.includes('plan') && hasCode) hasCodePlan = true;
      if (t.includes('today') && hasItalic) hasItalicToday = true;

      if (hasHighlight && !t.trim().match(/^Q1$/)) extraMarks = true;
      if (hasCode && !t.trim().match(/^plan$/)) extraMarks = true;
      if (hasItalic && !t.trim().match(/^today$/)) extraMarks = true;
    }

    if (hasHighlightQ1 && hasCodePlan && hasItalicToday && !extraMarks) {
      successFired.current = true;
      onSuccess();
    }
  };

  useEffect(() => {
    if (!editor) return;
    const handler = () => doCheck.current();
    editor.on('update', handler);
    return () => { editor.off('update', handler); };
  }, [editor]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 700 }}>
        <Box sx={{ width: 180, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel control={<Switch defaultChecked disabled />} label="Auto-deploy" />
          <FormControlLabel control={<Switch disabled />} label="Canary" />
          <Chip label="Region: US-West" size="small" />
          <Chip label="Env: staging" size="small" variant="outlined" />
          <Paper elevation={1} sx={{ p: 1 }}>
            <Typography variant="caption" color="text.secondary">Queue depth</Typography>
            <Typography variant="body2">42</Typography>
          </Paper>
        </Box>

        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Reminder</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Highlight "Q1", italicize "today", format "plan" as inline code.
          </Typography>

          <Box sx={{ border: '1px solid #555', borderRadius: 1, mb: 2 }}>
            {editor && (
              <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #555' }}>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleHighlight().run()} color={editor.isActive('highlight') ? 'primary' : 'default'} title="Highlight">
                  <HighlightIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleCode().run()} color={editor.isActive('code') ? 'primary' : 'default'} title="Inline Code">
                  <Code fontSize="small" />
                </IconButton>
              </Box>
            )}
            <EditorContent editor={editor} />
          </Box>

          <Button variant="contained" size="small" onClick={() => { savedRef.current = true; doCheck.current(); }}>
            Apply reminder
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
