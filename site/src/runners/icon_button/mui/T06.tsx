'use client';

/**
 * icon_button-mui-T06: Open Help popover (IconButton trigger)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Need help?" contains a MUI IconButton with a question-mark icon 
 * that triggers a small help popover.
 * 
 * Success: The "Help" IconButton indicates the popover is open (aria-expanded="true").
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Popover } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    onSuccess();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Need help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click the help button for more information about this feature.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleClick}
            aria-label="Help"
            aria-expanded={open}
            data-cb-overlay-open={open ? 'true' : 'false'}
            data-testid="mui-icon-btn-help"
          >
            <HelpOutlineIcon />
          </IconButton>
          <Typography variant="caption" color="text.secondary">
            (Click to open help popover)
          </Typography>
        </Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, maxWidth: 250 }}>
            <Typography variant="body2">
              This is a helpful tooltip explaining the feature in detail.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Got it
            </Typography>
          </Box>
        </Popover>
      </CardContent>
    </Card>
  );
}
