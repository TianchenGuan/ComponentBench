'use client';

/**
 * select_custom_multi-mui-v2-T09: Reference scopes card with hidden-tag verification
 *
 * Dashboard panel, high_contrast theme, compact spacing, off-center, medium clutter.
 * Read-only chip row "Required scopes": read:cases, write:cases, export:reports, manage:tokens.
 * Below: MUI Autocomplete (multiple, limitTags=2) labeled "Granted scopes".
 * Options: read:cases, read:case-files, write:cases, write:reports, export:reports, export:raw,
 *          manage:tokens, manage:billing, audit:logs.
 * Initial: [read:case-files, export:raw]. Target: match reference = {read:cases, write:cases, export:reports, manage:tokens}.
 * Auto-apply (no save button).
 *
 * Success: Granted scopes = {read:cases, write:cases, export:reports, manage:tokens}.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Autocomplete, TextField, Chip, Typography, Paper, Box, Divider,
  ThemeProvider, createTheme, CssBaseline, Button,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000', paper: '#0a0a0a' },
    text: { primary: '#fff' },
  },
});

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const scopeOptions = [
  'read:cases', 'read:case-files', 'write:cases', 'write:reports',
  'export:reports', 'export:raw', 'manage:tokens', 'manage:billing', 'audit:logs',
];

const referenceScopes = ['read:cases', 'write:cases', 'export:reports', 'manage:tokens'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [grantedScopes, setGrantedScopes] = useState<string[]>(['read:case-files', 'export:raw']);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (setsEqual(grantedScopes, referenceScopes)) {
      successFired.current = true;
      onSuccess();
    }
  }, [grantedScopes, onSuccess]);

  return (
    <ThemeProvider theme={highContrastTheme}>
      <CssBaseline />
      <Box sx={{ p: 2, minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" size="small" disabled>Revoke all</Button>
          <Button variant="outlined" size="small" disabled>Audit log</Button>
        </Box>

        <Paper sx={{ p: 2, maxWidth: 500 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Permissions</Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Required scopes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {referenceScopes.map(s => <Chip key={s} label={s} size="small" color="info" variant="outlined" />)}
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Autocomplete
            multiple
            limitTags={2}
            options={scopeOptions}
            value={grantedScopes}
            onChange={(_, v) => setGrantedScopes(v)}
            renderTags={(value, getTagProps) =>
              value.map((opt, i) => <Chip size="small" label={opt} {...getTagProps({ index: i })} key={opt} />)
            }
            renderInput={(params) => <TextField {...params} label="Granted scopes" size="small" />}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
