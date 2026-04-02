'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Table, TableBody, TableRow, TableCell,
  TableHead, TableContainer, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import { FormatBold, FormatItalic } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/react';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const proseMirrorStyles = `
  .ProseMirror { min-height: 28px; padding: 4px 8px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #90caf9; border-radius: 2px; }
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
    <Paper sx={{ display: 'flex', gap: 0.5, p: 0.25 }} elevation={3}>
      <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}><FormatBold sx={{ fontSize: 16 }} /></IconButton>
      <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}><FormatItalic sx={{ fontSize: 16 }} /></IconButton>
    </Paper>
  );
}

function RowEditorBubble({ initialHtml, editorRef }: { initialHtml: string; editorRef: React.MutableRefObject<any> }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialHtml,
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);

  return (
    <Box>
      <SelectionToolbar editor={editor} />
      <Box sx={{ border: '1px solid #555', borderRadius: 1 }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const authRef = useRef<any>(null);
  const billingRef = useRef<any>(null);
  const authSavedRef = useRef(false);

  const doCheck = () => {
    if (successFired.current || !authSavedRef.current) return;

    const auth = authRef.current;
    const billing = billingRef.current;
    if (!auth || !billing) return;

    const authPlain = auth.getText();
    const billingPlain = billing.getText();

    if (!textsMatch(authPlain, 'Deploy is blocked today.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(billingPlain, 'Ready to ship.', { normalize: true, ignoreTrailingNewline: true })) return;

    const authHtml = auth.getHTML();
    const boldMatches = authHtml.match(/<strong>[^<]+<\/strong>/g) || [];
    if (boldMatches.length !== 1 || !/^\s*blocked\s*$/.test(boldMatches[0].replace(/<\/?strong>/g, ''))) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 650 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Service Status</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Status note</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><Typography variant="body2" fontWeight={600}>Auth</Typography></TableCell>
                  <TableCell sx={{ minWidth: 260 }}>
                    <RowEditorBubble initialHtml="<p>Deploy is blocked today.</p>" editorRef={authRef} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" data-testid="save-auth-row" onClick={() => { authSavedRef.current = true; doCheck(); }}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Typography variant="body2" fontWeight={600}>Billing</Typography></TableCell>
                  <TableCell sx={{ minWidth: 260 }}>
                    <RowEditorBubble initialHtml="<p>Ready to ship.</p>" editorRef={billingRef} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined" disabled>Save</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
