'use client';

/**
 * tabs-mui-T04: Scrollable months: find October tab
 *
 * Layout: isolated_card centered titled "Monthly Reports".
 * Universal variation: component scale is small.
 * Component: MUI Tabs with variant="scrollable" and scrollButtons="auto" so arrows appear when not all tabs fit.
 * Tabs are the 12 months: "January" through "December".
 * Initial state: "January" is selected.
 * The card is intentionally narrow so only a few month tabs are visible at once; the rest require horizontal scrolling via the built-in scroll buttons.
 * No other UI elements; success depends only on which month tab is selected.
 * Success: Selected tab is "October" (value/key: october).
 */

import React, { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const months = [
  { key: 'january', label: 'January' },
  { key: 'february', label: 'February' },
  { key: 'march', label: 'March' },
  { key: 'april', label: 'April' },
  { key: 'may', label: 'May' },
  { key: 'june', label: 'June' },
  { key: 'july', label: 'July' },
  { key: 'august', label: 'August' },
  { key: 'september', label: 'September' },
  { key: 'october', label: 'October' },
  { key: 'november', label: 'November' },
  { key: 'december', label: 'December' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('january');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (newValue === 'october') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Monthly Reports
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Monthly Reports tabs"
          >
            {months.map((month) => (
              <Tab key={month.key} label={month.label} value={month.key} sx={{ minWidth: 'auto', fontSize: '0.8rem' }} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ pt: 2 }}>
          <Typography>
            {months.find((m) => m.key === value)?.label} report content
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
