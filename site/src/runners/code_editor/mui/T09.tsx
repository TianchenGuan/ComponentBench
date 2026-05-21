'use client';

/**
 * code_editor-mui-T09: Change timeoutMs at line 250 (dark, scroll)
 *
 * MUI Paper card anchored toward the bottom-left of the viewport; page is in dark theme.
 * Composite Monaco editor with line numbers and a thin scrollbar.
 * Initial state: the editor contains a long JSON configuration file (~300 lines).
 * Around line 250 there is exactly one line containing `"timeoutMs": 1000,`.
 * There is no external search box; the intended interaction is to scroll within the editor
 * to the specified region and edit the number.
 * No Apply/Save button is present; changes are live.
 *
 * Success: The editor text contains the exact substring `"timeoutMs": 2500`.
 * The substring `"timeoutMs": 1000` no longer appears anywhere in the editor.
 * There is exactly one `timeoutMs` key in the file.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { generateLongJsonConfig } from '../types';

const INITIAL_CONTENT = generateLongJsonConfig(300, 250);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    
    const hasNew = content.includes('"timeoutMs": 2500');
    const hasOld = content.includes('"timeoutMs": 1000');
    const keyCount = (content.match(/"timeoutMs"\s*:/g) || []).length;
    
    if (hasNew && !hasOld && keyCount === 1) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: 600, 
          overflow: 'hidden',
          bgcolor: '#1e1e1e',
        }} 
        data-testid="code-editor-card"
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #333' }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Config</Typography>
        </Box>
        <Box sx={{ m: 2, border: '1px solid #444', borderRadius: 1 }}>
          <Editor
            height="400px"
            language="json"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              fontSize: 13,
              scrollbar: {
                verticalScrollbarSize: 8,
              },
            }}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
