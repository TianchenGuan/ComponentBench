'use client';

/**
 * color_picker_2d-mantine-T15: Drawer flow: set low-opacity sidebar highlight
 *
 * Layout: drawer_flow. The page shows a settings overview with a button "Customize theme…".
 * Clicking the button opens a right-side drawer (dark theme) containing theme controls.
 * Inside the drawer, there is an inline Mantine ColorPicker labeled "Sidebar highlight", configured with format='rgba' so the alpha slider is visible.
 * Initial state: rgba(255, 255, 255, 0.20) (white at 20% opacity), and the target requires lowering alpha to 0.08 while keeping RGB at pure white.
 * The drawer contains other settings (Switches for "Use shadows", Select for "Font size"), which are distractors.
 * The task is complete when the Sidebar highlight ColorPicker value matches rgba(255, 255, 255, 0.08).
 *
 * Success: Component value represents color RGBA(255, 255, 255, 0.08) within tolerance.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Drawer, Switch, Select, Stack, ColorPicker } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, parseRgba } from '../types';

const TARGET_COLOR: RGBA = { r: 255, g: 255, b: 255, a: 0.08 };
const RGB_TOLERANCE = 0;
const ALPHA_TOLERANCE = 0.01;

export default function T15({ onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [sidebarHighlight, setSidebarHighlight] = useState('rgba(255, 255, 255, 0.2)');
  const [useShadows, setUseShadows] = useState(true);
  const [fontSize, setFontSize] = useState<string | null>('md');

  useEffect(() => {
    if (!sidebarHighlight) return;
    
    const rgba = parseRgba(sidebarHighlight);
    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [sidebarHighlight, onSuccess]);

  return (
    <div style={{ width: 500 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="md">Settings Overview</Text>
        
        <Text size="sm" c="dimmed" mb="lg">
          Configure your application theme and appearance settings.
        </Text>
        
        <Stack gap="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="sm">Theme mode</Text>
            <Text size="sm" c="dimmed">Dark</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="sm">Accent color</Text>
            <Text size="sm" c="dimmed">#228BE6</Text>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text size="sm">Sidebar highlight</Text>
            <Text size="sm" c="dimmed">20% white</Text>
          </div>
        </Stack>
        
        <Button 
          mt="lg" 
          onClick={() => setDrawerOpened(true)}
          data-testid="customize-theme-button"
        >
          Customize theme…
        </Button>
      </Card>
      
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        title="Customize theme"
        size="md"
        styles={{
          header: { background: '#1A1B1E', color: 'white' },
          body: { background: '#1A1B1E' },
          close: { color: 'white' },
        }}
      >
        <Stack gap="md">
          <Switch
            label="Use shadows"
            checked={useShadows}
            onChange={(e) => setUseShadows(e.currentTarget.checked)}
            styles={{ label: { color: 'white' } }}
          />
          
          <Select
            label="Font size"
            value={fontSize}
            onChange={setFontSize}
            data={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
            styles={{ label: { color: 'white' } }}
          />
          
          <div>
            <Text size="sm" mb="xs" style={{ color: 'white' }}>Sidebar highlight</Text>
            <Text size="xs" c="dimmed" mb="xs">rgba(255, 255, 255, 0.08)</Text>
            <ColorPicker
              value={sidebarHighlight}
              onChange={setSidebarHighlight}
              format="rgba"
              data-testid="sidebar-highlight"
            />
            <Text size="xs" mt="xs" style={{ fontFamily: 'monospace', color: '#888' }}>
              Current: {sidebarHighlight}
            </Text>
          </div>
        </Stack>
        
        <Text size="xs" c="dimmed" mt="lg">
          Set Sidebar highlight alpha to ~0.08.
        </Text>
      </Drawer>
      
      <Text size="xs" c="dimmed" mt="md">
        Open the drawer and adjust the sidebar highlight opacity.
      </Text>
    </div>
  );
}
