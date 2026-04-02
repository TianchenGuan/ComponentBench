'use client';

/**
 * masked_input-mui-T02: Clear SSN field
 * 
 * Baseline isolated card centered in the viewport titled "Tax profile".
 * It contains one masked MUI TextField labeled "SSN" (format ###-##-####) prefilled with "123-45-6789".
 * Inside the field on the right is a small icon button with aria-label "Clear SSN" that empties the field in one click.
 * No other masked inputs are on the page and there is no form submission requirement.
 * 
 * Success: The "SSN" masked input value is empty (zero characters).
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const SSNMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function SSNMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="000-00-0000"
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

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('123-45-6789');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Tax profile" />
      <CardContent>
        <TextField
          fullWidth
          label="SSN"
          placeholder="###-##-####"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: SSNMaskCustom as any,
              endAdornment: value && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear SSN"
                    onClick={handleClear}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          inputProps={{
            'data-testid': 'ssn-field',
          }}
        />
      </CardContent>
    </Card>
  );
}
