'use client';

/**
 * menubar-mui-T04: Open Tools menu (popover visible, top-right placement)
 * 
 * Layout: isolated_card placed near the top-right of the viewport (placement=top_right).
 * The card contains a compact app header built with MUI AppBar/Toolbar.
 * - Menubar buttons: Tools (dropdown), View (dropdown), Help (dropdown).
 * - Tools dropdown items: Import, Export, Extensions.
 * - Initial state: no dropdown is open.
 * - Feedback: opening Tools renders a Popover/Menu panel anchored under the Tools button.
 * - No clutter elements.
 * 
 * Success: The Tools dropdown menu is open/visible (open_path includes "Tools").
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [toolsAnchor, setToolsAnchor] = useState<null | HTMLElement>(null);
  const [viewAnchor, setViewAnchor] = useState<null | HTMLElement>(null);
  const [helpAnchor, setHelpAnchor] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const toolsOpen = Boolean(toolsAnchor);

  useEffect(() => {
    if (toolsOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toolsOpen, successTriggered, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 400, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        Tools menu dropdown should be open (items: Import, Export, Extensions)
      </Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          <Button
            onClick={(e) => setToolsAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={toolsOpen}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
            data-testid="menubar-item-tools"
          >
            Tools
          </Button>
          <Button
            onClick={(e) => setViewAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
          >
            View
          </Button>
          <Button
            onClick={(e) => setHelpAnchor(e.currentTarget)}
            endIcon={<KeyboardArrowDownIcon />}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
          >
            Help
          </Button>

          {/* Tools Menu */}
          <Menu
            anchorEl={toolsAnchor}
            open={toolsOpen}
            onClose={() => setToolsAnchor(null)}
            data-testid="menu-tools"
          >
            <MenuItem>Import</MenuItem>
            <MenuItem>Export</MenuItem>
            <MenuItem>Extensions</MenuItem>
          </Menu>

          {/* View Menu */}
          <Menu
            anchorEl={viewAnchor}
            open={Boolean(viewAnchor)}
            onClose={() => setViewAnchor(null)}
          >
            <MenuItem>Zoom In</MenuItem>
            <MenuItem>Zoom Out</MenuItem>
          </Menu>

          {/* Help Menu */}
          <Menu
            anchorEl={helpAnchor}
            open={Boolean(helpAnchor)}
            onClose={() => setHelpAnchor(null)}
          >
            <MenuItem>Documentation</MenuItem>
            <MenuItem>About</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
