'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Autocomplete, TextField, Chip, Typography, Box, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const roleSuggestions = [
  'editor', 'viewer', 'guest', 'qa', 'finance', 'admin', 'beta', 'internal',
];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

interface RowData {
  name: string;
  roles: string[];
  saved: string[];
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [rows, setRows] = useState<RowData[]>([
    { name: 'Alex', roles: ['editor', 'do-not-edit'], saved: ['editor', 'do-not-edit'] },
    { name: 'Dana', roles: ['viewer'], saved: ['viewer'] },
  ]);

  const updateRoles = (name: string, newRoles: string[]) => {
    setRows(prev => prev.map(r => r.name === name ? { ...r, roles: newRoles } : r));
  };

  const saveRow = (name: string) => {
    setRows(prev => prev.map(r => r.name === name ? { ...r, saved: [...r.roles] } : r));
  };

  useEffect(() => {
    const alex = rows.find(r => r.name === 'Alex')!;
    const dana = rows.find(r => r.name === 'Dana')!;

    if (
      !hasSucceeded.current &&
      setsEqual(dana.saved, ['admin', 'beta', 'internal']) &&
      setsEqual(alex.saved, ['editor', 'do-not-edit'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Access Control</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <Autocomplete
                    multiple
                    freeSolo
                    size="small"
                    options={roleSuggestions}
                    value={row.roles}
                    onChange={(_, val) => updateRoles(row.name, val)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Add roles" sx={{ minWidth: 200 }} />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" onClick={() => saveRow(row.name)}>
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
