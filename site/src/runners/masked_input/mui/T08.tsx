'use client';

/**
 * masked_input-mui-T08: Enter long license key in compact form
 * 
 * Compact spacing mode isolated card centered in the viewport titled "Activation".
 * The card contains one masked MUI TextField labeled "Software license key".
 * The mask enforces four groups of five uppercase alphanumeric characters separated by dashes (AAAAA-AAAAA-AAAAA-AAAAA).
 * The field starts empty and is narrow enough that the full value may not be visible at once without horizontal caret movement, but the input scrolls internally as you type.
 * 
 * Success: The "Software license key" masked input value equals "K9F2A-7P3Q1-MN8Z0-2W5D9".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const LicenseKeyMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function LicenseKeyMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="AAAAA-AAAAA-AAAAA-AAAAA"
        definitions={{
          'A': /[A-Za-z0-9]/,
        }}
        prepare={(str: string) => str.toUpperCase()}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'K9F2A-7P3Q1-MN8Z0-2W5D9') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 340 }}>
      <CardHeader 
        title="Activation" 
        titleTypographyProps={{ variant: 'subtitle1' }}
        sx={{ py: 1 }}
      />
      <CardContent sx={{ pt: 0, pb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Software license key"
          placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: LicenseKeyMaskCustom as any,
            },
          }}
          inputProps={{
            'data-testid': 'license-key',
            style: { fontFamily: 'monospace', fontSize: 12 },
          }}
        />
      </CardContent>
    </Card>
  );
}
