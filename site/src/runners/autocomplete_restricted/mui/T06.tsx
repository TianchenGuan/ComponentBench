'use client';

/**
 * autocomplete_restricted-mui-T06: Match seat class to the itinerary card
 *
 * setup_description:
 * The page is an isolated "Trip details" card.
 *
 * On the right side of the card is a read-only itinerary summary that includes a highlighted line:
 * - **Seat class: Business** (this is the reference)
 *
 * On the left side is one Material UI Autocomplete labeled **Seat class** (target component).
 * - Theme: light; spacing: comfortable; size: default.
 * - Restricted (freeSolo=false).
 * - Initial state: Economy is selected by default.
 * - Options: Economy, Premium Economy, Business, First.
 * - Selection commits immediately.
 *
 * The instruction does not say "Business" directly; the agent must read it from the itinerary summary and match it in the Autocomplete.
 *
 * Success: The "Seat class" Autocomplete has selected value "Business" (matching the reference).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const seatClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Economy');

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Business') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Trip details
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left side: Autocomplete */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Seat class</Typography>
            <Autocomplete
              data-testid="seat-class-autocomplete"
              options={seatClasses}
              value={value}
              onChange={handleChange}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select class" size="small" />
              )}
              freeSolo={false}
            />
          </Box>

          {/* Right side: Itinerary summary (reference) */}
          <Box
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              p: 2,
              minWidth: 180,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Itinerary Summary
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2">Flight: AA 1234</Typography>
              <Typography variant="body2">Route: SFO → JFK</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Seat class:</Typography>
                <Chip
                  data-testid="itinerary-summary.seat-class"
                  label="Business"
                  size="small"
                  color="primary"
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
