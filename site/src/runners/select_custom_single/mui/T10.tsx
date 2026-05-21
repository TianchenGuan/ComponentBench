'use client';

/**
 * select_custom_single-mui-T10: Select Archived status in Advanced filters dialog
 *
 * Layout: modal_flow with the entry point located near the bottom-left of the viewport.
 * The base page shows a toolbar button labeled "Advanced filters". Clicking it opens a dialog titled "Advanced filters".
 *
 * Inside the dialog, there is one MUI Select labeled "Record status".
 * Initial state: "Active".
 *
 * The menu items are grouped with subheaders:
 * - Current: Active, Inactive
 * - Historical: Archived  ← TARGET
 * The grouping is visual (ListSubheader) but the item text is still visible.
 *
 * Clutter: the dialog also contains a read-only hint paragraph and a non-target checkbox "Include soft-deleted".
 * These are distractors.
 *
 * Feedback: selecting a menu item updates the Select value immediately. The dialog has a Close icon,
 * but closing is not required for success.
 *
 * Success: Within the Advanced filters dialog, the Select labeled "Record status" has selected value exactly "Archived".
 */

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
} from '@mui/material';
import { Close, FilterList } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [recordStatus, setRecordStatus] = useState<string>('Active');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setRecordStatus(newValue);
    if (newValue === 'Archived') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<FilterList />}
        onClick={() => setOpen(true)}
      >
        Advanced filters
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Advanced filters
          <IconButton onClick={() => setOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use these filters to narrow down records based on their current status.
            Changes are applied in real-time.
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="record-status-label">Record status</InputLabel>
            <Select
              labelId="record-status-label"
              id="record-status-select"
              data-testid="record-status-select"
              value={recordStatus}
              label="Record status"
              onChange={handleChange}
            >
              <ListSubheader>Current</ListSubheader>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <ListSubheader>Historical</ListSubheader>
              <MenuItem value="Archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel 
            control={<Checkbox />} 
            label="Include soft-deleted" 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
