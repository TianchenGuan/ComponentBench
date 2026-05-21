'use client';

/**
 * checkbox_group-mui-T03: Clear all Interests selections
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Centered card titled "Profile interests" using Material UI components.
 * There is one FormGroup labeled "Interests" with five checkbox options:
 * Tech, Travel, Food, Sports, Music.
 * Initial state: Travel and Music are checked; the remaining three are unchecked.
 * Success: The 'Interests' checkbox group has no items checked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Tech', 'Travel', 'Food', 'Sports', 'Music'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Tech: false,
    Travel: true,
    Food: false,
    Sports: false,
    Music: true,
  });

  useEffect(() => {
    const checkedItems = Object.entries(selected).filter(([, v]) => v);
    if (checkedItems.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected({ ...selected, [name]: event.target.checked });
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Profile interests</Typography>
        <FormControl component="fieldset" data-testid="cg-interests">
          <FormLabel component="legend">Interests</FormLabel>
          <FormGroup>
            {options.map(option => (
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
