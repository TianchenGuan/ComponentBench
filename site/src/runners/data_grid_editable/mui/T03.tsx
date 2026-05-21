'use client';

/**
 * data_grid_editable-mui-T03: Select a status option in a single-select cell
 *
 * The page contains one MUI X DataGrid inside an isolated card titled "Orders".
 * The Status column is configured as a singleSelect editable column.
 *
 * Interaction details:
 * - Enter edit mode on the Status cell (double click or press Enter when focused).
 * - A select dropdown appears within the cell editor listing: New, Processing, Shipped, Cancelled.
 * - Selecting an option commits it and returns the cell to view mode.
 *
 * Scene configuration:
 * - Light theme; comfortable spacing; default scale.
 * - One grid instance.
 * - Initial state: row ID 2 exists and Status is not "Shipped".
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import type { TaskComponentProps, MuiOrderRow } from '../types';

const initialRows: MuiOrderRow[] = [
  { id: 1, orderId: 'ORD-001', customer: 'John Smith', amount: 250, status: 'New' },
  { id: 2, orderId: 'ORD-002', customer: 'Jane Doe', amount: 180, status: 'Processing' },
  { id: 3, orderId: 'ORD-003', customer: 'Bob Johnson', amount: 420, status: 'Shipped' },
  { id: 4, orderId: 'ORD-004', customer: 'Alice Brown', amount: 95, status: 'Cancelled' },
  { id: 5, orderId: 'ORD-005', customer: 'Charlie Wilson', amount: 310, status: 'New' },
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'orderId', headerName: 'Order ID', width: 100, editable: false },
  { field: 'customer', headerName: 'Customer', width: 150, editable: true },
  { field: 'amount', headerName: 'Amount', width: 100, type: 'number', editable: true },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['New', 'Processing', 'Shipped', 'Cancelled'],
  },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<MuiOrderRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as MuiOrderRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 2);
    if (targetRow && targetRow.status === 'Shipped' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Orders
        </Typography>
        <Box sx={{ height: 350 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => console.error(error)}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </CardContent>
    </Card>
  );
}
