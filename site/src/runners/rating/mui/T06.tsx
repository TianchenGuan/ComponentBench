'use client';

/**
 * rating-mui-T06: Drawer feedback: set rating to 2 and send (MUI)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=top_left.
 * Layout: drawer_flow with the main trigger placed near the top-left of the viewport.
 * The page shows a help-center card with a button labeled "Give feedback".
 * Clicking the button opens a side Drawer.
 * Inside the Drawer:
 *   • A short instruction line: "Rate your support experience (1-5)".
 *   • One MUI Rating component labeled "Support experience" (max=5, precision=1).
 *   • A small reference chip that visually shows "★★☆☆☆" next to the text "Target: 2".
 *   • A primary button labeled "Send feedback".
 * Initial state: Drawer closed; when opened, Support experience value = 0.
 * Success requires setting the rating to 2 and clicking "Send feedback".
 * 
 * Success: Target rating value equals 2 out of 5 AND "Send feedback" is clicked.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Rating, Button, Drawer, Box, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(null);

  const handleOpenDrawer = () => {
    setRatingValue(null); // Reset rating when opening
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSendFeedback = () => {
    if (ratingValue === 2) {
      setIsDrawerOpen(false);
      onSuccess();
    } else {
      setIsDrawerOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Help center
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Need assistance? We&apos;re here to help.
          </Typography>
          <Button variant="contained" onClick={handleOpenDrawer}>
            Give feedback
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Feedback
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Rate your support experience (1-5)
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography component="legend" sx={{ mb: 1 }}>
              Support experience
            </Typography>
            <Rating
              value={ratingValue}
              onChange={(_, newValue) => setRatingValue(newValue)}
              precision={1}
              data-testid="rating-support-experience"
            />
          </Box>
          
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label="★★☆☆☆" 
              size="small" 
              variant="outlined" 
            />
            <Typography variant="body2" color="text.secondary">
              Target: 2
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSendFeedback}
            data-testid="send-feedback"
            data-sent={ratingValue === 2}
          >
            Send feedback
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
