'use client';

/**
 * data_table_filterable-mui-T08: Dark mode: Status is any of (Trial, Paused, Cancelled)
 *
 * Scene context: theme=dark; spacing=comfortable; layout=isolated_card; placement=bottom_right; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Theme: dark. Layout: isolated_card, but the grid is positioned in the bottom-right quadrant of the viewport.
 *
 * A single MUI X DataGrid titled "Customers".
 *
 * Filtering: open the Filters panel from the toolbar. Status is a singleSelect column with multiple possible values.
 *
 * To select multiple statuses, the operator dropdown includes an "is any of" / "isAnyOf" operator; choosing it turns the
 * value control into a multi-select list.
 *
 * Initial state: no active filters.
 *
 * Success: Status filter uses a multi-value operator (isAnyOf) with exactly the set {Trial, Paused, Cancelled}.
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
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', status: 'Trial', country: 'Japan' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', status: 'Paused', country: 'Australia' },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', status: 'Cancelled', country: 'China' },
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

export default function T08({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const items = filterModel.items || [];
    const hasQuickFilter = filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0;
    
    if (
      items.length === 1 &&
      items[0].field === 'status' &&
      items[0].operator === 'isAnyOf' &&
      Array.isArray(items[0].value) &&
      items[0].value.length === 3 &&
      items[0].value.includes('Trial') &&
      items[0].value.includes('Paused') &&
      items[0].value.includes('Cancelled') &&
      !hasQuickFilter &&
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
      .filter(item => item.value !== undefined && (Array.isArray(item.value) ? item.value.length > 0 : item.value !== ''))
      .map(item => ({
        column: item.field.charAt(0).toUpperCase() + item.field.slice(1),
        operator: item.operator === 'isAnyOf' ? 'isAnyOf' : 'equals' as const,
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
