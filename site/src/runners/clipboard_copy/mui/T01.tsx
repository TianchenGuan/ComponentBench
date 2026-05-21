'use client';

/**
 * clipboard_copy-mui-T01: Copy order ID (IconButton)
 *
 * Layout: isolated_card, centered.
 * The card title is "Order details". It shows a labeled value row:
 * - Label: "Order ID"
 * - Value: "ORD-77104"
 * - To the right of the value is a Material UI IconButton with a copy glyph (e.g., ContentCopy icon) and a Tooltip that reads "Copy".
 *
 * Implementation note: MUI does not ship a dedicated CopyButton component, so this is a composite built from IconButton + Tooltip and a copy handler that calls navigator.clipboard.writeText(value).
 *
 * Component behavior:
 * - Clicking the copy IconButton writes "ORD-77104" to the clipboard.
 * - The icon briefly changes state (e.g., checkmark) and/or shows a small "Copied" snackbar message at the bottom.
 *
 * Distractors: none. Initial state: not copied; snackbar hidden.
 *
 * Success: Clipboard text equals "ORD-77104".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, Snackbar, Alert, Box } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('ORD-77104', 'Order ID');
    if (success) {
      setCopied(true);
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Order details" />
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Order ID:
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: 'monospace', fontWeight: 500 }}
            data-testid="order-id-value"
          >
            ORD-77104
          </Typography>
          <Tooltip title={copied ? 'Copied' : 'Copy'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              data-testid="copy-order-id"
              aria-label="Copy order ID"
            >
              {copied ? <Check fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Copied to clipboard
        </Alert>
      </Snackbar>
    </Card>
  );
}
