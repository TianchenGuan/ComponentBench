'use client';

/**
 * masked_input-mui-T07: Open drawer and enter expiry
 * 
 * Drawer flow: the main page shows a button labeled "Add payment method".
 * Clicking it opens a right-side drawer containing a single masked MUI TextField labeled "Expiration (MM/YY)".
 * The mask enforces two digits, a slash, then two digits; the placeholder is "__/__". The field starts empty.
 * The drawer has a close icon in the header, but no Save/Submit button is required for task completion.
 * 
 * Success: The "Expiration (MM/YY)" masked input in the drawer equals "04/31".
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { 
  Button, Drawer, Box, Typography, TextField, IconButton, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const ExpiryMaskCustom = forwardRef<HTMLInputElement, CustomProps>(
  function ExpiryMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00/00"
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

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '04/31') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Button variant="contained" onClick={() => setIsOpen(true)}>
        Add payment method
      </Button>
      
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Add payment method</Typography>
            <IconButton onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <TextField
            fullWidth
            label="Expiration (MM/YY)"
            placeholder="__/__"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            slotProps={{
              input: {
                inputComponent: ExpiryMaskCustom as any,
              },
            }}
            inputProps={{
              'data-testid': 'expiry-drawer-input',
            }}
          />
        </Box>
      </Drawer>
    </div>
  );
}
