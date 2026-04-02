'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Table, TableBody, TableRow, TableCell,
  TableHead, TableContainer,
} from '@mui/material';
import { FormatBold, FormatItalic, FormatClear } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 32px; padding: 4px 8px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 2px; }
`;

function RowEditor({ label, initialHtml, editorRef }: { label: string; initialHtml: string; editorRef: React.MutableRefObject<any> }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialHtml,
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, position: 'relative' }}>
      {editor && (
        <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
            <FormatBold sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
            <FormatItalic sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear formatting">
            <FormatClear sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
      <EditorContent editor={editor} />
    </Box>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const gatewayEditorRef = useRef<any>(null);
  const billingEditorRef = useRef<any>(null);
  const gatewaySavedRef = useRef(false);

  const doCheck = () => {
    if (successFired.current || !gatewaySavedRef.current) return;

    const gw = gatewayEditorRef.current;
    const bl = billingEditorRef.current;
    if (!gw || !bl) return;

    const gwPlain = gw.getText();
    const blPlain = bl.getText();

    if (!textsMatch(gwPlain, 'Deploy now.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(blPlain, 'Hold release.', { normalize: true, ignoreTrailingNewline: true })) return;

    const gwHtml = gw.getHTML();
    const hasForbiddenMarks = /<(strong|em|u|s|mark|code|a)\b/.test(gwHtml.replace(/<\/?p[^>]*>/g, ''));
    if (hasForbiddenMarks) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 700 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Service Table</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Runbook reply</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell><Typography variant="body2" fontWeight={600}>Gateway</Typography></TableCell>
                  <TableCell sx={{ minWidth: 280 }}>
                    <RowEditor label="Gateway" initialHtml="<p><strong>Deploy</strong> <em>now</em>.</p>" editorRef={gatewayEditorRef} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" data-testid="save-gateway-row" onClick={() => { gatewaySavedRef.current = true; doCheck(); }}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><Typography variant="body2" fontWeight={600}>Billing</Typography></TableCell>
                  <TableCell sx={{ minWidth: 280 }}>
                    <RowEditor label="Billing" initialHtml="<p>Hold release.</p>" editorRef={billingEditorRef} />
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
    </>
  );
}
