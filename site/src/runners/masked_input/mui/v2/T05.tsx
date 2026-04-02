'use client';

/**
 * masked_input-mui-v2-T05: Reference badge copied into secondary employee ID
 *
 * Dark dashboard panel (top-right). A card titled "Staff IDs" contains a bold badge
 * showing "EMP-2048" and two masked TextFields: "Primary employee ID" (EMP-1024) and
 * "Secondary employee ID" (empty). Mask pattern is EMP-#### (digits only after prefix).
 * A card-level "Apply IDs" button commits.
 *
 * Success: Secondary employee ID = "EMP-2048" applied; Primary unchanged.
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Chip,
} from '@mui/material';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

interface MaskProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const EmpIdMask = forwardRef<HTMLInputElement, MaskProps>(function EmpIdMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="EMP-0000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const INITIAL_PRIMARY = 'EMP-1024';

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryValue, setPrimaryValue] = useState(INITIAL_PRIMARY);
  const [secondaryValue, setSecondaryValue] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && secondaryValue === 'EMP-2048' && primaryValue === INITIAL_PRIMARY) {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, secondaryValue, primaryValue, onSuccess]);

  return (
    <Box sx={{ position: 'fixed', top: 24, right: 24, width: 340, bgcolor: '#1e1e1e', color: '#fff', borderRadius: 2, boxShadow: 6 }}>
      <Card sx={{ bgcolor: 'transparent', color: 'inherit', boxShadow: 'none' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Staff IDs</Typography>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="grey.400">Reference badge:</Typography>
            <Chip
              label="EMP-2048"
              color="primary"
              sx={{ fontWeight: 700, fontSize: '0.95rem' }}
            />
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Primary employee ID"
            value={primaryValue}
            onChange={(e) => { setPrimaryValue(e.target.value); setApplied(false); }}
            slotProps={{ input: { inputComponent: EmpIdMask as any } }}
            sx={{ mb: 2, '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'grey.400' } }}
          />

          <TextField
            fullWidth
            size="small"
            label="Secondary employee ID"
            placeholder="EMP-####"
            value={secondaryValue}
            onChange={(e) => { setSecondaryValue(e.target.value); setApplied(false); }}
            slotProps={{ input: { inputComponent: EmpIdMask as any } }}
            sx={{ mb: 2, '& .MuiInputBase-root': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'grey.400' } }}
          />

          <Button variant="contained" size="small" onClick={() => setApplied(true)}>
            Apply IDs
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
