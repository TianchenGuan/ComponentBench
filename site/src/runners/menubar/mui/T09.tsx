'use client';

/**
 * menubar-mui-T09: View settings: enable Show rulers and click Apply
 * 
 * Layout: settings_panel.
 * A MUI AppBar at the top contains a menubar button labeled "View settings".
 * Clicking it opens a wide dropdown panel (implemented as a MUI Menu with custom content):
 * - Three toggle rows with checkboxes:
 *     • Show grid (initially ON)
 *     • Show rulers (initially OFF)  ← target
 *     • Wrap text (initially ON)
 * - At the bottom-right of the dropdown are two buttons: "Apply" (primary) and "Cancel".
 * Important behavior:
 * - Toggling checkboxes changes a "Pending changes" state shown in the panel, but the committed menubar view_state only updates after pressing "Apply".
 * - Pressing "Cancel" discards pending changes and restores previous committed states.
 * Initial state: committed Show rulers = OFF; dropdown closed.
 * 
 * Success: The committed toggle state for "Show rulers" is ON (after Apply is clicked).
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, Checkbox, FormControlLabel, Divider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

interface ToggleStates {
  'Show grid': boolean;
  'Show rulers': boolean;
  'Wrap text': boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [committedToggles, setCommittedToggles] = useState<ToggleStates>({
    'Show grid': true,
    'Show rulers': false,
    'Wrap text': true,
  });
  const [pendingToggles, setPendingToggles] = useState<ToggleStates>({
    'Show grid': true,
    'Show rulers': false,
    'Wrap text': true,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (committedToggles['Show rulers'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [committedToggles, successTriggered, onSuccess]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    // Reset pending to committed when opening
    setPendingToggles({ ...committedToggles });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (key: keyof ToggleStates) => {
    setPendingToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    setCommittedToggles({ ...pendingToggles });
    handleClose();
  };

  const handleCancel = () => {
    setPendingToggles({ ...committedToggles });
    handleClose();
  };

  return (
    <Paper elevation={2} sx={{ width: 500, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        View settings menu: Show grid, Show rulers, Wrap text. Buttons: Apply, Cancel.
      </Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          <Button
            onClick={handleOpen}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={open}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
            data-testid="menubar-item-view-settings"
          >
            View settings
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { width: 280 } }}
            data-testid="menu-view-settings"
          >
            <Box sx={{ p: 2 }}>
              {(Object.keys(pendingToggles) as Array<keyof ToggleStates>).map((key) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={pendingToggles[key]}
                      onChange={() => handleToggle(key)}
                      size="small"
                    />
                  }
                  label={key}
                  sx={{ display: 'flex', mb: 1 }}
                  data-testid={`toggle-${key.toLowerCase().replace(/ /g, '-')}`}
                />
              ))}
            </Box>
            <Divider />
            <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" onClick={handleCancel} data-testid="btn-cancel">
                Cancel
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleApply}
                data-testid="btn-apply"
              >
                Apply
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Settings panel content */}
      <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
        <Box sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>Current Settings</Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>
          {(Object.entries(committedToggles) as Array<[keyof ToggleStates, boolean]>).map(([key, value]) => (
            <div key={key}>{key}: {value ? 'ON' : 'OFF'}</div>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
