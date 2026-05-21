'use client';

/**
 * data_table_filterable-mui-T02: DataGrid: Quick filter text
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered with one MUI X DataGrid titled "Customers".
 *
 * Toolbar configuration: the built-in toolbar includes a visible Quick filter text box (placeholder "Search…" or "Quick
 * filter").
 *
 * Initial state: no column filters active; quick filter box is empty.
 *
 * Success: Quick/global filter text equals "alicia" (case-insensitive, trimmed). No column filters are active.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, TextField, InputAdornment } from '@mui/material';
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
  { id: 2, name: 'Alicia Mendez', email: 'alicia@example.com', status: 'Active', country: 'Spain' },
  { id: 3, name: 'Bob Smith', email: 'bob@example.com', status: 'Trial', country: 'Canada' },
  { id: 4, name: 'Carol White', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: 5, name: 'David Brown', email: 'david@example.com', status: 'Active', country: 'Germany' },
  { id: 6, name: 'Eva Martinez', email: 'eva@example.com', status: 'Cancelled', country: 'France' },
  { id: 7, name: 'Felicia Wong', email: 'felicia@example.com', status: 'Active', country: 'Singapore' },
  { id: 8, name: 'Grace Kim', email: 'grace@example.com', status: 'Trial', country: 'Australia' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'country', headerName: 'Country', width: 120 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [quickFilter, setQuickFilter] = useState('');
  const successFiredRef = useRef(false);

  // Filter rows based on quick filter text
  const filteredRows = quickFilter.trim()
    ? customersData.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(quickFilter.toLowerCase().trim())
        )
      )
    : customersData;

  // Check success condition
  useEffect(() => {
    if (
      quickFilter.toLowerCase().trim() === 'alicia' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [quickFilter, onSuccess]);

  const canonicalFilterModel: FilterModel = {
    table_id: 'customers_datagrid',
    logic_operator: 'AND',
    global_filter: filterModel.quickFilterValues?.join(' ') || null,
    column_filters: (filterModel.items || [])
      .filter(item => item.value !== undefined && item.value !== '')
      .map(item => ({
        column: item.field.charAt(0).toUpperCase() + item.field.slice(1),
        operator: 'equals' as const,
        value: item.value,
      })),
  };

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Customers
        </Typography>
        <TextField
          placeholder="Quick filter…"
          size="small"
          value={quickFilter}
          onChange={(e) => setQuickFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1, width: 250 }}
          data-testid="quick-filter-input"
        />
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
