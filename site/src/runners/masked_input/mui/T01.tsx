'use client';

/**
 * masked_input-mui-T01: Enter contact phone number
 * 
 * Baseline isolated card centered in the viewport titled "Profile".
 * It contains a single MUI TextField labeled "Contact phone" using a US phone mask with placeholder "(###) ###-####".
 * The mask inserts parentheses, space, and dash automatically and blocks non-digit characters in digit slots.
 * The field starts empty; there are no other masked inputs or required submit actions.
 * 
 * Success: The "Contact phone" masked input value equals "(212) 555-0198".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField, InputBaseComponentProps } from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const PhoneMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function PhoneMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(000) 000-0000"
        definitions={{
          '0': /[0-9]/,
        }}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '(212) 555-0198') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Profile" />
      <CardContent>
        <TextField
          fullWidth
          label="Contact phone"
          placeholder="(###) ###-####"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: PhoneMaskCustom as any,
            },
          }}
          inputProps={{
            'data-testid': 'contact-phone',
          }}
        />
      </CardContent>
    </Card>
  );
}
