'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import {
  FormatBold, FormatItalic, Code, FormatAlignCenter, FormatAlignLeft,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 100px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 4px; }
  .ProseMirror code { background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 3px; font-family: monospace; }
`;

export default function T09({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const editorRef = useRef<any>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeExtension,
    ],
    content: '<p>Launch</p><p>Run npm install before release.</p>',
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (successFired.current || !published) return;
    const ed = editorRef.current;
    if (!ed) return;

    const json = ed.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (content.length !== 2) return;

    const h = content[0];
    if (h.type !== 'heading' || h.attrs?.level !== 2) return;
    if (normalizeText(getTextFromBlock(h)) !== 'Launch') return;
    if (h.attrs?.textAlign !== 'center') return;

    const p = content[1];
    if (p.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(p)) !== 'Run npm install before release.') return;

    const codeNodes = (p.content || []).filter(
      (n: any) => n.marks?.some((m: any) => m.type === 'code'),
    );
    if (codeNodes.length !== 1) return;
    if (normalizeText(codeNodes[0].text || '') !== 'npm install') return;

    const nonCodeText = (p.content || []).filter(
      (n: any) => !n.marks?.some((m: any) => m.type === 'code'),
    );
    for (const n of nonCodeText) {
      if (n.marks?.some((m: any) => m.type === 'code')) return;
    }

    successFired.current = true;
    onSuccess();
  }, [published, onSuccess]);

  const handlePublish = useCallback(() => setConfirmOpen(true), []);
  const handleConfirm = useCallback(() => {
    setConfirmOpen(false);
    setModalOpen(false);
    setPublished(true);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 3, maxWidth: 500 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Blog</Typography>
          <Button variant="outlined" onClick={() => { setModalOpen(true); setPublished(false); }}>
            Edit post
          </Button>
        </Paper>
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post body</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Format "Launch" as centered H2, format "npm install" as inline code.
          </Typography>
          <Box sx={{ border: '1px solid #555', borderRadius: 1 }}>
            {editor && (
              <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #555' }}>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'} title="H2">
                  <Typography variant="caption" fontWeight={700}>H2</Typography>
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleCode().run()} color={editor.isActive('code') ? 'primary' : 'default'} title="Inline Code">
                  <Code fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()} color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}>
                  <FormatAlignCenter fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()} color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}>
                  <FormatAlignLeft fontSize="small" />
                </IconButton>
              </Box>
            )}
            <EditorContent editor={editor} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePublish}>Publish</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to publish this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Back</Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm publish
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
