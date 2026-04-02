'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Paper, Typography, Button, Box, IconButton,
} from '@mui/material';
import { FormatBold, FormatItalic, FormatListNumbered } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TaskComponentProps } from '../../types';
import { normalizeText, textsMatch } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 50px; padding: 6px 10px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
`;

export default function T16({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [saved, setSaved] = useState(false);
  const editorRefs = useRef<Record<string, any>>({});

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 600 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Support card</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit only "Customer reply" to contain an ordered list and italic closing line.
          </Typography>

          {[
            { label: 'Customer reply', initialHtml: '', showFull: true },
            { label: 'Internal note', initialHtml: '<p>Remember to tag billing.</p>', showFull: false },
            { label: 'Legal note', initialHtml: '<p>Do not promise compensation yet.</p>', showFull: false },
          ].map(({ label, initialHtml, showFull }) => (
            <EditorBlock
              key={label}
              label={label}
              initialHtml={initialHtml}
              showFull={showFull}
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
            Send reply
          </Button>
        </Paper>
      </Box>
    </>
  );

  function checkSuccess() {
    if (successFired.current) return;

    const refs = editorRefs.current;
    const customer = refs['Customer reply'];
    const internal = refs['Internal note'];
    const legal = refs['Legal note'];
    if (!customer || !internal || !legal) return;

    if (!textsMatch(internal.getText(), 'Remember to tag billing.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(legal.getText(), 'Do not promise compensation yet.', { normalize: true, ignoreTrailingNewline: true })) return;

    const json = customer.getJSON();
    const allContent = json.content || [];
    const content = allContent.filter(
      (b: any) => !(b.type === 'paragraph' && (!b.content || b.content.length === 0)),
    );

    if (content.length !== 2) return;

    const ol = content[0];
    if (ol.type !== 'orderedList') return;
    const items = ol.content || [];
    if (items.length !== 2) return;
    if (normalizeText(getListItemText(items[0])) !== 'Acknowledge issue') return;
    if (normalizeText(getListItemText(items[1])) !== 'Ship fix') return;

    const para = content[1];
    if (para.type !== 'paragraph') return;
    const paraText = normalizeText(getTextFromBlock(para));
    if (paraText !== '— Support team' && paraText !== '\u2014 Support team') return;

    const allItalic = (para.content || []).every(
      (n: any) => n.marks?.some((m: any) => m.type === 'italic'),
    );
    if (!allItalic) return;

    successFired.current = true;
    onSuccess();
  }
}

function EditorBlock({ label, initialHtml, showFull, onMount }: {
  label: string;
  initialHtml: string;
  showFull: boolean;
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
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
        {editor && showFull && (
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
              <FormatBold sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
              <FormatItalic sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>
              <FormatListNumbered sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
        {editor && !showFull && (
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}>
              <FormatBold sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}>
              <FormatItalic sx={{ fontSize: 16 }} />
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
