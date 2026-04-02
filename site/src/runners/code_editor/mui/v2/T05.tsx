'use client';

/**
 * code_editor-mui-v2-T05: After-hook row exact script and row save
 *
 * Two expanded table-style rows: "Before hook" (distractor) and "After hook" (target). Each row
 * contains a CodeMirror editor, a status pill, and a row-local Save button. The After hook editor
 * starts with `// pending`. Replace with the exact target function.
 * Success: After hook matches target, Before unchanged, After saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Button, Box, Chip } from '@mui/material';
import { EditorView, basicSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { indentUnit } from '@codemirror/language';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const BEFORE_CONTENT = `export async function beforeHook() {
  return "ok";
}`;

const AFTER_INITIAL = '// pending';

const AFTER_TARGET = `export async function afterHook() {
  return "done";
}`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const beforeViewRef = useRef<EditorView | null>(null);
  const afterViewRef = useRef<EditorView | null>(null);

  const [beforeContent, setBeforeContent] = useState(BEFORE_CONTENT);
  const [afterContent, setAfterContent] = useState(AFTER_INITIAL);
  const [afterSaved, setAfterSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!beforeRef.current || beforeViewRef.current) return;
    const state = EditorState.create({
      doc: BEFORE_CONTENT,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) setBeforeContent(update.state.doc.toString());
        }),
      ],
    });
    beforeViewRef.current = new EditorView({ state, parent: beforeRef.current });
    return () => { beforeViewRef.current?.destroy(); beforeViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (!afterRef.current || afterViewRef.current) return;
    const state = EditorState.create({
      doc: AFTER_INITIAL,
      extensions: [
        basicSetup,
        javascript(),
        indentUnit.of('  '),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setAfterContent(update.state.doc.toString());
            setAfterSaved(false);
          }
        }),
      ],
    });
    afterViewRef.current = new EditorView({ state, parent: afterRef.current });
    return () => { afterViewRef.current?.destroy(); afterViewRef.current = null; };
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (!afterSaved) return;
    if (
      contentMatches(afterContent, AFTER_TARGET, {
        normalizeLineEndings: true,
        ignoreTrailingWhitespace: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(beforeContent, BEFORE_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [afterContent, beforeContent, afterSaved, onSuccess]);

  const handleSaveAfter = useCallback(() => {
    setAfterSaved(true);
  }, []);

  const rowSx = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    p: 2,
    borderBottom: '1px solid #e0e0e0',
  };

  return (
    <Paper elevation={1} sx={{ width: 700 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
        <Typography variant="subtitle2">Lifecycle hooks</Typography>
      </Box>

      <Box sx={rowSx} data-testid="row-before-hook">
        <Typography variant="body2" sx={{ width: 100, pt: 0.5, fontWeight: 600 }}>Before hook</Typography>
        <Box sx={{ flex: 1 }}>
          <div ref={beforeRef} style={{ border: '1px solid #e0e0e0', borderRadius: 4, minHeight: 80 }} />
        </Box>
        <Chip label="active" size="small" color="success" />
        <Button size="small" data-testid="save-before-hook">Save</Button>
      </Box>

      <Box sx={{ ...rowSx, borderBottom: 'none' }} data-testid="row-after-hook">
        <Typography variant="body2" sx={{ width: 100, pt: 0.5, fontWeight: 600 }}>After hook</Typography>
        <Box sx={{ flex: 1 }}>
          <div ref={afterRef} style={{ border: '1px solid #e0e0e0', borderRadius: 4, minHeight: 80 }} />
        </Box>
        <Chip label="pending" size="small" color="warning" />
        <Button size="small" variant="contained" onClick={handleSaveAfter} data-testid="save-after-hook">Save</Button>
      </Box>
    </Paper>
  );
}
