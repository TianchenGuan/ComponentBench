'use client';

/**
 * data_table_filterable-mui-T06: Compact density: Age >= 40
 *
 * Scene context: theme=light; spacing=compact; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered. The Customers DataGrid is rendered in compact density (reduced row height and tighter
 * header spacing).
 *
 * Age is a numeric column. Filtering is done via the Filters toolbar button which opens the filter panel.
 *
 * In the filter row, you must choose column Age, operator ">=" (greater than or equal), and enter the numeric value 40.
 *
 * Initial state: no filters active.
 *
 * Success: Single filter item: Age >= 40.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../types';

interface CustomerData {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

const customersData: CustomerData[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 45, status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', age: 35, status: 'Paused' },
  { id: 4, name: 'David Brown', email: 'david@example.com', age: 52, status: 'Active' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', age: 40, status: 'Active' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', age: 38, status: 'Cancelled' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', age: 62, status: 'Active' },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', age: 33, status: 'Active' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', headerName: 'Age', width: 80, type: 'number' },
  { field: 'status', headerName: 'Status', width: 100 },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const items = filterModel.items || [];
    const hasQuickFilter = filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0;
    
    if (
      items.length === 1 &&
      items[0].field === 'age' &&
      items[0].operator === '>=' &&
      Number(items[0].value) === 40 &&
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
      .filter(item => item.value !== undefined && item.value !== '')
      .map(item => ({
        column: item.field.charAt(0).toUpperCase() + item.field.slice(1),
        operator: item.operator === '>=' ? 'gte' : 'equals' as const,
        value: Number(item.value),
      })),
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Customers
        </Typography>
        <div style={{ height: 350 }}>
          <DataGrid
            rows={customersData}
            columns={columns}
            density="compact"
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
