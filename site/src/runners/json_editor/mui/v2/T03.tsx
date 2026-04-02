'use client';

/**
 * json_editor-mui-v2-T03: Allowed origins backend — add new item and save
 *
 * Two stacked JSON editors: "Allowed origins (Frontend JSON)" and
 * "Allowed origins (Backend JSON)". Each has a search box and local Save.
 * Add `https://example.com` to Backend's `allowedOrigins` array (preserving
 * existing entry) and click Backend Save. Frontend must remain unchanged.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Paper, Typography, Button, Box, TextField, Stack, Switch,
  FormControlLabel, Accordion, AccordionSummary, AccordionDetails,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const FRONTEND_JSON: JsonValue = {
  allowedOrigins: ['https://app.example.com'],
  allowCredentials: true,
};

const BACKEND_JSON: JsonValue = {
  allowedOrigins: ['https://api.example.com'],
  allowCredentials: false,
};

function updateAtPath(obj: JsonValue, path: string[], value: JsonValue): JsonValue {
  const clone = JSON.parse(JSON.stringify(obj));
  let cur = clone;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
  return clone;
}

function RecursiveTree({
  obj,
  path,
  onUpdate,
  search,
}: {
  obj: JsonValue;
  path: string[];
  onUpdate: (root: JsonValue) => void;
  search: string;
}) {
  if (typeof obj !== 'object' || obj === null) return null;

  if (Array.isArray(obj)) {
    return (
      <Stack spacing={0.5} sx={{ pl: 2 }}>
        {obj.map((item, idx) => {
          const highlight = search && String(item).toLowerCase().includes(search.toLowerCase());
          return (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#666' }}>[{idx}]:</Typography>
              <TextField
                size="small"
                value={String(item)}
                onChange={(e) => {
                  const newArr = [...obj];
                  newArr[idx] = e.target.value;
                  const root = updateAtPath({ _: obj }, ['_'], newArr);
                  onUpdate((root as Record<string, JsonValue>)._);
                }}
                sx={{ flex: 1, ...(highlight ? { '& .MuiInputBase-root': { background: '#fff9c4' } } : {}) }}
              />
            </Box>
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack spacing={0.5}>
      {Object.entries(obj).map(([k, v]) => {
        const p = [...path, k];
        const highlight = search && k.toLowerCase().includes(search.toLowerCase());

        if (Array.isArray(v)) {
          return (
            <Accordion key={k} defaultExpanded disableGutters elevation={0} sx={{ '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32, px: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', ...(highlight ? { background: '#fff9c4' } : {}) }}>{k} [{v.length}]</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RecursiveTree
                  obj={v}
                  path={p}
                  onUpdate={(newArr) => {
                    onUpdate(updateAtPath(obj, [k], newArr));
                  }}
                  search={search}
                />
              </AccordionDetails>
            </Accordion>
          );
        }

        if (typeof v === 'object' && v !== null) {
          return (
            <Accordion key={k} defaultExpanded disableGutters elevation={0} sx={{ '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 32, px: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', ...(highlight ? { background: '#fff9c4' } : {}) }}>{k}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RecursiveTree obj={v} path={p} onUpdate={(newV) => onUpdate(updateAtPath(obj, [k], newV))} search={search} />
              </AccordionDetails>
            </Accordion>
          );
        }

        if (typeof v === 'boolean') {
          return (
            <FormControlLabel
              key={k}
              control={<Switch size="small" checked={v} onChange={(e) => onUpdate(updateAtPath(obj, [k], e.target.checked))} />}
              label={<Typography variant="body2" sx={{ fontFamily: 'monospace', ...(highlight ? { background: '#fff9c4' } : {}) }}>{k}</Typography>}
            />
          );
        }

        return (
          <Box key={k} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', ...(highlight ? { background: '#fff9c4' } : {}) }}>{k}:</Typography>
            <TextField
              size="small"
              value={String(v)}
              onChange={(e) => {
                const parsed = typeof v === 'number' ? Number(e.target.value) : e.target.value;
                onUpdate(updateAtPath(obj, [k], parsed));
              }}
              sx={{ width: 180 }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}

function EditorPanel({
  label,
  initialJson,
  onCommit,
}: {
  label: string;
  initialJson: JsonValue;
  onCommit: (v: JsonValue) => void;
}) {
  const [json, setJson] = useState<JsonValue>(initialJson);
  const [search, setSearch] = useState('');
  const [newItem, setNewItem] = useState('');
  const [mode, setMode] = useState<'tree' | 'code'>('tree');
  const [codeText, setCodeText] = useState(JSON.stringify(initialJson, null, 2));
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'tree') {
      setCodeText(JSON.stringify(json, null, 2));
      setCodeError(null);
    }
  }, [json, mode]);

  const handleAddArrayItem = () => {
    if (!newItem) return;
    const obj = json as Record<string, JsonValue>;
    const arr = obj.allowedOrigins as JsonValue[];
    setJson({ ...obj, allowedOrigins: [...arr, newItem] });
    setNewItem('');
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
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>{label}</Typography>
      <TextField
        size="small"
        placeholder="Search keys…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 1, width: '100%' }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />
      <Box sx={{ mb: 1 }}>
        <Button size="small" variant={mode === 'tree' ? 'contained' : 'text'} onClick={() => { setMode('tree'); try { setJson(JSON.parse(codeText)); } catch {} }} sx={{ mr: 0.5 }}>Tree</Button>
        <Button size="small" variant={mode === 'code' ? 'contained' : 'text'} onClick={() => { setMode('code'); setCodeText(JSON.stringify(json, null, 2)); }}>Code</Button>
      </Box>
      <Box sx={{ minHeight: 120, mb: 1 }}>
        {mode === 'tree' ? (
          <>
            <RecursiveTree obj={json} path={[]} onUpdate={setJson} search={search} />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
              <TextField size="small" placeholder="new origin URL" value={newItem} onChange={(e) => setNewItem(e.target.value)} sx={{ flex: 1 }} />
              <Button size="small" onClick={handleAddArrayItem}>Add to origins</Button>
            </Stack>
          </>
        ) : (
          <TextField
            multiline rows={8} fullWidth value={codeText}
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

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [frontendCommitted, setFrontendCommitted] = useState<JsonValue>(FRONTEND_JSON);
  const [backendCommitted, setBackendCommitted] = useState<JsonValue>(BACKEND_JSON);

  useEffect(() => {
    if (successFired.current) return;
    const origins = getJsonPath(backendCommitted, '$.allowedOrigins');
    if (
      Array.isArray(origins) &&
      origins.includes('https://api.example.com') &&
      origins.includes('https://example.com') &&
      jsonEquals(frontendCommitted, FRONTEND_JSON)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [backendCommitted, frontendCommitted, onSuccess]);

  return (
    <Box sx={{ p: 3, maxWidth: 560 }}>
      <EditorPanel label="Allowed origins (Frontend JSON)" initialJson={FRONTEND_JSON} onCommit={setFrontendCommitted} />
      <EditorPanel label="Allowed origins (Backend JSON)" initialJson={BACKEND_JSON} onCommit={setBackendCommitted} />
    </Box>
  );
}
