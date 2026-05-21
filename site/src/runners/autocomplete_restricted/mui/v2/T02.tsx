'use client';

/**
 * autocomplete_restricted-mui-v2-T02
 *
 * Settings panel with a restricted MUI Autocomplete for "Manager".
 * clearOnBlur=false so filter text can persist without an actual selection.
 * Near-duplicate names: Dana Wu, Daniel Wu, Dina Wu, Dana Xu.
 * Success: Manager = "Dana Wu" committed, Apply assignment clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { TaskComponentProps } from '../../types';

const managerOptions = ['Dana Wu', 'Daniel Wu', 'Dina Wu', 'Dana Xu'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [manager, setManager] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && manager === 'Dana Wu') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, manager, onSuccess]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', p: 3, minHeight: '70vh' }}>
      <Paper sx={{ p: 2, width: 380 }}>
        <Typography variant="h6" gutterBottom>Assignment</Typography>

        <Chip label="Team: Engineering" size="small" sx={{ mb: 1 }} />
        <Chip label="Sprint 24" size="small" sx={{ ml: 1, mb: 1 }} />
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
          Select the responsible manager for this escalation path.
        </Typography>
        <Divider sx={{ my: 1 }} />

        <Autocomplete
          size="small"
          options={managerOptions}
          value={manager}
          onChange={(_, v) => { setManager(v); setApplied(false); }}
          clearOnBlur={false}
          freeSolo={false}
          renderInput={(params) => <TextField {...params} label="Manager" placeholder="Type to search" />}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" size="small" onClick={() => setApplied(true)}>
          Apply assignment
        </Button>
      </Paper>
    </Box>
  );
}
