'use client';

/**
 * select_custom_single-mui-T08: Set Invoice A-039 payment terms to Net 45
 *
 * Layout: table_cell with compact spacing and small controls.
 * A table titled "Invoices" is centered on the page. The "Payment terms" column uses MUI Select components embedded in cells.
 *
 * Instances: 3 selects (one per visible row):
 * - Invoice A-038 → Payment terms
 * - Invoice A-039 → Payment terms (TARGET)
 * - Invoice A-040 → Payment terms
 *
 * Initial state for A-039: "Net 30".
 * Options in each Payment terms menu: Due on receipt, Net 15, Net 30, Net 45.
 *
 * The select triggers are small and aligned in a dense grid. Opening one shows a menu popover; selecting applies immediately.
 *
 * Clutter: above the table there is a pagination control and a "Download CSV" button; these are distractors and not required.
 * No extra confirmation is needed.
 *
 * Success: The Payment terms Select in the row labeled "Invoice A-039" has selected value exactly "Net 45".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const paymentOptions = ['Due on receipt', 'Net 15', 'Net 30', 'Net 45'];

interface InvoiceData {
  id: string;
  invoiceId: string;
  date: string;
  amount: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [paymentTerms, setPaymentTerms] = useState<Record<string, string>>({
    'A-038': 'Net 15',
    'A-039': 'Net 30',
    'A-040': 'Due on receipt',
  });

  const handleChange = (invoiceId: string, event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setPaymentTerms(prev => ({ ...prev, [invoiceId]: newValue }));
    if (invoiceId === 'A-039' && newValue === 'Net 45') {
      onSuccess();
    }
  };

  const invoices: InvoiceData[] = [
    { id: 'A-038', invoiceId: 'Invoice A-038', date: '2024-01-10', amount: '$1,250.00' },
    { id: 'A-039', invoiceId: 'Invoice A-039', date: '2024-01-15', amount: '$890.50' },
    { id: 'A-040', invoiceId: 'Invoice A-040', date: '2024-01-20', amount: '$2,340.00' },
  ];

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Invoices</Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Pagination count={5} size="small" />
          <Button size="small" startIcon={<Download />}>Download CSV</Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment terms</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceId}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      data-testid={`payment-terms-${invoice.id}`}
                      value={paymentTerms[invoice.id]}
                      onChange={(e) => handleChange(invoice.id, e)}
                      sx={{ minWidth: 130 }}
                    >
                      {paymentOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
