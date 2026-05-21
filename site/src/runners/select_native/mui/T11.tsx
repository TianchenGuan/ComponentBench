'use client';

/**
 * select_native-mui-T11: Update invoice status: INV-1042 to Paid (table cell)
 *
 * Layout: a dashboard table ("Invoices") centered on the page. The table has three rows and several columns:
 * - Invoice ID (text)
 * - Customer (text)
 * - Status (TARGET COLUMN: native selects)
 * - Amount (text)
 *
 * Each row's Status cell contains a small MUI NativeSelect (compact table styling).
 * Status options (label → value) are the same for all rows:
 * - Draft → draft
 * - Sent → sent
 * - Paid → paid
 * - Void → void
 *
 * Rows visible:
 * 1) Invoice ID: INV-1041, Status initial: Sent
 * 2) Invoice ID: INV-1042, Status initial: Draft  ← TARGET ROW
 * 3) Invoice ID: INV-1043, Status initial: Paid
 *
 * Clutter: high — the dashboard also shows a search box, column sort icons, pagination controls, and a non-functional "Export" button.
 * Feedback: changing a row's Status updates the cell immediately; no Save button.
 *
 * Success: The target native select labeled "Status for INV-1042" has selected option value 'paid' (label 'Paid').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, NativeSelect,
  Box, TextField, Button, Table, TableHead, TableBody, TableRow, TableCell,
  TableSortLabel, TablePagination, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
];

const initialInvoices = [
  { id: 'INV-1041', customer: 'Acme Corp', status: 'sent', amount: '$1,234.00' },
  { id: 'INV-1042', customer: 'Tech Inc', status: 'draft', amount: '$567.00' },
  { id: 'INV-1043', customer: 'Global Ltd', status: 'paid', amount: '$890.00' },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setInvoices(prev => 
      prev.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv)
    );
    if (invoiceId === 'INV-1042' && newStatus === 'paid') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 700 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Invoices</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 200 }}
            />
            <Button variant="outlined" size="small">Export</Button>
          </Box>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel>Invoice ID</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Customer</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Status</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Amount</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} data-row-id={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <NativeSelect
                      data-testid={`status-${invoice.id}`}
                      data-canonical-type="select_native"
                      data-selected-value={invoice.status}
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      sx={{ fontSize: 13 }}
                      aria-label={`Status for ${invoice.id}`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </TableCell>
                <TableCell>{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={3}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={10}
          onRowsPerPageChange={() => {}}
        />
      </CardContent>
    </Card>
  );
}
