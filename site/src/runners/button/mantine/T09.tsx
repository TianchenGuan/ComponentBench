'use client';

/**
 * button-mantine-T09: Remove member with inline confirmation (dark theme)
 * 
 * Dark theme member card with trash ActionIcon.
 * Clicking opens confirmation Popover with Cancel and Remove buttons.
 * Task: Click trash then "Remove" in the popover.
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Popover, Button, Group, Avatar } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [removed, setRemoved] = useState(false);

  const handleRemove = () => {
    setRemoved(true);
    setPopoverOpened(false);
    onSuccess();
  };

  const handleCancel = () => {
    setPopoverOpened(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Team member
      </Text>
      
      {removed ? (
        <Text c="green">Member removed</Text>
      ) : (
        <Group justify="space-between" align="center">
          <Group>
            <Avatar color="blue" radius="xl">JD</Avatar>
            <div>
              <Text size="sm" fw={500}>Jane Doe</Text>
              <Text size="xs" c="dimmed">Senior Developer</Text>
            </div>
          </Group>
          <Popover
            opened={popoverOpened}
            onChange={setPopoverOpened}
            position="bottom-end"
            withArrow
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => setPopoverOpened(true)}
                aria-label="Remove member"
                data-testid="mantine-actionicon-remove"
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="sm" mb="sm">Remove this member?</Text>
              <Group gap="xs">
                <Button
                  size="xs"
                  variant="default"
                  onClick={handleCancel}
                  data-testid="mantine-btn-cancel-remove"
                >
                  Cancel
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={handleRemove}
                  data-testid="mantine-btn-confirm-remove"
                >
                  Remove
                </Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      )}
    </Card>
  );
}
