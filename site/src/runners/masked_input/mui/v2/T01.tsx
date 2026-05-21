'use client';

/**
 * masked_input-mui-v2-T01: Emergency contact phone in left drawer with in-field apply
 *
 * A left-anchored MUI Drawer opened by an "Edit contacts" button contains two masked
 * US phone TextFields: "Primary contact phone" (pre-filled (718) 555-0100) and
 * "Emergency contact phone" (empty). Each has Apply (check) and Cancel (X) IconButtons
 * inside an end InputAdornment. A status line under each reads "Draft" until Apply is clicked.
 *
 * Success: Emergency contact phone = "(917) 555-0120" applied; Primary unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Button, Drawer, Typography, TextField, IconButton, InputAdornment,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMask = forwardRef<HTMLInputElement, MaskProps>(function PhoneMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const INITIAL_PRIMARY = '(718) 555-0100';

export default function T01({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [open, setOpen] = useState(false);

  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [primaryStatus, setPrimaryStatus] = useState<'Draft' | 'Applied'>('Draft');

  const [emergencyValue, setEmergencyValue] = useState('');
  const [emergencyStatus, setEmergencyStatus] = useState<'Draft' | 'Applied'>('Draft');

  useEffect(() => {
    if (successFired.current) return;
    if (
      emergencyStatus === 'Applied' &&
      emergencyValue === '(917) 555-0120' &&
      primaryValue === INITIAL_PRIMARY
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [emergencyStatus, emergencyValue, primaryValue, onSuccess]);

  const renderField = (
    label: string,
    value: string,
    status: string,
    onValueChange: (v: string) => void,
    onApply: () => void,
    onCancel: () => void,
  ) => (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        label={label}
        placeholder="(###) ###-####"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        slotProps={{
          input: {
            inputComponent: PhoneMask as any,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onApply} aria-label="Apply">
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onCancel} aria-label="Cancel">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">{status}</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        Edit contacts
      </Button>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 340, p: 2 }}>
          <Typography variant="h6" gutterBottom>Emergency contacts</Typography>

          {renderField(
            'Primary contact phone',
            primaryValue,
            primaryStatus,
            (v) => { setPrimaryValue(v); setPrimaryStatus('Draft'); },
            () => setPrimaryStatus('Applied'),
            () => { setPrimaryValue(INITIAL_PRIMARY); setPrimaryStatus('Draft'); },
          )}

          {renderField(
            'Emergency contact phone',
            emergencyValue,
            emergencyStatus,
            (v) => { setEmergencyValue(v); setEmergencyStatus('Draft'); },
            () => setEmergencyStatus('Applied'),
            () => { setEmergencyValue(''); setEmergencyStatus('Draft'); },
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
