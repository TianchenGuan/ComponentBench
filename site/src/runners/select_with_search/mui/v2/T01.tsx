'use client';

/**
 * select_with_search-mui-v2-T01: Grouped destination picker in modal with save
 *
 * "Edit destination" opens a modal with a restricted MUI Autocomplete labeled "Destination".
 * Options grouped by country. Confusable: San Sebastián (ES), San Sebastián (MX),
 * San Jose (US), San José (CR). Empty initial. "Save destination" commits.
 * Success: Destination = "San Sebastián (ES)", Save destination clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Button, Card, CardContent, Typography, Autocomplete, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface DestinationOption {
  label: string;
  group: string;
}

const destinations: DestinationOption[] = [
  { label: 'San Jose (US)', group: 'United States' },
  { label: 'Los Angeles (US)', group: 'United States' },
  { label: 'Miami (US)', group: 'United States' },
  { label: 'San José (CR)', group: 'Costa Rica' },
  { label: 'Limón (CR)', group: 'Costa Rica' },
  { label: 'San Sebastián (ES)', group: 'Spain' },
  { label: 'Barcelona (ES)', group: 'Spain' },
  { label: 'Madrid (ES)', group: 'Spain' },
  { label: 'San Sebastián (MX)', group: 'Mexico' },
  { label: 'Cancún (MX)', group: 'Mexico' },
  { label: 'Guadalajara (MX)', group: 'Mexico' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<DestinationOption | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && value?.label === 'San Sebastián (ES)') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Travel Itinerary</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current destination: {value?.label || 'Not set'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Round trip" size="small" />
            <Chip label="Economy" size="small" variant="outlined" />
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Edit destination</Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Destination</DialogTitle>
        <DialogContent>
          <Autocomplete
            sx={{ mt: 1 }}
            options={destinations}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, val) => option.label === val.label}
            value={value}
            onChange={(_e, newVal) => { setValue(newVal); setSaved(false); }}
            renderInput={(params) => (
              <TextField {...params} label="Destination" placeholder="Search destinations..." />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => { setSaved(true); setOpen(false); }}
          >
            Save destination
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
