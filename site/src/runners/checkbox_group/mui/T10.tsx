'use client';

/**
 * checkbox_group-mui-T10: Toggle schedule days in compact row layout
 *
 * Scene: dark theme; compact spacing; a settings panel anchored toward the bottom-right; small-sized controls.
 * Material UI page in a dark theme with compact spacing. Settings panel near the bottom-right.
 * Within "Digest schedule" settings panel, there is a single FormGroup labeled "Send on" in row layout.
 * Options are short day abbreviations: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
 * Initial state: Mon, Wed, Fri, Sun are checked; the other days are unchecked.
 * Other clutter: disabled time picker ("Send time"), non-functional "Learn more" link.
 * Success: Exactly Tue, Thu, and Sat are checked (all other days are unchecked).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox, TextField, Link, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: false,
    Wed: true,
    Thu: false,
    Fri: true,
    Sat: false,
    Sun: true,
  });

  useEffect(() => {
    const targetSet = new Set(['Tue', 'Thu', 'Sat']);
    const checkedItems = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected({ ...selected, [name]: event.target.checked });
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>Digest schedule</Typography>
        
        {/* Distractor: disabled time picker */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">Send time</Typography>
          <TextField 
            value="09:00 AM" 
            disabled 
            size="small" 
            fullWidth 
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* Target: Send on checkbox group in row layout */}
        <FormControl component="fieldset" data-testid="cg-send-on">
          <FormLabel component="legend" sx={{ fontSize: 13 }}>Send on</FormLabel>
          <FormGroup row sx={{ flexWrap: 'wrap' }}>
            {days.map(day => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox 
                    checked={selected[day]} 
                    onChange={handleChange(day)}
                    name={day}
                    size="small"
                  />
                }
                label={<Typography variant="body2" sx={{ fontSize: 12 }}>{day}</Typography>}
                sx={{ mr: 0.5 }}
              />
            ))}
          </FormGroup>
        </FormControl>

        {/* Distractor: non-functional link */}
        <Box sx={{ mt: 2 }}>
          <Link href="#" underline="hover" sx={{ fontSize: 12 }} onClick={(e) => e.preventDefault()}>
            Learn more about digest schedules
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
