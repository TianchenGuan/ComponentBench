'use client';

/**
 * window_splitter-mantine-T26: Two splitters: match the Secondary reference preview
 * 
 * The page uses a dashboard layout with two Mantine cards stacked. Each card contains 
 * a Split pane and a small reference preview on the right side. Card 1 is labeled 
 * "Primary — Editor/Preview" and Card 2 is labeled "Secondary — Map/Details". Both 
 * splitters look similar and both start at 50/50. The goal is to adjust ONLY the 
 * Secondary — Map/Details splitter so that its live split matches its adjacent 
 * reference preview (35/65).
 * 
 * Success: Secondary Map (left) is 35% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box, Stack, Group as MantineGroup } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryWidth, setPrimaryWidth] = useState(50);
  const [secondaryWidth, setSecondaryWidth] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const mapFraction = secondaryWidth / 100;
    if (!successFiredRef.current && mapFraction >= 0.32 && mapFraction <= 0.38) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [secondaryWidth, onSuccess]);

  const renderReferencePreview = (left: number, right: number) => (
    <Box style={{ width: 100 }}>
      <Text size="xs" c="dimmed" mb={4}>Reference</Text>
      <Box style={{ display: 'flex', height: 50, border: '1px solid #dee2e6', borderRadius: 4, overflow: 'hidden' }}>
        <Box style={{ width: `${left}%`, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, borderRight: '1px solid #dee2e6' }}>
          {left}%
        </Box>
        <Box style={{ width: `${right}%`, background: '#f3e5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>
          {right}%
        </Box>
      </Box>
    </Box>
  );

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
    <Stack gap="lg" style={{ width: 800 }}>
      {/* Primary — Editor/Preview */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <MantineGroup align="flex-start" gap="md">
          <Box style={{ flex: 1 }}>
            <Text fw={600} size="md" mb="sm">Primary — Editor/Preview</Text>
            <Box
              style={{ height: 180, border: '1px solid #dee2e6', borderRadius: 4 }}
              data-testid="splitter-primary"
            >
              <Group orientation="horizontal">
                <Panel
                  id="editor"
                  defaultSize="50%"
                  minSize="10%"
                  onResize={(size) => {
                    const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                      ? (size as any).asPercentage
                      : typeof size === 'number' ? size : parseFloat(String(size));
                    if (!isNaN(pct)) setPrimaryWidth(pct);
                  }}
                >
                  <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                    <Text size="sm" fw={500}>Editor</Text>
                  </Box>
                </Panel>
                <Separator style={separatorStyle}>{separatorHandle}</Separator>
                <Panel id="preview" minSize="10%">
                  <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f4' }}>
                    <Text size="sm" fw={500}>Preview</Text>
                  </Box>
                </Panel>
              </Group>
            </Box>
            <Text c="dimmed" size="xs" ta="center" mt="xs">
              Editor: {primaryWidth.toFixed(0)}% • Preview: {(100 - primaryWidth).toFixed(0)}%
            </Text>
          </Box>
          {renderReferencePreview(50, 50)}
        </MantineGroup>
      </Card>

      {/* Secondary — Map/Details */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <MantineGroup align="flex-start" gap="md">
          <Box style={{ flex: 1 }}>
            <Text fw={600} size="md" mb="sm">Secondary — Map/Details</Text>
            <Box
              style={{ height: 180, border: '1px solid #dee2e6', borderRadius: 4 }}
              data-testid="splitter-secondary"
            >
              <Group orientation="horizontal">
                <Panel
                  id="map"
                  defaultSize="50%"
                  minSize="10%"
                  onResize={(size) => {
                    const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                      ? (size as any).asPercentage
                      : typeof size === 'number' ? size : parseFloat(String(size));
                    if (!isNaN(pct)) setSecondaryWidth(pct);
                  }}
                >
                  <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                    <Text size="sm" fw={500}>Map</Text>
                  </Box>
                </Panel>
                <Separator style={separatorStyle}>{separatorHandle}</Separator>
                <Panel id="details" minSize="10%">
                  <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f4' }}>
                    <Text size="sm" fw={500}>Details</Text>
                  </Box>
                </Panel>
              </Group>
            </Box>
            <Text c="dimmed" size="xs" ta="center" mt="xs">
              Map: {secondaryWidth.toFixed(0)}% • Details: {(100 - secondaryWidth).toFixed(0)}%
            </Text>
          </Box>
          {renderReferencePreview(35, 65)}
        </MantineGroup>
      </Card>
    </Stack>
  );
}
