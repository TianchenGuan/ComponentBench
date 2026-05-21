'use client';

/**
 * switch-mui-T09: Confirm to enable Dangerous mode
 *
 * Layout: settings_panel centered in the viewport titled "Developer settings".
 * The panel contains a single MUI Switch labeled "Dangerous mode" with warning helper text beneath.
 * Initial state: the switch is OFF.
 * Interaction behavior: toggling the switch ON opens a modal Dialog titled "Enable Dangerous mode?" with two buttons: "Cancel" and "Confirm".
 * The change is only applied after clicking "Confirm"; choosing "Cancel" keeps the switch OFF.
 * Feedback: after confirming, the dialog closes and the switch shows the ON state.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  FormControlLabel, 
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSwitchClick = () => {
    if (!checked) {
      // Trying to turn ON, show confirmation
      setDialogOpen(true);
    } else {
      // Turning OFF, just toggle
      setChecked(false);
    }
  };

  const handleConfirm = () => {
    setChecked(true);
    setDialogOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Developer settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onClick={handleSwitchClick}
                data-testid="dangerous-mode-switch"
                inputProps={{ 'aria-checked': checked }}
              />
            }
            label="Dangerous mode"
          />
          <Typography variant="body2" color="error" sx={{ ml: 4 }}>
            Warning: This mode can cause data loss. Use with caution.
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Enable Dangerous mode?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will enable dangerous mode which can potentially cause data loss. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
