'use client';

/**
 * link-mui-T03: Open a refund info popover from a Link
 * 
 * setup_description:
 * A centered isolated card titled "Payments" contains a short sentence and a single
 * Material UI Link labeled "Refund policy". The Link is the trigger for a small
 * Popover overlay anchored to the link.
 * 
 * Initial state: popover closed, link has aria-expanded="false" and aria-haspopup="dialog".
 * On activation, the popover opens below the link with title "Refund Policy" and a few
 * lines of read-only text.
 * 
 * success_trigger:
 * - The "Refund policy" link (data-testid="link-refund") was activated.
 * - The link's aria-expanded equals "true".
 * - The popover element (data-testid="popover-refund") is visible.
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Popover, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    onSuccess();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Payments" />
      <CardContent>
        <Typography sx={{ mb: 2 }}>
          All payments are processed securely. Need info?
        </Typography>
        <Link
          href="#"
          onClick={handleClick}
          data-testid="link-refund"
          aria-expanded={open}
          aria-haspopup="dialog"
          sx={{ cursor: 'pointer' }}
        >
          Refund policy
        </Link>
        
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box 
            data-testid="popover-refund" 
            role="dialog"
            sx={{ p: 2, maxWidth: 280 }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              Refund Policy
            </Typography>
            <Typography variant="body2">
              Full refunds are available within 30 days of purchase. 
              Partial refunds may be issued for services already rendered.
              Contact support for more details.
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
