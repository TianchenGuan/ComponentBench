'use client';

/**
 * menu-mui-T09: Change sort option and click Apply in menu panel
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A menu-like list titled "Sort" built with MUI MenuList/MenuItem (radio behavior).
 * - A footer row in the same panel contains "Apply" and "Cancel" buttons.
 *
 * Options:
 * - Relevance (currently applied)
 * - Last updated ← target
 * - Title
 *
 * State model / feedback:
 * - Clicking an option updates a "Pending sort" label immediately.
 * - Only clicking "Apply" updates "Applied sort: …".
 * - Clicking "Cancel" reverts the pending choice back to the applied sort.
 *
 * Success: The committed/applied sort equals "Last updated" (require_confirm=true).
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, Typography, Box, Button, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

const sortOptions = ['Relevance', 'Last updated', 'Title'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [appliedSort, setAppliedSort] = useState<string>('Relevance');
  const [pendingSort, setPendingSort] = useState<string>('Relevance');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (appliedSort === 'Last updated' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [appliedSort, successTriggered, onSuccess]);

  const handleApply = () => {
    setAppliedSort(pendingSort);
  };

  const handleCancel = () => {
    setPendingSort(appliedSort);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 320 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Results</Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
        Sort
      </Typography>
      <Paper variant="outlined">
        <MenuList data-testid="menu-sort">
          {sortOptions.map((option) => (
            <MenuItem
              key={option}
              selected={pendingSort === option}
              onClick={() => setPendingSort(option)}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>

      {/* Footer with Apply/Cancel */}
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" size="small" onClick={handleCancel} data-testid="btn-cancel">
          Cancel
        </Button>
        <Button variant="contained" size="small" onClick={handleApply} data-testid="btn-apply">
          Apply
        </Button>
      </Stack>

      {/* Status lines */}
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Pending sort: <strong data-testid="pending-sort">{pendingSort}</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Applied sort: <strong style={{ color: '#4caf50' }} data-testid="applied-sort">{appliedSort}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
