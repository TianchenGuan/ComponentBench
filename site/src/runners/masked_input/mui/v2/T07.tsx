'use client';

/**
 * masked_input-mui-v2-T07: Backup VAT field offscreen in compact tax panel
 *
 * A scrollable "Tax IDs" settings panel with compact spacing and high clutter from
 * toggles, captions, and status alerts. Two masked VAT ID rows separated by other
 * controls. Mask pattern is AA-####-##. Primary starts as EU-1024-11; Backup is below
 * the fold and starts empty. Each row has its own Save button, disabled until complete.
 *
 * Success: Backup VAT ID = "EU-2048-77" saved; Primary unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Switch,
  FormControlLabel, Alert, Divider,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const VatMask = forwardRef<HTMLInputElement, MaskProps>(function VatMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="AA-0000-00"
      definitions={{ 'A': /[A-Za-z]/, '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) =>
        onChange({ target: { name: props.name, value: value.toUpperCase() } })
      }
      overwrite
    />
  );
});

const INITIAL_PRIMARY = 'EU-1024-11';

function isComplete(v: string) {
  return /^[A-Z]{2}-\d{4}-\d{2}$/.test(v);
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [backupValue, setBackupValue] = useState('');
  const [backupSaved, setBackupSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (backupSaved && backupValue === 'EU-2048-77' && primaryValue === INITIAL_PRIMARY) {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSaved, backupValue, primaryValue, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 420 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Tax IDs</Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
            {/* Primary VAT row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                label="Primary VAT ID"
                value={primaryValue}
                onChange={(e) => setPrimaryValue(e.target.value)}
                slotProps={{ input: { inputComponent: VatMask as any } }}
                sx={{ flex: 1 }}
              />
              <Button size="small" variant="outlined" disabled>Save</Button>
            </Box>

            {/* Clutter between rows */}
            <FormControlLabel
              control={<Switch size="small" defaultChecked />}
              label={<Typography variant="body2">Auto-validate tax entries</Typography>}
              sx={{ display: 'block', mb: 1 }}
            />
            <Alert severity="warning" sx={{ mb: 1 }}>
              Backup VAT ID is required for cross-border compliance.
            </Alert>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Tax IDs are verified against the EU VIES database nightly.
            </Typography>
            <FormControlLabel
              control={<Switch size="small" />}
              label={<Typography variant="body2">Exempt from withholding</Typography>}
              sx={{ display: 'block', mb: 1 }}
            />
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Ensure backup identifiers match the registered entity before saving.
            </Typography>

            {/* Backup VAT row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                size="small"
                label="Backup VAT ID"
                placeholder="AA-####-##"
                value={backupValue}
                onChange={(e) => { setBackupValue(e.target.value); setBackupSaved(false); }}
                slotProps={{ input: { inputComponent: VatMask as any } }}
                sx={{ flex: 1 }}
              />
              <Button
                size="small"
                variant="contained"
                disabled={!isComplete(backupValue)}
                onClick={() => setBackupSaved(true)}
              >
                Save
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
