'use client';

/**
 * slider_single-mui-T07: Match reference star rating (Satisfaction)
 * 
 * Layout: isolated card centered in the viewport titled "Survey".
 * The card contains one Material UI Slider labeled "Satisfaction".
 * Configuration: min=1, max=5, step=1 with five marks. The marks are shown as icons (e.g., 1–5 stars) rather than numeric labels.
 * Visual guidance: to the right of the slider, a "Reference rating" chip displays a star icon row representing the desired rating (no number text).
 * Initial state: Satisfaction starts at 2.
 * Feedback: while dragging, a value label appears but shows only the filled-star count (not a numeric string); after release, the chip "Your rating: ★★" updates.
 * No Apply/Cancel buttons exist.
 * 
 * Success: The 'Satisfaction' slider matches the reference rating (reference value is 4).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = 4;

const marks = [
  { value: 1, label: '★' },
  { value: 2, label: '★★' },
  { value: 3, label: '★★★' },
  { value: 4, label: '★★★★' },
  { value: 5, label: '★★★★★' },
];

function renderStars(count: number, max: number = 5) {
  return (
    <Box sx={{ display: 'flex' }}>
      {Array.from({ length: max }, (_, i) => (
        i < count ? (
          <StarIcon key={i} sx={{ fontSize: 16, color: '#faaf00' }} />
        ) : (
          <StarBorderIcon key={i} sx={{ fontSize: 16, color: '#ccc' }} />
        )
      ))}
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(2);

  useEffect(() => {
    if (value === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Survey
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Satisfaction
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ flex: 1, px: 1 }}>
            <Slider
              value={value}
              onChange={handleChange}
              min={1}
              max={5}
              step={1}
              marks={marks}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => '★'.repeat(v)}
              data-testid="slider-satisfaction"
            />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Reference rating
            </Typography>
            <Chip
              label={renderStars(TARGET_VALUE)}
              variant="outlined"
              data-testid="ref-satisfaction"
              data-ref-value={TARGET_VALUE}
            />
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Your rating: {renderStars(value)}
        </Typography>
      </CardContent>
    </Card>
  );
}
