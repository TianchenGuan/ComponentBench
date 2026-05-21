'use client';

/**
 * window_splitter-mantine-T24: Step snapping: set left pane to 336 px
 * 
 * A centered isolated card titled "Primary splitter" contains a two-pane Mantine 
 * Split pane in a fixed-width container. The split is configured with snapping: 
 * `step=16` so the resizer moves in 16 px increments. The left pane is labeled 
 * "Sidebar" and the right pane is labeled "Main". A pixel readout below shows 
 * "Sidebar width: … px" and updates live. Initial state is 320 px.
 * 
 * Success: Left pane width equals 336 px ±8 px
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

const CONTAINER_WIDTH = 800;
const INITIAL_PCT = (320 / CONTAINER_WIDTH) * 100;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && sidebarWidth >= 328 && sidebarWidth <= 344) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [sidebarWidth, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: CONTAINER_WIDTH + 48 }}>
      <Text fw={600} size="lg" mb="md">Primary splitter</Text>
      <Box
        style={{ width: CONTAINER_WIDTH, height: 300, border: '1px solid #dee2e6', borderRadius: 4 }}
        data-testid="splitter-primary"
      >
        <Group orientation="horizontal">
          <Panel
            id="sidebar"
            defaultSize={`${INITIAL_PCT}%`}
            minSize="10%"
            onResize={(size) => {
              const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                ? (size as any).asPercentage
                : typeof size === 'number' ? size : parseFloat(String(size));
              if (!isNaN(pct)) {
                const rawPx = (pct / 100) * CONTAINER_WIDTH;
                const snapped = Math.round(rawPx / 16) * 16;
                setSidebarWidth(snapped);
              }
            }}
          >
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f9fa',
            }}>
              <Text fw={500}>Sidebar</Text>
            </Box>
          </Panel>
          <Separator style={{
            width: 8,
            background: '#dee2e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
          }}>
            <Box style={{
              width: 4,
              height: 24,
              borderLeft: '2px dotted #999',
              borderRight: '2px dotted #999',
            }} />
          </Separator>
          <Panel id="main" minSize="10%">
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f1f3f4',
            }}>
              <Text fw={500}>Main</Text>
            </Box>
          </Panel>
        </Group>
      </Box>
      <Text c="dimmed" size="sm" ta="center" mt="sm">
        Sidebar width: {sidebarWidth} px (snaps in 16 px steps)
      </Text>
    </Card>
  );
}
