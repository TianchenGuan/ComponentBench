'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Typography, Button, Box, IconButton, Grid, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import {
  FormatBold, FormatItalic, FormatQuote, FormatListBulleted,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const hcTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000', paper: '#111' },
    text: { primary: '#fff' },
    primary: { main: '#ffeb3b' },
  },
});

const proseMirrorStyles = `
  .ProseMirror { min-height: 60px; padding: 6px 10px; outline: none; color: #fff; }
  .ProseMirror:focus { outline: 2px solid #ffeb3b; border-radius: 4px; }
  .ProseMirror blockquote { border-left: 3px solid #ffeb3b; padding-left: 12px; margin-left: 0; color: #ccc; }
`;

export default function T13({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);
  const editorRefs = useRef<Record<string, any>>({});

  return (
    <ThemeProvider theme={hcTheme}>
      <CssBaseline />
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 700 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Quotes Panel</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit only "Customer-facing quote" to match the Example.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={7}>
              {[
                { label: 'Customer-facing quote', initialHtml: '' },
                { label: 'Internal quote', initialHtml: '<p>Do not publish yet.</p>' },
                { label: 'Legal blurb', initialHtml: '<p>Awaiting approval.</p>' },
              ].map(({ label, initialHtml }) => (
                <EditorBlock
                  key={label}
                  label={label}
                  initialHtml={initialHtml}
                  onMount={(e) => { editorRefs.current[label] = e; }}
                />
              ))}

              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => {
                  setSaved(true);
                  checkSuccess();
                }}
              >
                Apply quotes
              </Button>
            </Grid>

            <Grid item xs={5}>
              <Box
                sx={{
                  border: '1px solid #555',
                  borderRadius: 1,
                  p: 2,
                  bgcolor: '#1a1a1a',
                }}
                data-testid="example-card"
              >
                <Typography variant="caption" color="text.secondary" gutterBottom>Example</Typography>
                <blockquote style={{ borderLeft: '3px solid #ffeb3b', paddingLeft: 12, marginLeft: 0, color: '#ccc' }}>
                  Stay curious
                </blockquote>
                <p style={{ margin: '8px 0' }}>— Ada</p>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </ThemeProvider>
  );

  function checkSuccess() {
    if (successFired.current) return;

    const refs = editorRefs.current;
    const customer = refs['Customer-facing quote'];
    const internal = refs['Internal quote'];
    const legal = refs['Legal blurb'];
    if (!customer || !internal || !legal) return;

    if (!textsMatch(internal.getText(), 'Do not publish yet.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legal.getText(), 'Awaiting approval.', { normalize: true, ignoreTrailingNewline: true })) return;

    const json = customer.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (content.length !== 2) return;

    const bq = content[0];
    if (bq.type !== 'blockquote') return;
    const bqParas = bq.content || [];
    if (bqParas.length !== 1) return;
    if (normalizeText(getTextFromBlock(bqParas[0])) !== 'Stay curious') return;

    const para = content[1];
    if (para.type !== 'paragraph') return;
    const paraText = normalizeText(getTextFromBlock(para));
    if (paraText !== '— Ada' && paraText !== '\u2014 Ada') return;

    successFired.current = true;
    onSuccess();
  }
}

function EditorBlock({ label, initialHtml, onMount }: {
  label: string;
  initialHtml: string;
  onMount: (editor: any) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialHtml,
  });

  useEffect(() => {
    if (editor) onMount(editor);
  }, [editor, onMount]);

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
      <Box sx={{ border: '1px solid #444', borderRadius: 1 }}>
        {editor && (
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #444' }}>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
              <FormatBold sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
              <FormatItalic sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()} color={editor.isActive('blockquote') ? 'primary' : 'default'} title="Blockquote">
              <FormatQuote sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>
              <FormatListBulleted sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}

function getTextFromBlock(block: any): string {
  if (!block.content) return '';
  return block.content.map((n: any) => n.text || '').join('');
}
