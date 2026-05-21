'use client';

/**
 * alert_dialog_confirm-mui-T08: Confirm in a compact, small-scale responsive full-screen dialog
 *
 * Isolated-card layout anchored to the bottom-left of the viewport (non-centered placement). Spacing is compact and the overall UI is rendered at the small scale tier to simulate a dense mobile layout.
 *
 * The card titled "Storage" shows one item "Local cache" with a danger button "Delete cache".
 *
 * Clicking "Delete cache" opens a Material UI Dialog configured as responsive full-screen (covers most/all of the viewport):
 * - AppBar-style header with title "Delete Local cache?"
 * - Content text below
 * - Actions are placed at the bottom: "Cancel" and "Delete"
 *
 * Because the dialog is full-screen, the confirm action is farther from the trigger and may require the agent to manage focus/scroll if the content area is tall.
 */

import React, { useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => {
    setOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_local_cache',
    };
  };

  const handleConfirm = () => {
    setOpen(false);
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'delete_local_cache',
      };
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'delete_local_cache',
    };
  };

  return (
    <>
      <Card sx={{ width: 250 }}>
        <CardHeader title="Storage" titleTypographyProps={{ variant: 'subtitle1' }} />
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Local cache</Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleOpen}
            data-testid="cb-open-delete-cache"
          >
            Delete cache
          </Button>
        </CardContent>
      </Card>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleCancel}
        aria-labelledby="delete-cache-dialog-title"
        data-testid="dialog-delete-cache"
      >
        {fullScreen ? (
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Delete Local cache?
              </Typography>
            </Toolbar>
          </AppBar>
        ) : (
          <DialogTitle id="delete-cache-dialog-title">Delete Local cache?</DialogTitle>
        )}
        <DialogContent>
          <DialogContentText sx={{ mt: fullScreen ? 2 : 0 }}>
            This will permanently delete the local cache. Cached data will need to be downloaded again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" data-testid="cb-confirm">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
