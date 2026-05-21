'use client';

/**
 * data_grid_row_selection-mui-T09: Select two customers across paginated pages
 *
 * The page shows an isolated card centered in the viewport titled "Customers" with a MUI X DataGrid.
 * Checkbox selection is enabled. The grid uses client-side pagination with page size 5 and 3 pages total;
 * page navigation controls appear in the footer.
 * Spacing is comfortable and scale is default. Columns: Customer ID, Name, Plan.
 * Initial state: no rows selected and the grid starts on page 1 (showing Customer IDs 1–5).
 * Customer ID 2 is on page 1; Customer ID 11 is on page 3. Selection persists when navigating pages, so
 * both must be selected at the same time.
 *
 * Success: selected_row_ids equals [2, 11]
 */

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface CustomerData {
  id: number;
  customerId: number;
  name: string;
  plan: string;
}

// 15 customers across 3 pages
const customersData: CustomerData[] = [
  { id: 1, customerId: 1, name: 'Alice Chen', plan: 'Pro' },
  { id: 2, customerId: 2, name: 'Bob Martinez', plan: 'Basic' },
  { id: 3, customerId: 3, name: 'Carol Williams', plan: 'Enterprise' },
  { id: 4, customerId: 4, name: 'David Kim', plan: 'Pro' },
  { id: 5, customerId: 5, name: 'Eva Schmidt', plan: 'Basic' },
  { id: 6, customerId: 6, name: 'Frank Jones', plan: 'Pro' },
  { id: 7, customerId: 7, name: 'Grace Liu', plan: 'Enterprise' },
  { id: 8, customerId: 8, name: 'Henry Wilson', plan: 'Basic' },
  { id: 9, customerId: 9, name: 'Iris Chang', plan: 'Pro' },
  { id: 10, customerId: 10, name: 'Jack Brown', plan: 'Basic' },
  { id: 11, customerId: 11, name: 'Karen Lee', plan: 'Enterprise' },
  { id: 12, customerId: 12, name: 'Leo Garcia', plan: 'Pro' },
  { id: 13, customerId: 13, name: 'Mia Taylor', plan: 'Basic' },
  { id: 14, customerId: 14, name: 'Noah Davis', plan: 'Pro' },
  { id: 15, customerId: 15, name: 'Olivia Moore', plan: 'Enterprise' },
];

const columns: GridColDef[] = [
  { field: 'customerId', headerName: 'Customer ID', width: 110 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'plan', headerName: 'Plan', width: 100 },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const selectedIds = Array.from(selectionModel.ids) as number[];

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedIds, [2, 11])) {
      onSuccess();
    }
  }, [selectedIds, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
          Customers
        </Typography>
        <div
          style={{ height: 370 }}
          data-testid="customers-grid"
          data-selected-row-ids={JSON.stringify(selectedIds)}
        >
          <DataGrid
            rows={customersData}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(newModel) => setSelectionModel(newModel)}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            keepNonExistentRowsSelected
            disableColumnMenu
          />
        </div>
      </CardContent>
    </Card>
  );
}
