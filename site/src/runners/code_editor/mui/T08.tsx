'use client';

/**
 * code_editor-mui-T08: Match reference in correct editor (2 instances)
 *
 * Form section layout titled "API settings" with several standard MUI inputs (Endpoint URL, Method, Timeout) as distractors.
 * Below the inputs are two code editor cards (same canonical_type) arranged vertically:
 *   • "Request body" (JSON)
 *   • "Response mapping" (JavaScript)
 * Each editor card has its own toolbar with a Save button.
 * In the Response mapping card, a small read-only "Reference" box is shown directly above the editor
 * with the target snippet.
 * Initial state: both editors contain placeholder comments.
 * Save commits only that card's editor and shows "Saved" under the editor.
 *
 * Success: The Response mapping editor content exactly matches its Reference snippet.
 * The Response mapping editor has been saved via its Save button.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Paper, Typography, Box, Button, TextField, FormControl, 
  InputLabel, Select, MenuItem, Divider 
} from '@mui/material';
import Editor from '@monaco-editor/react';
import type { TaskComponentProps } from '../types';
import { contentMatches } from '../types';

const REQUEST_PLACEHOLDER = '// Request body JSON';
const RESPONSE_PLACEHOLDER = '// Response mapping';

const REFERENCE_CONTENT = `export function mapResponse(res) {
  return { ok: res.status === 200 };
}`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [requestContent, setRequestContent] = useState(REQUEST_PLACEHOLDER);
  const [responseContent, setResponseContent] = useState(RESPONSE_PLACEHOLDER);
  const [responseSaved, setResponseSaved] = useState(false);
  const successFired = useRef(false);

  // Check for success
  useEffect(() => {
    if (successFired.current) return;
    if (responseSaved && contentMatches(responseContent, REFERENCE_CONTENT, {
      normalizeLineEndings: true,
      ignoreTrailingWhitespace: false,
      allowTrailingNewline: true,
    })) {
      successFired.current = true;
      onSuccess();
    }
  }, [responseContent, responseSaved, onSuccess]);

  const handleResponseSave = useCallback(() => {
    setResponseSaved(true);
  }, []);

  return (
    <Box sx={{ width: 600 }}>
      {/* Form Section - Distractors */}
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>API settings</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Endpoint URL" size="small" placeholder="https://api.example.com" />
          <FormControl size="small">
            <InputLabel>Method</InputLabel>
            <Select label="Method" defaultValue="GET">
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Timeout (ms)" size="small" type="number" defaultValue={5000} />
        </Box>
      </Paper>

      {/* Request body Editor - Distractor */}
      <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }} data-testid="editor-request">
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">Request body</Typography>
          <Button size="small" data-testid="save-request">Save</Button>
        </Box>
        <Box sx={{ m: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Editor
            height="100px"
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
      </Paper>

      {/* Response mapping Editor - Target */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }} data-testid="editor-response">
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">Response mapping</Typography>
          <Button size="small" onClick={handleResponseSave} data-testid="save-response-mapping">
            Save
          </Button>
        </Box>
        
        {/* Reference Box */}
        <Box sx={{ mx: 2, mt: 1.5, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }} data-testid="ref-mui-08">
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Reference
          </Typography>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {REFERENCE_CONTENT}
          </pre>
        </Box>

        <Box sx={{ m: 1.5, mt: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Editor
            height="120px"
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
        {responseSaved && (
          <Typography variant="caption" color="success.main" sx={{ px: 2, pb: 1, display: 'block' }}>
            Saved
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
