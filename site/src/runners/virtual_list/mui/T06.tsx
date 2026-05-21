'use client';

/**
 * virtual_list-mui-T06: Match a visual icon in dark theme
 *
 * Theme: dark.
 * Layout: isolated_card titled "Status Presets".
 * Visual guidance: a "Target tile" above the list shows a unique icon + color combination.
 * 24 presets, each with a unique icon + color combination.
 *
 * Success: Select the row matching the target tile (preset-18, "Paused" — Pause icon, teal).
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItemButton, ListItemText, ListItemAvatar, Avatar, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CheckCircle, Warning, Error as ErrorIcon, Info, Schedule, Pause, PlayArrow, Stop } from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface PresetItem {
  key: string;
  name: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  check: CheckCircle,
  warning: Warning,
  error: ErrorIcon,
  info: Info,
  schedule: Schedule,
  pause: Pause,
  play: PlayArrow,
  stop: Stop,
};

const presets: PresetItem[] = [
  { key: 'preset-01', name: 'On track', icon: 'check', color: '#4caf50' },
  { key: 'preset-02', name: 'Caution', icon: 'warning', color: '#ff9800' },
  { key: 'preset-03', name: 'Critical', icon: 'error', color: '#f44336' },
  { key: 'preset-04', name: 'Informational', icon: 'info', color: '#2196f3' },
  { key: 'preset-05', name: 'Scheduled', icon: 'schedule', color: '#9c27b0' },
  { key: 'preset-06', name: 'On hold', icon: 'pause', color: '#607d8b' },
  { key: 'preset-07', name: 'Running', icon: 'play', color: '#00bcd4' },
  { key: 'preset-08', name: 'Stopped', icon: 'stop', color: '#ff5722' },
  { key: 'preset-09', name: 'Approved', icon: 'check', color: '#00bcd4' },
  { key: 'preset-10', name: 'Alert', icon: 'warning', color: '#f44336' },
  { key: 'preset-11', name: 'Failed', icon: 'error', color: '#9c27b0' },
  { key: 'preset-12', name: 'Note', icon: 'info', color: '#4caf50' },
  { key: 'preset-13', name: 'Delayed', icon: 'schedule', color: '#ff9800' },
  { key: 'preset-14', name: 'Suspended', icon: 'pause', color: '#ff5722' },
  { key: 'preset-15', name: 'Active', icon: 'play', color: '#4caf50' },
  { key: 'preset-16', name: 'Cancelled', icon: 'stop', color: '#607d8b' },
  { key: 'preset-17', name: 'Verified', icon: 'check', color: '#9c27b0' },
  { key: 'preset-18', name: 'Paused', icon: 'pause', color: '#00bcd4' },
  { key: 'preset-19', name: 'Timeout', icon: 'schedule', color: '#f44336' },
  { key: 'preset-20', name: 'Degraded', icon: 'warning', color: '#607d8b' },
  { key: 'preset-21', name: 'Deploying', icon: 'play', color: '#ff9800' },
  { key: 'preset-22', name: 'Queued', icon: 'schedule', color: '#2196f3' },
  { key: 'preset-23', name: 'Resolved', icon: 'check', color: '#2196f3' },
  { key: 'preset-24', name: 'Terminated', icon: 'stop', color: '#f44336' },
];

const TARGET_KEY = 'preset-18';
const targetPreset = presets.find(p => p.key === TARGET_KEY)!;

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (selectedKey === TARGET_KEY) {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = presets[index];
    const IconComponent = iconMap[item.icon];
    return (
      <ListItemButton
        style={style}
        selected={selectedKey === item.key}
        onClick={() => setSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={selectedKey === item.key}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: item.color, width: 32, height: 32 }}>
            <IconComponent sx={{ fontSize: 18 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.name} />
      </ListItemButton>
    );
  };

  const TargetIcon = iconMap[targetPreset.icon];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Paper elevation={2} sx={{ width: 400, p: 2 }} data-testid="vl-primary">
        <Typography variant="h6" gutterBottom>Status Presets</Typography>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar sx={{ bgcolor: targetPreset.color, width: 48, height: 48 }}>
              <TargetIcon />
            </Avatar>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ mb: 1 }}>
          <FixedSizeList
            height={300}
            width="100%"
            itemSize={48}
            itemCount={presets.length}
            overscanCount={5}
          >
            {Row}
          </FixedSizeList>
        </Paper>

        <Typography variant="body2" color="text.secondary">
          Selected preset: {selectedKey ? presets.find(p => p.key === selectedKey)?.name : 'none'}
        </Typography>
      </Paper>
    </ThemeProvider>
  );
}
