'use client';

/**
 * checkbox_tristate-mui-T05: Advanced tab: set Experimental caching to Partial
 *
 * Layout: settings_panel with a tab bar at the top of the panel.
 * Tabs:
 * - "General" (selected by default)
 * - "Advanced" (contains the target)
 *
 * The "General" tab shows unrelated controls (a switch and a text field).
 * The target tri-state checkbox is only visible after switching to the "Advanced" tab.
 *
 * In "Advanced", there is a single MUI tri-state checkbox labeled "Experimental caching".
 * Initial state (when first viewing "Advanced"): Unchecked.
 * No explicit Save button; the checkbox state changes immediately.
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, CardContent, Tabs, Tab, Box, FormControlLabel, Checkbox, Switch, TextField } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [tabValue, setTabValue] = useState(0);
  const [state, setState] = useState<TristateValue>('unchecked');
  const [autoSave, setAutoSave] = useState(true);

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="General" />
          <Tab label="Advanced" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />}
              label="Auto-save"
            />
            <TextField label="Cache path" size="small" fullWidth defaultValue="/tmp/cache" />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                onClick={handleClick}
                data-testid="experimental-caching-checkbox"
              />
            }
            label="Experimental caching"
          />
        </TabPanel>
      </CardContent>
    </Card>
  );
}
