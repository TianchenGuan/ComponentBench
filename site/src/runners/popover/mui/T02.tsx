'use client';

/**
 * popover-mui-T02: Reveal Glossary popover (mouse hover interaction)
 *
 * Baseline isolated card centered in the viewport.
 * A text button labeled 'Glossary' is the popover target.
 * The page implements MUI Popover hover behavior using mouseenter/mouseleave events.
 * Popover content shows a definition for one term; no buttons.
 * Initial state: popover is closed.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Button, Popover, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successCalledRef = useRef(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Documentation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Browse our documentation and resources.
        </Typography>
        <Button
          variant="text"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="popover-target-glossary"
          aria-owns={open ? 'glossary-popover' : undefined}
          aria-haspopup="true"
        >
          Glossary
        </Button>
        <Popover
          id="glossary-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={handleMouseLeave}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableRestoreFocus
          sx={{ pointerEvents: 'none' }}
          data-testid="popover-glossary"
        >
          <Box sx={{ p: 2, maxWidth: 250 }}>
            <Typography variant="subtitle2" gutterBottom>
              Glossary
            </Typography>
            <Typography variant="body2">
              <strong>API:</strong> Application Programming Interface - a set of protocols for building software applications.
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
