'use client';

/**
 * tabs-mui-T08: Dark dense labels: select Logins tab
 *
 * Layout: isolated_card centered titled "Access Logs".
 * Universal variation: dark theme.
 * Component: MUI Tabs (variant=standard) with several short, highly confusable labels.
 * Tabs: "Log", "Logs", "Login", "Logins", "Logout", "Logbook".
 * Initial state: "Logs" is selected.
 * All tabs fit without scrolling, but the similarity of labels is intentional.
 * Immediate feedback: the selected indicator moves to the chosen tab and the panel heading updates.
 * Success: Selected tab is "Logins" (value/key: logins).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('logs');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'logins') {
      onSuccess();
    }
  };

  const tabs = [
    { key: 'log', label: 'Log' },
    { key: 'logs', label: 'Logs' },
    { key: 'login', label: 'Login' },
    { key: 'logins', label: 'Logins' },
    { key: 'logout', label: 'Logout' },
    { key: 'logbook', label: 'Logbook' },
  ];

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Access Logs
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Access Logs tabs">
            {tabs.map((tab) => (
              <Tab key={tab.key} label={tab.label} value={tab.key} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ pt: 2 }}>
          <Typography>
            {tabs.find((t) => t.key === value)?.label} panel content
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
