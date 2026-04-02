'use client';

/**
 * window_splitter-mantine-T30: Dashboard scroll: find Timeline vs Logs and set Logs to 30% height
 * 
 * The page is a busy dashboard with multiple charts, KPI cards, and filters. The 
 * dashboard is vertically scrollable. The target component is not visible at initial 
 * load; it appears further down in a card titled "Timeline vs Logs". Inside that card 
 * is a stacked split layout (top/bottom panes): the top pane is labeled "Timeline" 
 * and the bottom pane is labeled "Logs". A horizontal resizer separates the panes.
 * 
 * Success: Logs (bottom) is 30% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box, SimpleGrid, Paper, Group as MantineGroup, Badge, Progress } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group as PanelGroup, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [topHeight, setTopHeight] = useState(50);
  const successFiredRef = useRef(false);

  const logsHeight = 100 - topHeight;

  useEffect(() => {
    const logsFraction = logsHeight / 100;
    if (!successFiredRef.current && logsFraction >= 0.27 && logsFraction <= 0.33) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [logsHeight, onSuccess]);

  return (
    <Box style={{ width: 800, maxHeight: 600, overflowY: 'auto' }}>
      <Text fw={600} size="xl" mb="md">Dashboard</Text>

      {/* KPI Cards row */}
      <SimpleGrid cols={3} mb="md">
        <Paper shadow="xs" p="md" withBorder>
          <Text size="xs" c="dimmed">Total Users</Text>
          <Text size="xl" fw={700}>12,345</Text>
          <Badge size="sm" color="green">+5.2%</Badge>
        </Paper>
        <Paper shadow="xs" p="md" withBorder>
          <Text size="xs" c="dimmed">Revenue</Text>
          <Text size="xl" fw={700}>$54,321</Text>
          <Badge size="sm" color="green">+12.3%</Badge>
        </Paper>
        <Paper shadow="xs" p="md" withBorder>
          <Text size="xs" c="dimmed">Conversion</Text>
          <Text size="xl" fw={700}>3.4%</Text>
          <Badge size="sm" color="yellow">-0.2%</Badge>
        </Paper>
      </SimpleGrid>

      {/* Charts placeholder */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Text fw={500} mb="sm">Traffic Overview</Text>
        <Box style={{ height: 120, background: '#f8f9fa', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text c="dimmed" size="sm">Chart placeholder</Text>
        </Box>
      </Card>

      {/* More KPIs to add height */}
      <SimpleGrid cols={4} mb="md">
        {['Sessions', 'Bounce Rate', 'Avg Duration', 'Pages/Session'].map((label) => (
          <Paper key={label} shadow="xs" p="sm" withBorder>
            <Text size="xs" c="dimmed">{label}</Text>
            <Text size="md" fw={600}>{Math.floor(Math.random() * 1000)}</Text>
            <Progress value={Math.random() * 100} size="xs" mt="xs" />
          </Paper>
        ))}
      </SimpleGrid>

      {/* Target section: Timeline vs Logs */}
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        data-testid="card-timeline-logs"
      >
        <Text fw={600} size="md" mb="sm">Timeline vs Logs</Text>
        <Box
          style={{ height: 300, border: '1px solid #dee2e6', borderRadius: 4 }}
          data-testid="splitter-primary"
        >
          <PanelGroup orientation="vertical">
            <Panel
              id="timeline"
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
                <Text fw={500}>Timeline</Text>
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
          Timeline: {topHeight.toFixed(0)}% height • Logs: {logsHeight.toFixed(0)}% height
        </Text>
      </Card>
    </Box>
  );
}
