'use client';

/**
 * segmented_control-mui-T10: Role level → Admin + Confirm
 *
 * Layout: modal confirmation flow.
 * The page shows one ToggleButtonGroup labeled "Role level" with options:
 * "Viewer", "Editor", "Admin".
 * Initial committed state: "Editor" is selected.
 *
 * Confirmation behavior:
 * - When "Admin" is selected, a Material UI Dialog appears centered with title "Grant admin access?".
 * - Dialog buttons: "Cancel" and "Confirm".
 * - The Role level change is committed only if "Confirm" is clicked.
 * - Clicking "Cancel" closes the dialog and reverts Role level to "Editor".
 *
 * Clutter (low): the rest of the page is plain text explaining permissions; not required for success.
 *
 * Success: The committed value of "Role level" is Admin.
 * The confirmation Dialog has been accepted via the "Confirm" button.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, ToggleButton, ToggleButtonGroup,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const roleOptions = ['Viewer', 'Editor', 'Admin'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [committedRole, setCommittedRole] = useState<string>('Editor');
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null && value !== committedRole) {
      if (value === 'Admin') {
        setPendingRole(value);
        setDialogOpen(true);
      } else {
        // Other roles don't need confirmation in this task
        setCommittedRole(value);
      }
    }
  };

  const handleConfirm = () => {
    if (pendingRole) {
      setCommittedRole(pendingRole);
      if (pendingRole === 'Admin') {
        onSuccess();
      }
    }
    setPendingRole(null);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setPendingRole(null);
    setDialogOpen(false);
  };

  const displayValue = pendingRole || committedRole;

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Permissions</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the user&apos;s role level. Viewers can only read content. Editors can modify content.
            Admins have full access including user management.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Role level</Typography>
          <ToggleButtonGroup
            data-testid="role-level"
            data-canonical-type="segmented_control"
            data-selected-value={displayValue}
            data-committed-value={committedRole}
            value={displayValue}
            exclusive
            onChange={handleChange}
            aria-label="Role level"
          >
            {roleOptions.map(option => (
              <ToggleButton key={option} value={option} aria-label={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Grant admin access?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will give the user full administrative privileges including the ability to manage other users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
