'use client';

/**
 * menu-mui-T08: Select an exact set of columns in a dense multi-select menu
 * 
 * Scene: theme=light, spacing=compact, layout=settings_panel, placement=center, scale=small, instances=1.
 *
 * Component:
 * - A vertical checkbox-style menu labeled "Columns".
 * - The menu is rendered in compact spacing and small scale to increase density.
 *
 * Column options (many, with similar names):
 * - Name (checked initially)
 * - Status (checked initially)
 * - Owner (unchecked initially)
 * - Last updated (unchecked initially)
 * - Created at (checked initially) ← distractor that must be unchecked
 * - Updated by, Priority, Tags, Description, Due date, ID, Source
 *
 * Goal:
 * - Exactly {Name, Status, Owner, Last updated} are checked.
 *
 * Success: The Columns menu checked set is exactly {Name, Status, Owner, Last updated}.
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, ListItemIcon, Checkbox, Typography, Box, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const columnOptions = [
  'Name',
  'Status',
  'Owner',
  'Last updated',
  'Created at',
  'Updated by',
  'Priority',
  'Tags',
  'Description',
  'Due date',
  'ID',
  'Source',
];

const targetSet = new Set(['Name', 'Status', 'Owner', 'Last updated']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checkedColumns, setCheckedColumns] = useState<Set<string>>(new Set(['Name', 'Status', 'Created at']));
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    const isEqual =
      checkedColumns.size === targetSet.size &&
      Array.from(targetSet).every((item) => checkedColumns.has(item));

    if (isEqual && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [checkedColumns, successTriggered, onSuccess]);

  const handleToggle = (key: string) => {
    setCheckedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, width: 450 }}>
      {/* Settings panel clutter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          View name
        </Typography>
        <TextField size="small" value="Default view" disabled fullWidth />
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        <Chip label="Filter: Active" size="small" />
        <Chip label="Sort: Name" size="small" />
      </Box>

      {/* Target menu */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
        Columns
      </Typography>
      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
        <MenuList dense data-testid="menu-columns">
          {columnOptions.map((col) => (
            <MenuItem
              key={col}
              onClick={() => handleToggle(col)}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
              data-testid={`col-${col.toLowerCase().replace(/ /g, '-')}`}
              data-checked={checkedColumns.has(col)}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Checkbox
                  checked={checkedColumns.has(col)}
                  size="small"
                  disableRipple
                  tabIndex={-1}
                  sx={{ p: 0 }}
                />
              </ListItemIcon>
              {col}
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Selected columns: <strong data-testid="selected-columns">{Array.from(checkedColumns).sort().join(', ') || 'None'}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
