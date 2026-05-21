'use client';

/**
 * checkbox_group-mui-T01: Select Cheese and Mushrooms (Toppings)
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Material UI page with a centered isolated card titled "Pizza builder".
 * Inside the card is a FormControl with legend "Toppings". Within it, a MUI FormGroup renders three Checkbox options:
 * - Cheese
 * - Pepperoni
 * - Mushrooms
 * Initial state: none checked. No submit/apply button; changes are immediate.
 * Success: In the 'Toppings' checkbox group, Cheese and Mushrooms are checked and Pepperoni is unchecked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Cheese', 'Pepperoni', 'Mushrooms'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    Cheese: false,
    Pepperoni: false,
    Mushrooms: false,
  });

  useEffect(() => {
    const targetSet = new Set(['Cheese', 'Mushrooms']);
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
        <Typography variant="h6" gutterBottom>Pizza builder</Typography>
        <FormControl component="fieldset" data-testid="cg-toppings">
          <FormLabel component="legend">Toppings</FormLabel>
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
