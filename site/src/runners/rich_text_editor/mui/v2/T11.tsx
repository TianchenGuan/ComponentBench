'use client';

import React, { useEffect, useRef } from 'react';
import {
  Paper, Typography, Button, Box, IconButton,
} from '@mui/material';
import { FormatBold, FormatItalic, Subscript as SubIcon, Superscript as SupIcon } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import type { TaskComponentProps } from '../../types';
import { textsMatch } from '../../types';

const proseMirrorStyles = `
  .ProseMirror { min-height: 40px; padding: 6px 10px; outline: none; }
  .ProseMirror:focus { outline: 2px solid #1976d2; border-radius: 4px; }
  .ProseMirror sub { font-size: 0.75em; vertical-align: sub; }
  .ProseMirror sup { font-size: 0.75em; vertical-align: super; }
`;

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const savedRef = useRef(false);
  const chemRef = useRef<any>(null);
  const meetingRef = useRef<any>(null);

  const chemEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Subscript, Superscript],
    content: '<p>H2O uses m2 notation.</p>',
  });

  const meetingEditor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '<p>Agenda locked.</p>',
  });

  useEffect(() => {
    chemRef.current = chemEditor;
  }, [chemEditor]);
  useEffect(() => {
    meetingRef.current = meetingEditor;
  }, [meetingEditor]);

  const doCheck = () => {
    if (successFired.current || !savedRef.current) return;
    const chem = chemRef.current;
    const meeting = meetingRef.current;
    if (!chem || !meeting) return;

    if (!textsMatch(chem.getText(), 'H2O uses m2 notation.', { normalize: true, ignoreTrailingNewline: true })) return;
    if (!textsMatch(meeting.getText(), 'Agenda locked.', { normalize: true, ignoreTrailingNewline: true })) return;

    const chemHtml = chem.getHTML();

    const subMatches = chemHtml.match(/<sub>([^<]*)<\/sub>/g) || [];
    const supMatches = chemHtml.match(/<sup>([^<]*)<\/sup>/g) || [];

    if (subMatches.length !== 1 || supMatches.length !== 1) return;
    if (subMatches[0] !== '<sub>2</sub>') return;
    if (supMatches[0] !== '<sup>2</sup>') return;

    const h2oIndex = chemHtml.indexOf('H');
    const subIndex = chemHtml.indexOf('<sub>2</sub>');
    const mIndex = chemHtml.indexOf(' m');
    const supIndex = chemHtml.indexOf('<sup>2</sup>');

    if (subIndex < h2oIndex || supIndex < mIndex) return;
    if (subIndex > supIndex) return;

    successFired.current = true;
    onSuccess();
  };

  return (
    <>
      <style>{proseMirrorStyles}</style>
      <Box sx={{ p: 2, maxWidth: 600 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Review card</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Format the first "2" (in H2O) as subscript and the second "2" (in m2) as superscript in "Chemistry note".
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Meeting note */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Meeting note</Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {meetingEditor && (
                  <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
                    <IconButton size="small" onClick={() => meetingEditor.chain().focus().toggleBold().run()} color={meetingEditor.isActive('bold') ? 'primary' : 'default'}>
                      <FormatBold sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => meetingEditor.chain().focus().toggleItalic().run()} color={meetingEditor.isActive('italic') ? 'primary' : 'default'}>
                      <FormatItalic sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                )}
                <EditorContent editor={meetingEditor} />
              </Box>
            </Box>

            {/* Chemistry note */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Chemistry note</Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                {chemEditor && (
                  <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, borderBottom: '1px solid #e0e0e0' }}>
                    <IconButton size="small" onClick={() => chemEditor.chain().focus().toggleBold().run()} color={chemEditor.isActive('bold') ? 'primary' : 'default'}>
                      <FormatBold sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => chemEditor.chain().focus().toggleItalic().run()} color={chemEditor.isActive('italic') ? 'primary' : 'default'}>
                      <FormatItalic sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => chemEditor.chain().focus().toggleSubscript().run()} color={chemEditor.isActive('subscript') ? 'primary' : 'default'} title="Subscript">
                      <SubIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => chemEditor.chain().focus().toggleSuperscript().run()} color={chemEditor.isActive('superscript') ? 'primary' : 'default'} title="Superscript">
                      <SupIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                )}
                <EditorContent editor={chemEditor} />
              </Box>
            </Box>
          </Box>

          <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => { savedRef.current = true; doCheck(); }}>
            Apply note
          </Button>
        </Paper>
      </Box>
    </>
  );
}
