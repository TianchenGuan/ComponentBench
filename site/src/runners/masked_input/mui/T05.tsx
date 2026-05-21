'use client';

/**
 * masked_input-mui-T05: Match MAC address from reference chip
 * 
 * Dark theme isolated card centered in the viewport titled "Network adapter".
 * A prominent filled chip displays the target MAC address (e.g., "A1:B2:C3:D4:E5:F6").
 * Below it is one masked MUI TextField labeled "MAC address" with the placeholder "AA:AA:AA:AA:AA:AA".
 * The mask enforces hex characters (0-9, A-F) and inserts colons automatically; letters are uppercased. No apply/submit step is required.
 * 
 * Success: The "MAC address" masked input equals "A1:B2:C3:D4:E5:F6".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { Card, CardContent, CardHeader, TextField, Chip, Box, Typography } from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const MACMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function MACMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="HH:HH:HH:HH:HH:HH"
        definitions={{
          'H': /[0-9A-Fa-f]/,
        }}
        prepare={(str: string) => str.toUpperCase()}
        inputRef={ref}
        onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  }
);

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const targetMAC = 'A1:B2:C3:D4:E5:F6';

  useEffect(() => {
    if (value === targetMAC) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400, bgcolor: '#1f1f1f' }}>
      <CardHeader 
        title="Network adapter" 
        sx={{ color: '#fff', borderBottom: '1px solid #303030' }}
      />
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
            Reference chip:
          </Typography>
          <Chip 
            label={targetMAC}
            color="primary"
            data-testid="reference-chip"
            sx={{ 
              fontSize: 18, 
              fontFamily: 'monospace', 
              fontWeight: 600,
              py: 2,
              px: 1,
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="MAC address"
          placeholder="AA:AA:AA:AA:AA:AA"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          slotProps={{
            input: {
              inputComponent: MACMaskCustom as any,
            },
          }}
          inputProps={{
            'data-testid': 'mac-address',
            style: { fontFamily: 'monospace' },
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: '#141414',
              color: '#fff',
            },
            '& .MuiInputLabel-root': {
              color: '#888',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#434343',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
