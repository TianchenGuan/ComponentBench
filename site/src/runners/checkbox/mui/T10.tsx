'use client';

/**
 * checkbox-mui-T10: Select Invoice #1048 row (table checkbox)
 *
 * Layout: table cell scene.
 * A card titled "Invoices" contains a table with 4 rows. The first column is a checkbox used to select a row.
 * Each row shows an invoice identifier in the second column: Invoice #1045, #1046, #1047, #1048.
 * Initial state: all row-selection checkboxes are unchecked.
 * Task target: the checkbox in the row labeled "Invoice #1048".
 * No Save/Apply button exists; selecting a row updates immediately.
 * Clutter: table header and numeric columns add visual density, but do not affect the checker.
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
  Checkbox,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface InvoiceRow {
  id: string;
  number: string;
  amount: string;
  date: string;
  selected: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([
    { id: '1045', number: 'Invoice #1045', amount: '$1,250.00', date: '2024-01-15', selected: false },
    { id: '1046', number: 'Invoice #1046', amount: '$890.50', date: '2024-01-18', selected: false },
    { id: '1047', number: 'Invoice #1047', amount: '$2,340.00', date: '2024-01-22', selected: false },
    { id: '1048', number: 'Invoice #1048', amount: '$567.25', date: '2024-01-25', selected: false },
  ]);

  const handleSelectionChange = (id: string, checked: boolean) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, selected: checked } : inv)
    );

    // Success when Invoice #1048 is selected
    if (id === '1048' && checked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Invoices
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">Select</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={invoice.selected}
                      onChange={(e) => handleSelectionChange(invoice.id, e.target.checked)}
                      data-testid={`row-${invoice.id}-select-cb`}
                    />
                  </TableCell>
                  <TableCell>{invoice.number}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
