'use client';

/**
 * code_editor-mui-v2-T03: Dark nested-scroll long-file timeout edit
 *
 * Dark theme nested scroll layout: left scrollable panel with a Monaco editor showing ~300 lines
 * of JSON configuration, right panel with build metrics. The `"timeoutMs": 1000` setting is
 * around line 250. No save button — changes are live.
 * Success: content contains `"timeoutMs": 2500`, no `"timeoutMs": 1000`.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Paper, Box, Typography, Card, CardContent } from '@mui/material';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { generateLongJsonConfig, normalizeContent } from '../../types';

const INITIAL_CONTENT = generateLongJsonConfig(300, 250);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const normalized = normalizeContent(content, { normalizeLineEndings: true });
    if (normalized.includes('"timeoutMs": 2500') && !normalized.includes('"timeoutMs": 1000')) {
      successFired.current = true;
      onSuccess();
    }
  }, [content, onSuccess]);

  return (
    <Box sx={{
      display: 'flex', gap: 2, height: '100vh',
      bgcolor: '#1e1e1e', color: '#d4d4d4', overflow: 'auto', p: 2,
    }}>
      <Box sx={{ flex: 2, overflow: 'auto' }}>
        <Paper elevation={2} sx={{ bgcolor: '#252526', color: '#d4d4d4', p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, color: '#cccccc' }}>
            Configuration editor
          </Typography>
          <Box sx={{ border: '1px solid #3c3c3c', borderRadius: 1 }}>
            <Editor
              height="500px"
              language="json"
              value={content}
              onChange={(v) => setContent(v || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 13,
              }}
            />
          </Box>
        </Paper>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Card sx={{ bgcolor: '#252526', color: '#d4d4d4', mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>Build metrics</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Duration: 4.2s</Typography>
            <Typography variant="body2">Bundle size: 234KB</Typography>
          </CardContent>
        </Card>
        <Card sx={{ bgcolor: '#252526', color: '#d4d4d4' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ color: '#cccccc' }}>Deployments</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#888' }}>No recent deployments</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
