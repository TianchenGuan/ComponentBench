'use client';

/**
 * menu_button-mantine-T06: Select visible metrics Revenue, Churn, ARPU
 * 
 * Layout: settings_panel centered titled "Dashboard metrics".
 * There is one menu button labeled "Visible metrics (1 selected)".
 * Opening the menu shows a list of metric items with check indicators:
 * "Revenue", "Churn", "ARPU", "Sessions", "Conversions".
 * 
 * Multiple items can be toggled without closing the dropdown.
 * Initial state: only "Sessions" is selected.
 * Clutter (medium): the panel includes unrelated toggles and a color scheme select.
 * 
 * Success: The selected metrics set is exactly {Revenue, Churn, ARPU}.
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Menu, Text, Stack, Switch, Select, Checkbox } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const allMetrics = ['Revenue', 'Churn', 'ARPU', 'Sessions', 'Conversions'];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Sessions']);
  const [opened, setOpened] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    const isExactMatch =
      selectedMetrics.length === 3 &&
      selectedMetrics.includes('Revenue') &&
      selectedMetrics.includes('Churn') &&
      selectedMetrics.includes('ARPU');
    
    if (isExactMatch && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedMetrics, successTriggered, onSuccess]);

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      } else {
        return [...prev, metric];
      }
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Dashboard metrics</Text>
      
      <Stack gap="md">
        <div>
          <Text size="sm" c="dimmed" mb={4}>Visible metrics</Text>
          <Menu opened={opened} onChange={setOpened}>
            <Menu.Target>
              <Button
                variant="default"
                rightSection={<IconChevronDown size={16} />}
                data-testid="menu-button-visible-metrics"
                fullWidth
                styles={{ inner: { justifyContent: 'space-between' } }}
              >
                Visible metrics ({selectedMetrics.length} selected)
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {allMetrics.map(metric => (
                <Menu.Item
                  key={metric}
                  onClick={() => toggleMetric(metric)}
                  rightSection={
                    <Checkbox
                      checked={selectedMetrics.includes(metric)}
                      onChange={() => {}}
                      size="xs"
                      style={{ pointerEvents: 'none' }}
                    />
                  }
                >
                  {metric}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>

        {/* Clutter: unrelated controls */}
        <Switch label="Auto-refresh data" size="sm" />
        <Switch label="Show trend lines" size="sm" />
        <Select
          label="Color scheme"
          placeholder="Select scheme"
          data={['Default', 'Colorful', 'Monochrome']}
          size="sm"
          disabled
        />
      </Stack>
    </Card>
  );
}
