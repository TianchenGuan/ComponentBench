'use client';

/**
 * alert_dialog_confirm-mui-T04: Confirm deleting a specific invoice row (table operation)
 *
 * Table-cell layout. A compact "Invoices" table is displayed with multiple rows. Two rows are visible without scrolling: "Invoice #1041" and "Invoice #1042".
 *
 * Each row has an icon-only delete button in the rightmost column. Clicking a row's delete button opens a Material UI Dialog:
 * - Title: "Delete Invoice #1042?" (or the corresponding invoice number)
 * - Content: "This action cannot be undone."
 * - Actions: "Cancel" and "Delete"
 *
 * Only one dialog can be open at a time. The task specifically targets Invoice #1042.
 */

import React, { useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskComponentProps } from '../types';

interface Invoice {
  id: string;
  number: string;
  amount: string;
}

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const successCalledRef = useRef(false);

  const invoices: Invoice[] = [
    { id: '1041', number: 'Invoice #1041', amount: '$250.00' },
    { id: '1042', number: 'Invoice #1042', amount: '$175.00' },
  ];

  const handleOpen = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: `delete_invoice_${invoice.id}`,
    };
  };

  const handleConfirm = () => {
    setOpen(false);
    if (currentInvoice?.id === '1042' && !successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: `delete_invoice_${currentInvoice.id}`,
      };
      onSuccess();
    } else if (currentInvoice) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: `delete_invoice_${currentInvoice.id}`,
      };
    }
    setCurrentInvoice(null);
  };

  const handleCancel = () => {
    setOpen(false);
    if (currentInvoice) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: `delete_invoice_${currentInvoice.id}`,
      };
    }
    setCurrentInvoice(null);
  };

  return (
    <>
      <Card sx={{ width: 450 }}>
        <CardHeader title="Invoices" />
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpen(invoice)}
                        data-testid={`cb-delete-invoice-${invoice.id}`}
                        data-cb-instance={invoice.number}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="delete-invoice-dialog-title"
        data-testid="dialog-delete-invoice"
      >
        <DialogTitle id="delete-invoice-dialog-title">
          Delete {currentInvoice?.number}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" data-testid="cb-confirm">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
