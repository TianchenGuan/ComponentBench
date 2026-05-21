'use client';

/**
 * window_splitter-mantine-T29: Dark compact small: match visual reference (75/25)
 * 
 * A centered isolated card is rendered in dark theme with compact spacing and a 
 * small scale. It contains a two-pane Mantine Split: "Left pane" and "Right pane". 
 * The resizer uses a subtle gradient variant and is thinner than default due to the 
 * small scale. Numeric readouts are intentionally hidden; a static reference thumbnail 
 * labeled "Target layout" is displayed under the panes. The reference depicts a strong 
 * asymmetry: left pane much wider than right (approximately 75% / 25%).
 * 
 * Success: Left pane is 75% ±1.5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [leftWidth, setLeftWidth] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const leftFraction = leftWidth / 100;
    if (!successFiredRef.current && leftFraction >= 0.735 && leftFraction <= 0.765) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [leftWidth, onSuccess]);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{
        width: 550,
        background: '#1a1b1e',
        borderColor: '#373a40',
      }}
    >
      <Text fw={600} size="sm" mb="sm" c="white">Primary splitter</Text>
      <Box
        style={{ height: 220, border: '1px solid #373a40', borderRadius: 4 }}
        data-testid="splitter-primary"
      >
        <Group orientation="horizontal">
          <Panel
            id="left-pane"
            defaultSize="50%"
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
              background: '#25262b',
            }}>
              <Text fw={500} c="white" size="sm">Left pane</Text>
            </Box>
          </Panel>
          <Separator style={{
            width: 4,
            background: 'linear-gradient(180deg, #4a4d56, #373a40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
          }}>
            <Box style={{
              width: 2,
              height: 20,
              borderLeft: '1px dotted #666',
              borderRight: '1px dotted #666',
            }} />
          </Separator>
          <Panel id="right-pane" minSize="10%">
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1f2023',
            }}>
              <Text fw={500} c="white" size="sm">Right pane</Text>
            </Box>
          </Panel>
        </Group>
      </Box>

      {/* Reference thumbnail - no numeric readout */}
      <Box mt="md">
        <Text size="xs" c="dimmed" mb={6}>Target layout</Text>
        <Box style={{
          display: 'flex',
          height: 35,
          border: '1px solid #373a40',
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <Box style={{
            width: '75%',
            background: '#2c2e33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '2px solid #4a4d56',
          }}>
            <Text size="xs" c="gray.5">Left</Text>
          </Box>
          <Box style={{
            width: '25%',
            background: '#1f2023',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text size="xs" c="gray.6">Right</Text>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
