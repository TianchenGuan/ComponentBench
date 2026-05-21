'use client';

/**
 * listbox_single-mui-T02: Quick filter nav: select Today
 *
 * Scene: light theme, comfortable spacing, dashboard layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A dashboard layout shows a compact left column titled "Quick filters" containing a MUI List with four
 * ListItemButton options: "All", "Today", "This week", "This month". The main area shows a read-only table
 * preview that changes when a filter is selected, but no interaction with it is required. Initial filter is "All".
 *
 * Success: Selected option value equals: today
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, Box, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
];

const previewData: Record<string, string[]> = {
  all: ['Invoice #1001', 'Invoice #1002', 'Invoice #1003'],
  today: ['Invoice #1003'],
  this_week: ['Invoice #1002', 'Invoice #1003'],
  this_month: ['Invoice #1001', 'Invoice #1002', 'Invoice #1003'],
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('all');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'today') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', width: 600, border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box sx={{ width: 180, borderRight: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
        <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 600 }}>
          Quick filters
        </Typography>
        <Divider />
        <List
          data-cb-listbox-root
          data-cb-selected-value={selected}
          dense
        >
          {filterOptions.map(opt => (
            <ListItemButton
              key={opt.value}
              selected={selected === opt.value}
              onClick={() => handleSelect(opt.value)}
              data-cb-option-value={opt.value}
            >
              <ListItemText primary={opt.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Invoices
        </Typography>
        <Card variant="outlined">
          <CardContent>
            {previewData[selected]?.map((item, i) => (
              <Typography key={i} variant="body2" color="text.secondary">
                {item}
              </Typography>
            ))}
            {previewData[selected]?.length === 0 && (
              <Typography variant="body2" color="text.secondary">No invoices</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
