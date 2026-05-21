'use client';

/**
 * data_table_filterable-mui-T10: Dashboard: Match reference chips (Japan + Shipped)
 *
 * Scene context: theme=light; spacing=comfortable; layout=dashboard; placement=center; scale=default;
 * instances=1; guidance=mixed; clutter=high.
 *
 * Layout: dashboard with high clutter. Visible elements include a left navigation rail, a top app bar with search, three
 * KPI cards, and two secondary panels.
 *
 * The target component is a single MUI X DataGrid titled "Orders". Above the grid, a small "Target filters" strip shows
 * two chips (visual reference) for the desired Country and Status values.
 *
 * The grid toolbar includes a Filters button that opens the filter panel.
 *
 * Initial state: no filters active.
 *
 * Success: Filters match the reference chips: Country equals Japan; Status equals Shipped.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box, Chip, AppBar, Toolbar, Paper, Button, FormControl, InputLabel, Select, MenuItem, IconButton, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  id: number;
  orderId: string;
  customer: string;
  country: string;
  status: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { id: 1, orderId: 'ORD-001', customer: 'Alice', country: 'USA', status: 'Pending', amount: 150 },
  { id: 2, orderId: 'ORD-002', customer: 'Bob', country: 'Japan', status: 'Shipped', amount: 230 },
  { id: 3, orderId: 'ORD-003', customer: 'Carol', country: 'UK', status: 'Delivered', amount: 90 },
  { id: 4, orderId: 'ORD-004', customer: 'David', country: 'Japan', status: 'Shipped', amount: 340 },
  { id: 5, orderId: 'ORD-005', customer: 'Eva', country: 'France', status: 'Pending', amount: 120 },
  { id: 6, orderId: 'ORD-006', customer: 'Frank', country: 'Japan', status: 'Delivered', amount: 75 },
  { id: 7, orderId: 'ORD-007', customer: 'Grace', country: 'Germany', status: 'Shipped', amount: 199 },
  { id: 8, orderId: 'ORD-008', customer: 'Henry', country: 'Japan', status: 'Shipped', amount: 560 },
];

const countryOptions = ['USA', 'Japan', 'UK', 'France', 'Germany', 'Canada', 'Australia'];
const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const columns: GridColDef[] = [
  { field: 'orderId', headerName: 'Order ID', width: 100 },
  { field: 'customer', headerName: 'Customer', width: 100 },
  {
    field: 'country',
    headerName: 'Country',
    width: 100,
    type: 'singleSelect',
    valueOptions: countryOptions,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    type: 'singleSelect',
    valueOptions: statusOptions,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 80,
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
  { field: 'orderId', label: 'Order ID', type: 'text' as const, options: [] as string[] },
  { field: 'customer', label: 'Customer', type: 'text' as const, options: [] as string[] },
  { field: 'country', label: 'Country', type: 'select' as const, options: countryOptions },
  { field: 'status', label: 'Status', type: 'select' as const, options: statusOptions },
  { field: 'amount', label: 'Amount', type: 'text' as const, options: [] as string[] },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const successFiredRef = useRef(false);
  const nextId = useRef(1);

  const filteredRows = ordersData.filter(row => {
    return filters.every(f => {
      if (!f.field || !f.value) return true;
      const val = String((row as unknown as Record<string, unknown>)[f.field]);
      if (f.operator === 'contains') return val.toLowerCase().includes(f.value.toLowerCase());
      return val === f.value;
    });
  });

  useEffect(() => {
    const active = filters.filter(f => f.field && f.value);
    const hasCountry = active.some(f => f.field === 'country' && f.value === 'Japan');
    const hasStatus = active.some(f => f.field === 'status' && f.value === 'Shipped');
    if (hasCountry && hasStatus && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filters, onSuccess]);

  const addFilter = () => {
    setFilters([...filters, { id: nextId.current++, field: '', operator: 'is', value: '' }]);
  };
  const removeFilter = (id: number) => setFilters(filters.filter(f => f.id !== id));
  const updateFilter = (id: number, updates: Partial<FilterItem>) => {
    setFilters(filters.map(f => f.id === id ? { ...f, ...updates, ...(updates.field !== undefined ? { value: '' } : {}) } : f));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 900 }}>
      {/* Fake app bar for dashboard clutter */}
      <AppBar position="static" color="default" sx={{ mb: 2 }}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* KPI cards for high clutter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption">Total Orders</Typography>
          <Typography variant="h5">1,234</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption">Revenue</Typography>
          <Typography variant="h5">$45,678</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="caption">Customers</Typography>
          <Typography variant="h5">567</Typography>
        </Paper>
      </Box>

      <Card>
        <CardContent>
          {/* Target filters reference chips */}
          <Box sx={{ 
            mb: 2, 
            p: 1.5, 
            bgcolor: 'grey.100', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.300'
          }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>Target filters:</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Country: Japan" color="primary" size="small" />
              <Chip label="Status: Shipped" color="success" size="small" />
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            Orders
          </Typography>

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
                      <Select value={f.operator} label="Operator" onChange={(e) => updateFilter(f.id, { operator: e.target.value })}>
                        <MenuItem value="is">is</MenuItem>
                        {fieldDef?.type === 'text' && <MenuItem value="contains">contains</MenuItem>}
                      </Select>
                    </FormControl>
                    {fieldDef?.type === 'select' ? (
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Value</InputLabel>
                        <Select value={f.value} label="Value" onChange={(e) => setFilters(filters.map(x => x.id === f.id ? { ...x, value: e.target.value } : x))}>
                          {fieldDef.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </Select>
                      </FormControl>
                    ) : (
                      <TextField
                        size="small"
                        label="Value"
                        value={f.value}
                        onChange={(e) => setFilters(filters.map(x => x.id === f.id ? { ...x, value: e.target.value } : x))}
                        sx={{ minWidth: 140 }}
                      />
                    )}
                  </Box>
                );
              })}
              <Button size="small" startIcon={<AddIcon />} onClick={addFilter} data-testid="add-filter-button">
                Add filter
              </Button>
            </Paper>
          )}

          <div style={{ height: 300 }}>
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
    </Box>
  );
}
