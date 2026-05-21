'use client';

/**
 * menu_button-mui-T06: Assign label using search within menu
 * 
 * Layout: isolated_card centered titled "Labels".
 * There is one menu button labeled "Assign label: None".
 * Opening it shows a dropdown panel with a small search TextField at the top.
 * Below the search field is a list of ~20 label items (MenuItems).
 * 
 * Typing in the search field filters the visible MenuItems in-place.
 * Selecting a label closes the menu and updates the trigger.
 * 
 * Initial state: None.
 * Success: The selected label equals "Urgent".
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem, TextField, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const allLabels = [
  'Backlog', 'Bug', 'Feature', 'Urgent', 'Blocked',
  'In Progress', 'Review', 'Testing', 'Done', 'Archived',
  'P0', 'P1', 'P2', 'Documentation', 'Refactor',
  'Security', 'Performance', 'UI', 'API', 'Infrastructure',
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedLabel === 'Urgent' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedLabel, successTriggered, onSuccess]);

  const filteredLabels = useMemo(() => {
    if (!searchQuery) return allLabels;
    return allLabels.filter(label =>
      label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setSearchQuery('');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (label: string) => {
    setSelectedLabel(label);
    handleClose();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Labels</Typography>
        
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-assign-label"
        >
          Assign label: {selectedLabel || 'None'}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: { maxHeight: 300 },
          }}
        >
          <Box sx={{ px: 1, py: 0.5 }}>
            <TextField
              size="small"
              placeholder="Search labels"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              fullWidth
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </Box>
          {filteredLabels.map(label => (
            <MenuItem
              key={label}
              onClick={() => handleSelect(label)}
              selected={label === selectedLabel}
            >
              {label}
            </MenuItem>
          ))}
          {filteredLabels.length === 0 && (
            <MenuItem disabled>No labels found</MenuItem>
          )}
        </Menu>
      </CardContent>
    </Card>
  );
}
