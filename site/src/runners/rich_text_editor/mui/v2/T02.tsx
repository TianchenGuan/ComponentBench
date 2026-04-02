'use client';

import React, { useEffect, useRef } from 'react';
import { Paper, Typography, Button, Box, IconButton, Chip } from '@mui/material';
import { Title, FormatListBulleted } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 120px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
  }
`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
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

    if (content.length !== 2) return;

    const heading = content[0];
    if (heading.type !== 'heading' || heading.attrs?.level !== 3) return;
    if (normalizeText(getTextFromBlock(heading)) !== 'Rollback') return;

    const bulletList = content[1];
    if (bulletList.type !== 'bulletList') return;
    const items = bulletList.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'Stop traffic') return;
    if (normalizeText(getListItemText(items[1])) !== 'Restore backup') return;

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
      <Box sx={{ display: 'flex', gap: 2, p: 2, maxWidth: 800 }}>
        <Paper elevation={2} sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>Release snippet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Use the empty-line quick insert menu to create the structure, then save.
          </Typography>

          <Paper sx={{ display: 'flex', gap: 0.5, p: 0.5, mb: 0.5 }} elevation={1}>
            <IconButton
              size="small"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              color={editor?.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
              title="Heading 3"
            >
              <Title fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              color={editor?.isActive('bulletList') ? 'primary' : 'default'}
              title="Bullet List"
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
          </Paper>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
            <EditorContent editor={editor} />
          </Box>

          <Button variant="contained" size="small" onClick={() => { savedRef.current = true; doCheck.current(); }}>
            Save snippet
          </Button>
        </Paper>

        <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Deploys today</Typography>
            <Typography variant="h5">7</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Rollbacks</Typography>
            <Typography variant="h5">1</Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Chip label="Healthy" color="success" size="small" sx={{ mt: 0.5 }} />
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
