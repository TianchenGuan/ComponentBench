'use client';

/**
 * virtual_list-mui-T05: Search inside a settings-panel virtual list and select
 *
 * Layout: settings_panel occupying the center-left of the page, titled "Developer Settings".
 * Target component: a virtualized "API Keys" list section with:
 *   - a MUI TextField labeled "Filter keys"
 *   - a react-window virtualized list below (height ~320px) containing ~800 keys
 * Initial state: list unfiltered, scrolled to top; no key selected.
 *
 * Success: Select key 'key-7f2a' (Analytics)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Typography, TextField, ListItemButton, ListItemText, Switch, Box, FormControlLabel } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface KeyItem {
  key: string;
  code: string;
  purpose: string;
  created: string;
}

// Generate 800 API keys
const generateKeys = (): KeyItem[] => {
  const purposes = ['Analytics', 'Monitoring', 'Integration', 'Reporting', 'Automation', 'Sync', 'Backup', 'Export'];
  const codes = ['7F2A', '8B3C', '9D4E', 'A1F5', 'B2G6', 'C3H7', 'D4I8', 'E5J9'];
  
  return Array.from({ length: 800 }, (_, i) => {
    const num = i + 1;
    // Create unique 4-char codes
    const code = i === 0 ? '7F2A' : `${codes[(i * 7) % codes.length].slice(0, 2)}${String(num).slice(-2).toUpperCase()}`;
    let purpose = purposes[i % purposes.length];
    // Special key
    if (code === '7F2A') purpose = 'Analytics';
    return {
      key: `key-${code.toLowerCase()}`,
      code: `Key ${code}`,
      purpose,
      created: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    };
  });
};

const keys = generateKeys();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    if (!searchText.trim()) return keys;
    const lower = searchText.toLowerCase();
    return keys.filter(k => 
      k.code.toLowerCase().includes(lower) || 
      k.purpose.toLowerCase().includes(lower)
    );
  }, [searchText]);

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'key-7f2a') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const selectedKeyItem = keys.find(k => k.key === selectedKey);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = filteredKeys[index];
    return (
      <ListItemButton
        style={style}
        selected={selectedKey === item.key}
        onClick={() => setSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={selectedKey === item.key}
      >
        <ListItemText 
          primary={`${item.code} — ${item.purpose}`}
          secondary={`Created: ${item.created}`}
        />
      </ListItemButton>
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 3 }} data-testid="vl-primary">
      <Typography variant="h6" gutterBottom>
        Developer Settings
      </Typography>
      
      {/* Clutter: unrelated settings */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel 
          control={<Switch disabled />} 
          label="Enable webhooks" 
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">Client ID</Typography>
          <TextField 
            size="small" 
            value="cli_abc123xyz" 
            disabled 
            fullWidth 
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        API Keys
      </Typography>
      <TextField
        label="Filter keys"
        size="small"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 1 }}
      />
      
      <Paper variant="outlined" sx={{ mb: 1 }}>
        <FixedSizeList
          height={320}
          width="100%"
          itemSize={64}
          itemCount={filteredKeys.length}
          overscanCount={5}
        >
          {Row}
        </FixedSizeList>
      </Paper>

      {selectedKeyItem && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedKeyItem.code} — {selectedKeyItem.purpose}
          </Typography>
        </Paper>
      )}
    </Paper>
  );
}
