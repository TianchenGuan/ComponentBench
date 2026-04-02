'use client';

/**
 * menubar-mui-T08: Overflow "More" → Integrations (dark, small)
 * 
 * Layout: isolated_card, centered.
 * Theme: dark. Component scale: small (shorter AppBar height and smaller button hit areas).
 * The MUI AppBar menubar contains many buttons; when space is limited, extra buttons are moved into an overflow IconButton with a vertical "More" (⋮) icon.
 * - Visible buttons include: Home, Projects, Reports, Settings.
 * - Hidden under "More" menu: Integrations (target), Developer tools, Help.
 * - Initial state: Home is active; overflow menu is closed.
 * - Clicking "More" opens a MUI Menu listing the hidden items.
 * 
 * Success: The menubar's active item is "Integrations".
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem, IconButton, ThemeProvider, createTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const visibleItems = ['Home', 'Projects', 'Reports', 'Settings'];
const overflowItems = ['Integrations', 'Developer tools', 'Help'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Home');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (activeKey === 'Integrations' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  const handleOverflowItemClick = (item: string) => {
    setActiveKey(item);
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={2} sx={{ width: 450, overflow: 'hidden', bgcolor: '#1e1e1e' }}>
        <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
          Some header items are hidden under More (⋮). Select Integrations.
        </Box>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar data-testid="menubar-main" sx={{ minHeight: 40 }}>
            {visibleItems.map((item) => (
              <Button
                key={item}
                onClick={() => setActiveKey(item)}
                aria-current={activeKey === item ? 'page' : undefined}
                size="small"
                sx={{
                  color: activeKey === item ? 'primary.main' : 'text.secondary',
                  borderBottom: activeKey === item ? '2px solid' : '2px solid transparent',
                  borderColor: activeKey === item ? 'primary.main' : 'transparent',
                  borderRadius: 0,
                  px: 1.5,
                  fontSize: '0.8rem',
                }}
              >
                {item}
              </Button>
            ))}
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              aria-label="More options"
              aria-expanded={open}
              aria-haspopup="true"
              sx={{ ml: 'auto' }}
              data-testid="menubar-more"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              data-testid="menu-more"
            >
              {overflowItems.map((item) => (
                <MenuItem
                  key={item}
                  onClick={() => handleOverflowItemClick(item)}
                  selected={activeKey === item}
                  data-testid={`menu-item-${item.toLowerCase().replace(/ /g, '-')}`}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </AppBar>
      </Paper>
    </ThemeProvider>
  );
}
