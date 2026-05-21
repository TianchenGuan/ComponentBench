'use client';

/**
 * rating-mui-T07: Scroll to find rating and set to 4 (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: dashboard with medium clutter (multiple summary cards and charts placeholders).
 * The target MUI Rating control is not initially visible; it appears in a section titled "Customer support" below the fold.
 * In the "Customer support" card, there is one MUI Rating component labeled "Customer support rating".
 * Configuration: max=5, precision=1.
 * Initial state: value = 0 (empty) when first revealed.
 * No confirmation button; success is immediate after the rating value is set.
 * 
 * Success: Target rating value equals 4 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Rating, Box, Grid } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Box sx={{ maxWidth: 800, height: 800, overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Service dashboard
      </Typography>
      
      {/* Above-the-fold content */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Revenue</Typography>
              <Typography variant="h4">$45,230</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4">1,234</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Chart placeholder */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
          <Box sx={{ height: 200, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">[Chart Placeholder]</Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* More filler content */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <Box sx={{ height: 150, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">[Activity Feed Placeholder]</Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Target section - below the fold */}
      <Card sx={{ mb: 3 }} data-testid="customer-support-section">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer support
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Customer support rating
            </Typography>
            <Rating
              value={value}
              onChange={(_, newValue) => setValue(newValue)}
              precision={1}
              data-testid="rating-customer-support"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
