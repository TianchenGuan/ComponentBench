'use client';

/**
 * code_editor-mui-T05: Replace http with https
 *
 * MUI Paper card in the center with a Monaco-based code editor.
 * Toolbar includes buttons: Replace (icon with label), and Apply (contained button).
 * Initial state: the editor contains two lines with "http://".
 * Clicking Replace opens the in-editor replace widget (overlay) where you can enter find/replace text
 * and choose Replace All.
 * Apply commits the current content and flips a status label below the editor from "Unsaved" to "Saved".
 * No other editors are present; no modal dialogs.
 *
 * Success: All occurrences of "http://" are replaced with "https://" in the editor content.
 * Apply has been clicked (saved/committed state true).
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Box, Button, Toolbar } from '@mui/material';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = `const url = "http://example.com/api";
fetch("http://example.com/api/status");`;

const TARGET_CONTENT = `const url = "https://example.com/api";
fetch("https://example.com/api/status");`;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [saved, setSaved] = useState(false);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (saved && contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, saved, onSuccess]);

  const handleEditorMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstanceRef.current = editorInstance;
  }, []);

  const handleReplace = useCallback(() => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.getAction('editor.action.startFindReplaceAction')?.run();
    }
  }, []);

  const handleApply = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <Paper elevation={2} sx={{ width: 600, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Editor</Typography>
      </Box>
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1, gap: 1 }}>
        <Button 
          startIcon={<FindReplaceIcon />} 
          size="small" 
          onClick={handleReplace}
        >
          Replace
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleApply}
          data-testid="editor-apply"
        >
          Apply
        </Button>
      </Toolbar>
      <Box sx={{ border: '1px solid #e0e0e0', m: 2, mt: 0, borderRadius: 1 }}>
        <Editor
          height="200px"
          language="javascript"
          value={content}
          onChange={(value) => {
            setContent(value || '');
            setSaved(false);
          }}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="caption" color={saved ? 'success.main' : 'text.secondary'}>
          {saved ? 'Saved' : 'Unsaved'}
        </Typography>
      </Box>
    </Paper>
  );
}
