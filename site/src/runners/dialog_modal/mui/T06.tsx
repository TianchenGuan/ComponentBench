'use client';

/**
 * dialog_modal-mui-T06: Close a non-dismissible dialog using the explicit Close button
 *
 * Layout: isolated_card centered, with COMPACT spacing and SMALL scale.
 * A Material UI Dialog is open on page load.
 *
 * Dialog configuration:
 * - Title: "Privacy notice"
 * - Content: short paragraph
 * - Actions: a single button labeled "Close"
 * - Escape is disabled.
 * - Backdrop clicks are ignored.
 *
 * Initial state: dialog open.
 * Success: The 'Privacy notice' dialog is closed via Close button (close_reason='close_button').
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const compactTheme = createTheme({
  typography: {
    fontSize: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Dialog starts open
  const [status, setStatus] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Privacy notice',
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    setStatus('Dismissed');
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: 'Privacy notice',
    };
    
    // Success when closed via Close button
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  // Ignore backdrop and escape
  const handleDialogClose = () => {
    // Do nothing - dialog can only be closed via the Close button
  };

  return (
    <ThemeProvider theme={compactTheme}>
      <Card sx={{ width: 350 }}>
        <CardHeader title="Welcome" titleTypographyProps={{ variant: 'subtitle1' }} />
        <CardContent>
          <Typography variant="body2">
            Please review and acknowledge the privacy notice.
          </Typography>
        </CardContent>
      </Card>

      {status && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {status}
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={handleDialogClose}
        disableEscapeKeyDown={true}
        aria-labelledby="privacy-dialog-title"
        data-testid="dialog-privacy-notice"
      >
        <DialogTitle id="privacy-dialog-title">Privacy notice</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            We collect and process your data in accordance with our privacy policy.
            By using our services, you agree to these terms.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" data-testid="cb-close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
