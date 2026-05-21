'use client';

/**
 * meter-mui-T04: Set Memory Headroom meter in form (MUI)
 *
 * Setup Description:
 * A form_section labeled "Capacity Settings" contains several inputs and two headroom meters.
 * - Layout: form_section (left-aligned labels, grouped fields).
 * - Clutter: low (a couple of text fields and dropdowns are visible but irrelevant).
 * - Component: two MUI LinearProgress meters in determinate mode.
 * - Spacing/scale: comfortable, default.
 * - Instances: 2 meters labeled "CPU Headroom" and "Memory Headroom".
 * - Initial state: CPU Headroom=55%, Memory Headroom=70%.
 * - Interaction: click on the meter bar to set value; a small percent label appears to the right of each bar.
 * - Feedback: immediate; no Apply/Save.
 *
 * Success: Memory Headroom meter value is 30% (±2 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [cpuHeadroom, setCpuHeadroom] = useState(55);
  const [memoryHeadroom, setMemoryHeadroom] = useState(70);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(memoryHeadroom - 30) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [memoryHeadroom, onSuccess]);

  const handleCpuClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setCpuHeadroom(Math.max(0, Math.min(100, percent)));
  };

  const handleMemoryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setMemoryHeadroom(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 500 }}>
      <Typography variant="h6" gutterBottom>
        Capacity Settings
      </Typography>

      {/* Distractor fields */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Instance name"
          defaultValue="prod-instance-01"
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>Region</InputLabel>
          <Select defaultValue="us-east-1" label="Region">
            <MenuItem value="us-east-1">US East 1</MenuItem>
            <MenuItem value="us-west-2">US West 2</MenuItem>
            <MenuItem value="eu-west-1">EU West 1</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* CPU Headroom meter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          CPU Headroom
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            onClick={handleCpuClick}
            sx={{ flex: 1, cursor: 'pointer' }}
            data-testid="mui-meter-cpu"
            data-instance-label="CPU Headroom"
            data-meter-value={cpuHeadroom}
            role="meter"
            aria-valuenow={cpuHeadroom}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="CPU Headroom"
          >
            <LinearProgress variant="determinate" value={cpuHeadroom} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
            {cpuHeadroom}%
          </Typography>
        </Box>
      </Box>

      {/* Memory Headroom meter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          Memory Headroom
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            onClick={handleMemoryClick}
            sx={{ flex: 1, cursor: 'pointer' }}
            data-testid="mui-meter-memory"
            data-instance-label="Memory Headroom"
            data-meter-value={memoryHeadroom}
            role="meter"
            aria-valuenow={memoryHeadroom}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Memory Headroom"
          >
            <LinearProgress variant="determinate" value={memoryHeadroom} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
            {memoryHeadroom}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
