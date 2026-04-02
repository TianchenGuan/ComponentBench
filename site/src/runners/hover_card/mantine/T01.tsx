'use client';

/**
 * hover_card-mantine-T01: Open profile hover card (Mantine HoverCard)
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * The card shows a single user avatar with the label "Maria Gomez".
 * - The avatar is the HoverCard.Target.
 * - On hover, Mantine HoverCard.Dropdown appears as a small profile card with name, handle, and follower counts.
 *
 * Instances: 1 hover card.
 * Initial state: closed.
 * No other interactive UI is present.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Avatar, Group, Stack, HoverCard } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">User Profile</Text>
      <Group>
        <HoverCard 
          width={280} 
          shadow="md" 
          withArrow
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
        >
          <HoverCard.Target>
            <Group 
              style={{ cursor: 'pointer' }}
              data-testid="maria-gomez-trigger"
              data-cb-instance="Maria Gomez"
            >
              <Avatar 
                size="lg" 
                radius="xl" 
                color="violet"
              >
                MG
              </Avatar>
              <Text c="blue" fw={500}>Maria Gomez</Text>
            </Group>
          </HoverCard.Target>
          <HoverCard.Dropdown data-testid="hover-card-content" data-cb-instance="Maria Gomez">
            <Group>
              <Avatar size="lg" radius="xl" color="violet">MG</Avatar>
              <Stack gap={4}>
                <Text size="sm" fw={700}>Maria Gomez</Text>
                <Text size="xs" c="dimmed">@mariagomez</Text>
              </Stack>
            </Group>
            <Text size="sm" mt="md">
              Product designer with 5+ years of experience in UX/UI design.
            </Text>
            <Group mt="md" gap="xl">
              <div>
                <Text size="sm" fw={600}>1,234</Text>
                <Text size="xs" c="dimmed">Followers</Text>
              </div>
              <div>
                <Text size="sm" fw={600}>567</Text>
                <Text size="xs" c="dimmed">Following</Text>
              </div>
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    </Card>
  );
}
