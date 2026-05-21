'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton,
} from '@mui/material';
import {
  FormatBold, FormatItalic, Code, FormatListBulleted,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeExtension from '@tiptap/extension-code';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 200px; padding: 8px 12px; outline: none; overflow-y: auto; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
  .ProseMirror code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
`;

const longPrefix = `<h1>Changelog</h1>
<h2>v1.0</h2><p>Initial release with basic features.</p>
<h2>v1.1</h2><p>Added error handling for edge cases.</p>
<h2>v1.2</h2><p>Performance optimizations across the board.</p>
<h2>v1.3</h2><p>Security patches applied.</p>
<h2>v1.4</h2><p>New dashboard widget added.</p>
<h2>v1.5</h2><p>Monitoring continues overnight.</p>`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CodeExtension],
    content: longPrefix,
  });

  const doCheck = useRef(() => {});
  doCheck.current = () => {
    if (!editor || successFired.current || !savedRef.current) return;

    const json = editor.getJSON();
    const content = json.content || [];
    const nonEmpty = content.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (nonEmpty.length < 2) return;

    const lastBlock = nonEmpty[nonEmpty.length - 1];
    if (lastBlock.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(lastBlock)) !== 'Checksum: sha256-ready') return;

    const codeNodes = (lastBlock.content || []).filter(
      (n: any) => n.marks?.some((m: any) => m.type === 'code'),
    );
    if (codeNodes.length !== 1) return;
    if (normalizeText((codeNodes[0] as any).text || '') !== 'sha256-ready') return;

    const nonCodeNodes = (lastBlock.content || []).filter(
      (n: any) => !n.marks?.some((m: any) => m.type === 'code'),
    );
    for (const n of nonCodeNodes) {
      if (n.marks?.some((m: any) => m.type === 'code')) return;
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

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 850 }}>
        <Paper elevation={1} sx={{ width: 180, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">Release metrics</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>Deploys: 23</Typography>
          <Typography variant="body2">Rollbacks: 2</Typography>
          <Typography variant="body2">Uptime: 99.8%</Typography>
        </Paper>

        <Paper elevation={2} sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>Changelog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Scroll to the end and append: Checksum: <code>sha256-ready</code>
          </Typography>

          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2, display: 'flex', flexDirection: 'column', maxHeight: 280, overflow: 'hidden' }}>
            {editor && (
              <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
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
              </Box>
            )}
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
              <EditorContent editor={editor} />
            </Box>
          </Box>

          <Button variant="contained" size="small" onClick={() => { savedRef.current = true; doCheck.current(); }}>
            Save changelog
          </Button>
        </Paper>
      </Box>
    </>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
