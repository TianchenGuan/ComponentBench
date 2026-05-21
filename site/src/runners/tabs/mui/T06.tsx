'use client';

/**
 * tabs-mui-T06: Preferences drawer: switch to Appearance
 *
 * Layout: drawer_flow. The main page has a button labeled "Open Preferences".
 * Clicking it opens a MUI Drawer sliding in from the right.
 * Inside the drawer header is a title "Preferences" and directly below is a MUI Tabs component.
 * Tabs: "General", "Shortcuts", "Appearance".
 * Initial state: when the drawer opens, "General" is selected.
 * Clutter: low—drawer also contains a close icon in the top-right, but closing is not required.
 * Selecting a tab immediately swaps the drawer content panel.
 * Success: Selected tab is "Appearance" (value/key: appearance).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Button, Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('general');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'appearance') {
      onSuccess();
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Preferences
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Preferences</Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="Preferences tabs">
              <Tab label="General" value="general" />
              <Tab label="Shortcuts" value="shortcuts" />
              <Tab label="Appearance" value="appearance" />
            </Tabs>
          </Box>
          <TabPanel value="general" current={value}>
            <Typography>General preferences panel</Typography>
          </TabPanel>
          <TabPanel value="shortcuts" current={value}>
            <Typography>Shortcuts preferences panel</Typography>
          </TabPanel>
          <TabPanel value="appearance" current={value}>
            <Typography>Appearance preferences panel</Typography>
          </TabPanel>
        </Box>
      </Drawer>
    </div>
  );
}
