'use client';

/**
 * tooltip-mui-T01: Show tooltip on Delete icon button (hover)
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A single MUI IconButton with a trash icon is labeled (visually) "Delete". It is wrapped with MUI Tooltip.
 * - Tooltip title: "Delete item"
 * - Trigger: default (hover/focus)
 * - Placement: default
 * Initial state: tooltip hidden. No other tooltip instances or distractors.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, IconButton, Card, CardContent, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Delete item')) {
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
          Actions
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography variant="body2">Delete</Typography>
          <Tooltip title="Delete item">
            <IconButton data-testid="tooltip-trigger-delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
