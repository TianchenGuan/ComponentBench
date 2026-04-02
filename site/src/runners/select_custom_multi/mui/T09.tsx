'use client';

/**
 * select_custom_multi-mui-T09: Set Include labels in a drawer and apply
 *
 * Scene context: theme=light, spacing=comfortable, layout=drawer_flow, placement=center, scale=default, instances=1, guidance=text, clutter=low.
 * Layout: drawer flow. The base page shows a toolbar with a button "Advanced filters".
 * Clicking "Advanced filters" opens a right-side drawer titled "Advanced filters".
 * Inside the drawer is one MUI Autocomplete (multiple) field labeled "Include labels" (TARGET component).
 * Options (12): P0, P1, P2, Bug, Feature, Support, Internal, Customer, Billing, Security, Docs, Ops.
 * Initial state: Include labels has Bug selected.
 * At the bottom of the drawer there are two buttons: "Reset" (secondary) and "Apply filters" (primary).
 * Selecting chips updates immediately inside the drawer, but the underlying filter state only commits after clicking Apply filters.
 *
 * Success: The selected values are exactly: P0, Security, Billing (order does not matter). Changes must be committed by clicking 'Apply filters'.
 */

import React, { useState, useRef } from 'react';
import { 
  Card, CardContent, Button, Drawer, Typography, Box,
  Autocomplete, TextField, Chip, AppBar, Toolbar
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const labelOptions = [
  'P0', 'P1', 'P2', 'Bug', 'Feature', 'Support',
  'Internal', 'Customer', 'Billing', 'Security', 'Docs', 'Ops'
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Bug']);
  const [appliedSelection, setAppliedSelection] = useState<string[]>(['Bug']);
  const successTriggered = useRef(false);

  const handleApply = () => {
    setAppliedSelection([...selected]);
    setIsDrawerOpen(false);

    // Check success after apply
    const targetSet = new Set(['P0', 'Security', 'Billing']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!successTriggered.current) {
        successTriggered.current = true;
        onSuccess();
      }
    }
  };

  const handleReset = () => {
    setSelected([]);
  };

  const handleOpen = () => {
    setSelected([...appliedSelection]);
    setIsDrawerOpen(true);
  };

  const handleClose = () => {
    setSelected([...appliedSelection]); // Reset to applied state
    setIsDrawerOpen(false);
  };

  return (
    <Card sx={{ width: 400, p: 0 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Button variant="outlined" onClick={handleOpen}>
            Advanced filters
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: 350, p: 3 }}>
          <Typography variant="h6" gutterBottom>Advanced filters</Typography>
          
          <Box sx={{ my: 3 }}>
            <Autocomplete
              multiple
              data-testid="include-labels-select"
              options={labelOptions}
              value={selected}
              onChange={(_, newValue) => setSelected(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Include labels" placeholder="Select labels" />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleApply}>
              Apply filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Card>
  );
}
