'use client';

/**
 * checkbox-mantine-T10: Match dashboard preview for Alerts panel (visual + multiple instances)
 *
 * Layout: dashboard scene with a left "Widgets" sidebar and a main "Dashboard Preview" area.
 * The sidebar contains three Mantine Checkbox toggles (three instances on the page):
 *   - "Sales chart" (initially checked)
 *   - "Inventory table" (initially checked)
 *   - "Alerts panel" (initially unchecked)  ← target
 * The main area shows a non-interactive dashboard preview. In the preview, an "Alerts" card IS visible, indicating the Alerts panel should be enabled.
 * The preview is the authoritative reference; the instruction does not explicitly say "check/uncheck".
 * No Save/Apply button exists; toggling commits immediately.
 * Clutter: the dashboard layout includes additional non-interactive tiles and labels.
 */

import React, { useState } from 'react';
import { Card, Text, Checkbox, Stack, Group, Box, Paper } from '@mantine/core';
import { IconChartBar, IconTable, IconBell } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [salesChart, setSalesChart] = useState(true);
  const [inventoryTable, setInventoryTable] = useState(true);
  const [alertsPanel, setAlertsPanel] = useState(false);

  const handleAlertsPanelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.currentTarget.checked;
    setAlertsPanel(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }}>
      <Text fw={600} size="lg" mb="md">
        Dashboard Configuration
      </Text>
      
      <Group align="flex-start" gap="xl">
        {/* Widgets sidebar */}
        <Paper p="md" withBorder style={{ width: 200 }}>
          <Text fw={500} size="sm" mb="md">
            Widgets
          </Text>
          <Stack gap="sm">
            <Checkbox
              checked={salesChart}
              onChange={(e) => setSalesChart(e.currentTarget.checked)}
              label="Sales chart"
              data-testid="cb-sales-chart"
            />
            <Checkbox
              checked={inventoryTable}
              onChange={(e) => setInventoryTable(e.currentTarget.checked)}
              label="Inventory table"
              data-testid="cb-inventory-table"
            />
            <Checkbox
              checked={alertsPanel}
              onChange={handleAlertsPanelChange}
              label="Alerts panel"
              data-testid="cb-alerts-panel"
            />
          </Stack>
        </Paper>

        {/* Dashboard Preview */}
        <Paper 
          p="md" 
          withBorder 
          style={{ flex: 1, minHeight: 300, background: '#f8f9fa' }}
          data-ref="alerts-visible"
        >
          <Text fw={500} size="sm" mb="md" c="dimmed">
            Dashboard Preview
          </Text>
          
          <Group gap="md" align="flex-start">
            {/* Sales chart tile */}
            <Box 
              p="sm" 
              style={{ 
                background: '#fff', 
                borderRadius: 8, 
                border: '1px solid #e9ecef',
                width: 150,
              }}
            >
              <Group gap="xs" mb="xs">
                <IconChartBar size={16} color="#666" />
                <Text size="xs" c="dimmed">Sales</Text>
              </Group>
              <Box style={{ height: 60, background: '#f1f3f5', borderRadius: 4 }} />
            </Box>

            {/* Inventory table tile */}
            <Box 
              p="sm" 
              style={{ 
                background: '#fff', 
                borderRadius: 8, 
                border: '1px solid #e9ecef',
                width: 150,
              }}
            >
              <Group gap="xs" mb="xs">
                <IconTable size={16} color="#666" />
                <Text size="xs" c="dimmed">Inventory</Text>
              </Group>
              <Box style={{ height: 60, background: '#f1f3f5', borderRadius: 4 }} />
            </Box>

            {/* Alerts tile - showing that it SHOULD be visible */}
            <Box 
              p="sm" 
              style={{ 
                background: '#fff', 
                borderRadius: 8, 
                border: '2px solid #339af0',
                width: 150,
              }}
            >
              <Group gap="xs" mb="xs">
                <IconBell size={16} color="#339af0" />
                <Text size="xs" c="blue">Alerts</Text>
              </Group>
              <Box style={{ height: 60, background: '#e7f5ff', borderRadius: 4 }} />
            </Box>
          </Group>
        </Paper>
      </Group>
    </Card>
  );
}
