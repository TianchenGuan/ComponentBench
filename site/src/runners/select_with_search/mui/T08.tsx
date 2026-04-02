'use client';

/**
 * select_with_search-mui-T08: Async city search in a modal: San Sebastián (ES)
 *
 * Layout: a travel planner page with a primary button "Add destination". Clicking it opens a Material UI Dialog (modal_flow).
 * Inside the dialog there is a single MUI Autocomplete labeled "City" that performs remote-style search:
 *  - The suggestions list does not appear until the user types at least 3 characters.
 *  - A small loading spinner appears while results are being fetched (simulated debounce + async).
 * Results include several similar "San …" cities, for example:
 *  - San Sebastián (ES) ← target
 *  - San Salvador (SV)
 *  - San Diego (US)
 *  - San Jose (US)
 *  - Santa Barbara (US)
 * Initial state: no city selected; input is empty.
 * Feedback: after selecting a result, the input value becomes the selected city label; the listbox closes. No "Save" click is required for success.
 *
 * Success: The "City" Autocomplete selected value equals "San Sebastián (ES)".
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Autocomplete, TextField, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

// All city options (simulating a remote database)
const allCities = [
  'San Sebastián (ES)',
  'San Salvador (SV)',
  'San Diego (US)',
  'San Jose (US)',
  'Santa Barbara (US)',
  'San Francisco (US)',
  'San Antonio (US)',
  'Santiago (CL)',
  'Santo Domingo (DO)',
  'Santorini (GR)',
  'Paris (FR)',
  'London (UK)',
  'Tokyo (JP)',
  'New York (US)',
  'Sydney (AU)',
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate async search
  useEffect(() => {
    if (inputValue.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = allCities.filter(city => 
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setOptions(filtered);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'San Sebastián (ES)') {
      onSuccess();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Travel Planner</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Plan your next adventure
          </Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add destination
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add destination</DialogTitle>
        <DialogContent>
          <Autocomplete
            data-testid="city-autocomplete"
            sx={{ mt: 1 }}
            options={options}
            value={value}
            onChange={handleChange}
            inputValue={inputValue}
            onInputChange={(_e, newInputValue) => setInputValue(newInputValue)}
            loading={loading}
            filterOptions={(x) => x} // Disable built-in filtering, we do it server-side
            noOptionsText={inputValue.length < 3 ? "Type at least 3 characters" : "No cities found"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="City"
                placeholder="Search for a city..."
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
