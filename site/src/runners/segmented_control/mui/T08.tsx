'use client';

/**
 * segmented_control-mui-T08: View mode (small icons) → match preview
 *
 * Layout: small card anchored near the bottom-right of the viewport in a dark theme.
 * The card contains:
 * - A preview strip with three mini mockups (List, Grid, Cards). One is highlighted with a bright border.
 * - A small-size ToggleButtonGroup labeled "View mode" with ICON-ONLY buttons (list/grid/cards icons).
 *
 * Initial state: List icon is selected.
 * Compact spacing and small scale make the icon buttons tighter and harder to click.
 * No Apply button; selection is immediate.
 *
 * Clutter (low): a "Help" link appears under the control but is not required.
 *
 * Success: The "View mode" ToggleButtonGroup selection matches the highlighted preview mockup.
 * (Preview highlights Grid)
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Box, Link } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import type { TaskComponentProps } from '../types';

// The preview highlights Grid
const PREVIEW_HIGHLIGHT = 'Grid';

const viewModes = [
  { value: 'List', icon: <ViewListIcon fontSize="small" /> },
  { value: 'Grid', icon: <GridViewIcon fontSize="small" /> },
  { value: 'Cards', icon: <ViewModuleIcon fontSize="small" /> },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('List');

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSelected(value);
      if (value === PREVIEW_HIGHLIGHT) {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 240, bgcolor: '#1e1e1e' }}>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="grey.400" sx={{ display: 'block', mb: 1 }}>
          Preview
        </Typography>
        
        {/* Preview strip */}
        <Box
          data-testid="view-preview-highlight"
          data-target-view={PREVIEW_HIGHLIGHT}
          sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}
        >
          {viewModes.map(mode => (
            <Box
              key={mode.value}
              sx={{
                width: 40,
                height: 28,
                border: mode.value === PREVIEW_HIGHLIGHT ? '2px solid #1976d2' : '1px solid #555',
                borderRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#2a2a2a',
                color: mode.value === PREVIEW_HIGHLIGHT ? '#1976d2' : '#777',
              }}
            >
              {mode.icon}
            </Box>
          ))}
        </Box>

        <Typography variant="caption" color="grey.400" sx={{ display: 'block', mb: 0.5 }}>
          View mode
        </Typography>
        <ToggleButtonGroup
          data-testid="view-mode"
          data-canonical-type="segmented_control"
          data-selected-value={selected}
          value={selected}
          exclusive
          onChange={handleChange}
          aria-label="View mode"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: '#999',
              borderColor: '#555',
              p: 0.5,
              '&.Mui-selected': {
                color: '#fff',
                bgcolor: 'rgba(25, 118, 210, 0.2)',
              },
            },
          }}
        >
          {viewModes.map(mode => (
            <ToggleButton key={mode.value} value={mode.value} aria-label={mode.value}>
              {mode.icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Link
          href="#"
          variant="caption"
          sx={{ display: 'block', mt: 1, color: 'grey.500', textDecoration: 'none' }}
          onClick={(e) => e.preventDefault()}
        >
          Help
        </Link>
      </CardContent>
    </Card>
  );
}
