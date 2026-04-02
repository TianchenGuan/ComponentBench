'use client';

/**
 * checkbox_tristate-mui-T10: Drawer scroll: set Retention policy to Checked
 *
 * Layout: drawer_flow.
 * On the main page (a table-like list) there is a button labeled "Bulk edit".
 * Clicking it opens a MUI Drawer that slides in from the right.
 *
 * Inside the drawer is a vertically scrollable list of bulk-edit options with section headers
 * ("Basics", "Notifications", "Retention"). The target tri-state checkbox is in the "Retention" section
 * and is not visible at initial drawer scroll position.
 *
 * Target component: one MUI tri-state checkbox labeled "Retention policy"
 * (helper text: "Keep some items when storage is low").
 * Initial state: Indeterminate.
 *
 * Clutter: medium. The drawer contains several unrelated inputs.
 * No Apply button is required; state changes apply immediately within the drawer.
 * 
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Box, Button, Drawer, Typography, Divider, FormControlLabel, Checkbox, TextField, Select, MenuItem, Paper } from '@mui/material';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [state, setState] = useState<TristateValue>('indeterminate');

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: 500, p: 2 }}>
      {/* Main page with table-like list */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Items</Typography>
          <Button
            variant="contained"
            onClick={() => setDrawerOpen(true)}
            data-testid="bulk-edit-button"
          >
            Bulk edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">Item 1 - Active</Typography>
          <Typography variant="body2">Item 2 - Pending</Typography>
          <Typography variant="body2">Item 3 - Active</Typography>
        </Box>
      </Paper>

      {/* Drawer with bulk edit options */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 350, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Bulk Edit</Typography>
          </Box>

          <Box
            sx={{ flex: 1, overflow: 'auto', p: 2 }}
            data-testid="drawer-scroll-container"
          >
            {/* Basics section */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Basics</Typography>
            <Box sx={{ mb: 2 }}>
              <TextField label="Name prefix" size="small" fullWidth sx={{ mb: 1 }} />
              <Select size="small" fullWidth defaultValue="active">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Notifications section */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Notifications</Typography>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Send updates"
              />
              <TextField label="Email template" size="small" fullWidth sx={{ mt: 1 }} />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* More filler content */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Scheduling</Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Start date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1 }}
              />
              <TextField
                label="End date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Retention section - below initial fold */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Retention</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state === 'checked'}
                    indeterminate={state === 'indeterminate'}
                    onClick={handleClick}
                    data-testid="retention-policy-checkbox"
                  />
                }
                label="Retention policy"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4 }}>
                Keep some items when storage is low
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
