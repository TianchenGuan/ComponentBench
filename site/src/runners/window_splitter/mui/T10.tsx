'use client';

/**
 * window_splitter-mui-T20: Top-left small: set left pane to 33% with tight tolerance
 * 
 * The splitter card is positioned near the top-left of the viewport (not centered) 
 * to test cursor travel and anchoring. The component is rendered in a small scale 
 * variant. A two-pane horizontal resizable layout is shown with labels "Left pane" 
 * and "Right pane". The visible divider line is very thin (2px) although the 
 * interactive hit target is larger. A numeric readout beneath the panes shows 
 * the left pane percentage to one decimal place. Initial state is 50/50.
 * 
 * Success: Left pane is 33% ±1%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [leftSize, setLeftSize] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = leftSize / 100;
    // Success: Left pane is 33% ±1% (0.32 to 0.34)
    if (!successFiredRef.current && leftFraction >= 0.32 && leftFraction <= 0.34) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [leftSize, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader 
        title="Primary splitter" 
        titleTypographyProps={{ variant: 'subtitle2' }}
        sx={{ py: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box 
          sx={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 1 }}
          data-testid="splitter-primary"
        >
          <Group 
            orientation="horizontal" 
            onLayoutChange={(layout) => {
              const val = layout['left'];
              if (val !== undefined) setLeftSize(val);
            }}
          >
            <Panel id="left" defaultSize="50%" minSize="10%" maxSize="90%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#fafafa'
              }}>
                <Typography variant="body2" fontWeight={500}>Left pane</Typography>
              </Box>
            </Panel>
            <Separator style={{
              width: 10,
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            }}>
              {/* Very thin visible line but larger hit target */}
              <Box sx={{ 
                width: '2px', 
                height: '100%', 
                bgcolor: '#d0d0d0',
              }} />
            </Separator>
            <Panel id="right" minSize="10%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}>
                <Typography variant="body2" fontWeight={500}>Right pane</Typography>
              </Box>
            </Panel>
          </Group>
        </Box>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          Left pane: {leftSize.toFixed(1)}%
        </Typography>
      </CardContent>
    </Card>
  );
}
