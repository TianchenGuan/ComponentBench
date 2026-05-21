'use client';

/**
 * window_splitter-mantine-T25: Vertical stack: make top pane 40% height
 * 
 * The page is a settings_panel view with a header and side navigation. In the main 
 * area, a card titled "Primary splitter" contains a stacked split layout (top/bottom 
 * panes). The split pane is configured to resize vertically (a horizontal divider 
 * between panes). Pane labels: "Graph" on top and "Logs" on bottom. A readout below 
 * shows "Graph: 50% height • Logs: 50% height".
 * 
 * Success: Top pane is 40% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box, NavLink } from '@mantine/core';
import '@mantine/core/styles.css';
import { IconSettings, IconDashboard, IconUser } from '@tabler/icons-react';
import { Group as PanelGroup, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [topHeight, setTopHeight] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const topFraction = topHeight / 100;
    if (!successFiredRef.current && topFraction >= 0.37 && topFraction <= 0.43) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [topHeight, onSuccess]);

  return (
    <Box style={{ display: 'flex', gap: 24, minHeight: 500 }}>
      {/* Left navigation */}
      <Box style={{ width: 200 }}>
        <NavLink label="Dashboard" leftSection={<IconDashboard size={16} />} />
        <NavLink label="Settings" leftSection={<IconSettings size={16} />} active />
        <NavLink label="Profile" leftSection={<IconUser size={16} />} />
      </Box>
      
      {/* Main content */}
      <Box style={{ flex: 1 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600} size="lg" mb="md">Primary splitter</Text>
          <Box
            style={{ height: 400, border: '1px solid #dee2e6', borderRadius: 4 }}
            data-testid="splitter-primary"
          >
            <PanelGroup orientation="vertical">
              <Panel
                id="graph"
                defaultSize="50%"
                minSize="10%"
                onResize={(size) => {
                  const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                    ? (size as any).asPercentage
                    : typeof size === 'number' ? size : parseFloat(String(size));
                  if (!isNaN(pct)) setTopHeight(pct);
                }}
              >
                <Box style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f8f9fa',
                }}>
                  <Text fw={500}>Graph</Text>
                </Box>
              </Panel>
              <Separator style={{
                height: 8,
                background: '#dee2e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'row-resize',
              }}>
                <Box style={{
                  width: 24,
                  height: 4,
                  borderTop: '2px dotted #999',
                  borderBottom: '2px dotted #999',
                }} />
              </Separator>
              <Panel id="logs" minSize="10%">
                <Box style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f1f3f4',
                }}>
                  <Text fw={500}>Logs</Text>
                </Box>
              </Panel>
            </PanelGroup>
          </Box>
          <Text c="dimmed" size="sm" ta="center" mt="sm">
            Graph: {topHeight.toFixed(0)}% height • Logs: {(100 - topHeight).toFixed(0)}% height
          </Text>
        </Card>
      </Box>
    </Box>
  );
}
