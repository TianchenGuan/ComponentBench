'use client';

/**
 * window_splitter-mui-T19: Visual-only in dark theme: match reference split (65/35)
 * 
 * A centered isolated card is rendered in dark theme. It contains a two-pane 
 * resizable layout labeled "Left" and "Right". The UI hides numeric percentages; 
 * instead, a small reference image labeled "Target layout" is shown beneath the 
 * panes. The reference image depicts the Left pane moderately larger than the 
 * Right pane (approximately 65% / 35%).
 * 
 * Success: Left pane is 65% ±1.5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [leftSize, setLeftSize] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = leftSize / 100;
    // Success: Left pane is 65% ±1.5% (0.635 to 0.665)
    if (!successFiredRef.current && leftFraction >= 0.635 && leftFraction <= 0.665) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [leftSize, onSuccess]);

  return (
    <Card sx={{ 
      width: 600, 
      bgcolor: '#1e1e1e',
      '& .MuiCardHeader-root': { bgcolor: '#2d2d2d', borderBottom: '1px solid #404040' },
      '& .MuiCardHeader-title': { color: '#fff' },
    }}>
      <CardHeader title="Primary splitter" />
      <CardContent>
        <Box 
          sx={{ height: 280, border: '1px solid #404040', borderRadius: 1 }}
          data-testid="splitter-primary"
        >
          <Group 
            orientation="horizontal" 
            onLayoutChange={(layout) => {
              const val = layout['left'];
              if (val !== undefined) setLeftSize(val);
            }}
          >
            <Panel id="left" defaultSize="50%" minSize="20%" maxSize="90%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#2d2d2d'
              }}>
                <Typography fontWeight={500} fontSize={18} sx={{ color: '#fff' }}>Left</Typography>
              </Box>
            </Panel>
            <Separator style={{
              width: 6,
              background: '#555',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            }}>
              <Box sx={{ 
                width: 2, 
                height: 20, 
                bgcolor: '#888',
                borderRadius: 1,
              }} />
            </Separator>
            <Panel id="right" minSize="10%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#252525'
              }}>
                <Typography fontWeight={500} fontSize={18} sx={{ color: '#fff' }}>Right</Typography>
              </Box>
            </Panel>
          </Group>
        </Box>

        {/* Reference thumbnail - no numeric readout */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 1 }}>
            Target layout
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            height: 40, 
            border: '1px solid #505050', 
            borderRadius: 1, 
            overflow: 'hidden' 
          }}>
            <Box sx={{ 
              width: '65%', 
              bgcolor: '#3a3a3a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRight: '2px solid #666'
            }}>
              <Typography variant="caption" sx={{ color: '#aaa' }}>Left</Typography>
            </Box>
            <Box sx={{ 
              width: '35%', 
              bgcolor: '#2a2a2a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ color: '#777' }}>Right</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
