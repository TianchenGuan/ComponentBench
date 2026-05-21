'use client';

/**
 * tabs-mui-T10: Dialog confirm: discard changes to reach Security
 *
 * Layout: form_section titled "Edit Profile".
 * Component: MUI Tabs (variant=standard) with tabs "Profile", "Security", "Sessions".
 * Initial state: "Profile" is selected.
 * The Profile panel contains an edited text field and shows an "Unsaved changes" helper text.
 * When attempting to switch away from the Profile tab, a MUI Dialog appears centered with title "Discard changes?".
 * Dialog actions: secondary "Stay" and primary "Discard and switch".
 * Only after confirming discard does the selected tab change to the intended destination.
 * Success: Selected tab is "Security" (value/key: security).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  current: string;
}

function TabPanel({ children, value, current }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== current}>
      {value === current && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('profile');
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (value === 'profile' && newValue !== 'profile') {
      setPendingValue(newValue);
      setDialogOpen(true);
    } else {
      setValue(newValue);
    }
  };

  const handleDiscard = () => {
    if (pendingValue) {
      setValue(pendingValue);
      if (pendingValue === 'security') {
        onSuccess();
      }
    }
    setPendingValue(null);
    setDialogOpen(false);
  };

  const handleStay = () => {
    setPendingValue(null);
    setDialogOpen(false);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit Profile
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Edit Profile tabs">
            <Tab label="Profile" value="profile" />
            <Tab label="Security" value="security" />
            <Tab label="Sessions" value="sessions" />
          </Tabs>
        </Box>
        <TabPanel value="profile" current={value}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unsaved changes
          </Alert>
          <TextField
            label="Display Name"
            defaultValue="John Doe (edited)"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            You have unsaved changes in this profile.
          </Typography>
        </TabPanel>
        <TabPanel value="security" current={value}>
          <Typography>Security panel content</Typography>
        </TabPanel>
        <TabPanel value="sessions" current={value}>
          <Typography>Sessions panel content</Typography>
        </TabPanel>
      </CardContent>

      <Dialog open={dialogOpen} onClose={handleStay}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Do you want to discard them and switch tabs?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay}>Stay</Button>
          <Button onClick={handleDiscard} variant="contained" color="primary">
            Discard and switch
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
