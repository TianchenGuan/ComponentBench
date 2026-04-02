'use client';

/**
 * select_native-mui-v2-T21: Invoices table — set INV-1042 status to Paid and save row
 *
 * Dense invoices table with 4 rows, each having a MUI NativeSelect for Status and a
 * row-local Save button. INV-1042 starts at Draft. Other rows: Sent, Paid, Void.
 * Row committed status updates only on that row's Save click.
 *
 * Success: INV-1042 committed status = "paid"/"Paid", row Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, FormControl, NativeSelect, Button,
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, IconButton, Chip, Paper,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { TaskComponentProps } from '../../types';

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Void', value: 'void' },
];

const initialInvoices = [
  { id: 'INV-1040', amount: '$1,200', status: 'sent' },
  { id: 'INV-1041', amount: '$3,450', status: 'paid' },
  { id: 'INV-1042', amount: '$890', status: 'draft' },
  { id: 'INV-1043', amount: '$2,100', status: 'void' },
];

export default function T21({ onSuccess }: TaskComponentProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [committedStatuses, setCommittedStatuses] = useState<Record<string, string>>(
    Object.fromEntries(initialInvoices.map(inv => [inv.id, inv.status]))
  );
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedStatuses['INV-1042'] === 'paid') {
      successFired.current = true;
      onSuccess();
    }
  }, [committedStatuses, onSuccess]);

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    ));
  };

  const handleRowSave = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setCommittedStatuses(prev => ({ ...prev, [invoiceId]: invoice.status }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Invoices</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField size="small" placeholder="Search invoices..." sx={{ width: 200 }} />
              <IconButton size="small"><FileDownloadIcon /></IconButton>
            </Box>
          </Box>

          <Chip label={`${initialInvoices.length} invoices`} size="small" sx={{ mb: 2 }} />

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice <SortIcon fontSize="inherit" /></TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map(inv => (
                  <TableRow key={inv.id} data-row={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.amount}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <NativeSelect
                          data-testid={`status-${inv.id}`}
                          data-canonical-type="select_native"
                          data-selected-value={inv.status}
                          value={inv.status}
                          onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                          inputProps={{ name: `status-${inv.id}`, id: `status-${inv.id}` }}
                          sx={{ fontSize: '0.875rem' }}
                        >
                          {statusOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </NativeSelect>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleRowSave(inv.id)}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary">Page 1 of 1</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
