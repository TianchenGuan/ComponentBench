'use client';

/**
 * combobox_editable_single-mui-T10: Select Zürich from async-loading Autocomplete
 *
 * The page has a button labeled "Add stop". Clicking it opens a modal dialog
 * that contains a MUI Autocomplete combobox labeled "City".
 * - Scene: modal_flow layout, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The Autocomplete fetches options asynchronously based on the typed query.
 *   After typing at least 2 characters, a small loading spinner appears for ~600–900ms.
 * - Options returned for query "Zu": Zürich (target, with umlaut), Zurich (no umlaut), Zwickau, Zunyi.
 * - Initial state: empty.
 * - Distractors: Notes textarea, Cancel button.
 *
 * Success: The "City" combobox value equals "Zürich" (Unicode-normalized).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

// Simulated async options based on query
const getCitiesForQuery = (query: string): string[] => {
  const allCities: Record<string, string[]> = {
    'zu': ['Zürich', 'Zurich', 'Zwickau', 'Zunyi'],
    'zü': ['Zürich'],
    'zw': ['Zwickau'],
    'mu': ['Munich', 'Mumbai', 'Muscat'],
    'be': ['Berlin', 'Beijing', 'Beirut', 'Belgrade'],
    'pa': ['Paris', 'Panama City', 'Palo Alto'],
    'lo': ['London', 'Los Angeles', 'Louisville'],
    'ne': ['New York', 'Newcastle', 'New Delhi'],
  };
  
  const lowerQuery = query.toLowerCase();
  for (const [prefix, cities] of Object.entries(allCities)) {
    if (lowerQuery.startsWith(prefix)) {
      return cities;
    }
  }
  return [];
};

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate async loading
  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(getCitiesForQuery(inputValue));
      setLoading(false);
    }, 700); // Simulate 700ms delay

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue?.normalize('NFC') === 'Zürich'.normalize('NFC')) {
      onSuccess();
    }
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Trip Planner</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Plan your next adventure
          </Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Add stop
          </Button>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add stop</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>City</Typography>
            <Autocomplete
              data-testid="city-autocomplete"
              freeSolo
              options={options}
              value={value}
              onChange={handleChange}
              inputValue={inputValue}
              onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Type at least 2 characters"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Goal: Zürich
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Notes</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Add notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
