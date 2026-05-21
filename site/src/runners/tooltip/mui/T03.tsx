'use client';

/**
 * tooltip-mui-T03: Dismiss an initially open tooltip (controlled open)
 *
 * Light theme, comfortable spacing, isolated card centered.
 * A small Chip/Badge labeled "Beta" is wrapped with a controlled MUI Tooltip.
 * - Tooltip title: "This feature is still experimental."
 * - open: initially true (tooltip is visible immediately on load)
 * - onClose: wired so that pressing Escape or clicking away closes the tooltip (sets open=false)
 * Initial state: tooltip is visible. No other tooltip instances. The badge itself is not required to be clicked; any supported close gesture is acceptable.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, Chip, Card, CardContent, Typography, ClickAwayListener } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);
  const wasOpenRef = useRef(true);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Feature Status
        </Typography>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            <Tooltip
              title="This feature is still experimental."
              open={open}
              onClose={() => setOpen(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <Chip
                label="Beta"
                color="primary"
                size="small"
                data-testid="tooltip-trigger-beta"
              />
            </Tooltip>
          </div>
        </ClickAwayListener>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Press Escape or click away to dismiss the tooltip.
        </Typography>
      </CardContent>
    </Card>
  );
}
