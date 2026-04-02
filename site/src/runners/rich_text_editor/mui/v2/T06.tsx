'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Chip, Grid,
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered,
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 140px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
  });

  const doCheck = useRef(() => {});
  doCheck.current = () => {
    if (!editor || successFired.current || !savedRef.current) return;

    const json = editor.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (content.length !== 3) return;

    const h2 = content[0];
    if (h2.type !== 'heading' || h2.attrs?.level !== 2) return;
    if (normalizeText(getTextFromBlock(h2)) !== 'Sprint 12') return;
    if (h2.attrs?.textAlign !== 'center') return;

    const ol = content[1];
    if (ol.type !== 'orderedList') return;
    const items = ol.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'Fix bugs') return;
    if (normalizeText(getListItemText(items[1])) !== 'Polish UI') return;

    const para = content[2];
    if (para.type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(para)) !== 'Last updated: Feb 3') return;
    const allItalic = (para.content || []).every(
      (n: any) => n.marks?.some((m: any) => m.type === 'italic'),
    );
    if (!allItalic) return;

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
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 900 }}>
        <Box sx={{ width: 160, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Velocity</Typography>
            <Typography variant="h5">34</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Open PRs</Typography>
            <Typography variant="h5">8</Typography>
          </Paper>
          <Chip label="On track" color="success" size="small" />
          <Chip label="Sprint 12" variant="outlined" size="small" />
        </Box>

        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Sprint brief</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Make the editor match the Example card exactly, then save.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                {editor && (
                  <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'} title="H2">
                      <Typography variant="caption" fontWeight={700}>H2</Typography>
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                      <FormatBold fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                      <FormatItalic fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>
                      <FormatListNumbered fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>
                      <FormatListBulleted fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()} color={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}>
                      <FormatAlignLeft fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()} color={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}>
                      <FormatAlignCenter fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('right').run()} color={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}>
                      <FormatAlignRight fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                <EditorContent editor={editor} />
              </Box>

              <Button variant="contained" size="small" onClick={() => { savedRef.current = true; doCheck.current(); }}>
                Save brief
              </Button>
            </Grid>

            <Grid item xs={5}>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 2,
                  bgcolor: '#fafafa',
                }}
                data-testid="example-card"
              >
                <Typography variant="caption" color="text.secondary" gutterBottom>Example</Typography>
                <h2 style={{ margin: '8px 0', textAlign: 'center', fontSize: '1.4rem' }}>Sprint 12</h2>
                <ol style={{ margin: '8px 0', paddingLeft: '1.25rem' }}>
                  <li>Fix bugs</li>
                  <li>Polish UI</li>
                </ol>
                <p style={{ fontStyle: 'italic', margin: '8px 0' }}>Last updated: Feb 3</p>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ width: 120 }}>
          <Paper elevation={1} sx={{ p: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">Activity</Typography>
            <Typography variant="body2">12 commits</Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}

function getListItemText(item: any): string {
  if (!item.content) return '';
  return item.content
    .flatMap((node: any) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.map((t: any) => t.text || '');
      }
      return node.text || '';
    })
    .join('');
}
