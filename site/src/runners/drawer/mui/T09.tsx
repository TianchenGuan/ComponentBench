'use client';

/**
 * drawer-mui-T09: Discard changes when closing a form drawer (MUI dialog confirm)
 *
 * Layout: form_section (a small profile/settings form) in the center of the viewport with low clutter.
 *
 * Initial state:
 * - A MUI Drawer titled "Address editor" is OPEN on page load (variant="temporary", anchor="right").
 * - Inside the drawer is a form with one field already modified, and a small inline message "You have unsaved changes".
 *
 * Close behavior:
 * - Clicking the drawer header close icon (X) triggers a MUI Dialog confirmation:
 *   - Title: "Discard unsaved changes?"
 *   - Actions: "Keep editing" and "Discard"
 * - Selecting "Discard" closes the dialog and then closes the drawer.
 *
 * Distractors:
 * - The underlying page shows a few unrelated text fields (read-only) to simulate a form section, but they are not part of the task.
 *
 * Feedback:
 * - The dialog appears centered above the drawer; after confirming discard, both dialog and drawer disappear.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Drawer,
  Box,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(true); // Start open
  const [dialogOpen, setDialogOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!drawerOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, onSuccess]);

  const handleCloseAttempt = () => {
    setDialogOpen(true);
  };

  const handleDiscard = () => {
    setDialogOpen(false);
    setDrawerOpen(false);
  };

  const handleKeepEditing = () => {
    setDialogOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        
        <Stack spacing={2}>
          <TextField
            label="Username"
            defaultValue="johndoe"
            size="small"
            disabled
          />
          <TextField
            label="Email"
            defaultValue="john@example.com"
            size="small"
            disabled
          />
        </Stack>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseAttempt}
          data-testid="drawer-address-editor"
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Address editor</Typography>
              <IconButton
                size="small"
                onClick={handleCloseAttempt}
                data-testid="drawer-close-icon"
              >
                <Close />
              </IconButton>
            </Stack>

            <Alert severity="warning" sx={{ mb: 2 }}>
              You have unsaved changes
            </Alert>

            <Stack spacing={2}>
              <TextField
                label="Street Address"
                defaultValue="456 Updated Ave (modified)"
                size="small"
                fullWidth
              />
              <TextField
                label="City"
                defaultValue="New York"
                size="small"
                fullWidth
              />
            </Stack>
          </Box>
        </Drawer>

        <Dialog open={dialogOpen} onClose={handleKeepEditing}>
          <DialogTitle>Discard unsaved changes?</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              You have unsaved changes that will be lost if you close this drawer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleKeepEditing} data-testid="keep-editing">
              Keep editing
            </Button>
            <Button onClick={handleDiscard} color="error" data-testid="discard">
              Discard
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
