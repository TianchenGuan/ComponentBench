'use client';

/**
 * toolbar-mui-T03: Switch view mode to Grid
 *
 * A centered isolated card contains a MUI Toolbar labeled "View". It includes an exclusive 
 * ToggleButtonGroup with two options: "List" and "Grid" (each with an icon and text).
 * Only one option can be selected at a time. The current view is also shown under the toolbar.
 * Initial state: List is selected.
 */

import React, { useState } from 'react';
import {
  Paper,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [viewMode, setViewMode] = useState<string>('list');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      if (newMode === 'grid') {
        onSuccess();
      }
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 350, p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        View
      </Typography>
      <Toolbar
        variant="dense"
        sx={{ bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}
        data-testid="mui-toolbar-view"
      >
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleChange}
          aria-label="view mode"
        >
          <ToggleButton
            value="list"
            aria-label="list view"
            data-testid="mui-toolbar-view-list"
          >
            <ViewListIcon sx={{ mr: 0.5 }} />
            List
          </ToggleButton>
          <ToggleButton
            value="grid"
            aria-label="grid view"
            data-testid="mui-toolbar-view-grid"
          >
            <GridViewIcon sx={{ mr: 0.5 }} />
            Grid
          </ToggleButton>
        </ToggleButtonGroup>
      </Toolbar>

      <Typography variant="body2" color="text.secondary">
        Current view: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
      </Typography>
    </Paper>
  );
}
