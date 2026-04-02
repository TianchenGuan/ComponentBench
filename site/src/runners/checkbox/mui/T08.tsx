'use client';

/**
 * checkbox-mui-T08: Enable auto-delete with confirmation dialog
 *
 * Layout: settings panel with multiple rows (only one checkbox row is relevant).
 * Row label: "Auto-delete exports". Control: Material UI Checkbox (initially unchecked).
 * Interaction behavior: when you attempt to turn it on, a Material UI Dialog appears centered with:
 *   - Title: "Confirm change"
 *   - Buttons: "Cancel" and "Confirm"
 * The checkbox only becomes committed as checked after pressing "Confirm". Choosing "Cancel" leaves it unchecked.
 * Clutter: a couple of unrelated non-checkbox rows are present but do not affect success.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && !checked) {
      setDialogOpen(true);
    } else {
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
            Export Settings
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Non-checkbox row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary">Export format</Typography>
              <TextField
                size="small"
                value="CSV"
                disabled
                sx={{ width: 120 }}
              />
            </Box>

            {/* Checkbox row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary">Auto-delete exports</Typography>
              <Checkbox
                checked={checked}
                onChange={handleCheckboxChange}
                data-testid="cb-auto-delete-exports"
              />
            </Box>

            {/* Another non-checkbox row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography color="text.secondary">Retention period</Typography>
              <TextField
                size="small"
                value="30 days"
                disabled
                sx={{ width: 120 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Confirm change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to enable auto-delete for exports?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
