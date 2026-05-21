'use client';

/**
 * checkbox_tristate-mui-T08: Dialog: set Write access to Partial and Apply
 *
 * Layout: modal_flow.
 * The page shows a "Role settings" card with a button "Edit role".
 * Clicking it opens a MUI Dialog titled "Edit role permissions".
 *
 * Inside the dialog are two MUI tri-state checkboxes:
 * - "Read access"
 * - "Write access" (target)
 *
 * Initial states when the dialog opens:
 * - Read access: Checked
 * - Write access: Unchecked
 *
 * Dialog footer buttons: "Cancel" (closes without saving), "Apply" (commits the new values).
 * The committed role permissions only update after clicking Apply.
 * 
 * Success: "Write access" is Indeterminate AND Apply is clicked.
 */

import React, { useState } from 'react';
import { Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Typography } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedReadState, setSavedReadState] = useState<TristateValue>('checked');
  const [savedWriteState, setSavedWriteState] = useState<TristateValue>('unchecked');
  const [tempReadState, setTempReadState] = useState<TristateValue>('checked');
  const [tempWriteState, setTempWriteState] = useState<TristateValue>('unchecked');

  const handleOpenDialog = () => {
    setTempReadState(savedReadState);
    setTempWriteState(savedWriteState);
    setDialogOpen(true);
  };

  const handleReadClick = () => {
    setTempReadState(cycleTristateValue(tempReadState));
  };

  const handleWriteClick = () => {
    setTempWriteState(cycleTristateValue(tempWriteState));
  };

  const handleApply = () => {
    setSavedReadState(tempReadState);
    setSavedWriteState(tempWriteState);
    setDialogOpen(false);
    if (tempWriteState === 'indeterminate') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempReadState(savedReadState);
    setTempWriteState(savedWriteState);
    setDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Role settings</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure access permissions for user roles.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            data-testid="edit-role-button"
          >
            Edit role
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Edit role permissions</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={tempReadState === 'checked'}
                indeterminate={tempReadState === 'indeterminate'}
                onClick={handleReadClick}
                data-testid="read-access-checkbox"
              />
            }
            label="Read access"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={tempWriteState === 'checked'}
                indeterminate={tempWriteState === 'indeterminate'}
                onClick={handleWriteClick}
                data-testid="write-access-checkbox"
              />
            }
            label="Write access"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" data-testid="apply-role">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
