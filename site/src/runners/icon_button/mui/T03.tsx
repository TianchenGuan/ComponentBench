'use client';

/**
 * icon_button-mui-T03: Choose Center alignment (icon button group)
 *
 * Layout: isolated_card centered in the viewport.
 * A "Text formatting" card contains a row with three adjacent MUI IconButtons:
 * Align left, Align center, Align right.
 * Initial state: "Align left" is selected.
 * 
 * Success: The "Align center" IconButton has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import type { TaskComponentProps } from '../types';

type Alignment = 'left' | 'center' | 'right';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [alignment, setAlignment] = useState<Alignment>('left');

  const handleSelect = (value: Alignment) => {
    setAlignment(value);
    if (value === 'center') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Text formatting
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2">
            Text alignment: {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              onClick={() => handleSelect('left')}
              aria-label="Align left"
              aria-pressed={alignment === 'left'}
              data-testid="mui-icon-btn-align-left"
              color={alignment === 'left' ? 'primary' : 'default'}
            >
              <FormatAlignLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => handleSelect('center')}
              aria-label="Align center"
              aria-pressed={alignment === 'center'}
              data-testid="mui-icon-btn-align-center"
              color={alignment === 'center' ? 'primary' : 'default'}
            >
              <FormatAlignCenterIcon />
            </IconButton>
            <IconButton
              onClick={() => handleSelect('right')}
              aria-label="Align right"
              aria-pressed={alignment === 'right'}
              data-testid="mui-icon-btn-align-right"
              color={alignment === 'right' ? 'primary' : 'default'}
            >
              <FormatAlignRightIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
