'use client';

/**
 * clipboard_copy-mui-T03: Copy Shipping reference (two instances)
 *
 * Layout: form_section, centered.
 * A "Checkout" form shows two read-only rows:
 * - Billing reference: BILL-MUI-33018
 * - Shipping reference: SHIP-MUI-33018
 *
 * Each row has a small MUI IconButton with a copy icon to the right. Clicking an IconButton copies the row's value using navigator.clipboard.writeText and shows a small inline helper text "Copied".
 *
 * Distractors: editable fields above (Name, Address) that are present but not required; they do not affect success. Initial state: helper texts hidden.
 * Requirement: instances=2; target instance is "Shipping reference".
 *
 * Success: Clipboard text equals "SHIP-MUI-33018".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, TextField, Stack, Box } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [billingCopied, setBillingCopied] = useState(false);
  const [shippingCopied, setShippingCopied] = useState(false);

  const handleCopyBilling = async () => {
    await copyToClipboard('BILL-MUI-33018', 'Billing reference');
    setBillingCopied(true);
    setTimeout(() => setBillingCopied(false), 2000);
    // Does not complete the task
  };

  const handleCopyShipping = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('SHIP-MUI-33018', 'Shipping reference');
    if (success) {
      setShippingCopied(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setShippingCopied(false), 2000);
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Checkout" />
      <CardContent>
        <Stack spacing={3}>
          {/* Editable fields - distractors */}
          <TextField label="Name" defaultValue="Alex Johnson" size="small" />
          <TextField label="Address" defaultValue="123 Main St" size="small" />

          {/* Billing reference */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>
              Billing reference:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              BILL-MUI-33018
            </Typography>
            <Tooltip title={billingCopied ? 'Copied' : 'Copy billing reference'}>
              <IconButton
                size="small"
                onClick={handleCopyBilling}
                data-testid="copy-billing"
                aria-label="Copy billing reference"
              >
                {billingCopied ? <Check fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
              </IconButton>
            </Tooltip>
            {billingCopied && (
              <Typography variant="caption" color="success.main">
                Copied
              </Typography>
            )}
          </Box>

          {/* Shipping reference - target */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 130 }}>
              Shipping reference:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              SHIP-MUI-33018
            </Typography>
            <Tooltip title={shippingCopied ? 'Copied' : 'Copy shipping reference'}>
              <IconButton
                size="small"
                onClick={handleCopyShipping}
                data-testid="copy-shipping"
                aria-label="Copy shipping reference"
              >
                {shippingCopied ? <Check fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
              </IconButton>
            </Tooltip>
            {shippingCopied && (
              <Typography variant="caption" color="success.main">
                Copied
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
