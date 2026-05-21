'use client';

/**
 * button-mui-T04: Select Italic in toggle button group
 * 
 * Centered card titled "Formatting".
 * ToggleButtonGroup with Bold, Italic, Underline options.
 * Initial: Bold selected. Task: Select Italic.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [format, setFormat] = useState('bold');

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormat: string | null) => {
    if (newFormat) {
      setFormat(newFormat);
      if (newFormat === 'italic') {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Formatting
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={format}
            exclusive
            onChange={handleChange}
            aria-label="text formatting"
            data-group-id="mui-toggle-format"
          >
            <ToggleButton value="bold" aria-label="bold" data-testid="mui-btn-bold">
              <FormatBoldIcon />
              <Typography sx={{ ml: 1 }}>Bold</Typography>
            </ToggleButton>
            <ToggleButton value="italic" aria-label="italic" data-testid="mui-btn-italic">
              <FormatItalicIcon />
              <Typography sx={{ ml: 1 }}>Italic</Typography>
            </ToggleButton>
            <ToggleButton value="underline" aria-label="underline" data-testid="mui-btn-underline">
              <FormatUnderlinedIcon />
              <Typography sx={{ ml: 1 }}>Underline</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </CardContent>
    </Card>
  );
}
