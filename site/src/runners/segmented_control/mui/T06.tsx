'use client';

/**
 * segmented_control-mui-T06: Sensor B mode → Manual (table)
 *
 * Layout: table cell interaction in a monitoring dashboard.
 * A Material UI Table lists three rows:
 * - Sensor A
 * - Sensor B
 * - Sensor C
 *
 * The "Mode" column contains a ToggleButtonGroup (exclusive) in each row with two options:
 * "Auto" and "Manual".
 *
 * Initial states:
 * - Sensor A: Auto
 * - Sensor B: Auto
 * - Sensor C: Manual
 *
 * Clutter (medium): the table header has a search field and a "Refresh" icon button; these are distractors.
 * Mode changes apply immediately; there is no Save button.
 *
 * Success: In row "Sensor B", the Mode ToggleButtonGroup selected value = Manual.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, IconButton, ToggleButton, ToggleButtonGroup, Box
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskComponentProps } from '../types';

const modeOptions = ['Auto', 'Manual'];

interface Sensor {
  key: string;
  name: string;
  mode: string;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [sensors, setSensors] = useState<Sensor[]>([
    { key: 'a', name: 'Sensor A', mode: 'Auto' },
    { key: 'b', name: 'Sensor B', mode: 'Auto' },
    { key: 'c', name: 'Sensor C', mode: 'Manual' },
  ]);

  const handleModeChange = (key: string) => (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSensors(prev => prev.map(s => s.key === key ? { ...s, mode: value } : s));
      if (key === 'b' && value === 'Manual') {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Sensors</Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField size="small" placeholder="Search sensors..." sx={{ flexGrow: 1 }} />
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Sensor</TableCell>
                <TableCell>Mode</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sensors.map(sensor => (
                <TableRow key={sensor.key}>
                  <TableCell>{sensor.name}</TableCell>
                  <TableCell>
                    <ToggleButtonGroup
                      data-testid={`mode-${sensor.key}`}
                      data-canonical-type="segmented_control"
                      data-selected-value={sensor.mode}
                      value={sensor.mode}
                      exclusive
                      onChange={handleModeChange(sensor.key)}
                      aria-label={`${sensor.name} mode`}
                      size="small"
                    >
                      {modeOptions.map(option => (
                        <ToggleButton key={option} value={option} aria-label={option}>
                          {option}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
