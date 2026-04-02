'use client';

/**
 * select_custom_single-mui-T07: Match Priority to the amber dot
 *
 * Layout: centered isolated card titled "Task priority".
 * The card contains one MUI Select labeled "Priority".
 *
 * Options are custom-rendered MenuItems with a colored dot icon (ListItemIcon) followed by text:
 * - Low (gray dot)
 * - Medium (amber dot)
 * - High (red dot)
 *
 * Visual guidance: to the right of the Select label there is a small "Reference" badge showing only an amber dot
 * (no text label). The goal is to choose the option whose dot color matches the reference.
 *
 * Initial state: Priority is currently "Low".
 * Feedback: selection applies immediately and updates the Select's displayed value; no confirmation button.
 * No other selects are present.
 *
 * Success: The Priority Select has selected value exactly "Medium" (the amber-dot option).
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const priorities = [
  { label: 'Low', value: 'Low', color: '#9e9e9e' },
  { label: 'Medium', value: 'Medium', color: '#ff9800' },
  { label: 'High', value: 'High', color: '#f44336' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('Low');

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue === 'Medium') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Task priority</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
          <FormControl sx={{ flex: 1 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority-select"
              data-testid="priority-select"
              value={value}
              label="Priority"
              onChange={handleChange}
              renderValue={(selected) => {
                const priority = priorities.find(p => p.value === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Circle sx={{ fontSize: 14, color: priority?.color }} />
                    {selected}
                  </Box>
                );
              }}
            >
              {priorities.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Circle sx={{ fontSize: 14, color: p.color }} />
                  </ListItemIcon>
                  <ListItemText>{p.label}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            p: 1.5, 
            textAlign: 'center',
            minWidth: 80,
          }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Reference
            </Typography>
            <Circle sx={{ fontSize: 24, color: '#ff9800' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
