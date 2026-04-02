'use client';

/**
 * menu-mantine-T07: Scroll a long Mantine menu to select Audit log
 * 
 * Scene: theme=light, spacing=compact, layout=dashboard, placement=bottom_right, scale=small, instances=1.
 *
 * Component:
 * - A Mantine Menu triggered by a small button labeled "Activity".
 * - The dropdown has a fixed max-height and becomes internally scrollable.
 *
 * Menu items:
 * - A long list (~25 items), e.g., Overview, Recent events, Access history, Audit settings, …
 * - The target item "Audit log" is near the bottom of the list and not visible without scrolling.
 * - A similarly named distractor "Audit settings" appears earlier.
 *
 * Initial state:
 * - Menu is closed.
 * - Status line below reads "Activity view: Overview".
 *
 * Success: The selected Activity menu item is "Audit log".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, Group, Box, ScrollArea } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const activityItems = [
  'Overview',
  'Recent events',
  'Access history',
  'Audit settings',
  'User activity',
  'Login attempts',
  'API calls',
  'Error logs',
  'System events',
  'Notifications',
  'Alerts',
  'Reports',
  'Export history',
  'Import history',
  'Data changes',
  'Permission changes',
  'Role assignments',
  'Team activity',
  'Project activity',
  'File uploads',
  'File downloads',
  'Scheduled tasks',
  'Background jobs',
  'Webhooks',
  'Audit log',  // Target - near bottom
  'Archive',
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedItem, setSelectedItem] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedItem === 'Audit log' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedItem, successTriggered, onSuccess]);

  return (
    <Group gap="md" align="flex-start" style={{ maxWidth: 700 }}>
      {/* Dashboard clutter cards */}
      <Paper shadow="xs" p="sm" radius="sm" style={{ width: 140, height: 90 }}>
        <Text size="xs" c="dimmed">Active Users</Text>
        <Text size="xl" fw={700} c="blue" mt="xs">1,247</Text>
        <Text size="xs" c="green">+5.2%</Text>
      </Paper>
      <Paper shadow="xs" p="sm" radius="sm" style={{ width: 140, height: 90 }}>
        <Text size="xs" c="dimmed">Requests/min</Text>
        <Text size="xl" fw={700} c="violet" mt="xs">842</Text>
        <Text size="xs" c="green">+12%</Text>
      </Paper>
      <Paper shadow="xs" p="sm" radius="sm" style={{ width: 140, height: 90 }}>
        <Text size="xs" c="dimmed">Error Rate</Text>
        <Text size="xl" fw={700} c="orange" mt="xs">0.2%</Text>
        <Text size="xs" c="red">+0.05%</Text>
      </Paper>

      {/* Activity Menu Card - target component */}
      <Paper shadow="sm" p="sm" radius="sm" style={{ width: 200 }}>
        <Text size="xs" fw={500} mb="xs">Activity</Text>
        
        <Menu shadow="md" width={180}>
          <Menu.Target>
            <Button
              size="xs"
              variant="outline"
              rightSection={<IconChevronDown size={12} />}
              data-testid="menu-button-activity"
            >
              Activity
            </Button>
          </Menu.Target>

          <Menu.Dropdown data-testid="menu-activity">
            <ScrollArea h={180} data-testid="activity-menu-scroll">
              {activityItems.map((item) => (
                <Menu.Item
                  key={item}
                  onClick={() => setSelectedItem(item)}
                  style={{ fontSize: '0.75rem' }}
                  data-testid={`menu-item-${item.toLowerCase().replace(/ /g, '-')}`}
                >
                  {item}
                </Menu.Item>
              ))}
            </ScrollArea>
          </Menu.Dropdown>
        </Menu>

        <Text size="xs" c="dimmed" mt="sm" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          Activity view: <strong data-testid="activity-view">{selectedItem}</strong>
        </Text>
      </Paper>
    </Group>
  );
}
