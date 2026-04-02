'use client';

/**
 * window_splitter-mantine-T27: Nested splitters: resize the Outer splitter to 30%
 * 
 * A single card is placed toward the bottom-right of the viewport. The card title 
 * reads "Nested layout". Inside the card is an Outer Mantine Split pane (left/right) 
 * with panes labeled "Navigation" (left) and "Workspace" (right). Within the Workspace 
 * pane, there is an Inner Split pane that divides Workspace into "Output" and "Help". 
 * Both splitters have their own resizer bars and readouts; the Inner splitter is 
 * labeled "Inner splitter (do not adjust)". Initial state: Outer splitter is 50/50; 
 * Inner splitter is 60/40. Only the Outer splitter's Navigation fraction determines success.
 * 
 * Success: Outer Navigation (left) is 30% ±2%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [outerWidth, setOuterWidth] = useState(50);
  const [innerWidth, setInnerWidth] = useState(60);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const navFraction = outerWidth / 100;
    if (!successFiredRef.current && navFraction >= 0.28 && navFraction <= 0.32) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [outerWidth, onSuccess]);

  const separatorStyle = {
    width: 8,
    background: '#dee2e6',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    cursor: 'col-resize' as const,
  };

  const separatorHandle = (
    <Box style={{
      width: 4,
      height: 24,
      borderLeft: '2px dotted #999',
      borderRight: '2px dotted #999',
    }} />
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Nested layout</Text>
      <Box
        style={{ height: 350, border: '1px solid #dee2e6', borderRadius: 4 }}
        data-testid="split-outer"
      >
        <Group orientation="horizontal">
          <Panel
            id="navigation"
            defaultSize="50%"
            minSize="10%"
            onResize={(size) => {
              const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                ? (size as any).asPercentage
                : typeof size === 'number' ? size : parseFloat(String(size));
              if (!isNaN(pct)) setOuterWidth(pct);
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
          <Separator style={separatorStyle}>{separatorHandle}</Separator>
          <Panel id="workspace" minSize="10%">
            {/* Inner splitter inside Workspace */}
            <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Text size="xs" c="dimmed" p="xs" style={{ borderBottom: '1px solid #eee' }}>
                Inner splitter (do not adjust)
              </Text>
              <Box
                style={{ flex: 1 }}
                data-testid="split-inner"
              >
                <Group orientation="horizontal">
                  <Panel
                    id="output"
                    defaultSize="60%"
                    minSize="10%"
                    onResize={(size) => {
                      const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                        ? (size as any).asPercentage
                        : typeof size === 'number' ? size : parseFloat(String(size));
                      if (!isNaN(pct)) setInnerWidth(pct);
                    }}
                  >
                    <Box style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                    }}>
                      <Text size="sm" fw={500}>Output</Text>
                    </Box>
                  </Panel>
                  <Separator style={separatorStyle}>{separatorHandle}</Separator>
                  <Panel id="help" minSize="10%">
                    <Box style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f1f3f4',
                    }}>
                      <Text size="sm" fw={500}>Help</Text>
                    </Box>
                  </Panel>
                </Group>
              </Box>
            </Box>
          </Panel>
        </Group>
      </Box>
      <Text c="dimmed" size="sm" ta="center" mt="sm">
        Outer: Navigation {outerWidth.toFixed(0)}% • Workspace {(100 - outerWidth).toFixed(0)}%
      </Text>
      <Text c="dimmed" size="xs" ta="center">
        Inner: Output {innerWidth.toFixed(0)}% • Help {(100 - innerWidth).toFixed(0)}%
      </Text>
    </Card>
  );
}
