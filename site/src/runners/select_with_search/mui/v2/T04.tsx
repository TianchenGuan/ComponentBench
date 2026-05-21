'use client';

/**
 * select_with_search-mui-v2-T04: Framework from logo reference in compact architecture card
 *
 * Inline surface with a reference tile showing the Next.js wordmark.
 * Restricted MUI Autocomplete "Framework" with custom icon+label render:
 * Next.js, Nuxt, NestJS, Remix. Initial: Remix. Target: Next.js.
 * "Save architecture" commits.
 * Success: Framework = "Next.js", Save architecture clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, CardActions, Typography, Autocomplete, TextField, Button, Box, Chip,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface FrameworkOption {
  label: string;
  icon: string;
}

const frameworkOptions: FrameworkOption[] = [
  { label: 'Next.js', icon: '▲' },
  { label: 'Nuxt', icon: '💚' },
  { label: 'NestJS', icon: '🐱' },
  { label: 'Remix', icon: '💿' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const defaultOption = frameworkOptions.find((o) => o.label === 'Remix')!;
  const [value, setValue] = useState<FrameworkOption>(defaultOption);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && value.label === 'Next.js') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, value, onSuccess]);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', minHeight: '70vh' }}>
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Architecture</Typography>

          <Box
            data-testid="framework-logo-ref"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'grey.100',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -1 }}>▲ Next.js</Typography>
            <Typography variant="caption" color="text.secondary">Reference</Typography>
          </Box>

          <Autocomplete
            options={frameworkOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(opt, val) => opt.label === val.label}
            value={value}
            onChange={(_e, newVal) => {
              if (newVal) { setValue(newVal); setSaved(false); }
            }}
            renderOption={(props, option) => {
              const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
              return (
                <li key={key} {...rest}>
                  <span style={{ marginRight: 8 }}>{option.icon}</span>
                  {option.label}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Framework" placeholder="Search frameworks..." size="small" />
            )}
          />

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Chip label="TypeScript" size="small" />
            <Chip label="Monorepo" size="small" variant="outlined" />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Button variant="contained" onClick={() => setSaved(true)}>
            Save architecture
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
