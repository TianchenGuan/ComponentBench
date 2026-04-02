'use client';

/**
 * menu_button-mui-T04: Select command by matching shortcut reference
 * 
 * Layout: isolated_card centered titled "Editor commands".
 * At the top of the card there is a small reference badge labeled "Reference shortcut"
 * showing a key combo (Ctrl+E).
 * Below it is a menu button labeled "Command: None".
 * 
 * Opening the menu shows four MenuItems. Each MenuItem has a label on the left
 * and a right-aligned shortcut hint: "Save" (Ctrl+S), "Export" (Ctrl+E), "Find" (Ctrl+F), "Rename" (Ctrl+R).
 * 
 * Guidance is mixed/visual: the target is specified by matching the shortcut string.
 * Success: The selected item is "Export" (matches Ctrl+E).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem, Chip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const commands = [
  { key: 'save', label: 'Save', shortcut: 'Ctrl+S' },
  { key: 'export', label: 'Export', shortcut: 'Ctrl+E' },
  { key: 'find', label: 'Find', shortcut: 'Ctrl+F' },
  { key: 'rename', label: 'Rename', shortcut: 'Ctrl+R' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedCommand === 'Export' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedCommand, successTriggered, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (label: string) => {
    setSelectedCommand(label);
    handleClose();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Editor commands</Typography>
        
        <div style={{ marginBottom: 16 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Reference shortcut:
          </Typography>
          <Chip
            label="Ctrl+E"
            variant="outlined"
            size="small"
            data-ref-id="shortcut_ref_1"
            data-ref-shortcut="Ctrl+E"
          />
        </div>

        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-command"
        >
          Command: {selectedCommand || 'None'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {commands.map(cmd => (
            <MenuItem
              key={cmd.key}
              onClick={() => handleSelect(cmd.label)}
              selected={cmd.label === selectedCommand}
              sx={{ display: 'flex', justifyContent: 'space-between', minWidth: 200 }}
            >
              <span>{cmd.label}</span>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                {cmd.shortcut}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
}
