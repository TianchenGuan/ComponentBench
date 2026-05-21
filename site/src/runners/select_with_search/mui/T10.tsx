'use client';

/**
 * select_with_search-mui-T10: Select the framework matching a logo reference
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport (placement bottom_right) titled "Tech stack".
 * Guidance: visual. A "Reference" box shows only a framework logo icon (no text). In this task instance, the reference icon is the Vue logo.
 * Component: one MUI Autocomplete labeled "Framework". Each option row shows a small logo icon followed by the framework name:
 *  - React
 *  - Vue ← target that matches the reference logo
 *  - Svelte
 *  - Angular
 * Initial state: "React" is selected.
 * Interaction: open the listbox and choose the option whose logo matches the reference icon. Typing filters by framework name, but the goal is solvable purely by visual matching.
 *
 * Success: The selected value of the "Framework" Autocomplete equals "Vue".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

interface FrameworkOption {
  value: string;
  label: string;
  logo: string; // Using emoji/text representation for logos
}

const frameworkOptions: FrameworkOption[] = [
  { value: 'React', label: 'React', logo: '⚛️' },
  { value: 'Vue', label: 'Vue', logo: '🟢' }, // Green circle to represent Vue's green logo
  { value: 'Svelte', label: 'Svelte', logo: '🔶' },
  { value: 'Angular', label: 'Angular', logo: '🔴' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<FrameworkOption | null>(frameworkOptions[0]); // React

  const handleChange = (_event: React.SyntheticEvent, newValue: FrameworkOption | null) => {
    setValue(newValue);
    if (newValue?.value === 'Vue') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Tech stack</Typography>
        
        {/* Reference panel - shows Vue logo */}
        <Box sx={{ 
          mb: 2, 
          p: 2, 
          bgcolor: 'grey.100', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Reference
          </Typography>
          <Box sx={{ fontSize: 40 }}>🟢</Box>
        </Box>

        <Autocomplete
          data-testid="framework-autocomplete"
          options={frameworkOptions}
          value={value}
          onChange={handleChange}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, val) => option.value === val.value}
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <Box component="li" key={key} {...restProps} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: 20 }}>{option.logo}</span>
                <span>{option.label}</span>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Framework"
              InputProps={{
                ...params.InputProps,
                startAdornment: value ? <span style={{ marginRight: 8, fontSize: 18 }}>{value.logo}</span> : null,
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
