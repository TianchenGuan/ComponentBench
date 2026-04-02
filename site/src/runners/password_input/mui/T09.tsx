'use client';

/**
 * password_input-mui-T09: Inline-edit the Prod password in a dense table
 * 
 * The table is positioned near the top-left of the viewport. A Material UI table titled "Environments"
 * contains three rows: Dev, QA, and Prod. Each row shows a masked password preview (dots), an "Edit"
 * icon button, and a "Save" icon button.
 * Clicking "Edit" for a row turns that row's password cell into an inline OutlinedInput configured
 * as type=password. The input includes an endAdornment visibility toggle and starts empty when
 * editing begins.
 * Only the Prod row is the target. Clicking the Prod row's "Save" commits the edit and shows a
 * small "Saved" status text in that row.
 * 
 * Success: The password value for the Prod row equals exactly "ProdKey#900" after committing the row
 * AND the Prod row "Save" action has been used.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, IconButton, OutlinedInput, InputAdornment, Typography, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { TaskComponentProps } from '../types';

interface EnvRow {
  id: string;
  name: string;
  password: string;
  editing: boolean;
  saved: boolean;
  showPassword: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<EnvRow[]>([
    { id: 'dev', name: 'Dev', password: '', editing: false, saved: false, showPassword: false },
    { id: 'qa', name: 'QA', password: '', editing: false, saved: false, showPassword: false },
    { id: 'prod', name: 'Prod', password: '', editing: false, saved: false, showPassword: false },
  ]);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    const prodRow = rows.find(r => r.id === 'prod');
    if (prodRow && prodRow.password === 'ProdKey#900' && prodRow.saved && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const handleEdit = (id: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, editing: true, password: '' } : row
    ));
  };

  const handleSave = (id: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, editing: false, saved: true } : row
    ));
  };

  const handlePasswordChange = (id: string, value: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, password: value } : row
    ));
  };

  const toggleVisibility = (id: string) => {
    setRows(prev => prev.map(row =>
      row.id === id ? { ...row, showPassword: !row.showPassword } : row
    ));
  };

  return (
    <Box sx={{ width: 550 }}>
      <Typography variant="h6" gutterBottom>
        Environments
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" data-testid="environments-table">
          <TableHead>
            <TableRow>
              <TableCell>Environment</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} data-row={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.editing ? (
                    <OutlinedInput
                      type={row.showPassword ? 'text' : 'password'}
                      value={row.password}
                      onChange={(e) => handlePasswordChange(row.id, e.target.value)}
                      size="small"
                      sx={{ width: 180 }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => toggleVisibility(row.id)}
                            edge="end"
                            size="small"
                          >
                            {row.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      inputProps={{ 'data-testid': `password-input-${row.id}` }}
                    />
                  ) : (
                    <Typography variant="body2">••••••••</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(row.id)}
                      data-testid={`edit-${row.id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleSave(row.id)}
                      data-testid={`save-${row.id}`}
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    {row.saved && (
                      <Chip label="Saved" size="small" color="success" />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
