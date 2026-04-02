'use client';

/**
 * masked_input-mui-v2-T04: IBAN in modal with save then confirm dialog
 *
 * Clicking "Add bank account" opens a centered MUI Dialog with a masked IBAN field
 * labeled "IBAN (DE)" using pattern DE## #### #### #### #### ##. A "Save IBAN" button
 * opens a second confirmation dialog ("Apply bank account?" — Cancel / Confirm).
 * Only Confirm commits the value.
 *
 * Success: IBAN = "DE89 3704 0044 0532 0130 00" confirmed; both dialogs closed.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const IbanMask = forwardRef<HTMLInputElement, MaskProps>(function IbanMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="DE00 0000 0000 0000 0000 00"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default function T04({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [mainOpen, setMainOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ibanValue, setIbanValue] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (confirmed && ibanValue === 'DE89 3704 0044 0532 0130 00' && !mainOpen && !confirmOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [confirmed, ibanValue, mainOpen, confirmOpen, onSuccess]);

  const handleSaveIban = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setConfirmOpen(false);
    setMainOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Bank accounts</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            IBAN: {confirmed ? ibanValue : 'Not set'}
          </Typography>
          <Button variant="contained" onClick={() => { setMainOpen(true); setConfirmed(false); }}>
            Add bank account
          </Button>
        </CardContent>
      </Card>

      {/* Main IBAN dialog */}
      <Dialog open={mainOpen} onClose={() => setMainOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add bank account</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="IBAN (DE)"
            placeholder="DE## #### #### #### #### ##"
            value={ibanValue}
            onChange={(e) => { setIbanValue(e.target.value); setConfirmed(false); }}
            slotProps={{ input: { inputComponent: IbanMask as any } }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMainOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveIban}>Save IBAN</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Apply bank account?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            IBAN will be set to: {ibanValue}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
