'use client';

/**
 * masked_input-mui-v2-T03: License key offscreen in nested settings panel
 *
 * Dark nested-scroll layout with high clutter. An outer page scroll has summary cards and
 * logs while an inner "Licensing" panel has its own scrollbar containing two masked
 * license-key fields (AAAA-AAAA-AAAA), toggles, and helper blocks. Primary starts as
 * ABCD-EF12-GH34; Backup starts empty and is initially below the fold.
 * A "Save licensing" button commits the inner panel state.
 *
 * Success: Backup license key = "QWER-TY12-ZX90" saved; Primary unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Switch,
  FormControlLabel, Alert,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const LicenseMask = forwardRef<HTMLInputElement, MaskProps>(function LicenseMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="****-****-****"
      definitions={{ '*': /[A-Za-z0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) =>
        onChange({ target: { name: props.name, value: value.toUpperCase() } })
      }
      overwrite
    />
  );
});

const INITIAL_PRIMARY = 'ABCD-EF12-GH34';

export default function T03({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [backupValue, setBackupValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && backupValue === 'QWER-TY12-ZX90' && primaryValue === INITIAL_PRIMARY) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, backupValue, primaryValue, onSuccess]);

  return (
    <Box sx={{ bgcolor: '#121212', color: '#fff', minHeight: '100vh', p: 2 }}>
      {/* Outer page filler */}
      <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2">System overview</Typography>
          <Typography variant="body2" color="grey.400">Server uptime: 99.98% — Last deploy: 2 hours ago</Typography>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#1e1e1e', color: '#fff', mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2">Audit log</Typography>
          {['Config updated', 'License checked', 'Backup verified', 'User login'].map((e) => (
            <Typography key={e} variant="body2" color="grey.500">• {e}</Typography>
          ))}
        </CardContent>
      </Card>

      {/* Inner licensing panel with own scroll */}
      <Card sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Licensing</Typography>
          <Box sx={{ maxHeight: 260, overflowY: 'auto', pr: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Primary license key"
              value={primaryValue}
              onChange={(e) => { setPrimaryValue(e.target.value); setSaved(false); }}
              slotProps={{ input: { inputComponent: LicenseMask as any } }}
              sx={{ mb: 2, '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'grey.400' } }}
            />

            <FormControlLabel
              control={<Switch size="small" defaultChecked />}
              label={<Typography variant="body2" color="grey.300">Auto-renew</Typography>}
              sx={{ mb: 1, display: 'block' }}
            />
            <Alert severity="info" sx={{ mb: 2, bgcolor: '#263238', color: '#b3e5fc' }}>
              Licenses are validated nightly. Keep backup keys up to date.
            </Alert>
            <FormControlLabel
              control={<Switch size="small" />}
              label={<Typography variant="body2" color="grey.300">Offline mode</Typography>}
              sx={{ mb: 1, display: 'block' }}
            />
            <Typography variant="caption" color="grey.500" sx={{ display: 'block', mb: 2 }}>
              Offline mode allows 72-hour grace period without server contact.
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Backup license key"
              placeholder="XXXX-XXXX-XXXX"
              value={backupValue}
              onChange={(e) => { setBackupValue(e.target.value); setSaved(false); }}
              slotProps={{ input: { inputComponent: LicenseMask as any } }}
              sx={{ mb: 2, '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'grey.400' } }}
            />
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={() => setSaved(true)}
            sx={{ mt: 1 }}
          >
            Save licensing
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
