'use client';

/**
 * masked_input-mui-v2-T08: Serial code among three rows in dark compact panel
 *
 * Dark settings panel in the lower-right with compact spacing and high clutter.
 * Three masked serial-code rows: "Primary serial code" (SN-1024-8890),
 * "Backup serial code" (SN-1024-8800), and "Legacy serial code" (SN-9999-0001).
 * Each uses a size="small" TextField with pattern SN-####-#### and a row-local Save.
 *
 * Success: Backup serial code = "SN-1024-8896" saved; Primary and Legacy unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Divider,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const SerialMask = forwardRef<HTMLInputElement, MaskProps>(function SerialMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="SN-0000-0000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const INITIAL_PRIMARY = 'SN-1024-8890';
const INITIAL_BACKUP = 'SN-1024-8800';
const INITIAL_LEGACY = 'SN-9999-0001';

export default function T08({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [backupValue, setBackupValue] = useState(INITIAL_BACKUP);
  const [legacyValue, setLegacyValue] = useState(INITIAL_LEGACY);
  const [backupSaved, setBackupSaved] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      backupSaved &&
      backupValue === 'SN-1024-8896' &&
      primaryValue === INITIAL_PRIMARY &&
      legacyValue === INITIAL_LEGACY
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSaved, backupValue, primaryValue, legacyValue, onSuccess]);

  interface RowProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onSave?: () => void;
    saveDisabled?: boolean;
  }

  const SerialRow = ({ label, value, onChange, onSave, saveDisabled }: RowProps) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <TextField
        size="small"
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{ input: { inputComponent: SerialMask as any } }}
        sx={{
          flex: 1,
          '& .MuiInputBase-root': { color: '#fff' },
          '& .MuiInputLabel-root': { color: 'grey.400' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.700' },
        }}
      />
      <Button
        size="small"
        variant="contained"
        disabled={saveDisabled}
        onClick={onSave}
      >
        Save
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 400,
        bgcolor: '#1a1a1a',
        color: '#fff',
        borderRadius: 2,
        boxShadow: 8,
        p: 2,
      }}
    >
      <Card sx={{ bgcolor: 'transparent', color: 'inherit', boxShadow: 'none' }}>
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="subtitle2" gutterBottom>Device registration</Typography>

          <SerialRow
            label="Primary serial code"
            value={primaryValue}
            onChange={setPrimaryValue}
            saveDisabled
          />

          <Divider sx={{ borderColor: 'grey.800', my: 1 }} />

          <SerialRow
            label="Backup serial code"
            value={backupValue}
            onChange={(v) => { setBackupValue(v); setBackupSaved(false); }}
            onSave={() => setBackupSaved(true)}
          />

          <Divider sx={{ borderColor: 'grey.800', my: 1 }} />

          <SerialRow
            label="Legacy serial code"
            value={legacyValue}
            onChange={setLegacyValue}
            saveDisabled
          />
        </CardContent>
      </Card>
    </Box>
  );
}
