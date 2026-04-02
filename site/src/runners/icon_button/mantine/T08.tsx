'use client';

/**
 * icon_button-mantine-T08: Open info popover (dark + small ActionIcon)
 *
 * Layout: isolated_card centered in the viewport; dark theme.
 * A dark-themed card titled "Info" contains a small Mantine ActionIcon with an "i" icon.
 * 
 * Success: The Info ActionIcon indicates its popover is open (aria-expanded="true").
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Box, Popover } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Info
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Click the info button to learn more about this feature.
      </Text>
      <Popover opened={opened} onChange={setOpened} position="bottom" withArrow>
        <Popover.Target>
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={handleOpen}
            aria-label="Info"
            aria-expanded={opened}
            data-cb-overlay-open={opened ? 'true' : 'false'}
            data-testid="mantine-action-icon-info"
          >
            <IconInfoCircle size={16} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Box p="xs" style={{ maxWidth: 200 }}>
            <Text size="sm">
              This is additional information about the feature you&apos;re using.
            </Text>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
