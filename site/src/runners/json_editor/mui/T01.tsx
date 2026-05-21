'use client';

/**
 * json_editor-mui-T01: Disable logging.enabled and save
 *
 * Page shows a centered MUI Card (Paper) titled "Logging config (JSON)".
 * An embedded JSON editor is shown with a mode selector (MUI ToggleButtonGroup: "Tree" and "Code"). It starts in Tree mode.
 * Booleans can be edited inline via a true/false control.
 * A "Save" button is located under the editor; clicking Save commits the JSON.
 * Initial JSON value:
 * {
 *   "logging": {"enabled": true, "level": "info"},
 *   "service": "orders"
 * }
 *
 * Success: The committed JSON value at path $.logging.enabled equals false after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, ToggleButtonGroup, ToggleButton, Button, Switch, TextField, FormControlLabel, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  logging: { enabled: true, level: 'info' },
  service: 'orders'
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const enabled = getJsonPath(committedValue, '$.logging.enabled');
    if (enabled === false) {
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
    <Paper elevation={2} sx={{ width: 480, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Logging config (JSON)</Typography>

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
          <Box>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>logging</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={obj.logging.enabled}
                        onChange={(e) => updateJsonPath(['logging', 'enabled'], e.target.checked)}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>enabled</Typography>}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>level:</Typography>
                    <TextField
                      size="small"
                      value={obj.logging.level}
                      onChange={(e) => updateJsonPath(['logging', 'level'], e.target.value)}
                      sx={{ width: 120 }}
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, pl: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>service:</Typography>
              <TextField
                size="small"
                value={obj.service}
                onChange={(e) => updateJsonPath(['service'], e.target.value)}
                sx={{ width: 150 }}
              />
            </Box>
          </Box>
        ) : (
          <Box>
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
              sx={{ fontFamily: 'monospace' }}
              InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
            />
          </Box>
        )}
      </Box>

      <Button variant="contained" onClick={handleSave} disabled={mode === 'code' && !!codeError}>
        Save
      </Button>
    </Paper>
  );
}
