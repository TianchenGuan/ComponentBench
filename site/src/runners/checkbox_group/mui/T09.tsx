'use client';

/**
 * checkbox_group-mui-T09: Match column preview in Visible columns and save
 *
 * Scene: light theme; comfortable spacing; a dashboard-style page anchored toward the top-left; instances=3.
 * Material UI admin dashboard (light theme) with high clutter: KPI cards, sample data table.
 * A right-hand panel "Table settings" contains three checkbox groups stacked:
 * 1) "Visible columns" ← target (10 options: ID, Name, Email, Role, Status, Created, Updated, Last login, Plan, Region)
 * 2) "Pinned columns" (distractor: ID, Name, Status)
 * 3) "Export options" (distractor: Include headers, Include hidden columns, Export as CSV, Export as XLSX)
 * Above Visible columns there is a "Column preview" strip showing four column tokens (Name, Email, Status, Last login).
 * Initial state: Visible columns: ID, Name, Email, Role, Status checked. Pinned: ID. Export: Include headers.
 * Success: Visible columns has Name, Email, Status, Last login checked and Save layout is clicked.
 */

import React, { useState, useRef } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Chip, Stack,
  FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox,
  Paper, Table, TableHead, TableRow, TableCell, TableBody, Divider
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const visibleColumnOptions = ['ID', 'Name', 'Email', 'Role', 'Status', 'Created', 'Updated', 'Last login', 'Plan', 'Region'];
const pinnedColumnOptions = ['ID', 'Name', 'Status'];
const exportOptions = ['Include headers', 'Include hidden columns', 'Export as CSV', 'Export as XLSX'];

const targetColumns = ['Name', 'Email', 'Status', 'Last login'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    ID: true, Name: true, Email: true, Role: true, Status: true,
    Created: false, Updated: false, 'Last login': false, Plan: false, Region: false,
  });
  const [pinnedColumns, setPinnedColumns] = useState<Record<string, boolean>>({
    ID: true, Name: false, Status: false,
  });
  const [exportOpts, setExportOpts] = useState<Record<string, boolean>>({
    'Include headers': true, 'Include hidden columns': false, 
    'Export as CSV': false, 'Export as XLSX': false,
  });
  const hasSucceeded = useRef(false);

  const handleVisibleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setVisibleColumns({ ...visibleColumns, [name]: event.target.checked });
  };
  const handlePinnedChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPinnedColumns({ ...pinnedColumns, [name]: event.target.checked });
  };
  const handleExportChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportOpts({ ...exportOpts, [name]: event.target.checked });
  };

  const handleSaveLayout = () => {
    const targetSet = new Set(targetColumns);
    const checkedItems = Object.entries(visibleColumns).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Dashboard content (clutter) */}
      <Box sx={{ flex: 1 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Paper sx={{ p: 2, flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Users</Typography>
                <Typography variant="h4">1,234</Typography>
              </Paper>
              <Paper sx={{ p: 2, flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Revenue</Typography>
                <Typography variant="h4">$45K</Typography>
              </Paper>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow><TableCell>John</TableCell><TableCell>john@ex.com</TableCell><TableCell>Active</TableCell></TableRow>
                <TableRow><TableCell>Jane</TableCell><TableCell>jane@ex.com</TableCell><TableCell>Pending</TableCell></TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      {/* Table settings panel */}
      <Card sx={{ width: 280 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Table settings</Typography>

          {/* Column preview reference */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Column preview</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              {targetColumns.map(col => (
                <Chip key={col} label={col} size="small" color="primary" />
              ))}
            </Stack>
          </Box>

          {/* Visible columns (target) */}
          <FormControl component="fieldset" sx={{ mb: 2 }} data-testid="cg-visible-columns">
            <FormLabel component="legend" sx={{ fontSize: 14 }}>Visible columns</FormLabel>
            <Box sx={{ maxHeight: 180, overflowY: 'auto' }}>
              <FormGroup>
                {visibleColumnOptions.map(col => (
                  <FormControlLabel
                    key={col}
                    control={<Checkbox checked={visibleColumns[col]} onChange={handleVisibleChange(col)} size="small" />}
                    label={<Typography variant="body2">{col}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          {/* Pinned columns (distractor) */}
          <FormControl component="fieldset" sx={{ mb: 2 }} data-testid="cg-pinned-columns">
            <FormLabel component="legend" sx={{ fontSize: 14 }}>Pinned columns</FormLabel>
            <FormGroup row>
              {pinnedColumnOptions.map(col => (
                <FormControlLabel
                  key={col}
                  control={<Checkbox checked={pinnedColumns[col]} onChange={handlePinnedChange(col)} size="small" />}
                  label={<Typography variant="body2">{col}</Typography>}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Divider sx={{ my: 1 }} />

          {/* Export options (distractor) */}
          <FormControl component="fieldset" sx={{ mb: 2 }} data-testid="cg-export-options">
            <FormLabel component="legend" sx={{ fontSize: 14 }}>Export options</FormLabel>
            <FormGroup>
              {exportOptions.map(opt => (
                <FormControlLabel
                  key={opt}
                  control={<Checkbox checked={exportOpts[opt]} onChange={handleExportChange(opt)} size="small" />}
                  label={<Typography variant="body2">{opt}</Typography>}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Button variant="contained" fullWidth onClick={handleSaveLayout} data-testid="btn-save-layout">
            Save layout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
