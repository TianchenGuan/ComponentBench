'use client';

/**
 * rating-mui-T03: Large-size rating: set to 1 star (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=large, placement=center.
 * Layout: isolated_card centered.
 * One MUI Rating component labeled "New feature excitement", rendered in a visually large size.
 * Configuration: max=5, precision=1, size='large'.
 * Initial state: value = 0 (empty).
 * No confirm controls; the value commits immediately.
 * 
 * Success: Target rating value equals 1 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === 1) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Feature poll
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            New feature excitement
          </Typography>
          <Rating
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            precision={1}
            size="large"
            data-testid="rating-new-feature"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
