'use client';

/**
 * segmented_control-mui-T04: Filter drawer: Sort by → Name + Apply
 *
 * Layout: drawer flow on a results dashboard.
 * The main page has a top app bar with a button labeled "Filters".
 * Clicking "Filters" opens a right-side Drawer titled "Filters".
 *
 * Inside the drawer, there is a section labeled "Sort results by" containing a ToggleButtonGroup (exclusive) with options:
 * "Date", "Name", "Priority".
 *
 * Initial committed state: "Date" is selected.
 *
 * Drawer footer contains:
 * - "Apply" (commits all filter changes and closes the drawer)
 * - "Reset" (resets filters; not required)
 *
 * Clutter (medium): additional non-required filters (checkbox list, a date range input) appear above/below,
 * but only the sort ToggleButtonGroup affects success.
 *
 * Success: In the Filters drawer, "Sort results by" committed value = Name.
 * The change is confirmed by clicking "Apply".
 */

import React, { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button, Drawer,
  ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox,
  TextField, Divider, Stack
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const sortOptions = ['Date', 'Name', 'Priority'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [committedSort, setCommittedSort] = useState<string>('Date');
  const [pendingSort, setPendingSort] = useState<string>('Date');

  const openDrawer = () => {
    setPendingSort(committedSort);
    setDrawerOpen(true);
  };

  const handleApply = () => {
    setCommittedSort(pendingSort);
    setDrawerOpen(false);
    if (pendingSort === 'Name') {
      onSuccess();
    }
  };

  const handleReset = () => {
    setPendingSort('Date');
  };

  const handleSortChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setPendingSort(value);
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: 400 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Results Dashboard</Typography>
          <Button variant="outlined" onClick={openDrawer}>Filters</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Current sort: {committedSort}
        </Typography>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Clutter: checkbox list */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Categories</Typography>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Technology" />
          <FormControlLabel control={<Checkbox />} label="Business" />
          <FormControlLabel control={<Checkbox />} label="Design" />

          <Divider sx={{ my: 2 }} />

          {/* Target: Sort results by */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Sort results by</Typography>
          <ToggleButtonGroup
            data-testid="sort-results-by"
            data-canonical-type="segmented_control"
            data-selected-value={pendingSort}
            value={pendingSort}
            exclusive
            onChange={handleSortChange}
            aria-label="Sort results by"
            size="small"
            sx={{ mb: 2 }}
          >
            {sortOptions.map(option => (
              <ToggleButton key={option} value={option} aria-label={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Divider sx={{ my: 2 }} />

          {/* Clutter: date range */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Date range</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField size="small" label="From" type="date" InputLabelProps={{ shrink: true }} />
            <TextField size="small" label="To" type="date" InputLabelProps={{ shrink: true }} />
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" spacing={1}>
            <Button onClick={handleReset}>Reset</Button>
            <Button variant="contained" onClick={handleApply}>Apply</Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
