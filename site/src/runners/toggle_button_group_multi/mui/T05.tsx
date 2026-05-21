'use client';

/**
 * toggle_button_group_multi-mui-T15: Match connectivity toggles to reference
 *
 * Layout: isolated_card centered in the viewport.
 *
 * The page shows two cards:
 * 1) "Connectivity" (interactive)
 *    - Contains a MUI ToggleButtonGroup (multiple selection) with five icon-only ToggleButtons.
 *    - Each button has an accessible name/tooltip: Wi‑Fi, Bluetooth, NFC, GPS, Airplane mode.
 *    - Icons are visually similar in size and appear without text labels (tooltips appear on hover).
 *    - Initial state: Wi‑Fi and Bluetooth are selected.
 *
 * 2) "Reference" (non-interactive)
 *    - Displays a small static preview row indicating which connectivity icons should be active.
 *
 * No Apply/Save step; selection changes apply immediately.
 * Clutter=low due to the extra reference card.
 *
 * Success: Selected options equal exactly: Wi‑Fi, NFC, GPS
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WifiIcon from '@mui/icons-material/Wifi';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import NfcIcon from '@mui/icons-material/Nfc';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import type { TaskComponentProps } from '../types';

const TARGET_SET = new Set(['Wi‑Fi', 'NFC', 'GPS']);
const REFERENCE_SET = new Set(['Wi‑Fi', 'NFC', 'GPS']);

const OPTIONS = [
  { value: 'Wi‑Fi', icon: WifiIcon },
  { value: 'Bluetooth', icon: BluetoothIcon },
  { value: 'NFC', icon: NfcIcon },
  { value: 'GPS', icon: GpsFixedIcon },
  { value: 'Airplane mode', icon: AirplanemodeActiveIcon },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Wi‑Fi', 'Bluetooth']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Connectivity
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Match the Reference (Wi‑Fi + NFC + GPS).
          </Typography>

          <ToggleButtonGroup
            value={selected}
            onChange={handleChange}
            aria-label="connectivity options"
            data-testid="connectivity-group"
          >
            {OPTIONS.map(({ value, icon: Icon }) => (
              <Tooltip key={value} title={value}>
                <ToggleButton 
                  value={value} 
                  aria-label={value}
                  data-testid={`conn-${value.toLowerCase().replace(/[‑\s]/g, '-')}`}
                >
                  <Icon />
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      <Card sx={{ width: 280 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reference
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Target connectivity state:
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {OPTIONS.map(({ value, icon: Icon }) => (
              <Box
                key={value}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  bgcolor: REFERENCE_SET.has(value) ? 'success.main' : 'grey.200',
                  color: REFERENCE_SET.has(value) ? 'white' : 'grey.500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon fontSize="small" />
              </Box>
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            (Reference - not interactive)
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
