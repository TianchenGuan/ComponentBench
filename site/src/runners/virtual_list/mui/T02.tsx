'use client';

/**
 * virtual_list-mui-T02: Toggle a per-row switch in a virtual list
 *
 * Layout: isolated_card centered, titled "Notification Channels".
 * Target component: a virtualized MUI List (react-window) showing channels with a Switch on the right.
 * Row content:
 *   - primary text: "Channel #### — <name>"
 *   - right: a MUI Switch labeled via aria-label "Muted"
 * Initial state: all switches are OFF; Channel 0003 is visible without scrolling.
 *
 * Success: Channel 0003 has Muted = true
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItem, ListItemText, Switch, Chip, Box } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface ChannelItem {
  key: string;
  id: string;
  name: string;
}

// Generate 100 channels
const generateChannels = (): ChannelItem[] => {
  const names = [
    'Marketing Updates', 'Product News', 'System Alerts', 'Sales Notifications',
    'Team Announcements', 'Support Tickets', 'Release Notes', 'Security Alerts',
    'HR Updates', 'Finance Reports'
  ];
  
  return Array.from({ length: 100 }, (_, i) => ({
    key: `channel-${String(i + 1).padStart(4, '0')}`,
    id: `Channel ${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
  }));
};

const channels = generateChannels();

export default function T02({ onSuccess }: TaskComponentProps) {
  const [mutedKeys, setMutedKeys] = useState<Set<string>>(new Set());

  const handleToggleMute = (key: string) => {
    setMutedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (mutedKeys.has('channel-0003')) {
      onSuccess();
    }
  }, [mutedKeys, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = channels[index];
    const isMuted = mutedKeys.has(item.key);
    return (
      <ListItem
        style={style}
        data-item-key={item.key}
        data-muted={isMuted}
        secondaryAction={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMuted && <Chip label="Muted" size="small" color="warning" />}
            <Switch
              edge="end"
              checked={isMuted}
              onChange={() => handleToggleMute(item.key)}
              inputProps={{ 'aria-label': 'Muted' }}
            />
          </Box>
        }
      >
        <ListItemText 
          primary={`${item.id} — ${item.name}`}
        />
      </ListItem>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 450, p: 2 }} data-testid="vl-primary">
      <Typography variant="h6" gutterBottom>
        Notification Channels
      </Typography>
      <Paper variant="outlined">
        <FixedSizeList
          height={400}
          width="100%"
          itemSize={56}
          itemCount={channels.length}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </Paper>
    </Paper>
  );
}
