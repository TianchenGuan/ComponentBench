'use client';

/**
 * clipboard_copy-mui-T06: Scroll to Session token card and copy
 *
 * Layout: dashboard, centered. The dashboard is longer than the viewport.
 * The top of the page shows several summary cards (Usage, Status, Alerts) that are distractors.
 *
 * Below the fold there is a card titled "Session token". Inside it:
 * - A monospace token value "sess_3F9C-88AA"
 * - A small copy IconButton aligned to the right of the token (clipboard_copy component)
 * - A caption: "Use this token for support requests" (distractor)
 *
 * Component behavior:
 * - Clicking the IconButton copies the token (navigator.clipboard.writeText).
 * - A snackbar "Token copied" appears at the bottom for ~2 seconds.
 *
 * Initial state: page loads at top; Session token card not visible until scrolling.
 *
 * Success: Clipboard text equals "sess_3F9C-88AA".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, Snackbar, Alert, Box, Stack, Paper } from '@mui/material';
import { ContentCopy, Check, BarChart, CheckCircle, Warning } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard('sess_3F9C-88AA', 'Session token');
    if (success) {
      setCopied(true);
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ width: 500 }} data-testid="dashboard">
      {/* Distractor cards at top */}
      <Stack spacing={2}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BarChart color="primary" />
            <Typography variant="h6">Usage</Typography>
          </Box>
          <Typography variant="h4">1,234</Typography>
          <Typography variant="caption" color="text.secondary">API calls this month</Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircle color="success" />
            <Typography variant="h6">Status</Typography>
          </Box>
          <Typography variant="body1" color="success.main">All systems operational</Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Warning color="warning" />
            <Typography variant="h6">Alerts</Typography>
          </Box>
          <Typography variant="body2">No active alerts</Typography>
        </Paper>

        {/* Some padding to ensure Session token is below fold */}
        <Box sx={{ height: 200 }} />

        {/* Session token card - target */}
        <Card data-testid="session-token-card">
          <CardHeader title="Session token" />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{ fontFamily: 'monospace', fontWeight: 500 }}
                data-testid="session-token-value"
              >
                sess_3F9C-88AA
              </Typography>
              <Tooltip title={copied ? 'Copied' : 'Copy'}>
                <IconButton
                  size="small"
                  onClick={handleCopy}
                  data-testid="copy-session-token"
                  aria-label="Copy session token"
                >
                  {copied ? <Check fontSize="small" color="success" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Use this token for support requests
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Token copied
        </Alert>
      </Snackbar>
    </Box>
  );
}
