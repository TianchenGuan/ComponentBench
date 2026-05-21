'use client';

/**
 * checkbox-mui-T06: Match auto-update preview (visual reference)
 *
 * Layout: isolated card centered in the viewport titled "Updates".
 * The card is split into two areas:
 *   - Left: a Material UI Checkbox labeled "Auto-update" (initially unchecked).
 *   - Right: a non-interactive "Preview" panel showing a circular refresh icon (indicating auto-update is enabled).
 * The preview does not explicitly say "enabled/disabled"; it only shows the icon state. No Save/Apply button is present.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Updates
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                data-testid="cb-auto-update"
              />
            }
            label="Auto-update"
          />
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              textAlign: 'center',
            }}
            data-ref="auto-update-on"
          >
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>
              Preview
            </Typography>
            <RefreshIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
