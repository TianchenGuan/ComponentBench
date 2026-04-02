'use client';

/**
 * text_input-mui-T06: Copy code from reference chip
 * 
 * Scene is an isolated card centered in the viewport titled "Redeem". At the top, a prominent MUI Chip
 * labeled "Reference code" displays the target string (e.g., "PX-17A9"). A second chip labeled "Old code"
 * shows a different string as a distractor. Below the chips is a single MUI TextField labeled "Code",
 * initially empty. There are no other text inputs or overlays; spacing is comfortable and component scale is default.
 * 
 * Success: The "Code" TextField value equals the reference chip text "PX-17A9" exactly (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const REFERENCE_CODE = 'PX-17A9';
const DISTRACTOR_CODE = 'OLD-0001';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === REFERENCE_CODE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Redeem
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Reference code
            </Typography>
            <Chip
              label={REFERENCE_CODE}
              color="primary"
              data-testid="ref-code"
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Old code
            </Typography>
            <Chip
              label={DISTRACTOR_CODE}
              variant="outlined"
              data-testid="old-code"
            />
          </Box>
        </Box>
        <TextField
          label="Code"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'code-input' }}
        />
      </CardContent>
    </Card>
  );
}
