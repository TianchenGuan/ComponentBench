'use client';

/**
 * select_with_search-mui-v2-T02: Backup clinic only in a two-field async form
 *
 * Inline surface with 2 restricted MUI Autocomplete controls:
 * - Primary clinic — Saint Mary — East (pre-filled)
 * - Backup clinic — (empty)
 * Async search-as-you-type. Searching "Saint" returns: Saint Mary — East, Saint Mary — West,
 * Saint Martha — North. "Apply clinics" commits.
 * Success: Backup clinic = "Saint Mary — West", Primary clinic still "Saint Mary — East", Apply clinics clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, CardContent, Typography, Autocomplete, TextField, Button, Box, Chip, CircularProgress,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const allClinics = [
  'Saint Mary — East',
  'Saint Mary — West',
  'Saint Martha — North',
  'City General',
  'Riverside Medical',
  'Lakeside Health',
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primaryClinic, setPrimaryClinic] = useState<string | null>('Saint Mary — East');
  const [backupClinic, setBackupClinic] = useState<string | null>(null);
  const [primaryOptions, setPrimaryOptions] = useState<string[]>([]);
  const [backupOptions, setBackupOptions] = useState<string[]>([]);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && backupClinic === 'Saint Mary — West' && primaryClinic === 'Saint Mary — East') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, backupClinic, primaryClinic, onSuccess]);

  const simulateSearch = useCallback((query: string, setter: (opts: string[]) => void, setLoading: (l: boolean) => void) => {
    if (!query) { setter([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = allClinics.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
      setter(filtered);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Clinic Assignment</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Assign primary and backup clinics for this patient.
          </Typography>

          <Autocomplete
            sx={{ mb: 2 }}
            options={primaryOptions}
            value={primaryClinic}
            loading={primaryLoading}
            onInputChange={(_e, input) => simulateSearch(input, setPrimaryOptions, setPrimaryLoading)}
            onChange={(_e, newVal) => { setPrimaryClinic(newVal); setApplied(false); }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Primary clinic"
                placeholder="Search clinics..."
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {primaryLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <Autocomplete
            sx={{ mb: 2 }}
            options={backupOptions}
            value={backupClinic}
            loading={backupLoading}
            onInputChange={(_e, input) => simulateSearch(input, setBackupOptions, setBackupLoading)}
            onChange={(_e, newVal) => { setBackupClinic(newVal); setApplied(false); }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Backup clinic"
                placeholder="Search clinics..."
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {backupLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Patient #4021" size="small" />
            <Chip label="Priority: Normal" size="small" variant="outlined" />
          </Box>

          <Button variant="contained" fullWidth onClick={() => setApplied(true)}>
            Apply clinics
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
