'use client';

/**
 * tooltip-mui-T04: Show a tooltip after a long hover delay
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A small MUI IconButton with an info icon is wrapped in MUI Tooltip.
 * - Tooltip title: "This action is rate-limited"
 * - enterDelay: 800ms (tooltip appears after ~0.8 seconds of hovering)
 * - leaveDelay: 0
 * Initial state: tooltip hidden. No other tooltips. The icon is small, so stable hovering is required until the delay elapses.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, IconButton, Card, CardContent, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('This action is rate-limited')) {
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
          Rate Limit Info
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography variant="body2">Hover for details</Typography>
          <Tooltip
            title="This action is rate-limited"
            enterDelay={800}
            leaveDelay={0}
          >
            <IconButton size="small" data-testid="tooltip-trigger-info">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
