'use client';

/**
 * json_editor-mui-T04: Replace JSON in Code mode (dark theme)
 *
 * Page uses a dark theme and shows a centered MUI Card titled "Deployment settings (JSON)".
 * The JSON editor has a ToggleButtonGroup to switch modes ("Tree" and "Code") and starts in Tree mode.
 * In Code mode, the editor shows raw JSON text with a validation error area. When JSON is invalid, Save is disabled.
 * A "Save" button below the editor commits the JSON.
 * Initial JSON value:
 * {
 *   "region": "us-east-2",
 *   "debug": true,
 *   "replicas": 2
 * }
 *
 * Success: The committed JSON document equals { "region": "eu-west-1", "debug": false } after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton, Button, TextField, Switch, FormControlLabel, Stack, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { jsonEquals } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const INITIAL_JSON = {
  region: 'us-east-2',
  debug: true,
  replicas: 2
};

const TARGET_JSON = {
  region: 'eu-west-1',
  debug: false
};

export default function T04({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (jsonEquals(committedValue, TARGET_JSON)) {
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, minHeight: 350 }}>
        <Paper elevation={2} sx={{ width: 480, p: 2 }} data-testid="json-editor-card">
          <Typography variant="h6" gutterBottom>Deployment settings (JSON)</Typography>

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

          <Box sx={{ minHeight: 180, mb: 2 }}>
            {mode === 'tree' ? (
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 80 }}>region:</Typography>
                  <TextField
                    size="small"
                    value={obj.region}
                    onChange={(e) => updateJsonPath(['region'], e.target.value)}
                    sx={{ width: 150 }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={obj.debug}
                      onChange={(e) => updateJsonPath(['debug'], e.target.checked)}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>debug</Typography>}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 80 }}>replicas:</Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={obj.replicas}
                    onChange={(e) => updateJsonPath(['replicas'], Number(e.target.value))}
                    sx={{ width: 100 }}
                  />
                </Box>
              </Stack>
            ) : (
              <TextField
                multiline
                rows={8}
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
      </Box>
    </ThemeProvider>
  );
}
