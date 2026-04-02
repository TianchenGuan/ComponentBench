'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import {
  FormatBold, FormatItalic, Code, FormatListBulleted, FormatListNumbered,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 200px; padding: 8px 12px; outline: none; overflow-y: auto; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 4px; }
  .ProseMirror code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
`;

const INITIAL_HTML = `<h1>Runbook</h1><h2>Summary</h2><p>Prepare the release carefully.</p><p>Check the staging environment before proceeding.</p><p>Coordinate with the on-call team if needed.</p><h2>Prerequisites</h2><p>Verify all feature flags are set correctly.</p><p>Review the deployment checklist one more time.</p><p>Confirm that monitoring dashboards are green.</p><h2>Commands</h2><p>Run npm run build before deployment.</p><h2>Notes</h2><p>Escalate if staging fails.</p>`;

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeExtension],
    content: INITIAL_HTML,
  });

  const doCheck = useRef(() => {});
  doCheck.current = () => {
    if (!editor || successFired.current || !savedRef.current) return;

    const json = editor.getJSON();
    const content = json.content || [];

    const expected = [
      { type: 'heading', level: 1, text: 'Runbook' },
      { type: 'heading', level: 2, text: 'Summary' },
      { type: 'paragraph', text: 'Prepare the release carefully.' },
      { type: 'paragraph', text: 'Check the staging environment before proceeding.' },
      { type: 'paragraph', text: 'Coordinate with the on-call team if needed.' },
      { type: 'heading', level: 2, text: 'Prerequisites' },
      { type: 'paragraph', text: 'Verify all feature flags are set correctly.' },
      { type: 'paragraph', text: 'Review the deployment checklist one more time.' },
      { type: 'paragraph', text: 'Confirm that monitoring dashboards are green.' },
      { type: 'heading', level: 2, text: 'Commands' },
      { type: 'paragraph', text: 'Run npm run build before deployment.', codeSpan: 'npm run build' },
      { type: 'heading', level: 2, text: 'Notes' },
      { type: 'paragraph', text: 'Escalate if staging fails.' },
    ];

    if (content.length !== expected.length) return;

    for (let i = 0; i < expected.length; i++) {
      const block = content[i];
      const exp = expected[i];
      if (block.type !== exp.type) return;
      if (exp.type === 'heading' && block.attrs?.level !== exp.level) return;
      if (normalizeText(getTextFromBlock(block)) !== exp.text) return;

      if (exp.codeSpan) {
        const codeNodes = (block.content || []).filter(
          (n: any) => n.marks?.some((m: any) => m.type === 'code'),
        );
        if (codeNodes.length !== 1) return;
        if (normalizeText((codeNodes[0] as any).text || '') !== exp.codeSpan) return;
        const nonCodeNodes = (block.content || []).filter(
          (n: any) => !n.marks?.some((m: any) => m.type === 'code'),
        );
        for (const n of nonCodeNodes) {
          if (n.marks?.some((m: any) => m.type === 'code')) return;
        }
      }
    }

    successFired.current = true;
    onSuccess();
  };

  useEffect(() => {
    if (!editor) return;
    const handler = () => doCheck.current();
    editor.on('update', handler);
    return () => { editor.off('update', handler); };
  }, [editor]);

  const handleSave = () => { savedRef.current = true; doCheck.current(); };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 850 }}>
        <Paper elevation={1} sx={{ width: 180, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Analytics</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Builds: 42</Typography>
          <Typography variant="body2">Errors: 3</Typography>
          <Typography variant="body2">Coverage: 87%</Typography>
        </Paper>

        <Paper elevation={2} sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>How-to</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Scroll to the Commands section and format <code>npm run build</code> as inline code.
          </Typography>

          <Box sx={{ border: '1px solid #555', borderRadius: 1, mb: 2, display: 'flex', flexDirection: 'column', maxHeight: 280, overflow: 'hidden' }}>
            {editor && (
              <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #555', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleCode().run()} color={editor.isActive('code') ? 'primary' : 'default'} title="Inline Code">
                  <Code fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>
                  <FormatListBulleted fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>
                  <FormatListNumbered fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              <EditorContent editor={editor} />
            </Box>
          </Box>

          <Button variant="contained" size="small" onClick={handleSave}>
            Save how-to
          </Button>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
