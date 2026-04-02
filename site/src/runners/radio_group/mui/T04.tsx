'use client';

/**
 * radio_group-mui-T04: Addresses: set Billing address type to Company (two groups)
 *
 * A centered isolated card titled "Addresses" contains two separate MUI RadioGroups rendered in the same style and aligned side-by-side.
 * Left column: "Billing address type" with options Personal, Company.
 * Right column: "Shipping address type" with options Personal, Company.
 * Initial state: Billing = Personal; Shipping = Personal.
 * There are no Save buttons; changing a group updates a small chip under that group immediately.
 * Because both groups share the same options and layout, the main challenge is selecting the correct instance by its label.
 *
 * Success: For the instance labeled "Billing address type", the selected value equals "company" (label "Company").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Box, Chip
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [billing, setBilling] = useState<string>('personal');
  const [shipping, setShipping] = useState<string>('personal');

  const handleBillingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBilling(value);
    if (value === 'company') {
      onSuccess();
    }
  };

  const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShipping(event.target.value);
  };

  return (
    <Card sx={{ width: 480 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Addresses</Typography>
        
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Billing address type */}
          <Box data-instance="Billing address type">
            <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={billing}>
              <FormLabel component="legend">Billing address type</FormLabel>
              <RadioGroup value={billing} onChange={handleBillingChange}>
                <FormControlLabel value="personal" control={<Radio />} label="Personal" />
                <FormControlLabel value="company" control={<Radio />} label="Company" />
              </RadioGroup>
            </FormControl>
            <Chip 
              label={billing === 'personal' ? 'Personal' : 'Company'} 
              size="small" 
              sx={{ mt: 1 }}
              color={billing === 'company' ? 'primary' : 'default'}
            />
          </Box>

          {/* Shipping address type */}
          <Box data-instance="Shipping address type">
            <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={shipping}>
              <FormLabel component="legend">Shipping address type</FormLabel>
              <RadioGroup value={shipping} onChange={handleShippingChange}>
                <FormControlLabel value="personal" control={<Radio />} label="Personal" />
                <FormControlLabel value="company" control={<Radio />} label="Company" />
              </RadioGroup>
            </FormControl>
            <Chip 
              label={shipping === 'personal' ? 'Personal' : 'Company'} 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
