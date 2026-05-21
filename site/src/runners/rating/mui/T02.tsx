'use client';

/**
 * rating-mui-T02: Match a 2-star reference pattern (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * A non-interactive reference row shows "Reference: ★★☆☆☆" (2 out of 5).
 * Below, one MUI Rating component labeled "Your rating".
 * Configuration: max=5, precision=1 (whole-star), default icons.
 * Initial state: Your rating = 0 (empty).
 * No additional buttons or confirmation.
 * 
 * Success: Target rating value equals 2 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === 2) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Match the reference
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography component="span" fontWeight="bold">Reference: </Typography>
          <Typography component="span" sx={{ fontSize: 18, letterSpacing: 2 }}>
            ★★☆☆☆
          </Typography>
        </Box>
        <Box>
          <Typography component="legend" sx={{ mb: 1 }}>
            Your rating
          </Typography>
          <Rating
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            precision={1}
            data-testid="rating-your-rating"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
