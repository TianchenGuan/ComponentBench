'use client';

/**
 * popover-mui-T01: Open Profile tips popover (button click)
 *
 * Baseline isolated card centered in the viewport.
 * A contained button labeled 'Profile tips' is the popover target.
 * MUI Popover is controlled via an 'open' state and anchored to the button (anchorEl).
 * The popover contains a short text block; no internal controls.
 * Initial state: popover is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Button, Popover, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const successCalledRef = useRef(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage your profile and account settings.
        </Typography>
        <Button
          variant="contained"
          onClick={handleClick}
          data-testid="popover-target-profile-tips"
        >
          Profile tips
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          data-testid="popover-profile-tips"
        >
          <Box sx={{ p: 2, maxWidth: 250 }}>
            <Typography variant="subtitle2" gutterBottom>
              Profile tips
            </Typography>
            <Typography variant="body2">
              Complete your profile to increase visibility and help others connect with you.
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
