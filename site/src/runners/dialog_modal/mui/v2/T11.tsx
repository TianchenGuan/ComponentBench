'use client';

/**
 * dialog_modal-mui-v2-T11: Billing address row — Escape-only close
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../../types';

type Which = 'shipping' | 'billing' | 'office' | null;

const titles: Record<Exclude<Which, null>, string> = {
  shipping: 'Shipping address',
  billing: 'Billing address',
  office: 'Office address',
};

export default function T11({ onSuccess }: TaskComponentProps) {
  const [active, setActive] = useState<Which>(null);
  const successCalledRef = useRef(false);

  const open = (w: Exclude<Which, null>) => {
    setActive(w);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: titles[w],
      last_opened_instance: titles[w],
    };
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
        {['KPI', 'Sync', 'Alerts', 'v3'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Typography variant="subtitle2" gutterBottom>
        Addresses
      </Typography>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography flex={1}>Shipping address</Typography>
          <Button size="small" onClick={() => open('shipping')} data-testid="cb-edit-shipping">
            Edit
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography flex={1}>Billing address</Typography>
          <Button size="small" onClick={() => open('billing')} data-testid="cb-edit-billing">
            Edit
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography flex={1}>Office address</Typography>
          <Button size="small" onClick={() => open('office')} data-testid="cb-edit-office">
            Edit
          </Button>
        </Box>
      </Stack>

      <Dialog
        open={active !== null}
        onClose={(_, reason) => {
          if (reason === 'backdropClick') return;
          const which = active;
          if (!which) return;
          const t = titles[which];
          setActive(null);
          window.__cbModalState = {
            open: false,
            close_reason: reason === 'escapeKeyDown' ? 'escape_key' : 'close_button',
            modal_instance: t,
            last_opened_instance: t,
          };
          if (which === 'billing' && !successCalledRef.current) {
            successCalledRef.current = true;
            setTimeout(() => onSuccess(), 100);
          }
        }}
        aria-labelledby="addr-title"
      >
        {active && (
          <>
            <DialogTitle id="addr-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {titles[active]}
              <IconButton size="small" onClick={() => {
                const which = active;
                if (!which) return;
                const t = titles[which];
                setActive(null);
                window.__cbModalState = {
                  open: false,
                  close_reason: 'close_button',
                  modal_instance: t,
                  last_opened_instance: t,
                };
                if (which === 'billing' && !successCalledRef.current) {
                  successCalledRef.current = true;
                  setTimeout(() => onSuccess(), 100);
                }
              }} aria-label="close">
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">Update the selected address record.</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
