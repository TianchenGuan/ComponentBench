'use client';

/**
 * autocomplete_freeform-mui-v2-T02: Backup alias only with grouped suggestion headings
 *
 * Settings panel with two single-value Autocomplete fields (Primary alias, Backup alias).
 * Options are grouped under "Admins", "Analysts", "Automation". autoHighlight is on.
 * Set "Backup alias" to `alpha-admin` from the grouped suggestion list.
 * Primary alias must stay `beta-admin`. Click "Apply aliases".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Autocomplete, TextField, Paper, Button, Typography, Box, Stack, Divider,
  FormControlLabel, Switch,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

interface AliasOption {
  label: string;
  group: string;
}

const aliasOptions: AliasOption[] = [
  { label: 'alpha-admin', group: 'Admins' },
  { label: 'alpha-analyst', group: 'Analysts' },
  { label: 'alpha-auto', group: 'Automation' },
  { label: 'beta-admin', group: 'Admins' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primaryAlias, setPrimaryAlias] = useState<string | null>('beta-admin');
  const [backupAlias, setBackupAlias] = useState<string | null>(null);
  const [backupFromSuggestion, setBackupFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleApply = useCallback(() => setSaved(true), []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (
      backupAlias === 'alpha-admin' &&
      backupFromSuggestion &&
      primaryAlias === 'beta-admin'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backupAlias, backupFromSuggestion, primaryAlias, onSuccess]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 460 }}>
        <Typography variant="h6" gutterBottom>Alias Settings</Typography>

        {/* Clutter */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <FormControlLabel control={<Switch defaultChecked size="small" />} label="Enable fallback routing" />
          <FormControlLabel control={<Switch size="small" />} label="Require approval" />
          <FormControlLabel control={<Switch defaultChecked size="small" />} label="Notify on change" />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={3}>
          <div>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Primary alias</Typography>
            <Autocomplete
              freeSolo
              openOnFocus
              autoHighlight
              data-testid="primary-alias"
              options={aliasOptions}
              groupBy={(option) => typeof option === 'string' ? '' : option.group}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              value={aliasOptions.find(o => o.label === primaryAlias) ?? primaryAlias}
              onChange={(_e, newVal) => {
                setPrimaryAlias(typeof newVal === 'string' ? newVal : newVal?.label ?? null);
              }}
              onInputChange={(_e, val, reason) => {
                if (reason === 'input') setPrimaryAlias(val);
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Search alias" />
              )}
            />
          </div>

          <div>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Backup alias</Typography>
            <Autocomplete
              freeSolo
              openOnFocus
              autoHighlight
              data-testid="backup-alias"
              options={aliasOptions}
              groupBy={(option) => typeof option === 'string' ? '' : option.group}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              value={aliasOptions.find(o => o.label === backupAlias) ?? backupAlias}
              onChange={(_e, newVal) => {
                const val = typeof newVal === 'string' ? newVal : newVal?.label ?? null;
                setBackupAlias(val);
                setBackupFromSuggestion(typeof newVal !== 'string' && newVal !== null);
              }}
              onInputChange={(_e, val, reason) => {
                if (reason === 'input') {
                  setBackupAlias(val);
                  setBackupFromSuggestion(false);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Search alias" />
              )}
            />
          </div>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button variant="contained" onClick={handleApply}>Apply aliases</Button>
        </Box>
      </Paper>
    </Box>
  );
}
