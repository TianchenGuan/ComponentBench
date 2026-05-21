'use client';

/**
 * window_splitter-mantine-T23: Set left pane to a pixel range (260–280 px)
 *
 * A centered card titled "Primary splitter" with a fixed-width container (800 px).
 * Two panes: "Navigation" (left) and "Document" (right).
 * Readout shows "Navigation width: ### px". Initial state is 300 px.
 *
 * Success: Left pane width is within [260, 280] px
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

const CONTAINER_WIDTH = 800;
const INITIAL_PCT = (300 / CONTAINER_WIDTH) * 100;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [navWidth, setNavWidth] = useState(300);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && navWidth >= 260 && navWidth <= 280) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [navWidth, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: CONTAINER_WIDTH + 48 }}>
      <Text fw={600} size="lg" mb="md">Primary splitter</Text>
      <Box
        style={{ width: CONTAINER_WIDTH, height: 300, border: '1px solid #dee2e6', borderRadius: 4 }}
        data-testid="splitter-primary"
      >
        <Group orientation="horizontal">
          <Panel
            id="navigation"
            defaultSize={`${INITIAL_PCT}%`}
            minSize="10%"
            onResize={(size) => {
              const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                ? (size as any).asPercentage
                : typeof size === 'number' ? size : parseFloat(String(size));
              if (!isNaN(pct)) {
                setNavWidth(Math.round((pct / 100) * CONTAINER_WIDTH));
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
              <Text fw={500}>Navigation</Text>
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
          <Panel id="document" minSize="10%">
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f1f3f4',
            }}>
              <Text fw={500}>Document</Text>
            </Box>
          </Panel>
        </Group>
      </Box>
      <Text c="dimmed" size="sm" ta="center" mt="sm">
        Navigation width: {navWidth} px
      </Text>
    </Card>
  );
}
