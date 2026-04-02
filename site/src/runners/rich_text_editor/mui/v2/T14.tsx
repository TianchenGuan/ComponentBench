'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Drawer,
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatListBulleted, HorizontalRule,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 80px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
  .ProseMirror hr { border: none; border-top: 2px solid #e0e0e0; margin: 12px 0; }
`;

export default function T14({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const deployRef = useRef<any>(null);
  const internalRef = useRef<any>(null);

  const deployEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
  });

  const internalEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Leave untouched.</p>',
  });

  useEffect(() => {
    deployRef.current = deployEditor;
  }, [deployEditor]);
  useEffect(() => {
    internalRef.current = internalEditor;
  }, [internalEditor]);

  useEffect(() => {
    if (successFired.current || !saved || drawerOpen) return;

    const deploy = deployRef.current;
    const internal = internalRef.current;
    if (!deploy || !internal) return;

    if (!textsMatch(internal.getText(), 'Leave untouched.', { normalize: true, ignoreTrailingNewline: true })) return;

    const json = deploy.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (content.length !== 3) return;

    const h3 = content[0];
    if (h3.type !== 'heading' || h3.attrs?.level !== 3) return;
    if (normalizeText(getTextFromBlock(h3)) !== 'Risks') return;

    if (content[1].type !== 'horizontalRule') return;

    const bl = content[2];
    if (bl.type !== 'bulletList') return;
    const items = bl.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'API drift') return;
    if (normalizeText(getListItemText(items[1])) !== 'Manual rollback') return;

    successFired.current = true;
    onSuccess();
  }, [saved, drawerOpen, onSuccess]);

  const handleSaveDrawer = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 500 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Deployment Checklist</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Open the drawer to edit the deployment note.
          </Typography>
          <Button variant="outlined" onClick={() => { setDrawerOpen(true); setSaved(false); }}>
            Open checklist drawer
          </Button>
        </Paper>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 480, p: 3, display: 'flex', flexDirection: 'column' } }}>
        <Typography variant="h6" gutterBottom>Checklist drawer</Typography>

        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>Deployment note</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Create: H3 "Risks", horizontal rule, bullet list with "API drift" and "Manual rollback".
        </Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
          {deployEditor && (
            <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #e0e0e0' }}>
              <IconButton size="small" onClick={() => deployEditor.chain().focus().toggleHeading({ level: 3 }).run()} color={deployEditor.isActive('heading', { level: 3 }) ? 'primary' : 'default'} title="H3">
                <Typography variant="caption" fontWeight={700}>H3</Typography>
              </IconButton>
              <IconButton size="small" onClick={() => deployEditor.chain().focus().toggleBold().run()} color={deployEditor.isActive('bold') ? 'primary' : 'default'}>
                <FormatBold fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => deployEditor.chain().focus().toggleItalic().run()} color={deployEditor.isActive('italic') ? 'primary' : 'default'}>
                <FormatItalic fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => deployEditor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                <HorizontalRule fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => deployEditor.chain().focus().toggleBulletList().run()} color={deployEditor.isActive('bulletList') ? 'primary' : 'default'}>
                <FormatListBulleted fontSize="small" />
              </IconButton>
            </Box>
          )}
          <EditorContent editor={deployEditor} />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Internal note</Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
          {internalEditor && (
            <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
              <IconButton size="small" onClick={() => internalEditor.chain().focus().toggleBold().run()} color={internalEditor.isActive('bold') ? 'primary' : 'default'}>
                <FormatBold fontSize="small" />
              </IconButton>
            </Box>
          )}
          <EditorContent editor={internalEditor} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button variant="text" onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDrawer}>Save drawer</Button>
        </Box>
      </Drawer>
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
