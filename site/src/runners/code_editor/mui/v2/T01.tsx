'use client';

/**
 * code_editor-mui-v2-T01: Diff editor — make editable pane match reference
 *
 * MUI Paper card with a Monaco DiffEditor labeled "Response mapping". The left pane is read-only
 * and shows the target code; the right pane is editable and starts as a near-match (returns
 * `{ statusOk: ... }` instead of `{ ok: ... }`). A "Save mapping" button commits the right pane.
 * Success: right pane exactly matches left pane, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { DiffEditor } from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const LEFT_CONTENT = `export function mapResponse(res) {
  return { ok: res.status === 200 };
}`;

const RIGHT_INITIAL = `export function mapResponse(res) {
  return { statusOk: res.status === 200 };
}`;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [rightContent, setRightContent] = useState(RIGHT_INITIAL);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!saved) return;
    if (contentMatches(rightContent, LEFT_CONTENT, {
      normalizeLineEndings: true,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [rightContent, saved, onSuccess]);

  const handleMount = useCallback((editor: any) => {
    const modified = editor.getModifiedEditor();
    modified.onDidChangeModelContent(() => {
      setRightContent(modified.getValue());
      setSaved(false);
    });
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  return (
    <Paper elevation={2} sx={{ width: 750, p: 3 }} data-testid="diff-editor-card">
      <Typography variant="h6" gutterBottom>Response mapping</Typography>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
        <DiffEditor
          height="350px"
          language="javascript"
          original={LEFT_CONTENT}
          modified={RIGHT_INITIAL}
          onMount={handleMount}
          options={{
            renderSideBySide: true,
            originalEditable: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </Box>
      <Button variant="contained" onClick={handleSave} data-testid="save-mapping">
        Save mapping
      </Button>
    </Paper>
  );
}
