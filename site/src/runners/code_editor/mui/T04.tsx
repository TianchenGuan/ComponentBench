'use client';

/**
 * code_editor-mui-T04: Enter formatted Python function
 *
 * MUI Paper card centered titled "Python snippet".
 * Composite CodeMirror 6 editor configured for Python (syntax highlighting and 4-space indentation).
 * Toolbar shows a disabled Language chip "Python" and a small helper text "Use 4 spaces for indentation".
 * Initial state: editor is empty.
 * No Apply/Save button is present; the editor is live.
 * There are no other form fields or distracting widgets.
 *
 * Success: Editor content equals the target Python snippet (line endings normalized; trailing whitespace ignored).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const TARGET_CONTENT = `def area(radius):
    pi = 3.14159
    return pi * radius * radius`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState('');
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        python(),
        indentUnit.of('    '), // 4 spaces
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 600, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Python snippet</Typography>
      </Box>
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip label="Python" size="small" disabled />
        <Typography variant="caption" color="text.secondary">
          Use 4 spaces for indentation
        </Typography>
      </Box>
      <Box 
        ref={editorRef}
        sx={{ 
          border: '1px solid #e0e0e0', 
          m: 2, 
          mt: 1, 
          borderRadius: 1,
          minHeight: 200,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
