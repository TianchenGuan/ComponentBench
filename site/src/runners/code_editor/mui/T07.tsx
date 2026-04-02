'use client';

/**
 * code_editor-mui-T07: Set tab size to 4 (compact)
 *
 * MUI Paper card in the center; spacing mode is compact (tighter padding and smaller gaps)
 * but controls are still readable.
 * Composite CodeMirror editor with a small settings row above it.
 * Settings row contains a labeled numeric stepper "Tab size" with minus/plus buttons and a value display.
 * Initial state: Tab size is 2. Editor content is a short indented snippet, but content is not checked.
 * Changing the Tab size updates the editor option immediately; no Apply button is required.
 *
 * Success: The editor option `tab_size` equals 4.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Box, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../types';

const INITIAL_CONTENT = `function example() {
  const x = 1;
  if (x) {
    return true;
  }
}`;

export default function T07({ onSuccess }: TaskComponentProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const tabSizeCompartment = useRef(new Compartment());
  const [tabSize, setTabSize] = useState(2);
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
        tabSizeCompartment.current.of(indentUnit.of('  ')), // Initial 2 spaces
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

  // Update tab size when changed
  useEffect(() => {
    if (!viewRef.current) return;
    
    const spaces = ' '.repeat(tabSize);
    viewRef.current.dispatch({
      effects: tabSizeCompartment.current.reconfigure(indentUnit.of(spaces)),
    });
  }, [tabSize]);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (tabSize === 4) {
      successFired.current = true;
      onSuccess();
    }
  }, [tabSize, onSuccess]);

  const handleIncrement = useCallback(() => {
    setTabSize((prev) => Math.min(prev + 1, 8));
  }, []);

  const handleDecrement = useCallback(() => {
    setTabSize((prev) => Math.max(prev - 1, 1));
  }, []);

  return (
    <Paper elevation={2} sx={{ width: 550, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1">Editor</Typography>
      </Box>
      <Box sx={{ px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>Tab size</Typography>
        <IconButton size="small" onClick={handleDecrement}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          value={tabSize}
          size="small"
          inputProps={{ 
            'aria-label': 'Tab size',
            readOnly: true,
            style: { textAlign: 'center', width: 30 } 
          }}
          sx={{ width: 60 }}
          data-testid="tab-size-input"
        />
        <IconButton size="small" onClick={handleIncrement}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box 
        ref={editorRef}
        sx={{ 
          border: '1px solid #e0e0e0', 
          m: 1.5, 
          mt: 0, 
          borderRadius: 1,
          minHeight: 180,
        }}
        data-testid="codemirror-editor"
      />
    </Paper>
  );
}
