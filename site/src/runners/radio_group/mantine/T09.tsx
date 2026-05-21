'use client';

/**
 * radio_group-mantine-T09: Dashboard: set Sales chart interval to Quarterly (3 similar widgets)
 *
 * A dashboard layout shows three cards in a grid: "Sales chart", "Inventory chart", and "Traffic chart". Each card contains a small chart preview and a Mantine Radio.Group labeled "Interval".
 * All three Interval groups use the same four options and appear visually identical:
 * - Daily
 * - Weekly
 * - Monthly
 * - Quarterly
 * Initial state:
 * - Sales chart: Monthly
 * - Inventory chart: Weekly
 * - Traffic chart: Daily
 * Each card also has distractor controls (a "Refresh" icon button and a non-functional "Download CSV" link) that are not required.
 * Selecting an interval updates only that card's chart preview immediately (no Save button). The main challenge is picking the correct instance (Sales chart) among similar widgets.
 *
 * Success: For the instance labeled "Sales chart — Interval", the selected value equals "quarterly" (label "Quarterly").
 */

import React, { useState } from 'react';
import { Card, Text, Radio, Group, Stack, ActionIcon, Anchor, Box, SimpleGrid } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const intervalOptions = ['daily', 'weekly', 'monthly', 'quarterly'];

interface ChartCardProps {
  title: string;
  interval: string;
  onIntervalChange: (value: string) => void;
}

function ChartCard({ title, interval, onIntervalChange }: ChartCardProps) {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder data-card={title.toLowerCase().replace(' ', '-')}>
      <Group justify="space-between" mb="sm">
        <Text fw={600} size="sm">{title}</Text>
        <Group gap="xs">
          <ActionIcon variant="subtle" size="sm">🔄</ActionIcon>
          <Anchor size="xs" c="dimmed">Download CSV</Anchor>
        </Group>
      </Group>

      {/* Chart preview placeholder */}
      <Box style={{ 
        height: 60, 
        background: '#f8f9fa', 
        borderRadius: 4, 
        marginBottom: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text size="xs" c="dimmed">{title} ({interval})</Text>
      </Box>

      <div data-instance-label={`${title} — Interval`}>
        <Radio.Group
          data-canonical-type="radio_group"
          data-selected-value={interval}
          value={interval}
          onChange={onIntervalChange}
          label="Interval"
          size="xs"
        >
          <Group gap="xs" mt="xs">
            {intervalOptions.map(opt => (
              <Radio 
                key={opt} 
                value={opt} 
                label={opt.charAt(0).toUpperCase() + opt.slice(1)} 
                size="xs"
              />
            ))}
          </Group>
        </Radio.Group>
      </div>
    </Card>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [intervals, setIntervals] = useState({
    sales: 'monthly',
    inventory: 'weekly',
    traffic: 'daily',
  });

  const handleIntervalChange = (chart: 'sales' | 'inventory' | 'traffic', value: string) => {
    setIntervals(prev => ({ ...prev, [chart]: value }));
    if (chart === 'sales' && value === 'quarterly') {
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">Dashboard</Text>
      <SimpleGrid cols={3} spacing="md">
        <ChartCard 
          title="Sales chart" 
          interval={intervals.sales}
          onIntervalChange={(v) => handleIntervalChange('sales', v)}
        />
        <ChartCard 
          title="Inventory chart" 
          interval={intervals.inventory}
          onIntervalChange={(v) => handleIntervalChange('inventory', v)}
        />
        <ChartCard 
          title="Traffic chart" 
          interval={intervals.traffic}
          onIntervalChange={(v) => handleIntervalChange('traffic', v)}
        />
      </SimpleGrid>
    </Box>
  );
}
