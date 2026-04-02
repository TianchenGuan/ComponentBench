'use client';

/**
 * rating-mui-T09: Dark theme heart icons: set to 3.5 (MUI)
 * 
 * Scene details: theme=dark, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered in dark theme.
 * One MUI Rating component labeled "Satisfaction".
 * Configuration: max=5, precision=0.5, custom full icon = heart, custom empty icon = outlined heart.
 * Initial state: value = 0 (empty).
 * No confirm button; the rating commits immediately.
 * This task probes whether agents can generalize the rating affordance when the symbol is not a star.
 * 
 * Success: Target rating value equals 3.5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
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
          Satisfaction
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Satisfaction
          </Typography>
          <Rating
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" color="error" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            data-testid="rating-satisfaction"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
