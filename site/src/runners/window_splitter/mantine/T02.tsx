'use client';

/**
 * window_splitter-mantine-T22: Double-click resizer to reset to initial size
 * 
 * A centered isolated card titled "Primary splitter" contains a two-pane Split 
 * (Mantine split pane extension). The initial layout was saved as equal halves 
 * (50/50), but the current state on load is intentionally skewed (about 70/30). 
 * A helper line under the component says: "Tip: Double-click the resizer to reset 
 * to the initial sizes." The resizer has an onDoubleClick handler wired to the 
 * extension's reset mechanism to restore the initial sizes.
 * 
 * Success: Split is 50/50 ±2% after reset
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator, usePanelRef } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [leftWidth, setLeftWidth] = useState(70);
  const leftPanelRef = usePanelRef();
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = leftWidth / 100;
    if (!successFiredRef.current && leftFraction >= 0.48 && leftFraction <= 0.52) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [leftWidth, onSuccess]);

  const handleDoubleClick = () => {
    leftPanelRef.current?.resize('50%');
    setLeftWidth(50);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Primary splitter</Text>
      <Box
        style={{ height: 300, border: '1px solid #dee2e6', borderRadius: 4 }}
        data-testid="splitter-primary"
      >
        <Group orientation="horizontal">
          <Panel
            id="pane-a"
            panelRef={leftPanelRef}
            defaultSize="70%"
            minSize="10%"
            onResize={(size) => {
              const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                ? (size as any).asPercentage
                : typeof size === 'number' ? size : parseFloat(String(size));
              if (!isNaN(pct)) setLeftWidth(pct);
            }}
          >
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f9fa',
            }}>
              <Text fw={500}>Pane A</Text>
            </Box>
          </Panel>
          <Separator
            onDoubleClick={handleDoubleClick}
            style={{
              width: 8,
              background: '#dee2e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            }}
          >
            <Box style={{
              width: 4,
              height: 24,
              borderLeft: '2px dotted #999',
              borderRight: '2px dotted #999',
            }} />
          </Separator>
          <Panel id="pane-b" minSize="10%">
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f1f3f4',
            }}>
              <Text fw={500}>Pane B</Text>
            </Box>
          </Panel>
        </Group>
      </Box>
      <Text c="dimmed" size="sm" ta="center" mt="sm">
        Pane A: {leftWidth.toFixed(0)}% • Pane B: {(100 - leftWidth).toFixed(0)}%
      </Text>
      <Text c="dimmed" size="xs" ta="center" mt={4}>
        Tip: Double-click the resizer to reset to the initial sizes.
      </Text>
    </Card>
  );
}
