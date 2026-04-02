'use client';

/**
 * code_editor-mui-T01: Add import at top
 *
 * Material UI (MUI) Paper card is centered with a header "Editor".
 * A composite code editor is embedded: MUI Toolbar (icon buttons for Copy and Clear) and a Monaco Editor region below.
 * Initial state: the editor contains a 3-line JavaScript function:
 * function greet(name) { ... }
 * Cursor starts at the beginning of the file.
 * There is only one editor instance and no dialogs. Theme is light and spacing is comfortable.
 *
 * Success: The editor content matches the expected code with the import line added at the top
 * (optional trailing newline allowed).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Toolbar, IconButton, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const INITIAL_CONTENT = `function greet(name) {
  return 'hi ' + name;
}`;

const TARGET_CONTENT = `import React from 'react';
function greet(name) {
  return 'hi ' + name;
}`;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (contentMatches(content, TARGET_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 600, overflow: 'hidden' }} data-testid="code-editor-card">
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Editor</Typography>
      </Box>
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1 }}>
        <IconButton size="small">
          <ContentCopyIcon fontSize="small" />
        </IconButton>
        <IconButton size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Toolbar>
      <Box sx={{ border: '1px solid #e0e0e0', m: 2, mt: 0, borderRadius: 1 }}>
        <Editor
          height="250px"
          language="javascript"
          value={content}
          onChange={(value) => setContent(value || '')}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
          }}
        />
      </Box>
    </Paper>
  );
}
