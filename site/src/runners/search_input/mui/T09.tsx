'use client';

/**
 * search_input-mui-T09: Table header filters: enter Customer search with punctuation
 *
 * Table-cell layout: an Orders data table with a header filter row.
 * There are THREE MUI TextField search inputs embedded in header cells, each labeled by column name:
 *   • "Order ID"
 *   • "Customer"
 *   • "Status"
 * The fields use default spacing (not the densest compact mode), but are still visually smaller than full-width form fields because they live in header cells.
 * Initial state: all three are empty. Each field submits its filter on Enter and shows a small chip under the column header when applied.
 * Clutter is medium: sortable column headers and a small toolbar (Refresh, Columns) are visible, but the view is not a full dashboard.
 * Feedback: after submitting the Customer filter, a chip appears reading "Customer: O'Reilly".
 *
 * Success: In the table header filter row, the search field for the "Customer" column has submitted_query equal to "O'Reilly".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, TextField, Typography, Chip, Box, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import type { TaskComponentProps } from '../types';

const sampleData = [
  { orderId: 'ORD-001', customer: 'Smith', status: 'Pending' },
  { orderId: 'ORD-002', customer: "O'Reilly", status: 'Shipped' },
  { orderId: 'ORD-003', customer: 'Johnson', status: 'Delivered' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerSubmitted, setCustomerSubmitted] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleCustomerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setCustomerSubmitted(customerFilter);
      if (customerFilter === "O'Reilly" && !hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 650 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Orders</Typography>
          <Box>
            <IconButton size="small"><RefreshIcon /></IconButton>
            <IconButton size="small"><ViewColumnIcon /></IconButton>
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2">Order ID</Typography>
                <TextField
                  size="small"
                  placeholder="Filter…"
                  value={orderIdFilter}
                  onChange={(e) => setOrderIdFilter(e.target.value)}
                  sx={{ mt: 0.5 }}
                  inputProps={{ 'data-testid': 'filter-orderid' }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Customer</Typography>
                <TextField
                  size="small"
                  placeholder="Filter…"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  onKeyDown={handleCustomerKeyDown}
                  sx={{ mt: 0.5 }}
                  inputProps={{ 'data-testid': 'filter-customer' }}
                />
                {customerSubmitted && (
                  <Chip
                    label={`Customer: ${customerSubmitted}`}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Status</Typography>
                <TextField
                  size="small"
                  placeholder="Filter…"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ mt: 0.5 }}
                  inputProps={{ 'data-testid': 'filter-status' }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.orderId}>
                <TableCell>{row.orderId}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
