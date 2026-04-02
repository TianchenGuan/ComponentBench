'use client';

/**
 * drawer-mui-T06: Open drawer from within a table cell context
 *
 * Layout: table_cell. The drawer trigger is embedded in a small table in the center of the viewport.
 * Clutter (low): the table has 3 columns (Invoice, Amount, Action) and 2 rows.
 *
 * Action column:
 * - Row 1 has an enabled MUI Button labeled "View details" (this is the ONLY enabled action).
 * - Row 2 has a disabled "View details" button (distractor).
 *
 * Target component: MUI Drawer (variant="temporary", anchor="right").
 * - Initial state: CLOSED.
 * - When opened (via the enabled "View details" button), it shows the header title "Invoice details".
 * - Backdrop is enabled.
 *
 * Drawer contents:
 * - A short read-only summary (no further interaction required).
 *
 * Feedback:
 * - Drawer slides in from the right and the backdrop appears.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const invoices = [
    { id: 'INV-001', amount: '$1,250.00', enabled: true },
    { id: 'INV-002', amount: '$840.00', enabled: false },
  ];

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Invoices
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" data-testid="invoice-table">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!invoice.enabled}
                      onClick={() => setOpen(true)}
                      data-testid={invoice.enabled ? 'view-details-enabled' : 'view-details-disabled'}
                    >
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          data-testid="drawer-invoice-details"
        >
          <Box sx={{ width: 320, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Invoice details
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">Invoice Number</Typography>
                <Typography>INV-001</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Amount</Typography>
                <Typography>$1,250.00</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Typography>Paid</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Date</Typography>
                <Typography>January 15, 2024</Typography>
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </CardContent>
    </Card>
  );
}
