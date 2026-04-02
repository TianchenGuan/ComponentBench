'use client';

/**
 * checkbox-mui-T07: Enable Do Not Track inside drawer
 *
 * Layout: drawer flow.
 * The main page shows an isolated card titled "Privacy" with a button labeled "Open privacy settings".
 * Clicking the button opens a Material UI Drawer that slides in from the right, titled "Privacy settings".
 * Inside the drawer is one checkbox labeled "Send Do Not Track" (initially unchecked) with a brief description.
 * The drawer footer contains a "Save" button. The checkbox change is only committed when "Save" is clicked.
 * Closing the drawer via the close icon (or pressing Escape) discards changes and leaves the checkbox unchecked.
 * Distractors: a non-interactive paragraph of help text in the drawer body.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempChecked, setTempChecked] = useState(false);
  const [committed, setCommitted] = useState(false);

  const handleOpenDrawer = () => {
    setTempChecked(false);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (tempChecked && !committed) {
      setCommitted(true);
      setDrawerOpen(false);
      onSuccess();
    }
  };

  const handleClose = () => {
    setTempChecked(false);
    setDrawerOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Privacy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage your privacy preferences and tracking settings.
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDrawer}
            data-testid="btn-open-privacy-settings"
          >
            Open privacy settings
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
        data-testid="drawer-privacy-settings"
      >
        <Box sx={{ width: 360, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Privacy settings</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          {/* Body */}
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Control how your browser communicates with websites about tracking preferences.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempChecked}
                  onChange={(e) => setTempChecked(e.target.checked)}
                  data-testid="cb-do-not-track"
                />
              }
              label="Send Do Not Track"
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
              Request websites not to track your browsing activity.
            </Typography>
          </Box>

          {/* Footer */}
          <Divider />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              data-testid="btn-save"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
