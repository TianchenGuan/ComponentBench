'use client';

/**
 * masked_input-mui-v2-T06: Raw mode account digits in compact inline surface
 *
 * A compact payout strip near the bottom-left with high contrast. A single masked
 * account-number TextField with a two-state toggle ("Formatted" / "Raw"). In Formatted
 * mode digits are grouped with spaces (0000 0000 0000); in Raw mode digits are
 * contiguous (000000000000). End InputAdornment has Apply (check) and Cancel (X) icons.
 *
 * Success: raw_mode = true, Account number = "000012345678" applied.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Typography, TextField, IconButton, InputAdornment, ToggleButtonGroup,
  ToggleButton, Chip,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  mask: string;
}

const AccountMask = forwardRef<HTMLInputElement, MaskProps>(function AccountMask(props, ref) {
  const { onChange, mask, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask={mask}
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [rawMode, setRawMode] = useState(false);
  const [value, setValue] = useState('');
  const [applied, setApplied] = useState(false);

  const activeMask = rawMode ? '000000000000' : '0000 0000 0000';

  useEffect(() => {
    if (successFired.current) return;
    if (applied && rawMode && value === '000012345678') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, rawMode, value, onSuccess]);

  const handleModeChange = (_: unknown, mode: string | null) => {
    if (!mode) return;
    const newRaw = mode === 'raw';
    setRawMode(newRaw);
    setValue((prev) => prev.replace(/\s/g, ''));
    setApplied(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        width: 340,
        bgcolor: '#000',
        color: '#fff',
        borderRadius: 2,
        boxShadow: 6,
        p: 2,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Payout strip</Typography>
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
        <Chip label="USD" size="small" variant="outlined" sx={{ color: '#fff', borderColor: 'grey.600' }} />
        <Chip label="Wire" size="small" variant="outlined" sx={{ color: '#fff', borderColor: 'grey.600' }} />
      </Box>

      <ToggleButtonGroup
        value={rawMode ? 'raw' : 'formatted'}
        exclusive
        onChange={handleModeChange}
        size="small"
        sx={{ mb: 1.5 }}
      >
        <ToggleButton value="formatted" sx={{ color: '#ccc', '&.Mui-selected': { color: '#fff', bgcolor: 'grey.800' } }}>
          Formatted
        </ToggleButton>
        <ToggleButton value="raw" sx={{ color: '#ccc', '&.Mui-selected': { color: '#fff', bgcolor: 'grey.800' } }}>
          Raw
        </ToggleButton>
      </ToggleButtonGroup>

      <TextField
        fullWidth
        size="small"
        label="Account number"
        placeholder={rawMode ? '000000000000' : '0000 0000 0000'}
        value={value}
        onChange={(e) => { setValue(e.target.value); setApplied(false); }}
        slotProps={{
          input: {
            inputComponent: AccountMask as any,
            inputProps: { mask: activeMask },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setApplied(true)} aria-label="Apply">
                  <CheckIcon fontSize="small" sx={{ color: '#fff' }} />
                </IconButton>
                <IconButton size="small" onClick={() => { setValue(''); setApplied(false); }} aria-label="Cancel">
                  <CloseIcon fontSize="small" sx={{ color: '#fff' }} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'grey.400' } }}
      />

      <Typography variant="caption" color="grey.500" sx={{ mt: 0.5, display: 'block' }}>
        {applied ? 'Applied' : 'Draft'} · {rawMode ? 'Raw' : 'Formatted'}
      </Typography>
    </Box>
  );
}
