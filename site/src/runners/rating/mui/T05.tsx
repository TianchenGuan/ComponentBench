'use client';

/**
 * rating-mui-T05: Two ratings: set Performance to 5 (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * Two MUI Rating components are shown with labels:
 *   • "Ease of use" (top)
 *   • "Performance" (bottom)
 * Configuration: both use max=5 and precision=1.
 * Initial state: Ease of use = 4 (pre-filled), Performance = 2 (pre-filled).
 * Only the "Performance" control should be changed.
 * 
 * Success: Target rating value equals 5 out of 5 on "Performance" AND "Ease of use" remains at 4.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [easeOfUse, setEaseOfUse] = useState<number | null>(4);
  const [performance, setPerformance] = useState<number | null>(2);
  const initialEaseOfUse = useRef(4);

  useEffect(() => {
    // Success requires Performance = 5 AND Ease of use unchanged from initial (4)
    if (performance === 5 && easeOfUse === initialEaseOfUse.current) {
      onSuccess();
    }
  }, [performance, easeOfUse, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          App feedback
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography component="legend" sx={{ mb: 1 }}>
            Ease of use
          </Typography>
          <Rating
            value={easeOfUse}
            onChange={(_, newValue) => setEaseOfUse(newValue)}
            precision={1}
            data-testid="rating-ease-of-use"
          />
        </Box>
        
        <Box>
          <Typography component="legend" sx={{ mb: 1 }}>
            Performance
          </Typography>
          <Rating
            value={performance}
            onChange={(_, newValue) => setPerformance(newValue)}
            precision={1}
            data-testid="rating-performance"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
