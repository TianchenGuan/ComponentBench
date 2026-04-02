'use client';

/**
 * dialog_modal-mui-v2-T01: Gateway row backdrop-only dismissal
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { TaskComponentProps, ModalState } from '../../types';

type RowKey = 'gateway' | 'billing' | 'search';

const titles: Record<RowKey, string> = {
  gateway: 'Gateway preview',
  billing: 'Billing preview',
  search: 'Search preview',
};

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState<RowKey | null>(null);
  const successCalledRef = useRef(false);

  const syncState = (key: RowKey | null, isOpen: boolean, reason: ModalState['close_reason']) => {
    const inst = key ? titles[key] : null;
    window.__cbModalState = {
      open: isOpen,
      close_reason: reason,
      modal_instance: inst,
      last_opened_instance: inst,
    };
  };

  const openRow = (key: RowKey) => {
    setOpen(key);
    syncState(key, true, null);
  };

  const handleClose = (_: unknown, reason: string) => {
    if (reason !== 'backdropClick' || !open) return;
    setOpen(null);
    window.__cbModalState = {
      open: false,
      close_reason: 'backdrop_click',
      modal_instance: titles[open],
      last_opened_instance: titles[open],
    };
    if (open === 'gateway' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Box sx={{ minWidth: 420 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {['Live', 'Degraded', 'Beta', 'EU-West', 'Cache on', 'v2.4'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Table size="small" data-testid="cb-service-status-table">
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(['gateway', 'billing', 'search'] as RowKey[]).map((key) => (
            <TableRow key={key}>
              <TableCell sx={{ textTransform: 'capitalize' }}>{key}</TableCell>
              <TableCell>OK</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openRow(key)}
                  data-testid={`cb-preview-${key}`}
                >
                  Preview dialog
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
        {['Filter: all', 'Sort: name', 'Dense'].map((l) => (
          <Chip key={l} size="small" label={l} />
        ))}
      </Stack>

      <Dialog
        open={open !== null}
        onClose={handleClose}
        disableEscapeKeyDown
        aria-labelledby="preview-dlg-title"
        data-testid="cb-preview-dialog"
      >
        <DialogTitle id="preview-dlg-title">{open ? titles[open] : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {open === 'gateway' && 'Gateway edge path is healthy. No incidents in the last 24h.'}
            {open === 'billing' && 'Billing pipeline latency within SLO.'}
            {open === 'search' && 'Search index freshness nominal.'}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
