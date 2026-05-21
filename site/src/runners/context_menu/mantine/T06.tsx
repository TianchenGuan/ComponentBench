'use client';

/**
 * context_menu-mantine-T06: Dashboard menu: scroll to Download as PDF
 *
 * Scene: theme=light, spacing=comfortable, layout=dashboard, placement=center, scale=default, instances=1, clutter=medium.
 *
 * Layout: A dashboard grid is rendered near the center of the viewport.
 *
 * Target element: a widget card titled "Monthly report". Right-clicking on the widget opens
 * a custom context menu.
 *
 * Context menu: composed from Mantine Menu and positioned at cursor coordinates.
 * The menu has a fixed max height and becomes scrollable.
 *
 * Menu items: about 20 actions. The target item "Download as PDF" appears near the bottom
 * and requires scrolling within the menu overlay.
 *
 * Distractors/clutter: Other widgets and a sidebar are present.
 *
 * Success: The activated item path equals ['Download as PDF'] for the Monthly report context menu.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, SimpleGrid, Box, Stack } from '@mantine/core';
import { IconChartBar, IconChartLine, IconBell } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const menuItems = [
  'Refresh',
  'Refresh automatically',
  'divider',
  'Change timeframe',
  'Set date range',
  'Compare periods',
  'divider',
  'Edit widget',
  'Duplicate',
  'Move up',
  'Move down',
  'divider',
  'Export data',
  'Export as CSV',
  'Export as Excel',
  'Download as image',
  'Download as PDF',
  'divider',
  'Share widget',
  'Remove widget',
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Download as PDF' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleItemClick = (item: string) => {
    setLastActivatedItem(item);
    setMenuOpen(false);
  };

  return (
    <Box p="md">
      <Text size="xl" fw={600} mb="md">Dashboard</Text>

      <Box style={{ display: 'flex', gap: 16 }}>
        {/* Sidebar (clutter) */}
        <Paper shadow="xs" p="sm" style={{ width: 150 }}>
          <Stack gap="xs">
            <Text size="xs" c="dimmed" fw={500}>Navigation</Text>
            <Text size="sm">Overview</Text>
            <Text size="sm">Reports</Text>
            <Text size="sm">Settings</Text>
          </Stack>
        </Paper>

        {/* Main grid */}
        <SimpleGrid cols={2} spacing="md" style={{ flex: 1 }}>
          {/* Monthly report - has context menu */}
          <Menu
            opened={menuOpen}
            onChange={setMenuOpen}
            position="bottom-start"
          >
            <Menu.Target>
              <Paper
                shadow="sm"
                p="md"
                onContextMenu={handleContextMenu}
                style={{ cursor: 'context-menu' }}
                data-testid="widget-monthly-report"
                data-last-activated={lastActivatedItem}
              >
                <Text size="xs" c="dimmed" mb="xs">Monthly report</Text>
                <Box
                  style={{
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--mantine-color-gray-1)',
                    borderRadius: 4,
                  }}
                >
                  <IconChartBar size={40} color="var(--mantine-color-blue-5)" opacity={0.5} />
                </Box>
                <Text size="lg" fw={600} ta="center" mt="xs">$47,200</Text>
              </Paper>
            </Menu.Target>

            <Menu.Dropdown style={{ maxHeight: 300, overflowY: 'auto' }} data-testid="context-menu-overlay">
              {menuItems.map((item, index) =>
                item === 'divider' ? (
                  <Menu.Divider key={`divider-${index}`} />
                ) : (
                  <Menu.Item key={item} onClick={() => handleItemClick(item)}>
                    {item}
                  </Menu.Item>
                )
              )}
            </Menu.Dropdown>
          </Menu>

          {/* Traffic widget (no context menu) */}
          <Paper shadow="sm" p="md">
            <Text size="xs" c="dimmed" mb="xs">Traffic</Text>
            <Box
              style={{
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 4,
              }}
            >
              <IconChartLine size={40} color="var(--mantine-color-green-5)" opacity={0.5} />
            </Box>
            <Text size="lg" fw={600} ta="center" mt="xs">8.4K visits</Text>
          </Paper>

          {/* Alerts widget (no context menu) */}
          <Paper shadow="sm" p="md">
            <Text size="xs" c="dimmed" mb="xs">Alerts</Text>
            <Box
              style={{
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 4,
              }}
            >
              <IconBell size={40} color="var(--mantine-color-orange-5)" opacity={0.5} />
            </Box>
            <Text size="lg" fw={600} ta="center" mt="xs">5 active</Text>
          </Paper>
        </SimpleGrid>
      </Box>

      <Text size="xs" c="dimmed" mt="md">
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </Text>
    </Box>
  );
}
