'use client';

/**
 * code_editor-mui-v2-T04: Two similar editors exact response mapping
 *
 * MUI settings panel with two Monaco editors: "Request body" (distractor) and "Response mapping"
 * (target). Each has its own Save button and Reference box. The Response mapping editor starts as
 * a near-match returning `{ ok: res.ok }` instead of `{ ok: res.status === 200 }`.
 * Success: Response matches reference, Request unchanged, saved.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Paper, Typography, Button, Box, Card, CardContent, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../../types';
import { contentMatches } from '../../types';

const REQUEST_CONTENT = '{"status":"ok"}';

const RESPONSE_INITIAL = `export function mapResponse(res) {
  return { ok: res.ok };
}`;

const RESPONSE_TARGET = `export function mapResponse(res) {
  return { ok: res.status === 200 };
}`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [requestContent, setRequestContent] = useState(REQUEST_CONTENT);
  const [responseContent, setResponseContent] = useState(RESPONSE_INITIAL);
  const [responseSaved, setResponseSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (!responseSaved) return;
    if (
      contentMatches(responseContent, RESPONSE_TARGET, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      }) &&
      contentMatches(requestContent, REQUEST_CONTENT, {
        normalizeLineEndings: true,
        allowTrailingNewline: true,
      })
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [responseContent, requestContent, responseSaved, onSuccess]);

  const handleSaveResponse = useCallback(() => {
    setResponseSaved(true);
  }, []);

  return (
    <Paper elevation={1} sx={{ width: 700, p: 3 }}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Stack spacing={3}>
        <Box data-testid="editor-request-body">
          <Typography variant="subtitle2" gutterBottom>Request body</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Editor
                height="120px"
                language="json"
                value={requestContent}
                onChange={(v) => setRequestContent(v || '')}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </Box>
            <Card variant="outlined" sx={{ flex: 1, bgcolor: '#fafafa' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Reference</Typography>
                <pre style={{ fontSize: 11, margin: '4px 0 0' }}>{REQUEST_CONTENT}</pre>
              </CardContent>
            </Card>
          </Box>
          <Button size="small" sx={{ mt: 1 }} data-testid="save-request-body">Save request body</Button>
        </Box>

        <Box data-testid="editor-response-mapping">
          <Typography variant="subtitle2" gutterBottom>Response mapping</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Editor
                height="150px"
                language="javascript"
                value={responseContent}
                onChange={(v) => {
                  setResponseContent(v || '');
                  setResponseSaved(false);
                }}
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                }}
              />
            </Box>
            <Card variant="outlined" sx={{ flex: 1, bgcolor: '#fafafa' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Reference</Typography>
                <pre style={{ fontSize: 11, margin: '4px 0 0' }}>{RESPONSE_TARGET}</pre>
              </CardContent>
            </Card>
          </Box>
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleSaveResponse}
            data-testid="save-response-mapping"
          >
            Save response mapping
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
