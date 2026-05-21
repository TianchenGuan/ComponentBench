'use client';

/**
 * button-mui-T07: View invoice from table row
 * 
 * Compact invoices table with three rows: Invoice 0929, 0930, 0931.
 * Each row has a small "View" button.
 * Task: Click "View" for Invoice 0931.
 */

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface InvoiceRow {
  id: string;
  date: string;
  amount: string;
}

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [viewedInvoice, setViewedInvoice] = useState<string | null>(null);

  const handleView = (invoiceId: string) => {
    setViewedInvoice(invoiceId);
    if (invoiceId === 'Invoice 0931') {
      onSuccess();
    }
  };

  const invoices: InvoiceRow[] = [
    { id: 'Invoice 0929', date: '2024-01-15', amount: '$150.00' },
    { id: 'Invoice 0930', date: '2024-01-20', amount: '$275.50' },
    { id: 'Invoice 0931', date: '2024-01-25', amount: '$89.99' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, width: 600 }}>
      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table size="small" data-table-id="mui-invoices-table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleView(invoice.id)}
                    data-testid={`mui-btn-view-${invoice.id.toLowerCase().replace(/\s+/g, '-')}`}
                    data-row-key={invoice.id}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {viewedInvoice && (
        <Paper sx={{ width: 200, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Previewing:
          </Typography>
          <Typography variant="body1">{viewedInvoice}</Typography>
        </Paper>
      )}
    </Box>
  );
}
