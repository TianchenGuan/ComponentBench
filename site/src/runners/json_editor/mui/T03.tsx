'use client';

/**
 * json_editor-mui-T03: Edit env string with live commit
 *
 * Page shows a centered MUI Card titled "Environment (JSON)".
 * The JSON editor starts in Tree mode.
 * String values are edited inline (click the string value to open a small text field).
 * This page uses live commit: once you confirm an inline edit (Enter or blur), the new JSON is immediately committed
 * and a small MUI Snackbar briefly appears saying "Saved". There is NO separate Save button.
 * Initial JSON value:
 * {
 *   "env": "dev",
 *   "region": "us-central-1"
 * }
 *
 * Success: The committed JSON value at path $.env equals "staging" (no explicit confirmation required, live state).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton, TextField, Snackbar, Stack } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  env: 'dev',
  region: 'us-central-1'
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const successFired = useRef(false);

  // Live commit - check success on any value change
  useEffect(() => {
    if (successFired.current) return;
    const env = getJsonPath(jsonValue, '$.env');
    if (env === 'staging') {
      successFired.current = true;
      onSuccess();
    }
  }, [jsonValue, onSuccess]);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(jsonValue, null, 2));
      setCodeError(null);
    }
  }, [jsonValue, mode]);

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
    setSnackbarOpen(true); // Live commit feedback
  };

  const handleCodeBlur = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJsonValue(parsed);
        setCodeError(null);
        setSnackbarOpen(true);
      } catch {
        setCodeError('Invalid JSON');
      }
    }
  };

  const obj = jsonValue as typeof INITIAL_JSON;

  return (
    <Paper elevation={2} sx={{ width: 420, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Environment (JSON)</Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_, newMode) => {
          if (newMode) {
            if (newMode === 'code') {
              setCodeText(JSON.stringify(jsonValue, null, 2));
            } else {
              try {
                setJsonValue(JSON.parse(codeText));
              } catch {
                // Keep current
              }
            }
            setMode(newMode);
          }
        }}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="tree">Tree</ToggleButton>
        <ToggleButton value="code">Code</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ minHeight: 120, mb: 2 }}>
        {mode === 'tree' ? (
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 70 }}>env:</Typography>
              <TextField
                size="small"
                value={obj.env}
                onChange={(e) => updateJsonPath(['env'], e.target.value)}
                sx={{ width: 150 }}
                data-testid="input-env"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 70 }}>region:</Typography>
              <TextField
                size="small"
                value={obj.region}
                onChange={(e) => updateJsonPath(['region'], e.target.value)}
                sx={{ width: 150 }}
              />
            </Box>
          </Stack>
        ) : (
          <TextField
            multiline
            rows={5}
            fullWidth
            value={codeText}
            onChange={(e) => {
              setCodeText(e.target.value);
              try {
                JSON.parse(e.target.value);
                setCodeError(null);
              } catch {
                setCodeError('Invalid JSON');
              }
            }}
            onBlur={handleCodeBlur}
            error={!!codeError}
            helperText={codeError}
            InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
          />
        )}
      </Box>

      <Typography variant="caption" color="text.secondary">
        Changes are saved automatically
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        message="Saved"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
}
