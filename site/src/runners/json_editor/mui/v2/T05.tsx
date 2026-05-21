'use client';

/**
 * json_editor-mui-v2-T05: Three editors — update Backend rollout only
 *
 * Dashboard with three JSON editor cards in a column: "Frontend rollout (JSON)",
 * "Backend rollout (JSON)", and "Notifications (JSON)". Each has its own Save.
 * Set Backend rollout's `rollout.percentage` to 25 and click its Save.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Paper, Typography, Button, Box, TextField, Stack, Switch,
  FormControlLabel, Accordion, AccordionSummary, AccordionDetails,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const FRONTEND_JSON: JsonValue = { rollout: { percentage: 50, paused: false } };
const BACKEND_JSON: JsonValue = { rollout: { percentage: 10, paused: false } };
const NOTIF_JSON: JsonValue = { email: true };

function updateAtPath(obj: JsonValue, path: string[], value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return clone;
}

function TreeView({ obj, path, onUpdate }: { obj: JsonValue; path: string[]; onUpdate: (v: JsonValue) => void }) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null;
  return (
    <Stack spacing={0.5}>
      {Object.entries(obj).map(([k, v]) => {
        const p = [...path, k];
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return (
            <Accordion key={k} defaultExpanded disableGutters elevation={0} sx={{ '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pl: 2 }}>
                <TreeView obj={v} path={p} onUpdate={(newV) => onUpdate(updateAtPath(obj, [k], newV))} />
              </AccordionDetails>
            </Accordion>
          );
        }
        if (typeof v === 'boolean') {
          return (
            <FormControlLabel
              key={k}
              control={<Switch size="small" checked={v} onChange={(e) => onUpdate(updateAtPath(obj, [k], e.target.checked))} />}
              label={<Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}</Typography>}
            />
          );
        }
        if (typeof v === 'number') {
          return (
            <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
              <TextField size="small" type="number" value={v} onChange={(e) => onUpdate(updateAtPath(obj, [k], Number(e.target.value)))} sx={{ width: 100 }} />
            </Box>
          );
        }
        return (
          <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{k}:</Typography>
            <TextField size="small" value={String(v)} onChange={(e) => onUpdate(updateAtPath(obj, [k], e.target.value))} sx={{ width: 150 }} />
          </Box>
        );
      })}
    </Stack>
  );
}

function EditorCard({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (v: JsonValue) => void;
}) {
  const [json, setJson] = useState<JsonValue>(initialJson);
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

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
    <Paper elevation={2} sx={{ p: 2, mb: 2, width: 480 }}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      <ToggleButtonGroup
        value={mode} exclusive size="small" sx={{ mb: 1 }}
        onChange={(_, v) => {
          if (!v) return;
          if (v === 'code') setCodeText(JSON.stringify(json, null, 2));
          else { try { setJson(JSON.parse(codeText)); } catch {} }
          setMode(v);
        }}
      >
        <ToggleButton value="tree">Tree</ToggleButton>
        <ToggleButton value="code">Code</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ minHeight: 80, mb: 1 }}>
        {mode === 'tree' ? (
          <TreeView obj={json} path={[]} onUpdate={setJson} />
        ) : (
          <TextField
            multiline rows={6} fullWidth value={codeText}
            onChange={(e) => { setCodeText(e.target.value); try { JSON.parse(e.target.value); setCodeError(null); } catch { setCodeError('Invalid JSON'); } }}
            error={!!codeError} helperText={codeError}
            InputProps={{ sx: { fontFamily: 'monospace', fontSize: 13 } }}
          />
        )}
      </Box>
      <Button variant="contained" size="small" onClick={handleSave} disabled={mode === 'code' && !!codeError}>Save</Button>
    </Paper>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [frontendCommitted, setFrontendCommitted] = useState<JsonValue>(FRONTEND_JSON);
  const [backendCommitted, setBackendCommitted] = useState<JsonValue>(BACKEND_JSON);
  const [notifCommitted, setNotifCommitted] = useState<JsonValue>(NOTIF_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const pct = getJsonPath(backendCommitted, '$.rollout.percentage');
    const frontendOk = jsonEquals(frontendCommitted, FRONTEND_JSON);
    const notifOk = jsonEquals(notifCommitted, NOTIF_JSON);
    if (pct === 25 && frontendOk && notifOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [backendCommitted, frontendCommitted, notifCommitted, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Rollout dashboard</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{ p: 1, px: 2 }}><Typography variant="caption">Active deploys: 3</Typography></Paper>
        <Paper sx={{ p: 1, px: 2 }}><Typography variant="caption">Health: OK</Typography></Paper>
      </Box>
      <EditorCard label="Frontend rollout (JSON)" initialJson={FRONTEND_JSON} onCommit={setFrontendCommitted} />
      <EditorCard label="Backend rollout (JSON)" initialJson={BACKEND_JSON} onCommit={setBackendCommitted} />
      <EditorCard label="Notifications (JSON)" initialJson={NOTIF_JSON} onCommit={setNotifCommitted} />
    </Box>
  );
}
