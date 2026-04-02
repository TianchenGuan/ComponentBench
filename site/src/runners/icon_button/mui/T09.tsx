'use client';

/**
 * icon_button-mui-T09: Select Compact density (4 small icon buttons)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Table density" contains a row with four small MUI IconButtons.
 * Initial state: Comfortable selected.
 * 
 * Success: The "Density: Compact" IconButton has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { TaskComponentProps } from '../types';

type Density = 'comfortable' | 'compact' | 'condensed' | 'auto';

const densityOptions: { key: Density; icon: React.ReactNode; label: string }[] = [
  { key: 'comfortable', icon: <ViewComfyIcon fontSize="small" />, label: 'Comfortable' },
  { key: 'compact', icon: <ViewCompactIcon fontSize="small" />, label: 'Compact' },
  { key: 'condensed', icon: <DensitySmallIcon fontSize="small" />, label: 'Condensed' },
  { key: 'auto', icon: <AutoAwesomeIcon fontSize="small" />, label: 'Auto' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [density, setDensity] = useState<Density>('comfortable');

  const handleSelect = (value: Density) => {
    setDensity(value);
    if (value === 'compact') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Table density
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2">
            Density: {density.charAt(0).toUpperCase() + density.slice(1)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            {densityOptions.map(option => (
              <IconButton
                key={option.key}
                size="small"
                onClick={() => handleSelect(option.key)}
                aria-label={`Density: ${option.label}`}
                aria-pressed={density === option.key}
                data-testid={`mui-icon-btn-density-${option.key}`}
                sx={{
                  border: 1,
                  borderColor: density === option.key ? 'primary.main' : 'transparent',
                  bgcolor: density === option.key ? 'primary.light' : undefined,
                  p: 0.5,
                }}
              >
                {option.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
