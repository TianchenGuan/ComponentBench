'use client';

/**
 * json_editor-mui-T02: Set timeoutMs to 5000
 *
 * Page shows a centered MUI Card titled "Timeout config (JSON)".
 * A single JSON editor instance starts in Tree mode.
 * Numeric values are edited inline (click the number to open a small numeric text field).
 * A "Save" button below the editor commits the JSON.
 * Initial JSON value:
 * {
 *   "timeoutMs": 2000,
 *   "connectMs": 500,
 *   "retries": 2
 * }
 *
 * Success: The committed JSON value at path $.timeoutMs equals 5000 after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton, Button, TextField, Stack } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  timeoutMs: 2000,
  connectMs: 500,
  retries: 2
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const timeoutMs = getJsonPath(committedValue, '$.timeoutMs');
    if (timeoutMs === 5000) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(jsonValue, null, 2));
      setCodeError(null);
    }
  }, [jsonValue, mode]);

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJsonValue(parsed);
        setCommittedValue(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      setCommittedValue(jsonValue);
    }
  };

  const updateJsonPath = (path: string[], value: JsonValue) => {
    const newJson = JSON.parse(JSON.stringify(jsonValue));
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJsonValue(newJson);
  };

  const obj = jsonValue as typeof INITIAL_JSON;

  return (
    <Paper elevation={2} sx={{ width: 450, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Timeout config (JSON)</Typography>

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

      <Box sx={{ minHeight: 150, mb: 2 }}>
        {mode === 'tree' ? (
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 100 }}>timeoutMs:</Typography>
              <TextField
                size="small"
                type="number"
                value={obj.timeoutMs}
                onChange={(e) => updateJsonPath(['timeoutMs'], Number(e.target.value))}
                sx={{ width: 120 }}
                data-testid="input-timeoutMs"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 100 }}>connectMs:</Typography>
              <TextField
                size="small"
                type="number"
                value={obj.connectMs}
                onChange={(e) => updateJsonPath(['connectMs'], Number(e.target.value))}
                sx={{ width: 120 }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 100 }}>retries:</Typography>
              <TextField
                size="small"
                type="number"
                value={obj.retries}
                onChange={(e) => updateJsonPath(['retries'], Number(e.target.value))}
                sx={{ width: 120 }}
              />
            </Box>
          </Stack>
        ) : (
          <TextField
            multiline
            rows={6}
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
            error={!!codeError}
            helperText={codeError}
            InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
          />
        )}
      </Box>

      <Button variant="contained" onClick={handleSave} disabled={mode === 'code' && !!codeError}>
        Save
      </Button>
    </Paper>
  );
}
