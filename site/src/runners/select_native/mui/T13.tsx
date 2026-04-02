'use client';

/**
 * select_native-mui-T13: Choose Django from grouped options (optgroup)
 *
 * Layout: a centered isolated card titled "Service scaffolding".
 * The target component is a MUI NativeSelect labeled "Framework" populated using native <optgroup> sections.
 *
 * Options (label → value), grouped:
 * Frontend:
 * - React → react
 * - Angular → angular
 * - Vue → vue
 * - Svelte → svelte
 * Backend:
 * - Express → express
 * - Koa → koa
 * - Django → django  ← TARGET
 * - Rails → rails
 * Other:
 * - None / Skip → none
 *
 * Initial state: "React" is selected.
 * Clutter: none — only the label, the select, and a short helper line "Grouped by category".
 * Feedback: immediate, no confirmation.
 *
 * Success: The target native select has selected option value 'django' (label 'Django').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, FormHelperText
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('react');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'django') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Service scaffolding</Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="framework-select">Framework</InputLabel>
          <NativeSelect
            data-testid="framework-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'framework',
              id: 'framework-select',
            }}
          >
            <optgroup label="Frontend">
              <option value="react">React</option>
              <option value="angular">Angular</option>
              <option value="vue">Vue</option>
              <option value="svelte">Svelte</option>
            </optgroup>
            <optgroup label="Backend">
              <option value="express">Express</option>
              <option value="koa">Koa</option>
              <option value="django">Django</option>
              <option value="rails">Rails</option>
            </optgroup>
            <optgroup label="Other">
              <option value="none">None / Skip</option>
            </optgroup>
          </NativeSelect>
          <FormHelperText>Grouped by category</FormHelperText>
        </FormControl>
      </CardContent>
    </Card>
  );
}
