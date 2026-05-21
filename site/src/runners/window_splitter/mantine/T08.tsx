'use client';

/**
 * window_splitter-mantine-T28: Drawer save: set Canvas to 60% then Save layout
 * 
 * The page uses a drawer_flow layout with a button labeled "Open layout drawer". 
 * Clicking it opens a Mantine Drawer from the right titled "Layout". Inside the 
 * drawer is a two-pane Split component: "Canvas" (left) and "Settings" (right). 
 * The split starts at 50/50 and a readout inside the drawer shows the current split. 
 * At the bottom of the drawer are two actions: "Close" and a primary "Save layout" 
 * button. The split is treated as pending until Save layout is clicked.
 * 
 * Success: After clicking "Save layout", Canvas (left) is 60% ±2%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Box, Button, Drawer, Group as MantineGroup, Badge } from '@mantine/core';
import '@mantine/core/styles.css';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(50);
  const [committedWidth, setCommittedWidth] = useState<number | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && committedWidth !== null) {
      const canvasFraction = committedWidth / 100;
      if (canvasFraction >= 0.58 && canvasFraction <= 0.62) {
        successFiredRef.current = true;
        onSuccess();
      }
    }
  }, [committedWidth, onSuccess]);

  const handleSave = () => {
    setCommittedWidth(canvasWidth);
    setIsApplied(true);
    setIsDrawerOpen(false);
  };

  const handleClose = () => {
    setCanvasWidth(50);
    setIsDrawerOpen(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, textAlign: 'center' }}>
      <Button
        size="lg"
        onClick={() => setIsDrawerOpen(true)}
        data-testid="open-drawer-button"
      >
        Open layout drawer
      </Button>

      {committedWidth !== null && (
        <Text
          c="green"
          size="sm"
          mt="md"
          data-committed-layout={`${committedWidth},${100 - committedWidth}`}
        >
          Applied: Canvas {committedWidth.toFixed(0)}% • Settings {(100 - committedWidth).toFixed(0)}%
        </Text>
      )}

      <Drawer
        opened={isDrawerOpen}
        onClose={handleClose}
        title="Layout"
        position="right"
        size="lg"
        data-testid="layout-drawer"
      >
        <Box
          style={{ height: 300, border: '1px solid #dee2e6', borderRadius: 4, marginBottom: 16 }}
          data-testid="splitter-primary"
        >
          <Group orientation="horizontal">
            <Panel
              id="canvas"
              defaultSize="50%"
              minSize="10%"
              onResize={(size) => {
                const pct = typeof size === 'object' && size !== null && 'asPercentage' in size
                  ? (size as any).asPercentage
                  : typeof size === 'number' ? size : parseFloat(String(size));
                if (!isNaN(pct)) {
                  setCanvasWidth(pct);
                  setIsApplied(false);
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
                <Text fw={500}>Canvas</Text>
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
            <Panel id="settings" minSize="10%">
              <Box style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f3f4',
              }}>
                <Text fw={500}>Settings</Text>
              </Box>
            </Panel>
          </Group>
        </Box>

        <MantineGroup justify="space-between" mb="md">
          <Text size="sm" c="dimmed">
            Canvas: {canvasWidth.toFixed(0)}% • Settings: {(100 - canvasWidth).toFixed(0)}%
          </Text>
          {!isApplied && <Badge color="yellow" size="sm">Not saved</Badge>}
        </MantineGroup>

        <MantineGroup justify="flex-end" gap="sm">
          <Button variant="default" onClick={handleClose}>Close</Button>
          <Button onClick={handleSave} data-testid="save-button">Save layout</Button>
        </MantineGroup>
      </Drawer>
    </Card>
  );
}
