'use client';

/**
 * masked_input-mui-T04: Set billing phone among two fields
 * 
 * Isolated card positioned near the bottom-left of the viewport titled "Order contact numbers".
 * Two masked MUI TextFields are shown with identical US phone formatting:
 * - "Shipping phone" is prefilled with "(917) 555-0104".
 * - "Billing phone" starts empty.
 * Both fields use the same placeholder "(###) ###-####" and look similar. No Save button is required; completion is based on the Billing phone value.
 * 
 * Success: The masked input instance labeled "Billing phone" equals "(646) 555-0199".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField, Box } from '@mui/material';
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

export default function T04({ onSuccess }: TaskComponentProps) {
  const [shippingPhone] = useState('(917) 555-0104');
  const [billingPhone, setBillingPhone] = useState('');

  useEffect(() => {
    if (billingPhone === '(646) 555-0199') {
      onSuccess();
    }
  }, [billingPhone, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Order contact numbers" />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Shipping phone"
            placeholder="(###) ###-####"
            value={shippingPhone}
            slotProps={{
              input: {
                inputComponent: PhoneMaskCustom as any,
                readOnly: true,
              },
            }}
            inputProps={{
              'data-testid': 'shipping-phone',
            }}
            sx={{ '& .MuiInputBase-root': { backgroundColor: '#f5f5f5' } }}
          />
          <TextField
            fullWidth
            label="Billing phone"
            placeholder="(###) ###-####"
            value={billingPhone}
            onChange={(e) => setBillingPhone(e.target.value)}
            slotProps={{
              input: {
                inputComponent: PhoneMaskCustom as any,
              },
            }}
            inputProps={{
              'data-testid': 'billing-phone',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
