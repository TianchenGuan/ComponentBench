'use client';

/**
 * toggle_button-mui-T19: Toggle in a drawer and save changes
 *
 * Layout: drawer_flow. The main page has a button labeled "Notification settings" near the center.
 * Theme is light with comfortable spacing and default scale. The drawer slides in from the right.
 *
 * Flow:
 * 1) Click "Notification settings" to open a MUI Drawer titled "Notification settings".
 * 2) Inside the drawer body there is one MUI ToggleButton labeled "Quiet hours".
 *    - Off = unselected (aria-pressed=false)
 *    - On = selected (aria-pressed=true)
 * 3) At the bottom of the drawer there are two buttons: "Discard" and "Save changes".
 *
 * Commit behavior:
 * - The toggle can be changed inside the drawer, but it is only committed when "Save changes" is clicked.
 * - Clicking "Discard" closes the drawer and reverts the toggle to its prior state.
 *
 * Initial state when opening the drawer: Quiet hours is Off.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  Divider,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(false);
  const [committedSelected, setCommittedSelected] = useState(false);

  const openDrawer = () => {
    setTempSelected(committedSelected);
    setDrawerOpen(true);
  };

  const handleDiscard = () => {
    setTempSelected(committedSelected);
    setDrawerOpen(false);
  };

  const handleSave = () => {
    setCommittedSelected(tempSelected);
    setDrawerOpen(false);
    if (tempSelected) {
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 400, textAlign: 'center' }}>
        <CardContent>
          <Button
            variant="contained"
            onClick={openDrawer}
            data-testid="open-notification-settings"
          >
            Notification settings
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Quiet hours: {committedSelected ? 'On' : 'Off'} (committed)
          </Typography>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDiscard}
      >
        <Box sx={{ width: 350, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Notification settings
          </Typography>
          
          <Box sx={{ flex: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1">Quiet hours</Typography>
                <Typography variant="caption" color="text.secondary">
                  Silence notifications during set hours
                </Typography>
              </Box>
              <ToggleButton
                value="quiet"
                selected={tempSelected}
                onChange={() => setTempSelected(!tempSelected)}
                aria-pressed={tempSelected}
                data-testid="quiet-hours-toggle"
                size="small"
                color="primary"
              >
                {tempSelected ? <CheckIcon /> : <NotificationsOffIcon />}
              </ToggleButton>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleDiscard}>Discard</Button>
            <Button
              variant="contained"
              onClick={handleSave}
              data-testid="save-changes-button"
            >
              Save changes
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
