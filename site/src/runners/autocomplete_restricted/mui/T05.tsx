'use client';

/**
 * autocomplete_restricted-mui-T05: Set destination airport (two fields)
 *
 * setup_description:
 * A centered "Flight search" card contains **two** Material UI Autocomplete fields:
 * 1) **From airport** (preselected: SFO — San Francisco)
 * 2) **To airport** (empty)  ← target
 *
 * Both are restricted autocompletes with the same option list of common airports:
 * - JFK — New York
 * - LGA — New York
 * - EWR — Newark
 * - LAX — Los Angeles
 * - SEA — Seattle
 * - ORD — Chicago
 * ... (about 12 total)
 *
 * Interaction:
 * - Theme: light; spacing: comfortable; size: default.
 * - Focusing an input opens the listbox; typing filters.
 * - Selection immediately updates the chosen field; no Search button is required for success.
 *
 * The key difficulty is choosing the correct instance (To airport) and the correct New York airport code.
 *
 * Success: The "To airport" Autocomplete has selected value "JFK — New York".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const airports = [
  'JFK — New York',
  'LGA — New York',
  'EWR — Newark',
  'LAX — Los Angeles',
  'SFO — San Francisco',
  'SEA — Seattle',
  'ORD — Chicago',
  'DFW — Dallas',
  'ATL — Atlanta',
  'BOS — Boston',
  'DEN — Denver',
  'MIA — Miami',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [fromAirport, setFromAirport] = useState<string | null>('SFO — San Francisco');
  const [toAirport, setToAirport] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && toAirport === 'JFK — New York') {
      successFired.current = true;
      onSuccess();
    }
  }, [toAirport, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Flight search
        </Typography>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>From airport</Typography>
            <Autocomplete
              data-testid="from-airport-autocomplete"
              options={airports}
              value={fromAirport}
              onChange={(_event, newValue) => setFromAirport(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select departure" size="small" />
              )}
              freeSolo={false}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>To airport</Typography>
            <Autocomplete
              data-testid="to-airport-autocomplete"
              options={airports}
              value={toAirport}
              onChange={(_event, newValue) => setToAirport(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select destination" size="small" />
              )}
              freeSolo={false}
            />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
