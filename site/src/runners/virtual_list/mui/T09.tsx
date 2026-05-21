'use client';

/**
 * virtual_list-mui-T09: Select an exact set in a small-scale list and archive
 *
 * Scale: small (reduced font size and smaller checkbox targets).
 * Layout: isolated_card centered titled "System Logs".
 * Target component: a react-window virtualized list (height ~340px) containing ~2,000 log entries.
 * Row content: Checkbox · "LOG-####" · small timestamp.
 * Confirmation: a sticky action bar with a primary button "Archive selected".
 * Initial state: no logs selected; list scrolled to top.
 *
 * Success: Exactly logs 0004, 0011, 0019 are checked AND "Archive selected" is clicked
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItem, ListItemButton, ListItemText, Checkbox, Button, Snackbar, Box } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

interface LogItem {
  key: string;
  id: string;
  timestamp: string;
}

// Generate 2000 logs
const generateLogs = (): LogItem[] => {
  return Array.from({ length: 2000 }, (_, i) => ({
    key: `log-${String(i + 1).padStart(4, '0')}`,
    id: `LOG-${String(i + 1).padStart(4, '0')}`,
    timestamp: `2024-02-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  }));
};

const logs = generateLogs();
const TARGET_KEYS = ['log-0004', 'log-0011', 'log-0019'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());
  const [hasArchived, setHasArchived] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleArchive = () => {
    setHasArchived(true);
    setShowToast(true);
  };

  // Check success condition
  useEffect(() => {
    if (hasArchived && selectionSetEquals(checkedKeys, TARGET_KEYS)) {
      onSuccess();
    }
  }, [hasArchived, checkedKeys, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = logs[index];
    const isChecked = checkedKeys.has(item.key);
    return (
      <ListItem
        style={style}
        disablePadding
        data-item-key={item.key}
        aria-checked={isChecked}
        sx={{ fontSize: '0.75rem' }}  // Small scale
      >
        <ListItemButton 
          onClick={() => handleToggleCheck(item.key)}
          sx={{ py: 0.5 }}  // Compact
        >
          <Checkbox
            edge="start"
            checked={isChecked}
            disableRipple
            size="small"
          />
          <ListItemText 
            primary={item.id}
            secondary={item.timestamp}
            primaryTypographyProps={{ fontSize: '0.8rem' }}
            secondaryTypographyProps={{ fontSize: '0.7rem' }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 380, p: 2 }} data-testid="vl-primary">
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
        System Logs
      </Typography>
      
      <Paper variant="outlined" sx={{ mb: 1 }}>
        <FixedSizeList
          height={340}
          width="100%"
          itemSize={44}  // Small rows
          itemCount={logs.length}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </Paper>

      {/* Action bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <Button 
          variant="contained" 
          size="small"
          onClick={handleArchive}
          disabled={checkedKeys.size === 0}
        >
          Archive selected ({checkedKeys.size})
        </Button>
      </Box>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message="Archived"
      />
    </Paper>
  );
}
