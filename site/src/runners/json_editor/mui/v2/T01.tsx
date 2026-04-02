'use client';

/**
 * json_editor-mui-v2-T01: Raw JSON repair in modal and apply
 *
 * Settings card with "Edit raw JSON…" button. Opens MUI Dialog with code-mode
 * JSON editor. Editor starts with INVALID JSON (trailing comma).
 * Fix it to {"mode":"safe","threshold":0.8}, then click Apply.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Alert,
} from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../../types';
import { jsonEquals } from '../../types';

const INVALID_INITIAL = `{
  "mode": "safe",
  "threshold": 0.8,
}`;

const TARGET_JSON: JsonValue = { mode: 'safe', threshold: 0.8 };

export default function T01({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [codeText, setCodeText] = useState(INVALID_INITIAL);
  const [codeError, setCodeError] = useState<string | null>('Invalid JSON');
  const successFired = useRef(false);

  const handleOpen = () => {
    setCodeText(INVALID_INITIAL);
    setCodeError('Invalid JSON');
    setDialogOpen(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeText(e.target.value);
    try {
      JSON.parse(e.target.value);
      setCodeError(null);
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  const handleApply = () => {
    if (codeError) return;
    try {
      const parsed = JSON.parse(codeText);
      setDialogOpen(false);
      if (!successFired.current && jsonEquals(parsed, TARGET_JSON)) {
        successFired.current = true;
        onSuccess();
      }
    } catch { /* guard */ }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Configure raw JSON parameters for the runtime.
        </Typography>
        <Button variant="outlined" onClick={handleOpen}>Edit raw JSON…</Button>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Raw JSON editor</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={8}
            fullWidth
            value={codeText}
            onChange={handleCodeChange}
            error={!!codeError}
            helperText={codeError}
            sx={{ mt: 1, fontFamily: 'monospace' }}
            InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
          />
          {codeError && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Fix the JSON syntax errors before applying.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} disabled={!!codeError}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
