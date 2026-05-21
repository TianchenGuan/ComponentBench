'use client';

/**
 * tabs-mui-T01: Basic MUI tabs: go to Messages
 *
 * Layout: isolated_card centered titled "Workspace".
 * Component: MUI Tabs (variant=standard, horizontal) with three Tab items.
 * Tabs: "Home", "Profile", "Messages".
 * Initial state: "Home" is selected (selected indicator under "Home").
 * Each panel contains a short paragraph; panels swap immediately on selection.
 * No other interactive UI elements and no overlays.
 * Success: Selected tab is "Messages" (value/key: messages).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography } from '@mui/material';
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

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('home');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'messages') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Workspace
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="Workspace tabs">
            <Tab label="Home" value="home" />
            <Tab label="Profile" value="profile" />
            <Tab label="Messages" value="messages" />
          </Tabs>
        </Box>
        <TabPanel value="home" current={value}>
          <Typography>Home panel content</Typography>
        </TabPanel>
        <TabPanel value="profile" current={value}>
          <Typography>Profile panel content</Typography>
        </TabPanel>
        <TabPanel value="messages" current={value}>
          <Typography>Messages panel content</Typography>
        </TabPanel>
      </CardContent>
    </Card>
  );
}
