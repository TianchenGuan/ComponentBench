'use client';

/**
 * checkbox_tristate-mui-T06: Filters popover: enable Include archived
 *
 * Layout: dashboard header row with a "Filters" button.
 * The tri-state checkbox is inside a MUI Popover:
 * - Clicking the "Filters" button opens a small popover panel anchored under the button.
 * - The popover contains one MUI tri-state checkbox labeled "Include archived"
 *   plus a non-required text field "Search".
 *
 * Initial state when the popover opens: Unchecked.
 * No Apply button; changes apply immediately while the popover is open.
 * The popover can be left open or closed; only the checkbox state is evaluated.
 * 
 * Success: checkbox is Checked.
 */

import React, { useState } from 'react';
import { Box, Button, Popover, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [state, setState] = useState<TristateValue>('unchecked');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxClick = () => {
    const newState = cycleTristateValue(state);
    setState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: 500, p: 2 }}>
      {/* Dashboard header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={handleClick}
          data-testid="filters-button"
        >
          Filters
        </Button>
      </Box>

      {/* Placeholder content */}
      <Typography color="text.secondary">
        Click the Filters button above to access filter options.
      </Typography>

      {/* Popover with filters */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <TextField
            label="Search"
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state === 'checked'}
                indeterminate={state === 'indeterminate'}
                onClick={handleCheckboxClick}
                data-testid="include-archived-checkbox"
              />
            }
            label="Include archived"
          />
        </Box>
      </Popover>
    </Box>
  );
}
