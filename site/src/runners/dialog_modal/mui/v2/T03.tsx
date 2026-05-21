'use client';

/**
 * dialog_modal-mui-v2-T03: Terms of service — scroll bottom, I agree
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const blocks = Array.from({ length: 18 }, (_, i) => (
  <Typography key={i} variant="body2" paragraph>
    Section {i + 1}. By accessing or using the service you agree to these terms, including acceptable
    use, data processing, and limitation of liability. These provisions are material to your continued use.
  </Typography>
));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleAgree = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'agree_button',
      modal_instance: 'Terms of service',
      last_opened_instance: 'Terms of service',
    };
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Legal documents for your workspace.
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-open-tos">
            Open Terms of service
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        aria-labelledby="tos-title"
        data-testid="dialog-tos"
      >
        <DialogTitle id="tos-title">Terms of service</DialogTitle>
        <DialogContent
          dividers
          sx={{ maxHeight: 320, overflowY: 'auto' }}
          data-testid="cb-tos-scroll"
        >
          {blocks}
          <Box sx={{ pt: 2, pb: 1 }}>
            <Button variant="contained" onClick={handleAgree} data-testid="cb-i-agree">
              I agree
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
