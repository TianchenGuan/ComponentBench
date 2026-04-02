'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Switch, FormControlLabel, Select, MenuItem,
  ThemeProvider, createTheme, CssBaseline, Divider,
} from '@mui/material';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 60px; padding: 8px 12px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 4px; }
`;

export default function T15({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Best,</p><p>Sam</p>',
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

    if (content[0].type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(content[0])) !== 'Thanks,') return;

    if (content[1].type !== 'paragraph') return;
    if (normalizeText(getTextFromBlock(content[1])) !== 'Alex') return;

    const secondNodes = content[1].content || [];
    const allBold = secondNodes.length > 0 && secondNodes.every(
      (n: any) => n.marks?.some((m: any) => m.type === 'bold'),
    );
    if (!allBold) return;

    const firstNodes = content[0].content || [];
    const firstHasBold = firstNodes.some(
      (n: any) => n.marks?.some((m: any) => m.type === 'bold'),
    );
    if (firstHasBold) return;

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        <Typography variant="h5" gutterBottom>Settings</Typography>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Notifications</Typography>
          <FormControlLabel control={<Switch defaultChecked disabled />} label="Push notifications" />
          <FormControlLabel control={<Switch disabled />} label="Weekly digest" />
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">Frequency</Typography>
            <Select value="Weekly" size="small" disabled sx={{ mt: 0.5, minWidth: 120 }}>
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
            </Select>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Appearance</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Theme</Typography>
              <Select value="Dark" size="small" disabled sx={{ mt: 0.5, minWidth: 100 }}>
                <MenuItem value="Light">Light</MenuItem>
                <MenuItem value="Dark">Dark</MenuItem>
              </Select>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Font size</Typography>
              <Select value="Medium" size="small" disabled sx={{ mt: 0.5, minWidth: 100 }}>
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Privacy</Typography>
          <FormControlLabel control={<Switch defaultChecked disabled />} label="Share analytics" />
          <FormControlLabel control={<Switch disabled />} label="Third-party cookies" />
        </Paper>

        <Divider sx={{ my: 2 }} />

        <Paper elevation={2} sx={{ p: 2 }} data-testid="email-signature-section">
          <Typography variant="subtitle1" gutterBottom>Email signature</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Change to: Thanks, / <strong>Alex</strong> (bold second line).
          </Typography>

          <Box sx={{ border: '1px solid #555', borderRadius: 1, mb: 2 }}>
            {editor && (
              <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid #555' }}>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
                  <FormatItalic fontSize="small" />
                </IconButton>
              </Box>
            )}
            <EditorContent editor={editor} />
          </Box>

          <Button variant="contained" size="small" onClick={() => { savedRef.current = true; doCheck.current(); }}>
            Save signature
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
