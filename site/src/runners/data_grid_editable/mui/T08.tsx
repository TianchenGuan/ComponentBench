'use client';

/**
 * data_grid_editable-mui-T08: Use quick filter to locate a row and edit a cell
 *
 * The page is arranged like a small dashboard with the main content anchored near the top-left.
 * The primary component is a MUI X DataGrid titled "Invoices".
 *
 * Grid configuration:
 * - Light theme; comfortable spacing; default scale.
 * - One grid instance.
 * - Columns: Invoice (row id key, e.g., INV-1042), Customer, Amount, Status (editable singleSelect), Actions.
 * - The DataGrid toolbar is enabled and includes a "Search" / "Quick filter" text field that filters visible rows as you type.
 *
 * Task-relevant behavior:
 * - After filtering, you can edit the Status cell of the matching row using the standard singleSelect editor.
 * - Selecting a status commits immediately.
 *
 * Initial state:
 * - Invoice INV-1042 exists but may not be visible until you filter or scroll.
 * - INV-1042 Status is not "Paid".
 *
 * Clutter:
 * - Two small KPI tiles sit above the grid but are unrelated.
 */

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Paper, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRowModel, GridToolbarQuickFilter } from '@mui/x-data-grid';
import type { TaskComponentProps, MuiInvoiceRow } from '../types';

// Generate 50 invoices so INV-1042 requires filtering or scrolling
const generateInvoices = (): MuiInvoiceRow[] => {
  const customers = ['Acme Corp', 'Tech Solutions', 'Global Inc', 'StartUp LLC', 'Enterprise Co'];
  const statuses: MuiInvoiceRow['status'][] = ['Pending', 'Paid', 'Overdue'];
  const invoices: MuiInvoiceRow[] = [];
  for (let i = 1; i <= 50; i++) {
    const invId = `INV-10${i.toString().padStart(2, '0')}`;
    invoices.push({
      id: invId,
      customer: customers[(i - 1) % customers.length],
      amount: Math.floor(Math.random() * 9000) + 100,
      status: i === 42 ? 'Pending' : statuses[(i - 1) % statuses.length],
    });
  }
  return invoices;
};

const initialRows = generateInvoices();

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Invoice', width: 100, editable: false },
  { field: 'customer', headerName: 'Customer', width: 150, editable: false },
  { field: 'amount', headerName: 'Amount', width: 100, type: 'number', valueFormatter: (value: number) => `$${value}` },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    editable: true,
    type: 'singleSelect',
    valueOptions: ['Pending', 'Paid', 'Overdue'],
  },
];

function QuickSearchToolbar() {
  return (
    <Box sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </Box>
  );
}

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<MuiInvoiceRow[]>(initialRows);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = newRow as MuiInvoiceRow;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  // Check success condition after rows update
  useEffect(() => {
    const targetRow = rows.find((r) => r.id === 'INV-1042');
    if (targetRow && targetRow.status === 'Paid' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [rows, hasSucceeded, onSuccess]);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            <Typography variant="h5">$125,430</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">Pending</Typography>
            <Typography variant="h5">12</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Card sx={{ width: 550 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Invoices
          </Typography>
          <Box sx={{ height: 400 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={(error) => console.error(error)}
              disableRowSelectionOnClick
              slots={{ toolbar: QuickSearchToolbar }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10]}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
