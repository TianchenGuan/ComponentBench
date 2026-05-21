'use client';

/**
 * select_custom_single-mui-v2-T08: Invoice A-039 payment terms — set Net 45 and save row
 *
 * Compact invoices table in a billing dashboard. Four rows each have a small MUI Select
 * in "Payment terms" column and row-local Save. Invoice A-039 starts at "Net 30".
 * Options: Due on receipt, Net 15, Net 30, Net 45.
 * Pagination, quick-search, and "Download CSV" are clutter.
 *
 * Success: A-039 Payment terms = "Net 45", row-local Save for A-039 clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, InputAdornment, Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import type { TaskComponentProps } from '../../types';

const paymentOptions = ['Due on receipt', 'Net 15', 'Net 30', 'Net 45'];

interface InvoiceRow {
  id: string;
  client: string;
  amount: string;
  defaultTerms: string;
}

const invoices: InvoiceRow[] = [
  { id: 'A-037', client: 'Acme Corp', amount: '$2,400.00', defaultTerms: 'Net 15' },
  { id: 'A-038', client: 'Nova Labs', amount: '$870.00', defaultTerms: 'Due on receipt' },
  { id: 'A-039', client: 'Zeta Inc', amount: '$5,120.00', defaultTerms: 'Net 30' },
  { id: 'A-040', client: 'Orion LLC', amount: '$310.00', defaultTerms: 'Net 45' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [terms, setTerms] = useState<Record<string, string>>({
    'A-037': 'Net 15',
    'A-038': 'Due on receipt',
    'A-039': 'Net 30',
    'A-040': 'Net 45',
  });
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (savedRows['A-039'] && terms['A-039'] === 'Net 45') {
      successFired.current = true;
      onSuccess();
    }
  }, [savedRows, terms, onSuccess]);

  const handleTermsChange = (id: string, val: string) => {
    setTerms((prev) => ({ ...prev, [id]: val }));
    setSavedRows((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', minHeight: '80vh' }}>
      <Card sx={{ width: 620 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Invoices</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Search..."
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                sx={{ width: 160 }}
              />
              <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>Download CSV</Button>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment terms</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell><Typography variant="body2" fontWeight="bold">Invoice {inv.id}</Typography></TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell>{inv.amount}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={terms[inv.id]}
                          onChange={(e) => handleTermsChange(inv.id, e.target.value)}
                        >
                          {paymentOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        data-testid={`save-row-${inv.id}`}
                        onClick={() => setSavedRows((prev) => ({ ...prev, [inv.id]: true }))}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label="Page 1 of 1" size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">4 invoices total</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
