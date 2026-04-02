'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Drawer, TextField,
  Popover,
} from '@mui/material';
import {
  FormatBold, FormatItalic, InsertLink,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 80px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
  .ProseMirror a { color: #1976d2; text-decoration: underline; }
`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [linkAnchor, setLinkAnchor] = useState<null | HTMLElement>(null);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TipTapLink.configure({ openOnClick: false }),
    ],
    content: '<p>See the release notes for details.</p>',
  });

  useEffect(() => {
    if (!editor || successFired.current) return;
    if (!saved || drawerOpen) return;

    const html = editor.getHTML();
    const plainText = editor.getText();

    if (!textsMatch(plainText, 'See the release notes for details.', { normalize: true, ignoreTrailingNewline: true })) return;

    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
    const links: { href: string; text: string }[] = [];
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      links.push({ href: m[1], text: m[2] });
    }

    if (links.length === 1 && links[0].text === 'release notes' && links[0].href === 'https://example.com/notes') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, drawerOpen, editor, onSuccess]);

  const handleOpenLink = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;
    setLinkAnchor(e.currentTarget);
    setLinkUrl('');
  }, [editor]);

  const handleSaveLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkAnchor(null);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleSaveDrawer = useCallback(() => {
    setSaved(true);
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 500 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Resources</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Click the button below to edit resources.
          </Typography>
          <Button variant="outlined" onClick={() => { setDrawerOpen(true); setSaved(false); }}>
            Edit resources
          </Button>
        </Paper>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 450, p: 3 } }}>
        <Typography variant="h6" gutterBottom>Resources</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Make "release notes" a link to https://example.com/notes
        </Typography>

        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
          {editor && (
            <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #e0e0e0' }}>
              <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                <FormatBold fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                <FormatItalic fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleOpenLink} color={editor.isActive('link') ? 'primary' : 'default'} title="Insert Link">
                <InsertLink fontSize="small" />
              </IconButton>
            </Box>
          )}
          <EditorContent editor={editor} />
        </Box>

        <Popover
          open={Boolean(linkAnchor)}
          anchorEl={linkAnchor}
          onClose={() => setLinkAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              sx={{ width: 260 }}
            />
            <Button variant="contained" size="small" onClick={handleSaveLink}>
              Save link
            </Button>
          </Box>
        </Popover>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <Button variant="text" onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveDrawer}>Save resources</Button>
        </Box>
      </Drawer>
    </>
  );
}
