'use client';

/**
 * toggle_button_group_multi-mui-T16: Set allowed actions for a user in table
 *
 * Layout: table_cell centered in the viewport.
 *
 * The page shows a "Team" table with four rows (names): Avery Chen, Jordan Lee, 
 * Morgan Patel, Taylor Kim.
 * Columns include: Name, Role, Allowed actions, Status.
 *
 * In the "Allowed actions" column, each row contains a MUI ToggleButtonGroup 
 * (multiple selection) with four options:
 * - View
 * - Edit
 * - Invite
 * - Delete
 *
 * Initial states:
 * - Avery Chen: View selected only.
 * - Jordan Lee: View + Edit selected.
 * - Morgan Patel: View + Invite selected.
 * - Taylor Kim: View + Edit + Delete selected.
 *
 * Clutter (medium):
 * - Table has a sticky header, sort icons, and a search field above.
 * - A status filter chip row above the table (not part of success).
 *
 * No Save button; updates occur immediately per-row.
 *
 * Success: Avery Chen → Allowed actions: View + Edit + Invite (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, CardContent, Typography, Box, TextField, Chip,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const ACTIONS = ['View', 'Edit', 'Invite', 'Delete'];
const TARGET_SET = new Set(['View', 'Edit', 'Invite']);

export default function T06({ onSuccess }: TaskComponentProps) {
  const [averyActions, setAveryActions] = useState<string[]>(['View']);
  const [jordanActions, setJordanActions] = useState<string[]>(['View', 'Edit']);
  const [morganActions, setMorganActions] = useState<string[]>(['View', 'Invite']);
  const [taylorActions, setTaylorActions] = useState<string[]>(['View', 'Edit', 'Delete']);
  const successFiredRef = useRef(false);

  // Initial states for non-target rows
  const jordanInitial = useRef(['View', 'Edit']);
  const morganInitial = useRef(['View', 'Invite']);
  const taylorInitial = useRef(['View', 'Edit', 'Delete']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if Avery has the target set
    const averySet = new Set(averyActions);
    const averyMatches = averySet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => averySet.has(v));

    // Check if non-target rows are unchanged
    const jordanUnchanged = JSON.stringify([...jordanActions].sort()) === JSON.stringify([...jordanInitial.current].sort());
    const morganUnchanged = JSON.stringify([...morganActions].sort()) === JSON.stringify([...morganInitial.current].sort());
    const taylorUnchanged = JSON.stringify([...taylorActions].sort()) === JSON.stringify([...taylorInitial.current].sort());

    if (averyMatches && jordanUnchanged && morganUnchanged && taylorUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [averyActions, jordanActions, morganActions, taylorActions, onSuccess]);

  const renderActions = (
    actions: string[], 
    setActions: (v: string[]) => void, 
    rowKey: string
  ) => (
    <ToggleButtonGroup
      value={actions}
      onChange={(_, newActions) => setActions(newActions)}
      size="small"
      aria-label={`${rowKey} actions`}
      data-testid={`actions-${rowKey.toLowerCase().replace(' ', '-')}`}
      data-row={rowKey}
    >
      {ACTIONS.map(action => (
        <ToggleButton 
          key={action} 
          value={action} 
          aria-label={action}
          sx={{ fontSize: 11, py: 0.5, px: 1 }}
          data-testid={`${rowKey.toLowerCase().replace(' ', '-')}-${action.toLowerCase()}`}
        >
          {action}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  const rows = [
    { name: 'Avery Chen', role: 'Admin', status: 'Active', actions: averyActions, setActions: setAveryActions },
    { name: 'Jordan Lee', role: 'Editor', status: 'Active', actions: jordanActions, setActions: setJordanActions },
    { name: 'Morgan Patel', role: 'Viewer', status: 'Pending', actions: morganActions, setActions: setMorganActions },
    { name: 'Taylor Kim', role: 'Admin', status: 'Active', actions: taylorActions, setActions: setTaylorActions },
  ];

  return (
    <Card sx={{ width: 800 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Team
        </Typography>

        {/* Search and filters */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search team…"
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} /> }}
            sx={{ width: 200 }}
            data-testid="search-team"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="All" variant="filled" size="small" />
            <Chip label="Active" variant="outlined" size="small" />
            <Chip label="Pending" variant="outlined" size="small" />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Set Avery Chen actions to View + Edit + Invite.
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table size="small" data-testid="team-table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Allowed actions</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    {renderActions(row.actions, row.setActions, row.name)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      color={row.status === 'Active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
