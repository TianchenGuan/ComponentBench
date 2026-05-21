'use client';

/**
 * window_splitter-mui-T11: Resize list pane to 40% (basic)
 * 
 * A centered isolated card titled "Primary splitter" uses MUI styling but the 
 * resizable behavior is implemented with the external `react-resizable-panels` 
 * library. Two side-by-side panels are labeled "List" (left) and "Details" (right). 
 * The resize handle is an 8px-wide bar with a dotted grip; it has `role="separator"` 
 * for accessibility. A live text readout below the panels shows "List: 50% • Details: 50%".
 * 
 * Success: List (left) pane is 40% ±5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [listSize, setListSize] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const listFraction = listSize / 100;
    if (!successFiredRef.current && listFraction >= 0.35 && listFraction <= 0.45) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [listSize, onSuccess]);

  return (
    <Card sx={{ width: 700 }}>
      <CardHeader title="Primary splitter" />
      <CardContent>
        <Box 
          sx={{ height: 300, border: '1px solid #e0e0e0', borderRadius: 1 }}
          data-testid="splitter-primary"
          id="mui-primary"
        >
          <Group 
            orientation="horizontal" 
            onLayoutChange={(layout) => {
              const listVal = layout['list'];
              if (listVal !== undefined) setListSize(listVal);
            }}
          >
            <Panel id="list" defaultSize="50%" minSize="10%" maxSize="90%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#fafafa'
              }}>
                <Typography fontWeight={500}>List</Typography>
              </Box>
            </Panel>
            <Separator style={{
              width: 8,
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            }}>
              <Box sx={{ 
                width: 4, 
                height: 24, 
                borderLeft: '2px dotted #999',
                borderRight: '2px dotted #999',
              }} />
            </Separator>
            <Panel id="details" minSize="10%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}>
                <Typography fontWeight={500}>Details</Typography>
              </Box>
            </Panel>
          </Group>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 1.5, textAlign: 'center' }}
        >
          List: {listSize.toFixed(0)}% • Details: {(100 - listSize).toFixed(0)}%
        </Typography>
      </CardContent>
    </Card>
  );
}
