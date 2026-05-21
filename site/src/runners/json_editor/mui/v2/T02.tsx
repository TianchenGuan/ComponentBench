'use client';

/**
 * json_editor-mui-v2-T02: Webhook payload row — add top-level version and save row
 *
 * Table with two expanded rows: "Webhook payload template" and "Response template".
 * Each row has a JSON tree editor and row-local Save button.
 * Add `version: 2` at the top level of the Webhook row and click its Save.
 * Response template must remain unchanged.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, TextField, Stack, Switch, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const WEBHOOK_JSON: JsonValue = { data: { kind: 'deploy' } };
const RESPONSE_JSON: JsonValue = { status: 'ok' };

function updateAtPath(obj: JsonValue, path: string[], value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return clone;
}

function TreeEditor({
  value,
  onChange,
  path,
}: {
  value: JsonValue;
  onChange: (v: JsonValue) => void;
  path: string[];
}) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return (
    <Stack spacing={0.5}>
      {Object.entries(value).map(([k, v]) => {
        const p = [...path, k];
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return (
            <Accordion key={k} defaultExpanded disableGutters elevation={0} sx={{ '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32, px: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pl: 2 }}>
                <TreeEditor value={v} onChange={onChange} path={p} />
              </AccordionDetails>
            </Accordion>
          );
        }
        if (typeof v === 'boolean') {
          return (
            <FormControlLabel
              key={k}
              control={<Switch size="small" checked={v} onChange={(e) => onChange(updateAtPath(value, [k], e.target.checked))} />}
              label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}</Typography>}
            />
          );
        }
        if (typeof v === 'number') {
          return (
            <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
              <TextField
                size="small"
                type="number"
                value={v}
                onChange={(e) => onChange(updateAtPath(value, [k], Number(e.target.value)))}
                sx={{ width: 100 }}
              />
            </Box>
          );
        }
        return (
          <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
            <TextField
              size="small"
              value={String(v)}
              onChange={(e) => onChange(updateAtPath(value, [k], e.target.value))}
              sx={{ width: 150 }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}

function RowEditor({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (v: JsonValue) => void;
}) {
  const [json, setJson] = useState<JsonValue>(initialJson);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

  const handleAddField = () => {
    if (!newKey) return;
    let parsedVal: JsonValue;
    try { parsedVal = JSON.parse(newVal); } catch { parsedVal = newVal; }
    const obj = json as Record<string, JsonValue>;
    setJson({ ...obj, [newKey]: parsedVal });
    setNewKey('');
    setNewVal('');
  };

  const handleSave = () => {
    if (mode === 'code') {
      try {
        const parsed = JSON.parse(codeText);
        setJson(parsed);
        onCommit(parsed);
        setCodeError(null);
      } catch {
        setCodeError('Invalid JSON');
        return;
      }
    } else {
      onCommit(json);
    }
  };

  return (
    <TableRow>
      <TableCell sx={{ verticalAlign: 'top', fontWeight: 600, width: 200 }}>{label}</TableCell>
      <TableCell>
        <Box sx={{ mb: 1 }}>
          <Button size="small" variant={mode === 'tree' ? 'contained' : 'text'} onClick={() => { setMode('tree'); try { setJson(JSON.parse(codeText)); } catch {} }} sx={{ mr: 0.5 }}>Tree</Button>
          <Button size="small" variant={mode === 'code' ? 'contained' : 'text'} onClick={() => { setMode('code'); setCodeText(JSON.stringify(json, null, 2)); }}>Code</Button>
        </Box>
        {mode === 'tree' ? (
          <>
            <TreeEditor value={json} onChange={setJson} path={[]} />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
              <TextField size="small" placeholder="key" value={newKey} onChange={(e) => setNewKey(e.target.value)} sx={{ width: 100 }} />
              <TextField size="small" placeholder="value" value={newVal} onChange={(e) => setNewVal(e.target.value)} sx={{ width: 100 }} />
              <Button size="small" onClick={handleAddField}>Add</Button>
            </Stack>
          </>
        ) : (
          <Box>
            <TextField
              multiline rows={6} fullWidth value={codeText}
              onChange={(e) => { setCodeText(e.target.value); try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); } }}
              error={!!codeError} helperText={codeError}
              sx={{ fontFamily: 'monospace' }} InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
            />
          </Box>
        )}
        <Box sx={{ mt: 1 }}>
          <Button variant="contained" size="small" onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [webhookCommitted, setWebhookCommitted] = useState<JsonValue>(WEBHOOK_JSON);
  const [responseCommitted, setResponseCommitted] = useState<JsonValue>(RESPONSE_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const version = getJsonPath(webhookCommitted, '$.version');
    const responseUnchanged = jsonEquals(responseCommitted, RESPONSE_JSON);
    if (version === 2 && responseUnchanged) {
      successFired.current = true;
      onSuccess();
    }
  }, [webhookCommitted, responseCommitted, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Template</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">JSON Editor</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <RowEditor label="Webhook payload template" initialJson={WEBHOOK_JSON} onCommit={setWebhookCommitted} />
            <RowEditor label="Response template" initialJson={RESPONSE_JSON} onCommit={setResponseCommitted} />
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
