'use client';

/**
 * button-mui-T03: Permission dialog (click Allow)
 * 
 * Page loads with MUI Dialog already open.
 * Title: "Allow location access?" with Cancel and Allow buttons.
 * Task: Click "Allow" (not Cancel).
 */

import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(true);
  const [choice, setChoice] = useState<string | null>(null);

  const handleAllow = () => {
    setChoice('allow');
    setDialogOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setChoice('cancel');
    setDialogOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {choice && (
        <Typography color="text.secondary" align="center">
          Choice: {choice}
        </Typography>
      )}
      
      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        data-dialog-id="mui-dialog-location"
      >
        <DialogTitle>Allow location access?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This app would like to access your location to show nearby stores and provide personalized recommendations.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="mui-btn-cancel">
            Cancel
          </Button>
          <Button onClick={handleAllow} variant="contained" data-testid="mui-btn-allow">
            Allow
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
