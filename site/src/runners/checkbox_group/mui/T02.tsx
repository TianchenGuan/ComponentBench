'use client';

/**
 * checkbox_group-mui-T02: Turn off SMS contact method
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Material UI demo card titled "Contact preferences" in light theme.
 * One FormGroup is labeled "Contact methods" and contains:
 * - Email (checked by default)
 * - SMS (checked by default)
 * - Phone (unchecked)
 * Success: In the 'Contact methods' checkbox group, only Email is checked (SMS and Phone are unchecked).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Email: true,
    SMS: true,
    Phone: false,
  });

  useEffect(() => {
    const targetSet = new Set(['Email']);
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
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Contact preferences</Typography>
        <FormControl component="fieldset" data-testid="cg-contact-methods">
          <FormLabel component="legend">Contact methods</FormLabel>
          <FormGroup>
            {Object.keys(selected).map(option => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox 
                    checked={selected[option]} 
                    onChange={handleChange(option)}
                    name={option}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
