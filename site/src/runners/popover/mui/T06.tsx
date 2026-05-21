'use client';

/**
 * popover-mui-T06: Set Popper to closed (must use toggle, click-away won't close)
 *
 * Isolated card centered in the viewport titled 'Search filters'.
 * A button labeled 'Toggle filter hints' controls a MUI Popper anchored to the button.
 * Important behavior difference: the Popper is not dismissed by clicking away (no ClickAwayListener).
 * The popper content is a small box titled 'Filter hints'.
 * Initial state: the popper is open/visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Button, Popper, Paper, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const successCalledRef = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      initialCheckDone.current = true;
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (initialCheckDone.current && !open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search filters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use the button below to toggle filter hints.
        </Typography>
        <Button
          ref={anchorRef}
          variant="outlined"
          onClick={handleToggle}
          data-testid="popper-target-toggle-filter-hints"
        >
          Toggle filter hints
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          data-testid="popper-filter-hints"
        >
          <Paper sx={{ p: 2, mt: 1, maxWidth: 250 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filter hints
            </Typography>
            <Typography variant="body2">
              Use filters to narrow down your search results. Combine multiple filters for more precise results.
            </Typography>
          </Paper>
        </Popper>
      </CardContent>
    </Card>
  );
}
