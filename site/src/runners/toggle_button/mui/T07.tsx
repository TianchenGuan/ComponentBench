'use client';

/**
 * toggle_button-mui-T17: Reset Highlight mentions to default (off)
 *
 * Layout: settings_panel centered. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The panel section is "Chat settings". One row is labeled "Highlight mentions".
 * The row contains:
 * - A MUI ToggleButton labeled "Highlight mentions" (this is the target component).
 * - A small inline text link/button labeled "Reset" to the right (distractor/shortcut).
 * - A helper caption under the row: "Default: Off".
 *
 * Initial state: the toggle is On/selected (aria-pressed=true), meaning it is not at its default.
 * Clicking "Reset" sets the toggle back to Off and shows a small toast "Reset to default".
 * Manually toggling it Off also results in the same final state (Off).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Snackbar } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import HighlightIcon from '@mui/icons-material/Highlight';
import CheckIcon from '@mui/icons-material/Check';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(true); // Initial: On (not at default)
  const [toastOpen, setToastOpen] = useState(false);

  const handleChange = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (!newSelected) {
      onSuccess();
    }
  };

  const handleReset = () => {
    setSelected(false);
    setToastOpen(true);
    onSuccess();
  };

  return (
    <>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Settings ▸ Chat
          </Typography>
          <Typography variant="h6" gutterBottom>
            Chat settings
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <Typography variant="body1">Highlight mentions</Typography>
              <Typography variant="caption" color="text.secondary">
                Default: Off
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButton
                value="highlight"
                selected={selected}
                onChange={handleChange}
                aria-pressed={selected}
                data-testid="highlight-mentions-toggle"
                size="small"
                color="primary"
              >
                {selected ? <CheckIcon sx={{ mr: 0.5 }} /> : <HighlightIcon sx={{ mr: 0.5 }} />}
                {selected ? 'On' : 'Off'}
              </ToggleButton>
              <Button size="small" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message="Reset to default"
      />
    </>
  );
}
