'use client';

/**
 * data_table_filterable-mui-T07: Reports page: Filter Customers grid (not Vendors)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=2; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered with no extra clutter.
 *
 * Two MUI X DataGrids are stacked vertically inside the card: "Customers" on top and "Vendors" below. Both have a Country
 * column and a Filters button in their toolbars.
 *
 * Initial state: no active filters in either grid.
 *
 * Disambiguation requirement: only Customers must be filtered; Vendors must remain unfiltered.
 *
 * Success: Customers filter model contains exactly one item: Country equals Brazil. Vendors grid has no active filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridFilterModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { TaskComponentProps, FilterModel } from '../types';

interface TableData {
  id: number;
  name: string;
  email: string;
  country: string;
}

const customersData: TableData[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', country: 'USA' },
  { id: 2, name: 'Bob', email: 'bob@example.com', country: 'Brazil' },
  { id: 3, name: 'Carol', email: 'carol@example.com', country: 'UK' },
  { id: 4, name: 'David', email: 'david@example.com', country: 'Brazil' },
  { id: 5, name: 'Eva', email: 'eva@example.com', country: 'Germany' },
];

const vendorsData: TableData[] = [
  { id: 1, name: 'VendorCo', email: 'vendor1@example.com', country: 'USA' },
  { id: 2, name: 'SupplierX', email: 'vendor2@example.com', country: 'Brazil' },
  { id: 3, name: 'GlobalParts', email: 'vendor3@example.com', country: 'China' },
  { id: 4, name: 'FastShip', email: 'vendor4@example.com', country: 'Japan' },
  { id: 5, name: 'QualityFirst', email: 'vendor5@example.com', country: 'Germany' },
];

const countryOptions = ['USA', 'Brazil', 'UK', 'Germany', 'China', 'Japan', 'France'];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 200 },
  {
    field: 'country',
    headerName: 'Country',
    width: 120,
    type: 'singleSelect',
    valueOptions: countryOptions,
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [customersFilterModel, setCustomersFilterModel] = useState<GridFilterModel>({ items: [] });
  const [vendorsFilterModel, setVendorsFilterModel] = useState<GridFilterModel>({ items: [] });
  const successFiredRef = useRef(false);

  // Check success condition
  useEffect(() => {
    const customerItems = customersFilterModel.items || [];
    const vendorItems = vendorsFilterModel.items || [];
    const customersHasQuickFilter = customersFilterModel.quickFilterValues && customersFilterModel.quickFilterValues.length > 0;
    const vendorsHasQuickFilter = vendorsFilterModel.quickFilterValues && vendorsFilterModel.quickFilterValues.length > 0;
    const vendorsHasColumnFilter = vendorItems.some(item => item.value !== undefined && item.value !== '');
    
    if (
      customerItems.length === 1 &&
      customerItems[0].field === 'country' &&
      customerItems[0].operator === 'is' &&
      customerItems[0].value === 'Brazil' &&
      !customersHasQuickFilter &&
      !vendorsHasColumnFilter &&
      !vendorsHasQuickFilter &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [customersFilterModel, vendorsFilterModel, onSuccess]);

  const customersCanonicalFilterModel: FilterModel = {
    table_id: 'customers_datagrid',
    logic_operator: 'AND',
    global_filter: customersFilterModel.quickFilterValues?.join(' ') || null,
    column_filters: (customersFilterModel.items || [])
      .filter(item => item.value !== undefined && item.value !== '')
      .map(item => ({
        column: item.field.charAt(0).toUpperCase() + item.field.slice(1),
        operator: 'equals' as const,
        value: item.value,
      })),
  };

  const vendorsCanonicalFilterModel: FilterModel = {
    table_id: 'vendors_datagrid',
    logic_operator: 'AND',
    global_filter: vendorsFilterModel.quickFilterValues?.join(' ') || null,
    column_filters: (vendorsFilterModel.items || [])
      .filter(item => item.value !== undefined && item.value !== '')
      .map(item => ({
        column: item.field.charAt(0).toUpperCase() + item.field.slice(1),
        operator: 'equals' as const,
        value: item.value,
      })),
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        {/* Customers DataGrid */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Customers
        </Typography>
        <Box sx={{ height: 250, mb: 4 }}>
          <DataGrid
            rows={customersData}
            columns={columns}
            filterModel={customersFilterModel}
            onFilterModelChange={setCustomersFilterModel}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            disableRowSelectionOnClick
            data-testid="datagrid-customers"
            data-filter-model={JSON.stringify(customersCanonicalFilterModel)}
          />
        </Box>

        {/* Vendors DataGrid */}
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Vendors
        </Typography>
        <Box sx={{ height: 250 }}>
          <DataGrid
            rows={vendorsData}
            columns={columns}
            filterModel={vendorsFilterModel}
            onFilterModelChange={setVendorsFilterModel}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            disableRowSelectionOnClick
            data-testid="datagrid-vendors"
            data-filter-model={JSON.stringify(vendorsCanonicalFilterModel)}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
