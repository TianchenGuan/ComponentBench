'use client';

/**
 * rating-mui-T04: Half-step precision: set to 3.5 stars (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * One MUI Rating component labeled "Session satisfaction".
 * Configuration: max=5, precision=0.5 (half-star increments).
 * Initial state: value = 0 (empty). A small helper text below reads "Half-stars are allowed".
 * No submit/confirm button; the value is committed on selection.
 * 
 * Success: Target rating value equals 3.5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === 3.5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Session survey
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Session satisfaction
          </Typography>
          <Rating
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            precision={0.5}
            data-testid="rating-session-satisfaction"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Half-stars are allowed
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
