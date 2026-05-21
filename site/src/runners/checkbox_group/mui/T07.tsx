'use client';

/**
 * checkbox_group-mui-T07: Pick two specific reviewers
 *
 * Scene: light theme; comfortable spacing; a form section centered in the viewport.
 * Material UI "Assign reviewers" form section (light theme) with low clutter.
 * The target is a FormControl with legend "Reviewers" and helper text "Pick two". 
 * FormGroup with checkboxes: Gilad Gray, Jason Killian, Antoine Llorca, "No reviewer" (unchecked).
 * Initial state: none selected.
 * Feedback: if fewer than two are selected, helper text shows error ("Pick two reviewers").
 * If more than two are selected, shows ("Too many selected").
 * Success: Exactly Gilad Gray and Antoine Llorca are checked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox, FormHelperText
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const reviewers = ['Gilad Gray', 'Jason Killian', 'Antoine Llorca', 'No reviewer'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    'Gilad Gray': false,
    'Jason Killian': false,
    'Antoine Llorca': false,
    'No reviewer': false,
  });

  const checkedCount = Object.values(selected).filter(v => v).length;
  const getHelperText = () => {
    if (checkedCount < 2) return 'Pick two reviewers';
    if (checkedCount > 2) return 'Too many selected';
    return 'Perfect!';
  };
  const isError = checkedCount !== 2;

  useEffect(() => {
    const targetSet = new Set(['Gilad Gray', 'Antoine Llorca']);
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
        <Typography variant="h6" gutterBottom>Assign reviewers</Typography>
        <FormControl component="fieldset" error={isError} data-testid="cg-reviewers">
          <FormLabel component="legend">Reviewers</FormLabel>
          <FormGroup>
            {reviewers.map(reviewer => (
              <FormControlLabel
                key={reviewer}
                control={
                  <Checkbox 
                    checked={selected[reviewer]} 
                    onChange={handleChange(reviewer)}
                    name={reviewer}
                  />
                }
                label={reviewer}
              />
            ))}
          </FormGroup>
          <FormHelperText>{getHelperText()}</FormHelperText>
        </FormControl>
      </CardContent>
    </Card>
  );
}
