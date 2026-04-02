'use client';

/**
 * masked_input-mui-T03: Enter Canadian postal code
 * 
 * Baseline isolated card centered in the viewport titled "Address".
 * It contains one masked MUI TextField labeled "Postal code (Canada)" with the format A1A 1A1 (letter-digit-letter space digit-letter-digit).
 * The field auto-capitalizes letters and enforces a single space in the middle.
 * The field starts empty; no other masked inputs exist and no submit action is required.
 * 
 * Success: The "Postal code (Canada)" masked input value equals "K1A 0B1".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PostalCodeMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function PostalCodeMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="a0a 0a0"
        definitions={{
          'a': /[A-Za-z]/,
          '0': /[0-9]/,
        }}
        prepare={(str: string) => str.toUpperCase()}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'K1A 0B1') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Address" />
      <CardContent>
        <TextField
          fullWidth
          label="Postal code (Canada)"
          placeholder="A1A 1A1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: PostalCodeMaskCustom as any,
            },
          }}
          inputProps={{
            'data-testid': 'postal-code',
          }}
        />
      </CardContent>
    </Card>
  );
}
