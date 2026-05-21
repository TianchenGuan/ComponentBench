'use client';

/**
 * code_editor-mui-T02: Clear editor
 *
 * MUI Paper card centered titled "Scratchpad".
 * Composite CodeMirror 6 editor with a compact toolbar: a single trash icon button labeled "Clear".
 * Initial state: editor contains two lines:
 * let a = 1;
 * let b = 2;
 * Pressing Clear immediately sets the editor content to an empty string. There is no confirmation dialog.
 * No other editor instances or form elements are present.
 *
 * Success: Editor content is exactly empty (length 0).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Toolbar, IconButton, Box, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `let a = 1;
let b = 2;`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const state = EditorState.create({
      doc: INITIAL_CONTENT,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
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

  // Check for success - content must be exactly empty
  useEffect(() => {
    if (successFired.current) return;
    if (content === '') {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  const handleClear = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: '',
      },
    });
  }, []);

  return (
    <Paper elevation={2} sx={{ width: 550, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Scratchpad</Typography>
      </Box>
      <Toolbar variant="dense" sx={{ minHeight: 40, px: 1 }}>
        <Tooltip title="Clear">
          <IconButton size="small" onClick={handleClear} data-testid="editor-clear">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <Box 
        ref={editorRef}
        sx={{ 
          border: '1px solid #e0e0e0', 
          m: 2, 
          mt: 0, 
          borderRadius: 1,
          minHeight: 180,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
