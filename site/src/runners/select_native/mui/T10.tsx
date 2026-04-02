'use client';

/**
 * select_native-mui-T10: Match framework to logo tile (visual guidance)
 *
 * Layout: a centered isolated card titled "Project template".
 * At the top of the card there is a "Logo tile" that shows ONLY a framework logo icon (no plain text label).
 * The tile has accessible alt/aria-label text for screen readers (e.g., aria-label="Vue").
 *
 * Below the tile is the target native select labeled "Framework" implemented as MUI Select with native=true.
 * Options (label → value):
 * - React → react
 * - Angular → angular
 * - Vue → vue  ← TARGET (matches the logo tile)
 * - Svelte → svelte
 *
 * Initial state: "React" is selected.
 * Clutter: none — only the tile and the dropdown are interactive.
 * Feedback: immediate; no confirmation step.
 *
 * Success: The target native select has selected option value 'vue' (label 'Vue').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  Select, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const frameworkOptions = [
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

// Simple Vue logo SVG
const VueLogo = () => (
  <svg width="48" height="48" viewBox="0 0 256 221" xmlns="http://www.w3.org/2000/svg">
    <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#41B883"/>
    <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 51.2 0H0z" fill="#41B883"/>
    <path d="M51.2 0l76.8 132.48L204.8 0h-47.36L128 51.2 97.92 0H51.2z" fill="#35495E"/>
  </svg>
);

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('react');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'vue') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Project template</Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Logo tile
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              background: '#fafafa',
            }}
            aria-label="Vue"
            role="img"
          >
            <VueLogo />
          </Box>
        </Box>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="framework-select">Framework</InputLabel>
          <Select
            native
            data-testid="framework-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange as any}
            inputProps={{
              name: 'framework',
              id: 'framework-select',
            }}
          >
            {frameworkOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
}
