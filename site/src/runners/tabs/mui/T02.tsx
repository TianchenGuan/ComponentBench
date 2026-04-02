'use client';

/**
 * tabs-mui-T02: Bottom-left fullWidth tabs: activate Team
 *
 * Layout: isolated_card anchored near the bottom-left of the viewport titled "Roadmap".
 * Component: MUI Tabs configured with variant=fullWidth so tabs stretch across the card width.
 * Tabs: "Overview", "Team", "Timeline".
 * Initial state: "Overview" is selected.
 * No other components; tab selection updates the indicator and panel immediately.
 * Success: Selected tab is "Team" (value/key: team).
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

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('overview');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'team') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Roadmap
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="Roadmap tabs">
            <Tab label="Overview" value="overview" />
            <Tab label="Team" value="team" />
            <Tab label="Timeline" value="timeline" />
          </Tabs>
        </Box>
        <TabPanel value="overview" current={value}>
          <Typography>Overview panel content</Typography>
        </TabPanel>
        <TabPanel value="team" current={value}>
          <Typography>Team panel content</Typography>
        </TabPanel>
        <TabPanel value="timeline" current={value}>
          <Typography>Timeline panel content</Typography>
        </TabPanel>
      </CardContent>
    </Card>
  );
}
