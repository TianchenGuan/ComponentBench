'use client';

/**
 * tabs-mui-T05: Vertical settings tabs: open API Keys
 *
 * Layout: settings_panel titled "Advanced Settings".
 * Component: MUI Tabs rendered in vertical orientation on the left side of the panel.
 * Tabs: "General", "API Keys", "Webhooks", "Logs", "Limits", "About".
 * Initial state: "General" is selected.
 * Clutter: medium—there is a search field and two toggle switches above the tab panel, but none are required for success.
 * Selecting a vertical tab highlights it and swaps the content panel on the right.
 * Success: Selected tab is "API Keys" (value/key: api-keys).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, TextField, Switch, FormControlLabel } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  value: string;
  current: string;
}

function TabPanel({ children, value, current }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== current} style={{ flexGrow: 1 }}>
      {value === current && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('general');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'api-keys') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Advanced Settings
        </Typography>
        
        {/* Clutter: search and toggles */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" placeholder="Search settings..." sx={{ width: 200 }} />
          <FormControlLabel control={<Switch size="small" />} label="Debug mode" />
          <FormControlLabel control={<Switch size="small" />} label="Beta features" />
        </Box>

        <Box sx={{ display: 'flex', borderTop: 1, borderColor: 'divider', pt: 2 }}>
          <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Advanced Settings tabs"
            sx={{ borderRight: 1, borderColor: 'divider', minWidth: 140 }}
          >
            <Tab label="General" value="general" sx={{ alignItems: 'flex-start' }} />
            <Tab label="API Keys" value="api-keys" sx={{ alignItems: 'flex-start' }} />
            <Tab label="Webhooks" value="webhooks" sx={{ alignItems: 'flex-start' }} />
            <Tab label="Logs" value="logs" sx={{ alignItems: 'flex-start' }} />
            <Tab label="Limits" value="limits" sx={{ alignItems: 'flex-start' }} />
            <Tab label="About" value="about" sx={{ alignItems: 'flex-start' }} />
          </Tabs>
          <TabPanel value="general" current={value}>
            <Typography>General settings panel</Typography>
          </TabPanel>
          <TabPanel value="api-keys" current={value}>
            <Typography>API Keys panel</Typography>
          </TabPanel>
          <TabPanel value="webhooks" current={value}>
            <Typography>Webhooks panel</Typography>
          </TabPanel>
          <TabPanel value="logs" current={value}>
            <Typography>Logs panel</Typography>
          </TabPanel>
          <TabPanel value="limits" current={value}>
            <Typography>Limits panel</Typography>
          </TabPanel>
          <TabPanel value="about" current={value}>
            <Typography>About panel</Typography>
          </TabPanel>
        </Box>
      </CardContent>
    </Card>
  );
}
