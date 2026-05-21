'use client';

/**
 * drawer-mantine-T07: Open the drawer that matches an avatar+label reference (2 instances)
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * At the top of the card:
 * - A "Target preview" tile shows:
 *   - a small circular avatar image (e.g., initials in a circle), and
 *   - a text label (e.g., "Team")
 *
 * Below the preview are two small Mantine ActionIcon triggers (icon-only, same size):
 * 1) Trigger A opens Drawer A with header avatar+label "Team"
 * 2) Trigger B opens Drawer B with header avatar+label "Project"
 *
 * Both drawers:
 * - Open from the right with an overlay.
 * - Use the same base title text "Panel", but the header includes the avatar and label as the primary identifier.
 *
 * Initial state:
 * - Both drawers are CLOSED.
 *
 * Feedback:
 * - When a drawer opens, its header shows the avatar + label, which should be compared to the Target preview.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Drawer, Stack, Box, Group, ActionIcon, Avatar } from '@mantine/core';
import { IconUsers, IconFolder } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

type DrawerType = 'team' | 'project' | null;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const successCalledRef = useRef(false);

  // Target is the Team drawer (Drawer A)
  useEffect(() => {
    if (openDrawer === 'team' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openDrawer, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Stack gap="lg" align="center">
        {/* Target preview */}
        <Box
          style={{
            border: '1px dashed #ccc',
            padding: 16,
            borderRadius: 4,
            textAlign: 'center',
          }}
          data-testid="target-preview"
        >
          <Text size="xs" c="dimmed" mb="xs">
            Target preview
          </Text>
          <Group gap="xs" justify="center">
            <Avatar color="blue" radius="xl" size="sm">T</Avatar>
            <Text size="sm" fw={500}>Team</Text>
          </Group>
        </Box>

        {/* ActionIcon triggers */}
        <Group>
          <ActionIcon
            variant="outline"
            size="lg"
            onClick={() => setOpenDrawer('team')}
            data-testid="open-team"
          >
            <IconUsers size={20} />
          </ActionIcon>
          <ActionIcon
            variant="outline"
            size="lg"
            onClick={() => setOpenDrawer('project')}
            data-testid="open-project"
          >
            <IconFolder size={20} />
          </ActionIcon>
        </Group>
      </Stack>

      {/* Team Drawer */}
      <Drawer
        opened={openDrawer === 'team'}
        onClose={() => setOpenDrawer(null)}
        title={
          <Group gap="xs">
            <Avatar color="blue" radius="xl" size="sm">T</Avatar>
            <Text size="sm" fw={500}>Team</Text>
          </Group>
        }
        position="right"
        data-testid="drawer-team"
      >
        <Text size="sm">Team management panel content.</Text>
      </Drawer>

      {/* Project Drawer */}
      <Drawer
        opened={openDrawer === 'project'}
        onClose={() => setOpenDrawer(null)}
        title={
          <Group gap="xs">
            <Avatar color="green" radius="xl" size="sm">P</Avatar>
            <Text size="sm" fw={500}>Project</Text>
          </Group>
        }
        position="right"
        data-testid="drawer-project"
      >
        <Text size="sm">Project management panel content.</Text>
      </Drawer>
    </Card>
  );
}
