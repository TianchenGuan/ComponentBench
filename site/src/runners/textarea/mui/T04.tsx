'use client';

/**
 * textarea-mui-T04: Shipping instructions (choose the right box)
 *
 * A checkout form section (form_section layout) includes:
 * - Light theme, comfortable spacing, default scale.
 * - Two multiline MUI TextField instances:
 *   1) "Gift message" (optional, starts empty).
 *   2) "Shipping instructions" (starts empty).
 * - Above them are standard text inputs (Name, Address) and a radio group (Delivery speed) as clutter.
 * - The two textareas have similar size and styling; the agent must choose "Shipping instructions".
 *
 * Success: Shipping instructions equals "Leave at reception desk. Do not require signature." (require_correct_instance=true)
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [giftMessage, setGiftMessage] = useState('');
  const [shippingInstructions, setShippingInstructions] = useState('');

  useEffect(() => {
    // Only succeed if shipping instructions match AND gift message is unchanged
    if (
      shippingInstructions.trim() === 'Leave at reception desk. Do not require signature.' &&
      giftMessage === ''
    ) {
      onSuccess();
    }
  }, [shippingInstructions, giftMessage, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Checkout
        </Typography>

        {/* Distractor fields */}
        <TextField
          label="Name"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          inputProps={{ 'data-testid': 'input-name' }}
        />
        <TextField
          label="Address"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          inputProps={{ 'data-testid': 'input-address' }}
        />

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Delivery speed</FormLabel>
          <RadioGroup row defaultValue="standard">
            <FormControlLabel value="standard" control={<Radio size="small" />} label="Standard" />
            <FormControlLabel value="express" control={<Radio size="small" />} label="Express" />
          </RadioGroup>
        </FormControl>

        {/* Target textareas */}
        <TextField
          label="Gift message"
          multiline
          rows={3}
          fullWidth
          placeholder="Optional message for recipient"
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value)}
          sx={{ mb: 2 }}
          inputProps={{ 'data-testid': 'textarea-gift-message' }}
        />

        <TextField
          label="Shipping instructions"
          multiline
          rows={3}
          fullWidth
          placeholder="Special delivery instructions"
          value={shippingInstructions}
          onChange={(e) => setShippingInstructions(e.target.value)}
          inputProps={{ 'data-testid': 'textarea-shipping-instructions' }}
        />
      </CardContent>
    </Card>
  );
}
