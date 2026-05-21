'use client';

/**
 * window_splitter-mui-T12: Double-click handle to reset to 50/50
 * 
 * A centered isolated card titled "Primary splitter" contains a two-panel resizable 
 * layout (react-resizable-panels styled with MUI). Initial state is uneven: "Pane A" 
 * is about 70% and "Pane B" is about 30%. A helper hint directly under the handle 
 * says "Tip: Double-click the divider to reset". The handle listens for a double-click 
 * event and restores the default layout (50/50).
 * 
 * Success: Both panes are 50% ±2% after reset
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Group, Panel, Separator, useGroupRef } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [paneASize, setPaneASize] = useState(70);
  const groupRef = useGroupRef();
  const successFiredRef = useRef(false);

  useEffect(() => {
    const paneAFraction = paneASize / 100;
    // Success: Pane A is 50% ±2% (0.48 to 0.52)
    if (!successFiredRef.current && paneAFraction >= 0.48 && paneAFraction <= 0.52) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [paneASize, onSuccess]);

  const handleDoubleClick = () => {
    groupRef.current?.setLayout({ paneA: 50, paneB: 50 });
  };

  return (
    <Card sx={{ width: 700 }}>
      <CardHeader title="Primary splitter" />
      <CardContent>
        <Box 
          sx={{ height: 300, border: '1px solid #e0e0e0', borderRadius: 1 }}
          data-testid="splitter-primary"
          data-reset-supported="true"
        >
          <Group 
            groupRef={groupRef}
            orientation="horizontal" 
            onLayoutChange={(layout) => {
              const val = layout['paneA'];
              if (val !== undefined) setPaneASize(val);
            }}
          >
            <Panel id="paneA" defaultSize="70%" minSize="10%" maxSize="90%">              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#fafafa'
              }}>
                <Typography fontWeight={500}>Pane A</Typography>
              </Box>
            </Panel>
            <Separator 
              onDoubleClick={handleDoubleClick}
              style={{
                width: 8,
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'col-resize',
              }}
            >
              <Box sx={{ 
                width: 4, 
                height: 24, 
                borderLeft: '2px dotted #999',
                borderRight: '2px dotted #999',
              }} />
            </Separator>
            <Panel id="paneB" minSize="10%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}>
                <Typography fontWeight={500}>Pane B</Typography>
              </Box>
            </Panel>
          </Group>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 1.5, textAlign: 'center' }}
        >
          Pane A: {paneASize.toFixed(0)}% • Pane B: {(100 - paneASize).toFixed(0)}%
        </Typography>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}
        >
          Tip: Double-click the divider to reset
        </Typography>
      </CardContent>
    </Card>
  );
}
