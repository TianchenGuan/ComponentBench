'use client';

/**
 * dialog_modal-mui-v2-T04: Consent details — scroll, pick Accept changes
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps, ModalState } from '../../types';

const blocks = Array.from({ length: 16 }, (_, i) => (
  <Typography key={i} variant="body2" paragraph>
    Consent clause {i + 1}. We may update how we process identifiers, analytics events, and retention
    windows. Continued use after notice constitutes acceptance of material changes where permitted by law.
  </Typography>
));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  const closeWrong = (reason: ModalState['close_reason']) => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: reason,
      modal_instance: 'Consent details',
      last_opened_instance: 'Consent details',
    };
  };

  const handleAccept = () => {
    setOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'accept_changes_button',
      modal_instance: 'Consent details',
      last_opened_instance: 'Consent details',
    };
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1 }}>
        {['Alerts on', 'EU', 'PII scan'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Compliance status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Review updated consent language before rollout.
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-review-consent">
            Review Consent details
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
        aria-labelledby="consent-title"
      >
        <DialogTitle id="consent-title">Consent details</DialogTitle>
        <DialogContent
          dividers
          sx={{ maxHeight: 360, overflowY: 'auto' }}
          data-testid="cb-consent-scroll"
        >
          {blocks}
          <Stack direction="row" spacing={1} sx={{ pt: 3, pb: 1 }} flexWrap="wrap">
            <Button onClick={() => closeWrong('cancel')}>Read later</Button>
            <Button onClick={() => closeWrong('cancel')}>Contact support</Button>
            <Button variant="contained" onClick={handleAccept} data-testid="cb-accept-changes">
              Accept changes
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
