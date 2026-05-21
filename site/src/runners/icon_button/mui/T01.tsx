'use client';

/**
 * icon_button-mui-T01: Activate Search icon button
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Quick actions" shows a single MUI IconButton with a magnifying-glass icon.
 * Text label "Search" is displayed next to the icon button.
 * 
 * Success: The MUI IconButton with aria-label "Search" has data-cb-activated="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    if (activated) return;
    setActivated(true);
    onSuccess();
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick actions
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <IconButton
            onClick={handleClick}
            aria-label="Search"
            data-cb-activated={activated ? 'true' : 'false'}
            data-testid="mui-icon-btn-search"
          >
            <SearchIcon />
          </IconButton>
          <Typography variant="body2">Search</Typography>
        </Box>
        {activated && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Search activated
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
