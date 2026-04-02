'use client';

/**
 * slider_single-mui-v2-T20: Recommendations weight from a visual fill gauge
 *
 * Dashboard cards: Search weight (60) and Recommendations weight (30). Reference bar at 45%
 * (ref-recommendations-weight). Post-release “Current: XX” on Recommendations card.
 *
 * Success: Recommendations within ±1 of 45; Search remains 60.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const TARGET = 45;

export default function T20({ onSuccess }: TaskComponentProps) {
  const [search, setSearch] = useState(60);
  const [rec, setRec] = useState(30);
  const [settledRec, setSettledRec] = useState(30);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (Math.abs(settledRec - TARGET) <= 1 && search === 60) {
      successFired.current = true;
      onSuccess();
    }
  }, [settledRec, search, onSuccess]);

  return (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <Chip size="small" label="Live" color="primary" variant="outlined" />
        <Chip size="small" label="Region: EU" variant="outlined" />
        <Chip size="small" label="Experiment: rank-v3" variant="outlined" />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Search weight
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={search}
                onChange={(_e, v) => setSearch(v as number)}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                aria-label="Search weight"
                data-testid="slider-search-weight"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Current: {search}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Recommendations weight
            </Typography>
            <Box
              id="ref-recommendations-weight"
              data-reference-id="ref-recommendations-weight"
              sx={{ mb: 1.5 }}
            >
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Reference
              </Typography>
              <Box
                sx={{
                  height: 10,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${TARGET}%`,
                    bgcolor: 'primary.main',
                    opacity: 0.85,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ px: 1 }}>
              <Slider
                value={rec}
                onChange={(_e, v) => setRec(v as number)}
                onChangeCommitted={(_e, v) => setSettledRec(v as number)}
                min={0}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                aria-label="Recommendations weight"
                data-testid="slider-recommendations-weight"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Current: {settledRec}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
