'use client';

/**
 * listbox_single-mui-T09: Dark mode: set Region to North America (two lists)
 *
 * Scene: dark theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card in dark theme contains two vertically stacked single-select MUI List listboxes.
 * The first is labeled "Region" with four options: "North America", "Europe", "Asia-Pacific", "Latin America"
 * (initial selection: "Europe"). The second is labeled "Segment" with options "SMB", "Mid-market", "Enterprise"
 * (initial selection: "SMB"). Each option is a ListItemButton that shows selected styling when active.
 * There are no other controls or panels. The task targets the listbox labeled "Region".
 *
 * Success: Selected option value equals: north_america (in Region)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

const regionOptions = [
  { value: 'north_america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia_pacific', label: 'Asia-Pacific' },
  { value: 'latin_america', label: 'Latin America' },
];

const segmentOptions = [
  { value: 'smb', label: 'SMB' },
  { value: 'mid_market', label: 'Mid-market' },
  { value: 'enterprise', label: 'Enterprise' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [regionSelected, setRegionSelected] = useState<string>('europe');
  const [segmentSelected, setSegmentSelected] = useState<string>('smb');

  const handleRegionSelect = (value: string) => {
    setRegionSelected(value);
    if (value === 'north_america') {
      onSuccess();
    }
  };

  const handleSegmentSelect = (value: string) => {
    setSegmentSelected(value);
  };

  return (
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Region</Typography>
            <List
              data-cb-listbox-root
              data-cb-instance="region"
              data-cb-selected-value={regionSelected}
              sx={{ border: '1px solid #444', borderRadius: 1 }}
            >
              {regionOptions.map(opt => (
                <ListItemButton
                  key={opt.value}
                  selected={regionSelected === opt.value}
                  onClick={() => handleRegionSelect(opt.value)}
                  data-cb-option-value={opt.value}
                >
                  <ListItemText primary={opt.label} />
                </ListItemButton>
              ))}
            </List>
          </div>

          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Segment</Typography>
            <List
              data-cb-listbox-root
              data-cb-instance="segment"
              data-cb-selected-value={segmentSelected}
              sx={{ border: '1px solid #444', borderRadius: 1 }}
            >
              {segmentOptions.map(opt => (
                <ListItemButton
                  key={opt.value}
                  selected={segmentSelected === opt.value}
                  onClick={() => handleSegmentSelect(opt.value)}
                  data-cb-option-value={opt.value}
                >
                  <ListItemText primary={opt.label} />
                </ListItemButton>
              ))}
            </List>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
