'use client';

/**
 * window_splitter-mantine-T21: Resize Notes pane to 65% (basic)
 *
 * A centered isolated card titled "Primary splitter" with a two-pane layout:
 * "Notes" (left) and "Preview" (right) using react-resizable-panels.
 * A readout below shows "Notes: 50.0% • Preview: 50.0%".
 *
 * Success: Notes (left) pane is 65% ±5%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [notesPercent, setNotesPercent] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && notesPercent >= 60 && notesPercent <= 70) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [notesPercent, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Primary splitter</Text>
      <Box
        style={{ height: 300, border: '1px solid #dee2e6', borderRadius: 4 }}
        data-testid="splitter-primary"
      >
        <Group orientation="horizontal">
          <Panel
            id="notes"
            defaultSize="50%"
            minSize="10%"
            onResize={(size) => {
              const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                ? (size as any).asPercentage
                : typeof size === 'number' ? size : parseFloat(String(size));
              if (!isNaN(pct)) setNotesPercent(pct);
            }}
          >
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8f9fa',
            }}>
              <Text fw={500}>Notes</Text>
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
          <Panel id="preview" minSize="10%">
            <Box style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f1f3f4',
            }}>
              <Text fw={500}>Preview</Text>
            </Box>
          </Panel>
        </Group>
      </Box>
      <Text c="dimmed" size="sm" ta="center" mt="sm">
        Notes: {notesPercent.toFixed(1)}% • Preview: {(100 - notesPercent).toFixed(1)}%
      </Text>
    </Card>
  );
}
