'use client';

/**
 * tabs-mui-T03: Two tab sets: User settings to Security
 *
 * Layout: isolated_card scene with two separate sections side-by-side.
 * Section A header: "Project" and contains MUI Tabs with tabs "Overview", "Issues", "Releases".
 * Section B header: "User settings" and contains MUI Tabs with tabs "Account", "Notifications", "Security".
 * Initial state: Project is on "Overview"; User settings is on "Account".
 * Both tab sets are standard horizontal tabs with a visible indicator under the selected tab.
 * No dialogs, no search fields, and no other tab components.
 * Success: In the "User settings" tabs instance, the selected tab is "Security" (value/key: security).
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

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [projectValue, setProjectValue] = useState('overview');
  const [userValue, setUserValue] = useState('account');

  const handleUserChange = (_event: React.SyntheticEvent, newValue: string) => {
    setUserValue(newValue);
    if (newValue === 'security') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Project
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={projectValue}
              onChange={(_e, v) => setProjectValue(v)}
              aria-label="Project tabs"
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Issues" value="issues" />
              <Tab label="Releases" value="releases" />
            </Tabs>
          </Box>
          <TabPanel value="overview" current={projectValue}>
            <Typography>Project Overview</Typography>
          </TabPanel>
          <TabPanel value="issues" current={projectValue}>
            <Typography>Project Issues</Typography>
          </TabPanel>
          <TabPanel value="releases" current={projectValue}>
            <Typography>Project Releases</Typography>
          </TabPanel>
        </CardContent>
      </Card>

      <Card sx={{ width: 350 }} data-testid="tabs-user-settings">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User settings
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={userValue}
              onChange={handleUserChange}
              aria-label="User settings tabs"
            >
              <Tab label="Account" value="account" />
              <Tab label="Notifications" value="notifications" />
              <Tab label="Security" value="security" />
            </Tabs>
          </Box>
          <TabPanel value="account" current={userValue}>
            <Typography>Account settings</Typography>
          </TabPanel>
          <TabPanel value="notifications" current={userValue}>
            <Typography>Notifications settings</Typography>
          </TabPanel>
          <TabPanel value="security" current={userValue}>
            <Typography>Security settings</Typography>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}
