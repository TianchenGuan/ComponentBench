'use client';

/**
 * popover-mui-T03: Close Help popover with Escape
 *
 * Baseline isolated card centered in the viewport.
 * A MUI Popover titled 'Help' is already open on page load (open=true) and anchored to a 'Help' icon button.
 * Because MUI Popover is built on top of Modal, it captures focus while open.
 * The popover body contains a short paragraph and a focusable 'Got it' link.
 * Initial state: popover is open.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Popover, Box, Link } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  const successCalledRef = useRef(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Wait for initial render before starting to check
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Support
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Get help with your account.
        </Typography>
        <IconButton
          ref={buttonRef}
          data-testid="popover-target-help"
          aria-describedby="help-popover"
        >
          <HelpOutlineIcon />
        </IconButton>
        <Popover
          id="help-popover"
          open={open}
          anchorEl={buttonRef.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          data-testid="popover-help"
        >
          <Box sx={{ p: 2, maxWidth: 280 }}>
            <Typography variant="subtitle2" gutterBottom>
              Help
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Need assistance? Our support team is available 24/7 to help you with any questions.
            </Typography>
            <Link href="#" underline="hover">
              Got it
            </Link>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
