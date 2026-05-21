'use client';

/**
 * button-mui-T09: Pin the note (aria-pressed icon toggle)
 * 
 * Isolated note card (bottom-right) with two IconButtons: Pin and Star.
 * Both are toggle buttons with aria-pressed. Initial: both OFF.
 * Task: Toggle Pin to ON (without affecting Star).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [pinned, setPinned] = useState(false);
  const [starred, setStarred] = useState(false);

  const handlePinToggle = () => {
    const newState = !pinned;
    setPinned(newState);
    if (newState && !starred) {
      onSuccess();
    }
  };

  const handleStarToggle = () => {
    setStarred(!starred);
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Meeting Notes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Discuss Q2 roadmap priorities and resource allocation for new initiatives.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            onClick={handlePinToggle}
            aria-pressed={pinned}
            aria-label="Pin"
            data-testid="mui-iconbtn-pin"
            sx={{ color: pinned ? 'primary.main' : 'action.active' }}
          >
            {pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleStarToggle}
            aria-pressed={starred}
            aria-label="Star"
            data-testid="mui-iconbtn-star"
            sx={{ color: starred ? 'warning.main' : 'action.active' }}
          >
            {starred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
