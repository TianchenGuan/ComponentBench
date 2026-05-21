'use client';

/**
 * checkbox_tristate-mui-T09: Compact grid: match Sync status to Partial
 *
 * Layout: form_section rendered as a dense preferences grid in the top-left of the viewport.
 * The grid uses compact spacing and the checkbox is rendered with MUI's small size.
 * The target is a single tri-state checkbox labeled "Sync status".
 *
 * Guidance is mixed:
 * - Next to the section title is a small read-only chip showing an icon and text "Desired: Partial".
 *
 * Initial state of "Sync status": Checked.
 * Clutter: medium. Two nearby controls (a small select "Sync mode" and a switch "Background sync")
 * sit adjacent in the grid.
 * No Save button; changes are immediate.
 * 
 * Success: checkbox is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, FormControlLabel, Checkbox, Switch, Select, MenuItem, Chip } from '@mui/material';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [state, setState] = useState<TristateValue>('checked');
  const [syncMode, setSyncMode] = useState('auto');
  const [bgSync, setBgSync] = useState(true);

  const handleClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Typography variant="subtitle2">Preferences</Typography>
          <Chip
            icon={<IndeterminateCheckBoxIcon fontSize="small" />}
            label="Desired: Partial"
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                onClick={handleClick}
                size="small"
                data-testid="sync-status-checkbox"
              />
            }
            label={<Typography variant="body2">Sync status</Typography>}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2">Sync mode</Typography>
            <Select
              size="small"
              value={syncMode}
              onChange={(e) => setSyncMode(e.target.value)}
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </Box>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={bgSync}
                onChange={(e) => setBgSync(e.target.checked)}
              />
            }
            label={<Typography variant="body2">Background sync</Typography>}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
