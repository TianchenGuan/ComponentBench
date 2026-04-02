'use client';

/**
 * data_table_sortable-mui-T17: Payments - match reference badge sort (visual guidance)
 *
 * Single MUI X DataGrid titled "Payments" with a visual reference badge.
 * - Badge depicts a column header mock with arrow (no text explanation).
 * - Reference corresponds to Amount descending.
 * - Columns: Payment ID, Payer, Amount, Method, Date.
 * - Initial state: unsorted.
 *
 * Distractors: disabled "Filter" button.
 * Success: Amount sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Paper } from '@mui/material';
import { FilterList, ArrowDownward } from '@mui/icons-material';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import type { TaskComponentProps, SortModel } from '../types';

interface PaymentData {
  id: string;
  paymentId: string;
  payer: string;
  amount: number;
  method: string;
  date: string;
}

const paymentsData: PaymentData[] = [
  { id: '1', paymentId: 'PAY-001', payer: 'Acme Corp', amount: 1250.00, method: 'Wire', date: '2024-02-15' },
  { id: '2', paymentId: 'PAY-002', payer: 'TechStart', amount: 890.50, method: 'Card', date: '2024-02-14' },
  { id: '3', paymentId: 'PAY-003', payer: 'Global Systems', amount: 2340.00, method: 'Wire', date: '2024-02-13' },
  { id: '4', paymentId: 'PAY-004', payer: 'DataFlow', amount: 567.25, method: 'ACH', date: '2024-02-12' },
  { id: '5', paymentId: 'PAY-005', payer: 'CloudNet', amount: 1780.00, method: 'Card', date: '2024-02-11' },
  { id: '6', paymentId: 'PAY-006', payer: 'Innovate Labs', amount: 3200.00, method: 'Wire', date: '2024-02-10' },
  { id: '7', paymentId: 'PAY-007', payer: 'QuickShip', amount: 445.00, method: 'ACH', date: '2024-02-09' },
  { id: '8', paymentId: 'PAY-008', payer: 'FinanceHub', amount: 6100.00, method: 'Wire', date: '2024-02-08' },
];

const columns: GridColDef[] = [
  { field: 'paymentId', headerName: 'Payment ID', width: 110, sortable: false },
  { field: 'payer', headerName: 'Payer', width: 130, sortable: false },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 110,
    valueFormatter: (value: number) => `$${value.toFixed(2)}`,
  },
  { field: 'method', headerName: 'Method', width: 90, sortable: false },
  { field: 'date', headerName: 'Date', width: 110, sortable: false },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  // Check success condition
  useEffect(() => {
    if (sortModel.length === 1 && sortModel[0].field === 'amount' && sortModel[0].sort === 'desc') {
      onSuccess();
    }
  }, [sortModel, onSuccess]);

  const canonicalSortModel: SortModel = sortModel.map((item: GridSortModel[number], idx: number) => ({
    column_key: item.field,
    direction: item.sort || 'asc',
    priority: idx + 1,
  }));

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
              Payments
            </Typography>
            <Button startIcon={<FilterList />} disabled variant="outlined" size="small">
              Filter
            </Button>
          </Box>

          {/* Reference badge */}
          <Paper
            variant="outlined"
            sx={{ p: 1.5, bgcolor: '#fafafa' }}
            data-reference-sort="amount:desc"
          >
            <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 0.5 }}>
              Reference
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                bgcolor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">Amount</Typography>
              <ArrowDownward sx={{ fontSize: 14 }} />
            </Box>
          </Paper>
        </Box>

        <div style={{ height: 400 }}>
          <DataGrid
            rows={paymentsData}
            columns={columns}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            data-testid="grid-payments"
            data-sort-model={JSON.stringify(canonicalSortModel)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
