'use client';

/**
 * alpha_slider-mui-T10: Match header scrim opacity to target (dark theme, 2 instances)
 *
 * A dark theme card titled "Scrim Opacity" contains TWO opacity controls (instances=2):
 * - Row 1 (target): "Header scrim"
 * - Row 2: "Footer scrim"
 * Each row shows:
 * - A live "Current" preview chip and a fixed "Target" preview chip on checkerboard.
 * - A MUI Slider labeled "Opacity" directly below the previews for that row.
 * Guidance:
 * - Mixed: the Target chip is shown visually, and a small caption under the Header Target chip reads "Target: 35%".
 * Initial state:
 * - Header scrim opacity = 80%
 * - Footer scrim opacity = 20%
 *
 * Success: The 'Header scrim' instance alpha matches the target (alpha=0.35). Alpha must be within ±0.01 of the target value.
 * The correct instance must be modified (Header scrim).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, ThemeProvider, createTheme } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TARGET_HEADER_ALPHA = 0.35;
const TARGET_FOOTER_ALPHA = 0.6;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [headerOpacity, setHeaderOpacity] = useState(80);
  const [footerOpacity, setFooterOpacity] = useState(20);

  useEffect(() => {
    const alpha = headerOpacity / 100;
    if (isAlphaWithinTolerance(alpha, TARGET_HEADER_ALPHA, 0.01)) {
      onSuccess();
    }
  }, [headerOpacity, onSuccess]);

  const handleHeaderChange = (_event: Event, newValue: number | number[]) => {
    setHeaderOpacity(newValue as number);
  };

  const handleFooterChange = (_event: Event, newValue: number | number[]) => {
    setFooterOpacity(newValue as number);
  };

  const checkerboardSx = {
    backgroundImage: `
      linear-gradient(45deg, #555 25%, transparent 25%),
      linear-gradient(-45deg, #555 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #555 75%),
      linear-gradient(-45deg, transparent 75%, #555 75%)
    `,
    backgroundSize: '12px 12px',
    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
    backgroundColor: '#333',
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card sx={{ width: 420, bgcolor: '#1e1e1e' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: '#fff' }}>
            Scrim Opacity
          </Typography>

          {/* Header scrim row - TARGET */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#ccc' }}>
            Header scrim
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Current</Typography>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  position: 'relative',
                  ...checkerboardSx,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(0, 0, 0, ${headerOpacity / 100})`,
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Target</Typography>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  position: 'relative',
                  ...checkerboardSx,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(0, 0, 0, ${TARGET_HEADER_ALPHA})`,
                    borderRadius: 1,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                Target: 35%
              </Typography>
            </Box>
          </Box>
          <Slider
            value={headerOpacity}
            onChange={handleHeaderChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Header scrim opacity"
            data-testid="header-scrim-slider"
            sx={{ mb: 3 }}
          />

          {/* Footer scrim row */}
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#ccc' }}>
            Footer scrim
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Current</Typography>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  position: 'relative',
                  ...checkerboardSx,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(0, 0, 0, ${footerOpacity / 100})`,
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Target</Typography>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  position: 'relative',
                  ...checkerboardSx,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: `rgba(0, 0, 0, ${TARGET_FOOTER_ALPHA})`,
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Slider
            value={footerOpacity}
            onChange={handleFooterChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Footer scrim opacity"
            data-testid="footer-scrim-slider"
          />
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
