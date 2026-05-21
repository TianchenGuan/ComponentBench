'use client';

/**
 * json_editor-mui-T05: Add version field inside a table cell editor
 *
 * Page uses a settings table layout (MUI Table) with two columns: "Setting" and "Value".
 * Most rows are simple text values (URL, Method) and are irrelevant.
 * One row is labeled "Webhook payload template (JSON)". Its Value cell contains a compact embedded JSON editor.
 * The JSON editor starts in Tree mode and is slightly narrower than the full page because it lives inside the table cell.
 * A "Save" button for this row is shown directly below the cell editor.
 * Initial JSON value in the cell editor:
 * {
 *   "event": "user.created",
 *   "data": {"id": "", "email": ""}
 * }
 * You must add a new top-level key version with numeric value 2.
 *
 * Success: The committed JSON value at path $.version equals 2 (number) after Save is clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableRow, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import type { TaskComponentProps, JsonValue } from '../types';
import { getJsonPath } from '../types';

const INITIAL_JSON = {
  event: 'user.created',
  data: { id: '', email: '' }
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [jsonValue, setJsonValue] = useState<JsonValue>(INITIAL_JSON);
  const [committedValue, setCommittedValue] = useState<JsonValue>(INITIAL_JSON);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(INITIAL_JSON, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const version = getJsonPath(committedValue, '$.version');
    if (version === 2) {
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

  const updateField = (key: string, value: JsonValue) => {
    setJsonValue({ ...(jsonValue as object), [key]: value });
  };

  const addField = (key: string, value: JsonValue) => {
    setJsonValue({ ...(jsonValue as object), [key]: value });
  };

  const obj = jsonValue as Record<string, JsonValue>;

  return (
    <Paper elevation={2} sx={{ width: 550, p: 2 }} data-testid="json-editor-card">
      <Typography variant="h6" gutterBottom>Webhook Settings</Typography>

      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, width: 150 }}>URL</TableCell>
              <TableCell>
                <TextField size="small" defaultValue="https://example.com/webhook" fullWidth disabled />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500 }}>Method</TableCell>
              <TableCell>
                <TextField size="small" defaultValue="POST" fullWidth disabled />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 500, verticalAlign: 'top', pt: 2 }}>
                Webhook payload template (JSON)
              </TableCell>
              <TableCell>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
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
                    sx={{ mb: 1 }}
                  >
                    <ToggleButton value="tree">Tree</ToggleButton>
                    <ToggleButton value="code">Code</ToggleButton>
                  </ToggleButtonGroup>

                  <Box sx={{ minHeight: 120, mb: 1 }}>
                    {mode === 'tree' ? (
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 70 }}>event:</Typography>
                          <TextField
                            size="small"
                            value={obj.event as string}
                            onChange={(e) => updateField('event', e.target.value)}
                            sx={{ width: 150 }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>data: {'{...}'}</Typography>
                        {'version' in obj && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', minWidth: 70 }}>version:</Typography>
                            <TextField
                              size="small"
                              type="number"
                              value={obj.version as number}
                              onChange={(e) => updateField('version', Number(e.target.value))}
                              sx={{ width: 100 }}
                            />
                          </Box>
                        )}
                        {!('version' in obj) && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addField('version', 0)}
                          >
                            + Add field
                          </Button>
                        )}
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
                        error={!!codeError}
                        helperText={codeError}
                        InputProps={{ sx: { fontFamily: 'monospace', fontSize: 12 } }}
                      />
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                    disabled={mode === 'code' && !!codeError}
                  >
                    Save
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
