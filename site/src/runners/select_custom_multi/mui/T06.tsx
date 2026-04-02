'use client';

/**
 * select_custom_multi-mui-T06: Select exactly 4 visible columns
 *
 * Scene context: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=1, guidance=text, clutter=medium.
 * Layout: settings form section titled "Table settings" (centered). Clutter: medium (there are other toggles like "Dense mode" and a search field, but they are not required).
 * Target component: one MUI Autocomplete (multiple) labeled "Visible columns".
 * Options (9): Name, Status, Owner, Priority, Created, Updated, Due date, Labels, Notes.
 * Initial state: two chips are preselected: Name and Created.
 * Constraint: a helper text below the input says "Select up to 4 columns". If the user selects more than 4, an inline error message appears and the extra chip is not accepted (or is immediately removed).
 * There is no Save button; the field is considered set when the chip set matches the target.
 *
 * Success: The selected values are exactly: Name, Status, Owner, Updated (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Autocomplete, TextField, Chip, 
  Box, FormControlLabel, Switch, FormHelperText 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const columnOptions = [
  'Name', 'Status', 'Owner', 'Priority', 'Created', 
  'Updated', 'Due date', 'Labels', 'Notes'
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Name', 'Created']);
  const [denseMode, setDenseMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const targetSet = new Set(['Name', 'Status', 'Owner', 'Updated']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (_: React.SyntheticEvent, newValue: string[]) => {
    if (newValue.length > 4) {
      setError(true);
      return;
    }
    setError(false);
    setSelected(newValue);
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Table settings</Typography>
        
        {/* Clutter elements */}
        <Box sx={{ mb: 2 }}>
          <TextField 
            size="small" 
            label="Search" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: '100%', mb: 2 }}
          />
          <FormControlLabel 
            control={<Switch checked={denseMode} onChange={(e) => setDenseMode(e.target.checked)} />}
            label="Dense mode"
          />
        </Box>

        <Autocomplete
          multiple
          data-testid="visible-columns-select"
          options={columnOptions}
          value={selected}
          onChange={handleChange}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Visible columns" 
              error={error}
              helperText={error ? "Maximum 4 columns allowed" : "Select up to 4 columns"}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
