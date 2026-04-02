'use client';

/**
 * data_table_filterable-mui-T01: DataGrid: Filter Status = Active
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. A single MUI X DataGrid titled "Customers" is visible with default density/spacing and
 * default scale.
 *
 * The grid shows a toolbar above the column headers with a "Filters" button. Clicking it opens the built-in filter panel.
 *
 * Filter panel UI: one filter row with (1) Column dropdown, (2) Operator dropdown, and (3) Value input. Status is a singleSelect
 * column so the value control is a dropdown.
 *
 * Initial state: no filters active; filter panel closed.
 *
 * Success: Filter model contains exactly one item: Status equals "Active".
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
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
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'Trial', country: 'Canada' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', status: 'Paused', country: 'UK' },
  { id: 4, name: 'David Brown', email: 'david@example.com', status: 'Active', country: 'Germany' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', status: 'Cancelled', country: 'France' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', status: 'Active', country: 'Japan' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', status: 'Trial', country: 'Australia' },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', status: 'Active', country: 'China' },
];

const statusOptions = ['Active', 'Trial', 'Paused', 'Cancelled'];

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

export default function T01({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const items = filterModel.items || [];
    if (
      items.length === 1 &&
      items[0].field === 'status' &&
      items[0].operator === 'is' &&
      items[0].value === 'Active' &&
      !filterModel.quickFilterValues?.length &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filterModel, onSuccess]);

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
        <div style={{ height: 400 }}>
          <DataGrid
            rows={customersData}
            columns={columns}
            filterModel={filterModel}
            onFilterModelChange={setFilterModel}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            disableRowSelectionOnClick
            data-testid="datagrid-customers"
            data-filter-model={JSON.stringify(canonicalFilterModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
