'use client';

/**
 * text_input-mui-T04: Fill gift message among two fields
 * 
 * Scene is a form_section layout centered in the viewport titled "Checkout". There are two MUI TextFields
 * (instances=2) with similar styling: "Shipping note" and "Gift message". Both are single-line fields; initial
 * values are empty. A checkbox labeled "This is a gift" is present and already checked (distractor; not
 * required). No modal overlays appear and no submit button is required for success.
 * 
 * Success: The TextField labeled "Gift message" has value exactly "Happy birthday!" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [shippingNote, setShippingNote] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  useEffect(() => {
    if (giftMessage.trim() === 'Happy birthday!') {
      onSuccess();
    }
  }, [giftMessage, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Checkout
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Shipping note"
            variant="outlined"
            fullWidth
            value={shippingNote}
            onChange={(e) => setShippingNote(e.target.value)}
            inputProps={{ 'data-testid': 'shipping-note-input' }}
          />
          <TextField
            label="Gift message"
            variant="outlined"
            fullWidth
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            inputProps={{ 'data-testid': 'gift-message-input' }}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="This is a gift"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
