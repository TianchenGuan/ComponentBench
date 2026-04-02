'use client';

/**
 * tooltip-mui-T06: Open the Billing section tooltip in a settings panel
 *
 * Light theme, comfortable spacing, settings_panel layout centered.
 * The panel contains two collapsible-looking section headers (not interactive): "Billing" and "Notifications".
 * Each header has a small help icon on the right, wrapped in its own MUI Tooltip (hover/focus trigger):
 * - Billing help icon tooltip: "Manage invoices and payment methods" (TARGET)
 * - Notifications help icon tooltip: "Control email and push alerts"
 * Clutter: low (a few non-functional toggles below each header). Instances: 2 tooltips. Initial state: none visible.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, IconButton, Card, CardContent, Typography, Switch, FormControlLabel } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Manage invoices and payment methods')) {
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
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        {/* Billing Section */}
        <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Typography variant="subtitle1" fontWeight={500}>Billing</Typography>
            <Tooltip title="Manage invoices and payment methods">
              <IconButton size="small" data-testid="tooltip-trigger-billing">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <FormControlLabel
            control={<Switch size="small" />}
            label={<Typography variant="body2">Auto-pay</Typography>}
          />
        </div>

        {/* Notifications Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Typography variant="subtitle1" fontWeight={500}>Notifications</Typography>
            <Tooltip title="Control email and push alerts">
              <IconButton size="small" data-testid="tooltip-trigger-notifications">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <FormControlLabel
            control={<Switch size="small" defaultChecked />}
            label={<Typography variant="body2">Email alerts</Typography>}
          />
        </div>
      </CardContent>
    </Card>
  );
}
