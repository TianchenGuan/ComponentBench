'use client';

/**
 * dialog_modal-mui-v2-T08: Nested scroll — page scroll + dialog internal scroll → Acknowledge
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

const filler = Array.from({ length: 8 }, (_, i) => (
  <Card key={i} variant="outlined" sx={{ mb: 1 }}>
    <CardContent>
      <Typography variant="caption">Background block {i + 1}</Typography>
    </CardContent>
  </Card>
));

const policyBlocks = Array.from({ length: 14 }, (_, i) => (
  <Typography key={i} variant="body2" paragraph>
    Policy segment {i + 1}. Access controls, retention, and subprocessors are described herein. Scroll
    inside this dialog to reach the acknowledgement control.
  </Typography>
));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const acknowledge = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'acknowledge_button',
      modal_instance: 'Review policy',
      last_opened_instance: 'Review policy',
    };
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Box sx={{ maxHeight: 440, overflowY: 'auto', pr: 1 }} data-testid="cb-page-scroll">
      {filler.slice(0, 3)}
      <Card variant="outlined" sx={{ mb: 1 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-open-review-policy">
            Open Review policy
          </Button>
        </CardContent>
      </Card>
      {filler.slice(3)}

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        aria-labelledby="policy-title"
      >
        <DialogTitle id="policy-title">Review policy</DialogTitle>
        <DialogContent
          dividers
          sx={{ maxHeight: 280, overflowY: 'auto' }}
          data-testid="cb-policy-dialog-scroll"
        >
          {policyBlocks}
          <Box sx={{ pt: 2 }}>
            <Button variant="contained" onClick={acknowledge} data-testid="cb-acknowledge">
              Acknowledge
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
