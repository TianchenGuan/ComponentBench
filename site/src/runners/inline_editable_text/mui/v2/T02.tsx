'use client';

/**
 * inline_editable_text-mui-v2-T02: API audience code with Enter-only commit in compact table
 *
 * A compact MUI Table titled "API audiences" with two rows ("Public API", "Internal API")
 * and columns "Audience", "Audience code", "State". Only Audience code cells are inline
 * editable. Clicking the text/pencil enters edit mode; pressing Enter commits.
 * Helper text below the table: "Press Enter to save a code; Esc cancels".
 *
 * Initial values: Public API → "PUB-01", Internal API → "INT-90".
 * Success: Public API Audience code equals "PUB-42", display mode, committed via Enter,
 * Internal API remains "INT-90".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, TextField, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskComponentProps } from '../../types';

interface CellState {
  row: string;
  value: string;
  editing: boolean;
  draft: string;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [cells, setCells] = useState<CellState[]>([
    { row: 'Public API', value: 'PUB-01', editing: false, draft: 'PUB-01' },
    { row: 'Internal API', value: 'INT-90', editing: false, draft: 'INT-90' },
  ]);
  const successFired = useRef(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null]);

  useEffect(() => {
    cells.forEach((c, i) => {
      if (c.editing) inputRefs.current[i]?.focus();
    });
  }, [cells]);

  useEffect(() => {
    if (successFired.current) return;
    const pub = cells.find((c) => c.row === 'Public API');
    const int = cells.find((c) => c.row === 'Internal API');
    if (
      pub && !pub.editing && pub.value === 'PUB-42' &&
      int && int.value === 'INT-90'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [cells, onSuccess]);

  const updateCell = (idx: number, patch: Partial<CellState>) =>
    setCells((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));

  return (
    <Box sx={{ position: 'absolute', top: 24, right: 24, width: 480 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>API audiences</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Audience</TableCell>
                <TableCell>Audience code</TableCell>
                <TableCell>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cells.map((cell, idx) => (
                <TableRow key={cell.row} hover>
                  <TableCell>{cell.row}</TableCell>
                  <TableCell
                    data-testid={`cell-${cell.row}`}
                    data-mode={cell.editing ? 'editing' : 'display'}
                    data-value={cell.value}
                  >
                    {cell.editing ? (
                      <TextField
                        inputRef={(el) => { inputRefs.current[idx] = el; }}
                        value={cell.draft}
                        onChange={(e) => updateCell(idx, { draft: e.target.value })}
                        size="small"
                        variant="standard"
                        sx={{ width: 100 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCell(idx, { value: cell.draft, editing: false });
                          }
                          if (e.key === 'Escape') {
                            updateCell(idx, { editing: false, draft: cell.value });
                          }
                        }}
                        onBlur={() => updateCell(idx, { editing: false, draft: cell.value })}
                      />
                    ) : (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}
                        onClick={() => updateCell(idx, { editing: true, draft: cell.value })}
                      >
                        <Typography variant="body2">{cell.value}</Typography>
                        <IconButton size="small" aria-label={`Edit ${cell.row}`}>
                          <EditIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label="active" size="small" color="success" variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Press Enter to save a code; Esc cancels
        </Typography>
      </Paper>
    </Box>
  );
}
