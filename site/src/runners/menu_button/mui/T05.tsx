'use client';

/**
 * menu_button-mui-T05: Show exactly Status and Owner columns
 * 
 * Layout: table_cell scene (a small data table) centered in the viewport.
 * In the table header there are two menu buttons (instances=2): "Columns" and "Row actions".
 * The target is the "Columns" menu button.
 * 
 * Opening it shows a menu list with checkboxes for available columns:
 * "Name", "Status", "Owner", "Last updated", "Priority".
 * Selections are multi-select and do not auto-close the menu.
 * 
 * Initial state: only "Name" is selected.
 * Success: The selected set is exactly {Status, Owner}.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem, Checkbox, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const allColumns = ['Name', 'Status', 'Owner', 'Last updated', 'Priority'];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [columnsAnchorEl, setColumnsAnchorEl] = useState<null | HTMLElement>(null);
  const [rowActionsAnchorEl, setRowActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['Name']);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const columnsOpen = Boolean(columnsAnchorEl);
  const rowActionsOpen = Boolean(rowActionsAnchorEl);

  useEffect(() => {
    const isExactMatch =
      selectedColumns.length === 2 &&
      selectedColumns.includes('Status') &&
      selectedColumns.includes('Owner');
    
    if (isExactMatch && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedColumns, successTriggered, onSuccess]);

  const handleColumnsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnsAnchorEl(event.currentTarget);
  };

  const handleRowActionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRowActionsAnchorEl(event.currentTarget);
  };

  const handleColumnsClose = () => {
    setColumnsAnchorEl(null);
  };

  const handleRowActionsClose = () => {
    setRowActionsAnchorEl(null);
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(c => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  // Mock table data
  const mockData = [
    { id: 1, name: 'Item A', status: 'Active', owner: 'John' },
    { id: 2, name: 'Item B', status: 'Pending', owner: 'Jane' },
  ];

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        {/* Header with menu buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Typography variant="h6">Data Table</Typography>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleColumnsClick}
              endIcon={<KeyboardArrowDownIcon />}
              data-testid="menu-button-columns"
            >
              Columns ({selectedColumns.length} selected)
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleRowActionsClick}
              endIcon={<KeyboardArrowDownIcon />}
              data-testid="menu-button-row-actions"
            >
              Row actions
            </Button>
          </div>
        </div>

        {/* Clutter: Filter chips */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <Chip label="All" size="small" color="primary" />
          <Chip label="Active" size="small" variant="outlined" />
          <Chip label="Pending" size="small" variant="outlined" />
        </div>

        {/* Table */}
        <Table size="small">
          <TableHead>
            <TableRow>
              {selectedColumns.map(col => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map(row => (
              <TableRow key={row.id}>
                {selectedColumns.includes('Name') && <TableCell>{row.name}</TableCell>}
                {selectedColumns.includes('Status') && <TableCell>{row.status}</TableCell>}
                {selectedColumns.includes('Owner') && <TableCell>{row.owner}</TableCell>}
                {selectedColumns.includes('Last updated') && <TableCell>-</TableCell>}
                {selectedColumns.includes('Priority') && <TableCell>-</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Columns Menu */}
        <Menu
          anchorEl={columnsAnchorEl}
          open={columnsOpen}
          onClose={handleColumnsClose}
        >
          {allColumns.map(col => (
            <MenuItem key={col} onClick={() => toggleColumn(col)}>
              <Checkbox checked={selectedColumns.includes(col)} size="small" />
              {col}
            </MenuItem>
          ))}
        </Menu>

        {/* Row Actions Menu (distractor) */}
        <Menu
          anchorEl={rowActionsAnchorEl}
          open={rowActionsOpen}
          onClose={handleRowActionsClose}
        >
          <MenuItem onClick={handleRowActionsClose}>Edit selected</MenuItem>
          <MenuItem onClick={handleRowActionsClose}>Delete selected</MenuItem>
          <MenuItem onClick={handleRowActionsClose}>Export selected</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
