'use client';

/**
 * number_input_spinbutton-mui-T09: Visual: match Secondary quota to target badge
 * 
 * A dashboard panel is anchored near the bottom-left of the viewport (non-centered placement).
 * At the top of the panel there is a prominent badge labeled "Target quota" showing a number.
 * Below are three MUI Number Field inputs (3 instances) with labels:
 * - Primary quota — initial value 5
 * - Secondary quota — initial value 10 (TARGET)
 * - Tertiary quota — initial value 15
 * All use step=1, min=0, max=100 and show increment/decrement buttons.
 * High clutter: the panel also contains a small chart, two filter chips, and an "Export" button, but none affect success. No Apply button is required.
 * 
 * Success: The numeric value of the target number input (Secondary quota) matches the value shown in the reference element ("Target quota badge").
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, CardContent, TextField, Typography, Box, Chip, Button, 
  IconButton, InputAdornment, Badge
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  // Random target value for the badge (between 25 and 75)
  const targetValue = useMemo(() => Math.floor(Math.random() * 51) + 25, []);
  
  const [primaryQuota, setPrimaryQuota] = useState<number>(5);
  const [secondaryQuota, setSecondaryQuota] = useState<number>(10);
  const [tertiaryQuota, setTertiaryQuota] = useState<number>(15);

  useEffect(() => {
    if (secondaryQuota === targetValue) {
      onSuccess();
    }
  }, [secondaryQuota, targetValue, onSuccess]);

  const QuotaField = ({ 
    label, 
    value, 
    onChange, 
    testId 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void; 
    testId: string;
  }) => (
    <TextField
      label={label}
      type="number"
      size="small"
      fullWidth
      value={value}
      onChange={(e) => {
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v >= 0 && v <= 100) {
          onChange(v);
        }
      }}
      inputProps={{ 
        min: 0, 
        max: 100, 
        step: 1,
        'data-testid': testId
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton 
              size="small" 
              onClick={() => onChange(Math.max(value - 1, 0))}
              disabled={value <= 0}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton 
              size="small" 
              onClick={() => onChange(Math.min(value + 1, 100))}
              disabled={value >= 100}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Quota Dashboard</Typography>
          <Chip 
            label={`Target quota: ${targetValue}`}
            color="primary"
            data-testid="target-quota-badge"
          />
        </Box>

        {/* Clutter: mini chart */}
        <Box sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 30 }}>
            {[40, 60, 35, 80, 55, 70, 45, 65, 50, 75].map((h, i) => (
              <Box 
                key={i} 
                sx={{ 
                  width: 12, 
                  height: h * 0.3, 
                  bgcolor: 'primary.light', 
                  borderRadius: 0.5 
                }} 
              />
            ))}
          </Box>
        </Box>

        {/* Clutter: filter chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label="This week" size="small" />
          <Chip label="Active" size="small" variant="outlined" />
          <Button 
            size="small" 
            startIcon={<FileDownloadIcon />}
            variant="outlined"
          >
            Export
          </Button>
        </Box>

        <QuotaField 
          label="Primary quota" 
          value={primaryQuota} 
          onChange={setPrimaryQuota}
          testId="primary-quota-input"
        />
        <QuotaField 
          label="Secondary quota" 
          value={secondaryQuota} 
          onChange={setSecondaryQuota}
          testId="secondary-quota-input"
        />
        <QuotaField 
          label="Tertiary quota" 
          value={tertiaryQuota} 
          onChange={setTertiaryQuota}
          testId="tertiary-quota-input"
        />
      </CardContent>
    </Card>
  );
}
