'use client';

/**
 * toggle_button-mui-T14: Like Post B (two similar toggles)
 *
 * Layout: form_section centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The section is titled "Posts" and shows two stacked cards:
 * - Card "Post A" includes a MUI ToggleButton labeled "Like — Post A".
 * - Card "Post B" includes a MUI ToggleButton labeled "Like — Post B".
 *
 * Both toggles look the same and use selected state (aria-pressed) to indicate On.
 * Initial state: both Like toggles are Off.
 *
 * Target: the Like toggle inside the "Post B" card.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [likeA, setLikeA] = useState(false);
  const [likeB, setLikeB] = useState(false);

  const handleLikeA = () => {
    setLikeA(!likeA);
    // Does not trigger success
  };

  const handleLikeB = () => {
    const newSelected = !likeB;
    setLikeB(newSelected);
    if (newSelected) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Posts
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Post A */}
          <Paper sx={{ p: 2 }} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>
              Post A
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is the content of Post A.
            </Typography>
            <ToggleButton
              value="like-a"
              selected={likeA}
              onChange={handleLikeA}
              aria-pressed={likeA}
              data-testid="like-post-a"
              size="small"
              color="primary"
            >
              {likeA ? <ThumbUpIcon sx={{ mr: 0.5 }} /> : <ThumbUpOffAltIcon sx={{ mr: 0.5 }} />}
              Like — Post A
            </ToggleButton>
          </Paper>

          {/* Post B - TARGET */}
          <Paper sx={{ p: 2 }} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>
              Post B
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This is the content of Post B.
            </Typography>
            <ToggleButton
              value="like-b"
              selected={likeB}
              onChange={handleLikeB}
              aria-pressed={likeB}
              data-testid="like-post-b"
              size="small"
              color="primary"
            >
              {likeB ? <ThumbUpIcon sx={{ mr: 0.5 }} /> : <ThumbUpOffAltIcon sx={{ mr: 0.5 }} />}
              Like — Post B
            </ToggleButton>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
}
