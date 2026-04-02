'use client';

/**
 * tooltip-mui-T09: Open drawer then show tooltip in dark theme
 *
 * DARK theme, comfortable spacing, drawer_flow layout.
 * The main page has a button labeled "Open drawer" positioned near the center-right. Clicking it opens a right-side drawer.
 * Inside the drawer, there is a settings row labeled "Auto-renew" with a small help icon next to the label. That icon is wrapped in MUI Tooltip:
 * - Tooltip title: "Automatically renews your subscription"
 * - Trigger: default (hover/focus)
 * The drawer includes other rows (Billing email, Payment method) as clutter, but only Auto-renew has a tooltip.
 * Initial state: drawer closed; tooltip hidden.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Tooltip,
  IconButton,
  Button,
  Drawer,
  Typography,
  TextField,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Automatically renews your subscription')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Button variant="contained" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 320, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Subscription Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Typography variant="body2">Auto-renew</Typography>
                <Tooltip title="Automatically renews your subscription">
                  <IconButton size="small" data-testid="tooltip-trigger-auto-renew">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
              <TextField size="small" fullWidth defaultValue="Enabled" disabled />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Billing email</Typography>
              <TextField size="small" fullWidth defaultValue="user@example.com" />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Payment method</Typography>
              <TextField size="small" fullWidth defaultValue="•••• 4242" disabled />
            </Box>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
