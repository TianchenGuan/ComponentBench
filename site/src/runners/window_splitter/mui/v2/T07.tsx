'use client';

/**
 * window_splitter-mui-v2-T07: Dark visual-only split — match reference 64/36
 *
 * Dark isolated card (small scale), top-left placement via scene. Left / Right panes, no live
 * percentages. Reference thumbnail `mui_dark_ref_64_36` below shows target proportions.
 *
 * Success: primary (left) pane 64% ±2% (matches reference).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [leftPct, setLeftPct] = useState(50);
  const successFired = useRef(false);

  const handleLayout = useCallback((layout: Record<string, number>) => {
    const l = layout.ref_left;
    if (l !== undefined) setLeftPct(l);
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (leftPct >= 62 && leftPct <= 66) {
      successFired.current = true;
      onSuccess();
    }
  }, [leftPct, onSuccess]);

  return (
    <Card
      sx={{
        width: 400,
        maxWidth: '100%',
        bgcolor: 'grey.900',
        color: 'grey.100',
        borderColor: 'grey.700',
      }}
      variant="outlined"
      data-testid="dark-visual-splitter-card"
    >
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.400' }}>
          Layout reference task
        </Typography>
        <Box
          sx={{
            height: 140,
            border: '1px solid',
            borderColor: 'grey.700',
            borderRadius: 1,
          }}
        >
          <TwoPanelSplit
            leftId="ref_left"
            rightId="ref_right"
            defaultLeftPct={50}
            leftMin={15}
            leftMax={85}
            onLayoutChange={handleLayout}
            separatorColor="#90caf9"
            separatorHoverColor="#64b5f6"
            dotColor="#1565c0"
            data-testid="live-split-no-readout"
            leftContent={
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.800',
                }}
              >
                <Typography fontWeight={600} color="grey.200">Left</Typography>
              </Box>
            }
            rightContent={
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#252525',
                }}
              >
                <Typography fontWeight={600} color="grey.300">Right</Typography>
              </Box>
            }
          />
        </Box>

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'grey.500' }}>
          Match the thumbnail — no numeric split readout is shown here.
        </Typography>

        <Box
          data-reference-id="mui_dark_ref_64_36"
          sx={{
            mt: 2,
            display: 'flex',
            height: 44,
            borderRadius: 1,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'grey.600',
          }}
          aria-label="Target layout reference"
        >
          <Box sx={{ width: '64%', bgcolor: '#37474f' }} />
          <Box sx={{ width: '36%', bgcolor: '#546e7a' }} />
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 0.75, color: 'grey.600' }}>
          Reference thumbnail (not interactive)
        </Typography>
      </CardContent>
    </Card>
  );
}
