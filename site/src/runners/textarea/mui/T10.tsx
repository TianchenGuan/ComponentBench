'use client';

/**
 * textarea-mui-T10: Reset status update to default (confirm reset)
 *
 * A centered card titled "Team status" has a button "Edit status update".
 * - Light theme, comfortable spacing, default scale.
 * - Clicking "Edit status update" opens a MUI Dialog (modal_flow) containing a multiline TextField labeled "Status update".
 * - The textarea starts with a non-default value: "Status: In a meeting."
 * - Below the field is a secondary button "Reset to default".
 * - Clicking "Reset to default" opens a small confirmation dialog with: "Cancel" and destructive "Reset".
 * - Confirming "Reset" sets the textarea value to "Status: Working from home today."
 *
 * Success: Committed value equals "Status: Working from home today." after clicking Reset confirm button.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const DEFAULT_VALUE = 'Status: Working from home today.';
const INITIAL_VALUE = 'Status: In a meeting.';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(INITIAL_VALUE);
  const [committedValue, setCommittedValue] = useState(INITIAL_VALUE);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (committedValue.trim() === DEFAULT_VALUE && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenMain = () => {
    setDraftValue(committedValue);
    setIsMainDialogOpen(true);
  };

  const handleCloseMain = () => {
    setIsMainDialogOpen(false);
  };

  const handleResetToDefaultClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmReset = () => {
    setDraftValue(DEFAULT_VALUE);
    setCommittedValue(DEFAULT_VALUE);
    setIsConfirmDialogOpen(false);
    setIsMainDialogOpen(false);
  };

  const handleCancelReset = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Team status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current: {committedValue}
          </Typography>
          <Button variant="contained" onClick={handleOpenMain} data-testid="btn-edit-status">
            Edit status update
          </Button>
        </CardContent>
      </Card>

      {/* Main dialog */}
      <Dialog open={isMainDialogOpen} onClose={handleCloseMain} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Status Update</DialogTitle>
        <DialogContent>
          <TextField
            label="Status update"
            multiline
            rows={3}
            fullWidth
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
            inputProps={{ 'data-testid': 'textarea-status-update' }}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleResetToDefaultClick}
            data-testid="btn-reset-to-default"
          >
            Reset to default
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMain}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={isConfirmDialogOpen} onClose={handleCancelReset}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <Typography>
            This will reset your status to the default value. Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReset}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReset} data-testid="btn-confirm-reset">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
