'use client';

/**
 * checkbox_group-mui-T05: Edit notification channels in a drawer and save
 *
 * Scene: light theme; comfortable spacing; a drawer panel flow anchored toward the top-right.
 * Material UI settings page (light theme). The main card shows "Notifications" with a button "Edit notification channels".
 * Clicking the button opens a right-side drawer. Inside the drawer:
 * - A section header "Notification channels"
 * - One FormGroup (target) with four checkboxes: Email, SMS, Push, In-app
 * - Footer buttons: "Save" (primary) and "Cancel" (secondary)
 * Initial drawer state: Email and In-app are checked; SMS and Push are unchecked.
 * Success: After clicking Save, the saved selection equals: Email and Push (only).
 */

import React, { useState, useRef } from 'react';
import { 
  Card, CardContent, Typography, Button, Drawer, Box,
  FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channels, setChannels] = useState<Record<string, boolean>>({
    Email: true,
    SMS: false,
    Push: false,
    'In-app': true,
  });
  const hasSucceeded = useRef(false);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannels({ ...channels, [name]: event.target.checked });
  };

  const handleSave = () => {
    const targetSet = new Set(['Email', 'Push']);
    const checkedItems = Object.entries(channels).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    // Reset to initial state
    setChannels({ Email: true, SMS: false, Push: false, 'In-app': true });
    setDrawerOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure how you receive notifications from the platform.
          </Typography>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Edit notification channels
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCancel}
      >
        <Box sx={{ width: 320, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>Notification channels</Typography>
          
          <FormControl component="fieldset" sx={{ flex: 1 }} data-testid="cg-notification-channels">
            <FormLabel component="legend" sx={{ mb: 1 }}>Select channels</FormLabel>
            <FormGroup>
              {Object.keys(channels).map(channel => (
                <FormControlLabel
                  key={channel}
                  control={
                    <Checkbox 
                      checked={channels[channel]} 
                      onChange={handleChange(channel)}
                      name={channel}
                    />
                  }
                  label={channel}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} data-testid="btn-save">Save</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
