'use client';

/**
 * text_input-mui-T08: Edit order note in table row
 * 
 * Scene is a dashboard with a dense Orders table (layout=table_cell, clutter=high) centered in the viewport.
 * The table has three visible rows with invoice IDs: "INV-1007", "INV-1008", and "INV-1009". In the "Internal
 * note" column, each row contains an always-visible MUI TextField pre-filled with a short note (instances=3).
 * Other columns include status chips and icon buttons as distractors, but only the Internal note TextFields
 * are relevant for success. No modal or save button is required.
 * 
 * Success: In the row labeled "INV-1008", the TextField in the "Internal note" column has value "Call on arrival" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Chip, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskComponentProps } from '../types';

interface OrderRow {
  id: string;
  status: string;
  internalNote: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<OrderRow[]>([
    { id: 'INV-1007', status: 'Shipped', internalNote: 'Standard' },
    { id: 'INV-1008', status: 'Pending', internalNote: 'Rush order' },
    { id: 'INV-1009', status: 'Delivered', internalNote: 'Fragile' },
  ]);

  useEffect(() => {
    const targetRow = data.find(row => row.id === 'INV-1008');
    if (targetRow && targetRow.internalNote.trim() === 'Call on arrival') {
      onSuccess();
    }
  }, [data, onSuccess]);

  const handleNoteChange = (id: string, value: string) => {
    setData(prev => prev.map(row =>
      row.id === id ? { ...row, internalNote: value } : row
    ));
  };

  return (
    <div style={{ width: 700 }}>
      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" data-testid="orders-table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Internal note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} data-rowid={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'Delivered' ? 'success' : row.status === 'Shipped' ? 'primary' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="outlined"
                    value={row.internalNote}
                    onChange={(e) => handleNoteChange(row.id, e.target.value)}
                    inputProps={{
                      'data-testid': `internal-note-input-${row.id}`,
                      'data-rowid': row.id
                    }}
                    sx={{ width: 180 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
