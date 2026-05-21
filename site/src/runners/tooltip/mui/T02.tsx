'use client';

/**
 * tooltip-mui-T02: Show tooltip with arrow on Add button
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A single contained MUI Button labeled "Add" is wrapped in MUI Tooltip configured with an arrow:
 * - Tooltip title: "Add a new row"
 * - arrow: true
 * - Trigger: default (hover/focus)
 * Initial state: tooltip hidden. No other tooltips or clutter.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, Button, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Add a new row')) {
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
          Data Table
        </Typography>
        <Tooltip title="Add a new row" arrow>
          <Button variant="contained" data-testid="tooltip-trigger-add">
            Add
          </Button>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
