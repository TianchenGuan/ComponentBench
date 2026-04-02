'use client';

/**
 * toast_snackbar-mui-T06: Scroll to find trigger: Send test notification snackbar
 *
 * setup_description:
 * Scene is a settings_panel layout with medium clutter: a tall settings pane contains many toggles, selects, and helper text (distractors).
 * The target button "Send test notification" is located near the bottom of the settings pane and requires scrolling to become visible.
 * Clicking the target button opens a MUI **Snackbar** with message text exactly "Test notification sent". No other snackbars are shown by default.
 *
 * success_trigger: A snackbar is visible with message text exactly "Test notification sent".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Snackbar,
  FormControl,
  FormLabel,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Divider,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleSendTest = () => {
    setOpen(true);
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Settings</Typography>
        
        <Box
          data-testid="settings-scroll"
          sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}
        >
          {/* Distractors to create scroll */}
          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel>Display</FormLabel>
            <FormControlLabel control={<Switch defaultChecked />} label="Dark mode" />
            <FormControlLabel control={<Switch />} label="Compact view" />
            <FormControlLabel control={<Switch defaultChecked />} label="Show avatars" />
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Language</FormLabel>
            <Select defaultValue="en" size="small" sx={{ mt: 1 }}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel>Privacy</FormLabel>
            <FormControlLabel control={<Switch />} label="Share usage data" />
            <FormControlLabel control={<Switch defaultChecked />} label="Show online status" />
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel>Accessibility</FormLabel>
            <FormControlLabel control={<Switch />} label="High contrast" />
            <FormControlLabel control={<Switch />} label="Reduce motion" />
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Timezone</FormLabel>
            <Select defaultValue="utc" size="small" sx={{ mt: 1 }}>
              <MenuItem value="utc">UTC</MenuItem>
              <MenuItem value="est">Eastern Time</MenuItem>
              <MenuItem value="pst">Pacific Time</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
            <FormLabel>Notifications</FormLabel>
            <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
            <FormControlLabel control={<Switch defaultChecked />} label="Push notifications" />
            <FormControlLabel control={<Switch />} label="SMS notifications" />
          </FormControl>

          <Divider sx={{ my: 2 }} />

          {/* Target button at bottom */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Test your notification settings:
            </Typography>
            <Button
              variant="outlined"
              onClick={handleSendTest}
              data-testid="send-test-notification-btn"
            >
              Send test notification
            </Button>
          </Box>
        </Box>
      </CardContent>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={<span data-testid="snackbar-message">Test notification sent</span>}
        data-testid="snackbar-root"
      />
    </Card>
  );
}
