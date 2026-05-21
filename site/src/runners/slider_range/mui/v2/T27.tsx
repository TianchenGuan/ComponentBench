'use client';

/**
 * slider_range-mui-v2-T27: Comfort zone minimum distance + sibling Humidity; Apply panel
 *
 * Comfort zone: disableSwap, 10-unit minimum gap in onChange. Humidity range sibling.
 * Success: committed Comfort 25–40, Humidity 30–60, Apply panel clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const MIN_GAP = 10;

export default function T27({ onSuccess }: TaskComponentProps) {
  const [draftComfort, setDraftComfort] = useState<number[]>([20, 37]);
  const [draftHumidity, setDraftHumidity] = useState<number[]>([30, 60]);
  const [committedComfort, setCommittedComfort] = useState<number[]>([20, 37]);
  const [committedHumidity, setCommittedHumidity] = useState<number[]>([30, 60]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committedComfort[0] === 25 &&
      committedComfort[1] === 40 &&
      committedHumidity[0] === 30 &&
      committedHumidity[1] === 60
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedComfort, committedHumidity, onSuccess]);

  const handleComfortChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;
    if (activeThumb === 0) {
      setDraftComfort([Math.min(newValue[0], draftComfort[1] - MIN_GAP), draftComfort[1]]);
    } else {
      setDraftComfort([draftComfort[0], Math.max(newValue[1], draftComfort[0] + MIN_GAP)]);
    }
  };

  const handleApply = () => {
    setCommittedComfort([...draftComfort]);
    setCommittedHumidity([...draftHumidity]);
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 440 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Environment
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          HVAC preferences (draft until you apply)
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          <TextField size="small" label="Zone ID" defaultValue="west-3b" />
          <FormControlLabel control={<Switch defaultChecked size="small" />} label="Eco mode" />
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Comfort zone (°C)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Minimum gap: 10°
        </Typography>
        <Box sx={{ px: 1, mb: 2 }}>
          <Slider
            value={draftComfort}
            onChange={handleComfortChange}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            disableSwap
            data-testid="comfort-zone-range"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Humidity range (%)
        </Typography>
        <Box sx={{ px: 1, mb: 2 }}>
          <Slider
            value={draftHumidity}
            onChange={(_e, v) => setDraftHumidity(v as number[])}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            data-testid="humidity-range"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Selected · Comfort: {draftComfort[0]} – {draftComfort[1]} · Humidity: {draftHumidity[0]} –{' '}
          {draftHumidity[1]}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Committed · Comfort: {committedComfort[0]} – {committedComfort[1]} · Humidity: {committedHumidity[0]} –{' '}
          {committedHumidity[1]}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" size="small" onClick={handleApply} data-testid="apply-environment-panel">
            Apply panel
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
