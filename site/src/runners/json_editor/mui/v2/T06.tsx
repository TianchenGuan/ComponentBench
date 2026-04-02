'use client';

/**
 * json_editor-mui-v2-T06: Priority reorder in compact dashboard card
 *
 * Single JSON editor card "Priority order (JSON)" in Tree mode with drag handles.
 * Reorder `priority` from ["P2","P1","P3"] to ["P1","P2","P3"] and click Save.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Typography, Button, Box, Stack } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import IconButton from '@mui/material/IconButton';
import type { TaskComponentProps, JsonValue } from '../../types';
import { getJsonPath, jsonEquals } from '../../types';

const INITIAL_JSON: JsonValue = { priority: ['P2', 'P1', 'P3'] };

export default function T06({ onSuccess }: TaskComponentProps) {
  const [json, setJson] = useState<JsonValue>(INITIAL_JSON);
  const [committed, setCommitted] = useState<JsonValue>(INITIAL_JSON);
  const successFired = useRef(false);
  const dragIdx = useRef<number | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    const priority = getJsonPath(committed, '$.priority');
    if (Array.isArray(priority) && jsonEquals(priority as JsonValue[], ['P1', 'P2', 'P3'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const obj = json as { priority: string[] };

  const moveItem = useCallback((from: number, to: number) => {
    const arr = [...obj.priority];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setJson({ ...obj, priority: arr });
  }, [obj]);

  return (
    <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
      <Paper sx={{ p: 1, px: 2, height: 'fit-content' }}>
        <Typography variant="caption" color="text.secondary">Queue stats</Typography>
        <Typography variant="body2">Pending: 12</Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 2, width: 360 }}>
        <Typography variant="subtitle1" gutterBottom>Priority order (JSON)</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>priority:</Typography>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {obj.priority.map((item, idx) => (
            <Box
              key={`${item}-${idx}`}
              draggable
              onDragStart={() => { dragIdx.current = idx; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIdx.current !== null && dragIdx.current !== idx) moveItem(dragIdx.current, idx);
                dragIdx.current = null;
              }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 0.5,
                p: 0.5, px: 1,
                border: '1px solid', borderColor: 'divider', borderRadius: 1,
                cursor: 'grab', bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary', cursor: 'grab' }} />
              <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace' }}>{JSON.stringify(item)}</Typography>
              <IconButton size="small" disabled={idx === 0} onClick={() => moveItem(idx, idx - 1)}><ArrowUpwardIcon fontSize="small" /></IconButton>
              <IconButton size="small" disabled={idx === obj.priority.length - 1} onClick={() => moveItem(idx, idx + 1)}><ArrowDownwardIcon fontSize="small" /></IconButton>
            </Box>
          ))}
        </Stack>
        <Button variant="contained" size="small" onClick={() => setCommitted(json)}>Save</Button>
      </Paper>
    </Box>
  );
}
