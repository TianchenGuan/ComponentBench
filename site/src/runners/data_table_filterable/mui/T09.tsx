'use client';

/**
 * data_table_filterable-mui-T09: Use OR logic in filter model
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered; light theme; default density/scale.
 *
 * A single MUI X DataGrid titled "Customers".
 *
 * Filtering UI: open the Filters panel. The panel supports multiple filter items and includes a control to switch the logic
 * operator between AND and OR.
 *
 * Initial state: no filters active; logic operator is the default (AND).
 *
 * To achieve the goal, you must add two filter items on the Status column and set the logic operator to OR.
 *
 * Success: Filter model has logicOperator=OR. There are exactly two filter items: Status equals Trial; Status equals Paused.
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

export default function T09({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition: "is any of" [Trial, Paused] on Status column
  useEffect(() => {
    const items = filterModel.items || [];

    // Accept either:
    // 1) "isAnyOf" with both Trial and Paused
    // 2) Two separate "is" filters with OR logic
    const anyOfFilter = items.find(i =>
      i.field === 'status' && i.operator === 'isAnyOf' &&
      Array.isArray(i.value) && i.value.includes('Trial') && i.value.includes('Paused')
    );

    const logicOperator = filterModel.logicOperator || 'and';
    const trialFilter = items.find(i => i.field === 'status' && i.operator === 'is' && i.value === 'Trial');
    const pausedFilter = items.find(i => i.field === 'status' && i.operator === 'is' && i.value === 'Paused');
    const orWithTwoFilters = logicOperator === 'or' && items.length === 2 && trialFilter && pausedFilter;

    if ((anyOfFilter || orWithTwoFilters) && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filterModel, onSuccess]);

  const canonicalFilterModel: FilterModel = {
    table_id: 'customers_datagrid',
    logic_operator: ((filterModel.logicOperator || 'and').toUpperCase()) as 'AND' | 'OR',
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
