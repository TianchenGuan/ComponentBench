'use client';

/**
 * toggle_button-mui-T13: Unfavorite star icon toggle in action bar
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The card title is "Item actions". It contains a horizontal icon bar with three controls:
 * - Share (regular IconButton, not a toggle)
 * - Comment (regular IconButton, not a toggle)
 * - Favorite (star icon) implemented as a MUI ToggleButton (icon-only) with aria-label "Favorite"
 *
 * Initial state:
 * - Favorite is On/selected (aria-pressed=true) and appears filled.
 * - Share and Comment are present as distractors but do not affect success.
 *
 * There is a small helper text under the bar that reads "Favorite: On" / "Favorite: Off" for feedback.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(true); // Initial: On

  const handleChange = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (!newSelected) {
      // Success when turned OFF
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Item actions
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton aria-label="Comment">
            <CommentIcon />
          </IconButton>
          <ToggleButton
            value="favorite"
            selected={selected}
            onChange={handleChange}
            aria-pressed={selected}
            aria-label="Favorite"
            data-testid="favorite-toggle"
            size="small"
          >
            {selected ? <StarIcon color="warning" /> : <StarBorderIcon />}
          </ToggleButton>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Favorite: {selected ? 'On' : 'Off'}
        </Typography>
      </CardContent>
    </Card>
  );
}
