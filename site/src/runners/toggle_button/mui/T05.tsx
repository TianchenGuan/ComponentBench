'use client';

/**
 * toggle_button-mui-T15: Enable airplane mode with confirmation dialog
 *
 * Layout: modal_flow. The main page shows a centered card in a light theme with comfortable spacing and default scale.
 * Interacting with the target opens a blocking modal dialog that must be handled to commit the change.
 *
 * The card title is "Connectivity". It contains one MUI ToggleButton labeled "Airplane mode".
 * - Initial state: Off (not selected).
 * - Clicking it opens a MUI Dialog titled "Enable Airplane mode?"
 *
 * Dialog content:
 * - Text: "This will disable Wi‑Fi and Bluetooth."
 * - Actions: "Cancel" and "Enable"
 *
 * Commit behavior:
 * - The ToggleButton only becomes selected (aria-pressed=true) after clicking "Enable".
 * - Clicking "Cancel" closes the dialog and leaves the toggle Off.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToggleClick = () => {
    if (!selected) {
      setDialogOpen(true);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleEnable = () => {
    setSelected(true);
    setDialogOpen(false);
    onSuccess();
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Connectivity
          </Typography>
          
          <ToggleButton
            value="airplane"
            selected={selected}
            onChange={handleToggleClick}
            aria-pressed={selected}
            data-testid="airplane-mode-toggle"
            color="primary"
          >
            {selected ? <CheckIcon sx={{ mr: 0.5 }} /> : <AirplanemodeActiveIcon sx={{ mr: 0.5 }} />}
            Airplane mode
          </ToggleButton>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Airplane mode: {selected ? 'On' : 'Off'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            (Confirmation required)
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Enable Airplane mode?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will disable Wi‑Fi and Bluetooth.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleEnable} variant="contained" data-testid="enable-button">
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
