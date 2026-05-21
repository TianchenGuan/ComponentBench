'use client';

/**
 * color_picker_2d-mantine-T12: Dashboard: set Series B color to match reference
 *
 * Layout: dashboard scene with multiple panels (filters, KPI cards, chart preview).
 * In the "Series colors" panel, there are three Mantine ColorInput components in a vertical list:
 *   • Series A color
 *   • Series B color (target)
 *   • Series C color
 * Instances: 3 total. All three look similar and each opens a dropdown picker.
 * Guidance is mixed: next to each row is a small reference swatch and a short caption.
 * To increase interaction challenge, disallowInput=true (no typing) and the dropdown is configured with many swatches (dense grid).
 * Initial state: Series B color is intentionally incorrect; Series A/C may already match their references.
 * Clutter: the dashboard contains many other buttons and inputs.
 *
 * Success: Series B color matches the on-page reference swatch 'series-b-reference-swatch' within tolerance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Select, Group, Stack, SimpleGrid, Badge } from '@mantine/core';
import { ColorInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance, hexToRgba, COMMON_SWATCHES } from '../types';

// Reference color for Series B
const SERIES_B_REFERENCE: RGBA = { r: 190, g: 75, b: 219, a: 1.0 }; // #BE4BDB - Grape
const RGB_TOLERANCE = 5;
const ALPHA_TOLERANCE = 0.03;

const DENSE_SWATCHES = [
  '#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb',
  '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
  '#40c057', '#82c91e', '#fab005', '#fd7e14', '#ff6b6b',
  '#cc5de8', '#845ef7', '#5c7cfa', '#339af0', '#22b8cf',
];

export default function T12({ onSuccess }: TaskComponentProps) {
  const [seriesA, setSeriesA] = useState('#fa5252'); // Already correct
  const [seriesB, setSeriesB] = useState('#228be6'); // Incorrect - should be #BE4BDB
  const [seriesC, setSeriesC] = useState('#40c057'); // Already correct
  const [period, setPeriod] = useState<string | null>('7d');
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current || !seriesB) return;
    
    const rgba = hexToRgba(seriesB);
    if (rgba && isColorWithinTolerance(rgba, SERIES_B_REFERENCE, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [seriesB, onSuccess]);

  const SeriesRow = ({ 
    label, 
    value, 
    onChange, 
    reference, 
    testId 
  }: { 
    label: string; 
    value: string; 
    onChange: (v: string) => void; 
    reference: RGBA;
    testId: string;
  }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <ColorInput
        label={label}
        value={value}
        onChange={onChange}
        format="hex"
        swatches={DENSE_SWATCHES}
        swatchesPerRow={10}
        disallowInput
        withPicker
        size="xs"
        style={{ flex: 1 }}
        data-testid={testId}
      />
      <div style={{ paddingTop: 22 }}>
        <Text size="xs" c="dimmed" mb={4}>Ref</Text>
        <div 
          data-testid={testId === 'series-b-color' ? 'series-b-reference-swatch' : undefined}
          style={{ 
            width: 20, 
            height: 20, 
            backgroundColor: `rgb(${reference.r}, ${reference.g}, ${reference.b})`,
            borderRadius: 3,
            border: '1px solid #dee2e6',
          }} 
        />
      </div>
    </div>
  );

  return (
    <div style={{ width: 600 }}>
      {/* Filters */}
      <Group mb="md" gap="sm">
        <Select
          size="xs"
          value={period}
          onChange={setPeriod}
          data={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
          ]}
          style={{ width: 120 }}
        />
        <Button size="xs" variant="light">Export</Button>
        <Button size="xs" variant="light">Refresh</Button>
      </Group>
      
      {/* KPI Cards */}
      <SimpleGrid cols={3} mb="md" spacing="sm">
        <Card padding="xs" shadow="xs" withBorder>
          <Text size="xs" c="dimmed">Total Revenue</Text>
          <Text fw={600}>$45,231</Text>
        </Card>
        <Card padding="xs" shadow="xs" withBorder>
          <Text size="xs" c="dimmed">Active Users</Text>
          <Text fw={600}>1,234</Text>
        </Card>
        <Card padding="xs" shadow="xs" withBorder>
          <Text size="xs" c="dimmed">Conversion</Text>
          <Text fw={600}>3.2%</Text>
        </Card>
      </SimpleGrid>
      
      {/* Series Colors Panel */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={600} size="md" mb="sm">Series colors</Text>
        <Text size="xs" c="dimmed" mb="md">Analytics dashboard → Series colors (set Series B)</Text>
        
        <Stack gap="sm">
          <SeriesRow 
            label="Series A color" 
            value={seriesA} 
            onChange={setSeriesA} 
            reference={{ r: 250, g: 82, b: 82, a: 1 }}
            testId="series-a-color"
          />
          <SeriesRow 
            label="Series B color" 
            value={seriesB} 
            onChange={setSeriesB} 
            reference={SERIES_B_REFERENCE}
            testId="series-b-color"
          />
          <SeriesRow 
            label="Series C color" 
            value={seriesC} 
            onChange={setSeriesC} 
            reference={{ r: 64, g: 192, b: 87, a: 1 }}
            testId="series-c-color"
          />
        </Stack>
        
        <Text size="xs" c="dimmed" mt="md">
          Set Series B to match its reference swatch.
        </Text>
      </Card>
    </div>
  );
}
