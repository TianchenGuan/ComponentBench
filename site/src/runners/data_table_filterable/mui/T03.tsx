'use client';

/**
 * data_table_filterable-mui-T03: DataGrid: Clear all filters
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered with one MUI X DataGrid titled "Customers".
 *
 * Initial state: two filters are pre-applied: (1) Status equals Pending (column filter item), and (2) a Quick filter text
 * 'son' is present in the toolbar search box.
 *
 * The toolbar includes a "Filters" button that opens the filter panel; the filter panel shows the active filter item and
 * offers controls to delete it.
 *
 * Success: Column filter model is empty (no filter items). Quick/global filter text is empty/null.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, TextField, InputAdornment, Chip, Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps, FilterModel } from '../types';

interface CustomerData {
  id: number;
  name: string;
  email: string;
  status: string;
  country: string;
}

const customersData: CustomerData[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', country: 'USA' },
  { id: 2, name: 'Bob Wilson', email: 'bob@example.com', status: 'Pending', country: 'Canada' },
  { id: 3, name: 'Carol Thompson', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: 4, name: 'David Anderson', email: 'david@example.com', status: 'Pending', country: 'Germany' },
  { id: 5, name: 'Eva Jackson', email: 'eva@example.com', status: 'Active', country: 'France' },
  { id: 6, name: 'Frank Nelson', email: 'frank@example.com', status: 'Cancelled', country: 'Japan' },
  { id: 7, name: 'Grace Parson', email: 'grace@example.com', status: 'Pending', country: 'Australia' },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', status: 'Active', country: 'China' },
];

const statusOptions = ['Active', 'Pending', 'Paused', 'Cancelled'];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    type: 'singleSelect',
    valueOptions: statusOptions,
  },
  { field: 'country', headerName: 'Country', width: 120 },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [quickFilter, setQuickFilter] = useState('son');
  const [statusFilter, setStatusFilter] = useState<string | null>('Pending');
  const successFiredRef = useRef(false);
  const [interactionStarted, setInteractionStarted] = useState(false);

  const filteredRows = customersData.filter(row => {
    if (statusFilter && row.status !== statusFilter) return false;
    if (quickFilter.trim()) {
      const q = quickFilter.toLowerCase().trim();
      return Object.values(row).some(v => String(v).toLowerCase().includes(q));
    }
    return true;
  });

  useEffect(() => {
    if (!interactionStarted) return;
    if (!statusFilter && !quickFilter.trim() && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [statusFilter, quickFilter, interactionStarted, onSuccess]);

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Customers
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Quick filter…"
            size="small"
            value={quickFilter}
            onChange={(e) => { setInteractionStarted(true); setQuickFilter(e.target.value); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
            sx={{ width: 200 }}
            data-testid="quick-filter-input"
          />
          {statusFilter && (
            <Chip
              label={`Status: ${statusFilter}`}
              onDelete={() => { setInteractionStarted(true); setStatusFilter(null); }}
              size="small"
              color="primary"
              variant="outlined"
              data-testid="status-filter-chip"
            />
          )}
          {(statusFilter || quickFilter.trim()) && (
            <Button
              size="small"
              onClick={() => { setInteractionStarted(true); setStatusFilter(null); setQuickFilter(''); }}
              data-testid="clear-all-filters"
            >
              Clear all
            </Button>
          )}
        </Box>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableColumnFilter
            disableRowSelectionOnClick
            data-testid="datagrid-customers"
          />
        </div>
      </CardContent>
    </Card>
  );
}
