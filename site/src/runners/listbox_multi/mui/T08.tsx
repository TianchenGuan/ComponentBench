'use client';

/**
 * listbox_multi-mui-T08: Dark dashboard: priority filter list
 *
 * Layout: dashboard in dark theme. The main area shows an issues table and charts; a right sidebar contains filters.
 * In the sidebar there are three separate checkbox listboxes (instances=3):
 *   - Status: Open, In progress, Blocked, Closed…
 *   - Priority: P0 Critical, P1 High, P2 Medium, P3 Low, P4 Trivial…
 *   - Owner: several names…
 * Target is ONLY the "Priority" list.
 * Initial state: none selected in Priority; Status has "Open" preselected.
 * Clutter: many non-target controls (search bar, table sort, date picker) are visible.
 *
 * Success: The target listbox (Priority) has exactly: P0 Critical, P2 Medium, P3 Low.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const statusOptions = ['Open', 'In progress', 'Blocked', 'Closed'];
const priorityOptions = ['P0 Critical', 'P1 High', 'P2 Medium', 'P3 Low', 'P4 Trivial'];
const ownerOptions = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'];

const targetSet = ['P0 Critical', 'P2 Medium', 'P3 Low'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [statusSelected, setStatusSelected] = useState<string[]>(['Open']);
  const [prioritySelected, setPrioritySelected] = useState<string[]>([]);
  const [ownerSelected, setOwnerSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(prioritySelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [prioritySelected, onSuccess]);

  const handleStatusToggle = (value: string) => {
    const idx = statusSelected.indexOf(value);
    const next = [...statusSelected];
    if (idx === -1) next.push(value);
    else next.splice(idx, 1);
    setStatusSelected(next);
  };

  const handlePriorityToggle = (value: string) => {
    const idx = prioritySelected.indexOf(value);
    const next = [...prioritySelected];
    if (idx === -1) next.push(value);
    else next.splice(idx, 1);
    setPrioritySelected(next);
  };

  const handleOwnerToggle = (value: string) => {
    const idx = ownerSelected.indexOf(value);
    const next = [...ownerSelected];
    if (idx === -1) next.push(value);
    else next.splice(idx, 1);
    setOwnerSelected(next);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: 500, bgcolor: 'background.default' }}>
        {/* Main content */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Issue Dashboard
            </Typography>
            <TextField size="small" placeholder="Search issues" InputProps={{ startAdornment: <SearchIcon fontSize="small" /> }} />
            <IconButton size="small">
              <FilterListIcon />
            </IconButton>
          </Box>
          <Paper sx={{ p: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ISS-101</TableCell>
                  <TableCell>Fix login bug</TableCell>
                  <TableCell>Open</TableCell>
                  <TableCell>P0 Critical</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ISS-102</TableCell>
                  <TableCell>Update docs</TableCell>
                  <TableCell>In progress</TableCell>
                  <TableCell>P2 Medium</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: 260, borderLeft: '1px solid', borderColor: 'divider', p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Filters
          </Typography>

          <Card variant="outlined" sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="subtitle2">Status</Typography>
              <List dense data-testid="filter-status">
                {statusOptions.map((opt) => (
                  <ListItem key={opt} disablePadding>
                    <ListItemButton onClick={() => handleStatusToggle(opt)} sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Checkbox size="small" edge="start" checked={statusSelected.includes(opt)} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText primary={opt} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="subtitle2">Priority</Typography>
              <List dense data-testid="filter-priority">
                {priorityOptions.map((opt) => (
                  <ListItem key={opt} disablePadding>
                    <ListItemButton onClick={() => handlePriorityToggle(opt)} sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Checkbox size="small" edge="start" checked={prioritySelected.includes(opt)} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText primary={opt} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="subtitle2">Owner</Typography>
              <List dense data-testid="filter-owner">
                {ownerOptions.map((opt) => (
                  <ListItem key={opt} disablePadding>
                    <ListItemButton onClick={() => handleOwnerToggle(opt)} sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Checkbox size="small" edge="start" checked={ownerSelected.includes(opt)} tabIndex={-1} disableRipple />
                      </ListItemIcon>
                      <ListItemText primary={opt} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
