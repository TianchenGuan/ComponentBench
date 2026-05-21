'use client';

/**
 * rating-mui-T01: Set article helpfulness to 4 stars (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered with the prompt "Was this article helpful?".
 * One Material UI Rating component labeled "Article helpfulness".
 * Configuration: max=5, precision=1 (whole stars), default empty icon for unselected stars.
 * Initial state: value is empty/0 (no stars selected).
 * Selecting a star commits immediately; there is no submit button.
 * 
 * Success: Target rating value equals 4 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Was this article helpful?
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Article helpfulness
          </Typography>
          <Rating
            value={value}
            onChange={(_, newValue) => setValue(newValue)}
            precision={1}
            data-testid="rating-article-helpfulness"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
