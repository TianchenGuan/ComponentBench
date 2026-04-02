'use client';

/**
 * clipboard_copy-mui-T10: Confirm copying client secret (dark dialog)
 *
 * Layout: modal_flow, centered.
 * Universal factors: theme=dark.
 *
 * The page shows a "Client credentials" card with two fields:
 * - Client ID: cli_MUI_2048 (with no copy button; distractor)
 * - Client secret: sec_live_MUI_91D0C5 (value is masked with bullets, but a copy IconButton is present)
 *
 * Sensitive copy confirmation:
 * - Clicking the copy IconButton next to Client secret opens a Material UI Dialog titled "Copy client secret?".
 * - Dialog buttons: "Cancel" and primary "Copy secret".
 * - Only clicking "Copy secret" writes the FULL secret string "sec_live_MUI_91D0C5" to the clipboard and closes the dialog.
 * - A snackbar "Secret copied" appears after success.
 *
 * Initial state: dialog closed; nothing copied; secret displayed masked but stored as a data attribute for copying.
 *
 * Success: User confirms the dialog by clicking "Copy secret", clipboard text equals "sec_live_MUI_91D0C5".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Snackbar, Alert, Box, Stack } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard, trackConfirmAction } from '../types';

const clientSecret = 'sec_live_MUI_91D0C5';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyClick = () => {
    if (completed) return;
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirmCopy = async () => {
    trackConfirmAction('Copy secret');
    const success = await copyToClipboard(clientSecret, 'Client secret');
    if (success) {
      setDialogOpen(false);
      setSnackbarOpen(true);
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 400 }} data-testid="credentials-card">
        <CardHeader title="Client credentials" />
        <CardContent>
          <Stack spacing={2}>
            {/* Client ID - no copy button (distractor) */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Client ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                cli_MUI_2048
              </Typography>
            </Box>

            {/* Client secret - masked with copy button */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Client secret
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontFamily: 'monospace' }}
                  data-secret={clientSecret}
                >
                  ••••••••••••••••••
                </Typography>
                <Tooltip title="Copy client secret">
                  <IconButton
                    size="small"
                    onClick={handleCopyClick}
                    data-testid="copy-secret-button"
                    aria-label="Copy client secret"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        data-testid="confirm-dialog"
      >
        <DialogTitle>Copy client secret?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This secret is sensitive. Make sure you store it securely and do not share it publicly.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cancel-button">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmCopy}
            variant="contained"
            data-testid="confirm-copy-button"
          >
            Copy secret
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Secret copied
        </Alert>
      </Snackbar>
    </>
  );
}
