'use client';

/**
 * link-mantine-T10: Open API Status from a resources popover using a reference icon
 * 
 * setup_description:
 * A modal_flow scene shows a small card titled "Developer Resources" centered in the
 * viewport. At the top of the card, a reference icon is displayed: a heartbeat line glyph.
 * Below it is a Mantine Anchor labeled "More resources" that opens a popover menu.
 * 
 * When the popover is open, it lists five Anchor links, each with a left icon and a text label:
 * - API Status (heartbeat line icon) <- target
 * - System Status (signal bars icon)
 * - Rate limits (gauge icon)
 * - SDK download (download icon)
 * - Changelog (list icon)
 * 
 * Two options include the word "Status"; the instruction requires using the reference icon
 * to choose the correct one.
 * 
 * success_trigger:
 * - The "API Status" link inside the resources popover (data-testid="resource-api-status") was activated.
 * - The current route pathname equals "/api/status".
 * - The page/card title reads "API Status".
 */

import React, { useState } from 'react';
import { Card, Text, Anchor, Popover, Box, Group } from '@mantine/core';
import { IconHeartbeat, IconActivity, IconGauge, IconDownload, IconList } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ResourceLink {
  key: string;
  label: string;
  icon: React.ReactNode;
  iconId: string;
  path: string;
  testId: string;
}

const resourceLinks: ResourceLink[] = [
  { key: 'api-status', label: 'API Status', icon: <IconHeartbeat size={16} />, iconId: 'heartbeat', path: '/api/status', testId: 'resource-api-status' },
  { key: 'system-status', label: 'System Status', icon: <IconActivity size={16} />, iconId: 'activity', path: '/system/status', testId: 'resource-system-status' },
  { key: 'rate-limits', label: 'Rate limits', icon: <IconGauge size={16} />, iconId: 'gauge', path: '/api/rate-limits', testId: 'resource-rate-limits' },
  { key: 'sdk-download', label: 'SDK download', icon: <IconDownload size={16} />, iconId: 'download', path: '/sdk', testId: 'resource-sdk-download' },
  { key: 'changelog', label: 'Changelog', icon: <IconList size={16} />, iconId: 'list', path: '/changelog', testId: 'resource-changelog' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [route, setRoute] = useState('/resources');
  const [activated, setActivated] = useState(false);

  const handleResourceClick = (link: ResourceLink) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setOpened(false);
    setRoute(link.path);
    
    if (link.key === 'api-status') {
      setActivated(true);
      onSuccess();
    }
  };

  const isOnApiStatus = route === '/api/status';

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={500} size="lg" mb="md">
        {isOnApiStatus ? 'API Status' : 'Developer Resources'}
      </Text>
      
      {/* Reference Icon */}
      <Box mb="md">
        <Text size="sm" c="dimmed" mb="xs">Reference icon:</Text>
        <Box 
          p="sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'var(--mantine-color-gray-1)',
            borderRadius: 4,
            border: '1px dashed var(--mantine-color-gray-4)',
          }}
          data-reference-icon="heartbeat"
        >
          <IconHeartbeat size={20} />
          <Text size="sm">(heartbeat line)</Text>
        </Box>
      </Box>

      <Text size="sm" c="dimmed" mb="md">
        Open resources and select the matching icon:
      </Text>
      
      <Popover 
        opened={opened} 
        onChange={setOpened}
        position="bottom"
        withArrow
      >
        <Popover.Target>
          <Anchor
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setOpened((o) => !o);
            }}
            data-testid="link-more-resources"
            aria-expanded={opened}
            aria-haspopup="menu"
          >
            More resources
          </Anchor>
        </Popover.Target>
        <Popover.Dropdown>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 180 }}>
            {resourceLinks.map((link) => (
              <Anchor
                key={link.key}
                href={link.path}
                onClick={handleResourceClick(link)}
                data-testid={link.testId}
                data-icon={link.iconId}
              >
                <Group gap="xs">
                  {link.icon}
                  {link.label}
                </Group>
              </Anchor>
            ))}
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
