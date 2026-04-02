'use client';

/**
 * tooltip-mui-T05: Show tooltip via keyboard focus only
 *
 * Light theme, comfortable spacing, isolated card centered.
 * The card shows a label "API key" with a small help icon button next to it.
 * The help icon is wrapped in MUI Tooltip configured to NOT respond to hover:
 * - title: "Used to authenticate requests"
 * - disableHoverListener: true (focus trigger remains enabled)
 * Initial state: tooltip hidden. No other tooltips. The help icon is a small target; the intended interaction is Tab focus.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, IconButton, Card, CardContent, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Used to authenticate requests')) {
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
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Configuration
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography variant="body2">API key</Typography>
          <Tooltip
            title="Used to authenticate requests"
            disableHoverListener
          >
            <IconButton size="small" data-testid="tooltip-trigger-apikey">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Use Tab to focus the icon and show the tooltip.
        </Typography>
      </CardContent>
    </Card>
  );
}
