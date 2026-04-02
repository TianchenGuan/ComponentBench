'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/react';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 60px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 4px; }
`;

function SelectionToolbar({ editor }: { editor: Editor | null }) {
  const [hasSelection, setHasSelection] = useState(false);
  useEffect(() => {
    if (!editor) return;
    const update = () => { const { from, to } = editor.state.selection; setHasSelection(from !== to); };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => { editor.off('selectionUpdate', update); editor.off('transaction', update); };
  }, [editor]);
  if (!editor || !hasSelection) return null;
  return (
    <Paper sx={{ display: 'flex', gap: 0.5, p: 0.5, mb: 0.5 }} elevation={4}>
      <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}><FormatBold fontSize="small" /></IconButton>
      <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}><FormatItalic fontSize="small" /></IconButton>
    </Paper>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const publicEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Routine update only.</p>',
  });

  const incidentEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>This is urgent today.</p>',
  });

  const checkSuccess = useRef(() => {});
  checkSuccess.current = () => {
    if (!incidentEditor || !publicEditor || successFired.current || !savedRef.current) return;

    const incidentHtml = incidentEditor.getHTML();
    const publicText = publicEditor.getText();

    const hasCorrectBold = /<strong>\s*urgent\s*<\/strong>/.test(incidentHtml);
    const hasCorrectItalic = /<em>\s*today\s*<\/em>/.test(incidentHtml);
    const boldMatches = incidentHtml.match(/<strong>[^<]+<\/strong>/g) || [];
    const italicMatches = incidentHtml.match(/<em>[^<]+<\/em>/g) || [];
    const onlyTargetBold = boldMatches.length === 1 && /^\s*urgent\s*$/.test(boldMatches[0].replace(/<\/?strong>/g, ''));
    const onlyTargetItalic = italicMatches.length === 1 && /^\s*today\s*$/.test(italicMatches[0].replace(/<\/?em>/g, ''));

    const incidentPlain = incidentEditor.getText();
    const textOk = textsMatch(incidentPlain, 'This is urgent today.', { normalize: true, ignoreTrailingNewline: true });
    const publicOk = textsMatch(publicText, 'Routine update only.', { normalize: true, ignoreTrailingNewline: true });

    if (textOk && publicOk && hasCorrectBold && hasCorrectItalic && onlyTargetBold && onlyTargetItalic) {
      successFired.current = true;
      onSuccess();
    }
  };

  useEffect(() => {
    if (!incidentEditor || !publicEditor) return;
    const handler = () => checkSuccess.current();
    incidentEditor.on('update', handler);
    publicEditor.on('update', handler);
    return () => {
      incidentEditor.off('update', handler);
      publicEditor.off('update', handler);
    };
  }, [incidentEditor, publicEditor]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 700 }}>
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Service blurbs</Typography>

          {[
            { label: 'Public blurb', editor: publicEditor },
            { label: 'Incident blurb', editor: incidentEditor },
          ].map(({ label, editor }) => (
            <Box key={label} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>{label}</Typography>
              <SelectionToolbar editor={editor} />
              <Box sx={{ border: '1px solid #555', borderRadius: 1 }}>
                <EditorContent editor={editor} />
              </Box>
            </Box>
          ))}

          <Button variant="contained" size="small" onClick={() => { savedRef.current = true; checkSuccess.current(); }}>
            Apply blurb
          </Button>
        </Paper>

        <Paper elevation={1} sx={{ width: 160, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Status</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Region: US-East</Typography>
          <Typography variant="body2">Uptime: 99.2%</Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
