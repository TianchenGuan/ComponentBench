'use client';

/**
 * segmented_control-mui-T09: Main chart interval → 15m (2 groups, dashboard)
 *
 * Layout: dashboard with a dense header area (compact spacing) containing multiple controls.
 * Two ToggleButtonGroups appear side-by-side in the dashboard header:
 * 1) "Main chart interval" options: "1m", "5m", "15m", "1h"
 *    Initial state: 5m
 * 2) "Secondary chart interval" options: "1m", "5m", "15m", "1h"
 *    Initial state: 1m
 *
 * The ToggleButtonGroups are rendered in a compact, space-efficient style; buttons are narrower than default.
 *
 * Clutter (high): the header also contains a search box, several icon buttons (refresh, share), and a small dropdown labeled "Metric".
 * None of these affect success.
 *
 * Changes apply immediately; no Apply button.
 *
 * Success: The ToggleButtonGroup labeled "Main chart interval" has selected value = 15m.
 */

import React, { useState } from 'react';
import {
  Box, Typography, TextField, IconButton, Select, MenuItem, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import type { TaskComponentProps } from '../types';

const intervalOptions = ['1m', '5m', '15m', '1h'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [mainInterval, setMainInterval] = useState<string>('5m');
  const [secondaryInterval, setSecondaryInterval] = useState<string>('1m');

  const handleMainChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setMainInterval(value);
      if (value === '15m') {
        onSuccess();
      }
    }
  };

  const handleSecondaryChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSecondaryInterval(value);
      // No success for secondary
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: 300 }}>
      {/* Dense dashboard header */}
      <Box
        sx={{
          p: 1,
          bgcolor: 'grey.100',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <TextField size="small" placeholder="Search..." sx={{ width: 120 }} />
        
        <Select size="small" defaultValue="cpu" sx={{ minWidth: 80 }}>
          <MenuItem value="cpu">CPU</MenuItem>
          <MenuItem value="memory">Memory</MenuItem>
          <MenuItem value="network">Network</MenuItem>
        </Select>

        <IconButton size="small"><RefreshIcon fontSize="small" /></IconButton>
        <IconButton size="small"><ShareIcon fontSize="small" /></IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Main chart interval
          </Typography>
          <ToggleButtonGroup
            data-testid="main-chart-interval"
            data-canonical-type="segmented_control"
            data-selected-value={mainInterval}
            value={mainInterval}
            exclusive
            onChange={handleMainChange}
            aria-label="Main chart interval"
            size="small"
            sx={{
              '& .MuiToggleButton-root': { px: 1, py: 0.25, fontSize: '0.75rem' },
            }}
          >
            {intervalOptions.map(option => (
              <ToggleButton key={option} value={option} aria-label={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            Secondary chart interval
          </Typography>
          <ToggleButtonGroup
            data-testid="secondary-chart-interval"
            data-canonical-type="segmented_control"
            data-selected-value={secondaryInterval}
            value={secondaryInterval}
            exclusive
            onChange={handleSecondaryChange}
            aria-label="Secondary chart interval"
            size="small"
            sx={{
              '& .MuiToggleButton-root': { px: 1, py: 0.25, fontSize: '0.75rem' },
            }}
          >
            {intervalOptions.map(option => (
              <ToggleButton key={option} value={option} aria-label={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Dashboard content placeholder */}
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Dashboard content area</Typography>
        <Typography variant="caption">
          Main: {mainInterval} | Secondary: {secondaryInterval}
        </Typography>
      </Box>
    </Box>
  );
}
