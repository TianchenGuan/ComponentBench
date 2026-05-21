'use client';

/**
 * data_table_filterable-mui-T05: Two filters: Status=Pending AND Plan=Enterprise
 *
 * Scene context: theme=light; spacing=comfortable; layout=form_section; placement=center; scale=default;
 * instances=1; guidance=text; clutter=low.
 *
 * Layout: form_section with low clutter. Above the grid are a couple of unrelated form fields (read-only) and a Save button.
 *
 * A single MUI X DataGrid titled "Orders" is shown.
 *
 * Filtering UI: the toolbar includes a Filters button to open the filter panel.
 *
 * Filter panel supports multiple filter items; there is an "Add filter" control to create a second filter row.
 *
 * Initial state: no filters active; filter panel closed.
 *
 * Success: Filter model has two items combined with AND: Status equals Pending; Plan equals Enterprise.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card, CardContent, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Paper, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  id: number;
  orderId: string;
  customer: string;
  status: string;
  plan: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { id: 1, orderId: 'ORD-001', customer: 'Alice', status: 'Pending', plan: 'Free', amount: 0 },
  { id: 2, orderId: 'ORD-002', customer: 'Bob', status: 'Active', plan: 'Pro', amount: 29 },
  { id: 3, orderId: 'ORD-003', customer: 'Carol', status: 'Pending', plan: 'Enterprise', amount: 99 },
  { id: 4, orderId: 'ORD-004', customer: 'David', status: 'Cancelled', plan: 'Enterprise', amount: 99 },
  { id: 5, orderId: 'ORD-005', customer: 'Eva', status: 'Pending', plan: 'Pro', amount: 29 },
  { id: 6, orderId: 'ORD-006', customer: 'Frank', status: 'Active', plan: 'Enterprise', amount: 99 },
  { id: 7, orderId: 'ORD-007', customer: 'Grace', status: 'Pending', plan: 'Enterprise', amount: 99 },
  { id: 8, orderId: 'ORD-008', customer: 'Henry', status: 'Active', plan: 'Free', amount: 0 },
];

const statusOptions = ['Pending', 'Active', 'Cancelled', 'Paused'];
const planOptions = ['Free', 'Pro', 'Enterprise'];

const columns: GridColDef[] = [
  { field: 'orderId', headerName: 'Order ID', width: 120 },
  { field: 'customer', headerName: 'Customer', width: 120 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    type: 'singleSelect',
    valueOptions: statusOptions,
  },
  {
    field: 'plan',
    headerName: 'Plan',
    width: 120,
    type: 'singleSelect',
    valueOptions: planOptions,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 100,
    type: 'number',
    valueFormatter: (value: number) => `$${value}`,
  },
];

interface FilterItem {
  id: number;
  field: string;
  operator: string;
  value: string;
}

const filterableFields = [
  { field: 'status', label: 'Status', options: statusOptions },
  { field: 'plan', label: 'Plan', options: planOptions },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const successFiredRef = useRef(false);
  let nextId = useRef(1);

  const filteredRows = ordersData.filter(row => {
    return filters.every(f => {
      if (!f.field || !f.value) return true;
      return (row as unknown as Record<string, unknown>)[f.field] === f.value;
    });
  });

  useEffect(() => {
    const activeFilters = filters.filter(f => f.field && f.value);
    const hasStatus = activeFilters.some(f => f.field === 'status' && f.value === 'Pending');
    const hasPlan = activeFilters.some(f => f.field === 'plan' && f.value === 'Enterprise');
    if (hasStatus && hasPlan && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filters, onSuccess]);

  const addFilter = () => {
    setFilters([...filters, { id: nextId.current++, field: '', operator: 'is', value: '' }]);
  };

  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: number, updates: Partial<FilterItem>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates, ...(updates.field ? { value: '' } : {}) } : f));
  };

  return (
    <Card sx={{ width: 750 }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField label="Reference ID" value="REF-12345" size="small" InputProps={{ readOnly: true }} />
            <TextField label="Date" value="2024-01-15" size="small" InputProps={{ readOnly: true }} />
          </Box>
          <Button variant="outlined">Save</Button>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>Orders</Typography>

        <Box sx={{ mb: 1 }}>
          <Button
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setPanelOpen(!panelOpen)}
            variant={panelOpen ? 'contained' : 'outlined'}
            data-testid="filters-button"
          >
            Filters {filters.filter(f => f.value).length > 0 ? `(${filters.filter(f => f.value).length})` : ''}
          </Button>
        </Box>

        {panelOpen && (
          <Paper variant="outlined" sx={{ p: 2, mb: 1 }} data-testid="filter-panel">
            {filters.map((f) => {
              const fieldDef = filterableFields.find(ff => ff.field === f.field);
              return (
                <Box key={f.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <IconButton size="small" onClick={() => removeFilter(f.id)}><CloseIcon fontSize="small" /></IconButton>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Column</InputLabel>
                    <Select value={f.field} label="Column" onChange={(e) => updateFilter(f.id, { field: e.target.value })}>
                      {filterableFields.map(ff => <MenuItem key={ff.field} value={ff.field}>{ff.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select value={f.operator} label="Operator" disabled><MenuItem value="is">is</MenuItem></Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Value</InputLabel>
                    <Select value={f.value} label="Value" onChange={(e) => updateFilter(f.id, { value: e.target.value })}>
                      {(fieldDef?.options || []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              );
            })}
            <Button size="small" startIcon={<AddIcon />} onClick={addFilter} data-testid="add-filter-button">
              Add filter
            </Button>
          </Paper>
        )}
        <div style={{ height: 350 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableColumnFilter
            disableRowSelectionOnClick
            data-testid="datagrid-orders"
          />
        </div>
      </CardContent>
    </Card>
  );
}
