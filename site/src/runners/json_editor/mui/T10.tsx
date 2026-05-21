'use client';

/**
 * json_editor-mui-T10: Fix invalid JSON in a small drawer editor and set sampleRate
 *
 * Page shows a MUI settings card titled "Telemetry". It contains a button labeled "Edit advanced sampling (JSON)".
 * Clicking the button opens a MUI Drawer from the right. The drawer title is "Advanced sampling (JSON)".
 * Inside the drawer is a small-scale JSON editor (smaller font/controls than default) starting in Code mode.
 * When the JSON text is invalid, an error message is shown and the drawer's "Save" button is disabled.
 * Initial JSON text in the drawer is invalid (missing a closing brace):
 * {
 *   "sampleRate": 0.1,
 *   "mode": "adaptive"
 *
 * You must fix the syntax so the JSON becomes valid, and set sampleRate to 0.25.
 *
 * Success: The committed JSON value at path $.sampleRate is within ±0.0001 of 0.25 after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Drawer, Stack } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath, withinTolerance } from '../types';

const INVALID_INITIAL_TEXT = `{
  "sampleRate": 0.1,
  "mode": "adaptive"`;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [codeText, setCodeText] = useState(INVALID_INITIAL_TEXT);
  const [codeError, setCodeError] = useState<string | null>('Invalid JSON');
  const [committedValue, setCommittedValue] = useState<JsonValue | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedValue) {
      const sampleRate = getJsonPath(committedValue, '$.sampleRate');
      if (typeof sampleRate === 'number' && withinTolerance(sampleRate, 0.25, 0.0001)) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [committedValue, onSuccess]);

  const handleOpenDrawer = () => {
    setCodeText(INVALID_INITIAL_TEXT);
    setCodeError('Invalid JSON');
    setDrawerOpen(true);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(codeText);
      setCommittedValue(parsed);
      setDrawerOpen(false);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCodeText(text);
    try {
      JSON.parse(text);
      setCodeError(null);
    } catch {
      setCodeError('Invalid JSON');
    }
  };

  return (
    <>
      <Paper elevation={2} sx={{ width: 400, p: 2 }} data-testid="json-editor-card">
        <Typography variant="h6" gutterBottom>Telemetry</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure telemetry and sampling settings
        </Typography>
        <Button variant="outlined" onClick={handleOpenDrawer}>
          Edit advanced sampling (JSON)
        </Button>
        {committedValue && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Committed JSON:</Typography>
            <pre style={{ fontSize: 11, background: '#f5f5f5', padding: 8, borderRadius: 4, margin: '4px 0 0' }}>
              {JSON.stringify(committedValue, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>Advanced sampling (JSON)</Typography>

          <TextField
            multiline
            rows={8}
            fullWidth
            value={codeText}
            onChange={handleCodeChange}
            error={!!codeError}
            helperText={codeError}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { fontFamily: 'monospace', fontSize: 12 }
            }}
            data-testid="drawer-code-editor"
          />

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!!codeError}
            >
              Save
            </Button>
            <Button onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
