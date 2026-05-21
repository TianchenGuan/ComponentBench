'use client';

/**
 * textarea-mui-T05: Add an internal note in a dialog
 *
 * A centered "Customer record" card has a button labeled "Add internal note".
 * - Light theme, comfortable spacing, default scale.
 * - Clicking the button opens a MUI Dialog (modal_flow).
 * - The dialog contains one multiline MUI TextField labeled "Internal note", initially empty.
 * - Dialog actions: "Cancel" (left) and primary "Add note" (right).
 * - If the textarea is empty, the helper text turns red "Required" (validation feedback).
 *
 * Success: Committed value equals "Customer requested a callback on Tuesday." (require_confirm=true)
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

const TARGET_VALUE = 'Customer requested a callback on Tuesday.';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftValue, setDraftValue] = useState('');
  const [committedValue, setCommittedValue] = useState('');
  const [showError, setShowError] = useState(false);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (committedValue.trim() === TARGET_VALUE && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpen = () => {
    setDraftValue('');
    setShowError(false);
    setIsDialogOpen(true);
  };

  const handleAddNote = () => {
    if (draftValue.trim() === '') {
      setShowError(true);
      return;
    }
    setCommittedValue(draftValue);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer record
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customer ID: CUS-2847
          </Typography>
          <Button variant="contained" onClick={handleOpen} data-testid="btn-add-internal-note">
            Add internal note
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Add Internal Note</DialogTitle>
        <DialogContent>
          <TextField
            label="Internal note"
            multiline
            rows={4}
            fullWidth
            value={draftValue}
            onChange={(e) => {
              setDraftValue(e.target.value);
              if (e.target.value.trim()) setShowError(false);
            }}
            error={showError}
            helperText={showError ? 'Required' : 'Not visible to the customer'}
            sx={{ mt: 1 }}
            inputProps={{ 'data-testid': 'textarea-internal-note' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleAddNote} data-testid="btn-add-note">
            Add note
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
