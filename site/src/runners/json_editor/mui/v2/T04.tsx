'use client';

/**
 * json_editor-mui-v2-T04: Drawer code-mode replacement with dark theme
 *
 * MUI Drawer opens from right with a JSON editor (Tree/Code toggle).
 * Starts in Tree mode. Switch to Code mode and replace JSON with
 * {"region":"eu-west-1","debug":false}. Click Save. Drawer closes.
 * Initial: {"region":"us-east-2","debug":true,"replicas":2}
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Typography, Button, Drawer, Box, TextField, ToggleButtonGroup,
  ToggleButton, Stack, Switch, FormControlLabel, ThemeProvider, createTheme,
  CssBaseline,
} from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../../types';
import { jsonEquals } from '../../types';

const INITIAL_JSON: JsonValue = { region: 'us-east-2', debug: true, replicas: 2 };
const TARGET_JSON: JsonValue = { region: 'eu-west-1', debug: false };

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

  const handleOpenDrawer = () => {
    setJson(INITIAL_JSON);
    setMode('tree');
    setCodeText(JSON.stringify(INITIAL_JSON, null, 2));
    setCodeError(null);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    let finalJson: JsonValue;
    if (mode === 'code') {
      try {
        finalJson = JSON.parse(codeText);
        setJson(finalJson);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      finalJson = json;
    }
    setDrawerOpen(false);
    if (!successFired.current && jsonEquals(finalJson, TARGET_JSON)) {
      successFired.current = true;
      onSuccess();
    }
  };

  const obj = json as Record<string, JsonValue>;

  const updateField = (key: string, value: JsonValue) => {
    setJson({ ...obj, [key]: value });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Paper elevation={2} sx={{ width: 400, p: 3 }}>
          <Typography variant="h6" gutterBottom>Deployment settings</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Edit the deployment JSON configuration.
          </Typography>
          <Button variant="outlined" onClick={handleOpenDrawer}>Edit deployment settings</Button>
        </Paper>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 420, p: 2 } }}>
          <Typography variant="h6" gutterBottom>Deployment settings (JSON)</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => {
              if (!v) return;
              if (v === 'code') setCodeText(JSON.stringify(json, null, 2));
              else { try { setJson(JSON.parse(codeText)); } catch {} }
              setMode(v);
            }}
            size="small"
            sx={{ mb: 2 }}
          >
            <ToggleButton value="tree">Tree</ToggleButton>
            <ToggleButton value="code">Code</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ flex: 1, mb: 2 }}>
            {mode === 'tree' ? (
              <Stack spacing={1.5}>
                {Object.entries(obj).map(([k, v]) => {
                  if (typeof v === 'boolean') {
                    return (
                      <FormControlLabel
                        key={k}
                        control={<Switch checked={v} onChange={(e) => updateField(k, e.target.checked)} size="small" />}
                        label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}</Typography>}
                      />
                    );
                  }
                  if (typeof v === 'number') {
                    return (
                      <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
                        <TextField size="small" type="number" value={v} onChange={(e) => updateField(k, Number(e.target.value))} sx={{ width: 100 }} />
                      </Box>
                    );
                  }
                  return (
                    <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
                      <TextField size="small" value={String(v)} onChange={(e) => updateField(k, e.target.value)} sx={{ width: 180 }} />
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <Box>
                <TextField
                  multiline rows={10} fullWidth value={codeText}
                  onChange={(e) => { setCodeText(e.target.value); try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); } }}
                  error={!!codeError} helperText={codeError}
                  InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
