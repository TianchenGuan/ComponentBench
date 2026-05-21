'use client';

/**
 * toggle_button-mui-T11: Turn on Bold formatting toggle (editor toolbar)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 *
 * The card is titled "Editor". At the top is a small formatting toolbar containing a single MUI ToggleButton labeled "Bold".
 * - MUI ToggleButton provides a selected/unselected state and exposes it via aria-pressed.
 * - Off = outlined button; On = filled/selected button.
 *
 * Below the toolbar is a read-only text preview area (non-interactive) that changes style when Bold is enabled,
 * but success is based only on the Bold ToggleButton pressed state.
 *
 * Initial state: Bold is Off (not pressed).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState(false);

  const handleChange = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    if (newSelected) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Editor
        </Typography>
        
        {/* Toolbar */}
        <Box sx={{ mb: 2 }}>
          <ToggleButton
            value="bold"
            selected={selected}
            onChange={handleChange}
            aria-pressed={selected}
            data-testid="bold-toggle"
          >
            <FormatBoldIcon />
            <Typography sx={{ ml: 0.5 }}>Bold</Typography>
          </ToggleButton>
        </Box>

        {/* Preview area */}
        <Box
          sx={{
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            bgcolor: '#fafafa',
          }}
        >
          <Typography
            sx={{
              fontWeight: selected ? 'bold' : 'normal',
            }}
          >
            Sample text preview
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Bold: {selected ? 'On' : 'Off'}
        </Typography>
      </CardContent>
    </Card>
  );
}
