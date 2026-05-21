'use client';

/**
 * data_table_filterable-mui-T04: Column menu: Filter Country = Germany
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered with a single MUI X DataGrid titled "Orders".
 *
 * The grid uses default density and scale. Column headers show a menu icon on hover; clicking opens the column menu.
 *
 * The Country column is a singleSelect type. The column menu includes an item labeled "Filter". Selecting it opens the filter
 * panel with Country preselected.
 *
 * Initial state: no filters active.
 *
 * Success: Filter model contains exactly one item: Country equals "Germany".
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
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
  { id: 2, orderId: 'ORD-002', customer: 'Bob', country: 'Germany', status: 'Shipped', amount: 230 },
  { id: 3, orderId: 'ORD-003', customer: 'Carol', country: 'UK', status: 'Delivered', amount: 90 },
  { id: 4, orderId: 'ORD-004', customer: 'David', country: 'Germany', status: 'Pending', amount: 340 },
  { id: 5, orderId: 'ORD-005', customer: 'Eva', country: 'France', status: 'Shipped', amount: 120 },
  { id: 6, orderId: 'ORD-006', customer: 'Frank', country: 'Japan', status: 'Cancelled', amount: 75 },
  { id: 7, orderId: 'ORD-007', customer: 'Grace', country: 'Germany', status: 'Delivered', amount: 199 },
  { id: 8, orderId: 'ORD-008', customer: 'Henry', country: 'Austria', status: 'Pending', amount: 560 },
];

const countryOptions = ['USA', 'Germany', 'UK', 'France', 'Japan', 'Austria', 'Canada', 'Australia'];

const columns: GridColDef[] = [
  { field: 'orderId', headerName: 'Order ID', width: 120 },
  { field: 'customer', headerName: 'Customer', width: 120 },
  {
    field: 'country',
    headerName: 'Country',
    width: 120,
    type: 'singleSelect',
    valueOptions: countryOptions,
  },
  { field: 'status', headerName: 'Status', width: 120 },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 100,
    type: 'number',
    valueFormatter: (value: number) => `$${value}`,
  },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const items = filterModel.items || [];
    const hasQuickFilter = filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0;
    
    if (
      items.length === 1 &&
      items[0].field === 'country' &&
      items[0].operator === 'is' &&
      items[0].value === 'Germany' &&
      !hasQuickFilter &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filterModel, onSuccess]);

  const canonicalFilterModel: FilterModel = {
    table_id: 'orders_datagrid',
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
          Orders
        </Typography>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={ordersData}
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
            data-testid="datagrid-orders"
            data-filter-model={JSON.stringify(canonicalFilterModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
